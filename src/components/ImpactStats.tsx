import React from "react";
import { Calendar, Layers, Users, Heart } from "lucide-react";
import { Section, SectionHeading } from "./Section";
import { Reveal } from "./Reveal";
import { CountUp } from "./CountUp";

export const ImpactStats: React.FC = () => {
  const stats = [
    {
      id: "years",
      number: "13+",
      label: "YEARS OF JOURNEY",
      detail: "Chartered in 2012, continuously creating youth leadership",
      icon: Calendar,
    },
    {
      id: "projects",
      number: "50+",
      label: "COMMUNITY PROJECTS",
      detail: "Sports, health drives, educational seminars & literacy",
      icon: Layers,
    },
    {
      id: "volunteers",
      number: "100+",
      label: "ACTIVE VOLUNTEERS",
      detail: "Dedicated student and professional members across colleges",
      icon: Users,
    },
    {
      id: "impact",
      number: "5,000+",
      label: "LIVES TOUCHED",
      detail: "Grassroots beneficiaries through health, sports & civic initiatives",
      icon: Heart,
    },
  ];

  return (
    <Section id="impact" className="bg-[#07111F] border-t border-white/5">
      <SectionHeading
        badge="Collective Achievement"
        title="MEASURING OUR COMMUNITY IMPACT"
        subtitle="A reflection of over a decade of dedication to social upliftment, youth growth, and community service."
      />

      {/* Glassmorphic Stat Cards Grid with CountUp & Staggered Reveal */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Reveal
              key={stat.id}
              delay={idx * 0.08}
              className="backdrop-blur-md bg-[#0E1F38]/80 border border-white/10 p-6 sm:p-7 rounded-2xl flex flex-col justify-between relative group hover:-translate-y-1 hover:border-[#C9A961]/40 transition-all duration-300 shadow-xl hover:shadow-[#C9A961]/10"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#C9A961]">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono font-semibold tracking-wider text-[#8E9DAE] uppercase">
                    LIA 2012–27
                  </span>
                </div>

                <div className="font-display font-serif font-extrabold text-4xl sm:text-5xl tracking-tight text-[#C9A961] mb-2">
                  <CountUp value={stat.number} duration={2} />
                </div>

                <div className="text-xs font-bold uppercase tracking-wider text-[#F5F1E8] mb-2">
                  {stat.label}
                </div>
              </div>

              <p className="text-xs text-[#8E9DAE] font-normal leading-relaxed border-t border-white/10 pt-3 mt-2">
                {stat.detail}
              </p>
            </Reveal>
          );
        })}
      </div>

      <div className="mt-12 text-center">
        <a
          href="/impact"
          className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-[#0E1F38] hover:bg-[#152A4A] border border-[#C9A961]/30 text-xs sm:text-sm font-semibold text-[#C9A961] hover:text-[#DFCA95] transition-all group shadow-md hover:-translate-y-0.5"
        >
          <span>Explore Full Impact Archive &amp; Milestones</span>
          <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
        </a>
      </div>
    </Section>
  );
};

