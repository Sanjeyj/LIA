import { useLocation } from "react-router-dom";
import { ArrowUp, Mail, Phone, MapPin, Shield, Compass, Sparkles } from "lucide-react";
import { CLUB_INFO } from "../data/club";
import { MemberAvatar } from "./MemberAvatar";

const InstagramIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const LinkedinIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

interface FooterProps {
  onOpenJoinModal?: () => void;
}

export const Footer = ({ onOpenJoinModal }: FooterProps) => {
  const location = useLocation();
  const isHomepage = location.pathname === "/";

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navItems = [
    { label: "About LIA", targetId: "about" },
    { label: "Our Impact", path: "/impact" },
    { label: "What We Do", targetId: "what-we-do" },
    { label: "Featured Projects", targetId: "projects" },
    { label: "MAAYON 2026–27", targetId: "maayon" },
    { label: "Events & Timeline", targetId: "events" },
    { label: "Careers & Opportunities", path: "/careers" },
    { label: "Our Journey", targetId: "journey" },
    { label: "Team LIA", targetId: "leadership" },
    { label: "Photo Gallery", targetId: "gallery" },
    { label: "Contact Us", targetId: "contact" },
  ];

  return (
    <footer className="bg-[#040812] text-slate-300 relative overflow-hidden border-t border-[#C9A961]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-12 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 sm:gap-12 pb-12 sm:pb-16 border-b border-slate-200/80 dark:border-white/10">

          {/* Column 1: TEAM LIA Brand Identity */}
          <div className="sm:col-span-2 lg:col-span-4 space-y-5 sm:space-y-6">
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#10233D] to-[#07111F] border border-[#D7B65A]/40 flex items-center justify-center shadow-lg shadow-black/40 overflow-hidden p-1 shrink-0">
                <img
                  src="/assets/logos/lia-shield.png"
                  alt="Rotaract Club of Lead India Ahead official shield crest"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="font-heading font-black text-lg sm:text-xl text-[#D7B65A] tracking-wider block">
                  TEAM LIA
                </span>
                <span className="font-heading font-extrabold text-sm sm:text-base tracking-wider text-white uppercase block leading-tight">
                  ROTARACT CLUB OF LEAD INDIA AHEAD
                </span>
              </div>
            </div>

            {/* Official tagline — centralized data */}
            <div className="p-4 rounded-xl glass-secondary border border-[#D7B65A]/25 glass-shine">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Our Theme</p>
              <p className="text-sm font-heading font-bold text-white leading-snug italic">
                "{CLUB_INFO.teamThemeTagline}"
              </p>
              <p className="text-xs text-[#D7B65A] mt-1.5 font-semibold">Rotary Year 2026–27</p>
            </div>

            <p className="text-slate-400 text-sm leading-relaxed font-normal">
              Chartered in 2012 under the Rotary Club of Coimbatore Texcity, Rotaract District 3206.
              We empower dynamic youth, cultivate future leaders, and spearhead transformational social
              initiatives across Tamil Nadu.
            </p>

            {/* Annual identity + presidential theme distinction */}
            <div className="space-y-2">
              <div className="p-3 rounded-xl glass-subtle border border-white/10 flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-[#D7B65A]/10 border border-[#D7B65A]/25 flex items-center justify-center shrink-0">
                  <Shield className="w-4 h-4 text-[#D7B65A]" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Annual Identity</p>
                  <p className="text-sm font-heading font-bold text-white">TEAM LIA 2026–27</p>
                </div>
              </div>
              <div className="p-3 rounded-xl glass-subtle border border-white/10 flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-white/95 border border-[#D7B65A]/40 p-1 flex items-center justify-center shrink-0 overflow-hidden shadow-md">
                  <img src="/assets/logos/maayon-theme.png" alt="MAAYON theme" className="w-full h-full object-contain" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Presidential Theme</p>
                  <p className="text-sm font-heading font-bold text-white">MAAYON 2026–27</p>
                  <div className="flex items-center space-x-1.5 mt-1">
                    <MemberAvatar
                      src="/assets/members/hariharan.jpg"
                      name={CLUB_INFO.president.name}
                      size="sm"
                      className="w-4 h-4 rounded-full shrink-0 border border-[#D7B65A]/40"
                    />
                    <span className="text-xs text-[#D7B65A] font-semibold">{CLUB_INFO.president.name}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="font-heading font-bold text-sm uppercase tracking-wider text-white flex items-center space-x-2">
              <Compass className="w-4 h-4 text-[#D7B65A]" aria-hidden="true" />
              <span>Explore</span>
            </h3>
            <ul className="grid grid-cols-2 gap-2.5 text-sm text-slate-400">
              {navItems.map((item) => {
                const href = item.path
                  ? item.path
                  : isHomepage
                    ? `#${item.targetId}`
                    : `/#${item.targetId}`;

                return (
                  <li key={item.label}>
                    <a
                      href={href}
                      className="hover:text-[#D7B65A] transition-colors inline-block py-0.5"
                    >
                      {item.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Column 3: Guiding Principles */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-heading font-bold text-sm uppercase tracking-wider text-white flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-[#D7B65A]" aria-hidden="true" />
              <span>Guiding Principles</span>
            </h3>
            <div className="space-y-2 text-xs text-slate-400 leading-snug">
              <p className="font-semibold text-slate-300">The 4-Way Test:</p>
              <p>1. Is it the TRUTH?</p>
              <p>2. Is it FAIR to all concerned?</p>
              <p>3. Will it build GOODWILL and BETTER FRIENDSHIPS?</p>
              <p>4. Will it be BENEFICIAL to all concerned?</p>
            </div>
            <div className="pt-2 border-t border-white/5">
              <span className="text-xs font-semibold text-[#D7B65A] tracking-wider uppercase block">
                Motto: Service Above Self
              </span>
            </div>
          </div>

          {/* Column 4: Contact */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="font-heading font-bold text-sm uppercase tracking-wider text-white">
              Official Headquarters
            </h3>
            <div className="space-y-3 text-sm text-slate-400">
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-[#D7B65A] shrink-0 mt-1" aria-hidden="true" />
                <span>{CLUB_INFO.location}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-[#D7B65A] shrink-0" aria-hidden="true" />
                <a
                  href={`mailto:${CLUB_INFO.contact.email}`}
                  className="hover:text-white transition-colors truncate"
                >
                  {CLUB_INFO.contact.email}
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-[#D7B65A] shrink-0" aria-hidden="true" />
                <span>{CLUB_INFO.contact.phones[0]}</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="pt-2 flex items-center space-x-3">
              <a
                href={CLUB_INFO.contact.instagramUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="Official Instagram of Rotaract Club of Lead India Ahead"
                className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 hover:border-[#D7B65A]/50 hover:bg-[#D7B65A]/10 text-slate-300 hover:text-[#D7B65A] flex items-center justify-center transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D7B65A]"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href={CLUB_INFO.contact.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="Official LinkedIn of Rotaract Club of Lead India Ahead"
                className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 hover:border-[#D7B65A]/50 hover:bg-[#D7B65A]/10 text-slate-300 hover:text-[#D7B65A] flex items-center justify-center transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D7B65A]"
              >
                <LinkedinIcon className="w-4 h-4" />
              </a>
              {onOpenJoinModal && (
                <button
                  onClick={onOpenJoinModal}
                  className="px-4 py-2 rounded-lg bg-[#D7B65A] hover:bg-[#E8D89A] text-[#07111F] font-semibold text-xs transition-all shadow-md"
                >
                  Join Us
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-center sm:text-left">
            <span>
              © {new Date().getFullYear()} Rotaract Club of Lead India Ahead (LIA). All rights reserved.
            </span>
            <span className="hidden sm:inline text-slate-700">•</span>
            <span className="text-[#D7B65A]/80">
              Rotaract District 3206 | Sponsored by Rotary Club of Coimbatore Texcity
            </span>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 transition-colors"
            aria-label="Back to top"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </footer>
  );
};
