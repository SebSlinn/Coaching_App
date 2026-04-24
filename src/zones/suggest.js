// Reverse classifier: zone + dist + pace → suggested IN/ON times
// cssValue: pass athlete CSS pace (s/100m) for CS zone support

function suggestTimes(zone, distM, stroke, pace200Sec, cssValue) {
  if (!pace200Sec || !distM || !zone) return null;
  var SMULT = { FS:1.0, BK:1.045, BR:1.254, Fly:1.051, IM:1.082 };
  var mult = SMULT[stroke] || 1.0;
  var base100 = (pace200Sec * mult) / 2; // seconds per 100m at 200PB pace
  var dist = parseFloat(distM);

  // Zone speedRatio ranges → IN time range
  var cssRef2 = cssValue || null;
  var mult2   = { FS:1.0, BK:1.045, BR:1.254, Fly:1.051, IM:1.082 }[stroke] || 1.0;
  var b100    = (pace200Sec * mult2) / 2;
  var cssSR   = cssRef2 ? cssRef2 / b100 : null;
  var srRanges = {
    HVO: [0.82, 0.93],
    LT:  [0.93, 0.97],
    LP:  [0.97, 1.025],
    AT:  [1.025, 1.10],
    CS:  cssSR ? [cssSR * 0.95, cssSR * 1.05] : [1.025, 1.10],
    A3:  [1.10, 1.22],
    A2:  [1.22, 1.38],
    A1:  [1.38, 1.65],
  };
  // Work:rest ratios by zone (rest/work)
  var restRatios = {
    HVO: [6.0, 10.0],
    LT:  [3.0, 5.0],
    LP:  [1.0, 1.2],
    AT:  [0.30, 0.55],   // 30-55s rest on 100m AT rep
    CS:  [0.45, 0.70],
    A3:  [0.0, 0.15],    // 0-15s rest — can go straight on at A3
    A2:  [0.0, 0.08],    // straight-on to 5s rest
    A1:  [0.0, 0.0],     // continuous — ON = IN (straight-on)
  };

  var range = srRanges[zone];
  var restRange = restRatios[zone];
  if (!range) return null;

  // Calculate IN time range (round to nearest second)
  var inLow  = Math.round((range[0] * base100 / 100) * dist);
  var inHigh = Math.round((range[1] * base100 / 100) * dist);
  if (inLow >= inHigh) inHigh = inLow + 2;

  // Calculate ON time range (IN + rest, round to nearest 5s)
  function roundTo5(sec) { return Math.round(sec / 5) * 5; }
  function fmtSug(sec) {
    var m = Math.floor(sec / 60);
    var s = Math.round(sec % 60);
    return m > 0 ? m + ":" + String(s).padStart(2,"0") : String(s);
  }

  var onLow  = roundTo5(inLow  + inLow  * restRange[0]);
  var onHigh = roundTo5(inHigh + inHigh * restRange[1]);
  if (onLow === onHigh) onHigh = onLow + 5;

  return {
    inLow, inHigh,
    onLow, onHigh,
    inLowStr:  fmtSug(inLow),
    inHighStr: fmtSug(inHigh),
    onLowStr:  fmtSug(onLow),
    onHighStr: fmtSug(onHigh),
    inMidStr:  fmtSug(Math.round((inLow + inHigh) / 2)),
    onMidStr:  fmtSug(roundTo5((onLow + onHigh) / 2)),
  };
}

export { suggestTimes };
