import React, { ReactNode } from "react";

interface SectionProps {
  id?: string;
  className?: string;
  containerClassName?: string;
  children: ReactNode;
}

export function Section({ id, className = "", containerClassName = "", children }: SectionProps) {
  return (
    <section
      id={id}
      className={`py-24 md:py-32 scroll-mt-28 relative ${className}`}
    >
      <div className={`max-w-7xl mx-auto px-6 ${containerClassName}`}>
        {children}
      </div>
    </section>
  );
}

interface SectionHeadingProps {
  badge?: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
}

export function SectionHeading({
  badge,
  title,
  subtitle,
  centered = true,
  className = "",
}: SectionHeadingProps) {
  return (
    <div className={`mb-16 ${centered ? "text-center" : "text-left"} ${className}`}>
      {badge && (
        <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[#C9A961] mb-3">
          {badge}
        </span>
      )}
      <h2 className="font-display font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#F5F1E8] tracking-tight leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-4 text-base sm:text-lg text-[#8E9DAE] leading-relaxed ${centered ? "max-w-2xl mx-auto" : "max-w-2xl"}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
