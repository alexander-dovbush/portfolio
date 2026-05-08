import { useEffect, useRef, useState } from "react";
import "./ScrollReveal.css";

// Wraps a section so it fades in the first time it scrolls into view.
// Once revealed it stays revealed — we disconnect the observer so re-
// scrolling past doesn't replay the animation.
function ScrollReveal({ children }) {
  const ref = useRef();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    const observer = new IntersectionObserver(
      ([entry], obs) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      // 15% threshold — section starts revealing as soon as a sliver of it
      // is visible, instead of waiting until it's fully on screen.
      { threshold: 0.15 },
    );

    if (node) observer.observe(node);

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`scroll-reveal ${visible ? "visible" : ""}`}>
      {children}
    </div>
  );
}

export default ScrollReveal;
