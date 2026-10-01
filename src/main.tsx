import { StrictMode, Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import './index.css';
import App from './App.tsx';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AnalyticsTracker } from './components/AnalyticsTracker';

// Route-level code splitting: isolate admin CMS, heavy public subpages, and editor bundles
const AdminApp = lazy(() => import('./admin/AdminApp').then(m => ({ default: m.AdminApp })));
const CareersPage = lazy(() => import('./components/CareersPage').then(m => ({ default: m.CareersPage })));
const CareerDetailPage = lazy(() => import('./components/CareerDetailPage').then(m => ({ default: m.CareerDetailPage })));
const EventsPage = lazy(() => import('./components/EventsPage').then(m => ({ default: m.EventsPage })));
const EventDetailPage = lazy(() => import('./components/EventDetailPage').then(m => ({ default: m.EventDetailPage })));
const ProjectsPage = lazy(() => import('./components/ProjectsPage').then(m => ({ default: m.ProjectsPage })));
const ProjectDetailPage = lazy(() => import('./components/ProjectDetailPage').then(m => ({ default: m.ProjectDetailPage })));
const GalleryPage = lazy(() => import('./components/GalleryPage').then(m => ({ default: m.GalleryPage })));
const PostsPage = lazy(() => import('./components/PostsPage').then(m => ({ default: m.PostsPage })));
const PostDetailPage = lazy(() => import('./components/PostDetailPage').then(m => ({ default: m.PostDetailPage })));
const ImpactPage = lazy(() => import('./components/ImpactPage').then(m => ({ default: m.ImpactPage })));
const TeamPage = lazy(() => import('./components/TeamPage').then(m => ({ default: m.TeamPage })));
const NotFoundPage = lazy(() => import('./components/NotFoundPage').then(m => ({ default: m.NotFoundPage })));

import { LiquidPageTransition } from './components/LiquidPageTransition';
import { useLocation } from 'react-router-dom';

const RouteLoadingFallback = () => (
  <div className="min-h-screen bg-[var(--lia-bg)] flex flex-col items-center justify-center p-4">
    <div className="relative flex items-center justify-center">
      <div className="w-10 h-10 rounded-full border-2 border-[#D7B65A]/20 border-t-[#D7B65A] animate-spin" />
      <div className="absolute w-5 h-5 rounded-full bg-[#D7B65A]/15 animate-ping" />
    </div>
    <span className="mt-4 text-[11px] font-bold tracking-widest uppercase text-[#D7B65A]/80">
      Loading
    </span>
  </div>
);

function AppRoutes() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  const routes = (
    <Routes>
      <Route path="/admin/*" element={<AdminApp />} />
      <Route path="/careers" element={<CareersPage />} />
      <Route path="/careers/:slug" element={<CareerDetailPage />} />
      <Route path="/events" element={<EventsPage />} />
      <Route path="/events/:slug" element={<EventDetailPage />} />
      <Route path="/projects" element={<ProjectsPage />} />
      <Route path="/projects/:slug" element={<ProjectDetailPage />} />
      <Route path="/gallery" element={<GalleryPage />} />
      <Route path="/posts" element={<PostsPage />} />
      <Route path="/posts/:slug" element={<PostDetailPage />} />
      <Route path="/impact" element={<ImpactPage />} />
      <Route path="/team" element={<TeamPage />} />
      <Route path="/" element={<App />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );

  if (isAdmin) {
    return routes;
  }

  return <LiquidPageTransition>{routes}</LiquidPageTransition>;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <MotionConfig reducedMotion="user">
        <BrowserRouter>
          <AnalyticsTracker />
          <ThemeProvider>
            <AuthProvider>
              <Suspense fallback={<RouteLoadingFallback />}>
                <AppRoutes />
              </Suspense>
            </AuthProvider>
          </ThemeProvider>
        </BrowserRouter>
      </MotionConfig>
    </ErrorBoundary>
  </StrictMode>,
);


