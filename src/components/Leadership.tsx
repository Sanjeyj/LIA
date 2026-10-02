import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, X, GraduationCap, ShieldCheck, ArrowRight, Sparkles, Building } from "lucide-react";
import { TEAM_MEMBERS } from "../data/team";
import type { TeamMember } from "../types";
import { getPublishedTeamMembers } from "../services/team";
import { MemberAvatar } from "./MemberAvatar";
import { Section, SectionHeading } from "./Section";
import { SectionReveal } from "./SectionReveal";

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

function normalize(s?: string) { return (s || "").toLowerCase().replace(/rtr\.?\s*/i, "").replace(/ipp\.?\s*/i, "").replace(/pp\.?\s*/i, "").trim(); }

function mapSupabaseTeamMemberToPublic(dbMember: any): TeamMember {
  const staticMatch = TEAM_MEMBERS.find(
    (m) =>
      m.id === dbMember.id ||
      normalize(m.name) === normalize(dbMember.name)
  );
  return {
    id: dbMember.id,
    name: dbMember.name,
    position: dbMember.designation || staticMatch?.position,
    term: dbMember.term || "2026–27",
    image: (dbMember.profile_image_url && dbMember.profile_image_url.trim() !== "")
      ? dbMember.profile_image_url
      : staticMatch?.image,
    letterImage: (dbMember.letter_image_url && dbMember.letter_image_url.trim() !== "")
      ? dbMember.letter_image_url
      : staticMatch?.letterImage,
    bio: dbMember.bio || staticMatch?.bio || undefined,
    collegeOrCompany: dbMember.college_company || staticMatch?.collegeOrCompany || undefined,
    isExecutive: Boolean(dbMember.is_executive),
  };
}

export const Leadership = () => {
  const [membersList, setMembersList] = useState<TeamMember[]>(TEAM_MEMBERS);
  const [activeTab, setActiveTab] = useState<"EXECUTIVE" | "ALL">("EXECUTIVE");
  const [selectedLetter, setSelectedLetter] = useState<TeamMember | null>(null);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  useEffect(() => {
    let isMounted = true;
    getPublishedTeamMembers()
      .then((data) => {
        if (isMounted && data && data.length > 0) {
          setMembersList(data.map(mapSupabaseTeamMemberToPublic));
        }
      })
      .catch((err) => {
        console.warn("Could not load team members from database, using static fallback:", err);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Handle escape key and body scroll lock for modals
  useEffect(() => {
    if (!selectedLetter && !selectedMember) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedLetter(null);
        setSelectedMember(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedLetter, selectedMember]);

  const displayedMembers = activeTab === "EXECUTIVE"
    ? membersList.filter((m) => m.isExecutive)
    : membersList;

  const president = membersList.find((m) => m.roleCategory === "PRESIDENT") || membersList[0];

  return (
    <Section id="leadership" className="bg-[#07111F] border-t border-white/5">
      <SectionReveal>
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14">
          <div>
            <SectionHeading
              badge="Leadership & Board of Directors"
              title="TEAM LIA 2026–27"
              subtitle="The executive council and dedicated board leading community service and youth development in Coimbatore."
              centered={false}
              className="mb-0"
            />
          </div>

          {/* Toggle between Executive Council and All Board */}
          <div className="flex items-center space-x-1 sm:space-x-2 bg-[#0E1F38] p-1.5 rounded-full border border-white/10 mt-6 md:mt-0 w-full sm:w-auto justify-center shadow-lg">
            <button
              onClick={() => setActiveTab("EXECUTIVE")}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                activeTab === "EXECUTIVE"
                  ? "bg-[#C9A961] text-[#07111F] shadow-md"
                  : "text-[#8E9DAE] hover:text-[#F5F1E8]"
              }`}
            >
              Executive Council
            </button>
            <button
              onClick={() => setActiveTab("ALL")}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                activeTab === "ALL"
                  ? "bg-[#C9A961] text-[#07111F] shadow-md"
                  : "text-[#8E9DAE] hover:text-[#F5F1E8]"
              }`}
            >
              All Board ({membersList.length})
            </button>
          </div>
        </div>

        {/* President Spotlight Card */}
        {president && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mb-12 sm:mb-16 glass-primary rounded-3xl p-6 sm:p-10 border border-[#D7B65A]/45 shadow-2xl relative overflow-hidden glass-shine"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 items-center">
              <div 
                onClick={() => setSelectedMember(president)}
                className="lg:col-span-5 flex flex-col items-center justify-center p-6 sm:p-8 bg-[#07111F]/90 rounded-2xl border border-[#D7B65A]/30 shadow-inner cursor-pointer group/pres transition-all hover:border-[#D7B65A]/70 hover:bg-[#07111F]"
                role="button"
                tabIndex={0}
                aria-label={`View details of ${president.name}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedMember(president);
                  }
                }}
              >
                <div className="relative group-hover/pres:scale-105 transition-transform duration-300">
                  <MemberAvatar
                    src="/assets/members/hariharan.jpg"
                    name={president.name}
                    size="xl"
                    className="mb-4 sm:mb-5 shadow-2xl ring-4 ring-[#D7B65A]/30"
                  />
                  <div className="absolute inset-0 rounded-2xl bg-black/40 opacity-0 group-hover/pres:opacity-100 transition-opacity flex items-center justify-center mb-4 sm:mb-5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#E8D89A] bg-[#07111F]/90 px-3 py-1 rounded-full border border-[#D7B65A]/40 backdrop-blur-sm">View Profile</span>
                  </div>
                </div>

                <h3 className="font-heading font-extrabold text-2xl sm:text-3xl text-white text-center">
                  {president.name}
                </h3>
                <div className="text-xs font-bold uppercase tracking-widest text-[#D7B65A] mt-1.5 flex items-center space-x-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Club President • 2026–27</span>
                </div>
                <div className="text-xs text-slate-400 mt-1 font-medium">
                  13th President of Rotaract Club of Lead India Ahead
                </div>
              </div>

              <div className="lg:col-span-7 space-y-5">
                <div className="section-badge-gold">
                  <span>Presidential Vision</span>
                </div>

                <h4 className="font-heading font-extrabold text-2xl sm:text-3xl text-white leading-snug">
                  Leading Team LIA under Presidential Theme MAAYON
                </h4>

                <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-normal">
                  Installed during the landmark "THE ONE" 13th Installation Ceremony at Texcity Hall, President Rtr. Hariharan B guides the club into Rotary Year 2026–27. Under his leadership, the club champions verified community action, high-impact youth tournaments, district alignments, and inclusive fellowship across Coimbatore.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-white/10 text-xs text-slate-300">
                  {president.collegeOrCompany && (
                    <div className="flex items-center space-x-2">
                      <GraduationCap className="w-4 h-4 text-[#D7B65A] shrink-0" />
                      <span>{president.collegeOrCompany}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-[#10B981] shrink-0" />
                    <span>District 3206 Official Leader</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Board Members Grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {displayedMembers.slice(1).map((member) => (
              <motion.div
                layout
                key={member.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35 }}
                onClick={() => setSelectedMember(member)}
                role="button"
                tabIndex={0}
                aria-label={`View details of ${member.name}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedMember(member);
                  }
                }}
                className="glass-secondary glass-card-hover rounded-2xl p-6 border border-white/10 flex flex-col justify-between group relative glass-shine cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="relative group-hover:scale-105 transition-transform">
                      <MemberAvatar
                        src={member.image}
                        name={member.name}
                        size="md"
                        className="shrink-0 shadow-lg"
                      />
                    </div>

                    {member.letterImage && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedLetter(member);
                        }}
                        className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-[#E8D89A] bg-[#D7B65A]/15 border border-[#D7B65A]/40 hover:bg-[#D7B65A] hover:text-[#040812] transition-all flex items-center space-x-1 focus-ring cursor-pointer"
                        title="View Official Appointment Letter"
                      >
                        <FileText className="w-3 h-3" />
                        <span>Letter</span>
                      </button>
                    )}
                  </div>

                  <h4 className="font-heading font-extrabold text-lg text-white group-hover:text-[#E8D89A] transition-colors leading-snug">
                    {member.name}
                  </h4>

                  <div className="text-xs font-bold text-[#D7B65A] uppercase tracking-wider mt-1 mb-2">
                    {member.position}
                  </div>

                  {member.bio && (
                    <p className="text-xs text-slate-300 font-normal leading-relaxed line-clamp-3 mb-3">
                      {member.bio}
                    </p>
                  )}
                </div>

                {member.collegeOrCompany && (
                  <div className="pt-3 border-t border-white/8 text-[11px] text-slate-400 flex items-center space-x-1.5 truncate">
                    <GraduationCap className="w-3.5 h-3.5 text-[#D7B65A] shrink-0" />
                    <span className="truncate">{member.collegeOrCompany}</span>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        <div className="mt-14 text-center">
          <a
            href="/team"
            className="btn-liquid-glass inline-flex items-center space-x-2.5 px-8 py-3.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider focus-ring group"
          >
            <span>Meet the Full Team</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 text-[#D7B65A]" />
          </a>
        </div>

        </SectionReveal>

      {/* Member Profile Detail Modal with Big Picture */}
      <AnimatePresence>
        {selectedMember && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-labelledby="leadership-member-modal-title"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedMember(null)}
              className="fixed inset-0 bg-black/85 backdrop-blur-2xl"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="relative max-w-lg w-full glass-floating rounded-3xl overflow-hidden border border-white/20 shadow-2xl z-10 p-6 sm:p-8 max-h-[92vh] overflow-y-auto"
            >
              <button
                onClick={() => setSelectedMember(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors focus-ring cursor-pointer"
                aria-label="Close profile modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-6">
                {/* Big Image Display */}
                <div className="relative inline-block mb-4">
                  {selectedMember.image ? (
                    <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-3xl overflow-hidden border-2 border-[#D7B65A]/40 shadow-2xl mx-auto ring-4 ring-[#D7B65A]/20 bg-[#0B1728]">
                      <img
                        src={selectedMember.image}
                        alt={selectedMember.name}
                        loading="eager"
                        decoding="async"
                        className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-105"
                      />
                    </div>
                  ) : (
                    <MemberAvatar
                      src={selectedMember.image}
                      name={selectedMember.name}
                      size="xl"
                      className="mx-auto shadow-2xl ring-4 ring-[#D7B65A]/30 !w-36 !h-36 sm:!w-44 sm:!h-44"
                    />
                  )}
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#07111F] text-[#D7B65A] border border-[#D7B65A]/40 whitespace-nowrap shadow-md">
                    Rotaract LIA
                  </div>
                </div>

                <h3 id="leadership-member-modal-title" className="font-heading font-extrabold text-xl sm:text-2xl text-white mt-2">
                  {selectedMember.name}
                </h3>
                <div className="text-xs font-bold text-[#D7B65A] uppercase tracking-widest mt-1">
                  {selectedMember.position} • {selectedMember.term}
                </div>
                {selectedMember.department && (
                  <div className="text-xs text-slate-300 mt-1 font-medium">
                    {selectedMember.department}
                  </div>
                )}
              </div>

              {selectedMember.bio && (
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed mb-6 border-t border-b border-white/10 py-4 font-normal">
                  {selectedMember.bio}
                </p>
              )}

              <div className="space-y-3 text-xs text-slate-300 mb-6">
                {selectedMember.collegeOrCompany && (
                  <div className="flex items-center space-x-2.5">
                    <Building className="w-4 h-4 text-[#D7B65A] shrink-0" />
                    <span>{selectedMember.collegeOrCompany}</span>
                  </div>
                )}
                <div className="flex items-center space-x-2.5">
                  <ShieldCheck className="w-4 h-4 text-[#10B981] shrink-0" />
                  <span>Rotaract District 3206 Official Leader</span>
                </div>
              </div>

              {/* Social Links if available */}
              {(selectedMember.linkedin || selectedMember.instagram) && (
                <div className="flex items-center justify-center space-x-3 mb-6 pt-3 border-t border-white/10">
                  {selectedMember.linkedin && (
                    <a
                      href={selectedMember.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-slate-200 flex items-center space-x-2 transition-colors focus-ring"
                    >
                      <LinkedinIcon className="w-4 h-4 text-[#0A66C2]" />
                      <span>LinkedIn</span>
                    </a>
                  )}
                  {selectedMember.instagram && (
                    <a
                      href={selectedMember.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-slate-200 flex items-center space-x-2 transition-colors focus-ring"
                    >
                      <InstagramIcon className="w-4 h-4 text-[#E4405F]" />
                      <span>Instagram</span>
                    </a>
                  )}
                </div>
              )}

              {selectedMember.letterImage && (
                <div className="pt-2">
                  <button
                    onClick={() => {
                      const m = selectedMember;
                      setSelectedMember(null);
                      setSelectedLetter(m);
                    }}
                    className="w-full btn-liquid-glass py-3 rounded-xl text-xs font-bold text-[#E8D89A] flex items-center justify-center space-x-2 focus-ring cursor-pointer"
                  >
                    <FileText className="w-4 h-4 text-[#D7B65A]" />
                    <span>View Official Appointment Letter</span>
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Appointment Letter Liquid Glass Modal */}
      <AnimatePresence>
        {selectedLetter && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedLetter(null)}
              className="fixed inset-0 bg-black/85 backdrop-blur-2xl"
            />

            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="letter-modal-title"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-w-2xl w-full glass-floating rounded-3xl overflow-hidden border border-white/20 shadow-2xl z-10 p-4 sm:p-6 max-h-[92vh] flex flex-col"
            >
              <div className="flex items-center justify-between pb-3.5 border-b border-white/12 px-1">
                <div className="min-w-0 pr-2">
                  <div id="letter-modal-title" className="text-xs sm:text-sm font-heading font-extrabold text-white truncate">
                    Official Appointment Letter — {selectedLetter.name}
                  </div>
                  <div className="text-[11px] sm:text-xs text-[#D7B65A] font-semibold truncate">{selectedLetter.position} • Rotary Year 2026–27</div>
                </div>
                <button
                  onClick={() => setSelectedLetter(null)}
                  className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white shrink-0 focus-ring cursor-pointer"
                  aria-label="Close letter"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="overflow-y-auto mt-3 p-3 bg-[#040812] rounded-2xl flex items-center justify-center border border-white/10">
                {selectedLetter.letterImage && (
                  <img
                    src={selectedLetter.letterImage}
                    alt={`Appointment letter of ${selectedLetter.name}`}
                    loading="lazy"
                    className="max-h-[65vh] sm:max-h-[72vh] w-auto max-w-full object-contain rounded-xl shadow-2xl"
                  />
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </Section>
  );
};
