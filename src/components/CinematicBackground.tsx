import { useEffect, useRef } from "react";

/**
 * Extraordinary Luxury Background Architecture:
 * 1. Interactive Cursor Light Halo (smooth inertia-tracked radial gold & sapphire aura)
 * 2. 60 FPS Microscopic Celestial Stardust Particles (interactive particle canvas with Brownian drift)
 * 3. MAAYON 2026–27 Sacred Celestial Astrolabe (ornate sacred geometry rings, constellation nodes)
 * 4. Specular Volumetric God Rays (subtle diagonal crystal refraction shafts)
 * 5. Architectural Quantum Precision Grid with Cardinal Crosshairs
 */
export function CinematicBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cursorAuraRef = useRef<HTMLDivElement>(null);

  const stateRef = useRef({
    mouseX: 0,
    mouseY: 0,
    targetMouseX: 0,
    targetMouseY: 0,
    parallaxX: 0,
    parallaxY: 0,
    scrollY: 0,
  });

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const handleMouseMove = (e: MouseEvent) => {
      stateRef.current.targetMouseX = e.clientX;
      stateRef.current.targetMouseY = e.clientY;
    };

    const handleScroll = () => {
      stateRef.current.scrollY = window.scrollY * 0.04;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Initialize Canvas Stardust Particles
    const canvas = canvasRef.current;
    let ctx: CanvasRenderingContext2D | null = null;
    let particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      baseAlpha: number;
      alpha: number;
      pulseSpeed: number;
      color: string;
    }> = [];

    const resizeCanvas = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      if (!canvas) return;
      const count = Math.min(window.innerWidth < 768 ? 22 : 48, 60);
      particles = [];
      const colors = [
        "rgba(215, 182, 90, ", // Radiant Champagne Gold
        "rgba(243, 229, 171, ", // Light Warm Gold
        "rgba(23, 78, 166, ",  // Royal Indigo
        "rgba(255, 255, 255, ", // Pure Diamond White
      ];

      for (let i = 0; i < count; i++) {
        const baseAlpha = 0.15 + Math.random() * 0.45;
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.35,
          vy: -0.15 - Math.random() * 0.3, // Gentle upward celestial drift
          size: Math.random() * 1.8 + 0.6,
          baseAlpha,
          alpha: baseAlpha,
          pulseSpeed: 0.01 + Math.random() * 0.02,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
    };

    if (canvas) {
      ctx = canvas.getContext("2d");
      resizeCanvas();
      window.addEventListener("resize", resizeCanvas);
    }

    let animationFrameId: number;
    let time = 0;

    const animate = () => {
      const s = stateRef.current;
      time += 0.02;

      // Inertia smoothing for cursor aura & parallax
      s.mouseX += (s.targetMouseX - s.mouseX) * 0.07;
      s.mouseY += (s.targetMouseY - s.mouseY) * 0.07;

      if (!motionQuery.matches && containerRef.current && window.innerWidth > 768) {
        const targetParallaxX = ((s.targetMouseX / window.innerWidth) - 0.5) * 16;
        const targetParallaxY = ((s.targetMouseY / window.innerHeight) - 0.5) * 16;
        s.parallaxX += (targetParallaxX - s.parallaxX) * 0.05;
        s.parallaxY += (targetParallaxY - s.parallaxY) * 0.05;

        containerRef.current.style.transform = `translate3d(${s.parallaxX.toFixed(2)}px, ${(s.parallaxY + s.scrollY).toFixed(2)}px, 0)`;
      }

      // Move Cursor Halo Spotlight
      if (cursorAuraRef.current) {
        cursorAuraRef.current.style.transform = `translate3d(${(s.mouseX - 250).toFixed(1)}px, ${(s.mouseY - 250).toFixed(1)}px, 0)`;
      }

      // Render Stardust Particles
      if (ctx && canvas && !motionQuery.matches) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          p.x += p.vx;
          p.y += p.vy;

          // Twinkle pulse
          p.alpha = p.baseAlpha + Math.sin(time + i) * 0.15;

          // Wrap edges
          if (p.y < -10) p.y = canvas.height + 10;
          if (p.x < -10) p.x = canvas.width + 10;
          if (p.x > canvas.width + 10) p.x = -10;

          // Gentle cursor magnetic push
          const dx = p.x - s.mouseX;
          const dy = p.y - s.mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120 && dist > 0) {
            const force = (120 - dist) / 120 * 0.8;
            p.x += (dx / dist) * force;
            p.y += (dy / dist) * force;
          }

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `${p.color}${Math.max(0.05, Math.min(0.8, p.alpha))})`;
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", resizeCanvas);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden select-none"
    >
      {/* ─── Layer 1: Base Canvas ─── */}
      <div className="cinematic-bg-base absolute inset-0 transition-colors duration-500" />

      {/* ─── Layer 2: Interactive Cursor Light Halo Spotlight ─── */}
      <div
        ref={cursorAuraRef}
        className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full pointer-events-none opacity-40 dark:opacity-35 will-change-transform hidden sm:block"
        style={{
          background: "radial-gradient(circle, rgba(215, 182, 90, 0.18) 0%, rgba(23, 78, 166, 0.12) 40%, transparent 70%)",
        }}
      />

      {/* ─── Layer 3: Celestial Stardust Particles Canvas ─── */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none opacity-80 dark:opacity-90"
      />

      {/* ─── Layer 4: Parallax Depth Horizon & Sacred Astrolabe ─── */}
      <div
        ref={containerRef}
        className="absolute inset-0 w-full h-full will-change-transform"
        style={{ transform: "translate3d(0, 0, 0)" }}
      >
        {/* Luminous Light Mode Atmosphere */}
        <div
          className="dark:hidden absolute -top-48 -left-48 w-[800px] h-[800px] rounded-full opacity-60 pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(23, 78, 166, 0.14) 0%, rgba(23, 78, 166, 0.03) 50%, transparent 70%)",
          }}
        />
        <div
          className="dark:hidden absolute top-1/4 -right-48 w-[850px] h-[850px] rounded-full opacity-55 pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(215, 182, 90, 0.16) 0%, rgba(215, 182, 90, 0.03) 55%, transparent 70%)",
          }}
        />

        {/* Deep Liquid Obsidian & Royal Gold Atmosphere (Dark Mode) */}
        <div
          className="hidden dark:block absolute -top-48 -left-48 w-[850px] h-[850px] rounded-full opacity-75 pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(23, 78, 166, 0.25) 0%, rgba(7, 17, 31, 0.15) 50%, transparent 70%)",
          }}
        />
        <div
          className="hidden dark:block absolute top-1/3 -right-48 w-[900px] h-[900px] rounded-full opacity-70 pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(215, 182, 90, 0.16) 0%, rgba(11, 23, 40, 0.12) 55%, transparent 70%)",
          }}
        />
        <div
          className="hidden dark:block absolute bottom-1/4 -left-48 w-[750px] h-[750px] rounded-full opacity-80 pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(7, 26, 61, 0.32) 0%, transparent 65%)",
          }}
        />

        {/* ─── Layer 5: Diagonal Volumetric Specular Light Rays ─── */}
        <div
          className="absolute -top-32 right-1/4 w-[600px] h-[900px] rotate-45 opacity-15 dark:opacity-20 pointer-events-none"
          style={{
            background: "linear-gradient(135deg, rgba(215, 182, 90, 0.2) 0%, rgba(23, 78, 166, 0.05) 50%, transparent 80%)",
            filter: "blur(40px)",
          }}
        />

        {/* ─── Layer 6: MAAYON Signature Sacred Astrolabe & Constellation Compass ─── */}
        <div className="absolute top-20 right-8 sm:right-16 w-[560px] h-[560px] opacity-15 dark:opacity-22 animate-spin-slow hidden sm:block pointer-events-none will-change-transform">
          <svg viewBox="0 0 400 400" className="w-full h-full">
            {/* Outer Cardinal Ring */}
            <circle cx="200" cy="200" r="190" fill="none" stroke="#D7B65A" strokeWidth="0.75" strokeDasharray="3 6" />
            <circle cx="200" cy="200" r="175" fill="none" stroke="#174EA6" strokeWidth="0.5" />
            
            {/* Astrological Ticks & Avenues */}
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
              <line
                key={deg}
                x1="200"
                y1="10"
                x2="200"
                y2="22"
                stroke="#D7B65A"
                strokeWidth="1"
                transform={`rotate(${deg} 200 200)`}
                opacity="0.8"
              />
            ))}

            {/* Sacred Concentric Geometric Circles */}
            <circle cx="200" cy="200" r="140" fill="none" stroke="#D7B65A" strokeWidth="0.4" strokeDasharray="8 8" />
            <circle cx="200" cy="200" r="105" fill="none" stroke="#174EA6" strokeWidth="0.75" />
            <circle cx="200" cy="200" r="70" fill="none" stroke="#B89432" strokeWidth="0.5" strokeDasharray="4 4" />
            <circle cx="200" cy="200" r="35" fill="none" stroke="#D7B65A" strokeWidth="0.6" />

            {/* Cardinal Crosshair Beams */}
            <line x1="200" y1="20" x2="200" y2="380" stroke="#D7B65A" strokeWidth="0.3" opacity="0.5" />
            <line x1="20" y1="200" x2="380" y2="200" stroke="#D7B65A" strokeWidth="0.3" opacity="0.5" />

            {/* Constellation Nodes */}
            <circle cx="200" cy="60" r="2.5" fill="#D7B65A" />
            <circle cx="340" cy="200" r="2.5" fill="#D7B65A" />
            <circle cx="200" cy="340" r="2.5" fill="#D7B65A" />
            <circle cx="60" cy="200" r="2.5" fill="#D7B65A" />
            <circle cx="200" cy="200" r="3" fill="#D7B65A" />
          </svg>
        </div>

        {/* Counter-rotating Secondary Sacred Ring */}
        <div className="absolute bottom-28 left-8 sm:left-14 w-[460px] h-[460px] opacity-10 dark:opacity-18 animate-spin-reverse hidden md:block pointer-events-none will-change-transform">
          <svg viewBox="0 0 300 300" className="w-full h-full">
            <circle cx="150" cy="150" r="140" fill="none" stroke="#174EA6" strokeWidth="0.6" strokeDasharray="6 8" />
            <circle cx="150" cy="150" r="100" fill="none" stroke="#D7B65A" strokeWidth="0.5" />
            <circle cx="150" cy="150" r="60" fill="none" stroke="#B89432" strokeWidth="0.4" strokeDasharray="3 5" />
            <polygon
              points="150,20 270,220 30,220"
              fill="none"
              stroke="#D7B65A"
              strokeWidth="0.35"
              opacity="0.6"
            />
            <polygon
              points="150,280 30,80 270,80"
              fill="none"
              stroke="#174EA6"
              strokeWidth="0.35"
              opacity="0.6"
            />
          </svg>
        </div>

        {/* ─── Layer 7: Precision Architectural Grid Pattern ─── */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.035] dark:opacity-08" />

        {/* ─── Layer 8: Soft Vignette Framing ─── */}
        <div className="absolute inset-0 bg-radial-vignette opacity-10 pointer-events-none dark:opacity-30" />
      </div>
    </div>
  );
}


