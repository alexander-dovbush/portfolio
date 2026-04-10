import { useState, useEffect } from "react";
import "./Hero.css";

// Array of titles to cycle through
const TITLES = [
  "Software Engineering Student",
  "Full-Stack Developer",
  "Problem Solver",
];

function Hero() {
  const [titleIndex, setTitleIndex] = useState(0); // which title we're on
  const [displayText, setDisplayText] = useState(""); // the visible text so far
  const [isDeleting, setIsDeleting] = useState(false); // are we typing or deleting?

  useEffect(() => {
    const currentTitle = TITLES[titleIndex];
    let pauseTimeout;

    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          // Typing: add one character
          setDisplayText(currentTitle.substring(0, displayText.length + 1));

          // If we finished typing the full title, pause then start deleting
          if (displayText.length === currentTitle.length) {
            pauseTimeout = setTimeout(() => setIsDeleting(true), 1500); // pause 1.5s before deleting
            return;
          }
        } else {
          // Deleting: remove one character
          setDisplayText(currentTitle.substring(0, displayText.length - 1));

          // If we deleted everything, move to the next title
          if (displayText.length === 0) {
            setIsDeleting(false);
            setTitleIndex((prev) => (prev + 1) % TITLES.length); // loop back to 0
          }
        }
      },
      isDeleting ? 50 : 100,
    ); // deleting is faster than typing

    return () => {
      clearTimeout(timeout);
      clearTimeout(pauseTimeout);
    };
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
