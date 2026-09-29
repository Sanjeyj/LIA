import React from "react";
import { HeartHandshake, BookOpen, Activity, Leaf, ShieldAlert, Briefcase } from "lucide-react";
import { SectionReveal } from "./SectionReveal";

export const WhatWeDo: React.FC = () => {
  const avenues = [
    {
      id: "community",
      title: "Community Service",
      desc: "Delivering grassroots solutions for civic welfare, anti-drug and anti-violence awareness, and public service campaigns.",
      icon: HeartHandshake,
      accent: "hover:border-[#10B981]/50 group-hover:text-[#10B981]",
      badge: "Grassroots Action",
    },
    {
      id: "education",
      title: "Education & Literacy",
      desc: "Supporting student growth, academic coaching, school drives, and equipping underserved youth with learning resources.",
      icon: BookOpen,
      accent: "hover:border-[#06B6D4]/50 group-hover:text-[#06B6D4]",
      badge: "Knowledge & Skills",
    },
    {
      id: "health",
      title: "Health & Wellness",
      desc: "Promoting physical wellness, hepatitis screenings (Project DHEEMA), and youth psychological well-being (Mann Shakthi).",
      icon: Activity,
      accent: "hover:border-[#F43F5E]/50 group-hover:text-[#F43F5E]",
      badge: "Preventative Care",
    },
    {
      id: "environment",
      title: "Environmental Action",
      desc: "Conducting tree plantations, conservation awareness, and eco-initiatives dedicated to building sustainable living spaces.",
      icon: Leaf,
      accent: "hover:border-[#10B981]/50 group-hover:text-[#10B981]",
      badge: "Eco Sustainability",
    },
    {
      id: "leadership",
      title: "Youth Leadership",
      desc: "Empowering Rotaractors through executive governance, district assemblies (TAKEOFF, FLIGHT PATH), and ethical leadership.",
      icon: ShieldAlert,
      accent: "hover:border-[#D7B65A]/50 group-hover:text-[#B89432] dark:group-hover:text-[#D7B65A]",
      badge: "Executive Growth",
    },
    {
      id: "professional",
      title: "Professional Development",
      desc: "Conducting masterclasses in technology, editorial design, media editing, public speaking, and team management.",
      icon: Briefcase,
      accent: "hover:border-[#8B5CF6]/50 group-hover:text-[#8B5CF6]",
      badge: "Career Readiness",
    },
  ];

  return (
    <section id="what-we-do" className="py-24 sm:py-32 relative overflow-hidden border-t border-slate-200/60 dark:border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionReveal>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
          <div>
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full glass-card border border-[#D7B65A]/30 text-xs font-semibold text-[#B89432] dark:text-[#D7B65A] uppercase tracking-wider mb-3 shadow-sm">
              <span>Avenues of Service</span>
            </div>
            <h2 className="font-heading font-extrabold text-3xl sm:text-5xl text-slate-900 dark:text-white tracking-tight">
              WHAT WE <span className="gold-gradient-text">DO</span>
            </h2>
          </div>
          <p className="max-w-md text-slate-500 dark:text-slate-400 text-sm sm:text-base mt-4 md:mt-0 font-normal">
            Rooted in Rotary International values, our avenues of service create comprehensive impact across social, athletic, and vocational spheres.
          </p>
        </div>

        {/* 6 Avenues Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {avenues.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className={`glass-card glass-card-hover p-7 rounded-2xl border border-white/90 dark:border-white/10 flex flex-col justify-between group relative overflow-hidden bg-white/75 dark:bg-white/5 shadow-sm transition-all ${item.accent}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-slate-900/5 dark:bg-white/5 border border-slate-900/10 dark:border-white/10 flex items-center justify-center text-slate-700 dark:text-slate-300 group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 glass-card px-2.5 py-1 rounded-md border border-slate-200/60 dark:border-white/10">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="font-heading font-bold text-xl text-slate-900 dark:text-white mb-2.5 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-normal leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-6 border-t border-slate-200/60 dark:border-white/5 mt-6 flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 group-hover:text-[#B89432] dark:group-hover:text-[#D7B65A] transition-colors">
                  <span>Explore Initiatives</span>
                  <span className="text-lg leading-none">→</span>
                </div>
              </div>
            );
          })}
        </div>
        </SectionReveal>
      </div>
    </section>
  );
};
