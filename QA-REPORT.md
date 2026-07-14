# QA REPORT — AKSHAT CHEMICALS WEBSITE

**Version: v10 (Release Candidate 1)** · Audit date: 13-Jul-2026

Every row below is a check that was actually executed against the shipped
files (automated parser/unit tests, HTML parsing, link resolution, grep
audits) or, where a live browser/Google deployment is required, a full
code-path inspection from Excel -> generated JS -> HTML -> browser as
permitted by Rule 2.

| # | Feature | Result | Test performed |
|---|---------|--------|----------------|
| 1 | HTML validity + unique IDs | ✅ PASS | parsed all 49 pages; duplicate-ID scan -> none |
| 2 | Excel price system (Excel->updater->pricing.js->site) | ✅ PASS | parser unit tests: 99 / ₹99/kg / Rs 120/kg / blank / Available / Ready Stock / Enquire — all produce correct JSON; renderer shows strings verbatim, numbers formatted, null='On request' |
| 3 | Media system: Excel->updater->site.js->HTML->browser | ✅ PASS | all 14 data-media hooks present in HTML (none missing); applier reads SITE.media, resets fallback state, converts Drive share links (unit-tested 3/3); updater converts at generation too. ROOT CAUSE of about-image bug: Drive share URL is an HTML page -> img errored -> fallback masked it; now auto-converted to uc?export=view |
| 4 | Homepage headline/subheading via Excel; instruction text cannot leak | ✅ PASS | applier reads ONLY whitelisted keys (headline, subheading, phone, email, 4 theme colors); any other cell incl. sheet notes is ignored by design |
| 5 | Featured sheet: order, visibility, products, fallback, no duplicates | ✅ PASS | reads SITE.featured; sorts by Display Order; filters Visible=NO; dedupes via Set; falls back to the built-in 8 if sheet empty/unmatched |
| 6 | Product pages: pricing/overrides/site consumed; price, MOQ, packing, availability, docs, gallery, related, enquiry | ✅ PASS | methanol.html includes all 3 generated JS files; packing cards drive price/MOQ/availability readout; docs become links when Excel URLs set (driveFix'd); gallery renders from Excel; related + also-enquired grids populated by JS |
| 7 | Company sheet: phone/email applied site-wide | ✅ PASS | data-co spans present in footer of every page (incl. contact); applier rewrites textContent from SITE.company. NOTE: enquiry DESTINATION email is in config.js/Code.gs (backend), intentionally not Excel-editable |
| 8 | Theme sheet: 4 brand colors -> CSS variables (validated hex only) | ✅ PASS | primary/secondary/accent/cta map to --navy-900/--royal/--gold/--red custom properties consumed across the stylesheet; invalid values rejected |
| 9 | SEO: titles/descriptions via Excel; OG/Twitter/schema/sitemap | ✅ PASS | sitemap 47 URLs incl. both new products; OG+Twitter+Organization schema on home; Product+Breadcrumb+FAQ schema on all 43 product pages; SITE.seo overrides title+meta at load |
| 10 | Google Workspace backend + frontend contract intact | ✅ PASS | payload fields (name/company/phone/email/product/packing/quantity/priceShown/message/page) match Code.gs columns; PDF->Drive, 3 emails, admin GET/POST endpoints unchanged; FormSubmit fallback preserved. Live enquiry requires deployment — code path verified end-to-end |
| 11 | Zero broken images; 3-level fallback incl. pre-JS failures | ✅ PASS | every <img> on 49 pages uses a source-verified URL or local asset (0 unverified); chain: Excel/original -> verified remote -> local fallback.jpg; catches images that errored before JS ran |
| 12 | Performance: no infinite animations, no heavy blur, 720p video, single decoder, low-power mode | ✅ PASS | RAF loops cancel offscreen; ScrollTriggers self-destroy (once:true); marquee pauses; blur only on header/nav/hub; all videos 720p, one playing at a time; ≤4-core machines get tap-to-play instead of autoplay; scrub parallax removed |
| 13 | Search: 43 products, synonyms, CAS, formula, autocomplete, keyboard nav, filters | ✅ PASS | suggestion haystack = name+synonyms+CAS+formula+use+industries+tags+packing; ArrowUp/Down/Enter/Escape handled; category/type/industry filters render-tested against tile data attributes |
| 14 | Updater reads all 8 sheets; MSDS/CoA/TDS/brochure links work when URLs set | ✅ PASS | updater generates pricing.js + overrides.js + site.js covering every sheet; doc rows convert to download links when Excel URLs provided |
| 15 | Code audit: no TODO/FIXME/dummy/localhost | ✅ PASS | grep across all pages+assets -> clean ('placeholder' exists only as HTML input placeholder attributes — intentional) |
| 16 | Zero broken internal links / no 404 assets | ✅ PASS | resolved every internal href/src across 49 pages -> all exist |
| 17 | JS: zero syntax errors, no undefined data files | ✅ PASS | node --check on all 6 shipped scripts; every referenced global (PRODUCTS/PRICING/OVERRIDES/SITE/CONFIG) is defined before main.js loads |

**Summary: 17 / 17 checks PASS.**

## Root cause of the reported Media bug
`SITE.media.about_image.image` was being read correctly by about.html —
the connection was never broken. The pasted value was a Google Drive
*share page* URL (`drive.google.com/file/d/…/view`), which is an HTML
page, not an image file. The `<img>` errored and the safety fallback
silently substituted the backup photo, making it look like the old image.
**Fix:** Drive share links are now auto-converted to direct
`uc?export=view&id=…` URLs in BOTH the updater (at generation time) and
the site (at load time), and applying an Excel URL resets the fallback
state so the new URL gets its own full 3-level chain. Unit-tested 3/3.

## Items that require your live environment (cannot be tested from code)
1. **Google backend end-to-end** (Sheet row, Drive PDF, 3 emails): code
   contract verified field-by-field; needs your deployed Apps Script.
   Test: submit one enquiry after deploying — see GOOGLE-SETUP.md.
2. **Drive-hosted media**: the file must be shared as 'Anyone with the
   link'. Very large Drive videos may hit Google's virus-scan page;
   images are unaffected. For heavy videos prefer any direct .mp4 host.
3. **Browser console / Lighthouse**: all shipped JS passes strict syntax
   checks and all referenced files exist (no 404 class of console error
   is possible); final scores depend on your hosting + CDNs.

## Known intentional design decisions (not bugs)
- Enquiry DESTINATION email lives in config.js + Code.gs (backend
  credential), not in the Excel — changing it must be deliberate.
- Statistics band shows fixed, verifiable numbers (18+/43+/24hr/grades);
  the 43 auto-matches the catalogue at build time.
- 'placeholder' strings in code are HTML input placeholder attributes.