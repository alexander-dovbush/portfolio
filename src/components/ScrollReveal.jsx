import { useEffect, useRef, useState } from "react";
import "./ScrollReveal.css";

function ScrollReveal({ children }) {
  const ref = useRef();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
        }
      },
      { threshold: 0.15 },
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`scroll-reveal ${visible ? "visible" : ""}`}>
      {children}
    </div>
  );
}

export default ScrollReveal;
