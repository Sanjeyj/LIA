import React from "react";
import { HeartHandshake, BookOpen, Activity, Leaf, ShieldAlert, Briefcase } from "lucide-react";
import { Section, SectionHeading } from "./Section";
import { SectionReveal } from "./SectionReveal";

export const WhatWeDo: React.FC = () => {
  const avenues = [
    {
      id: "community",
      title: "Community Service",
      desc: "Delivering grassroots solutions for civic welfare, anti-drug and anti-violence awareness, and public service campaigns.",
      icon: HeartHandshake,
      badge: "Grassroots Action",
    },
    {
      id: "education",
      title: "Education & Literacy",
      desc: "Supporting student growth, academic coaching, school drives, and equipping underserved youth with learning resources.",
      icon: BookOpen,
      badge: "Knowledge & Skills",
    },
    {
      id: "health",
      title: "Health & Wellness",
      desc: "Promoting physical wellness, hepatitis screenings (Project DHEEMA), and youth psychological well-being (Mann Shakthi).",
      icon: Activity,
      badge: "Preventative Care",
    },
    {
      id: "environment",
      title: "Environmental Action",
      desc: "Conducting tree plantations, conservation awareness, and eco-initiatives dedicated to building sustainable living spaces.",
      icon: Leaf,
      badge: "Eco Sustainability",
    },
    {
      id: "leadership",
      title: "Youth Leadership",
      desc: "Empowering Rotaractors through executive governance, district assemblies (TAKEOFF, FLIGHT PATH), and ethical leadership.",
      icon: ShieldAlert,
      badge: "Executive Growth",
    },
    {
      id: "professional",
      title: "Professional Development",
      desc: "Conducting masterclasses in technology, editorial design, media editing, public speaking, and team management.",
      icon: Briefcase,
      badge: "Career Readiness",
    },
  ];

  return (
    <Section id="what-we-do" className="bg-[#07111F] border-t border-white/5">
      <SectionReveal>
        <SectionHeading
          badge="Avenues of Service"
          title="WHAT WE DO"
          subtitle="Rooted in Rotary International values, our avenues of service create comprehensive impact across social, athletic, and vocational spheres."
        />

        {/* 6 Avenues Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {avenues.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="p-7 rounded-2xl border border-white/10 bg-[#0E1F38] flex flex-col justify-between group relative overflow-hidden transition-colors hover:border-[#C9A961]/40 shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#C9A961] group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8E9DAE] bg-[#152A4A] px-2.5 py-1 rounded-md border border-white/10">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="font-display font-serif font-bold text-xl text-[#F5F1E8] mb-2.5 group-hover:text-[#C9A961] transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#8E9DAE] font-normal leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-6 border-t border-white/10 mt-6 flex items-center justify-between text-xs font-semibold text-[#8E9DAE] group-hover:text-[#C9A961] transition-colors">
                  <span>Explore Initiatives</span>
                  <span className="text-lg leading-none">→</span>
                </div>
              </div>
            );
          })}
        </div>
      </SectionReveal>
    </Section>
  );
};

