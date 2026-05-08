import { useState, useEffect } from "react";
import "./ZodiacConstellation.css";

// Each zodiac is a list of stars (x,y in 0–100 viewBox space) plus edges
// connecting star indices. `bright` lists indices of "alpha" stars — they
// render larger with a halo + diffraction spikes, like real bright stars.
const ZODIACS = [
  {
    name: "Aries",
    symbol: "♈",
    stars: [[15, 38], [32, 22], [52, 18], [72, 28], [90, 50]],
    edges: [[0, 1], [1, 2], [2, 3], [3, 4]],
    bright: [2],
  },
  {
    name: "Taurus",
    symbol: "♉",
    stars: [
      [22, 18], [50, 28], [78, 18],
      [50, 48], [32, 62], [68, 62], [50, 82],
    ],
    edges: [[0, 3], [2, 3], [1, 3], [3, 4], [3, 5], [3, 6]],
    bright: [3],
  },
  {
    name: "Gemini",
    symbol: "♊",
    stars: [
      [28, 18], [28, 40], [28, 62], [28, 84],
      [72, 18], [72, 40], [72, 62], [72, 84],
    ],
    edges: [[0, 1], [1, 2], [2, 3], [4, 5], [5, 6], [6, 7], [1, 5]],
    bright: [0, 4],
  },
  {
    name: "Cancer",
    symbol: "♋",
    stars: [[18, 25], [50, 42], [82, 25], [50, 65], [50, 88]],
    edges: [[0, 1], [2, 1], [1, 3], [3, 4]],
    bright: [1],
  },
  {
    name: "Leo",
    symbol: "♌",
    stars: [
      [18, 38], [30, 22], [50, 16], [70, 24], [82, 44],
      [62, 58], [78, 78], [92, 86],
    ],
    edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7]],
    bright: [2, 6],
  },
  {
    name: "Virgo",
    symbol: "♍",
    stars: [
      [12, 78], [28, 66], [44, 56], [58, 40], [72, 28], [88, 22],
      [55, 78], [70, 90],
    ],
    edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [3, 6], [6, 7]],
    bright: [3],
  },
  {
    name: "Libra",
    symbol: "♎",
    stars: [[30, 28], [70, 28], [50, 48], [50, 70], [16, 60], [84, 60]],
    edges: [[4, 0], [0, 1], [1, 5], [0, 2], [1, 2], [2, 3]],
    bright: [0, 1],
  },
  {
    name: "Scorpio",
    symbol: "♏",
    stars: [
      [10, 32], [24, 20], [38, 30], [46, 46], [58, 56], [72, 60],
      [86, 54], [90, 38], [80, 24],
    ],
    edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8]],
    bright: [3],
  },
  {
    name: "Sagittarius",
    symbol: "♐",
    stars: [
      [22, 50], [22, 76], [44, 78], [62, 78], [62, 50], [44, 50],
      [84, 50], [62, 30],
    ],
    edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0], [4, 6], [4, 7]],
    bright: [4],
  },
  {
    name: "Capricorn",
    symbol: "♑",
    stars: [[20, 66], [50, 22], [78, 66], [62, 80], [78, 90]],
    edges: [[0, 1], [1, 2], [2, 0], [2, 3], [3, 4]],
    bright: [1],
  },
  {
    name: "Aquarius",
    symbol: "♒",
    stars: [
      [10, 38], [26, 28], [42, 38], [58, 28], [74, 38], [90, 28],
      [42, 58], [58, 70], [74, 82],
    ],
    edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [2, 6], [6, 7], [7, 8]],
    bright: [2],
  },
  {
    name: "Pisces",
    symbol: "♓",
    stars: [[16, 28], [38, 38], [56, 28], [56, 70], [74, 80], [90, 70]],
    edges: [[0, 1], [2, 1], [1, 3], [3, 4], [5, 4]],
    bright: [1],
  },
];

// Stellar colors from real spectral classes — same palette as the bg starfield
// so the constellation feels embedded in the same sky, not pasted on top.
const STAR_COLORS = [
  "255, 244, 214", // warm white (most common)
  "255, 244, 214",
  "255, 244, 214",
  "255, 255, 255", // pure white
  "207, 232, 255", // blue-white (hot)
  "255, 215, 185", // soft orange (cool)
];

const CYCLE_MS = 14000;
const FADE_OUT_MS = 2400;

// Deterministic per-star color so the same constellation looks the same
// each time it cycles back around. Cheap hash on star coords.
function pickColor(x, y, i) {
  const h = Math.floor((x * 17 + y * 31 + i * 7) % STAR_COLORS.length);
  return STAR_COLORS[h];
}

// Slight per-star size jitter — real stars vary, even at the same magnitude.
function dimSize(i) {
  return 0.42 + ((i * 13) % 7) * 0.05;
}

function ZodiacConstellation() {
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState("in");

  useEffect(() => {
    // Each cycle: hold the sign, fade out near the end, then advance to the
    // next sign and reset phase back to "in" — both in the same setState
    // call so React batches the update into one render.
    const outTimer = setTimeout(() => setPhase("out"), CYCLE_MS - FADE_OUT_MS);
    const nextTimer = setTimeout(() => {
      setIndex((i) => (i + 1) % ZODIACS.length);
      setPhase("in");
    }, CYCLE_MS);
    return () => {
      clearTimeout(outTimer);
      clearTimeout(nextTimer);
    };
  }, [index]);

  const z = ZODIACS[index];
  const brightSet = new Set(z.bright || []);

  return (
    <div className={`zodiac-bg ${phase}`} aria-hidden="true">
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
        className="zodiac-svg"
        key={index}
      >
        {z.edges.map(([a, b], i) => {
          const [x1, y1] = z.stars[a];
          const [x2, y2] = z.stars[b];
          return (
            <line
              key={`l-${i}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              pathLength="1"
              className="zodiac-line"
              style={{ animationDelay: `${0.9 + i * 0.18}s` }}
            />
          );
        })}
        {z.stars.map(([x, y], i) => {
          const isBright = brightSet.has(i);
          const color = pickColor(x, y, i);
          const r = isBright ? 0.95 : dimSize(i);
          const delay = `${i * 0.08}s`;
          return (
            <g
              key={`s-${i}`}
              className={`zodiac-star${isBright ? " bright" : ""}`}
              style={{ animationDelay: delay }}
            >
              {isBright && (
                <>
                  <circle
                    cx={x}
                    cy={y}
                    r="2.6"
                    fill={`rgba(${color}, 0.10)`}
                    className="zodiac-halo"
                  />
                  <circle
                    cx={x}
                    cy={y}
                    r="1.4"
                    fill={`rgba(${color}, 0.45)`}
                  />
                  {/* Diffraction spikes — what real bright stars do in photos */}
                  <line
                    x1={x - 4} y1={y} x2={x + 4} y2={y}
                    stroke={`rgba(${color}, 0.35)`}
                    strokeWidth="0.15"
                    strokeLinecap="round"
                  />
                  <line
                    x1={x} y1={y - 4} x2={x} y2={y + 4}
                    stroke={`rgba(${color}, 0.35)`}
                    strokeWidth="0.15"
                    strokeLinecap="round"
                  />
                </>
              )}
              <circle
                cx={x}
                cy={y}
                r={r}
                fill={`rgb(${color})`}
                className="zodiac-core"
              />
            </g>
          );
        })}
      </svg>
      <div className="zodiac-label" key={`label-${index}`}>
        <span className="zodiac-symbol">{z.symbol}</span>
        <span className="zodiac-name">{z.name.toLowerCase()}</span>
      </div>
    </div>
  );
}

export default ZodiacConstellation;
