TEAM LIA — Member Photo Directory
=====================================

This directory is for member profile photographs used on the /team page
and in the Leadership section of the home page.

HOW TO ADD A MEMBER PHOTO
--------------------------
1. Prepare the image (recommended: square crop, minimum 400×400px)
2. Convert to WebP format for optimal performance
3. Name the file using the member's ID from src/data/team.ts
   Examples:
     hariharan-b.webp
     jj-sanjey.webp
     manishasree.webp
     santhosh-kumar.webp

4. Place the file in this directory:
     public/assets/members/<member-id>.webp

5. Update src/data/team.ts — add the image field to the member entry:
     image: "/assets/members/hariharan-b.webp"

6. The UI will automatically use the photograph instead of the initials
   placeholder. No component rewrite is needed.

NAMING CONVENTION
-----------------
  Preferred format:    <member-id>.webp
  Alternative:         member-01.webp, member-02.webp, etc.

  Member IDs (from src/data/team.ts):
    hariharan-b
    harsith-s
    jj-sanjey
    manishasree
    prasanna-g
    sujay-krishna
    shanthosh-kumar
    antony-revanth
    gokul
    tamilselvan
    vigneshwaran
    palak-m
    prajwel
    yamuna
    nagaraj
    guruprasath

IMAGE SPECS
-----------
  Format:       WebP (preferred) or JPG/PNG
  Aspect ratio: 1:1 (square — used as circle crop in UI)
  Min size:     400 × 400 px
  Max size:     800 × 800 px (optimized)
  object-fit:   cover (applied in CSS)

PLACEHOLDER BEHAVIOR
--------------------
  If no image field is set in team.ts, the UI automatically shows
  an elegant initials-based circular avatar with a gold border.
  No code change is needed to switch from placeholder to photo —
  simply add the image field to team.ts.

APPOINTMENT LETTERS
-------------------
  Appointment letter images (for the "Letter" button on member cards)
  continue to live in:
    public/assets/letters/
  They are separate from profile photos.

ROTARY YEAR 2026–27 / TEAM LIA
================================
  This directory was created for the TEAM LIA 2026–27 website upgrade.
  Rotaract Club of Lead India Ahead — Coimbatore, Tamil Nadu.
  Rotaract District 3206 | Club ID: 90062
