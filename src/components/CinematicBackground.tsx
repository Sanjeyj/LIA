import { useEffect, useRef } from "react";

export function CinematicBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const parallaxRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, scrollY: 0 });

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    // Subtle pointer parallax listener
    const handleMouseMove = (e: MouseEvent) => {
      if (motionQuery.matches || window.innerWidth <= 768) return;
      const targetX = (e.clientX / window.innerWidth - 0.5) * 20; // max ±10px shift
      const targetY = (e.clientY / window.innerHeight - 0.5) * 20;
      parallaxRef.current.targetX = targetX;
      parallaxRef.current.targetY = targetY;
    };

    // Scroll parallax listener
    const handleScroll = () => {
      parallaxRef.current.scrollY = window.scrollY * 0.04;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });

    let animationFrameId: number;
    const animate = () => {
      if (!motionQuery.matches && containerRef.current) {
        const p = parallaxRef.current;
        p.x += (p.targetX - p.x) * 0.05;
        p.y += (p.targetY - p.y) * 0.05;

        containerRef.current.style.transform = `translate3d(${p.x.toFixed(2)}px, ${(p.y + p.scrollY).toFixed(2)}px, 0)`;
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    if (!motionQuery.matches) {
      animationFrameId = requestAnimationFrame(animate);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden select-none"
    >
      <div
        ref={containerRef}
        className="absolute inset-0 w-full h-full will-change-transform"
        style={{ transform: "translate3d(0, 0, 0)" }}
      >
        {/* Layer 1: Base Canvas */}
        <div className="cinematic-bg-base absolute inset-0 transition-colors duration-500" />

        {/* Layer 2: Light Mode Radial Gradients - zero blur GPU shaders */}
        <div
          className="dark:hidden absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full opacity-60 pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(23,78,166,0.12) 0%, rgba(23,78,166,0.03) 50%, transparent 70%)",
            willChange: "transform",
          }}
        />
        <div
          className="dark:hidden absolute top-1/4 -right-40 w-[750px] h-[750px] rounded-full opacity-55 pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(215,182,90,0.14) 0%, rgba(215,182,90,0.03) 55%, transparent 70%)",
            willChange: "transform",
          }}
        />
        <div
          className="dark:hidden absolute bottom-1/3 -left-40 w-[650px] h-[650px] rounded-full opacity-70 pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(247,248,250,0.8) 0%, transparent 70%)",
          }}
        />

        {/* Layer 2 (Dark Mode): Deep Obsidian Navy & Gold Atmosphere - Ultra-Smooth GPU Radial Gradients */}
        <div
          className="hidden dark:block absolute -top-40 -left-40 w-[750px] h-[750px] rounded-full opacity-75 pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(23,78,166,0.22) 0%, rgba(7,17,31,0.15) 45%, transparent 70%)",
            willChange: "transform",
          }}
        />
        <div
          className="hidden dark:block absolute top-1/4 -right-40 w-[800px] h-[800px] rounded-full opacity-70 pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(215,182,90,0.13) 0%, rgba(11,23,40,0.12) 50%, transparent 70%)",
            willChange: "transform",
          }}
        />
        <div
          className="hidden dark:block absolute bottom-1/3 -left-40 w-[700px] h-[700px] rounded-full opacity-80 pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(7,26,61,0.28) 0%, transparent 65%)",
          }}
        />

        {/* Layer 3: Subtle Central Ambience */}
        <div
          className="dark:hidden absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-40 pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(234,241,255,0.6) 0%, transparent 65%)",
          }}
        />
        <div
          className="hidden dark:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[850px] rounded-full opacity-45 pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(11,23,40,0.5) 0%, transparent 70%)",
          }}
        />

        {/* Layer 4: MAAYON Signature Delicate Geometric Arcs & Rings */}
        <div className="absolute top-24 right-12 w-[500px] h-[500px] opacity-10 animate-spin-slow hidden sm:block dark:opacity-15 pointer-events-none will-change-transform">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <circle cx="100" cy="100" r="95" fill="none" stroke="#D7B65A" strokeWidth="0.5" strokeDasharray="4 6" />
            <circle cx="100" cy="100" r="75" fill="none" stroke="#174EA6" strokeWidth="0.5" />
            <circle cx="100" cy="100" r="55" fill="none" stroke="#B89432" strokeWidth="0.3" strokeDasharray="2 4" />
          </svg>
        </div>

        <div className="absolute bottom-36 left-12 w-[400px] h-[400px] opacity-08 animate-spin-reverse hidden md:block dark:opacity-12 pointer-events-none will-change-transform">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <circle cx="100" cy="100" r="90" fill="none" stroke="#174EA6" strokeWidth="0.5" strokeDasharray="6 8" />
            <circle cx="100" cy="100" r="65" fill="none" stroke="#D7B65A" strokeWidth="0.4" />
          </svg>
        </div>

        {/* Layer 5: Architectural grid texture */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] dark:opacity-08" />

        {/* Layer 6: Soft atmospheric light vignette */}
        <div className="absolute inset-0 bg-radial-vignette opacity-10 pointer-events-none dark:opacity-30" />
      </div>
    </div>
  );
}

