import { useEffect, useRef, useState } from "react";
import "./ScrollReveal.css";

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
