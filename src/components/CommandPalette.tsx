import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Calendar,
  Briefcase,
  Users,
  Compass,
  FileText,
  Image,
  ArrowRight,
  X,
  Sparkles,
  Command,
  HeartHandshake,
} from 'lucide-react';
import { EVENTS } from '../data/events';
import { PROJECTS } from '../data/projects';
import { TEAM_MEMBERS } from '../data/team';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenJoinModal?: () => void;
}

interface SearchItem {
  id: string;
  title: string;
  subtitle?: string;
  category: 'Pages' | 'Events' | 'Projects' | 'Careers' | 'Team' | 'Actions';
  icon: React.ReactNode;
  url?: string;
  action?: () => void;
  badge?: string;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onOpenJoinModal,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Static Pages and Quick Actions
  const staticItems: SearchItem[] = useMemo(
    () => [
      {
        id: 'page-home',
        title: 'Home',
        subtitle: 'Main homepage & overview',
        category: 'Pages',
        icon: <Compass className="w-4 h-4 text-[#D7B65A]" />,
        url: '/',
      },
      {
        id: 'page-events',
        title: 'Events & Initiatives',
        subtitle: 'All flagship & community events',
        category: 'Pages',
        icon: <Calendar className="w-4 h-4 text-emerald-400" />,
        url: '/events',
      },
      {
        id: 'page-projects',
        title: 'Featured Projects',
        subtitle: 'High-impact community programs',
        category: 'Pages',
        icon: <Sparkles className="w-4 h-4 text-sky-400" />,
        url: '/projects',
      },
      {
        id: 'page-careers',
        title: 'Careers & Opportunities',
        subtitle: 'Internships, fellowships & volunteer roles',
        category: 'Pages',
        icon: <Briefcase className="w-4 h-4 text-purple-400" />,
        url: '/careers',
      },
      {
        id: 'page-gallery',
        title: 'Photo Gallery',
        subtitle: 'Memories, celebrations & milestones',
        category: 'Pages',
        icon: <Image className="w-4 h-4 text-rose-400" />,
        url: '/gallery',
      },
      {
        id: 'page-team',
        title: 'Leadership & Team',
        subtitle: 'Board of Directors & Committee Chairs 2026–27',
        category: 'Pages',
        icon: <Users className="w-4 h-4 text-amber-400" />,
        url: '/team',
      },
      {
        id: 'page-impact',
        title: 'Impact & Metrics',
        subtitle: 'Measurable social progress & verified numbers',
        category: 'Pages',
        icon: <FileText className="w-4 h-4 text-cyan-400" />,
        url: '/impact',
      },
      {
        id: 'action-join',
        title: 'Join Rotaract Club of LIA',
        subtitle: 'Apply for membership in MAAYON 2026–27',
        category: 'Actions',
        icon: <HeartHandshake className="w-4 h-4 text-[#D7B65A]" />,
        action: () => {
          onClose();
          onOpenJoinModal?.();
        },
        badge: 'Open Application',
      },
      {
        id: 'action-admin',
        title: 'Administrator CMS Portal',
        subtitle: 'Manage events, articles, careers & governance',
        category: 'Actions',
        icon: <Command className="w-4 h-4 text-slate-400" />,
        url: '/admin/login',
        badge: 'Secure',
      },
    ],
    [onClose, onOpenJoinModal]
  );

  // Dynamic Event and Project Items
  const searchableItems: SearchItem[] = useMemo(() => {
    const eventItems: SearchItem[] = EVENTS.map((e) => ({
      id: `event-${e.id}`,
      title: e.title,
      subtitle: `${e.category} • ${e.displayDate}`,
      category: 'Events',
      icon: <Calendar className="w-4 h-4 text-emerald-400" />,
      url: `/events/${e.slug}`,
      badge: e.featured ? 'Featured' : undefined,
    }));

    const projectItems: SearchItem[] = PROJECTS.map((p) => ({
      id: `project-${p.id}`,
      title: p.title,
      subtitle: `${p.category} • ${p.date}`,
      category: 'Projects',
      icon: <Sparkles className="w-4 h-4 text-sky-400" />,
      url: `/projects/${p.slug}`,
      badge: p.featured ? 'Flagship' : undefined,
    }));

    const teamItems: SearchItem[] = TEAM_MEMBERS.slice(0, 10).map((t) => ({
      id: `team-${t.id}`,
      title: t.name,
      subtitle: `${t.position} • ${t.department}`,
      category: 'Team',
      icon: <Users className="w-4 h-4 text-amber-400" />,
      url: '/team',
    }));

    return [...staticItems, ...eventItems, ...projectItems, ...teamItems];
  }, [staticItems]);

  // Filter items based on user query
  const filteredItems = useMemo(() => {
    const cleanQuery = query.toLowerCase().trim();
    if (!cleanQuery) {
      return staticItems;
    }
    return searchableItems
      .filter((item) => {
        return (
          item.title.toLowerCase().includes(cleanQuery) ||
          (item.subtitle && item.subtitle.toLowerCase().includes(cleanQuery)) ||
          item.category.toLowerCase().includes(cleanQuery)
        );
      })
      .slice(0, 8);
  }, [query, staticItems, searchableItems]);

  // Handle item selection
  const handleSelect = (item: SearchItem) => {
    onClose();
    if (item.action) {
      item.action();
    } else if (item.url) {
      if (item.url.startsWith('#') || item.url.startsWith('/#')) {
        const hash = item.url.replace(/^\/?#/, '');
        const el = document.getElementById(hash);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        } else {
          navigate(item.url);
        }
      } else {
        navigate(item.url);
      }
    }
  };

  // Keyboard navigation inside list
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev === 0 ? Math.max(0, filteredItems.length - 1) : prev - 1
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        handleSelect(filteredItems[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  // Scroll active item into view
  useEffect(() => {
    if (listRef.current) {
      const activeEl = listRef.current.children[selectedIndex] as HTMLElement | undefined;
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 pb-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#040A14]/80 backdrop-blur-md"
            aria-hidden="true"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl border border-white/10 dark:border-white/15 z-10"
            style={{
              background: 'linear-gradient(135deg, rgba(14, 31, 56, 0.95) 0%, rgba(7, 17, 31, 0.98) 100%)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 0 40px rgba(215, 182, 90, 0.1)',
            }}
          >
            {/* Search Input Bar */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/10 bg-white/[0.02]">
              <Search className="w-5 h-5 text-[#D7B65A] shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Type to search events, projects, leadership, careers..."
                className="w-full bg-transparent text-sm sm:text-base text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-0"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="p-1 rounded-md text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : (
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono text-slate-400 px-2 py-0.5 rounded border border-white/10 bg-white/5">
                  <kbd>ESC</kbd>
                </span>
              )}
            </div>

            {/* Results List */}
            <div
              ref={listRef}
              className="max-h-[380px] overflow-y-auto p-2 divide-y divide-white/[0.04]"
            >
              {filteredItems.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="w-12 h-12 rounded-full bg-white/5 mx-auto flex items-center justify-center text-slate-400 mb-3">
                    <Search className="w-5 h-5" />
                  </div>
                  <p className="text-sm font-medium text-slate-200">No results found</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Try searching with another keyword like "football", "installation", or "careers".
                  </p>
                </div>
              ) : (
                filteredItems.map((item, idx) => {
                  const isSelected = idx === selectedIndex;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelect(item)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`w-full flex items-center justify-between gap-3 px-3.5 py-3 rounded-xl text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-gradient-to-r from-[#D7B65A]/20 via-[#D7B65A]/10 to-transparent border border-[#D7B65A]/35 text-white'
                          : 'hover:bg-white/5 text-slate-300 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                            isSelected
                              ? 'bg-[#D7B65A]/20 border-[#D7B65A]/40'
                              : 'bg-white/5 border-white/10'
                          }`}
                        >
                          {item.icon}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm text-slate-100 truncate">
                              {item.title}
                            </span>
                            {item.badge && (
                              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-[#D7B65A]/20 text-[#E8D89A] border border-[#D7B65A]/30">
                                {item.badge}
                              </span>
                            )}
                          </div>
                          {item.subtitle && (
                            <p className="text-xs text-slate-400 truncate mt-0.5">
                              {item.subtitle}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[11px] font-medium text-slate-500 hidden sm:inline-block">
                          {item.category}
                        </span>
                        <ArrowRight
                          className={`w-4 h-4 transition-transform ${
                            isSelected ? 'text-[#D7B65A] translate-x-0.5' : 'text-slate-600'
                          }`}
                        />
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer Quick Shortcuts */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-white/[0.02] border-t border-white/10 text-[11px] text-slate-400">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded border border-white/10 bg-white/5 font-mono">↑</kbd>
                  <kbd className="px-1.5 py-0.5 rounded border border-white/10 bg-white/5 font-mono">↓</kbd> Navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded border border-white/10 bg-white/5 font-mono">↵</kbd> Select
                </span>
              </div>
              <span className="text-[10px] text-[#D7B65A] font-semibold tracking-wider uppercase">
                Team LIA 2026–27
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
