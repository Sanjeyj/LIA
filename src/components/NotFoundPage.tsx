import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, Briefcase, ArrowLeft } from 'lucide-react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { JoinUs } from './JoinUs';
import { SEO } from './SEO';
import { Reveal } from './Reveal';

export const NotFoundPage: React.FC = () => {
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#07111F] text-[#F5F1E8] selection:bg-[#C9A961]/30 selection:text-[#F5F1E8] flex flex-col relative overflow-hidden">
      {/* Soft background radial gold glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#C9A961]/10 rounded-full blur-[120px] pointer-events-none" />

      {/* 404 Noindex SEO */}
      <SEO
        title="404 — Page Not Found"
        description="The requested page could not be found on the Rotaract Club of Lead India Ahead website."
        noindex={true}
      />

      <Navbar onOpenJoinModal={() => setIsJoinModalOpen(true)} />

      <main className="flex-grow flex items-center justify-center pt-32 sm:pt-40 pb-24 px-4 sm:px-6 relative z-10">
        <Reveal className="max-w-md w-full">
          <div className="glass-panel rounded-3xl border border-[#C9A961]/25 bg-[#0E1F38]/80 backdrop-blur-xl p-8 sm:p-10 text-center shadow-2xl space-y-6">
            {/* Logo / Crest Badge */}
            <div className="w-16 h-16 rounded-2xl bg-[#07111F] border border-[#C9A961]/40 mx-auto flex items-center justify-center p-3 shadow-lg">
              <img
                src="/assets/logos/lia-shield.png"
                alt="LIA Shield"
                className="w-full h-full object-contain"
              />
            </div>

            <div className="space-y-2">
              <span className="text-5xl sm:text-6xl font-display font-extrabold text-[#C9A961] block tracking-tight">
                404
              </span>
              <h1 className="text-2xl sm:text-3xl font-display font-bold text-[#F5F1E8]">
                PAGE NOT FOUND
              </h1>
              <p className="text-xs sm:text-sm text-[#8E9DAE] leading-relaxed">
                The page you are looking for doesn't exist, has been removed, or moved to another URL.
              </p>
            </div>

            {/* Action Links */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-bold text-xs bg-[#C9A961] hover:bg-[#DFCA95] text-[#07111F] shadow-lg shadow-[#C9A961]/20 transition-all cursor-pointer uppercase tracking-wider"
              >
                <Home className="w-4 h-4" />
                Back Home
              </Link>
              <Link
                to="/careers"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-xs font-semibold bg-[#152A4A] hover:bg-[#1C365D] text-[#F5F1E8] border border-[#C9A961]/30 transition-all cursor-pointer uppercase tracking-wider"
              >
                <Briefcase className="w-4 h-4 text-[#C9A961]" />
                Careers
              </Link>
            </div>

            <div className="pt-4 border-t border-white/10">
              <Link
                to="/#events"
                className="inline-flex items-center gap-1.5 text-xs text-[#8E9DAE] hover:text-[#C9A961] transition-colors link-gold-underline"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-[#C9A961]" />
                Explore Events &amp; Initiatives
              </Link>
            </div>
          </div>
        </Reveal>
      </main>

      {/* Global Join Modal */}
      <JoinUs
        isModalOpen={isJoinModalOpen}
        onCloseModal={() => setIsJoinModalOpen(false)}
        onOpenModal={() => setIsJoinModalOpen(true)}
      />

      <Footer onOpenJoinModal={() => setIsJoinModalOpen(true)} />
    </div>
  );
};
