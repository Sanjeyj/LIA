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
      <div ref={containerRef} className="absolute inset-0 w-full h-full transition-transform ease-out">
        {/* Layer 1: Base Canvas */}
        <div className="cinematic-bg-base absolute inset-0 transition-colors duration-500" />

        {/* Layer 2: Light Mode Radial Gradients */}
        <div className="dark:hidden absolute -top-40 -left-40 w-[800px] h-[800px] rounded-full bg-radial-light-blue opacity-70 animate-drift-slow" />
        <div className="dark:hidden absolute top-1/4 -right-60 w-[850px] h-[850px] rounded-full bg-radial-light-gold opacity-65 animate-drift-reverse" />
        <div className="dark:hidden absolute bottom-1/3 -left-40 w-[750px] h-[750px] rounded-full bg-radial-light-ivory opacity-80 animate-drift-medium" />

        {/* Layer 2 (Dark Mode): Deep Obsidian Navy & Gold Atmosphere */}
        <div className="hidden dark:block absolute -top-40 -left-40 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-[#174EA6]/30 via-[#07111F]/50 to-transparent blur-[120px] animate-drift-slow" />
        <div className="hidden dark:block absolute top-1/4 -right-60 w-[850px] h-[850px] rounded-full bg-gradient-to-bl from-[#D7B65A]/20 via-[#0B1728]/40 to-transparent blur-[140px] animate-drift-reverse" />
        <div className="hidden dark:block absolute bottom-1/3 -left-40 w-[750px] h-[750px] rounded-full bg-gradient-to-tr from-[#071A3D]/40 via-[#040812] to-transparent blur-[120px] animate-drift-medium" />

        {/* Layer 3: Light Glass Blur Form */}
        <div className="dark:hidden absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[950px] h-[950px] bg-gradient-to-tr from-white/80 via-[#EAF1FF]/40 to-[#FCF8ED]/60 rounded-full blur-[120px]" />
        <div className="hidden dark:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[950px] h-[950px] bg-gradient-to-tr from-[#07111F]/80 via-[#0B1728]/60 to-transparent rounded-full blur-[140px]" />
        <div className="absolute top-2/3 right-1/4 w-[600px] h-[600px] bg-[#D7B65A]/10 rounded-full blur-[100px] dark:bg-[#D7B65A]/05" />

        {/* Layer 4: MAAYON Signature Delicate Geometric Arcs & Rings */}
        <div className="absolute top-24 right-12 w-[550px] h-[550px] opacity-10 animate-spin-slow hidden sm:block dark:opacity-15">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <circle cx="100" cy="100" r="95" fill="none" stroke="#D7B65A" strokeWidth="0.5" strokeDasharray="4 6" />
            <circle cx="100" cy="100" r="75" fill="none" stroke="#174EA6" strokeWidth="0.5" />
            <circle cx="100" cy="100" r="55" fill="none" stroke="#B89432" strokeWidth="0.3" strokeDasharray="2 4" />
          </svg>
        </div>

        <div className="absolute bottom-36 left-12 w-[450px] h-[450px] opacity-08 animate-spin-reverse hidden md:block dark:opacity-12">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <circle cx="100" cy="100" r="90" fill="none" stroke="#174EA6" strokeWidth="0.5" strokeDasharray="6 8" />
            <circle cx="100" cy="100" r="65" fill="none" stroke="#D7B65A" strokeWidth="0.4" />
          </svg>
        </div>

        {/* Layer 5: Extremely faint architectural grid texture (0.03 opacity) */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] dark:opacity-08" />

        {/* Layer 6: Soft atmospheric light vignette */}
        <div className="absolute inset-0 bg-radial-vignette opacity-10 pointer-events-none dark:opacity-40" />
      </div>
    </div>
  );
}

