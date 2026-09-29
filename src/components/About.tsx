import {
  Users,
  Award,
  Compass,
  HeartHandshake,
  CheckCircle2,
  Eye,
  Target,
  Sparkles,
} from "lucide-react";
import { SectionReveal } from "./SectionReveal";

const values = [
  { icon: Users, label: "Leadership", desc: "Developing future leaders through governance, mentorship and purposeful action." },
  { icon: HeartHandshake, label: "Service", desc: "Delivering meaningful community impact through verified grassroots initiatives." },
  { icon: Compass, label: "Fellowship", desc: "Building lifelong bonds among passionate young students and professionals." },
  { icon: CheckCircle2, label: "Integrity", desc: "Operating with transparency, accountability and the spirit of the 4-Way Test." },
  { icon: Award, label: "Growth", desc: "Empowering every member to grow professionally, socially and personally." },
  { icon: Sparkles, label: "Community", desc: "Serving our local community in Coimbatore with lasting, sustainable impact." },
];

const pillars = [
  {
    icon: Users,
    title: "Youth Leadership",
    desc: "Nurturing proactive decision-makers and community advocates equipped for global leadership.",
  },
  {
    icon: HeartHandshake,
    title: "Community Service",
    desc: "Executing grassroots initiatives across healthcare, child welfare, environmental care, and sports.",
  },
  {
    icon: Compass,
    title: "Fellowship & Unity",
    desc: "Building lifelong connections among dynamic students and ambitious young professionals.",
  },
  {
    icon: Award,
    title: "Professional Excellence",
    desc: "Providing high-impact workshops in technology, management, communication, and creative media.",
  },
];

export const About = () => {
  return (
    <section id="about" className="py-24 sm:py-32 scroll-mt-28 sm:scroll-mt-36 relative overflow-hidden border-t border-slate-200/60 dark:border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionReveal>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* Left Column: Editorial Display Typography */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full glass-card border border-[#D7B65A]/30 text-xs font-semibold text-[#B89432] dark:text-[#D7B65A] uppercase tracking-wider shadow-sm">
              <span>About Our Movement</span>
            </div>

            <h2 className="font-heading font-extrabold text-3xl sm:text-5xl lg:text-6xl text-slate-900 dark:text-white tracking-tight leading-[1.08]">
              MORE THAN <br />
              <span className="gold-gradient-text">A CLUB.</span>
            </h2>

            <div className="p-5 sm:p-6 glass-card rounded-2xl border border-white/90 dark:border-white/12 relative overflow-hidden group shadow-sm bg-white/75 dark:bg-white/5">
              <div aria-hidden="true" className="absolute top-0 right-0 w-32 h-32 bg-[#D7B65A]/10 rounded-full blur-2xl -z-10" />
              <div className="flex flex-col xs:flex-row items-start xs:items-center gap-3 sm:gap-4 mb-4">
                <img
                  src="/assets/logos/lia-shield.png"
                  alt="Rotaract Club of Lead India Ahead official shield crest"
                  loading="lazy"
                  className="h-12 sm:h-16 w-auto object-contain shrink-0"
                />
                <div>
                  <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Permanent Identity</div>
                  <div className="text-[11px] sm:text-xs text-[#B89432] dark:text-[#E8D89A] font-medium">Since 2012 • 13+ Years of Journey</div>
                  <div className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400">Sponsored by Rotary Club of Coimbatore Texcity</div>
                </div>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-200/60 dark:border-white/10 pt-3 font-normal">
                Chartered under Rotaract District 3206 (Club ID: 90062), Lead India Ahead serves as a vital
                platform for youth to learn, lead, and serve with enduring purpose.
              </p>
            </div>

            {/* Vision & Mission */}
            <div className="space-y-3">
              <div className="p-4 glass-card rounded-xl border border-[#174EA6]/20 shadow-sm flex items-start gap-3 bg-white/80 dark:bg-white/5">
                <div className="w-9 h-9 rounded-lg bg-[#174EA6]/10 border border-[#174EA6]/20 flex items-center justify-center shrink-0">
                  <Eye className="w-4 h-4 text-[#174EA6] dark:text-[#6B9FFF]" aria-hidden="true" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-1">Our Vision</div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                    To be a leading platform that empowers youth to become responsible leaders and compassionate community contributors.
                  </p>
                </div>
              </div>
              <div className="p-4 glass-card rounded-xl border border-[#D7B65A]/25 shadow-sm flex items-start gap-3 bg-white/80 dark:bg-white/5">
                <div className="w-9 h-9 rounded-lg bg-[#D7B65A]/10 border border-[#D7B65A]/25 flex items-center justify-center shrink-0">
                  <Target className="w-4 h-4 text-[#B89432] dark:text-[#D7B65A]" aria-hidden="true" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-1">Our Mission</div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                    To foster youth leadership, execute impactful community service, and build lasting fellowship through purposeful action.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Narrative & Pillars */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4 text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed font-normal">
              <p className="text-slate-900 dark:text-white font-medium text-lg sm:text-xl leading-snug">
                Since 2012, the Rotaract Club of Lead India Ahead has brought together passionate young changemakers
                to learn, lead, and serve.
              </p>
              <p>
                We are a team of students and working professionals dedicated to transforming communities and
                cultivating future-ready leaders. Operating within Rotaract District 3206 and proudly sponsored
                by the Rotary Club of Coimbatore Texcity, our initiatives bridge youth passion with institutional
                accountability.
              </p>
            </div>

            {/* Core Pillars Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {pillars.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className="p-5 glass-card glass-card-hover rounded-xl border border-white/90 dark:border-white/10 shadow-sm flex flex-col justify-between bg-white/70 dark:bg-white/5"
                  >
                    <div>
                      <div className="w-10 h-10 rounded-lg bg-slate-900/5 dark:bg-white/5 border border-slate-900/10 dark:border-white/10 flex items-center justify-center text-[#B89432] dark:text-[#D7B65A] mb-3">
                        <Icon className="w-5 h-5" aria-hidden="true" />
                      </div>
                      <h3 className="font-heading font-bold text-slate-900 dark:text-white text-base mb-1.5">{item.title}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-normal">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Team LIA Values */}
            <div>
              <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                Team LIA Values
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {values.map((v, idx) => {
                  const Icon = v.icon;
                  return (
                    <div
                      key={idx}
                      className="p-3 glass-card glass-card-hover rounded-xl border border-white/80 dark:border-white/8 flex flex-col gap-1.5 group bg-white/70 dark:bg-white/5 shadow-sm"
                    >
                      <Icon className="w-4 h-4 text-[#B89432] dark:text-[#D7B65A] group-hover:scale-110 transition-transform" aria-hidden="true" />
                      <div className="text-xs font-bold text-slate-900 dark:text-white">{v.label}</div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-snug hidden sm:block font-normal">{v.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-center space-x-1.5 text-[#059669] dark:text-[#10B981]">
                <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                <span>Verified District 3206 Club</span>
              </div>
              <span className="text-slate-400 dark:text-slate-600">•</span>
              <div className="flex items-center space-x-1.5 text-[#0891B2] dark:text-[#06B6D4]">
                <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                <span>Rotary Texcity Family</span>
              </div>
              <span className="text-slate-400 dark:text-slate-600">•</span>
              <div className="flex items-center space-x-1.5 text-[#B89432] dark:text-[#E8D89A]">
                <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                <span>Active Since 2012</span>
              </div>
            </div>
          </div>

        </div>
        </SectionReveal>
      </div>
    </section>
  );
};
