import "./CircuitPattern.css";

function CircuitPattern() {
  return (
    <div className="circuit-wrapper">
      <svg
        viewBox="0 0 120 800"
        className="circuit-svg"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Main vertical lines */}
        <line x1="20" y1="0" x2="20" y2="800" className="circuit-line cl-1" />
        <line x1="50" y1="0" x2="50" y2="800" className="circuit-line cl-2" />
        <line x1="80" y1="0" x2="80" y2="800" className="circuit-line cl-3" />
        <line x1="105" y1="0" x2="105" y2="800" className="circuit-line cl-4" />

        {/* Horizontal branches */}
        <line x1="20" y1="60" x2="50" y2="60" className="circuit-line cl-5" />
        <line x1="50" y1="120" x2="80" y2="120" className="circuit-line cl-6" />
        <line
          x1="80"
          y1="200"
          x2="105"
          y2="200"
          className="circuit-line cl-7"
        />
        <line x1="20" y1="280" x2="80" y2="280" className="circuit-line cl-8" />
        <line
          x1="50"
          y1="360"
          x2="105"
          y2="360"
          className="circuit-line cl-9"
        />
        <line
          x1="20"
          y1="440"
          x2="50"
          y2="440"
          className="circuit-line cl-10"
        />
        <line
          x1="80"
          y1="500"
          x2="105"
          y2="500"
          className="circuit-line cl-11"
        />
        <line
          x1="20"
          y1="580"
          x2="80"
          y2="580"
          className="circuit-line cl-12"
        />
        <line
          x1="50"
          y1="660"
          x2="105"
          y2="660"
          className="circuit-line cl-13"
        />
        <line
          x1="20"
          y1="740"
          x2="50"
          y2="740"
          className="circuit-line cl-14"
        />

        {/* Diagonal branches */}
        <line x1="20" y1="150" x2="50" y2="180" className="circuit-line cl-5" />
        <line
          x1="80"
          y1="310"
          x2="105"
          y2="340"
          className="circuit-line cl-7"
        />
        <line x1="50" y1="470" x2="80" y2="500" className="circuit-line cl-6" />
        <line x1="20" y1="620" x2="50" y2="650" className="circuit-line cl-8" />

        {/* Nodes / connection dots */}
        <circle cx="20" cy="60" r="3" className="circuit-node cn-1" />
        <circle cx="50" cy="60" r="3" className="circuit-node cn-2" />
        <circle cx="50" cy="120" r="3" className="circuit-node cn-3" />
        <circle cx="80" cy="120" r="3" className="circuit-node cn-4" />
        <circle cx="80" cy="200" r="3" className="circuit-node cn-5" />
        <circle cx="105" cy="200" r="3" className="circuit-node cn-6" />
        <circle cx="20" cy="280" r="3" className="circuit-node cn-1" />
        <circle cx="80" cy="280" r="3" className="circuit-node cn-4" />
        <circle cx="50" cy="360" r="3" className="circuit-node cn-2" />
        <circle cx="105" cy="360" r="3" className="circuit-node cn-6" />
        <circle cx="20" cy="440" r="3" className="circuit-node cn-3" />
        <circle cx="50" cy="440" r="3" className="circuit-node cn-5" />
        <circle cx="80" cy="500" r="3" className="circuit-node cn-1" />
        <circle cx="105" cy="500" r="3" className="circuit-node cn-2" />
        <circle cx="20" cy="580" r="3" className="circuit-node cn-4" />
        <circle cx="80" cy="580" r="3" className="circuit-node cn-6" />
        <circle cx="50" cy="660" r="3" className="circuit-node cn-3" />
        <circle cx="105" cy="660" r="3" className="circuit-node cn-5" />
        <circle cx="20" cy="740" r="3" className="circuit-node cn-1" />
        <circle cx="50" cy="740" r="3" className="circuit-node cn-4" />

        {/* Chip/IC blocks */}
        <rect
          x="10"
          y="170"
          width="20"
          height="30"
          rx="2"
          className="circuit-chip chip-1"
        />
        <rect
          x="70"
          y="400"
          width="20"
          height="30"
          rx="2"
          className="circuit-chip chip-2"
        />
        <rect
          x="40"
          y="550"
          width="20"
          height="25"
          rx="2"
          className="circuit-chip chip-3"
        />
        <rect
          x="95"
          y="700"
          width="20"
          height="25"
          rx="2"
          className="circuit-chip chip-4"
        />

        {/* Chip pins */}
        <line x1="10" y1="178" x2="4" y2="178" className="circuit-line cl-5" />
        <line x1="10" y1="185" x2="4" y2="185" className="circuit-line cl-5" />
        <line x1="10" y1="192" x2="4" y2="192" className="circuit-line cl-5" />
        <line x1="30" y1="178" x2="36" y2="178" className="circuit-line cl-5" />
        <line x1="30" y1="185" x2="36" y2="185" className="circuit-line cl-5" />
        <line x1="30" y1="192" x2="36" y2="192" className="circuit-line cl-5" />

        <line x1="70" y1="408" x2="64" y2="408" className="circuit-line cl-7" />
        <line x1="70" y1="415" x2="64" y2="415" className="circuit-line cl-7" />
        <line x1="70" y1="422" x2="64" y2="422" className="circuit-line cl-7" />
        <line x1="90" y1="408" x2="96" y2="408" className="circuit-line cl-7" />
        <line x1="90" y1="415" x2="96" y2="415" className="circuit-line cl-7" />
        <line x1="90" y1="422" x2="96" y2="422" className="circuit-line cl-7" />

        {/* Data pulse traveling along lines */}
        <circle r="2" className="circuit-pulse pulse-1">
          <animateMotion
            dur="4s"
            repeatCount="indefinite"
            path="M20,0 L20,280 L80,280 L80,500 L105,500"
          />
        </circle>
        <circle r="2" className="circuit-pulse pulse-2">
          <animateMotion
            dur="5s"
            repeatCount="indefinite"
            path="M50,0 L50,120 L80,120 L80,200 L105,200"
          />
        </circle>
        <circle r="2" className="circuit-pulse pulse-3">
          <animateMotion
            dur="6s"
            repeatCount="indefinite"
            path="M80,0 L80,500 L105,500 L105,800"
          />
        </circle>
      </svg>
    </div>
  );
}

export default CircuitPattern;
