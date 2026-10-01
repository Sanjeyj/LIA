import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Calendar, Sparkles, Briefcase, Search, HeartHandshake } from 'lucide-react';

interface MobileQuickBarProps {
  onOpenSearch: () => void;
  onOpenJoinModal: () => void;
}

export const MobileQuickBar: React.FC<MobileQuickBarProps> = ({
  onOpenSearch,
  onOpenJoinModal,
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isHome = location.pathname === '/';
  const isEvents = location.pathname.startsWith('/events');
  const isProjects = location.pathname.startsWith('/projects');
  const isCareers = location.pathname.startsWith('/careers');

  const items = [
    {
      label: 'Home',
      icon: Home,
      isActive: isHome,
      onClick: () => {
        if (isHome) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          navigate('/');
        }
      },
    },
    {
      label: 'Events',
      icon: Calendar,
      isActive: isEvents,
      onClick: () => navigate('/events'),
    },
    {
      label: 'Projects',
      icon: Sparkles,
      isActive: isProjects,
      onClick: () => navigate('/projects'),
    },
    {
      label: 'Careers',
      icon: Briefcase,
      isActive: isCareers,
      onClick: () => navigate('/careers'),
    },
    {
      label: 'Search',
      icon: Search,
      isActive: false,
      onClick: onOpenSearch,
    },
    {
      label: 'Join',
      icon: HeartHandshake,
      isActive: false,
      isSpecial: true,
      onClick: onOpenJoinModal,
    },
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="sm:hidden fixed bottom-3 left-3 right-3 z-40 flex items-center justify-around py-1.5 px-2 rounded-2xl border border-white/10 shadow-2xl"
      style={{
        background: 'rgba(7, 17, 31, 0.88)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.6), 0 0 20px rgba(215, 182, 90, 0.1)',
      }}
    >
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.label}
            type="button"
            onClick={item.onClick}
            className={`relative flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all select-none cursor-pointer ${
              item.isSpecial
                ? 'text-[#07111F] bg-gradient-to-r from-[#D7B65A] to-[#B89432] px-3 py-1 shadow-md shadow-[#D7B65A]/20'
                : item.isActive
                ? 'text-[#D7B65A] font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Icon className={`w-4 h-4 ${item.isSpecial ? 'stroke-[2.5]' : ''}`} />
            <span
              className={`text-[9px] mt-0.5 tracking-tight ${
                item.isSpecial ? 'font-bold text-[#07111F]' : ''
              }`}
            >
              {item.label}
            </span>

            {item.isActive && !item.isSpecial && (
              <motion.div
                layoutId="activeMobileTab"
                className="absolute -bottom-1 w-1 h-1 rounded-full bg-[#D7B65A]"
                transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              />
            )}
          </button>
        );
      })}
    </nav>
  );
};
