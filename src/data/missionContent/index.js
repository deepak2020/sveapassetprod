// Merged mission content bank. Each level file is auto-generated from the
// prompt schema in src/lib/missionPrompt.js and keyed by title_sv, which is
// also the key the admin catalog uses to match against seeded SpeakingTopics.
import { MISSION_CONTENT_A1 } from "./a1";
import { MISSION_CONTENT_A2 } from "./a2";
// B1/B2/C1 content files are being generated and will be merged here when they land.

export const MISSION_CONTENT = {
  ...MISSION_CONTENT_A1,
  ...MISSION_CONTENT_A2,
};

export function getMissionContent(titleSv) {
  return MISSION_CONTENT[titleSv] || null;
}
