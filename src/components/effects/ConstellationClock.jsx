import { useState, useEffect } from "react";
import "./ConstellationClock.css";

// Six "endpoint" stars per digit, laid out as the corners + mid-row of a
// 7-segment display. Lines between them form the digit shape — the result
// reads like a tiny constellation rather than an LCD.
const PTS = {
  A: [10, 10], B: [50, 10],
  C: [10, 50], D: [50, 50],
  E: [10, 90], F: [50, 90],
};

const SEGMENTS = {
  top: ["A", "B"],
  tr:  ["B", "D"],
  br:  ["D", "F"],
  bot: ["E", "F"],
  bl:  ["C", "E"],
  tl:  ["A", "C"],
  mid: ["C", "D"],
};

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

function Digit({ value }) {
  const activeSegs = new Set(DIGITS[value] || []);
  const litStars = new Set();
  for (const s of activeSegs) {
    SEGMENTS[s].forEach((p) => litStars.add(p));
  }

  return (
    <svg viewBox="0 0 60 100" className="cc-digit" aria-hidden="true">
      {Object.entries(SEGMENTS).map(([key, [a, b]]) => {
        const [x1, y1] = PTS[a];
        const [x2, y2] = PTS[b];
        return (
          <line
            key={key}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            className={`cc-line${activeSegs.has(key) ? " on" : ""}`}
          />
        );
      })}
      {Object.entries(PTS).map(([k, [x, y]]) => (
        <circle
          key={k}
          cx={x}
          cy={y}
          r="2.4"
          className={`cc-star${litStars.has(k) ? " lit" : ""}`}
        />
      ))}
    </svg>
  );
}

function Colon() {
  return (
    <svg viewBox="0 0 12 100" className="cc-colon" aria-hidden="true">
      <circle cx="6" cy="35" r="2.2" className="cc-star lit pulse" />
      <circle cx="6" cy="65" r="2.2" className="cc-star lit pulse" />
    </svg>
  );
}

function ConstellationClock() {
  const [time, setTime] = useState(() => new Date());

  useEffect(() => {
    // Align the first tick to the next wall-clock second so seconds advance
    // in sync with real time, then a steady 1s interval after that.
    const now = Date.now();
    const msToNextSecond = 1000 - (now % 1000);
    let intervalId;
    const initialId = setTimeout(() => {
      setTime(new Date());
      intervalId = setInterval(() => setTime(new Date()), 1000);
    }, msToNextSecond);

    return () => {
      clearTimeout(initialId);
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  const hh = String(time.getHours()).padStart(2, "0");
  const mm = String(time.getMinutes()).padStart(2, "0");
  const ss = String(time.getSeconds()).padStart(2, "0");

  return (
    <div
      className="constellation-clock"
      role="img"
      aria-label={`Current time ${hh}:${mm}:${ss}`}
    >
      <Digit value={hh[0]} />
      <Digit value={hh[1]} />
      <Colon />
      <Digit value={mm[0]} />
      <Digit value={mm[1]} />
      <Colon />
      <Digit value={ss[0]} />
      <Digit value={ss[1]} />
    </div>
  );
}

export default ConstellationClock;
