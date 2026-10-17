// Verb practice helpers: group metadata, drill-sentence generation and the
// spaced-repetition rules used by VerbProgress.
import { shuffle } from "@/lib/shuffle";

export const VERB_GROUPS = [
  { id: "all", label: "Alla", en: "All groups", hint: "" },
  { id: "1", label: "Grupp 1", en: "Group 1", hint: "-ar" },
  { id: "2", label: "Grupp 2", en: "Group 2", hint: "-er" },
  { id: "3", label: "Grupp 3", en: "Group 3", hint: "korta verb" },
  { id: "4", label: "Grupp 4", en: "Group 4", hint: "oregelbundna" },
  { id: "modal", label: "Hjälpverb", en: "Modal verbs", hint: "" },
  { id: "reflexive", label: "Reflexiva", en: "Reflexive verbs", hint: "" },
  { id: "particle", label: "Partikelverb", en: "Particle verbs", hint: "" },
];

// The four forms every learner needs — shown in the page header.
export const FORM_OVERVIEW = [
  { key: "infinitive", sv: "Infinitiv", en: "infinitive", example: "arbeta" },
  { key: "present", sv: "Presens", en: "present", example: "arbetar" },
  { key: "past", sv: "Preteritum", en: "past", example: "arbetade" },
  { key: "supine", sv: "Supinum", en: "supine", example: "arbetat" },
];

export const FORM_SV = { present: "Presens", past: "Preteritum", supine: "Supinum" };

export const FORM_RULES = {
  present: "Presens = nutid. Efter 'nu' och 'varje dag' använder du presens: jag arbetar.",
  past: "Preteritum = dåtid. Efter 'igår' använder du preteritum: jag arbetade.",
  supine: "Efter 'har' använder du supinum: jag har arbetat. Supinum har samma form för alla personer.",
};

const REFLEXIVE_PRONOUN = { jag: "mig", du: "dig", vi: "oss", ni: "er", han: "sig", hon: "sig", de: "sig", man: "sig" };
const REFLEXIVE_WORDS = ["mig", "dig", "sig", "oss", "er"];

const words = (str) => (str || "").split(/\s+/).filter(Boolean);
const bare = (word) => (word || "").toLowerCase().replace(/[.,!?;:]/g, "");

function escapeRe(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Whole-word search. Swedish letters count as letters, so \b cannot be used —
// it would also match "använde" inside "använder".
function findForm(sentence, target) {
  const re = new RegExp(`(^|[^a-zåäöé])${escapeRe((target || "").toLowerCase())}(?![a-zåäöé])`, "i");
  const match = re.exec(sentence || "");
  return match ? match.index + match[1].length : -1;
}

function tidy(sentence) {
  const clean = sentence.replace(/\s+/g, " ").replace(/\s+([.,!?])/g, "$1").trim();
  return /[.!?]$/.test(clean) ? clean : `${clean}.`;
}

export function verbsInGroup(verbs, groupId) {
  return groupId === "all" ? verbs : verbs.filter((v) => v.group === groupId);
}

// Supine is skipped for modal verbs (rare in real use); forms missing from the
// data (skola, måste) are skipped automatically.
export function askableForms(verb) {
  const keys = ["present", "past", "supine"].filter((k) => (verb[k] || "").trim());
  return verb.group === "modal" ? keys.filter((k) => k !== "supine") : keys;
}

export function normalizeTyped(value) {
  return (value || "").trim().toLowerCase().replace(/\s+/g, " ");
}

export function isCorrectAnswer(typed, expected) {
  return normalizeTyped(typed) === normalizeTyped(expected);
}

// Where the verb sits in the example sentence: what comes before it is the
// subject, what comes after is the rest of the sentence.
function verbPosition(sentence, verb) {
  const low = (sentence || "").toLowerCase();
  const candidates = [verb.past, verb.supine, verb.present, verb.infinitive].filter(Boolean);

  for (const candidate of candidates) {
    const idx = findForm(sentence, candidate);
    if (idx >= 0) {
      return { before: sentence.slice(0, idx).trim(), after: sentence.slice(idx + candidate.length).trim() };
    }
  }
  // Reflexive verbs change with the person (känner sig → känner mig), so fall
  // back to the first word of the form.
  for (const candidate of candidates) {
    const first = candidate.split(/\s+/)[0];
    const match = new RegExp(`(^|\\s)${escapeRe(first.toLowerCase())}(?=\\s|$)`).exec(low);
    if (match) {
      const idx = match.index + match[1].length;
      return { before: sentence.slice(0, idx).trim(), after: sentence.slice(idx + first.length).trim() };
    }
  }
  return null;
}

// Words that belong to the verb itself (particles, "sig") must not stay behind
// after the blank.
function stripVerbTail(after, form) {
  const continuation = new Set(words(form).slice(1).map(bare));
  // A reflexive pronoun belongs to the verb only when the verb has one.
  if (/\bsig\b/.test(form)) REFLEXIVE_WORDS.forEach((word) => continuation.add(word));

  const rest = words(after);
  while (rest.length && continuation.has(bare(rest[0]))) rest.shift();
  // A particle separated from its verb ("ger inte upp") cannot be blanked as one
  // form, so drop the tail instead of leaving a stray particle behind.
  if (rest.some((word) => continuation.has(bare(word)))) return "";
  return rest.join(" ");
}

function reflexiveAnswer(form, subject) {
  const pronoun = REFLEXIVE_PRONOUN[(subject || "").toLowerCase()];
  return pronoun ? form.replace(/\bsig\b/g, pronoun) : form;
}

// One question: a Swedish sentence with the form blanked out, the infinitive in
// brackets and the time marker that signals the tense.
export function buildQuestion(verb, formKey) {
  const target = (verb[formKey] || "").trim();
  if (!target) return null;

  const example = (verb.example_sentence || "").trim();
  const marker = formKey === "present" ? "nu" : formKey === "past" ? "igår" : "har";
  const base = { marker, form: formKey, rule: FORM_RULES[formKey], verb };

  // Best case: the verb's own example already uses this form.
  const hit = findForm(example, target);
  if (hit >= 0) {
    const sentence = tidy(`${example.slice(0, hit)} ___ (${verb.infinitive}) ${example.slice(hit + target.length)}`);
    return { ...base, sentence, answer: target };
  }

  // Otherwise rebuild the sentence around the example's subject and tail.
  const position = example ? verbPosition(example, verb) : null;
  let subject = "jag";
  let rest = "";
  if (position) {
    const before = words(position.before);
    if (before.length === 1) subject = before[0].toLowerCase();
    rest = stripVerbTail(position.after, target);
  }

  const answer = reflexiveAnswer(target, subject);
  const cap = subject.charAt(0).toUpperCase() + subject.slice(1);
  const tail = rest ? ` ${rest}` : "";
  const sentence = formKey === "supine"
    ? tidy(`${cap} har ___ (${verb.infinitive})${tail}`)
    : tidy(`${cap} ___ (${verb.infinitive})${tail}`);

  return { ...base, sentence, answer };
}

// One question per verb, each asking a random form of that verb.
export function buildSession(verbs, count) {
  return shuffle(verbs)
    .slice(0, count)
    .map((verb) => {
      const forms = askableForms(verb);
      if (!forms.length) return null;
      return buildQuestion(verb, forms[Math.floor(Math.random() * forms.length)]);
    })
    .filter(Boolean);
}

// One question per verb asking for every other form at once: the infinitive is
// shown, the learner writes presens, preteritum and supinum themselves.
export function buildFormsSession(verbs, count) {
  return shuffle(verbs)
    .slice(0, count)
    .map((verb) => {
      const forms = askableForms(verb);
      return forms.length ? { verb, forms } : null;
    })
    .filter(Boolean);
}

// Retry exactly the questions that were missed, same form each time.
export function rebuildSession(questions) {
  return questions.map((q) => buildQuestion(q.verb, q.form)).filter(Boolean);
}

export function addDays(dateKey, days) {
  const d = new Date(`${dateKey}T12:00:00Z`);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

// Spaced repetition: wrong answers come back the same day, a verb answered
// correctly three times in a row is mastered and comes back after a week.
export function nextProgress(prev, correct) {
  const today = new Date().toISOString().slice(0, 10);
  const streak = correct ? (prev?.correct_streak || 0) + 1 : 0;
  const mastered = correct ? streak >= 3 : false;

  return {
    times_correct: (prev?.times_correct || 0) + (correct ? 1 : 0),
    times_wrong: (prev?.times_wrong || 0) + (correct ? 0 : 1),
    correct_streak: streak,
    mastered,
    last_seen: today,
    next_review: addDays(today, !correct ? 0 : mastered ? 7 : 1),
  };
}

export function groupProgress(verbs, progressMap) {
  const mastered = verbs.filter((v) => progressMap[v.id]?.mastered).length;
  return { mastered, total: verbs.length };
}

// Verbs the learner keeps getting wrong: answered incorrectly and not mastered
// yet. Most-missed first, then the ones with the weakest streak.
export function weakVerbs(verbs, progressMap) {
  return verbs
    .map((verb) => ({ verb, progress: progressMap?.[verb.id] }))
    .filter(({ progress }) => progress && !progress.mastered && (progress.times_wrong || 0) > 0)
    .sort((a, b) =>
      (b.progress.times_wrong - a.progress.times_wrong) ||
      ((a.progress.correct_streak || 0) - (b.progress.correct_streak || 0))
    )
    .map(({ verb, progress }) => ({ verb, wrong: progress.times_wrong || 0 }));
}