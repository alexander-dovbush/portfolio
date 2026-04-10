import { useEffect, useRef } from "react";
import "./Particles.css";

function Particles() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationId;
    let stars = [];
    let shootingStars = [];
    let backdropCanvas = null; // pre-rendered bg + nebula
    let sunCanvas = null; // pre-rendered sun (corona + core)
    let sunOffset = 0;
    let sunSize = 0;
    let time = 0;
    let lastFrame = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Realistic stellar color temperatures
    const STAR_COLORS = [
      "255, 255, 255", // white
      "207, 232, 255", // blue-white (hot)
      "255, 244, 214", // warm white
      "255, 210, 180", // orange (cool)
      "180, 200, 255", // blue
    ];

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const createStars = () => {
      stars = [];
      const w = window.innerWidth;
      const h = window.innerHeight;
      // Lower density: was w*h/2200, now w*h/3500 (~36% fewer stars)
      const count = Math.floor((w * h) / 3500);

      for (let i = 0; i < count; i++) {
        const roll = Math.random();
        const isBright = roll < 0.015;
        const isMid = !isBright && roll < 0.08;

        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          size: isBright
            ? Math.random() * 1.2 + 1.1
            : isMid
              ? Math.random() * 0.8 + 0.6
              : Math.random() * 0.7 + 0.2,
          baseOpacity: isBright
            ? 0.95
            : isMid
              ? Math.random() * 0.4 + 0.5
              : Math.random() * 0.6 + 0.15,
          twinkleSpeed: Math.random() * 0.025 + 0.004,
          twinklePhase: Math.random() * Math.PI * 2,
          color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
          bright: isBright,
        });
      }
    };

    // Pre-render the deep-space gradient + nebula blobs to one offscreen canvas.
    // This is expensive but we only do it once per resize, not per frame.
    const createBackdrop = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      backdropCanvas = document.createElement("canvas");
      backdropCanvas.width = w;
      backdropCanvas.height = h;
      const bctx = backdropCanvas.getContext("2d");

      // Deep space gradient
      const bg = bctx.createLinearGradient(0, 0, 0, h);
      bg.addColorStop(0, "#05060f");
      bg.addColorStop(0.5, "#07080f");
      bg.addColorStop(1, "#020208");
      bctx.fillStyle = bg;
      bctx.fillRect(0, 0, w, h);

      // Nebula blobs
      const blobs = [
        { x: w * 0.2, y: h * 0.35, r: Math.max(w, h) * 0.5, c: "79, 70, 229" },
        { x: w * 0.75, y: h * 0.7, r: Math.max(w, h) * 0.45, c: "139, 92, 246" },
        { x: w * 0.5, y: h * 0.9, r: Math.max(w, h) * 0.4, c: "14, 165, 233" },
        { x: w * 0.9, y: h * 0.2, r: Math.max(w, h) * 0.3, c: "236, 72, 153" },
      ];
      for (const b of blobs) {
        const grad = bctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
        grad.addColorStop(0, `rgba(${b.c}, 0.09)`);
        grad.addColorStop(0.4, `rgba(${b.c}, 0.035)`);
        grad.addColorStop(1, `rgba(${b.c}, 0)`);
        bctx.fillStyle = grad;
        bctx.fillRect(0, 0, w, h);
      }
    };

    // Pre-render the sun (corona + core + hot dot) to its own offscreen canvas
    // so the main loop just blits it instead of recreating gradients each frame.
    const createSunSprite = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const radius = Math.min(w, h) * 0.22;
      sunSize = radius * 2;
      sunOffset = radius;

      sunCanvas = document.createElement("canvas");
      sunCanvas.width = Math.ceil(sunSize);
      sunCanvas.height = Math.ceil(sunSize);
      const sctx = sunCanvas.getContext("2d");
      const cx = radius;
      const cy = radius;

      // Outer corona
      const corona = sctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
      corona.addColorStop(0, "rgba(255, 225, 160, 0.55)");
      corona.addColorStop(0.08, "rgba(255, 200, 120, 0.38)");
      corona.addColorStop(0.2, "rgba(255, 160, 80, 0.18)");
      corona.addColorStop(0.45, "rgba(255, 110, 50, 0.06)");
      corona.addColorStop(0.75, "rgba(180, 60, 20, 0.02)");
      corona.addColorStop(1, "rgba(0, 0, 0, 0)");
      sctx.fillStyle = corona;
      sctx.fillRect(0, 0, sunSize, sunSize);

      // Bright core
      const coreR = radius * 0.13;
      const core = sctx.createRadialGradient(cx, cy, 0, cx, cy, coreR);
      core.addColorStop(0, "rgba(255, 255, 245, 1)");
      core.addColorStop(0.35, "rgba(255, 240, 200, 0.95)");
      core.addColorStop(0.7, "rgba(255, 200, 120, 0.5)");
      core.addColorStop(1, "rgba(255, 160, 60, 0)");
      sctx.fillStyle = core;
      sctx.beginPath();
      sctx.arc(cx, cy, coreR, 0, Math.PI * 2);
      sctx.fill();

      // Hot center dot
      sctx.beginPath();
      sctx.arc(cx, cy, coreR * 0.35, 0, Math.PI * 2);
      sctx.fillStyle = "rgba(255, 255, 250, 1)";
      sctx.fill();
    };

    const drawSun = () => {
      if (!sunCanvas) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      const pulse = 1 + Math.sin(time * 0.008) * 0.025;
      const size = sunSize * pulse;
      const cx = w * 0.88;
      const cy = h * 0.18;
      ctx.drawImage(sunCanvas, cx - size / 2, cy - size / 2, size, size);
    };

    const drawStar = (s, opacity) => {
      // Star core only — no per-star gradient creation. Halos cost too much.
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${s.color}, ${opacity})`;
      ctx.fill();

      // Bright stars get diffraction spikes — but as plain semi-transparent
      // strokes (no gradients). There are only ~1.5% bright stars so this is cheap.
      if (s.bright) {
        const spike = s.size * 8;
        ctx.strokeStyle = `rgba(${s.color}, ${opacity * 0.5})`;
        ctx.lineWidth = 0.7;
        ctx.beginPath();
        ctx.moveTo(s.x - spike, s.y);
        ctx.lineTo(s.x + spike, s.y);
        ctx.moveTo(s.x, s.y - spike);
        ctx.lineTo(s.x, s.y + spike);
        ctx.stroke();
      }
    };

    const maybeSpawnShootingStar = () => {
      if (Math.random() < 0.0025 && shootingStars.length < 2) {
        const w = window.innerWidth;
        const h = window.innerHeight;
        shootingStars.push({
          x: Math.random() * w * 0.7,
          y: Math.random() * h * 0.4,
          vx: 5 + Math.random() * 4,
          vy: 1.5 + Math.random() * 2,
          life: 0,
          maxLife: 70,
        });
      }
    };

    const drawShootingStars = () => {
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const s = shootingStars[i];
        s.x += s.vx;
        s.y += s.vy;
        s.life++;

        const alpha = Math.sin((s.life / s.maxLife) * Math.PI);
        const tx = s.x - s.vx * 10;
        const ty = s.y - s.vy * 10;
        // Plain stroke instead of gradient — only ever 0–2 of these on screen.
        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.7})`;
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(tx, ty);
        ctx.stroke();

        if (s.life >= s.maxLife) shootingStars.splice(i, 1);
      }
    };

    // Frame budget: ~30fps is plenty for a background ambient effect and
    // halves CPU/GPU cost vs the default 60fps rAF cadence.
    const FRAME_INTERVAL = 1000 / 30;

    const draw = (now) => {
      animationId = requestAnimationFrame(draw);
      if (now - lastFrame < FRAME_INTERVAL) return;
      lastFrame = now;

      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      // Pre-rendered backdrop (bg gradient + nebula) — single drawImage
      if (backdropCanvas) ctx.drawImage(backdropCanvas, 0, 0, w, h);

      // Stars with twinkle (no gradients in hot loop)
      for (const s of stars) {
        const twinkle =
          (Math.sin(time * s.twinkleSpeed + s.twinklePhase) + 1) / 2;
        const opacity = s.baseOpacity * (0.35 + twinkle * 0.65);
        drawStar(s, opacity);
      }

      // Pre-rendered sun sprite, scaled by pulse
      drawSun();

      // Shooting stars
      maybeSpawnShootingStar();
      drawShootingStars();

      time++;
    };

    // Pause animation when the tab is hidden — saves battery and stops
    // a 30fps loop firing in the background.
    const handleVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(animationId);
        animationId = null;
      } else if (animationId == null) {
        lastFrame = 0;
        animationId = requestAnimationFrame(draw);
      }
    };

    // Debounced resize: rebuilding stars + backdrop + sun on every pixel
    // change is what makes window-drag feel laggy.
    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        resize();
        createStars();
        createBackdrop();
        createSunSprite();
      }, 150);
    };

    window.addEventListener("resize", handleResize);
    document.addEventListener("visibilitychange", handleVisibility);

    resize();
    createStars();
    createBackdrop();
    createSunSprite();
    animationId = requestAnimationFrame(draw);

    return () => {
      if (animationId != null) cancelAnimationFrame(animationId);
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} className="particles-canvas" />;
}

export default Particles;
