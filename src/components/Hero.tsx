import React from "react";
import { motion } from "framer-motion";
import { ArrowDown, Users, ChevronRight, Sparkles } from "lucide-react";
import { CLUB_INFO } from "../data/club";
import { MemberAvatar } from "./MemberAvatar";
import { LiquidGlassScene } from "./three/LiquidGlassScene";
import { InteractiveMaayonBg } from "./InteractiveMaayonBg";

interface HeroProps {
  onExploreClick: () => void;
  onMeetClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick, onMeetClick }) => {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center pt-28 sm:pt-36 pb-20 overflow-hidden"
    >
      {/* Dynamic Mouse-Tracked Exact MAAYON Poster Image Background */}
      <InteractiveMaayonBg opacity={0.25} scale={1.1} />

      {/* Ambient background soft light glows */}
      <div aria-hidden="true" className="dark:hidden absolute -top-20 -left-40 w-[600px] h-[600px] bg-gradient-to-tr from-[#EAF1FF]/60 via-white/80 to-[#FCFBF7]/50 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div aria-hidden="true" className="hidden dark:block absolute -top-20 -left-40 w-[600px] h-[600px] bg-gradient-to-tr from-[#174EA6]/20 via-[#07111F]/60 to-transparent rounded-full blur-[120px] pointer-events-none -z-10" />
      <div aria-hidden="true" className="absolute bottom-10 -right-40 w-[550px] h-[550px] bg-[#D7B65A]/12 dark:bg-[#D7B65A]/08 rounded-full blur-[110px] pointer-events-none -z-10" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10 flex flex-col items-center w-full">

        {/* Rotary Year Badge Pill */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="section-badge-gold mb-6 sm:mb-8 shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#B89432] dark:text-[#D7B65A] shrink-0" aria-hidden="true" />
          <span>TEAM LIA · 2026–27 • Rotaract District 3206</span>
        </motion.div>

        {/* TEAM LIA Brand Identity & MAAYON Crest */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center mb-6 sm:mb-8"
        >
          {/* LIA Shield + MAAYON Crest row */}
          <div className="flex items-center gap-4 sm:gap-6 mb-5">
            <div className="relative group">
              <div aria-hidden="true" className="absolute -inset-2 bg-gradient-to-r from-[#D7B65A]/20 via-[#174EA6]/15 to-[#D7B65A]/20 rounded-2xl blur-md opacity-60 group-hover:opacity-100 transition-opacity" />
              <div className="relative glass-card rounded-2xl p-3 sm:p-4 backdrop-blur-xl shadow-md border border-white/80 dark:border-white/14 flex items-center justify-center bg-white/70 dark:bg-white/5">
                <img
                  src="/assets/logos/lia-shield.png"
                  alt="Rotaract Club of Lead India Ahead shield crest"
                  loading="eager"
                  decoding="async"
                  className="h-10 sm:h-14 md:h-16 w-auto object-contain filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.08)] dark:drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]"
                />
              </div>
            </div>

            <div aria-hidden="true" className="w-px h-10 sm:h-14 bg-gradient-to-b from-transparent via-[#D7B65A]/40 to-transparent" />

            <div className="relative group">
              <div aria-hidden="true" className="absolute -inset-2 bg-gradient-to-r from-[#D7B65A]/30 via-[#00C4CC]/20 to-[#174EA6]/30 rounded-2xl blur-md opacity-75 group-hover:opacity-100 transition-opacity" />
              <div className="relative bg-white/95 dark:bg-[#07111F]/90 border border-[#D7B65A]/45 rounded-2xl p-2 sm:p-3 shadow-md flex items-center justify-center overflow-hidden">
                <img
                  src="/assets/logos/maayon-official.jpg"
                  alt="MAAYON 2026-27 Presidential Theme poster"
                  loading="eager"
                  decoding="async"
                  className="h-16 sm:h-24 md:h-28 w-auto object-contain rounded-lg filter drop-shadow-sm transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            </div>
          </div>

          {/* President Profile Badge */}
          <div className="flex items-center space-x-2 text-[11px] sm:text-xs font-medium text-slate-700 dark:text-slate-300 glass-subtle px-3.5 py-1.5 rounded-full shadow-sm border border-white/80 dark:border-white/12">
            <MemberAvatar
              src="/assets/members/hariharan.jpg"
              name={CLUB_INFO.president.name}
              size="sm"
              className="w-6 h-6 rounded-full border border-[#D7B65A]/50 shrink-0"
            />
            <span className="text-slate-500 dark:text-slate-400">President:</span>
            <span className="font-bold text-slate-900 dark:text-white tracking-wide">
              {CLUB_INFO.president.name}
            </span>
          </div>
        </motion.div>

        {/* Primary TEAM LIA Editorial Heading */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.35 }}
          className="space-y-4 sm:space-y-6 max-w-4xl w-full"
        >
          <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] sm:text-xs font-bold tracking-widest uppercase text-slate-500 dark:text-slate-400">
            <span>Since {CLUB_INFO.established}</span>
            <span className="text-[#B89432] dark:text-[#D7B65A]">•</span>
            <span>{CLUB_INFO.district}</span>
            <span className="text-[#B89432] dark:text-[#D7B65A]">•</span>
            <span>Coimbatore</span>
          </div>

          <div className="space-y-2">
            <h1 className="font-heading font-extrabold text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-slate-900 dark:text-white leading-[1.04] editorial-heading">
              TEAM <span className="gold-gradient-text">LIA</span>
            </h1>
            <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-[#B89432] dark:text-[#D7B65A]">
              {CLUB_INFO.rotaryYear}
            </p>
          </div>

          <div className="pt-1">
            <p className="hero-tagline text-base sm:text-xl md:text-2xl font-heading font-semibold text-slate-800 dark:text-slate-100 leading-snug">
              {CLUB_INFO.teamThemeTagline.split(". ").map((line, i, arr) => (
                <React.Fragment key={i}>
                  {line}{i < arr.length - 1 ? "." : ""}
                  {i < arr.length - 1 && <br className="hidden sm:block" />}
                  {i < arr.length - 1 && <span className="sm:hidden"> </span>}
                </React.Fragment>
              ))}
            </p>
          </div>

          <p className="max-w-2xl mx-auto text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-300 font-normal leading-relaxed pt-1 px-2">
            One team. One purpose. A year dedicated to leadership, service, fellowship and meaningful impact — from the{" "}
            <span className="text-slate-900 dark:text-white font-semibold">Rotaract Club of Lead India Ahead</span>.
          </p>
        </motion.div>

        {/* Light Liquid Glass CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-8 sm:mt-10 w-full sm:w-auto"
        >
          <a
            href="/team"
            className="w-full sm:w-auto btn-liquid-primary px-8 py-3.5 rounded-full text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center space-x-2 group focus-ring shadow-sm"
          >
            <Users className="w-4 h-4" aria-hidden="true" />
            <span>Explore Team</span>
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </a>

          <button
            onClick={onExploreClick}
            className="w-full sm:w-auto btn-liquid-glass px-8 py-3.5 rounded-full text-xs sm:text-sm font-semibold flex items-center justify-center space-x-2 focus-ring cursor-pointer shadow-sm"
          >
            <span>Our Projects</span>
          </button>

          <button
            onClick={onMeetClick}
            className="w-full sm:w-auto px-6 py-3.5 rounded-full text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-900/5 dark:hover:bg-white/5 transition-all focus-ring cursor-pointer"
          >
            <span>Meet Our Members</span>
          </button>
        </motion.div>

        {/* Floating Light Liquid Glass Metadata Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.65 }}
          className="mt-12 sm:mt-16 w-full max-w-3xl glass-card rounded-3xl p-5 sm:p-6 border border-white/90 dark:border-white/14 shadow-md backdrop-blur-xl"
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center divide-y sm:divide-y-0 sm:divide-x divide-slate-200/60 dark:divide-white/10">
            <div className="pt-2 sm:pt-0">
              <div className="text-xl sm:text-3xl font-heading font-extrabold text-[#B89432] dark:text-[#E8D89A]">2012</div>
              <div className="text-[10px] sm:text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">Established</div>
            </div>
            <div className="pt-2 sm:pt-0">
              <div className="text-xl sm:text-3xl font-heading font-extrabold text-slate-900 dark:text-white">Dist. 3206</div>
              <div className="text-[10px] sm:text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">Rotaract District</div>
            </div>
            <div className="pt-2 sm:pt-0">
              <div className="text-xl sm:text-3xl font-heading font-extrabold text-slate-900 dark:text-white">90062</div>
              <div className="text-[10px] sm:text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">Club ID • Grp 1/4</div>
            </div>
            <div className="pt-2 sm:pt-0">
              <div className="text-xl sm:text-3xl font-heading font-extrabold text-[#B89432] dark:text-[#D7B65A]">Texcity</div>
              <div className="text-[10px] sm:text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">Sponsor Rotary Club</div>
            </div>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.a
          href="#about"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.85 }}
          className="inline-flex flex-col items-center mt-12 text-slate-500 dark:text-slate-400 hover:text-[#B89432] dark:hover:text-[#D7B65A] transition-colors group cursor-pointer focus-ring rounded-full p-2"
          aria-label="Scroll down to About section"
        >
          <span className="text-[10px] uppercase font-bold tracking-widest mb-1.5">Scroll to explore</span>
          <ArrowDown className="w-4 h-4 animate-bounce text-[#B89432] dark:text-[#D7B65A]" aria-hidden="true" />
        </motion.a>
      </div>
    </section>
  );
};
