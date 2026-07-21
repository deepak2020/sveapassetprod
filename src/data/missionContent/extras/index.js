// Merged EXTRA mission content — the "top-up" layer added on top of the base
// content bank. Each entry has extra_key_vocabulary (2), extra_key_phrases (2)
// and extra_rehearsal_drill (1), keyed by title_sv. These are appended to the
// base arrays by src/data/missionContent/index.js.
import { MISSION_EXTRAS_A1 } from "./a1";
import { MISSION_EXTRAS_A2 } from "./a2";
import { MISSION_EXTRAS_B1 } from "./b1";
import { MISSION_EXTRAS_B2C1 } from "./b2c1";

export const MISSION_EXTRAS = {
  ...MISSION_EXTRAS_A1,
  ...MISSION_EXTRAS_A2,
  ...MISSION_EXTRAS_B1,
  ...MISSION_EXTRAS_B2C1,
};
