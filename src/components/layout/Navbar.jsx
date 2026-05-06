import { useState, useEffect } from "react";
import "./Navbar.css";

const SECTIONS = ["about", "skills", "projects"];

function Navbar() {
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    // Track current ratio for every section so we can always pick the most-visible one.
    // Without this, two sections crossing the threshold in the same tick would let
    // the *last* one fire win arbitrarily, causing the highlight to flicker.
    const ratios = new Map(SECTIONS.map((id) => [id, 0]));

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratios.set(entry.target.id, entry.intersectionRatio);
        }
        let topId = "";
        let topRatio = 0;
        for (const [id, ratio] of ratios) {
          if (ratio > topRatio) {
            topRatio = ratio;
            topId = id;
          }
        }
        if (topRatio > 0) setActiveSection(topId);
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] },
    );

    SECTIONS.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <nav className="navbar">
      <a href="#hero" className="navbar-logo">
        AD
      </a>
      <ul className="navbar-links">
        {SECTIONS.map((section) => (
          <li key={section}>
            <a
              href={`#${section}`}
              className={activeSection === section ? "active" : ""}
            >
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Navbar;
