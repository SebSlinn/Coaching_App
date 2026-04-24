import { STROKE_MULT } from './constants.js';
import { fmtTime } from './helpers.js';

function validatePace({ distM, targetTimeSec, pace200Sec, stroke }) {
  if (!distM || !targetTimeSec || !pace200Sec) return null;
  const mult        = STROKE_MULT[stroke] || 1.0;
  const pace200adj  = pace200Sec * mult;
  const hvoPacePer100 = (pace200adj / 2) - 10;
  const hvoTimeSec    = (hvoPacePer100 / 100) * distM;
  const pushOffSec    = 5 / 2.5;
  const swimMinSec    = Math.max(0, distM - 5) / 2.0;
  const absoluteMinSec = pushOffSec + swimMinSec;
  const hvoWithLeeway  = hvoTimeSec * 0.85;
  let warningLevel = null, warningMsg = null;
  if (targetTimeSec < absoluteMinSec) {
    warningLevel = "impossible";
    warningMsg   = `⚠ IMPOSSIBLE PACE: ${distM}m in ${targetTimeSec.toFixed(1)}s is below the physical floor (${absoluteMinSec.toFixed(1)}s off a push-off). Zone classification shown is hypothetical only.`;
  } else if (targetTimeSec < hvoWithLeeway) {
    warningLevel = "caution";
    warningMsg   = `⚠ EXCEEDS HVO CAP: Target pace is faster than the maximum HVO training speed for this athlete (~${fmtTime(hvoTimeSec)} for ${distM}m). Check entry — or this is a racing dive effort, not a training rep.`;
  }
  return { warningLevel, warningMsg, hvoTimeSec, absoluteMinSec };
}

// ─── Zone metadata ──────────────────────────────────────────────────────────

export { validatePace };
