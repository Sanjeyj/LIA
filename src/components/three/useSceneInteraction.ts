import { useEffect, useRef, useState } from "react";

export function useSceneInteraction() {
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const scrollRef = useRef({ scrollY: 0, scrollRatio: 0 });
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check reduced motion preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);
    const handleMotionChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handleMotionChange);

    // Check mobile screen
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);

    // Mouse movement listener (smooth normalized -1 to 1)
    const handleMouseMove = (e: MouseEvent) => {
      if (mediaQuery.matches) return;
      const targetX = (e.clientX / window.innerWidth) * 2 - 1;
      const targetY = -(e.clientY / window.innerHeight) * 2 + 1;
      mouseRef.current.targetX = targetX;
      mouseRef.current.targetY = targetY;
    };

    // Scroll listener
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const heroHeight = window.innerHeight;
      const scrollRatio = Math.min(1, scrollY / heroHeight);
      scrollRef.current = { scrollY, scrollRatio };
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      mediaQuery.removeEventListener("change", handleMotionChange);
      window.removeEventListener("resize", checkMobile);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return { mouseRef, scrollRef, reducedMotion, isMobile };
}
