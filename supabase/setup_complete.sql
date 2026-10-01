-- ============================================================
-- LIA Website — Initial Database Schema
-- Migration: 001_initial_schema.sql
-- Run this in: Supabase Dashboard → SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. PROFILES (extends Supabase Auth)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT NOT NULL,
  role        TEXT NOT NULL DEFAULT 'viewer' CHECK (role IN ('admin', 'editor', 'viewer')),
  full_name   TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Prevent users from self-promoting their role
CREATE OR REPLACE FUNCTION public.prevent_role_self_promotion()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  -- Only allow role changes by an admin (via service-role key or admin function)
  IF OLD.role != NEW.role AND auth.uid() = NEW.id THEN
    RAISE EXCEPTION 'Users cannot modify their own role';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS prevent_role_self_promotion_trigger ON public.profiles;
CREATE TRIGGER prevent_role_self_promotion_trigger
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.prevent_role_self_promotion();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (NEW.id, NEW.email, 'viewer')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Helper function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN LANGUAGE sql SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- ============================================================
-- 2. EVENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.events (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title           TEXT NOT NULL,
  subtitle        TEXT,
  slug            TEXT NOT NULL UNIQUE,
  description     TEXT,
  short_description TEXT,
  event_date      DATE,
  display_date    TEXT,
  start_time      TEXT,
  end_time        TEXT,
  venue           TEXT,
  city            TEXT DEFAULT 'Coimbatore',
  category        TEXT DEFAULT 'Other',
  organizer       TEXT,
  organizer_type  TEXT DEFAULT 'LIA',
  lia_role        TEXT DEFAULT 'Organizer',
  collaborators   TEXT[] DEFAULT '{}',
  tags            TEXT[] DEFAULT '{}',
  status          TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  featured        BOOLEAN NOT NULL DEFAULT FALSE,
  cover_image_url TEXT,
  external_url    TEXT,
  instagram_url   TEXT,
  linkedin_url    TEXT,
  source_platform TEXT,
  source_url      TEXT,
  source_verified BOOLEAN DEFAULT FALSE,
  year            INTEGER,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by      UUID REFERENCES auth.users(id),
  updated_by      UUID REFERENCES auth.users(id)
);

CREATE INDEX idx_events_status      ON public.events(status);
CREATE INDEX idx_events_event_date  ON public.events(event_date DESC);
CREATE INDEX idx_events_slug        ON public.events(slug);
CREATE INDEX idx_events_featured    ON public.events(featured);
CREATE INDEX idx_events_year        ON public.events(year DESC);

-- ============================================================
-- 3. EVENT IMAGES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.event_images (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id    UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  image_url   TEXT NOT NULL,
  storage_path TEXT,
  caption     TEXT,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  is_cover    BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_event_images_event_id   ON public.event_images(event_id);
CREATE INDEX idx_event_images_sort_order ON public.event_images(event_id, sort_order);

-- ============================================================
-- 4. POSTS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.posts (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title           TEXT NOT NULL,
  slug            TEXT NOT NULL UNIQUE,
  excerpt         TEXT,
  content         TEXT,
  cover_image_url TEXT,
  category        TEXT DEFAULT 'General',
  author          TEXT DEFAULT 'LIA Team',
  publish_date    DATE,
  featured        BOOLEAN NOT NULL DEFAULT FALSE,
  status          TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  instagram_url   TEXT,
  linkedin_url    TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by      UUID REFERENCES auth.users(id),
  updated_by      UUID REFERENCES auth.users(id)
);

CREATE INDEX idx_posts_status      ON public.posts(status);
CREATE INDEX idx_posts_slug        ON public.posts(slug);
CREATE INDEX idx_posts_featured    ON public.posts(featured);
CREATE INDEX idx_posts_publish_date ON public.posts(publish_date DESC);

-- ============================================================
-- 5. PROJECTS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.projects (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title           TEXT NOT NULL,
  slug            TEXT NOT NULL UNIQUE,
  description     TEXT,
  short_description TEXT,
  category        TEXT DEFAULT 'Community Service',
  project_date    TEXT,
  year            INTEGER,
  status          TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  featured        BOOLEAN NOT NULL DEFAULT FALSE,
  cover_image_url TEXT,
  collaborators   TEXT[] DEFAULT '{}',
  impact_metrics  JSONB DEFAULT '[]',
  source_platform TEXT,
  source_url      TEXT,
  source_verified BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by      UUID REFERENCES auth.users(id),
  updated_by      UUID REFERENCES auth.users(id)
);

CREATE INDEX idx_projects_status   ON public.projects(status);
CREATE INDEX idx_projects_slug     ON public.projects(slug);
CREATE INDEX idx_projects_featured ON public.projects(featured);
CREATE INDEX idx_projects_year     ON public.projects(year DESC);

-- ============================================================
-- 6. PROJECT IMAGES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.project_images (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id   UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  image_url    TEXT NOT NULL,
  storage_path TEXT,
  caption      TEXT,
  sort_order   INTEGER NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_project_images_project_id ON public.project_images(project_id);

-- ============================================================
-- 7. GALLERY ALBUMS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.gallery_albums (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name            TEXT NOT NULL,
  description     TEXT,
  event_id        UUID REFERENCES public.events(id) ON DELETE SET NULL,
  cover_image_url TEXT,
  published       BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order      INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_gallery_albums_published ON public.gallery_albums(published);
CREATE INDEX idx_gallery_albums_event_id  ON public.gallery_albums(event_id);

-- ============================================================
-- 8. GALLERY IMAGES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.gallery_images (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  album_id     UUID REFERENCES public.gallery_albums(id) ON DELETE SET NULL,
  image_url    TEXT NOT NULL,
  storage_path TEXT,
  title        TEXT,
  caption      TEXT,
  category     TEXT DEFAULT 'EVENTS',
  date         TEXT,
  featured     BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order   INTEGER NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_gallery_images_album_id ON public.gallery_images(album_id);
CREATE INDEX idx_gallery_images_featured ON public.gallery_images(featured);
CREATE INDEX idx_gallery_images_category ON public.gallery_images(category);

-- ============================================================
-- 9. TEAM MEMBERS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.team_members (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name              TEXT NOT NULL,
  designation       TEXT NOT NULL,
  bio               TEXT,
  profile_image_url TEXT,
  letter_image_url  TEXT,
  term              TEXT DEFAULT '2026–27',
  college_company   TEXT,
  blood_group       TEXT,
  is_executive      BOOLEAN NOT NULL DEFAULT FALSE,
  display_order     INTEGER NOT NULL DEFAULT 0,
  published         BOOLEAN NOT NULL DEFAULT TRUE,
  instagram_url     TEXT,
  linkedin_url      TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_team_members_published     ON public.team_members(published);
CREATE INDEX idx_team_members_display_order ON public.team_members(display_order);
CREATE INDEX idx_team_members_is_executive  ON public.team_members(is_executive);

-- ============================================================
-- 10. WEBSITE CONTENT
-- ============================================================
CREATE TABLE IF NOT EXISTS public.website_content (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section     TEXT NOT NULL,
  key         TEXT NOT NULL,
  value       TEXT,
  value_json  JSONB,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(section, key)
);

CREATE INDEX idx_website_content_section ON public.website_content(section, key);

-- ============================================================
-- 11. SITE SETTINGS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.site_settings (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key         TEXT NOT NULL UNIQUE,
  value       TEXT,
  label       TEXT,
  description TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_site_settings_key ON public.site_settings(key);

-- ============================================================
-- AUTO-UPDATE updated_at TRIGGER
-- ============================================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_events_updated_at ON public.events;
CREATE TRIGGER set_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_posts_updated_at ON public.posts;
CREATE TRIGGER set_posts_updated_at
  BEFORE UPDATE ON public.posts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_projects_updated_at ON public.projects;
CREATE TRIGGER set_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_gallery_albums_updated_at ON public.gallery_albums;
CREATE TRIGGER set_gallery_albums_updated_at
  BEFORE UPDATE ON public.gallery_albums
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_team_members_updated_at ON public.team_members;
CREATE TRIGGER set_team_members_updated_at
  BEFORE UPDATE ON public.team_members
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_website_content_updated_at ON public.website_content;
CREATE TRIGGER set_website_content_updated_at
  BEFORE UPDATE ON public.website_content
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_site_settings_updated_at ON public.site_settings;
CREATE TRIGGER set_site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE public.profiles        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_images    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_images  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_albums  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_images  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings   ENABLE ROW LEVEL SECURITY;

-- PROFILES
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admin can view all profiles" ON public.profiles
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Admin can manage profiles" ON public.profiles
  FOR ALL USING (public.is_admin());

-- EVENTS — Public read of published; Admin full CRUD
CREATE POLICY "Public can read published events" ON public.events
  FOR SELECT USING (status = 'published');

CREATE POLICY "Admin can manage all events" ON public.events
  FOR ALL USING (public.is_admin());

-- EVENT IMAGES — Public read; Admin full CRUD
CREATE POLICY "Public can read event images" ON public.event_images
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.events e
      WHERE e.id = event_images.event_id AND e.status = 'published'
    )
  );

CREATE POLICY "Admin can manage all event images" ON public.event_images
  FOR ALL USING (public.is_admin());

-- POSTS
CREATE POLICY "Public can read published posts" ON public.posts
  FOR SELECT USING (status = 'published');

CREATE POLICY "Admin can manage all posts" ON public.posts
  FOR ALL USING (public.is_admin());

-- PROJECTS
CREATE POLICY "Public can read published projects" ON public.projects
  FOR SELECT USING (status = 'published');

CREATE POLICY "Admin can manage all projects" ON public.projects
  FOR ALL USING (public.is_admin());

-- PROJECT IMAGES
CREATE POLICY "Public can read project images" ON public.project_images
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = project_images.project_id AND p.status = 'published'
    )
  );

CREATE POLICY "Admin can manage all project images" ON public.project_images
  FOR ALL USING (public.is_admin());

-- GALLERY ALBUMS
CREATE POLICY "Public can read published albums" ON public.gallery_albums
  FOR SELECT USING (published = TRUE);

CREATE POLICY "Admin can manage all albums" ON public.gallery_albums
  FOR ALL USING (public.is_admin());

-- GALLERY IMAGES
CREATE POLICY "Public can read gallery images in published albums" ON public.gallery_images
  FOR SELECT USING (
    album_id IS NULL OR
    EXISTS (
      SELECT 1 FROM public.gallery_albums ga
      WHERE ga.id = gallery_images.album_id AND ga.published = TRUE
    )
  );

CREATE POLICY "Admin can manage all gallery images" ON public.gallery_images
  FOR ALL USING (public.is_admin());

-- TEAM MEMBERS
CREATE POLICY "Public can read published team members" ON public.team_members
  FOR SELECT USING (published = TRUE);

CREATE POLICY "Admin can manage all team members" ON public.team_members
  FOR ALL USING (public.is_admin());

-- WEBSITE CONTENT
CREATE POLICY "Public can read website content" ON public.website_content
  FOR SELECT USING (TRUE);

CREATE POLICY "Admin can manage website content" ON public.website_content
  FOR ALL USING (public.is_admin());

-- SITE SETTINGS
CREATE POLICY "Public can read site settings" ON public.site_settings
  FOR SELECT USING (TRUE);

CREATE POLICY "Admin can manage site settings" ON public.site_settings
  FOR ALL USING (public.is_admin());
-- ============================================================
-- LIA Website — Seed Data from Existing Static Files
-- Migration: 002_seed_data.sql
-- Run AFTER 001_initial_schema.sql
-- ============================================================

-- ============================================================
-- SITE SETTINGS (from src/data/club.ts)
-- ============================================================
INSERT INTO public.site_settings (key, value, label) VALUES
  ('club_name',         'Rotaract Club of Lead India Ahead', 'Club Name'),
  ('short_name',        'LIA',                               'Short Name'),
  ('established',       '2012',                              'Year Established'),
  ('district',          'Rotaract District 3206',            'District'),
  ('club_id',           '90062',                             'Club ID'),
  ('rotary_year',       '2026–27',                           'Current Rotary Year'),
  ('current_theme',     'MAAYON',                            'Presidential Theme'),
  ('president_name',    'Rtr. Hariharan B',                  'President Name'),
  ('president_title',   'President',                         'President Title'),
  ('president_term',    '2026–27',                           'President Term'),
  ('location',          'Coimbatore, Tamil Nadu, India',     'Location'),
  ('sponsor_club',      'Rotary Club of Coimbatore Texcity', 'Sponsor Club'),
  ('email',             'racleadindiaahead2021@gmail.com',   'Email Address'),
  ('phone_primary',     '+91 63697 98451',                   'Primary Phone'),
  ('phone_secondary',   '+91 75027 97780',                   'Secondary Phone'),
  ('instagram_handle',  '@rotaract.clubof.lia',              'Instagram Handle'),
  ('instagram_url',     'https://www.instagram.com/rotaract.clubof.lia/', 'Instagram URL'),
  ('linkedin_url',      'https://www.linkedin.com/company/rotaract-club-of-lead-india-ahead/', 'LinkedIn URL'),
  ('address',           'Coimbatore, Tamil Nadu, India',     'Address'),
  ('seo_title',         'Rotaract Club of Lead India Ahead | MAAYON 2026–27', 'SEO Title'),
  ('seo_description',   'Official website of the Rotaract Club of Lead India Ahead (LIA), Rotaract District 3206, Coimbatore. Presidential theme: MAAYON 2026–27.', 'SEO Description')
ON CONFLICT (key) DO NOTHING;

-- ============================================================
-- EVENTS (from src/data/events.ts)
-- ============================================================
INSERT INTO public.events (
  id, title, subtitle, slug, description, short_description,
  event_date, display_date, year, category, status, venue, city,
  organizer, organizer_type, lia_role, collaborators, tags,
  featured, cover_image_url, source_platform, source_url, source_verified
) VALUES
(
  uuid_generate_v4(), 'THE ONE',
  '13th Installation Ceremony — Rotary Year 2026–27',
  'the-one-13th-installation',
  'The Rotaract Club of Lead India Ahead conducted its prestigious 13th Installation Ceremony, titled "THE ONE", marking the official commencement of the Rotary Year 2026–27 under the presidential theme MAAYON. The event welcomed 100+ Rotaractors along with distinguished Rotarians, alumni, family members, and well-wishers. Rtr. Hariharan B officially assumed office as the 13th President of the Rotaract Club of LIA. The ceremony received prominent media coverage in the Afternoon Newspaper.',
  'The 13th Installation Ceremony of LIA marking the commencement of Rotary Year 2026–27 and installation of President Rtr. Hariharan B.',
  '2026-07-18', '18 July 2026', 2026, 'Leadership', 'published',
  'Texcity Hall, Coimbatore', 'Coimbatore',
  'Rotaract Club of Lead India Ahead', 'LIA', 'Organizer',
  ARRAY['Rotary Club of Coimbatore Texcity'],
  ARRAY['Installation', 'Leadership', 'MAAYON 2026–27', 'Press Featured'],
  true, '/assets/events/the-one.jpg', 'LinkedIn',
  'https://www.linkedin.com/posts/rotaract-club-of-lead-india-ahead_we-are-delighted-to-share-that-the-13th-installation-activity-7485011862175223810-5td-',
  true
),
(
  uuid_generate_v4(), 'TAKEOFF',
  'District Rotaract Representative Installation 2026–27',
  'takeoff-drr-installation',
  'LIA members represented the club at the landmark TAKEOFF Installation Ceremony of the District Rotaract Representative (DRR) for Rotary Year 2026–27, affirming our dedication to district alignment, fellowship, and collective youth leadership.',
  'LIA club representation at the 2026–27 District Rotaract Representative (DRR) installation ceremony.',
  '2026-07-12', '12 July 2026', 2026, 'District Event', 'published',
  'District 3206, Coimbatore', 'Coimbatore',
  'Rotaract District 3206', 'DISTRICT', 'Participant',
  ARRAY['Clubs of District 3206'],
  ARRAY['District Event', 'Fellowship', 'DRR Installation'],
  false, '/assets/events/takeoff.jpg', 'Instagram',
  'https://www.instagram.com/rotaract.clubof.lia/', true
),
(
  uuid_generate_v4(), 'FLIGHT PATH',
  'Incoming Presidents & Secretaries Learning Seminar',
  'flight-path-presidents-secretaries-seminar',
  'A comprehensive district-level training seminar for incoming Presidents and Secretaries for Rotary Year 2026–27. The programme encompassed icebreaker modules, Rotary International updates, Rotaract governance fundamentals, 100% efficiency metrics, and executive strategy meetings.',
  'District leadership development seminar attended by incoming LIA presidential and secretarial officers.',
  '2026-06-07', '07 June 2026', 2026, 'Leadership', 'published',
  'NISE ICSE/ISC School, Coimbatore', 'Coimbatore',
  'Rotaract District 3206', 'DISTRICT', 'Participant',
  ARRAY[]::TEXT[],
  ARRAY['Leadership', 'Governance', 'District Seminar'],
  false, '/assets/events/flight-path.jpg', 'Instagram',
  'https://www.instagram.com/rotaract.clubof.lia/', true
),
(
  uuid_generate_v4(), '5-A-Side Kids Football Tournament',
  'Grassroots Youth Sports & Anti-Drug Awareness',
  'kids-5-a-side-football-tournament',
  'Coimbatore Eagles – New Life Sports Football Academy, in association with Rotary Club of Coimbatore Texcity and Rotaract Club of Lead India Ahead, conducted an energetic 5-A-Side Kids Football Tournament. Featuring 12 teams, 120+ young footballers, 30 coaches, and 300+ enthusiastic spectators, the event combined grassroots sports with impactful social campaigns: "Say No to Drugs" and "Say No to Gender-Based Violence".',
  'Collaborative youth tournament featuring 120+ players promoting social awareness against drugs and violence.',
  '2026-06-21', '21 June 2026', 2026, 'Sports', 'published',
  'Coimbatore', 'Coimbatore',
  'Coimbatore Eagles & Rotary Texcity & Rotaract LIA', 'LIA_COLLABORATION', 'Co-Organizer',
  ARRAY['Coimbatore Eagles – New Life Sports Academy', 'Rotary Club of Coimbatore Texcity'],
  ARRAY['Community Service', 'Sports', 'Youth Welfare', 'Anti-Drug Campaign'],
  true, '/assets/events/football.jpg', 'Instagram',
  'https://www.instagram.com/rotaract.clubof.lia/', true
),
(
  uuid_generate_v4(), 'DHEEMA',
  'Defeat Hepatitis, Empower Every Mind — World Hepatitis Day',
  'dheema-hepatitis-awareness',
  'A vital public health initiative conducted on World Hepatitis Day 2026 in collaboration with Rotaract Club of SNS College of Technology and Rotaract Club of Coimbatore Unity, with active participation from Rotaract Club of LIA.',
  'Collaborative public health awareness drive on World Hepatitis Day focusing on prevention and early screening.',
  '2026-07-28', '28 July 2026', 2026, 'Health', 'published',
  'Coimbatore', 'Coimbatore',
  'Rotaract Clubs of SNS Tech, Coimbatore Unity & LIA', 'LIA_COLLABORATION', 'Co-Organizer',
  ARRAY['Rotaract Club of SNS College of Technology', 'Rotaract Club of Coimbatore Unity'],
  ARRAY['Health Awareness', 'World Hepatitis Day', 'Community Impact'],
  false, '/assets/events/dheema.jpg', 'Instagram',
  'https://www.instagram.com/rotaract.clubof.lia/', true
),
(
  uuid_generate_v4(), 'MIND MATTERS',
  'Breaking the Pressure to Fit In — District Priority Project',
  'mind-matters-mental-health',
  'Organized on International Youth Day under the District Priority Project "Mann Shakthi", Rotaract Club of LIA joined forces with Rotaract Club of Coimbatore Gaalaxy, Rotaract Club of HICAS, Madras Cosmos, and SBSEC. The interactive session addressed youth mental health, academic stress, social media expectations, and psychological well-being with 45+ attendees.',
  'Multi-club youth mental wellness forum hosted on International Youth Day under project Mann Shakthi.',
  '2025-08-12', '12 August 2025', 2025, 'Health', 'published',
  'Online / Coimbatore', 'Coimbatore',
  'Rotaract LIA with Gaalaxy, HICAS, Cosmos & SBSEC', 'LIA_COLLABORATION', 'Co-Organizer',
  ARRAY['Rotaract Club of Coimbatore Gaalaxy', 'Rotaract Club of HICAS', 'Rotaract Club of Madras Cosmos', 'Rotaract Club of SBSEC'],
  ARRAY['Youth Mental Health', 'Mann Shakthi', 'International Youth Day'],
  false, '/assets/events/mind-matters.jpg', 'Instagram',
  'https://www.instagram.com/rotaract.clubof.lia/', true
),
(
  uuid_generate_v4(), 'NALAYA VIDIYAL 2.0',
  'Youth Football Development & Coaching Clinic',
  'nalaya-vidiyal-youth-sports',
  'A dedicated youth sports empowerment initiative held on Independence Day from 7:00 AM to 10:00 AM. A specialized football training clinic was conducted by Mr. Elavazhagan, AFC B-License holder and Tamil Nadu Sub-Junior National Team Coach, coaching 35 promising players across Under-10, Under-15, and Under-19 Girls categories.',
  'Youth football coaching clinic led by AFC B-licensed coach for 35 aspiring young athletes.',
  '2025-08-15', '15 August 2025', 2025, 'Sports', 'published',
  'Coimbatore', 'Coimbatore',
  'Rotaract Club of Lead India Ahead', 'LIA', 'Organizer',
  ARRAY[]::TEXT[],
  ARRAY['Youth Sports', 'Grassroots Football', 'Empowerment'],
  false, '/assets/events/nalaya-vidiyal.jpg', 'Instagram',
  'https://www.instagram.com/rotaract.clubof.lia/', true
),
(
  uuid_generate_v4(), 'LAYOUT',
  'District Editorial, Graphic Design & Filmora Seminar',
  'layout-editorial-workshop',
  'LIA members actively participated in LAYOUT, an intensive District Editorial Workshop and Seminar hosted by Rotaract Club of Coimbatore Texcity and Rotaract Club of HICAS.',
  'District skill development workshop on editorial craftsmanship, Photoshop, and video production.',
  '2025-09-20', 'September 2025', 2025, 'Professional Development', 'published',
  'Coimbatore', 'Coimbatore',
  'Rotaract Clubs of Coimbatore Texcity & HICAS', 'DISTRICT', 'Participant',
  ARRAY['Rotaract District 3206'],
  ARRAY['Editorial', 'Graphic Design', 'Content Creation', 'Skill Development'],
  false, '/assets/events/layout.jpg', 'Instagram',
  'https://www.instagram.com/rotaract.clubof.lia/', true
),
(
  uuid_generate_v4(), 'FUSION',
  'Where Chaos Meets Coordination — Team Dynamics Masterclass',
  'fusion-where-chaos-meets-coordination',
  'The Rotaract Club of LIA collaborated with the Rotaract Club of Karpagam Academy of Higher Education (KAHE) for an interactive joint leadership and professional seminar titled "Fusion: Where Chaos Meets Coordination".',
  'Joint professional masterclass with KAHE exploring high-performance team coordination.',
  '2025-10-15', 'October 2025', 2025, 'Professional Development', 'published',
  'Virtual Conference', 'Coimbatore',
  'Rotaract Club of LIA & Rotaract Club of KAHE', 'LIA_COLLABORATION', 'Co-Organizer',
  ARRAY['Rotaract Club of Karpagam Academy of Higher Education'],
  ARRAY['Leadership', 'Professional Growth', 'Teamwork', 'Fellowship'],
  false, '/assets/events/fusion.jpg', 'LinkedIn',
  'https://www.linkedin.com/company/rotaract-club-of-lead-india-ahead/', true
);

-- ============================================================
-- PROJECTS (from src/data/projects.ts)
-- ============================================================
INSERT INTO public.projects (
  title, slug, description, short_description, category, project_date, year,
  status, featured, cover_image_url, collaborators, impact_metrics, source_platform, source_url, source_verified
) VALUES
(
  '5-A-Side Kids Football Tournament & Awareness',
  'kids-football-anti-drug-campaign',
  'Organized in association with Coimbatore Eagles – New Life Sports Football Academy and Rotary Club of Coimbatore Texcity. The tournament brought together 120+ young footballers across 12 teams.',
  'Grassroots youth sports championship combining athletic competition with anti-drug and anti-violence awareness.',
  'Community Service & Sports', 'June 2026', 2026, 'published', true,
  '/assets/events/football.jpg',
  ARRAY['Coimbatore Eagles – New Life Sports Academy', 'Rotary Club of Coimbatore Texcity'],
  '[{"label":"Young Athletes","value":"120+"},{"label":"Participating Teams","value":"12"},{"label":"Mentors & Coaches","value":"30+"},{"label":"Community Spectators","value":"300+"}]'::jsonb,
  'Instagram', 'https://www.instagram.com/rotaract.clubof.lia/', true
),
(
  'Project DHEEMA — Viral Hepatitis Awareness',
  'project-dheema-hepatitis-prevention',
  'A flagship public health initiative conducted on World Hepatitis Day 2026 in collaboration with Rotaract Club of SNS College of Technology and Rotaract Club of Coimbatore Unity.',
  'Public health education drive on World Hepatitis Day focusing on liver wellness and prevention.',
  'Health & Wellness', 'July 2026', 2026, 'published', false,
  '/assets/events/dheema.jpg',
  ARRAY['Rotaract Club of SNS College of Technology', 'Rotaract Club of Coimbatore Unity'],
  '[{"label":"Health Focus","value":"Hepatitis Prevention"},{"label":"Reach","value":"Community Wide"},{"label":"Partner Clubs","value":"3 Clubs"}]'::jsonb,
  'Instagram', 'https://www.instagram.com/rotaract.clubof.lia/', true
),
(
  'Project Mind Matters — Breaking the Pressure to Fit In',
  'mind-matters-youth-mental-health',
  'Conducted under the District Priority Project "Mann Shakthi" on International Youth Day in partnership with Coimbatore Gaalaxy, HICAS, Madras Cosmos, and SBSEC.',
  'Youth mental wellness forum addressing academic stress and social pressure under project Mann Shakthi.',
  'Health & Wellbeing', 'August 2025', 2025, 'published', false,
  '/assets/events/mind-matters.jpg',
  ARRAY['Rotaract Club of Coimbatore Gaalaxy', 'Rotaract Club of HICAS', 'Rotaract Club of Madras Cosmos', 'Rotaract Club of SBSEC'],
  '[{"label":"Attendees","value":"45+"},{"label":"Participating Clubs","value":"5 Clubs"},{"label":"Initiative","value":"Mann Shakthi"}]'::jsonb,
  'Instagram', 'https://www.instagram.com/rotaract.clubof.lia/', true
),
(
  'Nalaya Vidiyal 2.0 — Football Coaching Clinic',
  'nalaya-vidiyal-youth-football-clinic',
  'A high-impact youth coaching workshop conducted on Independence Day featuring AFC B-License holder and Tamil Nadu Sub-Junior National Team Coach Mr. Elavazhagan.',
  'Professional coaching workshop led by national coach Mr. Elavazhagan for 35 promising players.',
  'Sports & Youth Development', 'August 2025', 2025, 'published', true,
  '/assets/events/nalaya-vidiyal.jpg',
  ARRAY[]::TEXT[],
  '[{"label":"Students Trained","value":"35"},{"label":"Categories","value":"U10, U15, U19"},{"label":"Certified Coach","value":"AFC B-License"}]'::jsonb,
  'Instagram', 'https://www.instagram.com/rotaract.clubof.lia/', true
);

-- ============================================================
-- TEAM MEMBERS (from src/data/team.ts)
-- ============================================================
INSERT INTO public.team_members (
  name, designation, bio, college_company, blood_group, is_executive,
  display_order, published, term, letter_image_url
) VALUES
  ('Rtr. Hariharan B', 'Club President', '13th President of the Rotaract Club of Lead India Ahead. Leading Team MAAYON with a clear vision for purposeful youth leadership, high-impact community service, and fellowship.', 'SNS College of Technology, Coimbatore', 'O+ve', true, 1, true, '2026–27', NULL),
  ('Rtr. IPP. Harsith S', 'Immediate Past President (IPP)', 'Guiding the club''s ongoing strategic vision, mentorship, and institutional continuity following a successful presidential tenure.', 'CNTXT AI', 'O+ve', true, 2, true, '2026–27', NULL),
  ('Rtr. JJ Sanjey', 'DPP Chair (District Priority Project)', 'Appointed as District Priority Project Chair for 2026–27. Driving flagship initiatives that create sustainable value and empower local communities.', 'Karpagam Academy of Higher Education', NULL, true, 3, true, '2026–27', '/assets/letters/sanjey.jpg'),
  ('Rtr. Manishasree', 'Executive Board Member', 'Spearheading club administration, member engagement, and community outreach programmes for the 2026–27 Rotary Year.', 'Karpagam Academy of Higher Education', 'O+ve', true, 4, true, '2026–27', '/assets/letters/Rtr.Manisha Shree.jpg'),
  ('Rtr. Prasanna G', 'Executive Board Member', 'Focused on human relations, youth networking, and professional development alignments across District 3206.', 'Rnd Soft Tech Pvt Ltd', 'B+ve', true, 5, true, '2026–27', '/assets/letters/Rtr. Prasanna.jpg'),
  ('Rtr. Sujay Krishna RP', 'Executive Board Member', 'Driving member fellowship, community service operations, and logistics execution for Team MAAYON.', 'SNS College of Technology', 'B+ve', true, 6, true, '2026–27', '/assets/letters/Rtr. Sujay Krishna.jpg'),
  ('Rtr. Santhosh Kumar A', 'Technology & Digital Director', 'Leading digital media infrastructure, technical architecture, and web systems for the Rotaract Club of Lead India Ahead.', 'Karpagam Academy of Higher Education', 'O-ve', true, 7, true, '2026–27', '/assets/letters/santhosh.jpg'),
  ('Rtr. PP. Antony Revanth', 'Past President & Sports Advisor', 'Soccer coach and sports educator guiding grassroots youth athletic tournaments and sports-led community initiatives.', 'Soccer Coach – SSVM & TNEB', 'B+ve', false, 8, true, '2026–27', NULL),
  ('Rtr. PP. Gokul', 'Past President & Technical Trainer', 'Providing technical mentorship, leadership development, and operational guidance across major club avenues.', 'Freelance Technical Trainer', 'O+ve', false, 9, true, '2026–27', '/assets/letters/Gokul.jpg'),
  ('Rtr. Tamilselvan', 'Board Member', 'Coordinating youth engagement and volunteer mobilizations across educational institutions in Coimbatore.', 'Karpagam Academy of Higher Education', 'B+ve', false, 10, true, '2026–27', '/assets/letters/Tamil.jpg'),
  ('Rtr. Vigneshwaran', 'Board Member', 'Active in community project planning and cross-club partnerships throughout District 3206.', 'Dr. N.G.P. Institute of Technology', 'O+ve', false, 11, true, '2026–27', '/assets/letters/Rtr. Vigneshwaran.jpg'),
  ('Rtr. Palak M', 'Board Member', 'Supporting student initiatives, fellowship assemblies, and community outreach drives.', 'SNS College of Technology', 'A1+ve', false, 12, true, '2026–27', NULL),
  ('Rtr. Prajwel', 'Board Member', 'Assisting project operations and volunteer engagement across campus networks.', 'SNS College of Technology', 'O+ve', false, 13, true, '2026–27', '/assets/letters/Prajwel.jpg'),
  ('Rtr. Yamuna', 'Board Member', 'Promoting youth participation and health awareness activities within local communities.', 'SNS College of Technology', 'B+ve', false, 14, true, '2026–27', '/assets/letters/Yamuna.jpg'),
  ('Rtr. Nagaraj', 'Board Member', 'Assisting executive club logistics, professional seminars, and district representations.', 'Kathir College of Engineering', NULL, false, 15, true, '2026–27', '/assets/letters/Rtr. Nagaraj.jpg'),
  ('Rtr. Guruprasath S', 'Faculty Advisor', 'Assistant Professor providing academic counsel, strategic guidance, and student development insights.', 'Karpagam Academy of Higher Education', NULL, false, 16, true, '2026–27', '/assets/letters/Guru Prasath.jpg');

-- ============================================================
-- GALLERY ALBUMS & IMAGES (from src/data/gallery.ts)
-- ============================================================
WITH album_insert AS (
  INSERT INTO public.gallery_albums (name, description, published, sort_order)
  VALUES ('Club Activities 2025–27', 'Official club events, projects, and activities from Rotary Year 2025–27', TRUE, 1)
  RETURNING id
)
INSERT INTO public.gallery_images (album_id, image_url, title, caption, category, date, featured, sort_order)
SELECT
  album_insert.id,
  img.image_url, img.title, img.caption, img.category, img.date, img.featured, img.sort_order
FROM album_insert,
(VALUES
  ('/assets/events/the-one.jpg', '13th Installation Ceremony — The ONE', 'Team MAAYON installation ceremony at Texcity Hall, Coimbatore.', 'EVENTS', '18 July 2026', true, 1),
  ('/assets/events/football.jpg', '5-A-Side Grassroots Football Championship', '120+ young footballers advocating Say No to Drugs in Coimbatore.', 'EVENTS', '21 June 2026', true, 2),
  ('/assets/events/dheema.jpg', 'Project DHEEMA — World Hepatitis Day', 'Collaborative public health awareness drive on viral hepatitis prevention.', 'COMMUNITY', '28 July 2026', false, 3),
  ('/assets/events/takeoff.jpg', 'TAKEOFF — DRR Installation 2026–27', 'LIA representatives participating in the District 3206 DRR installation.', 'EVENTS', '12 July 2026', false, 4),
  ('/assets/events/flight-path.jpg', 'FLIGHT PATH — Leadership Training Seminar', 'Executive learning and governance seminar for incoming leaders.', 'EVENTS', '07 June 2026', false, 5),
  ('/assets/events/nalaya-vidiyal.jpg', 'Nalaya Vidiyal 2.0 Football Development', 'Independence day football clinic coached by AFC B-license coach Mr. Elavazhagan.', 'EVENTS', '15 August 2025', false, 6),
  ('/assets/events/mind-matters.jpg', 'Mind Matters — Youth Wellness Forum', 'Mental wellness dialogue under District Priority Project Mann Shakthi.', 'COMMUNITY', '12 August 2025', false, 7),
  ('/assets/events/layout.jpg', 'LAYOUT — District Editorial Masterclass', 'Skill enhancement workshop focusing on editorial design and media.', 'EVENTS', 'September 2025', false, 8),
  ('/assets/events/fusion.jpg', 'Fusion — Team Dynamics & Coordination', 'Collaborative session with KAHE exploring high-efficiency teamwork.', 'EVENTS', 'October 2025', false, 9)
) AS img(image_url, title, caption, category, date, featured, sort_order);
-- ============================================================
-- LIA Website — Storage Buckets & Policies
-- Migration: 003_storage_policies.sql
-- Run AFTER 001_initial_schema.sql
-- ============================================================

-- ============================================================
-- CREATE STORAGE BUCKETS
-- ============================================================
-- Note: You can also create these via Supabase Dashboard → Storage

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('event-images',   'event-images',   true, 10485760, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']),
  ('project-images', 'project-images', true, 10485760, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']),
  ('gallery-images', 'gallery-images', true, 10485760, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']),
  ('team-images',    'team-images',    true, 5242880,  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- STORAGE POLICIES — event-images
-- ============================================================

-- Public can read all event images (images are in public bucket)
CREATE POLICY "Public can view event images" ON storage.objects
  FOR SELECT USING (bucket_id = 'event-images');

-- Only admins can upload event images
CREATE POLICY "Admin can upload event images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'event-images' AND public.is_admin()
  );

-- Only admins can update event images
CREATE POLICY "Admin can update event images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'event-images' AND public.is_admin()
  );

-- Only admins can delete event images
CREATE POLICY "Admin can delete event images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'event-images' AND public.is_admin()
  );

-- ============================================================
-- STORAGE POLICIES — project-images
-- ============================================================
CREATE POLICY "Public can view project images" ON storage.objects
  FOR SELECT USING (bucket_id = 'project-images');

CREATE POLICY "Admin can upload project images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'project-images' AND public.is_admin()
  );

CREATE POLICY "Admin can update project images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'project-images' AND public.is_admin()
  );

CREATE POLICY "Admin can delete project images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'project-images' AND public.is_admin()
  );

-- ============================================================
-- STORAGE POLICIES — gallery-images
-- ============================================================
CREATE POLICY "Public can view gallery images" ON storage.objects
  FOR SELECT USING (bucket_id = 'gallery-images');

CREATE POLICY "Admin can upload gallery images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'gallery-images' AND public.is_admin()
  );

CREATE POLICY "Admin can update gallery images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'gallery-images' AND public.is_admin()
  );

CREATE POLICY "Admin can delete gallery images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'gallery-images' AND public.is_admin()
  );

-- ============================================================
-- STORAGE POLICIES — team-images
-- ============================================================
CREATE POLICY "Public can view team images" ON storage.objects
  FOR SELECT USING (bucket_id = 'team-images');

CREATE POLICY "Admin can upload team images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'team-images' AND public.is_admin()
  );

CREATE POLICY "Admin can update team images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'team-images' AND public.is_admin()
  );

CREATE POLICY "Admin can delete team images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'team-images' AND public.is_admin()
  );
-- ============================================================
-- LIA Website — CMS V2 Governance Migration
-- Migration: 004_cms_v2.sql
-- Phase 24: Multi-role RBAC + Audit Logs + Granular RLS
-- Run this ONCE in: Supabase Dashboard → SQL Editor
-- ============================================================
-- IMPORTANT: This migration is NON-DESTRUCTIVE.
-- No DROP TABLE, no TRUNCATE, no existing data removal.
-- ============================================================

-- ============================================================
-- STEP 1: Add 'super_admin' to the profiles role constraint
-- ============================================================

-- Drop old constraint and add the new one with super_admin
ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_role_check;

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_role_check
  CHECK (role IN ('super_admin', 'admin', 'editor', 'viewer'));

-- ============================================================
-- STEP 2: Upgrade ONLY the designated primary administrator
-- to super_admin.
-- 
-- We upgrade ONLY the known primary admin email.
-- DO NOT use: UPDATE profiles SET role = 'super_admin' WHERE role = 'admin';
-- That would upgrade ALL admins. Instead, target specifically.
-- ============================================================

UPDATE public.profiles
SET role = 'super_admin'
WHERE email = 'racleadindiaahead2021@gmail.com'
  AND role = 'admin';

-- ============================================================
-- STEP 3: Helper Functions
-- ============================================================

-- is_super_admin(): returns true only for super_admin role
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN LANGUAGE sql SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'super_admin'
  );
$$;

-- is_admin(): backward compatible — true for admin OR super_admin
-- Existing code calling is_admin() will continue to work for super_admin too.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN LANGUAGE sql SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
  );
$$;

-- is_cms_user(): true for any CMS user (super_admin, admin, editor)
-- Viewers get SELECT but cannot write
CREATE OR REPLACE FUNCTION public.is_cms_user()
RETURNS BOOLEAN LANGUAGE sql SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'editor')
  );
$$;

-- is_viewer_or_above(): true for all authenticated CMS users (including viewer)
CREATE OR REPLACE FUNCTION public.is_viewer_or_above()
RETURNS BOOLEAN LANGUAGE sql SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'editor', 'viewer')
  );
$$;

-- ============================================================
-- STEP 4: Strengthen the role-change security trigger
-- 
-- Only super_admin can change any profile's role.
-- Regular admins/editors/viewers cannot promote/demote anyone.
-- ============================================================

CREATE OR REPLACE FUNCTION public.prevent_unauthorized_role_change()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  current_role TEXT;
BEGIN
  -- Only run if the role is actually being changed
  IF OLD.role = NEW.role THEN
    RETURN NEW;
  END IF;

  -- Allow DB administrators / migrations / backend scripts (postgres, supabase_admin, service_role)
  IF current_user IN ('postgres', 'supabase_admin', 'service_role') OR auth.uid() IS NULL THEN
    RETURN NEW;
  END IF;

  -- Get the role of the currently authenticated user
  SELECT role INTO current_role
  FROM public.profiles
  WHERE id = auth.uid();

  -- Only super_admin may change any role
  IF current_role IS DISTINCT FROM 'super_admin' THEN
    RAISE EXCEPTION 'Only a super_admin may change user roles. Current role: %', COALESCE(current_role, 'unauthenticated');
  END IF;

  RETURN NEW;
END;
$$;

-- Drop old and existing trigger versions safely
DROP TRIGGER IF EXISTS prevent_role_self_promotion_trigger ON public.profiles;
DROP TRIGGER IF EXISTS prevent_unauthorized_role_change_trigger ON public.profiles;

CREATE TRIGGER prevent_unauthorized_role_change_trigger
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.prevent_unauthorized_role_change();

-- ============================================================
-- STEP 5: Audit Logs Table
-- ============================================================

CREATE TABLE IF NOT EXISTS public.audit_logs (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_email  TEXT,
  user_name   TEXT,
  action      TEXT NOT NULL,
  entity_type TEXT,
  entity_id   UUID,
  entity_name TEXT,
  metadata    JSONB DEFAULT '{}',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for efficient filtering
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id     ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action      ON public.audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity_type ON public.audit_logs(entity_type);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at  ON public.audit_logs(created_at DESC);

-- ============================================================
-- STEP 6: Audit Logs RLS
-- ============================================================

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Super admins and admins can SELECT audit logs
CREATE POLICY "Admins can view audit logs" ON public.audit_logs
  FOR SELECT USING (public.is_admin());

-- Any authenticated CMS user can INSERT audit logs (append-only)
-- No UPDATE or DELETE policies — making this effectively append-only
CREATE POLICY "CMS users can insert audit logs" ON public.audit_logs
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND public.is_viewer_or_above());

-- ============================================================
-- STEP 7: Update RLS Policies for Content Tables
-- 
-- Old: is_admin() only
-- New: Granular — editor can INSERT/UPDATE, only admin/super_admin can DELETE
-- ============================================================

-- ---- EVENTS ----
DROP POLICY IF EXISTS "Admin can manage all events" ON public.events;

-- Admins (and super_admin): full CRUD
CREATE POLICY "Admins can manage all events" ON public.events
  FOR ALL USING (public.is_admin());

-- Editors: SELECT all + INSERT + UPDATE (no DELETE)
CREATE POLICY "Editors can select all events" ON public.events
  FOR SELECT USING (public.is_cms_user());

CREATE POLICY "Editors can insert events" ON public.events
  FOR INSERT WITH CHECK (public.is_cms_user());

CREATE POLICY "Editors can update events" ON public.events
  FOR UPDATE USING (public.is_cms_user());

-- Viewers: SELECT all (including drafts) in CMS
CREATE POLICY "Viewers can select events in CMS" ON public.events
  FOR SELECT USING (public.is_viewer_or_above());

-- ---- EVENT IMAGES ----
DROP POLICY IF EXISTS "Admin can manage all event images" ON public.event_images;

CREATE POLICY "Admins can manage all event images" ON public.event_images
  FOR ALL USING (public.is_admin());

CREATE POLICY "Editors can manage event images" ON public.event_images
  FOR INSERT WITH CHECK (public.is_cms_user());

CREATE POLICY "Editors can update event images" ON public.event_images
  FOR UPDATE USING (public.is_cms_user());

CREATE POLICY "CMS users can select event images" ON public.event_images
  FOR SELECT USING (public.is_viewer_or_above());

-- ---- POSTS ----
DROP POLICY IF EXISTS "Admin can manage all posts" ON public.posts;

CREATE POLICY "Admins can manage all posts" ON public.posts
  FOR ALL USING (public.is_admin());

CREATE POLICY "Editors can select all posts" ON public.posts
  FOR SELECT USING (public.is_cms_user());

CREATE POLICY "Editors can insert posts" ON public.posts
  FOR INSERT WITH CHECK (public.is_cms_user());

CREATE POLICY "Editors can update posts" ON public.posts
  FOR UPDATE USING (public.is_cms_user());

CREATE POLICY "Viewers can select posts in CMS" ON public.posts
  FOR SELECT USING (public.is_viewer_or_above());

-- ---- PROJECTS ----
DROP POLICY IF EXISTS "Admin can manage all projects" ON public.projects;

CREATE POLICY "Admins can manage all projects" ON public.projects
  FOR ALL USING (public.is_admin());

CREATE POLICY "Editors can select all projects" ON public.projects
  FOR SELECT USING (public.is_cms_user());

CREATE POLICY "Editors can insert projects" ON public.projects
  FOR INSERT WITH CHECK (public.is_cms_user());

CREATE POLICY "Editors can update projects" ON public.projects
  FOR UPDATE USING (public.is_cms_user());

CREATE POLICY "Viewers can select projects in CMS" ON public.projects
  FOR SELECT USING (public.is_viewer_or_above());

-- ---- PROJECT IMAGES ----
DROP POLICY IF EXISTS "Admin can manage all project images" ON public.project_images;

CREATE POLICY "Admins can manage all project images" ON public.project_images
  FOR ALL USING (public.is_admin());

CREATE POLICY "Editors can insert project images" ON public.project_images
  FOR INSERT WITH CHECK (public.is_cms_user());

CREATE POLICY "Editors can update project images" ON public.project_images
  FOR UPDATE USING (public.is_cms_user());

CREATE POLICY "CMS users can select project images" ON public.project_images
  FOR SELECT USING (public.is_viewer_or_above());

-- ---- GALLERY ALBUMS ----
DROP POLICY IF EXISTS "Admin can manage all albums" ON public.gallery_albums;

CREATE POLICY "Admins can manage all albums" ON public.gallery_albums
  FOR ALL USING (public.is_admin());

CREATE POLICY "Editors can insert albums" ON public.gallery_albums
  FOR INSERT WITH CHECK (public.is_cms_user());

CREATE POLICY "Editors can update albums" ON public.gallery_albums
  FOR UPDATE USING (public.is_cms_user());

CREATE POLICY "CMS users can select all albums" ON public.gallery_albums
  FOR SELECT USING (public.is_viewer_or_above());

-- ---- GALLERY IMAGES ----
DROP POLICY IF EXISTS "Admin can manage all gallery images" ON public.gallery_images;

CREATE POLICY "Admins can manage all gallery images" ON public.gallery_images
  FOR ALL USING (public.is_admin());

CREATE POLICY "Editors can insert gallery images" ON public.gallery_images
  FOR INSERT WITH CHECK (public.is_cms_user());

CREATE POLICY "Editors can update gallery images" ON public.gallery_images
  FOR UPDATE USING (public.is_cms_user());

CREATE POLICY "CMS users can select all gallery images" ON public.gallery_images
  FOR SELECT USING (public.is_viewer_or_above());

-- ---- TEAM MEMBERS ----
DROP POLICY IF EXISTS "Admin can manage all team members" ON public.team_members;

CREATE POLICY "Admins can manage all team members" ON public.team_members
  FOR ALL USING (public.is_admin());

CREATE POLICY "Editors can insert team members" ON public.team_members
  FOR INSERT WITH CHECK (public.is_cms_user());

CREATE POLICY "Editors can update team members" ON public.team_members
  FOR UPDATE USING (public.is_cms_user());

CREATE POLICY "CMS users can select all team members" ON public.team_members
  FOR SELECT USING (public.is_viewer_or_above());

-- ---- WEBSITE CONTENT ----
DROP POLICY IF EXISTS "Admin can manage website content" ON public.website_content;

CREATE POLICY "Admins can manage website content" ON public.website_content
  FOR ALL USING (public.is_admin());

CREATE POLICY "Editors can update website content" ON public.website_content
  FOR UPDATE USING (public.is_cms_user());

-- ---- SITE SETTINGS ----
DROP POLICY IF EXISTS "Admin can manage site settings" ON public.site_settings;

-- Only admins/super_admins manage critical settings
CREATE POLICY "Admins can manage site settings" ON public.site_settings
  FOR ALL USING (public.is_admin());

-- ---- PROFILES ----
-- Allow super_admin to SELECT all profiles (for user management)
CREATE POLICY "Super admin can view all profiles" ON public.profiles
  FOR SELECT USING (public.is_super_admin());

-- Allow super_admin to UPDATE roles (trigger enforces this at DB level)
CREATE POLICY "Super admin can update profiles" ON public.profiles
  FOR UPDATE USING (public.is_super_admin());

-- Allow any CMS user to update their OWN profile (name, not role — trigger protects role)
CREATE POLICY "Users can update own profile name" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- ============================================================
-- STEP 8: Verify the upgrade was applied correctly
-- (Returns the count of super_admins — should be 1)
-- ============================================================

-- SELECT COUNT(*) FROM public.profiles WHERE role = 'super_admin';
-- Should return 1 if racleadindiaahead2021@gmail.com was the only admin.

-- ============================================================
-- END OF MIGRATION 004_cms_v2.sql
-- ============================================================
-- ============================================================
-- LIA Website — Careers & Opportunities Module
-- Migration: 005_careers.sql
-- Phase 25: Public Careers + Admin CMS Opportunities Module
-- Run this in: Supabase Dashboard → SQL Editor
-- ============================================================
-- IMPORTANT: This migration is NON-DESTRUCTIVE.
-- Creates the careers table, indexes, and RLS policies.
-- ============================================================

-- ============================================================
-- 1. CAREERS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.careers (
  id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title                   TEXT NOT NULL,
  slug                    TEXT NOT NULL UNIQUE,
  organization_name       TEXT NOT NULL,
  organization_website    TEXT,
  organization_logo_url   TEXT,
  opportunity_type        TEXT NOT NULL CHECK (
                            opportunity_type IN ('job', 'internship', 'volunteer', 'project_role', 'fellowship', 'other')
                          ),
  work_mode               TEXT NOT NULL DEFAULT 'on_site' CHECK (
                            work_mode IN ('on_site', 'remote', 'hybrid')
                          ),
  location                TEXT,
  experience_level        TEXT CHECK (
                            experience_level IS NULL OR
                            experience_level IN ('entry_level', 'intermediate', 'mid_level', 'senior_level', 'not_applicable')
                          ),
  remuneration            TEXT,
  application_deadline    TIMESTAMPTZ,
  application_url         TEXT NOT NULL,
  application_label       TEXT DEFAULT 'Apply Now',
  description             TEXT NOT NULL,
  responsibilities        TEXT,
  requirements            TEXT,
  preferred_skills        TEXT,
  benefits                TEXT,
  additional_information  TEXT,
  contact_email           TEXT,
  status                  TEXT NOT NULL DEFAULT 'draft' CHECK (
                            status IN ('draft', 'published', 'archived')
                          ),
  featured                BOOLEAN NOT NULL DEFAULT FALSE,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by              UUID REFERENCES auth.users(id),
  updated_by              UUID REFERENCES auth.users(id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_careers_status               ON public.careers(status);
CREATE INDEX IF NOT EXISTS idx_careers_slug                 ON public.careers(slug);
CREATE INDEX IF NOT EXISTS idx_careers_opportunity_type     ON public.careers(opportunity_type);
CREATE INDEX IF NOT EXISTS idx_careers_work_mode            ON public.careers(work_mode);
CREATE INDEX IF NOT EXISTS idx_careers_application_deadline ON public.careers(application_deadline);
CREATE INDEX IF NOT EXISTS idx_careers_created_at           ON public.careers(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_careers_organization_name    ON public.careers(organization_name);
CREATE INDEX IF NOT EXISTS idx_careers_featured             ON public.careers(featured);

-- ============================================================
-- 2. ROW LEVEL SECURITY (RLS)
-- ============================================================
ALTER TABLE public.careers ENABLE ROW LEVEL SECURITY;

-- 2.1 Public read access for published careers that have not expired
CREATE POLICY "Public can view published careers" ON public.careers
  FOR SELECT
  USING (
    status = 'published' AND
    (application_deadline IS NULL OR application_deadline >= now())
  );

-- 2.2 Admins (admin + super_admin) have full management access
CREATE POLICY "Admins can manage all careers" ON public.careers
  FOR ALL
  USING (public.is_admin());

-- 2.3 CMS users (super_admin, admin, editor, viewer) can view all careers in CMS
CREATE POLICY "CMS users can select all careers" ON public.careers
  FOR SELECT
  USING (public.is_viewer_or_above());

-- 2.4 Editors can insert careers
CREATE POLICY "Editors can insert careers" ON public.careers
  FOR INSERT
  WITH CHECK (public.is_cms_user());

-- 2.5 Editors can update careers
CREATE POLICY "Editors can update careers" ON public.careers
  FOR UPDATE
  USING (public.is_cms_user());
-- ============================================================
-- Rotaract Club of Lead India Ahead — MAAYON 2026–27
-- Migration 006: Administrator Transition & Access Control
-- Target: Promote racleadindiaahead2021@gmail.com to super_admin
-- Set password to LiaAdmin@2026! and revoke other admin access
-- ============================================================

-- 1. Update password to LiaAdmin@2026! and ensure email is confirmed
UPDATE auth.users
SET 
  encrypted_password = extensions.crypt('LiaAdmin@2026!', extensions.gen_salt('bf')),
  email_confirmed_at = COALESCE(email_confirmed_at, NOW()),
  updated_at = NOW()
WHERE email = 'racleadindiaahead2021@gmail.com';

-- 2. Ensure role constraint allows 'super_admin'
ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_role_check;

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_role_check
  CHECK (role IN ('super_admin', 'admin', 'editor', 'viewer'));

-- 3. Demote any other administrators / super administrators to 'viewer'
UPDATE public.profiles
SET role = 'viewer',
    updated_at = NOW()
WHERE email != 'racleadindiaahead2021@gmail.com'
  AND role IN ('admin', 'super_admin');

-- 4. If the user already exists in auth.users, ensure a profile row exists as super_admin
INSERT INTO public.profiles (id, email, role, full_name, created_at, updated_at)
SELECT 
  id, 
  email, 
  'super_admin', 
  'LIA Administrator', 
  NOW(), 
  NOW()
FROM auth.users
WHERE email = 'racleadindiaahead2021@gmail.com'
ON CONFLICT (id) DO UPDATE
SET role = 'super_admin',
    email = 'racleadindiaahead2021@gmail.com',
    updated_at = NOW();

-- 5. Verification Query: Confirm the active administrator and profile
SELECT 
  u.id,
  u.email,
  u.email_confirmed_at,
  p.role,
  p.full_name,
  p.updated_at
FROM auth.users u
JOIN public.profiles p ON p.id = u.id
WHERE u.email = 'racleadindiaahead2021@gmail.com';

