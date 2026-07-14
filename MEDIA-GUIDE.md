# MEDIA MANAGEMENT — one Excel controls every image & video

Open **products-master.xlsx → Media sheet**. One row per website section:

| Section key      | Controls                                        |
|------------------|--------------------------------------------------|
| hero_reel        | Hero background (Video URL + Poster Image)       |
| about_image      | About page "Our Story" photo                     |
| warehouse_video  | Warehouse section video (+ poster)               |
| qc_video         | Quality Control video (+ poster)                 |
| panindia_video   | Pan-India Supply video (+ poster)                |
| cat_apis / cat_fine / cat_sourcing / cat_import  | The 4 category card images |
| ind_pharma / ind_vet / ind_food / ind_industrial | The 4 industry card images |

Columns: **Image URL, Video URL, Poster Image, Alt Text, Visible (YES/NO)**.
- Paste a direct URL (ends .jpg/.jpeg/.png/.webp for images, .mp4 for video).
- Leave blank = keep the built-in default.
- Visible = NO hides that media element.

**Per-product media** lives in the Products sheet: Product Image URL,
Product Video URL, Gallery Images (comma-separated URLs), Brochure URL,
MSDS URL, CoA URL, TDS URL. Setting MSDS/CoA/TDS URLs turns those rows
in the product's Documents panel into real download links.

**Apply changes:** drop the workbook on `tools/price-updater.html` →
three files download (pricing.js, overrides.js, site.js) → upload all
three into `assets/` → done. Every image/video fallback chain
(original → verified backup → local assets/fallback.jpg) still protects
whatever URL you paste.
