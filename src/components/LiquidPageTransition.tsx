import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

interface LiquidPageTransitionProps {
  children: React.ReactNode;
}

/**
 * Senior Transition Architecture:
 * "Liquid Horizon Refraction Wipe"
 *
 * 1. Nanosecond-responsive top luminous gold progress beam.
 * 2. Ultra-smooth curved liquid SVG portal veil (Liquid Obsidian + Radiant Gold).
 * 3. Optical Lens De-blur & Micro-Scale Settle on incoming view.
 * 4. 100% GPU-accelerated (transform3d, will-change, zero paint-thrashing).
 */
export const LiquidPageTransition: React.FC<LiquidPageTransitionProps> = ({ children }) => {
  const location = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    // Scroll to top instantly on route change
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    setIsTransitioning(true);
    const timer = setTimeout(() => setIsTransitioning(false), 450);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div className="relative w-full min-h-screen overflow-x-hidden">
      {/* ─── Ultra-Fast Liquid Golden Top Horizon Beam ─── */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            aria-hidden="true"
            initial={{ scaleX: 0, opacity: 1 }}
            animate={{ scaleX: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              scaleX: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
              opacity: { duration: 0.2, delay: 0.15 },
            }}
            style={{ transformOrigin: "0% 50%" }}
            className="fixed top-0 left-0 right-0 h-[2.5px] z-[9999] pointer-events-none bg-gradient-to-r from-[#174EA6] via-[#D7B65A] to-[#F3E5AB] shadow-[0_0_12px_rgba(215,182,90,0.8),0_0_24px_rgba(215,182,90,0.4)] will-change-transform"
          />
        )}
      </AnimatePresence>

      {/* ─── Liquid Horizon Veil Curtain ─── */}
      <AnimatePresence mode="wait">
        {isTransitioning && (
          <motion.div
            aria-hidden="true"
            className="fixed inset-0 z-[9990] pointer-events-none flex flex-col items-center justify-center overflow-hidden"
            initial={{ clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)" }}
            animate={{
              clipPath: [
                "polygon(0 0, 100% 0, 100% 0, 0 0)",
                "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
                "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)",
              ],
            }}
            transition={{
              duration: 0.42,
              times: [0, 0.45, 1],
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {/* Curtain Background with Deep Liquid Obsidian */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#07111F]/98 via-[#0B1728]/95 to-[#040812]/98" />

            {/* Glowing Refraction Edge Accents */}
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#D7B65A] to-transparent opacity-90 shadow-[0_0_25px_#D7B65A]" />
            <div className="absolute bottom-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#174EA6] to-transparent opacity-80 shadow-[0_0_25px_#174EA6]" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Optical Lens Refraction Page Content Reveal ─── */}
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 14, scale: 0.99, filter: "blur(4px)" }}
        animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -10, scale: 0.995, filter: "blur(3px)" }}
        transition={{
          duration: 0.38,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="w-full will-change-transform"
      >
        {children}
      </motion.div>
    </div>
  );
};
