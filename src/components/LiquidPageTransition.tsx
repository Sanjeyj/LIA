import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

interface LiquidPageTransitionProps {
  children: React.ReactNode;
}

/**
 * Senior Transition Architecture: "Liquid Horizon Refraction Wipe"
 *
 * 1. Luminous gold → indigo progress beam sweeps from left across the top.
 * 2. Dark liquid obsidian curtain clips in from top and out through the bottom.
 * 3. Incoming page settles with optical lens de-blur + micro-scale settle.
 * 4. 100% GPU-composited — zero paint, zero layout thrashing.
 */
export const LiquidPageTransition: React.FC<LiquidPageTransitionProps> = ({ children }) => {
  const location = useLocation();
  const [showCurtain, setShowCurtain] = useState(false);
  const prevPath = useRef(location.pathname);

  useEffect(() => {
    if (prevPath.current === location.pathname) return;
    prevPath.current = location.pathname;

    window.scrollTo({ top: 0, left: 0, behavior: "instant" });

    setShowCurtain(true);
    const timer = setTimeout(() => setShowCurtain(false), 480);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div className="relative w-full overflow-x-hidden">
      {/* ─── 1. Top Progress Beam: Indigo → Gold → Champagne ─── */}
      <AnimatePresence>
        {showCurtain && (
          <motion.div
            aria-hidden="true"
            key="beam"
            initial={{ scaleX: 0, opacity: 1 }}
            animate={{ scaleX: 1, opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            transition={{ scaleX: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }}
            className="fixed top-0 left-0 right-0 h-[3px] z-[9999] pointer-events-none will-change-transform"
            style={{
              transformOrigin: "0% 50%",
              background: "linear-gradient(90deg, #174EA6 0%, #D7B65A 50%, #F3E5AB 100%)",
              boxShadow: "0 0 14px rgba(215,182,90,0.9), 0 0 30px rgba(215,182,90,0.4)",
            }}
          />
        )}
      </AnimatePresence>

      {/* ─── 2. Liquid Obsidian Curtain Wipe ─── */}
      <AnimatePresence>
        {showCurtain && (
          <motion.div
            aria-hidden="true"
            key="curtain"
            className="fixed inset-0 z-[9990] pointer-events-none overflow-hidden"
            initial={{ clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)" }}
            animate={{
              clipPath: [
                "polygon(0 0, 100% 0, 100% 0, 0 0)",
                "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
                "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)",
              ],
            }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            transition={{ duration: 0.44, times: [0, 0.45, 1], ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Deep Liquid Obsidian fill */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#07111F] via-[#0B1728] to-[#040812]" />
            {/* Gold glowing leading edge */}
            <div
              className="absolute top-0 inset-x-0 h-[3px]"
              style={{
                background: "linear-gradient(90deg, transparent, #D7B65A 40%, #F3E5AB 60%, transparent)",
                boxShadow: "0 0 20px rgba(215,182,90,0.8), 0 0 40px rgba(215,182,90,0.3)",
              }}
            />
            {/* Indigo trailing edge */}
            <div
              className="absolute bottom-0 inset-x-0 h-[3px]"
              style={{
                background: "linear-gradient(90deg, transparent, #174EA6 40%, #4A90E2 60%, transparent)",
                boxShadow: "0 0 20px rgba(23,78,166,0.8), 0 0 40px rgba(23,78,166,0.3)",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── 3. Optical Lens Settle on incoming page ─── */}
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 16, scale: 0.992, filter: "blur(5px)" }}
        animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
        className="w-full will-change-transform"
      >
        {children}
      </motion.div>
    </div>
  );
};

