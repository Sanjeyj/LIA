import { motion } from "framer-motion";
import { Sparkles, Shield, Compass, Star, BookOpen } from "lucide-react";
import { CLUB_INFO } from "../data/club";
import { MemberAvatar } from "./MemberAvatar";
import { SectionReveal } from "./SectionReveal";
import { InteractiveMaayonBg } from "./InteractiveMaayonBg";

export const MaayonSection = () => {
  return (
    <section
      id="maayon"
      className="py-24 sm:py-32 scroll-mt-28 sm:scroll-mt-36 relative overflow-hidden border-y border-slate-200/60 dark:border-[#D7B65A]/20"
    >
      {/* Dynamic Mouse-Tracked MAAYON Background Insignia (Infinity Loop + Rotary Gear Wheel) */}
      <InteractiveMaayonBg opacity={0.22} scale={1.2} />
      {/* Background ambient light forms */}
      <div aria-hidden="true" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-[#EAF1FF]/50 via-white/80 to-[#FCF8ED]/60 rounded-full blur-[130px] pointer-events-none -z-10 dark:opacity-20" />

      {/* Subtle fine concentric circles */}
      <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10 dark:opacity-20">
        <div className="w-[500px] h-[500px] rounded-full border border-[#D7B65A]/25" />
        <div className="absolute w-[800px] h-[800px] rounded-full border border-[#D7B65A]/15" />
        <div className="absolute w-[1100px] h-[1100px] rounded-full border border-[#D7B65A]/08" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionReveal>

        {/* ── Section Header: TEAM LIA Annual Identity ── */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-2.5 px-4 py-1.5 rounded-full glass-card border border-[#D7B65A]/40 backdrop-blur-md shadow-sm mb-4"
          >
            <Sparkles className="w-4 h-4 text-[#B89432] dark:text-[#D7B65A]" aria-hidden="true" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#B89432] dark:text-[#E8D89A]">
              Annual Identity • Rotary Year 2026–27
            </span>
          </motion.div>

          <h2 className="font-heading font-extrabold text-3xl sm:text-5xl md:text-6xl text-slate-900 dark:text-white tracking-tight leading-tight">
            TEAM <span className="gold-gradient-text">LIA</span>
          </h2>

          <p className="text-slate-700 dark:text-slate-300 text-sm sm:text-lg mt-3 sm:mt-4 font-semibold italic">
            "{CLUB_INFO.teamThemeTagline}"
          </p>

          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-2 sm:mt-3 font-normal max-w-xl mx-auto">
            {CLUB_INFO.teamThemeVision}
          </p>
        </div>

        {/* ── Main Content: TEAM LIA + MAAYON Relationship ── */}
        <div className="relative glass-card rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-12 border border-white/90 dark:border-[#D7B65A]/35 shadow-md backdrop-blur-xl overflow-hidden bg-white/70 dark:bg-white/5">
          {/* Corner accent lines */}
          <div aria-hidden="true" className="absolute top-0 left-0 w-12 sm:w-16 h-12 sm:h-16 border-t-2 border-l-2 border-[#D7B65A]/40 rounded-tl-2xl sm:rounded-tl-3xl" />
          <div aria-hidden="true" className="absolute bottom-0 right-0 w-12 sm:w-16 h-12 sm:h-16 border-b-2 border-r-2 border-[#D7B65A]/40 rounded-br-2xl sm:rounded-br-3xl" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 items-center">

            {/* Left: MAAYON Presidential Theme Panel */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center p-5 sm:p-7 glass-card rounded-2xl border border-white/80 dark:border-[#D7B65A]/25 shadow-sm bg-white/80 dark:bg-white/5">
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                className="relative group w-full flex items-center justify-center"
              >
                <div aria-hidden="true" className="absolute -inset-3 bg-gradient-to-r from-[#D7B65A]/30 via-[#00C4CC]/25 to-[#174EA6]/30 rounded-3xl blur-lg opacity-80 group-hover:opacity-100 transition-opacity" />
                <div className="relative bg-white/95 dark:bg-[#07111F]/90 border border-[#D7B65A]/45 rounded-2xl sm:rounded-3xl p-2 sm:p-3 shadow-xl flex items-center justify-center w-full overflow-hidden">
                  <img
                    src="/assets/logos/maayon-official.jpg"
                    alt="MAAYON 2026-27 presidential theme official image"
                    loading="lazy"
                    decoding="async"
                    className="w-full h-auto max-h-[360px] sm:max-h-[440px] object-contain rounded-xl sm:rounded-2xl filter drop-shadow-md transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              </motion.div>

              <div className="mt-4 sm:mt-6 text-center flex flex-col items-center space-y-1.5">
                <div className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-[#B89432] dark:text-[#E8D89A]">
                  Presidential Theme Insignia
                </div>
                <div className="text-sm sm:text-base font-heading font-bold text-slate-900 dark:text-white">
                  MAAYON 2026–27
                </div>

                {/* President Avatar Badge */}
                <div className="pt-2 flex items-center space-x-2 bg-slate-900/5 dark:bg-white/5 border border-slate-900/10 dark:border-white/10 px-3 py-1.5 rounded-full shadow-sm">
                  <MemberAvatar
                    src="/assets/members/hariharan.jpg"
                    name={CLUB_INFO.president.name}
                    size="sm"
                    className="w-7 h-7 rounded-full border border-[#D7B65A]/40 shrink-0"
                  />
                  <div className="text-left">
                    <div className="text-[11px] font-bold text-slate-900 dark:text-white leading-tight">
                      {CLUB_INFO.president.name}
                    </div>
                    <div className="text-[9px] text-[#B89432] dark:text-[#D7B65A] uppercase tracking-wider font-semibold">
                      Club President
                    </div>
                  </div>
                </div>

                <div className="text-[10px] text-slate-500 dark:text-slate-400 pt-1">
                  Rotaract Club of Lead India Ahead
                </div>
              </div>

              {/* MAAYON distinction label */}
              <div className="mt-4 px-3 py-1.5 rounded-full bg-[#D7B65A]/10 border border-[#D7B65A]/25 text-[10px] font-semibold text-[#B89432] dark:text-[#D7B65A] uppercase tracking-widest">
                Presidential Chapter
              </div>
            </div>

            {/* Right: Theme Content */}
            <div className="lg:col-span-7 space-y-5 sm:space-y-6 text-left">

              {/* TEAM LIA identity label */}
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-[#D7B65A]/10 border border-[#D7B65A]/30 text-xs font-semibold text-[#B89432] dark:text-[#E8D89A] uppercase tracking-wider">
                <Shield className="w-3.5 h-3.5 text-[#B89432] dark:text-[#D7B65A]" aria-hidden="true" />
                <span>TEAM LIA — 2026–27 Annual Identity</span>
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <div className="flex items-center space-x-2 text-xs font-semibold text-[#B89432] dark:text-[#D7B65A] uppercase tracking-wider">
                  <BookOpen className="w-4 h-4 text-[#B89432] dark:text-[#D7B65A]" aria-hidden="true" />
                  <span>Theme Statement</span>
                </div>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-heading font-bold text-slate-900 dark:text-white leading-snug">
                  {CLUB_INFO.teamThemeTagline}
                </h3>
              </div>

              {/* Theme statement vision card */}
              <div className="p-4 sm:p-6 rounded-2xl bg-white/80 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10 shadow-sm relative">
                <div className="text-xs font-mono uppercase text-[#B89432] dark:text-[#D7B65A] mb-2 flex items-center space-x-1.5">
                  <Star className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Vision</span>
                </div>
                <p className="text-slate-700 dark:text-slate-200 text-xs sm:text-sm md:text-base leading-relaxed">
                  {CLUB_INFO.teamThemeVision}
                </p>
                <div className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 mt-3 pt-3 border-t border-slate-200/60 dark:border-white/5 flex flex-col xs:flex-row xs:items-center justify-between gap-1">
                  <span>Rotaract Club of Lead India Ahead</span>
                  <span className="font-semibold text-slate-900 dark:text-white">Rotary Year 2026–27</span>
                </div>
              </div>

              {/* Guiding Tenets */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex items-start space-x-3 p-3.5 rounded-xl bg-white/70 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 shadow-sm">
                  <Compass className="w-5 h-5 text-[#B89432] dark:text-[#D7B65A] shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Strategic Focus</h4>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
                      High-accountability community service and sustainable social value.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3.5 rounded-xl bg-white/70 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 shadow-sm">
                  <Shield className="w-5 h-5 text-[#174EA6] shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">District Alignment</h4>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
                      Active collaboration across District 3206 and Rotary Texcity.
                    </p>
                  </div>
                </div>
              </div>

              {/* MAAYON publication bar */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-[#D7B65A]/10 via-[#EAF1FF]/40 to-[#174EA6]/10 dark:from-[#D7B65A]/08 dark:to-[#174EA6]/08 border border-[#D7B65A]/25 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-sm">
                <div className="flex items-start space-x-3">
                  <BookOpen className="w-5 h-5 text-[#B89432] dark:text-[#D7B65A] shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">MAAYON Annual Publication</div>
                    <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                      The editorial identity — story, vision and impact of the year.
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  aria-label="Explore MAAYON gallery"
                  className="shrink-0 px-4 py-2 rounded-full text-xs font-semibold bg-[#D7B65A]/15 border border-[#D7B65A]/35 text-[#B89432] dark:text-[#D7B65A] hover:bg-[#D7B65A]/25 transition-colors whitespace-nowrap cursor-pointer"
                  onClick={() => {
                    const el = document.getElementById("gallery");
                    el?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  Explore MAAYON
                </button>
              </div>

            </div>
          </div>
        </div>

        </SectionReveal>
      </div>
    </section>
  );
};
