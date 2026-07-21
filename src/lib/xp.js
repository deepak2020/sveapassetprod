// XP thresholds and level definitions
export const LEVELS = [
  { name: "Nybörjare", min: 0, max: 499, color: "text-slate-500" },
  { name: "Elev", min: 500, max: 1499, color: "text-blue-500" },
  { name: "Student", min: 1500, max: 2999, color: "text-violet-500" },
  { name: "Avancerad", min: 3000, max: 5999, color: "text-amber-500" },
  { name: "Medborgare", min: 6000, max: Infinity, color: "text-emerald-500" },
];

export const XP_REWARDS = {
  learn_complete: 5,
  practice_pass: 15,
  produce_complete: 30,
  cloze_correct: 15,
  cloze_wrong: 5,
  flashcard_good: 10,
  flashcard_hard: 5,
  quiz_correct: 20,
  match_correct: 10,
  translate_correct: 15,
  translate_wrong: 5,
  listen_correct: 15,
  listen_wrong: 5,
  writing_submitted: 20,
  speaking_attempted: 5,
  daily_goal_met: 25,
  streak_7days: 50,
  daily_review_bonus: 50,
  mission_complete: 75,
};

export function getLevel(xp) {
  return LEVELS.find(l => xp >= l.min && xp <= l.max) || LEVELS[0];
}

export function getLevelProgress(xp) {
  const level = getLevel(xp);
  if (level.max === Infinity) return { level, progress: 100, xpInLevel: xp - level.min, xpNeeded: 0 };
  const xpInLevel = xp - level.min;
  const xpNeeded = level.max - level.min + 1;
  return { level, progress: Math.round((xpInLevel / xpNeeded) * 100), xpInLevel, xpNeeded };
}

export function getNextLevel(xp) {
  const idx = LEVELS.findIndex(l => xp >= l.min && xp <= l.max);
  return LEVELS[idx + 1] || null;
}

const STREAK_MILESTONES = [7, 30, 100];

function dispatchXP(amount, label) {
  if (amount > 0) {
    window.dispatchEvent(new CustomEvent("xp-awarded", { detail: { amount, label } }));
  }
}

// Call this after any activity to award XP and update streak
export async function awardXP(base44, xpAmount, label) {
  const user = await base44.auth.me();
  if (!user) return;

  const today = new Date().toISOString().split("T")[0];
  const lastActive = user.last_active_date;

  let newStreak = user.streak_days || 0;
  let bonusXP = 0;
  let milestoneReached = null;

  if (lastActive !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    if (lastActive === yesterdayStr) {
      newStreak += 1;
    } else {
      newStreak = 1;
    }

    if (STREAK_MILESTONES.includes(newStreak)) {
      bonusXP += XP_REWARDS.streak_7days;
      milestoneReached = newStreak;
    }
  }

  const newXP = (user.xp_total || 0) + xpAmount + bonusXP;

  await base44.auth.updateMe({
    xp_total: newXP,
    streak_days: newStreak,
    last_active_date: today,
  });

  // Dispatch XP toast events after DB update
  if (xpAmount > 0) dispatchXP(xpAmount, label);
  if (bonusXP > 0) {
    setTimeout(() => dispatchXP(bonusXP, `🔥 ${milestoneReached}-day streak!`), 600);
  }
  if (milestoneReached) {
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent("streak-milestone", { detail: { streak: milestoneReached, bonusXP } }));
    }, 800);
  }

  return { newXP, newStreak, bonusXP, milestoneReached };
}

// Self-healing streak repair: recalculates streak from QuizResult history
// Runs once per session; only fixes streak if it shows as 1 (the reset bug value)
export async function healStreak(base44) {
  const HEALED_KEY = "svenska:streak_healed_v1";
  if (sessionStorage.getItem(HEALED_KEY)) return;
  sessionStorage.setItem(HEALED_KEY, "1");

  const user = await base44.auth.me();
  if (!user || user.streak_days > 1) return;

  const results = await base44.entities.QuizResult.list("-created_date", 500);
  const activeDates = [
    ...new Set(results.map(r => r.created_date?.split("T")[0]).filter(Boolean))
  ].sort().reverse();

  if (!activeDates.length) return;

  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  if (!activeDates.includes(today) && !activeDates.includes(yesterdayStr)) return;

  let streak = 0;
  let checkDate = activeDates.includes(today) ? today : yesterdayStr;
  for (const date of activeDates) {
    if (date === checkDate) {
      streak++;
      const d = new Date(checkDate + "T12:00:00Z");
      d.setDate(d.getDate() - 1);
      checkDate = d.toISOString().split("T")[0];
    } else if (date < checkDate) {
      break;
    }
  }

  if (streak > 1) {
    await base44.auth.updateMe({ streak_days: streak });
  }
}