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

export const MISSION_CONTENT = {
  ...MISSION_CONTENT_A1,
  ...MISSION_CONTENT_A2,
  ...MISSION_CONTENT_B1A,
  ...MISSION_CONTENT_B1B,
  ...MISSION_CONTENT_B2A,
  ...MISSION_CONTENT_B2B,
  ...MISSION_CONTENT_C1,
};

export function getMissionContent(titleSv) {
  return MISSION_CONTENT[titleSv] || null;
}
