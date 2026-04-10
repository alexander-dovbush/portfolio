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
    let nebulaCanvas = null;
    const sun = { x: 0, y: 0, radius: 0 };
    let time = 0;
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
      const count = Math.floor((w * h) / 2200);

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

      sun.x = w * 0.88;
      sun.y = h * 0.18;
      sun.radius = Math.min(w, h) * 0.22;
    };

    const createNebula = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      nebulaCanvas = document.createElement("canvas");
      nebulaCanvas.width = w;
      nebulaCanvas.height = h;
      const nctx = nebulaCanvas.getContext("2d");

      const blobs = [
        {
          x: w * 0.2,
          y: h * 0.35,
          r: Math.max(w, h) * 0.5,
          color: "79, 70, 229",
        },
        {
          x: w * 0.75,
          y: h * 0.7,
          r: Math.max(w, h) * 0.45,
          color: "139, 92, 246",
        },
        {
          x: w * 0.5,
          y: h * 0.9,
          r: Math.max(w, h) * 0.4,
          color: "14, 165, 233",
        },
        {
          x: w * 0.9,
          y: h * 0.2,
          r: Math.max(w, h) * 0.3,
          color: "236, 72, 153",
        },
      ];

      for (const blob of blobs) {
        const grad = nctx.createRadialGradient(
          blob.x,
          blob.y,
          0,
          blob.x,
          blob.y,
          blob.r,
        );
        grad.addColorStop(0, `rgba(${blob.color}, 0.09)`);
        grad.addColorStop(0.4, `rgba(${blob.color}, 0.035)`);
        grad.addColorStop(1, `rgba(${blob.color}, 0)`);
        nctx.fillStyle = grad;
        nctx.fillRect(0, 0, w, h);
      }
    };

    const drawSun = () => {
      const pulse = 1 + Math.sin(time * 0.008) * 0.025;
      const r = sun.radius * pulse;
      const { x, y } = sun;

      // Outer corona — multi-stop for realistic falloff
      const corona = ctx.createRadialGradient(x, y, 0, x, y, r);
      corona.addColorStop(0, "rgba(255, 225, 160, 0.55)");
      corona.addColorStop(0.08, "rgba(255, 200, 120, 0.38)");
      corona.addColorStop(0.2, "rgba(255, 160, 80, 0.18)");
      corona.addColorStop(0.45, "rgba(255, 110, 50, 0.06)");
      corona.addColorStop(0.75, "rgba(180, 60, 20, 0.02)");
      corona.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = corona;
      ctx.fillRect(x - r, y - r, r * 2, r * 2);

      // Bright core
      const coreR = r * 0.13;
      const core = ctx.createRadialGradient(x, y, 0, x, y, coreR);
      core.addColorStop(0, "rgba(255, 255, 245, 1)");
      core.addColorStop(0.35, "rgba(255, 240, 200, 0.95)");
      core.addColorStop(0.7, "rgba(255, 200, 120, 0.5)");
      core.addColorStop(1, "rgba(255, 160, 60, 0)");
      ctx.fillStyle = core;
      ctx.beginPath();
      ctx.arc(x, y, coreR, 0, Math.PI * 2);
      ctx.fill();

      // Hot center dot
      ctx.beginPath();
      ctx.arc(x, y, coreR * 0.35, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 255, 250, 1)";
      ctx.fill();
    };

    const drawStar = (s, opacity) => {
      // Soft halo for all stars (subtle)
      if (s.size > 0.7) {
        const halo = ctx.createRadialGradient(
          s.x,
          s.y,
          0,
          s.x,
          s.y,
          s.size * 4,
        );
        halo.addColorStop(0, `rgba(${s.color}, ${opacity * 0.4})`);
        halo.addColorStop(1, `rgba(${s.color}, 0)`);
        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * 4, 0, Math.PI * 2);
        ctx.fill();
      }

      // Star core
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${s.color}, ${opacity})`;
      ctx.fill();

      // Bright stars get diffraction spikes
      if (s.bright) {
        const spike = s.size * 10;
        const gh = ctx.createLinearGradient(
          s.x - spike,
          s.y,
          s.x + spike,
          s.y,
        );
        gh.addColorStop(0, `rgba(${s.color}, 0)`);
        gh.addColorStop(0.5, `rgba(${s.color}, ${opacity * 0.7})`);
        gh.addColorStop(1, `rgba(${s.color}, 0)`);
        ctx.strokeStyle = gh;
        ctx.lineWidth = 0.7;
        ctx.beginPath();
        ctx.moveTo(s.x - spike, s.y);
        ctx.lineTo(s.x + spike, s.y);
        ctx.stroke();

        const gv = ctx.createLinearGradient(
          s.x,
          s.y - spike,
          s.x,
          s.y + spike,
        );
        gv.addColorStop(0, `rgba(${s.color}, 0)`);
        gv.addColorStop(0.5, `rgba(${s.color}, ${opacity * 0.7})`);
        gv.addColorStop(1, `rgba(${s.color}, 0)`);
        ctx.strokeStyle = gv;
        ctx.beginPath();
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
        const grad = ctx.createLinearGradient(s.x, s.y, tx, ty);
        grad.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
        grad.addColorStop(1, `rgba(255, 255, 255, 0)`);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(tx, ty);
        ctx.stroke();

        if (s.life >= s.maxLife) shootingStars.splice(i, 1);
      }
    };

    const draw = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      // Deep space gradient
      const bg = ctx.createLinearGradient(0, 0, 0, h);
      bg.addColorStop(0, "#05060f");
      bg.addColorStop(0.5, "#07080f");
      bg.addColorStop(1, "#020208");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // Nebula (cached)
      if (nebulaCanvas) ctx.drawImage(nebulaCanvas, 0, 0, w, h);

      // Stars with twinkle
      for (const s of stars) {
        const twinkle =
          (Math.sin(time * s.twinkleSpeed + s.twinklePhase) + 1) / 2;
        const opacity = s.baseOpacity * (0.35 + twinkle * 0.65);
        drawStar(s, opacity);
      }

      // Sun
      drawSun();

      // Shooting stars
      maybeSpawnShootingStar();
      drawShootingStars();

      time++;
      animationId = requestAnimationFrame(draw);
    };

    const handleResize = () => {
      resize();
      createStars();
      createNebula();
    };

    window.addEventListener("resize", handleResize);

    resize();
    createStars();
    createNebula();
    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="particles-canvas" />;
}

export default Particles;
