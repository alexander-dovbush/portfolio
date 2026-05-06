import { useState, useEffect } from "react";
import "./Hero.css";

// Array of titles to cycle through
const TITLES = [
  "Software Engineering Student",
  "Full-Stack Developer",
  "Problem Solver",
];

function Hero() {
  const [titleIndex, setTitleIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentTitle = TITLES[titleIndex];

    if (!isDeleting && displayText === currentTitle) {
      const t = setTimeout(() => setIsDeleting(true), 1500);
      return () => clearTimeout(t);
    }
    if (isDeleting && displayText === "") {
      setIsDeleting(false);
      setTitleIndex((i) => (i + 1) % TITLES.length);
      return;
    }

    const t = setTimeout(
      () => {
        setDisplayText(
          isDeleting
            ? currentTitle.substring(0, displayText.length - 1)
            : currentTitle.substring(0, displayText.length + 1),
        );
      },
      isDeleting ? 50 : 100,
    );
    return () => clearTimeout(t);
  }, [displayText, isDeleting, titleIndex]);

  return (
    <section id="hero" className="hero">
      <div className="hero-content">
        <p className="hero-greeting">Hi, I'm</p>
        <h1 className="hero-name">Alexander Dovbush</h1>
        <p className="hero-title">
          {displayText}
          <span className="typing-cursor">|</span>
        </p>
        <p className="hero-subtitle">
          Technion · Java · C# · Python · JavaScript · React
        </p>
        <div className="hero-buttons">
          <a href="#projects" className="btn btn-primary">
            View My Work
          </a>
          <a href="#about" className="btn btn-outline">
            About Me
          </a>
        </div>
      </div>
    </section>
  );
}

export default Hero;
