import { useState, useEffect } from "react";
import "./TimeConstellation.css";

// Six "endpoint" stars per digit, laid out as the corners + mid-row of a
// 7-segment display. Coordinates are in a 60x100 viewBox space and stay
// fixed regardless of which digit is shown. A digit is rendered by drawing
// lines between only the endpoints used by its active segments — the result
// reads like a small constellation rather than an LCD readout.
const PTS = {
  A: [10, 10], B: [50, 10], // top corners
  C: [10, 50], D: [50, 50], // mid corners
  E: [10, 90], F: [50, 90], // bottom corners
};

// Each segment is the pair of endpoints it connects.
const SEGMENTS = {
  top: ["A", "B"],
  tr:  ["B", "D"],
  br:  ["D", "F"],
  bot: ["E", "F"],
  bl:  ["C", "E"],
  tl:  ["A", "C"],
  mid: ["C", "D"],
};

// Which segments to light up for each digit (standard 7-segment encoding).
const DIGITS = {
  "0": ["top", "tr", "br", "bot", "bl", "tl"],
  "1": ["tr", "br"],
  "2": ["top", "tr", "mid", "bl", "bot"],
  "3": ["top", "tr", "mid", "br", "bot"],
  "4": ["tl", "mid", "tr", "br"],
  "5": ["top", "tl", "mid", "br", "bot"],
  "6": ["top", "tl", "mid", "bl", "br", "bot"],
  "7": ["top", "tr", "br"],
  "8": ["top", "tr", "br", "bot", "bl", "tl", "mid"],
  "9": ["top", "tl", "mid", "tr", "br", "bot"],
};

// One digit slot. Background stars (the 6 endpoints) are always rendered
// so the grid persists; lit stars + lines for the active segments overlay
// on top with an entrance animation. The parent keys this by value, so a
// fresh Digit mounts whenever the digit changes — the entrance animation
// then re-runs, giving the same "constellation forming" feel as the zodiac.
function Digit({ value }) {
  const activeSegs = DIGITS[value] || [];
  const litStars = new Set();
  for (const seg of activeSegs) SEGMENTS[seg].forEach((p) => litStars.add(p));

  return (
    <svg viewBox="0 0 60 100" className="tc-digit" aria-hidden="true">
      {/* Persistent faint grid: every endpoint as a dim dot. */}
      {Object.entries(PTS)
        .filter(([k]) => !litStars.has(k))
        .map(([k, [x, y]]) => (
          <circle
            key={`bg-${k}`}
            cx={x}
            cy={y}
            r="2.4"
            className="tc-bg-star"
          />
        ))}

      {/* Active segments — lines that draw on with stroke-dashoffset, just
          like the zodiac's edges. pathLength="1" normalizes the dash space
          so every line draws over the same fraction of its length. */}
      {activeSegs.map((segKey, i) => {
        const [a, b] = SEGMENTS[segKey];
        const [x1, y1] = PTS[a];
        const [x2, y2] = PTS[b];
        return (
          <line
            key={`line-${segKey}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            pathLength="1"
            className="tc-line"
            style={{ animationDelay: `${0.18 + i * 0.05}s` }}
          />
        );
      })}

      {/* Lit endpoint stars on top — three layers (halo, glow, core) for
          the same soft falloff used elsewhere in the portfolio. */}
      {[...litStars].map((k, i) => {
        const [x, y] = PTS[k];
        return (
          <g
            key={`lit-${k}`}
            className="tc-lit-star"
            style={{ animationDelay: `${i * 0.04}s` }}
          >
            <circle cx={x} cy={y} r="5" className="tc-lit-halo" />
            <circle cx={x} cy={y} r="3" className="tc-lit-glow" />
            <circle cx={x} cy={y} r="1.8" className="tc-lit-core" />
          </g>
        );
      })}
    </svg>
  );
}

// Two pulsing dots between hours/minutes and minutes/seconds.
function Colon() {
  return (
    <svg viewBox="0 0 12 100" className="tc-colon" aria-hidden="true">
      <circle cx="6" cy="35" r="2.2" className="tc-lit-core pulse" />
      <circle cx="6" cy="65" r="2.2" className="tc-lit-core pulse" />
    </svg>
  );
}

function TimeConstellation() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    // Align the first tick to the next wall-clock second so subsequent
    // ticks fall on the second boundary — the seconds digit then reads
    // honestly instead of drifting by some fraction of a second.
    const msToNextSecond = 1000 - (Date.now() % 1000);
    let intervalId;
    const initialId = setTimeout(() => {
      setNow(new Date());
      intervalId = setInterval(() => setNow(new Date()), 1000);
    }, msToNextSecond);

    return () => {
      clearTimeout(initialId);
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");

  // Each Digit is keyed by `<slot>-<value>`. When the digit's value changes,
  // the key changes and React remounts that slot — the new digit's CSS
  // entrance animation then runs from the start. The other slots keep the
  // same keys and don't re-animate.
  return (
    <div
      className="time-bg"
      role="img"
      aria-label={`Local time ${hh}:${mm}:${ss}`}
    >
      <div className="time-row">
        <Digit key={`h0-${hh[0]}`} value={hh[0]} />
        <Digit key={`h1-${hh[1]}`} value={hh[1]} />
        <Colon />
        <Digit key={`m0-${mm[0]}`} value={mm[0]} />
        <Digit key={`m1-${mm[1]}`} value={mm[1]} />
        <Colon />
        <Digit key={`s0-${ss[0]}`} value={ss[0]} />
        <Digit key={`s1-${ss[1]}`} value={ss[1]} />
      </div>
      <div className="time-label" aria-hidden="true">
        <span className="tc-symbol">⌖</span>
        <span className="tc-divider" />
        <span className="tc-name">local time</span>
      </div>
    </div>
  );
}

export default TimeConstellation;
