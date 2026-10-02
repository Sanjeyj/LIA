import { motion } from "framer-motion";
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
import { Section } from "./Section";
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
    <Section id="about" className="border-t border-white/5 bg-[#07111F] overflow-hidden">
      <SectionReveal>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* Left Column: Editorial Display Typography */}
          <motion.div 
            initial={{ opacity: 0, x: -25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 space-y-6"
          >
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full border border-[#C9A961]/30 bg-[#0E1F38] text-xs font-semibold text-[#C9A961] uppercase tracking-wider">
              <span>About Our Movement</span>
            </div>

            <h2 className="font-display font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-[#F5F1E8] tracking-tight leading-[1.08]">
              MORE THAN <br />
              <span className="text-[#C9A961]">A CLUB.</span>
            </h2>

            <div className="p-5 sm:p-6 rounded-2xl border border-white/10 bg-[#0E1F38] relative overflow-hidden group shadow-lg">
              <div aria-hidden="true" className="absolute top-0 right-0 w-32 h-32 bg-[#C9A961]/5 rounded-full blur-2xl -z-10" />
              <div className="flex flex-col xs:flex-row items-start xs:items-center gap-3 sm:gap-4 mb-4">
                <img
                  src="/assets/logos/lia-shield.png"
                  alt="Rotaract Club of Lead India Ahead official shield crest"
                  loading="eager"
                  decoding="async"
                  className="h-12 sm:h-16 w-auto object-contain shrink-0"
                />
                <div>
                  <div className="text-xs sm:text-sm font-bold text-[#F5F1E8] uppercase tracking-wider">Permanent Identity</div>
                  <div className="text-[11px] sm:text-xs text-[#C9A961] font-medium">Since 2012 • 13+ Years of Journey</div>
                  <div className="text-[10px] sm:text-[11px] text-[#8E9DAE]">Sponsored by Rotary Club of Coimbatore Texcity</div>
                </div>
              </div>
              <p className="text-xs text-[#8E9DAE] leading-relaxed border-t border-white/10 pt-3 font-normal">
                Chartered under Rotaract District 3206 (Club ID: 90062), Lead India Ahead serves as a vital
                platform for youth to learn, lead, and serve with enduring purpose.
              </p>
            </div>

            {/* Vision & Mission */}
            <div className="space-y-3">
              <div className="p-4 rounded-xl border border-white/10 bg-[#0E1F38] shadow-sm flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#C9A961]/10 border border-[#C9A961]/20 flex items-center justify-center shrink-0">
                  <Eye className="w-4 h-4 text-[#C9A961]" aria-hidden="true" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#F5F1E8] uppercase tracking-wider mb-1">Our Vision</div>
                  <p className="text-xs text-[#8E9DAE] leading-relaxed font-normal">
                    To be a leading platform that empowers youth to become responsible leaders and compassionate community contributors.
                  </p>
                </div>
              </div>
              <div className="p-4 rounded-xl border border-white/10 bg-[#0E1F38] shadow-sm flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#C9A961]/10 border border-[#C9A961]/20 flex items-center justify-center shrink-0">
                  <Target className="w-4 h-4 text-[#C9A961]" aria-hidden="true" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#F5F1E8] uppercase tracking-wider mb-1">Our Mission</div>
                  <p className="text-xs text-[#8E9DAE] leading-relaxed font-normal">
                    To foster youth leadership, execute impactful community service, and build lasting fellowship through purposeful action.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Narrative & Pillars */}
          <motion.div 
            initial={{ opacity: 0, x: 25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7 space-y-8"
          >
            <div className="space-y-4 text-[#8E9DAE] text-base sm:text-lg leading-relaxed font-normal">
              <p className="text-[#F5F1E8] font-medium text-lg sm:text-xl leading-snug">
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
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: idx * 0.08 }}
                    className="p-5 rounded-xl border border-white/10 bg-[#0E1F38] hover:border-[#C9A961]/40 transition-colors shadow-sm flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#C9A961] mb-3">
                        <Icon className="w-5 h-5" aria-hidden="true" />
                      </div>
                      <h3 className="font-display font-serif font-bold text-[#F5F1E8] text-base mb-1.5">{item.title}</h3>
                      <p className="text-xs text-[#8E9DAE] leading-relaxed font-normal">{item.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Team LIA Values */}
            <div>
              <div className="text-xs font-bold text-[#8E9DAE] uppercase tracking-wider mb-3">
                Team LIA Values
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {values.map((v, idx) => {
                  const Icon = v.icon;
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.92 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.35, delay: idx * 0.05 }}
                      whileHover={{ y: -3, scale: 1.02 }}
                      className="p-3 rounded-xl border border-white/10 bg-[#0E1F38] flex flex-col gap-1.5 group shadow-sm hover:border-[#C9A961]/40 transition-colors cursor-default"
                    >
                      <Icon className="w-4 h-4 text-[#C9A961] group-hover:scale-110 transition-transform" aria-hidden="true" />
                      <div className="text-xs font-bold text-[#F5F1E8]">{v.label}</div>
                      <p className="text-[10px] text-[#8E9DAE] leading-snug hidden sm:block font-normal">{v.desc}</p>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-[#8E9DAE]">
              <div className="flex items-center space-x-1.5 text-[#C9A961]">
                <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                <span>Verified District 3206 Club</span>
              </div>
              <span className="text-[#8E9DAE]/50">•</span>
              <div className="flex items-center space-x-1.5 text-[#C9A961]">
                <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                <span>Rotary Texcity Family</span>
              </div>
              <span className="text-[#8E9DAE]/50">•</span>
              <div className="flex items-center space-x-1.5 text-[#C9A961]">
                <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                <span>Active Since 2012</span>
              </div>
            </div>
          </motion.div>

        </div>
      </SectionReveal>
    </Section>
  );
};

