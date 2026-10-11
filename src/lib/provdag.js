// Provdag helpers — how the national test is split into four blocks over one
// day, how a score becomes a guiding grade, and which parts count as weak.

export const DAY_BLOCKS = [
  {
    part: "reading",
    time: "08:30",
    label: "Morgon",
    minutes: 40,
    tip: "Läs texten en gång snabbt för helheten, sedan en gång långsamt innan du svarar.",
  },
  {
    part: "listening",
    time: "11:00",
    label: "Förmiddag",
    minutes: 30,
    tip: "Lyssna två gånger: första gången efter helheten, andra efter detaljerna.",
  },
  {
    part: "writing",
    time: "14:00",
    label: "Eftermiddag",
    minutes: 45,
    tip: "Planera tre stycken på två minuter innan du börjar skriva.",
  },
  {
    part: "speaking",
    time: "19:00",
    label: "Kväll",
    minutes: 20,
    tip: "Prata högt i 2–3 minuter utan att stanna. Flyt väger tyngre än perfekt grammatik.",
  },
];

export const PART_META = {
  reading: { sv: "Läsförståelse", en: "Reading", receptive: true },
  listening: { sv: "Hörförståelse", en: "Listening", receptive: true },
  writing: { sv: "Skriftlig färdighet", en: "Writing", receptive: false },
  speaking: { sv: "Muntlig färdighet", en: "Speaking", receptive: false },
};

const GRADE_STEPS = [
  ["A", 90],
  ["B", 80],
  ["C", 70],
  ["D", 60],
  ["E", 50],
];

export const GRADE_ORDER = { F: 0, E: 1, D: 2, C: 3, B: 4, A: 5 };

export function gradeOrder(grade) {
  return GRADE_ORDER[grade] ?? -1;
}

export function gradeFromPercent(percent) {
  if (percent == null) return null;
  const hit = GRADE_STEPS.find(([, min]) => percent >= min);
  return hit ? hit[0] : "F";
}

export function isWeak({ percent, grade }) {
  if (percent != null) return percent < 70;
  return ["F", "E", "D"].includes(grade);
}

const GENERIC_FOCUS = {
  reading: "läsförståelse: hitta huvudbudskap och detaljer i längre texter",
  listening: "hörförståelse: förstå samtal, meddelanden och uttalanden i naturligt tempo",
  writing: "skriftlig produktion: sammanhang, styckeindelning, ordförråd och bisatsordföljd",
  speaking: "muntlig produktion: flyt, uttal och att svara utförligt på frågor",
};

// The AI's own "att förbättra" points are the most precise thing to practise,
// so use them when we have them and fall back to the part's usual weak spots.
export function partFocus(part, improvements) {
  const points = (improvements || []).filter(Boolean).slice(0, 3);
  if (points.length === 0) return GENERIC_FOCUS[part];
  return `${PART_META[part].sv}: ${points.join("; ")}`;
}

export function todayKey() {
  return new Date().toLocaleDateString("sv-SE");
}