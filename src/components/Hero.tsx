import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, ArrowRight, Sparkles } from "lucide-react";
import { CLUB_INFO } from "../data/club";
import { InteractiveMaayonBg } from "./InteractiveMaayonBg";

interface HeroProps {
  onExploreClick?: () => void;
  onMeetClick?: () => void;
  onOpenJoinModal?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onExploreClick,
  onOpenJoinModal,
}) => {
  const shouldReduceMotion = useReducedMotion();

  const handleJoinClick = () => {
    if (onOpenJoinModal) {
      onOpenJoinModal();
    } else {
      const el = document.getElementById("join");
      el?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleProjectsClick = () => {
    if (onExploreClick) {
      onExploreClick();
    } else {
      const el = document.getElementById("projects");
      el?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.18,
        delayChildren: shouldReduceMotion ? 0 : 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0.1 : 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <section
      id="hero"
      className="relative min-h-[92vh] flex items-center justify-center pt-28 sm:pt-36 pb-20 bg-[#07111F] overflow-hidden"
    >
      {/* 3-4% Opacity Noise Texture Overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.035] pointer-events-none mix-blend-overlay z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Mouse-Tracked Interactive MAAYON Theme Flying Parallax Background */}
      <InteractiveMaayonBg opacity={0.28} scale={1.15} />

      {/* Soft Radial Gold & Blue Background Glow */}
      <div
        aria-hidden="true"
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] sm:w-[900px] h-[400px] bg-gradient-to-b from-[#C9A961]/15 via-[#152A4A]/25 to-transparent rounded-full blur-[140px] pointer-events-none -z-10"
      />
      <div
        aria-hidden="true"
        className="absolute top-10 right-10 w-[350px] h-[350px] bg-[#C9A961]/08 rounded-full blur-[100px] pointer-events-none -z-10"
      />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10 flex flex-col items-center w-full">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center w-full"
        >
          {/* 1. LIA Shield Crest Logo */}
          <motion.div variants={itemVariants} className="mb-6">
            <div className="relative p-3 sm:p-4 rounded-2xl bg-[#0E1F38] border border-white/10 shadow-2xl backdrop-blur-md">
              <img
                src="/assets/logos/lia-shield.png"
                alt="Rotaract Club of Lead India Ahead official shield crest"
                loading="eager"
                decoding="async"
                className="h-16 sm:h-20 md:h-24 w-auto object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)]"
              />
            </div>
          </motion.div>

          {/* 2. Tagline as Large Serif Headline in Sequence */}
          <motion.div variants={itemVariants} className="space-y-1 sm:space-y-2 mb-6">
            <h1 className="font-display font-serif font-bold text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-[#F5F1E8] tracking-tight leading-tight">
              Together, We <span className="text-[#C9A961]">Lead.</span>
            </h1>
            <h1 className="font-display font-serif font-bold text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-[#F5F1E8] tracking-tight leading-tight">
              Together, We <span className="text-[#C9A961]">Serve.</span>
            </h1>
            <h1 className="font-display font-serif font-bold text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-[#F5F1E8] tracking-tight leading-tight">
              Together, We <span className="text-[#C9A961]">Grow.</span>
            </h1>
          </motion.div>

          {/* 3. Short Sub-line: Club Name & Rotary Year */}
          <motion.div variants={itemVariants} className="mb-8">
            <p className="text-xs sm:text-sm md:text-base text-[#8E9DAE] font-medium tracking-wide flex flex-wrap items-center justify-center gap-2">
              <span className="text-[#F5F1E8] font-semibold">{CLUB_INFO.name}</span>
              <span className="text-[#C9A961]">•</span>
              <span>Rotary Year 2026–27</span>
              <span className="text-[#C9A961]">•</span>
              <span>District 3206</span>
            </p>
          </motion.div>

          {/* 4. Two Buttons: Primary Gold "Join Us" & Outline "Our Projects" */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
          >
            <button
              onClick={handleJoinClick}
              className="w-full sm:w-auto px-8 py-3.5 sm:py-4 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider text-[#07111F] bg-[#C9A961] hover:bg-[#DFCA95] transition-all transform hover:-translate-y-0.5 shadow-xl flex items-center justify-center space-x-2 group cursor-pointer"
            >
              <span>Join Us</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            <button
              onClick={handleProjectsClick}
              className="w-full sm:w-auto px-8 py-3.5 sm:py-4 rounded-full text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#F5F1E8] bg-[#0E1F38] hover:bg-[#152A4A] border border-[#C9A961]/40 transition-all transform hover:-translate-y-0.5 flex items-center justify-center space-x-2 cursor-pointer shadow-md"
            >
              <span>Our Projects</span>
            </button>
          </motion.div>

          {/* 5. Scroll-down Indicator */}
          <motion.a
            href="#about"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: shouldReduceMotion ? 0 : 1.2 }}
            className="inline-flex flex-col items-center mt-16 sm:mt-20 text-[#8E9DAE] hover:text-[#C9A961] transition-colors group cursor-pointer"
            aria-label="Scroll down to About section"
          >
            <span className="text-[10px] uppercase font-bold tracking-widest mb-1.5">Scroll to explore</span>
            <ArrowDown className="w-4 h-4 animate-bounce text-[#C9A961]" aria-hidden="true" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};
