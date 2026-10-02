import { motion } from "framer-motion";
import { Shield, Compass, Star, BookOpen } from "lucide-react";
import { CLUB_INFO } from "../data/club";
import { MemberAvatar } from "./MemberAvatar";
import { Section, SectionHeading } from "./Section";
import { SectionReveal } from "./SectionReveal";
import { InteractiveMaayonBg } from "./InteractiveMaayonBg";

export const MaayonSection = () => {
  return (
    <Section id="maayon" className="bg-[#07111F] border-y border-white/5 overflow-hidden">
      {/* Dynamic Mouse-Tracked MAAYON Background Insignia */}
      <InteractiveMaayonBg opacity={0.15} scale={1.2} />

      {/* Subtle fine concentric circles */}
      <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
        <div className="w-[500px] h-[500px] rounded-full border border-[#C9A961]/25" />
        <div className="absolute w-[800px] h-[800px] rounded-full border border-[#C9A961]/15" />
        <div className="absolute w-[1100px] h-[1100px] rounded-full border border-[#C9A961]/08" />
      </div>

      <SectionReveal>
        <SectionHeading
          badge="Annual Identity • Rotary Year 2026–27"
          title="TEAM LIA"
          subtitle={`"${CLUB_INFO.teamThemeTagline}"`}
        />

        {/* ── Main Content: TEAM LIA + MAAYON Relationship ── */}
        <div className="relative rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-12 border border-[#C9A961]/35 shadow-2xl overflow-hidden bg-[#0E1F38]/90 backdrop-blur-md">
          {/* Corner accent lines */}
          <div aria-hidden="true" className="absolute top-0 left-0 w-12 sm:w-16 h-12 sm:h-16 border-t-2 border-l-2 border-[#C9A961]/40 rounded-tl-2xl sm:rounded-tl-3xl" />
          <div aria-hidden="true" className="absolute bottom-0 right-0 w-12 sm:w-16 h-12 sm:h-16 border-b-2 border-r-2 border-[#C9A961]/40 rounded-br-2xl sm:rounded-br-3xl" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 items-center">

            {/* Left: MAAYON Presidential Theme Panel */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center p-5 sm:p-7 rounded-2xl border border-white/10 shadow-lg bg-[#07111F]/80">
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                className="relative group w-full flex items-center justify-center"
              >
                <div aria-hidden="true" className="absolute -inset-3 bg-[#C9A961]/15 rounded-3xl blur-lg opacity-80 group-hover:opacity-100 transition-opacity" />
                <div className="relative bg-[#07111F] border border-[#C9A961]/45 rounded-2xl sm:rounded-3xl p-2 sm:p-3 shadow-xl flex items-center justify-center w-full overflow-hidden">
                  <img
                    src="/assets/logos/maayon-official.jpg"
                    alt="MAAYON 2026-27 presidential theme official image"
                    loading="eager"
                    decoding="async"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = "/assets/logos/maayon-theme.png";
                    }}
                    className="w-full h-auto max-h-[360px] sm:max-h-[440px] object-contain rounded-xl sm:rounded-2xl filter drop-shadow-md transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              </motion.div>

              <div className="mt-4 sm:mt-6 text-center flex flex-col items-center space-y-1.5">
                <div className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-[#C9A961]">
                  Presidential Theme Insignia
                </div>
                <div className="text-sm sm:text-base font-display font-serif font-bold text-[#F5F1E8]">
                  MAAYON 2026–27
                </div>

                {/* President Avatar Badge */}
                <div className="pt-2 flex items-center space-x-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full shadow-sm">
                  <MemberAvatar
                    src="/assets/members/hariharan.jpg"
                    name={CLUB_INFO.president.name}
                    size="sm"
                    className="!w-9 !h-9 rounded-full border border-[#C9A961]/40 shrink-0"
                  />
                  <div className="text-left">
                    <div className="text-[11px] font-bold text-[#F5F1E8] leading-tight">
                      {CLUB_INFO.president.name}
                    </div>
                    <div className="text-[9px] text-[#C9A961] uppercase tracking-wider font-semibold">
                      Club President
                    </div>
                  </div>
                </div>

                <div className="text-[10px] text-[#8E9DAE] pt-1">
                  Rotaract Club of Lead India Ahead
                </div>
              </div>

              {/* MAAYON distinction label */}
              <div className="mt-4 px-3 py-1.5 rounded-full bg-[#C9A961]/10 border border-[#C9A961]/25 text-[10px] font-semibold text-[#C9A961] uppercase tracking-widest">
                Presidential Chapter
              </div>
            </div>

            {/* Right: Theme Content */}
            <div className="lg:col-span-7 space-y-5 sm:space-y-6 text-left">

              {/* TEAM LIA identity label */}
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-[#C9A961]/10 border border-[#C9A961]/30 text-xs font-semibold text-[#C9A961] uppercase tracking-wider">
                <Shield className="w-3.5 h-3.5 text-[#C9A961]" aria-hidden="true" />
                <span>TEAM LIA — 2026–27 Annual Identity</span>
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <div className="flex items-center space-x-2 text-xs font-semibold text-[#C9A961] uppercase tracking-wider">
                  <BookOpen className="w-4 h-4 text-[#C9A961]" aria-hidden="true" />
                  <span>Theme Statement</span>
                </div>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-display font-serif font-bold text-[#F5F1E8] leading-snug">
                  {CLUB_INFO.teamThemeTagline}
                </h3>
              </div>

              {/* Theme statement vision card */}
              <div className="p-4 sm:p-6 rounded-2xl bg-[#07111F]/80 border border-white/10 shadow-sm relative">
                <div className="text-xs font-mono uppercase text-[#C9A961] mb-2 flex items-center space-x-1.5">
                  <Star className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Vision</span>
                </div>
                <p className="text-[#F5F1E8] text-xs sm:text-sm md:text-base leading-relaxed font-normal">
                  {CLUB_INFO.teamThemeVision}
                </p>
                <div className="text-[10px] sm:text-[11px] text-[#8E9DAE] mt-3 pt-3 border-t border-white/10 flex flex-col xs:flex-row xs:items-center justify-between gap-1">
                  <span>Rotaract Club of Lead India Ahead</span>
                  <span className="font-semibold text-[#F5F1E8]">Rotary Year 2026–27</span>
                </div>
              </div>

              {/* Guiding Tenets */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex items-start space-x-3 p-3.5 rounded-xl bg-[#07111F]/60 border border-white/10 shadow-sm">
                  <Compass className="w-5 h-5 text-[#C9A961] shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <h4 className="text-xs font-bold text-[#F5F1E8] uppercase tracking-wider">Strategic Focus</h4>
                    <p className="text-[11px] text-[#8E9DAE] mt-1">
                      High-accountability community service and sustainable social value.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3.5 rounded-xl bg-[#07111F]/60 border border-white/10 shadow-sm">
                  <Shield className="w-5 h-5 text-[#C9A961] shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <h4 className="text-xs font-bold text-[#F5F1E8] uppercase tracking-wider">District Alignment</h4>
                    <p className="text-[11px] text-[#8E9DAE] mt-1">
                      Active collaboration across District 3206 and Rotary Texcity.
                    </p>
                  </div>
                </div>
              </div>

              {/* MAAYON publication bar */}
              <div className="p-4 rounded-xl bg-[#07111F]/90 border border-[#C9A961]/25 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-sm">
                <div className="flex items-start space-x-3">
                  <BookOpen className="w-5 h-5 text-[#C9A961] shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <div className="text-xs font-bold text-[#F5F1E8]">MAAYON Annual Publication</div>
                    <div className="text-[11px] text-[#8E9DAE] mt-0.5">
                      The editorial identity — story, vision and impact of the year.
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  aria-label="Explore MAAYON gallery"
                  className="shrink-0 px-4 py-2 rounded-full text-xs font-semibold bg-[#152A4A] border border-[#C9A961]/35 text-[#C9A961] hover:bg-[#C9A961]/20 transition-colors whitespace-nowrap cursor-pointer"
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
    </Section>
  );
};
