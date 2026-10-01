import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

export const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
      }
      setIsVisible(window.scrollY > 250);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const circleRadius = 18;
  const circumference = 2 * Math.PI * circleRadius;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          type="button"
          onClick={scrollToTop}
          initial={{ opacity: 0, scale: 0.8, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 15 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.92 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="fixed bottom-6 right-6 z-40 p-1 rounded-full flex items-center justify-center cursor-pointer shadow-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D7B65A] mb-14 sm:mb-0"
          style={{
            background: 'rgba(7, 17, 31, 0.85)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.6), 0 0 15px rgba(215, 182, 90, 0.25)',
          }}
          aria-label="Scroll back to top"
          title={`Scroll to top (${Math.round(scrollProgress)}%)`}
        >
          {/* Circular Progress Ring */}
          <svg className="w-11 h-11 -rotate-90 transform" viewBox="0 0 44 44">
            {/* Background track */}
            <circle
              cx="22"
              cy="22"
              r={circleRadius}
              className="text-white/10"
              strokeWidth="2.5"
              stroke="currentColor"
              fill="transparent"
            />
            {/* Progress indicator */}
            <circle
              cx="22"
              cy="22"
              r={circleRadius}
              className="text-[#D7B65A] transition-all duration-150"
              strokeWidth="2.5"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
            />
          </svg>

          {/* Icon */}
          <div className="absolute inset-0 flex items-center justify-center text-[#D7B65A] hover:text-white transition-colors">
            <ArrowUp className="w-4 h-4 stroke-[2.5]" />
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  );
};
