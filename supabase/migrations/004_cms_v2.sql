-- ============================================================
-- LIA Website — CMS V2 Governance Migration
-- Migration: 004_cms_v2.sql
-- Phase 24: Multi-role RBAC + Audit Logs + Granular RLS
-- Run this in: Supabase Dashboard → SQL Editor
-- ============================================================
-- IMPORTANT: This migration is completely idempotent & safe to re-run.
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
-- STEP 2: Upgrade designated primary administrator to super_admin
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
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN LANGUAGE sql SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
  );
$$;

-- is_cms_user(): true for any CMS user (super_admin, admin, editor)
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

-- Drop old and existing triggers safely before creating
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

DROP POLICY IF EXISTS "Admins can view audit logs" ON public.audit_logs;
CREATE POLICY "Admins can view audit logs" ON public.audit_logs
  FOR SELECT USING (public.is_admin());

DROP POLICY IF EXISTS "CMS users can insert audit logs" ON public.audit_logs;
CREATE POLICY "CMS users can insert audit logs" ON public.audit_logs
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND public.is_viewer_or_above());

-- ============================================================
-- STEP 7: Update RLS Policies for Content Tables
-- ============================================================

-- ---- EVENTS ----
DROP POLICY IF EXISTS "Admin can manage all events" ON public.events;
DROP POLICY IF EXISTS "Admins can manage all events" ON public.events;
DROP POLICY IF EXISTS "Editors can select all events" ON public.events;
DROP POLICY IF EXISTS "Editors can insert events" ON public.events;
DROP POLICY IF EXISTS "Editors can update events" ON public.events;
DROP POLICY IF EXISTS "Viewers can select events in CMS" ON public.events;

CREATE POLICY "Admins can manage all events" ON public.events
  FOR ALL USING (public.is_admin());

CREATE POLICY "Editors can select all events" ON public.events
  FOR SELECT USING (public.is_cms_user());

CREATE POLICY "Editors can insert events" ON public.events
  FOR INSERT WITH CHECK (public.is_cms_user());

CREATE POLICY "Editors can update events" ON public.events
  FOR UPDATE USING (public.is_cms_user());

CREATE POLICY "Viewers can select events in CMS" ON public.events
  FOR SELECT USING (public.is_viewer_or_above());

-- ---- EVENT IMAGES ----
DROP POLICY IF EXISTS "Admin can manage all event images" ON public.event_images;
DROP POLICY IF EXISTS "Admins can manage all event images" ON public.event_images;
DROP POLICY IF EXISTS "Editors can manage event images" ON public.event_images;
DROP POLICY IF EXISTS "Editors can update event images" ON public.event_images;
DROP POLICY IF EXISTS "CMS users can select event images" ON public.event_images;

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
DROP POLICY IF EXISTS "Admins can manage all posts" ON public.posts;
DROP POLICY IF EXISTS "Editors can select all posts" ON public.posts;
DROP POLICY IF EXISTS "Editors can insert posts" ON public.posts;
DROP POLICY IF EXISTS "Editors can update posts" ON public.posts;
DROP POLICY IF EXISTS "Viewers can select posts in CMS" ON public.posts;

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
DROP POLICY IF EXISTS "Admins can manage all projects" ON public.projects;
DROP POLICY IF EXISTS "Editors can select all projects" ON public.projects;
DROP POLICY IF EXISTS "Editors can insert projects" ON public.projects;
DROP POLICY IF EXISTS "Editors can update projects" ON public.projects;
DROP POLICY IF EXISTS "Viewers can select projects in CMS" ON public.projects;

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
DROP POLICY IF EXISTS "Admins can manage all project images" ON public.project_images;
DROP POLICY IF EXISTS "Editors can insert project images" ON public.project_images;
DROP POLICY IF EXISTS "Editors can update project images" ON public.project_images;
DROP POLICY IF EXISTS "CMS users can select project images" ON public.project_images;

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
DROP POLICY IF EXISTS "Admins can manage all albums" ON public.gallery_albums;
DROP POLICY IF EXISTS "Editors can insert albums" ON public.gallery_albums;
DROP POLICY IF EXISTS "Editors can update albums" ON public.gallery_albums;
DROP POLICY IF EXISTS "CMS users can select all albums" ON public.gallery_albums;

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
DROP POLICY IF EXISTS "Admins can manage all gallery images" ON public.gallery_images;
DROP POLICY IF EXISTS "Editors can insert gallery images" ON public.gallery_images;
DROP POLICY IF EXISTS "Editors can update gallery images" ON public.gallery_images;
DROP POLICY IF EXISTS "CMS users can select all gallery images" ON public.gallery_images;

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
DROP POLICY IF EXISTS "Admins can manage all team members" ON public.team_members;
DROP POLICY IF EXISTS "Editors can insert team members" ON public.team_members;
DROP POLICY IF EXISTS "Editors can update team members" ON public.team_members;
DROP POLICY IF EXISTS "CMS users can select all team members" ON public.team_members;

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
DROP POLICY IF EXISTS "Admins can manage website content" ON public.website_content;
DROP POLICY IF EXISTS "Editors can update website content" ON public.website_content;

CREATE POLICY "Admins can manage website content" ON public.website_content
  FOR ALL USING (public.is_admin());

CREATE POLICY "Editors can update website content" ON public.website_content
  FOR UPDATE USING (public.is_cms_user());

-- ---- SITE SETTINGS ----
DROP POLICY IF EXISTS "Admin can manage site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admins can manage site settings" ON public.site_settings;

CREATE POLICY "Admins can manage site settings" ON public.site_settings
  FOR ALL USING (public.is_admin());

-- ---- PROFILES ----
DROP POLICY IF EXISTS "Super admin can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Super admin can update profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile name" ON public.profiles;

CREATE POLICY "Super admin can view all profiles" ON public.profiles
  FOR SELECT USING (public.is_super_admin());

CREATE POLICY "Super admin can update profiles" ON public.profiles
  FOR UPDATE USING (public.is_super_admin());

CREATE POLICY "Users can update own profile name" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- ============================================================
-- END OF MIGRATION 004_cms_v2.sql
-- ============================================================
