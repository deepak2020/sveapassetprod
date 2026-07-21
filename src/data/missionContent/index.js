// Merged mission content bank. Each level file is auto-generated from the
// prompt schema in src/lib/missionPrompt.js and keyed by title_sv, which is
// also the key the admin catalog uses to match against seeded SpeakingTopics.
import { MISSION_CONTENT_A1 } from "./a1";
import { MISSION_CONTENT_A2 } from "./a2";
import { MISSION_CONTENT_B1A } from "./b1a";
import { MISSION_CONTENT_B1B } from "./b1b";
import { MISSION_CONTENT_B2A } from "./b2a";
import { MISSION_CONTENT_B2B } from "./b2b";
import { MISSION_CONTENT_C1 } from "./c1";
import { MISSION_EXTRAS } from "./extras";

const BASE_CONTENT = {
  ...MISSION_CONTENT_A1,
  ...MISSION_CONTENT_A2,
  ...MISSION_CONTENT_B1A,
  ...MISSION_CONTENT_B1B,
  ...MISSION_CONTENT_B2A,
  ...MISSION_CONTENT_B2B,
  ...MISSION_CONTENT_C1,
};

// Append de-duplicated extras onto each mission's base arrays so both the
// admin seeder and any consumer see a single enriched content object.
function appendUnique(base = [], extra = [], keyOf) {
  const seen = new Set(base.map(keyOf));
  return [...base, ...extra.filter((item) => !seen.has(keyOf(item)))];
}

function mergeExtras(base, extra) {
  if (!extra) return base;
  return {
    ...base,
    key_vocabulary: appendUnique(base.key_vocabulary, extra.extra_key_vocabulary, (v) => v.swedish),
    key_phrases: appendUnique(base.key_phrases, extra.extra_key_phrases, (p) => p.phrase_sv),
    rehearsal_drills: appendUnique(
      base.rehearsal_drills,
      extra.extra_rehearsal_drill ? [extra.extra_rehearsal_drill] : [],
      (d) => d.prompt_sv
    ),
  };
}

export const MISSION_CONTENT = Object.fromEntries(
  Object.entries(BASE_CONTENT).map(([title, base]) => [title, mergeExtras(base, MISSION_EXTRAS[title])])
);

export function getMissionContent(titleSv) {
  return MISSION_CONTENT[titleSv] || null;
}
