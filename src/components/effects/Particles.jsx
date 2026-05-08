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
    let backdropCanvas = null;
    // One pre-rendered soft-glow sprite per stellar color. Drawing each star
    // as a sprite (instead of a filled arc) gives smooth gradient edges with
    // far less per-frame cost than building radial gradients in the hot loop.
    let starSprites = [];
    let time = 0;
    let lastFrame = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Realistic stellar colors weighted by spectral class frequency.
    // Mostly warm-white sun-likes with a sprinkle of blue, orange, and red.
    const STAR_COLORS = [
      "255, 244, 214", // warm white (G-type)
      "255, 244, 214",
      "255, 244, 214",
      "255, 244, 214",
      "255, 255, 255", // pure white (F-type)
      "255, 255, 255",
      "207, 232, 255", // blue-white (A/B-type)
      "180, 200, 255", // blue (rare, hot)
      "255, 215, 185", // soft orange (K-type)
      "255, 195, 165", // orange
      "255, 175, 145", // orange-red (M-type)
    ];

    // Galactic plane runs as a gentle diagonal band. Core (bright zone)
    // sits on the right side so the zodiac constellation lands on top of
    // the densest part of the galaxy. Hero text on the left gets darker sky.
    const GALAXY = {
      angle: -0.22, // radians — slight upward tilt going right
      centerY: 0.5,
      bandHalf: 0.22, // half-thickness of bright band (fraction of height)
      bandFalloff: 0.35, // soft fade beyond bandHalf
      coreX: 0.78,
      coreY: 0.46,
    };

    // Perpendicular distance from (x,y) to the galaxy axis line, normalized
    // to a 0..1 "in-band" weight (1 = on the line, 0 = far away).
    const bandWeight = (x, y, w, h) => {
      const cx = w * 0.5;
      const cy = h * GALAXY.centerY;
      const m = Math.tan(GALAXY.angle);
      // line: y - cy = m*(x - cx)  =>  m*dx - dy = 0
      const dist = Math.abs(m * (x - cx) - (y - cy)) / Math.sqrt(m * m + 1);
      const dNorm = dist / h;
      if (dNorm < GALAXY.bandHalf) return 1;
      if (dNorm < GALAXY.bandHalf + GALAXY.bandFalloff) {
        return 1 - (dNorm - GALAXY.bandHalf) / GALAXY.bandFalloff;
      }
      return 0;
    };

    // Falloff from galactic core — used to bias star density toward the
    // bright side of the galaxy, like real Milky Way panoramas.
    const coreWeight = (x, y, w, h) => {
      const cx = w * GALAXY.coreX;
      const cy = h * GALAXY.coreY;
      const r = Math.hypot(x - cx, y - cy) / Math.max(w, h);
      return Math.max(0, 1 - r * 1.4);
    };

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const makeStar = (x, y) => {
      // Magnitude distribution mimics real long-exposure photos: mostly dim
      // pinpricks, occasional bright stars, very rare super-brights.
      const roll = Math.random();
      let mag;
      if (roll < 0.004) mag = "super";
      else if (roll < 0.035) mag = "bright";
      else if (roll < 0.16) mag = "mid";
      else mag = "dim";

      const sizeBase = { super: 1.3, bright: 0.95, mid: 0.6, dim: 0.35 }[mag];
      const opBase = { super: 1.0, bright: 0.9, mid: 0.6, dim: 0.32 }[mag];

      // Pick a color index instead of a string — the sprite cache is keyed
      // by index so we avoid string lookups in the per-frame hot loop.
      const colorIdx = Math.floor(Math.random() * STAR_COLORS.length);

      return {
        x,
        y,
        size: sizeBase + Math.random() * 0.25,
        baseOpacity: opBase + (Math.random() * 0.18 - 0.09),
        twinkleSpeed: Math.random() * 0.025 + 0.003,
        twinklePhase: Math.random() * Math.PI * 2,
        colorIdx,
        color: STAR_COLORS[colorIdx],
        mag,
      };
    };

    // Build one soft-glow sprite per stellar color. Each sprite has a soft
    // halo and a brighter core, so when we drawImage it, the star appears
    // with smooth gradient falloff — no aliased pixel circles.
    const createStarSprites = () => {
      const SIZE = 32; // sprite resolution; plenty for the small drawn sizes
      starSprites = STAR_COLORS.map((color) => {
        const c = document.createElement("canvas");
        c.width = SIZE;
        c.height = SIZE;
        const sctx = c.getContext("2d");
        const cx = SIZE / 2;

        // Outer halo — wide soft falloff to the sprite edge.
        const halo = sctx.createRadialGradient(cx, cx, 0, cx, cx, SIZE / 2);
        halo.addColorStop(0, `rgba(${color}, 0.55)`);
        halo.addColorStop(0.18, `rgba(${color}, 0.32)`);
        halo.addColorStop(0.45, `rgba(${color}, 0.08)`);
        halo.addColorStop(0.75, `rgba(${color}, 0.02)`);
        halo.addColorStop(1, `rgba(${color}, 0)`);
        sctx.fillStyle = halo;
        sctx.fillRect(0, 0, SIZE, SIZE);

        // Bright tight core — additive on top of halo for the pinprick look.
        sctx.globalCompositeOperation = "lighter";
        const core = sctx.createRadialGradient(cx, cx, 0, cx, cx, SIZE * 0.18);
        core.addColorStop(0, `rgba(${color}, 1)`);
        core.addColorStop(0.45, `rgba(${color}, 0.7)`);
        core.addColorStop(1, `rgba(${color}, 0)`);
        sctx.fillStyle = core;
        sctx.fillRect(0, 0, SIZE, SIZE);

        return c;
      });
    };

    const createStars = () => {
      stars = [];
      const w = window.innerWidth;
      const h = window.innerHeight;

      // Background scatter — sparse, everywhere
      const baseCount = Math.floor((w * h) / 5000);
      for (let i = 0; i < baseCount; i++) {
        stars.push(makeStar(Math.random() * w, Math.random() * h));
      }

      // Galactic plane density boost — rejection-sample so stars cluster
      // along the band and especially near the core.
      const galaxyCount = Math.floor((w * h) / 1600);
      let placed = 0;
      let attempts = 0;
      const maxAttempts = galaxyCount * 8;
      while (placed < galaxyCount && attempts < maxAttempts) {
        attempts++;
        const x = Math.random() * w;
        const y = Math.random() * h;
        const bw = bandWeight(x, y, w, h);
        const cw = coreWeight(x, y, w, h);
        const accept = Math.min(1, bw * 0.7 + cw * 0.7);
        if (Math.random() < accept) {
          stars.push(makeStar(x, y));
          placed++;
        }
      }
    };

    // Pre-render the deep-space backdrop once per resize. This is the
    // expensive layer (gradients, nebulae, dust) so doing it per-frame would
    // tank performance.
    const createBackdrop = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      backdropCanvas = document.createElement("canvas");
      backdropCanvas.width = w;
      backdropCanvas.height = h;
      const bctx = backdropCanvas.getContext("2d");

      // Deep space base — very dark, slight blue/violet tint
      const bg = bctx.createLinearGradient(0, 0, 0, h);
      bg.addColorStop(0, "#020310");
      bg.addColorStop(0.5, "#04051a");
      bg.addColorStop(1, "#020210");
      bctx.fillStyle = bg;
      bctx.fillRect(0, 0, w, h);

      // Work in a rotated frame for the Milky Way band so all band-relative
      // shapes (glow, nebulae, dust) align naturally.
      bctx.save();
      bctx.translate(w * 0.5, h * GALAXY.centerY);
      bctx.rotate(GALAXY.angle);

      // Soft galactic plane glow — luminous stripe along the band, brighter
      // toward the core side (positive x in rotated frame).
      const bandLen = w * 1.6;
      const bandH = h * 1.2;
      // Vertical falloff (perpendicular to band)
      const bandY = bctx.createLinearGradient(0, -bandH * 0.5, 0, bandH * 0.5);
      bandY.addColorStop(0, "rgba(70, 80, 120, 0)");
      bandY.addColorStop(0.42, "rgba(110, 120, 160, 0.045)");
      bandY.addColorStop(0.5, "rgba(170, 180, 220, 0.1)");
      bandY.addColorStop(0.58, "rgba(110, 120, 160, 0.045)");
      bandY.addColorStop(1, "rgba(70, 80, 120, 0)");
      bctx.fillStyle = bandY;
      bctx.fillRect(-bandLen * 0.5, -bandH * 0.5, bandLen, bandH);

      // Horizontal falloff (along band, fading toward the left side)
      const bandX = bctx.createLinearGradient(
        -bandLen * 0.5,
        0,
        bandLen * 0.5,
        0,
      );
      bandX.addColorStop(0, "rgba(0, 0, 0, 0.45)");
      bandX.addColorStop(0.4, "rgba(0, 0, 0, 0.15)");
      bandX.addColorStop(0.7, "rgba(0, 0, 0, 0)");
      bctx.globalCompositeOperation = "destination-out";
      bctx.fillStyle = bandX;
      bctx.fillRect(-bandLen * 0.5, -bandH * 0.5, bandLen, bandH);
      bctx.globalCompositeOperation = "source-over";

      bctx.restore();

      // Galactic core — warm bright zone where the Milky Way thickens.
      // Drawn outside the rotated frame so it stays anchored to the screen.
      const cx = w * GALAXY.coreX;
      const cy = h * GALAXY.coreY;
      const coreR = Math.max(w, h) * 0.55;
      const core = bctx.createRadialGradient(cx, cy, 0, cx, cy, coreR);
      core.addColorStop(0, "rgba(255, 230, 195, 0.16)");
      core.addColorStop(0.1, "rgba(255, 215, 175, 0.10)");
      core.addColorStop(0.25, "rgba(230, 180, 150, 0.05)");
      core.addColorStop(0.55, "rgba(180, 150, 180, 0.02)");
      core.addColorStop(1, "rgba(0, 0, 0, 0)");
      bctx.fillStyle = core;
      bctx.fillRect(0, 0, w, h);

      // Wispy nebulae — built from stacked offset radial gradients to break
      // the perfect-circle look and give an irregular cloud shape. Colors
      // chosen for realism: rose pink (Hα emission), dusty cyan, deep violet.
      const nebulae = [
        { x: 0.68, y: 0.55, color: "230, 150, 175", size: 0.32, alpha: 0.05 },
        { x: 0.85, y: 0.32, color: "180, 130, 200", size: 0.28, alpha: 0.045 },
        { x: 0.55, y: 0.62, color: "120, 160, 210", size: 0.30, alpha: 0.04 },
        { x: 0.92, y: 0.62, color: "215, 175, 220", size: 0.22, alpha: 0.04 },
        { x: 0.42, y: 0.42, color: "150, 130, 190", size: 0.26, alpha: 0.03 },
      ];

      bctx.globalCompositeOperation = "lighter";
      for (const n of nebulae) {
        const nx = n.x * w;
        const ny = n.y * h;
        const baseR = Math.max(w, h) * n.size;
        // Stack 7 offset gradients per nebula to break the circle.
        for (let i = 0; i < 7; i++) {
          const ox = (Math.random() - 0.5) * baseR * 0.7;
          const oy = (Math.random() - 0.5) * baseR * 0.5;
          const r = baseR * (0.45 + Math.random() * 0.55);
          const g = bctx.createRadialGradient(nx + ox, ny + oy, 0, nx + ox, ny + oy, r);
          g.addColorStop(0, `rgba(${n.color}, ${n.alpha})`);
          g.addColorStop(0.4, `rgba(${n.color}, ${n.alpha * 0.4})`);
          g.addColorStop(1, `rgba(${n.color}, 0)`);
          bctx.fillStyle = g;
          bctx.fillRect(0, 0, w, h);
        }
      }
      bctx.globalCompositeOperation = "source-over";

      // Dust lanes — dark patches that obscure the band, like the dust in
      // the real Milky Way. Drawn with `multiply` to darken what's behind.
      bctx.save();
      bctx.translate(w * 0.5, h * GALAXY.centerY);
      bctx.rotate(GALAXY.angle);
      bctx.globalCompositeOperation = "multiply";

      const dustLanes = [
        { x: 0.10, y: -0.02, sx: 0.18, sy: 0.06, alpha: 0.55 },
        { x: 0.22, y: 0.04, sx: 0.10, sy: 0.04, alpha: 0.45 },
        { x: -0.08, y: 0.01, sx: 0.14, sy: 0.05, alpha: 0.5 },
        { x: 0.30, y: -0.03, sx: 0.08, sy: 0.03, alpha: 0.4 },
      ];
      for (const d of dustLanes) {
        const dx = d.x * w;
        const dy = d.y * h;
        const rx = d.sx * w;
        const ry = d.sy * h;
        const g = bctx.createRadialGradient(dx, dy, 0, dx, dy, Math.max(rx, ry));
        g.addColorStop(0, `rgba(0, 0, 0, ${d.alpha})`);
        g.addColorStop(0.6, `rgba(0, 0, 0, ${d.alpha * 0.4})`);
        g.addColorStop(1, "rgba(0, 0, 0, 0)");
        bctx.fillStyle = g;
        bctx.save();
        bctx.translate(dx, dy);
        bctx.scale(rx / Math.max(rx, ry), ry / Math.max(rx, ry));
        bctx.translate(-dx, -dy);
        bctx.fillRect(dx - rx, dy - ry, rx * 2, ry * 2);
        bctx.restore();
      }
      bctx.globalCompositeOperation = "source-over";
      bctx.restore();
    };

    const drawStar = (s, opacity) => {
      // Smooth star: drawImage the pre-rendered sprite scaled by magnitude.
      // The sprite has the halo + core baked in, so we get gradient edges
      // for free instead of the harsh ring of an arc fill.
      const sprite = starSprites[s.colorIdx];
      // The sprite's visible glow extends out to ~half its width, so we
      // draw at a multiple of the star's size to give the halo room.
      const drawR = s.size * 4;
      ctx.globalAlpha = Math.max(0, Math.min(1, opacity));
      ctx.drawImage(sprite, s.x - drawR, s.y - drawR, drawR * 2, drawR * 2);
      ctx.globalAlpha = 1;

      // Diffraction spikes — only for the brighter magnitudes. These are
      // what real bright stars do in long-exposure photos and they sell the
      // sense of relative brightness more than size alone.
      if (s.mag === "super") {
        const spike = s.size * 10;
        ctx.strokeStyle = `rgba(${s.color}, ${opacity * 0.55})`;
        ctx.lineWidth = 0.8;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(s.x - spike, s.y);
        ctx.lineTo(s.x + spike, s.y);
        ctx.moveTo(s.x, s.y - spike);
        ctx.lineTo(s.x, s.y + spike);
        ctx.stroke();
      } else if (s.mag === "bright") {
        const spike = s.size * 5.5;
        ctx.strokeStyle = `rgba(${s.color}, ${opacity * 0.3})`;
        ctx.lineWidth = 0.5;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(s.x - spike, s.y);
        ctx.lineTo(s.x + spike, s.y);
        ctx.moveTo(s.x, s.y - spike);
        ctx.lineTo(s.x, s.y + spike);
        ctx.stroke();
      }
    };

    const maybeSpawnShootingStar = () => {
      // Rare and occasional — meteors should feel like a treat, not a
      // constant blizzard. Cap to one in flight at a time for clarity.
      if (Math.random() < 0.0018 && shootingStars.length < 1) {
        const w = window.innerWidth;
        const h = window.innerHeight;
        // Velocity vector — a bit of variety in angle and speed.
        const vx = 5 + Math.random() * 4;
        const vy = 1.5 + Math.random() * 2;
        const speed = Math.hypot(vx, vy);
        shootingStars.push({
          x: Math.random() * w * 0.7,
          y: Math.random() * h * 0.4,
          vx,
          vy,
          // Unit vector — used to point the trail backwards from the head
          // independently of speed (so faster meteors don't get unrealistic
          // trail-stretching).
          dirX: vx / speed,
          dirY: vy / speed,
          // Trail length in pixels. Decoupled from velocity so two meteors
          // moving at different speeds can still look proportional.
          tailLen: 90 + Math.random() * 60,
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

        // Smooth fade-in / fade-out over the life of the meteor. sin(πt)
        // gives 0 → 1 → 0, peaking at midlife — no abrupt pop in or out.
        const t = s.life / s.maxLife;
        const alpha = Math.sin(t * Math.PI);

        // Tail tip — a fixed distance behind the head along its direction.
        const tx = s.x - s.dirX * s.tailLen;
        const ty = s.y - s.dirY * s.tailLen;

        // Linear gradient along the trail: bright warm-white at the head,
        // fading through a cooler tint, to fully transparent at the tip.
        // Real meteors look hottest at the leading edge and trail off.
        const trail = ctx.createLinearGradient(s.x, s.y, tx, ty);
        trail.addColorStop(0, `rgba(255, 245, 220, ${alpha * 0.9})`);
        trail.addColorStop(0.15, `rgba(255, 230, 200, ${alpha * 0.55})`);
        trail.addColorStop(0.45, `rgba(220, 210, 230, ${alpha * 0.2})`);
        trail.addColorStop(1, `rgba(180, 190, 230, 0)`);

        ctx.save();
        ctx.lineCap = "round";
        ctx.lineWidth = 1.4;
        ctx.strokeStyle = trail;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(tx, ty);
        ctx.stroke();
        ctx.restore();

        // Glowing head — a small radial flare so the leading edge reads as
        // a hot point of light rather than just the end of a line.
        const headR = 6;
        const head = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, headR);
        head.addColorStop(0, `rgba(255, 250, 235, ${alpha * 0.95})`);
        head.addColorStop(0.35, `rgba(255, 230, 200, ${alpha * 0.45})`);
        head.addColorStop(1, `rgba(255, 220, 200, 0)`);
        ctx.fillStyle = head;
        ctx.beginPath();
        ctx.arc(s.x, s.y, headR, 0, Math.PI * 2);
        ctx.fill();

        if (s.life >= s.maxLife) shootingStars.splice(i, 1);
      }
    };

    const FRAME_INTERVAL = 1000 / 30;

    const draw = (now) => {
      animationId = requestAnimationFrame(draw);
      if (now - lastFrame < FRAME_INTERVAL) return;
      lastFrame = now;

      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      if (backdropCanvas) ctx.drawImage(backdropCanvas, 0, 0, w, h);

      for (const s of stars) {
        const twinkle =
          (Math.sin(time * s.twinkleSpeed + s.twinklePhase) + 1) / 2;
        const opacity = s.baseOpacity * (0.4 + twinkle * 0.6);
        drawStar(s, opacity);
      }

      maybeSpawnShootingStar();
      drawShootingStars();

      time++;
    };

    const handleVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(animationId);
        animationId = null;
      } else if (animationId == null) {
        lastFrame = 0;
        animationId = requestAnimationFrame(draw);
      }
    };

    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        resize();
        createStars();
        createBackdrop();
        // Sprites are resolution-independent (drawn scaled), so they don't
        // need to rebuild on resize — only on initial mount.
      }, 150);
    };

    window.addEventListener("resize", handleResize);
    document.addEventListener("visibilitychange", handleVisibility);

    resize();
    createStarSprites();
    createStars();
    createBackdrop();
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
