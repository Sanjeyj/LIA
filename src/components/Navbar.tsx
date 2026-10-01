import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight, Shield, Sun, Moon } from "lucide-react";
import { CLUB_INFO } from "../data/club";
import { useTheme } from "../contexts/ThemeContext";

interface NavbarProps {
  onOpenJoinModal: () => void;
}

export const Navbar = ({ onOpenJoinModal }: NavbarProps) => {
  const location = useLocation();
  const isHomepage = location.pathname === "/";
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      if (!isHomepage) return;

      const sections = [
        "about", "impact", "what-we-do", "projects", "maayon",
        "events", "journey", "leadership", "gallery", "contact",
      ];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHomepage]);

  const navItems = [
    { name: "About", targetId: "about" },
    { name: "Impact", targetId: "impact" },
    { name: "Projects", targetId: "projects" },
    { name: "MAAYON", targetId: "maayon" },
    { name: "Events", targetId: "events" },
    { name: "Careers", path: "/careers" },
    { name: "Journey", targetId: "journey" },
    { name: "Team", targetId: "leadership" },
    { name: "Gallery", targetId: "gallery" },
    { name: "Contact", targetId: "contact" },
  ];

  const getHref = (item: typeof navItems[number]) => {
    if (item.path) return item.path;
    if (isHomepage) return `#${item.targetId}`;
    if (item.targetId === "impact") return "/impact";
    if (item.targetId === "leadership") return "/team";
    return `/#${item.targetId}`;
  };

  const isItemActive = (item: typeof navItems[number]) => {
    const isCareers = Boolean(item.path);
    const isSubpageActive =
      (item.targetId === "events" && location.pathname.startsWith("/events")) ||
      (item.targetId === "projects" && location.pathname.startsWith("/projects")) ||
      (item.targetId === "gallery" && location.pathname.startsWith("/gallery")) ||
      (item.targetId === "impact" && location.pathname.startsWith("/impact")) ||
      (item.targetId === "leadership" && location.pathname.startsWith("/team"));
    return isCareers
      ? location.pathname.startsWith("/careers")
      : isSubpageActive || (isHomepage && activeSection === item.targetId);
  };

  return (
    <>
      {/* Floating Liquid Glass Navigation Capsule Container */}
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      >
        <div
          className={`w-full px-4 sm:px-8 py-3.5 sm:py-4 transition-all duration-300 flex items-center justify-between ${
            isScrolled
              ? "bg-[#07111F]/70 backdrop-blur-md border-b border-white/10 shadow-lg"
              : "bg-transparent border-b border-transparent"
          }`}
        >
          {/* Logo & TEAM LIA Identity */}
          <a
            href={isHomepage ? "#hero" : "/#hero"}
            className="flex items-center space-x-2 sm:space-x-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D7B65A] rounded-full p-0.5 min-w-0"
            aria-label="Rotaract Club of Lead India Ahead — Home"
          >
            <div className="relative shrink-0 flex items-center justify-center p-1 rounded-full bg-slate-900/5 dark:bg-white/5 border border-slate-900/10 dark:border-white/10 group-hover:border-[#D7B65A]/50 transition-colors">
              <img
                src="/assets/logos/lia-shield.png"
                alt="Rotaract Club of Lead India Ahead shield crest"
                loading="eager"
                decoding="async"
                className="h-7 sm:h-9 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            <div className="flex flex-col min-w-0">
              <div className="flex items-center space-x-1.5">
                <span className="font-heading font-extrabold text-slate-900 dark:text-white text-xs sm:text-sm lg:text-base tracking-tight group-hover:text-[#B89432] dark:group-hover:text-[#E8D89A] transition-colors truncate">
                  TEAM LIA
                </span>
                <span className="hidden xs:inline-flex items-center px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-[#D7B65A]/15 text-[#B89432] dark:text-[#E8D89A] border border-[#D7B65A]/40 rounded-full shrink-0">
                  2026–27
                </span>
              </div>
              <span className="hidden sm:inline-block text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-tight truncate">
                Rotaract Club of Lead India Ahead
              </span>
            </div>
          </a>

          {/* Desktop Floating Liquid Navigation Pill Links */}
          <nav
            aria-label="Main Navigation"
            className="hidden lg:flex items-center space-x-0.5 bg-slate-900/[0.03] dark:bg-white/[0.04] border border-slate-900/8 dark:border-white/10 backdrop-blur-xl px-2 py-1 rounded-full shadow-inner"
          >
            {navItems.map((item) => {
              const isActive = isItemActive(item);
              const href = getHref(item);

              return (
                <a
                  key={item.name}
                  href={href}
                  aria-current={isActive ? "page" : undefined}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors relative focus-ring ${
                    isActive
                      ? "text-slate-900 dark:text-white font-bold"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-900/5 dark:hover:bg-white/5"
                  }`}
                >
                  <span className="relative z-10">{item.name}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeLiquidGlassPill"
                      className="absolute inset-0 bg-gradient-to-r from-[#D7B65A]/25 via-[#EAF1FF] to-[#174EA6]/15 dark:from-[#D7B65A]/25 dark:via-[#E8D89A]/20 dark:to-[#174EA6]/25 border border-[#D7B65A]/50 rounded-full shadow-sm"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Right Action CTAs — desktop */}
          <div className="hidden sm:flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full glass-subtle border border-slate-900/10 dark:border-white/12 text-[#B89432] dark:text-[#D7B65A] hover:scale-105 active:scale-95 transition-all cursor-pointer focus-ring shrink-0"
              aria-label={`Switch to ${theme === "dark" ? "light crystal glass" : "dark liquid glass"} theme`}
              title={`Switch to ${theme === "dark" ? "light crystal glass" : "dark liquid glass"} theme`}
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-[#D7B65A]" />
              ) : (
                <Moon className="w-4 h-4 text-[#174EA6]" />
              )}
            </button>

            <a
              href={isHomepage ? "#leadership" : "/team"}
              className="hidden xl:flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-slate-900/5 dark:bg-white/5 border border-slate-900/10 dark:border-white/10 text-xs text-[#B89432] dark:text-[#E8D89A] hover:bg-slate-900/10 dark:hover:bg-white/10 hover:border-[#D7B65A]/40 transition-all group shrink-0 focus-ring font-semibold"
              aria-label="Explore Team LIA 2026–27"
            >
              <Shield className="w-3.5 h-3.5 text-[#B89432] dark:text-[#D7B65A]" aria-hidden="true" />
              <span className="font-semibold text-[11px] tracking-wide">TEAM LIA</span>
            </a>

            <button
              onClick={onOpenJoinModal}
              className="btn-liquid-primary px-4 py-1.5 sm:py-2 text-xs font-bold uppercase tracking-wider rounded-full flex items-center space-x-1.5 active:scale-95 cursor-pointer focus-ring shrink-0 shadow-sm"
            >
              <span>Join Us</span>
              <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>

          {/* Mobile Navigation Trigger */}
          <div className="flex items-center space-x-2 lg:hidden shrink-0">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full glass-subtle border border-white/12 text-[#D7B65A] active:scale-95 transition-transform cursor-pointer"
              aria-label={`Switch to ${theme === "dark" ? "light crystal glass" : "dark liquid glass"} theme`}
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-[#D7B65A]" />
              ) : (
                <Moon className="w-4 h-4 text-[#2457D6]" />
              )}
            </button>

            <button
              onClick={onOpenJoinModal}
              className="sm:hidden px-3 py-1.5 text-xs font-bold text-[#040812] bg-[#D7B65A] rounded-full active:scale-95 transition-transform cursor-pointer"
            >
              Join
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-full bg-white/5 border border-white/12 text-slate-300 hover:text-white focus-ring active:scale-95 cursor-pointer"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation-menu"
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            >
              {mobileMenuOpen
                ? <X className="w-5 h-5" aria-hidden="true" />
                : <Menu className="w-5 h-5" aria-hidden="true" />
              }
            </button>
          </div>
        </div>
      </header>

      {/* Floating Mobile Glass Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-navigation-menu"
            initial={{ opacity: 0, y: -20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.96 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed top-20 inset-x-4 z-40 glass-floating rounded-3xl p-5 shadow-2xl lg:hidden max-h-[82vh] overflow-y-auto border border-white/16"
          >
            <div className="flex flex-col space-y-3">
              {/* Mobile Identity Card */}
              <div className="p-3 bg-white/5 border border-[#D7B65A]/30 rounded-2xl mb-1 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src="/assets/logos/lia-shield.png"
                    alt="Rotaract LIA"
                    className="h-8 w-auto object-contain"
                  />
                  <div>
                    <div className="text-xs font-bold text-white">TEAM LIA</div>
                    <div className="text-[10px] text-[#D7B65A] font-semibold">Rotary Year 2026–27</div>
                    <div className="text-[10px] text-slate-400">President: {CLUB_INFO.president.name}</div>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-[#D7B65A] bg-[#D7B65A]/15 px-2 py-0.5 rounded-full border border-[#D7B65A]/30">
                  Dist. 3206
                </span>
              </div>

              {/* Mobile Nav Links */}
              <div className="grid grid-cols-2 gap-2">
                {navItems.map((item) => {
                  const isActive = isItemActive(item);
                  const href = getHref(item);

                  return (
                    <a
                      key={item.name}
                      href={href}
                      onClick={() => setMobileMenuOpen(false)}
                      aria-current={isActive ? "page" : undefined}
                      className={`px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-between border ${
                        isActive
                          ? "text-[#E8D89A] bg-[#D7B65A]/15 border-[#D7B65A]/40 shadow-sm"
                          : "text-slate-300 hover:text-white bg-white/5 border-white/5"
                      }`}
                    >
                      <span>{item.name}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
                    </a>
                  );
                })}
              </div>

              <div className="pt-3 border-t border-white/10">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenJoinModal();
                  }}
                  className="w-full btn-liquid-primary py-3 text-center text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg"
                >
                  Join Rotaract LIA 2026–27
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
