import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Search,
  FileText,
  GraduationCap,
  X,
  Award,
  ShieldCheck,
  Building,
} from 'lucide-react';

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

import { TEAM_MEMBERS } from '../data/team';
import type { TeamMember } from '../types';
import { getPublishedTeamMembers } from '../services/team';
import { MemberAvatar } from './MemberAvatar';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { JoinUs } from './JoinUs';
import { SEO } from './SEO';
import { getCanonicalUrl } from '../config/site';

function mapSupabaseTeamMemberToPublic(dbMember: any): TeamMember {
  return {
    id: dbMember.id,
    name: dbMember.name,
    position: dbMember.designation,
    term: dbMember.term || '2026–27',
    image: dbMember.profile_image_url || undefined,
    letterImage: dbMember.letter_image_url || undefined,
    bio: dbMember.bio || undefined,
    collegeOrCompany: dbMember.college_company || undefined,
    department: dbMember.department || undefined,
    isExecutive: Boolean(dbMember.is_executive),
    roleCategory: dbMember.role_category || (dbMember.is_executive ? 'EXECUTIVE' : 'MEMBER'),
    linkedin: dbMember.linkedin_url || undefined,
    instagram: dbMember.instagram_url || undefined,
  };
}

export const TeamPage: React.FC = () => {
  const [membersList, setMembersList] = useState<TeamMember[]>(TEAM_MEMBERS);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'EXECUTIVE' | 'DIRECTORS' | 'PROJECT_LEADS' | 'MEMBERS'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [showLetterModal, setShowLetterModal] = useState<TeamMember | null>(null);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });

    let isMounted = true;
    getPublishedTeamMembers()
      .then((data) => {
        if (isMounted && data && data.length > 0) {
          setMembersList(data.map(mapSupabaseTeamMemberToPublic));
        }
      })
      .catch((err) => {
        console.warn('Could not load team members from database, using static fallback:', err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Escape key handler for dialogs & body scroll locking
  useEffect(() => {
    if (!selectedMember && !showLetterModal) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedMember(null);
        setShowLetterModal(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedMember, showLetterModal]);

  // Derived filter logic using explicit roleCategory or position keywords
  const filteredMembers = useMemo(() => {
    const trimmedSearch = searchQuery.trim().toLowerCase();

    return membersList.filter((m) => {
      const pos = m.position.toLowerCase();
      const dept = (m.department || '').toLowerCase();
      const roleCat = m.roleCategory;

      let categoryMatch = false;
      if (activeFilter === 'ALL') {
        categoryMatch = true;
      } else if (activeFilter === 'EXECUTIVE') {
        categoryMatch = roleCat === 'EXECUTIVE' || roleCat === 'PRESIDENT' || Boolean(m.isExecutive);
      } else if (activeFilter === 'DIRECTORS') {
        categoryMatch = roleCat === 'DIRECTOR' || pos.includes('director') || pos.includes('advisor') || pos.includes('past president');
      } else if (activeFilter === 'PROJECT_LEADS') {
        categoryMatch = roleCat === 'PROJECT_LEAD' || pos.includes('chair') || pos.includes('lead');
      } else if (activeFilter === 'MEMBERS') {
        categoryMatch = roleCat === 'MEMBER' || (!Boolean(m.isExecutive) && !pos.includes('advisor') && !pos.includes('president'));
      }

      const searchMatch =
        trimmedSearch === '' ||
        m.name.toLowerCase().includes(trimmedSearch) ||
        pos.includes(trimmedSearch) ||
        dept.includes(trimmedSearch) ||
        (m.collegeOrCompany && m.collegeOrCompany.toLowerCase().includes(trimmedSearch));

      return categoryMatch && searchMatch;
    });
  }, [membersList, activeFilter, searchQuery]);

  const president = useMemo(() => {
    return membersList.find((m) => m.roleCategory === 'PRESIDENT' || (m.position.toLowerCase().includes('president') && !m.position.toLowerCase().includes('past')));
  }, [membersList]);

  const filterOptions = [
    { key: 'ALL', label: 'All Board' },
    { key: 'EXECUTIVE', label: 'Executive Board' },
    { key: 'DIRECTORS', label: 'Directors' },
    { key: 'PROJECT_LEADS', label: 'Project Leads' },
    { key: 'MEMBERS', label: 'Members' },
  ] as const;

  return (
    <div className="min-h-screen bg-[var(--lia-bg)] text-slate-900 dark:text-slate-100 flex flex-col selection:bg-[#D7B65A]/30 selection:text-[#B89432] dark:selection:text-[#E8D89A]">
      <SEO
        title="Team LIA Leadership Directory | Rotaract Club of Lead India Ahead"
        description="Meet the verified Board of Directors, Executive Council, and members driving youth leadership in Coimbatore for Rotary Year 2026–27."
        canonicalPath={getCanonicalUrl('/team')}
      />

      <Navbar onOpenJoinModal={() => setIsJoinModalOpen(true)} />

      <main className="flex-grow pt-32 sm:pt-36 pb-24 relative overflow-hidden">
        {/* Background ambient light */}
        <div aria-hidden="true" className="ambient-blob-gold top-20 -left-40 opacity-40" />
        <div aria-hidden="true" className="ambient-blob-navy bottom-40 -right-40 opacity-50" />

        {/* Page Header */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 sm:mb-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="section-badge-gold">
              <Users className="w-3.5 h-3.5 text-[#D7B65A]" />
              <span>TEAM LIA Directory • Rotary Year 2026–27</span>
            </div>

            <h1 className="font-heading font-extrabold text-4xl sm:text-6xl text-white tracking-tight editorial-heading">
              Leadership &amp; <span className="gold-gradient-text">Board Directory</span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-normal">
              The verified leaders, project chairs, and dedicated members driving high-impact community initiatives across Rotaract District 3206.
            </p>
          </div>
        </section>

        {/* President Spotlight Banner */}
        {president && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 sm:mb-16">
            <div className="glass-primary rounded-3xl p-6 sm:p-10 border border-[#D7B65A]/45 relative overflow-hidden shadow-2xl glass-shine">
              <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 relative z-10">
                <MemberAvatar
                  src="/assets/members/hariharan.jpg"
                  name={president.name}
                  size="xl"
                  className="shrink-0 shadow-2xl ring-4 ring-[#D7B65A]/30"
                />

                <div className="flex-1 text-center lg:text-left">
                  <div className="section-badge-gold mb-3">
                    <Award className="w-3.5 h-3.5 text-[#D7B65A]" />
                    <span>Club President • Rotary Year 2026–27</span>
                  </div>

                  <h2 className="font-heading font-extrabold text-2xl sm:text-4xl text-white mb-2">
                    {president.name}
                  </h2>

                  {president.department && (
                    <div className="text-xs font-bold text-[#D7B65A] uppercase tracking-widest mb-3">
                      {president.department}
                    </div>
                  )}

                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl mb-6 font-normal">
                    {president.bio}
                  </p>

                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-slate-300 border-t border-white/10 pt-4">
                    {president.collegeOrCompany && (
                      <span className="flex items-center space-x-1.5">
                        <GraduationCap className="w-4 h-4 text-[#D7B65A]" />
                        <span>{president.collegeOrCompany}</span>
                      </span>
                    )}
                    <span className="flex items-center space-x-1.5">
                      <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                      <span>District 3206 Official Leader</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Directory Controls & Filter Pills */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            
            {/* Liquid Filter Pills */}
            <div className="flex items-center space-x-1.5 overflow-x-auto pb-2 sm:pb-0 scrollbar-none glass-subtle p-1.5 rounded-full border border-white/10">
              {filterOptions.map((opt) => {
                const isActive = activeFilter === opt.key;
                return (
                  <button
                    key={opt.key}
                    onClick={() => setActiveFilter(opt.key)}
                    className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors relative focus-ring cursor-pointer ${
                      isActive ? "text-[#040812]" : "text-slate-300 hover:text-white"
                    }`}
                  >
                    <span className="relative z-10">{opt.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeTeamFilter"
                        className="absolute inset-0 btn-liquid-primary rounded-full shadow-md"
                        transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Search Input & Count Badge */}
            <div className="flex items-center gap-3">
              <div className="px-3.5 py-2 rounded-full glass-subtle border border-white/12 text-xs font-bold text-[#E8D89A] shrink-0 shadow-sm">
                {filteredMembers.length} {filteredMembers.length === 1 ? 'member' : 'members'}
              </div>

              <div className="relative flex-1 sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, role, department..."
                  className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/12 rounded-full text-xs text-white placeholder-slate-400 focus-ring transition-colors shadow-inner"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white focus-ring rounded-full p-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Members Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredMembers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredMembers.map((member) => (
                <div
                  key={member.id}
                  onClick={() => setSelectedMember(member)}
                  className="glass-secondary rounded-2xl p-6 border border-white/10 flex flex-col justify-between glass-card-hover cursor-pointer group relative glass-shine"
                  tabIndex={0}
                  role="button"
                  aria-label={`View profile of ${member.name}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedMember(member);
                    }
                  }}
                >
                  <div>
                    <div className="flex items-start justify-between mb-4 gap-3">
                      <MemberAvatar
                        src={member.image}
                        name={member.name}
                        size="md"
                        className="shrink-0 group-hover:scale-105 transition-transform"
                      />

                      {member.letterImage && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowLetterModal(member);
                          }}
                          className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-[#E8D89A] bg-[#D7B65A]/15 border border-[#D7B65A]/40 hover:bg-[#D7B65A] hover:text-[#040812] transition-all flex items-center space-x-1 focus-ring"
                          title="View Official Appointment Letter"
                        >
                          <FileText className="w-3 h-3" />
                          <span>Letter</span>
                        </button>
                      )}
                    </div>

                    <h3 className="font-heading font-extrabold text-lg text-white group-hover:text-[#E8D89A] transition-colors leading-snug">
                      {member.name}
                    </h3>

                    <div className="text-xs font-bold text-[#D7B65A] uppercase tracking-wider mt-1 mb-1">
                      {member.position}
                    </div>

                    {member.department && (
                      <div className="text-[11px] text-slate-400 font-medium mb-3">
                        {member.department}
                      </div>
                    )}

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
                </div>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="glass-primary rounded-3xl border border-white/12 p-12 text-center max-w-lg mx-auto shadow-2xl">
              <Users className="w-12 h-12 text-[#D7B65A] mx-auto mb-4 opacity-80" />
              <h3 className="font-heading font-extrabold text-xl text-white mb-2">
                No Team LIA members match your search.
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mb-6">
                Try adjusting your search query or switching role category filters.
              </p>
              <button
                onClick={() => {
                  setActiveFilter('ALL');
                  setSearchQuery('');
                }}
                className="btn-liquid-primary px-6 py-2.5 rounded-full text-xs uppercase tracking-wider font-bold focus-ring cursor-pointer"
              >
                Clear Search
              </button>
            </div>
          )}
        </section>
      </main>

      {/* Member Profile Liquid Glass Modal */}
      <AnimatePresence>
        {selectedMember && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-labelledby="member-modal-title"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedMember(null)}
              className="fixed inset-0 bg-black/85 backdrop-blur-2xl"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
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
                <MemberAvatar
                  src={selectedMember.image}
                  name={selectedMember.name}
                  size="lg"
                  className="mx-auto mb-4 shadow-2xl ring-4 ring-[#D7B65A]/30"
                />

                <h3 id="member-modal-title" className="font-heading font-extrabold text-xl sm:text-2xl text-white">
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
                  <span>Rotaract District 3206 Certified Leader</span>
                </div>
              </div>

              {/* Social Links */}
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
                      setShowLetterModal(m);
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

      {/* Appointment Letter Modal Preview */}
      <AnimatePresence>
        {showLetterModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-labelledby="letter-modal-title"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLetterModal(null)}
              className="fixed inset-0 bg-black/85 backdrop-blur-2xl"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-w-2xl w-full glass-floating rounded-3xl overflow-hidden border border-white/20 shadow-2xl z-10 p-4 max-h-[92vh] flex flex-col"
            >
              <div className="flex items-center justify-between pb-3.5 border-b border-white/12 px-2">
                <div className="min-w-0 pr-2">
                  <div id="letter-modal-title" className="text-xs sm:text-sm font-heading font-extrabold text-white truncate">
                    Official Appointment Letter — {showLetterModal.name}
                  </div>
                  <div className="text-[11px] sm:text-xs text-[#D7B65A] font-semibold truncate">
                    {showLetterModal.position} • Rotary Year 2026–27
                  </div>
                </div>
                <button
                  onClick={() => setShowLetterModal(null)}
                  className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white shrink-0 focus-ring cursor-pointer"
                  aria-label="Close letter modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="overflow-y-auto mt-3 p-3 bg-[#040812] rounded-2xl flex items-center justify-center border border-white/10">
                {showLetterModal.letterImage && (
                  <img
                    src={showLetterModal.letterImage}
                    alt={`Appointment letter of ${showLetterModal.name}`}
                    loading="lazy"
                    className="max-h-[65vh] sm:max-h-[72vh] w-auto max-w-full object-contain rounded-xl shadow-2xl"
                  />
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer onOpenJoinModal={() => setIsJoinModalOpen(true)} />
      <JoinUs
        isModalOpen={isJoinModalOpen}
        onCloseModal={() => setIsJoinModalOpen(false)}
        onOpenModal={() => setIsJoinModalOpen(true)}
      />
    </div>
  );
};
