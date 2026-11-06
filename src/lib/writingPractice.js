// Shared vocabulary for the Skrivträning (writing practice) module.

export const PROMPT_TYPES = [
  { id: "informal_email", label: "Informellt mejl", en: "Informal email", tone: "border-blue-300 bg-blue-50 text-blue-800 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-200" },
  { id: "formal_email", label: "Formellt mejl", en: "Formal email", tone: "border-violet-300 bg-violet-50 text-violet-800 dark:border-violet-800 dark:bg-violet-950/40 dark:text-violet-200" },
  { id: "opinion", label: "Åsiktstext", en: "Opinion text", tone: "border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200" },
];

export function typeMeta(id) {
  return PROMPT_TYPES.find((t) => t.id === id) || PROMPT_TYPES[0];
}

export const TEMPLATES = {
  informal_email: [
    "Hej [namn]!",
    "Hoppas att allt är bra med dig!",
    "Jag skriver för att …",
    "Hoppas att få höra från dig snart!",
    "Kram, [namn]",
  ],
  formal_email: [
    "Hej [namn],",
    "Jag skriver eftersom jag vill …",
    "Kan du …?",
    "Tack på förhand!",
    "Med vänliga hälsningar,",
    "[namn]",
  ],
  opinion: [
    "Jag tycker att …",
    "… eftersom …",
    "Till exempel …",
    "Å andra sidan …",
    "Sammanfattningsvis …",
  ],
};

export const ERROR_TYPES = [
  { id: "verb_second", label: "Ordföljd (verb tvåa)", en: "Word order" },
  { id: "en_ett", label: "en / ett", en: "Gender" },
  { id: "definite_form", label: "Bestämd form", en: "Definite form" },
  { id: "preposition", label: "Preposition", en: "Preposition" },
  { id: "spelling", label: "Stavning", en: "Spelling" },
  { id: "verb_form", label: "Verbform", en: "Verb form" },
  { id: "word_choice", label: "Ordval", en: "Word choice" },
  { id: "connector", label: "Bindeord", en: "Connector" },
  { id: "other", label: "Annat", en: "Other" },
];

export function errorMeta(id) {
  return ERROR_TYPES.find((e) => e.id === id) || ERROR_TYPES[ERROR_TYPES.length - 1];
}

export function countWords(text) {
  return (String(text || "").match(/[\p{L}\p{N}_'-]+/gu) || []).length;
}

export function parsePoints(prompt) {
  return String(prompt?.points_to_include || "")
    .split("|")
    .map((p) => p.trim())
    .filter(Boolean);
}

// Errors per 100 words — the number students watch going down over time.
export function errorsPer100(errorCount, wordCount) {
  if (!wordCount) return 0;
  return Math.round((errorCount / wordCount) * 1000) / 10;
}

export const GRADE_TONE = {
  A: "bg-emerald-600",
  B: "bg-emerald-600",
  C: "bg-emerald-700",
  D: "bg-amber-500",
  E: "bg-amber-600",
  F: "bg-red-500",
};