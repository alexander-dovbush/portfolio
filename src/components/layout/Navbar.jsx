import { useState, useEffect } from "react";
import "./Navbar.css";

function Navbar() {
  const sections = ["about", "skills", "projects"];
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

    sections.forEach((id) => {
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
        {sections.map((section) => (
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
