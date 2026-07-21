## v12 — V13 Enterprise Redesign + full catalogue sync
- CATALOGUE: fully synced to the official PDF — 124 products (42 pharma
  APIs incl. Biotin, Ibuprofen BP, Sitagliptin, Tadalafil, Vildagliptin,
  Montelukast + 82 industrial/fine chemicals: full solvents, acids,
  alkalis, isocyanates, monomers & intermediates list) with real CAS,
  formula, MW, applications, packing and storage on every page.
  Removed products not in the new catalogue (incl. Paracetamol, Methanol,
  Halquinol, Sorbitol, Gum Acacia, Liquid Bromine).
- HERO: new heading (Importers & Stockists / Since 2007), CTA buttons,
  badge chips and the yellow marquee line removed; lead mentions paint
  manufacturers; 3D molecule is now Ibuprofen.
- NO FIXED PRODUCT COUNTS anywhere — verified by automated scan.
- WHY CHOOSE: four all-new cards (Premium Quality, Competitive Pricing,
  24x7 Customer Assistance, Wide Range of Products) with new icons,
  gradients, sheen hover; ALL QC references removed sitewide.
- CATEGORIES: reordered (Import & Global Sourcing first) with true 3D
  mouse tilt, depth, glow (auto-disabled on touch/low-power/reduced-motion).
- Pan-India city chips removed; homepage Industries section removed;
  footer reduced to Products / Quick Links / Contact / Newsletter.
- ABOUT: complete corporate-profile redesign (history, mission, vision,
  import network, warehousing, ethics, industries, future) + dedicated
  Founder section (Uday Mehta, Founder & Proprietor only) + four trust
  cards; Brijesh Shah & Paras Gandhi removed from every page incl. Contact.
- Warehouse renamed to Anant and Company everywhere.
- Product-page Downloads heading renamed Documents (buttons unchanged).
- SEO now points at the live GitHub Pages URL (canonical, robots,
  sitemap - 128 URLs).
- Excel rebuilt: 234 packing rows, 124 product rows, Featured sheet with
  the new default eight (Albendazole, Ibuprofen, N-Methyl Piperazine,
  IPA, Citric Acid, Glycerine IP/USP, Toluene, Ethyl Acetate).
- PDF catalogue regenerated for all 124 products. Build stamp v12.

# CHANGELOG addition

## v11 — Media renderer root-cause fix
- ROOT CAUSE FOUND: the media applier was the LAST block in main.js; if the
  ScrollTrigger CDN file failed/slow-loaded, ScrollTrigger.create() threw a
  ReferenceError that killed every later block — including the applier. The
  Excel value was generated correctly and then never applied.
- FIXED: applier relocated to run FIRST (before any block that can fail),
  wrapped in try/catch, and ScrollTrigger is now guarded like gsap.
- FIXED: relative Excel paths (assets/images/about.jpg) resolve correctly
  on every page, including product pages (../ prefix added automatically).
- ADDED: loud diagnostics — every applied media value logs [MEDIA] key -> url;
  a failed Excel URL logs a clear console error instead of silently falling
  back; append ?debugmedia to any URL for a full table of every media
  element, its Excel value and the applied src.
- ADDED: assets/images/ folder shipped with a GREEN test image so the exact
  test case (about_image = assets/images/about.jpg) proves itself visually.
- Fallback order honoured exactly as specified: Excel value if present ->
  built-in verified default -> local fallback.jpg only on load failure.

# CHANGELOG — Akshat Chemicals Website

## v10 — RC1 (final production candidate)
- FIXED: Google Drive share links pasted in any Excel media/product field
  are auto-converted to direct-loading URLs (updater + runtime, unit-tested).
- FIXED: applying an Excel media URL resets the image-fallback state so the
  new URL gets its own full fallback chain (previously a failed Excel URL
  could silently show the backup image).
- HARDENED: homepage/company/theme appliers accept whitelisted keys only —
  sheet instruction text can never appear on the site; theme colors must be
  valid hex.
- HARDENED: Featured list de-duplicated; Visible/Order/fallback verified.
- Full 17-point production audit executed — see QA-REPORT.md.

## v9 — Excel price parser fix
- Prices read exactly as typed (₹99/kg, Rs 120/kg, 1,250.50, 99); blank =
  On request; WPS/Excel header quirks tolerated; 6 unit tests.
- Available/Ready Stock render green.

## v8 — Catalogue + Best Sellers refinement
- Added N-Methyl Piperazine and Methanol (catalogue = 43; all systems).
- Best Sellers rebuilt as flagship showcase; new Featured Excel sheet.

## v7 — Cache-proofing + low-power mode
- Versioned asset URLs; visible build stamp; ≤4-core machines get
  tap-to-play media (zero background decoding).

## v6 — Image overhaul + performance engineering
- Every image source-verified; 3-level fallback incl. pre-JS failures;
  720p video; single active decoder; RAF/ScrollTrigger lifecycle fixes;
  blur/shadow diet; sections removed per review.

## v5 — Google Workspace backend
- Sheets database, Drive folders + enquiry PDFs, 3 automatic emails,
  live admin dashboard, robots + sitemap.

## v1–v4 — Initial builds through premium redesign
- 41-product site, product pages, master Excel, GSAP design system.
