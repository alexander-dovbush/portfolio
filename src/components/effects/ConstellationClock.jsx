import { useState, useEffect } from "react";
import "./ConstellationClock.css";

// Wall-clock time of the very first commit on this repo. The clock counts
// up from this moment, so it reads "how long this portfolio has been live."
const SHIPPED_AT = new Date("2026-03-26T11:39:07+02:00").getTime();

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

function computeElapsed(now) {
  const totalMs = Math.max(0, now - SHIPPED_AT);
  const totalSec = Math.floor(totalMs / 1000);
  const days = Math.floor(totalSec / 86400);
  const hours = Math.floor((totalSec % 86400) / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;
  return { days, hours, minutes, seconds };
}

// Pad to 2 digits unless we've crossed 100 days, then grow to 3.
function padDays(d) {
  return d < 100 ? String(d).padStart(2, "0") : String(d);
}

function ConstellationClock() {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    // Align the first tick to the next wall-clock second so subsequent ticks
    // fall on the second boundary — keeps the seconds digit honest.
    const msToNextSecond = 1000 - (Date.now() % 1000);
    let intervalId;
    const initialId = setTimeout(() => {
      setNow(Date.now());
      intervalId = setInterval(() => setNow(Date.now()), 1000);
    }, msToNextSecond);

    return () => {
      clearTimeout(initialId);
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  const { days, hours, minutes, seconds } = computeElapsed(now);
  const dd = padDays(days);
  const hh = String(hours).padStart(2, "0");
  const mm = String(minutes).padStart(2, "0");
  const ss = String(seconds).padStart(2, "0");

  return (
    <div
      className="constellation-clock"
      role="img"
      aria-label={`Portfolio uptime: ${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`}
    >
      <div className="cc-label">
        <span className="cc-comment">{"//"}</span>{" "}
        <span className="cc-prop">portfolio</span>
        <span className="cc-punct">.</span>
        <span className="cc-prop">uptime</span>
      </div>
      <div className="cc-row">
        {dd.split("").map((d, i) => (
          <Digit key={`d${i}`} value={d} />
        ))}
        <Colon />
        <Digit value={hh[0]} />
        <Digit value={hh[1]} />
        <Colon />
        <Digit value={mm[0]} />
        <Digit value={mm[1]} />
        <Colon />
        <Digit value={ss[0]} />
        <Digit value={ss[1]} />
      </div>
      <div className="cc-caption" aria-hidden="true">
        <span className="cc-prompt">{">"}</span> shipped {days}d ago
      </div>
    </div>
  );
}

export default ConstellationClock;
