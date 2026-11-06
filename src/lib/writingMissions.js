// Shared helpers for the Skrivuppdrag (writing missions) module.
import { base44 } from "@/api/base44Client";
import { shuffle } from "@/lib/shuffle";
import { countWords } from "@/lib/writingPractice";

export { countWords };

export const STAGES = [
  { id: 1, label: "Uppdrag", en: "Briefing" },
  { id: 2, label: "Ord", en: "Words" },
  { id: 3, label: "Meningar", en: "Sentences" },
  { id: 4, label: "Bygg", en: "Build" },
  { id: 5, label: "Stycke", en: "Paragraph" },
  { id: 6, label: "Skriv fritt", en: "Free text" },
  { id: 7, label: "Feedback", en: "Feedback" },
];

export const STAGE_COUNT = STAGES.length;

export const MISSION_TYPES = [
  {
    id: "informal_email",
    label: "Mejl till vän",
    en: "Email to a friend",
    tone: "border-blue-300 bg-blue-50 text-blue-800 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-200",
  },
  {
    id: "formal_email",
    label: "Formellt mejl",
    en: "Formal email",
    tone: "border-violet-300 bg-violet-50 text-violet-800 dark:border-violet-800 dark:bg-violet-950/40 dark:text-violet-200",
  },
  {
    id: "opinion",
    label: "Åsiktstext",
    en: "Opinion text",
    tone: "border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200",
  },
];

export function missionType(id) {
  return MISSION_TYPES.find((t) => t.id === id) || MISSION_TYPES[0];
}

export const CONNECTORS = ["eftersom", "men", "medan", "så att"];

// XP per step — mirrors the reward plan for the mission flow.
export const MISSION_XP = {
  word_pass: 5,
  sentences: 5,
  build: 5,
  paragraph: 5,
  submit: 10,
  rewrite: 10,
  fewer_errors: 5,
};

const LS_PROGRESS = "svenska:wm_progress";
const LS_SUBMISSIONS = "svenska:wm_submissions";

export function readLocal(key) {
  try {
    const raw = localStorage.getItem(key === "progress" ? LS_PROGRESS : LS_SUBMISSIONS);
    const parsed = JSON.parse(raw || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeLocal(key, value) {
  try {
    localStorage.setItem(key === "progress" ? LS_PROGRESS : LS_SUBMISSIONS, JSON.stringify(value));
  } catch {
    // storage full or blocked — the session simply keeps its in-memory state
  }
}

export function emptyProgress() {
  return { completed_stages: [], current_stage: 1, word_quiz_score: 0 };
}

export function nextStage(progress) {
  const done = progress?.completed_stages || [];
  const next = STAGES.find((s) => !done.includes(s.id));
  return next ? next.id : 7;
}

export function progressPercent(progress) {
  const done = (progress?.completed_stages || []).length;
  return Math.round((done / STAGE_COUNT) * 100);
}

// A mission is 15-25 minutes depending on the length of the final text.
export function estimateMinutes(mission) {
  const words = mission?.min_words || 100;
  return Math.max(15, Math.min(25, Math.round(8 + words / 10)));
}

export function wordLabel(word) {
  if (!word?.sv) return "";
  return word.gender ? `${word.gender} ${word.sv}` : word.sv;
}

export function normalizeText(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[.!?,;:]+$/g, "")
    .trim();
}

// Accepts "lägenhet", "en lägenhet" and "trivas" for "att trivas".
export function normalizeAnswer(value) {
  return normalizeText(value).replace(/^(en|ett)\s+/, "").replace(/^att\s+/, "");
}

export function sameSentence(a, b) {
  return normalizeText(a) === normalizeText(b);
}

// 10 questions from the mission's 12 words: meaning choices and typed Swedish words.
export function buildQuiz(words) {
  const list = shuffle((words || []).slice()).slice(0, 10);
  return list.map((word, index) => {
    if (index % 2 === 0) {
      const distractors = shuffle((words || []).filter((w) => w.sv !== word.sv))
        .slice(0, 3)
        .map((w) => w.en);
      return { kind: "meaning", word, options: shuffle([word.en, ...distractors]) };
    }
    return { kind: "type", word };
  });
}

export function fillBlank(sentence, answer) {
  return String(sentence || "").replace("___", answer);
}

// Short hint about the word order mistake most puzzles contain.
export function puzzleHint(answer) {
  const text = String(answer || "").toLowerCase();
  if (/\b(inte)\b/.test(text)) return "inte kommer efter verbet.";
  if (/^(på|i|nu|idag|igår|efter|sedan|om|å andra sidan|på kvällen|på morgonen)\b/.test(text)) {
    return "Verbet kommer på andra plats.";
  }
  return "Verbet kommer på andra plats — subjektet står före verbet.";
}

// Weekly goal: 2 short missions and 1 longer text.
export function weeklyCounts(submissions) {
  const since = new Date();
  since.setDate(since.getDate() - 7);
  const week = (submissions || []).filter((s) => {
    const created = s.created_date || s.created_at;
    return created ? new Date(created) >= since : false;
  });
  const short = week.filter((s) => (s.word_count || 0) <= 120).length;
  const long = week.filter((s) => (s.word_count || 0) > 120).length;
  return { short, long, done: Math.min(short, 2) + Math.min(long, 1), goal: 3 };
}

export function errorsPer100(errorCount, wordCount) {
  if (!wordCount) return 0;
  return Math.round((errorCount / wordCount) * 1000) / 10;
}

function missionPayload(mission) {
  return {
    title: mission.title,
    task_sv: mission.task_sv,
    points_to_include: mission.points_to_include || [],
    words: (mission.words || []).map((w) => w.sv),
    min_words: mission.min_words,
    max_words: mission.max_words,
  };
}

export async function shortFeedback({ mission, text, step }) {
  const res = await base44.functions.invoke("writingMissionFeedback", {
    mode: "short",
    mission: missionPayload(mission),
    text,
    step,
  });
  return res.data || {};
}

export async function fullFeedback({ mission, text, stageMode }) {
  const res = await base44.functions.invoke("writingMissionFeedback", {
    mode: "full",
    mission: missionPayload(mission),
    text,
    stage_mode: stageMode,
  });
  return res.data || {};
}