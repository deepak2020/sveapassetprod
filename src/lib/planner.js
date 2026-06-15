// The study-planner "brain": pure, deterministic functions over the user's
// quiz history and spaced-repetition state. No I/O — easy to unit-test and
// reuse from the dashboard, the SRS hooks, and (later) the daily-plan builder.

export const SKILLS = [
  { key: "vocabulary", label: "Vocabulary", emoji: "📚" },
  { key: "reading",    label: "Reading",    emoji: "📖" },
  { key: "listening",  label: "Listening",  emoji: "🎧" },
  { key: "grammar",    label: "Grammar",    emoji: "🔤" },
  { key: "writing",    label: "Writing",    emoji: "✍️" },
  { key: "speaking",   label: "Speaking",   emoji: "🗣️" },
];

const round2 = (n) => Math.round(n * 100) / 100;
const isoDate = (d) => d.toISOString().slice(0, 10);
const dateOf = (r) => new Date(r.created_date || r.created_at || r.at || 0).getTime();

// ── Mastery ────────────────────────────────────────────────────────────────
// Per-skill mastery from quiz history. Uses the last few attempts, then applies
// a light decay so a skill fades if it hasn't been practised in a while.
// Returns, per skill: { score, base, attempts, stale } or null when no data.
export function skillMastery(results = [], now = new Date()) {
  const out = {};
  for (const s of SKILLS) {
    const items = results.filter((r) => r.skill === s.key && typeof r.percentage === "number");
    if (items.length === 0) { out[s.key] = null; continue; }
    const recent = [...items].sort((a, b) => dateOf(b) - dateOf(a)).slice(0, 10);
    const base = recent.reduce((sum, r) => sum + r.percentage, 0) / recent.length;
    const idleDays = Math.max(0, (now.getTime() - dateOf(recent[0])) / 86_400_000);
    const decay = Math.min(15, Math.floor((idleDays / 30) * 15)); // up to -15 after a month idle
    out[s.key] = {
      base: Math.round(base),
      score: Math.max(0, Math.round(base - decay)),
      attempts: items.length,
      stale: decay > 0,
    };
  }
  return out;
}

// Skills that actually have data, weakest first.
export function weakestSkills(mastery = {}, n = 2) {
  return SKILLS
    .map((s) => ({ ...s, ...(mastery[s.key] || {}) }))
    .filter((s) => s.attempts > 0)
    .sort((a, b) => a.score - b.score)
    .slice(0, n);
}

// ── Readiness ───────────────────────────────────────────────────────────────
// Overall test-readiness 0–100 = average of known skill scores. Skills with no
// data count as 0 once the learner has started (so readiness reflects coverage,
// not just the skills they happen to have practised).
export function testReadiness(mastery = {}) {
  const known = SKILLS.map((s) => mastery[s.key]).filter(Boolean);
  if (known.length === 0) return 0;
  const sum = SKILLS.reduce((acc, s) => acc + (mastery[s.key]?.score ?? 0), 0);
  return Math.round(sum / SKILLS.length);
}

// ── Spaced repetition (SM-2) ────────────────────────────────────────────────
// Grade: "again" | "hard" | "good" | "easy". Returns the next review state.
const GRADE = { again: 0, hard: 1, good: 2, easy: 3 };
export function scheduleReview(item = {}, grade = "good", now = new Date()) {
  let { ease = 2.5, interval_days = 0, reps = 0, lapses = 0 } = item;
  const g = GRADE[grade] ?? 2;
  if (g === 0) {
    reps = 0; interval_days = 0; lapses += 1; ease = Math.max(1.3, ease - 0.2);
  } else {
    reps += 1;
    ease = Math.max(1.3, ease + (0.1 - (3 - g) * (0.08 + (3 - g) * 0.02)));
    if (reps === 1) interval_days = g === 3 ? 4 : 1;
    else if (reps === 2) interval_days = 6;
    else interval_days = Math.round(interval_days * ease);
    if (g === 1) interval_days = Math.max(1, Math.round(interval_days * 0.6));
  }
  const due = new Date(now);
  due.setDate(due.getDate() + interval_days);
  return { ease: round2(ease), interval_days, reps, lapses, last_result: grade, due_date: isoDate(due) };
}

export function dueReviews(items = [], now = new Date()) {
  const today = isoDate(now);
  return items.filter((it) => (it.due_date || today) <= today);
}

// ── Daily plan ──────────────────────────────────────────────────────────────
const TASK_MIN = { review: 5, lesson: 8, mistakes: 3, speaking: 4, writing: 3 };

const COURSE_RANK = { A: 0, B: 1, C: 2, D: 3 };

// Intelligently SELECT today's lessons from the whole available catalog, rather
// than reading a fixed pre-generated schedule. Priority: weakest skill first
// (lower mastery = higher priority; mastered skills sink), then foundation
// course first (A before B…), then lesson order. Skips completed lessons and,
// when focusSkills is given, restricts to those skills.
export function selectDailyLessons({ lessons = [], completedIds = [], focusSkills = [], mastery = {}, perDay = 3 } = {}) {
  const done = new Set(completedIds);
  const focus = new Set(focusSkills);
  const pool = lessons.filter((l) => {
    if (done.has(l.id)) return false;
    if (!(l.quiz_questions?.length || l.word_pairs?.length || l.content)) return false;
    const skill = l.skill || l.category;
    if (focus.size && !focus.has(skill)) return false;
    return true;
  });

  // Unknown skills (no attempts) get a medium priority so they still surface.
  const skillPriority = (skill) => (mastery[skill]?.attempts ? mastery[skill].score : 50);

  return pool
    .map((l) => ({
      lesson: l,
      s: skillPriority(l.skill || l.category),
      c: COURSE_RANK[l.sfi_course] ?? 9,
      o: l.order ?? 9999,
    }))
    .sort((a, b) => a.s - b.s || a.c - b.c || a.o - b.o)
    .slice(0, perDay)
    .map((x) => x.lesson);
}

// Sequence today's tasks from resolved facts, trimmed to the time budget.
// Keeps the review warm-up first; always tries to include speaking + writing
// (the skills the existing lesson-only plan under-trains).
export function buildDailyPlan({
  dueReviews = 0, weakest = null, lessons = [], prereqLesson = null, mistakes = 0, timeBudget = 20,
} = {}) {
  const tasks = [];
  if (dueReviews > 0) {
    tasks.push({ kind: "review", skill: "review", title: `Review ${dueReviews} due words`,
      detail: "Spaced repetition", minutes: Math.min(6, Math.max(2, Math.ceil(dueReviews / 3))) });
  }
  if (prereqLesson) {
    tasks.push({ kind: "lesson", skill: prereqLesson.skill, title: `Foundation — ${prereqLesson.title}`,
      detail: "Prerequisite for today", minutes: TASK_MIN.lesson, lessonId: prereqLesson.id });
  }
  for (const l of lessons) {
    const weak = weakest && (l.skill === weakest.key);
    tasks.push({ kind: "lesson", skill: l.skill, title: `Lesson — ${l.title}`,
      detail: weak ? "Your weakest skill" : "From your study plan", minutes: TASK_MIN.lesson, lessonId: l.id });
  }
  if (mistakes > 0) {
    tasks.push({ kind: "mistakes", skill: "mixed", title: `Fix ${mistakes} past mistake${mistakes > 1 ? "s" : ""}`,
      detail: "Items you missed recently", minutes: TASK_MIN.mistakes });
  }
  tasks.push({ kind: "speaking", skill: "speaking", title: "Shadow 5 phrases", detail: "Listen & repeat", minutes: TASK_MIN.speaking });
  tasks.push({ kind: "writing", skill: "writing", title: "Write 2 sentences", detail: "Use today's words", minutes: TASK_MIN.writing });

  const out = [];
  let used = 0;
  for (const t of tasks) {
    if (used + t.minutes > timeBudget && out.length > 0) break;
    out.push(t); used += t.minutes;
  }
  return { tasks: out, totalMinutes: used };
}
