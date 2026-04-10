import { useState, useEffect } from "react";
import "./Navbar.css";

const SECTIONS = ["about", "skills", "projects"];

function Navbar() {
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3 }, // triggers when 30% of the section is visible
    );

    SECTIONS.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect(); // cleanup
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
