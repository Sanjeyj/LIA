# Phase 53 — Image Rendering Resolution & Audit Report

**Date:** October 2, 2026  
**Status:** PASS  
**Live Production URL:** https://lia-website-nu.vercel.app/  
**Git Commits:**
- `f8f80bf`: `fix: restore missing public website images`
- `a82f9ef`: `fix: restore missing public website images`

---

## 1. Executive Summary

During Phase 53, an audit and resolution was conducted to address missing images and grey gradient placeholders across the public website (Featured Projects, Team Introduction & Leadership, Events & Initiatives, Team 2026–27, Community Gallery, and Detail pages).

All root causes were identified, repaired, built cleanly (`tsc -b && vite build`), committed, pushed to GitHub `main`, and deployed to Vercel production (`dpl_7dqNtkP7ykyuFjq2m9wLjcC7aHEc`).

All 39 static assets across `public/assets/{members,events,logos,letters}` are confirmed present, served with HTTP 200 OK and correct MIME types, and properly rendered across all public pages.

---

## 2. Root Cause Analysis

### Primary Causes:
1. **Supabase Storage vs Local Asset Decoupling:**
   - Supabase Storage buckets (`event-images`, `project-images`, `gallery-images`, `team-images`) are configured in the project but contained 0 uploaded files (the CMS upload pipeline was prepared but images had not yet been uploaded to object storage).
   - Database records in Supabase contained either relative paths (e.g., `/assets/events/the-one.jpg`) or `null` / empty strings for `cover_image_url`.
   - When database records returned `null` or empty `cover_image_url`, previous mappers mapped `coverImage: getAssetUrl(null)` which evaluated to `""` or an invalid path, triggering broken image handlers and falling back to grey placeholder gradients instead of falling back to authentic bundled local static assets.

2. **Double Asset Resolution (`getAssetUrl` Duplication):**
   - Several components and pages (`Events.tsx`, `FeaturedProjects.tsx`, `Gallery.tsx`) applied `getAssetUrl()` inside data mapper functions and again at render time, resulting in malformed cache-busting queries (`?v=...&v=...`) or double path prefixes.

3. **Legacy Production Domain Mismatch:**
   - Previous configuration in `src/config/site.ts`, `index.html`, `public/robots.txt`, and `public/sitemap.xml` was pointing to `lia-website-six.vercel.app` (an older preview/domain) instead of the active production deployment `lia-website-nu.vercel.app`. This caused OpenGraph images, Twitter cards, JSON-LD schemas, and canonical URLs to point to invalid origins.

4. **Empty Database Table Overrides:**
   - In `GalleryPage.tsx`, when the Supabase `gallery_albums` table returned empty albums without images, it overwrote the rich static gallery data rather than maintaining fallback content.

---

## 3. Implemented Fixes

### A. Data Mappers & Fallback Protection
- **`src/components/FeaturedProjects.tsx`**: Updated mapper to match database projects against static `PROJECTS` data (`src/data/projects.ts`) by slug/title. If database `cover_image_url` is null/empty, it now safely falls back to the static project image.
- **`src/components/Events.tsx`**: Updated mapper with `staticMatch` fallback against `EVENTS` (`src/data/events.ts`). Ensured `cover_image_url` falls back to `staticMatch.coverImage`. Removed redundant `getAssetUrl()` wrapping inside the mapper.
- **`src/components/Gallery.tsx`**: Updated mapper with `staticMatch` fallback against `GALLERY_IMAGES` (`src/data/gallery.ts`).
- **`src/pages/GalleryPage.tsx`**: Added validation to filter out empty Supabase albums so that the curated static gallery photos and categories are preserved.
- **`src/pages/TeamPage.tsx`**: Guaranteed that `TEAM_MEMBERS` portraits load cleanly with fallback guards.

### B. Detail Pages & Render-time Safety
- **`src/pages/EventDetailPage.tsx`**: Wrapped cover images in `getAssetUrl(event.coverImage)` with fallback to static event data.
- **`src/pages/ProjectDetailPage.tsx`**: Wrapped cover images in `getAssetUrl(project.coverImage)` with fallback to static project data.
- **`src/components/ImageWithPlaceholder.tsx`**: Added defensive `onError` handler to seamlessly fall back to placeholder UI without crashing or freezing.

### C. Domain & SEO Alignment
- **`src/config/site.ts`**: Updated default domain fallback from `lia-website-six.vercel.app` to `https://lia-website-nu.vercel.app`.
- **`src/components/PostDetailPage.tsx`**: Updated JSON-LD publisher logo URL.
- **`index.html`**: Updated canonical link, OpenGraph (`og:url`, `og:image`), Twitter Card, and JSON-LD schema URLs to `https://lia-website-nu.vercel.app`.
- **`public/robots.txt`**: Updated sitemap location.
- **`public/sitemap.xml`**: Updated all 13 canonical URL locations.

---

## 4. Verification and Asset Audit

### Static Asset Verification
Run automated scan on `src/data/*.ts`:
- **Total Asset Paths in Static Data:** 39
- **Missing Files in `public/`:** 0
- **HTTP Status from Live Production (`https://lia-website-nu.vercel.app/`):**
  - `/assets/events/the-one.jpg` -> `200 OK` (image/jpeg, 988,716 bytes)
  - `/assets/members/hariharan.jpg` -> `200 OK` (image/jpeg, 21,494 bytes)
  - `/assets/logos/district-3206.png` -> `200 OK` (image/png, 20,436 bytes)
  - `/assets/logos/maayon-official.jpg` -> `200 OK` (image/jpeg, 239,087 bytes)

### Build & Compilation
- `tsc -b`: Exited with code `0` (clean TypeScript compilation, zero errors)
- `vite build`: Exited with code `0` (all 33 bundles rendered and hashed)

### Production Deployment
- **Deployment ID:** `dpl_7dqNtkP7ykyuFjq2m9wLjcC7aHEc`
- **Ready State:** `READY`
- **Aliases:** `https://lia-website-nu.vercel.app`

---

## 5. Ongoing Operations & Future CMS Usage

1. **Local Static Assets (Default):** All 39 core assets (member portraits, project banners, event photos, theme logos) remain version-controlled under `public/assets/` and are bundled directly with the application, ensuring 100% availability even without active database connections.
2. **Supabase Storage Uploads:** When administrators upload new photos via the admin panel (`/admin`), the files will be uploaded directly to Supabase Storage buckets. The codebase is fully configured to serve both full Supabase Storage URLs (e.g. `https://<id>.supabase.co/storage/v1/object/public/...`) and bundled `/assets/...` paths interchangeably.
