VERSION: v10 (RC1) — footer shows 'build v10 RC1'. See QA-REPORT.md + CHANGELOG.md.

V8 REFINEMENT: catalogue is now 43 products (added N-Methyl Piperazine
and Methanol). Homepage Best Sellers is a redesigned flagship showcase
and is controlled by the new FEATURED sheet in products-master.xlsx
(Product / Display Order / Visible) — run the updater to apply changes.

*** READ THIS FIRST — WHY YOUR LAST SCREENSHOT LOOKED UNCHANGED ***
Your browser was showing the OLD folder/files (the screenshot contained
text that no longer exists in the new build). To load THIS build:
  1. DELETE everything inside your website folder.
  2. Extract this zip into it (replace all).
  3. Open the site and press Ctrl+F5 (hard refresh).
  4. Confirm: the footer bottom line shows  "build v7"  and the About
     page photo is stacked shipping containers. If you see v7, you are
     on the new build — and the caching stamps (?v=7) now make it
     impossible for old CSS/JS to load again in future updates.

SEE ALSO: PERFORMANCE-REPORT.md, MEDIA-GUIDE.md, ADMIN-GUIDE.md, GOOGLE-SETUP.md

FINAL v6 — WHAT WAS FIXED (boss's list)
  1. IMAGES, PERMANENTLY FIXED. Every single <img> on all 47 pages now
     uses a URL verified against a live source page — the broken
     video-thumbnail pattern is gone. On top of that there is a
     3-level safety chain: original -> verified remote image ->
     assets/fallback.jpg (a local branded image that cannot fail).
     The fallback also catches images that failed BEFORE JavaScript
     loaded (the bug that caused the white boxes you screenshotted).
     Zero broken images is now guaranteed, even offline.
  2. About page "Our Story" image replaced (verified warehouse photo).
  3. REMOVED as instructed, with layout reflowed: Import-Scale
     Sourcing card, Promoter-Led Service card, Custom Packaging
     Solutions category, plus the placeholder Testimonials section
     and the heavy 4-video band. Homepage is now: Hero, Stats, Why (4),
     Categories (4), Best Sellers, Industries, Packaging, Quality,
     Import Process, Pan-India, Warehouse, FAQ, Trust, CTA. Cleaner,
     lighter, faster.
  4. Product pages gained a Packing + Industries visual strip.
  5. MASTER EXCEL NOW CONTROLS THE WHOLE SITE — 7 sheets:
     PriceList, Products, Homepage (hero headline/sub), Company
     (phone/email), Theme (4 brand colors), Media (hero/warehouse/QC
     video + about image URLs), SEO (title/description per page).
     Drop on tools/price-updater.html -> THREE files download
     (pricing.js, overrides.js, site.js) -> upload all to assets/.
  6. Admin dashboard: repeat-customer badges, click a phone number to
     see that customer's full history, follow-up-due reminders.

AKSHAT CHEMICALS WEBSITE — FINAL (v6 + engineering patch)
================================================

WHAT'S INSIDE
  index.html          Home — animated logo, video hero, 3D molecule, 16 sections
  products.html       Catalogue — search + filters (division / type / industry)
  products/           41 individual product pages (specs, price list, enquiry)
  about.html          Company story, leadership, quality
  contact.html        Enquiry form, team WhatsApp, map
  admin.html          Enquiry records dashboard (passcode: akshat2007)
  products-master.xlsx  MASTER SHEET — 2 tabs control the whole site:
                        PriceList (price/MOQ/stock per packing) +
                        Products (availability, lead time, featured, status)
  tools/price-updater.html   Converts the master sheet -> pricing.js + overrides.js
  assets/akshat-chemicals-catalogue.pdf   Downloadable product catalogue
  assets/             Styles, scripts, product data, pricing data, favicon

NEW IN v5 (READ FIRST)
  1. GOOGLE SHEETS DATABASE (highest priority — see GOOGLE-SETUP.md):
     10-minute one-time setup turns a free Google Sheet into your
     enquiry database with auto Drive folders + enquiry PDFs, a
     customer acknowledgement email, a detailed sales email and an
     instant promoter alert on every enquiry. The new Admin Dashboard
     (admin.html) reads AND writes that Sheet live: KPIs, search,
     status/assign/remarks editing, delete, CSV + Excel export, print,
     dark mode. Until you finish setup, the site safely falls back to
     the old FormSubmit email + local log.
  2. Product Categories expanded to 5 premium cards (incl. Import &
     Global Sourcing, Custom Packaging Solutions); the four capability
     cards were removed as requested.
  3. Warehouse section fully redesigned — video + address card +
     Google Maps button + specifications table. Nothing cropped.
  4. Performance: ALL section videos now lazy-load and auto-pause
     offscreen; hero canvases pause when scrolled past; images use
     lazy loading with a guaranteed fallback image (no empty slots,
     ever); lower GPU pixel ratio caps.
  5. Product pages: buying FAQ (with FAQ schema), Recently Viewed,
     Manufacturer/Supplied-by rows, TDS in documents.
  6. Master Excel gained: Product Image URL, Product Video URL, Docs
     Note columns — set an image/video URL for any product and its
     page shows it automatically after the 30-second update cycle.
  7. SEO: robots.txt + sitemap.xml (45 URLs) generated. Replace the
     placeholder domain in both + all pages before launch.

GO LIVE (2 MINUTES)
  1. Upload EVERYTHING (keep folder structure) to your hosting:
     Hostinger/GoDaddy/cPanel -> inside public_html
     Netlify/Vercel -> drag-and-drop the whole folder
  2. Open the live site, submit ONE test enquiry.
  3. FormSubmit sends an activation email to akshatchemicals@gmail.com.
     Click "Activate" once. Done — every enquiry now lands in your inbox
     as a table: product, packing, price context, quantity, name, phone,
     email, company, message.

UPDATING THE SITE FROM EXCEL (NO CODING)
  1. Open products-master.xlsx.
     - PriceList tab: price / MOQ / stock for all 82 packing rows.
       Leave Price blank to show "On request".
     - Products tab: Availability (In Stock / Ready Stock / Import
       Order), Lead Time, Featured YES/NO, Status.
  2. Open yoursite.com/tools/price-updater.html, drop the file in.
  3. Two files download: pricing.js and overrides.js.
  4. Upload BOTH to assets/ (replace old). Site updates instantly —
     including the price that changes with the packing dropdown on
     every product page.
  NOTE: a static website cannot read Excel directly on the server —
  this 30-second convert step is the bridge. If you move to hosting
  with a backend later, the same sheet can drive it live.

HOW ENQUIRIES REACH YOU
  1. EMAIL (master record): instant, from every visitor.
  2. WHATSAPP fallback: if email ever fails, visitors get a one-tap
     button to Uday Mehta (92235 02988) with all details prefilled.
  3. ADMIN PAGE yoursite.com/admin.html: records + CSV export + search.
     (Static site = it logs this browser's enquiries; inbox = complete.)

BEFORE LAUNCH — 3 THINGS TO PERSONALISE
  1. TESTIMONIALS (index.html, "What Buyers Say"): the three quotes are
     representative placeholders written for layout — REPLACE them with
     real client quotes before going live, or delete the section.
  2. DOMAIN: SEO tags use https://www.akshatchemicals.com — search &
     replace with your real domain across all .html files.
  3. Admin passcode: admin.html, line marked PASSCODE.

CHANGING THINGS LATER
  Prices/stock/MOQ .... prices.xlsx + tools/price-updater.html
  Product info ........ assets/products-data.js + the page in products/
  Phone/email ......... search & replace in .html files
  Enquiry email ....... assets/main.js line: email: "akshatchemicals@gmail.com"

NEW IN v4
  - Hero now BLENDS multiple clips (port cranes, forklift/containers,
    container transfer, lab QC) with seamless crossfades
  - Stats redesigned: 18+ Years / 41+ Products / 24hr Quotation /
    IP-USP-BP Grades (removed unverifiable client count)
  - Packing on product pages is now CLICKABLE CARDS with icons -
    selecting one instantly updates Price, MOQ and Availability
  - Master Excel now also controls Formula, CAS, Purity, Appearance
    and Synonyms per product (Products tab)
  - Four capability cards incl. Regulatory & Import Support and
    Dedicated Technical Assistance
  - Animated success checkmark on enquiry, keyboard navigation
    (arrows + Enter) in search suggestions, certificates strip in footer

NEW IN v3
  - Cinematic port/container hero video, premium stat cards
  - Instant search: name, CAS number, formula, synonyms, partial match
  - Product pages: purity, appearance, synonyms, documents, chem card,
    Customers-Also-Enquired, live price that follows the packing choice
  - Floating contact widget: Call / WhatsApp / Email / Catalogue PDF
  - Big footer: newsletter signup (emails you), maps link, back-to-top
  - Downloadable PDF catalogue at assets/akshat-chemicals-catalogue.pdf
  - Import Sourcing Network + Documentation Desk capability cards
  - Twitter cards, breadcrumb + organisation schema

RUNNING LOCALLY (your npm error)
  This is a STATIC website — no npm, no package.json, no build step.
  Just double-click index.html, or in VS Code click "Go Live"
  (bottom-right). "npm install / npm run dev" is not needed and will
  always fail — there is nothing to install.
