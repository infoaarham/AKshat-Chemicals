console.log("Akshat Chemicals — build v7 (lag-free). If you do not see this in DevTools Console, you are viewing OLD files.");
/* ================================================================
   AKSHAT CHEMICALS — behaviour v2 (GSAP + Three.js + catalogue)
   ================================================================ */
const AC = { email: "akshatchemicals@gmail.com", waNumber: "919223502988" };
const $  = (s, c=document) => c.querySelector(s);
const $$ = (s, c=document) => [...c.querySelectorAll(s)];
const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;
const LOWPOWER = (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4)
  || (navigator.deviceMemory && navigator.deviceMemory <= 4)
  || (navigator.connection && navigator.connection.saveData);

/* ---------- header ---------- */
(() => {
  const h = $(".hdr");
  const on = () => h && h.classList.toggle("scrolled", scrollY > 30);
  addEventListener("scroll", on, { passive:true }); on();
  const t = $(".nav-toggle"), n = $(".nav");
  if (t && n) {
    t.onclick = () => { const o = n.classList.toggle("open"); t.textContent = o ? "✕" : "☰"; t.setAttribute("aria-expanded", o); };
    $$("a", n).forEach(a => a.addEventListener("click", () => { n.classList.remove("open"); t.textContent = "☰"; }));
  }
})();

/* ---------- GSAP animations ---------- */
(() => {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") { $$(".gs-up,.gs-in").forEach(e => { e.style.opacity = 1; e.style.transform = "none"; }); return; }
  if (REDUCED) { $$(".gs-up,.gs-in").forEach(e => { e.style.opacity = 1; e.style.transform = "none"; }); return; }
  gsap.registerPlugin(ScrollTrigger);

  // hero entrance
  const heroBits = $$(".hero [data-hero]");
  if (heroBits.length) gsap.to(heroBits, { opacity:1, y:0, duration:1.05, ease:"power3.out", stagger:.13, delay:.35 });

  // generic scroll reveals
  $$(".gs-up").forEach(el => {
    if (el.closest(".hero")) return;
    gsap.to(el, { opacity:1, y:0, duration:.95, ease:"power3.out",
      scrollTrigger:{ trigger: el, start:"top 86%", once:true } });
  });
  $$(".gs-in").forEach(el => gsap.to(el, { opacity:1, duration:1.1, ease:"power2.out",
      scrollTrigger:{ trigger: el, start:"top 88%" } }));

  // counters
  $$("[data-count]").forEach(el => {
    const target = +el.dataset.count;
    ScrollTrigger.create({ trigger: el, start:"top 85%", once:true, onEnter(){
      gsap.fromTo(el, { textContent:0 }, { textContent:target, duration:1.8, ease:"power2.out", snap:{ textContent:1 },
        onUpdate(){ el.textContent = Number(el.textContent).toLocaleString("en-IN"); } });
    }});
  });
})();

/* ---------- hero particles (floating chemical dots) ---------- */
(() => {
  const cv = $("#particles");
  if (!cv || REDUCED || LOWPOWER) return;
  const ctx = cv.getContext("2d");
  let W, H, pts = [];
  const resize = () => { W = cv.width = cv.offsetWidth * devicePixelRatio; H = cv.height = cv.offsetHeight * devicePixelRatio; };
  addEventListener("resize", resize); resize();
  const N = Math.min(45, innerWidth / 26 | 0);
  for (let i = 0; i < N; i++) pts.push({ x:Math.random()*W, y:Math.random()*H, r:(Math.random()*2+0.8)*devicePixelRatio,
    vx:(Math.random()-.5)*.22*devicePixelRatio, vy:(Math.random()-.5)*.22*devicePixelRatio, g:Math.random()<.18 });
  let raf = null;
  const loop = () => {
    ctx.clearRect(0,0,W,H);
    for (const p of pts){
      p.x += p.vx; p.y += p.vy;
      if (p.x<0||p.x>W) p.vx*=-1; if (p.y<0||p.y>H) p.vy*=-1;
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,7);
      ctx.fillStyle = p.g ? "rgba(199,154,59,.55)" : "rgba(120,160,230,.4)"; ctx.fill();
    }
    if (innerWidth > 768) for (let i=0;i<pts.length;i++) for (let j=i+1;j<pts.length;j++){
      const a=pts[i],b=pts[j],dx=a.x-b.x,dy=a.y-b.y,d=dx*dx+dy*dy,max=(110*devicePixelRatio)**2;
      if (d<max){ ctx.strokeStyle=`rgba(110,150,220,${(1-d/max)*.16})`; ctx.lineWidth=devicePixelRatio*.7;
        ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke(); }
    }
    raf = requestAnimationFrame(loop);
  };
  (window.__heroStart = window.__heroStart || []).push(() => { if (!raf) raf = requestAnimationFrame(loop); });
  (window.__heroStop  = window.__heroStop  || []).push(() => { if (raf) { cancelAnimationFrame(raf); raf = null; } });
  raf = requestAnimationFrame(loop);
})();

/* ---------- 3D molecule (ibuprofen) ---------- */
(() => {
  const holder = $("#molecule");
  if (!holder || typeof THREE === "undefined" || REDUCED || LOWPOWER) { if (holder) holder.style.display = "none"; return; }
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas: holder, alpha:true, antialias:true }); }
  catch(_) { holder.style.display = "none"; return; }
  const scene = new THREE.Scene();
  const cam = new THREE.PerspectiveCamera(42, 1, .1, 100); cam.position.set(0,0,11);
  scene.add(new THREE.AmbientLight(0xffffff,.5));
  const k = new THREE.DirectionalLight(0xffffff,1); k.position.set(4,6,8); scene.add(k);
  const r = new THREE.DirectionalLight(0x1d4ed8,.9); r.position.set(-6,-4,-6); scene.add(r);
  const MAT = { C:new THREE.MeshPhongMaterial({color:0x2a4a80,shininess:70}),
    O:new THREE.MeshPhongMaterial({color:0xdc2626,shininess:90}),
    N:new THREE.MeshPhongMaterial({color:0xc79a3b,shininess:90}),
    H:new THREE.MeshPhongMaterial({color:0xe9eef7,shininess:100}),
    b:new THREE.MeshPhongMaterial({color:0x8aa4cf,shininess:30}) };
  const R = { C:.46, O:.44, N:.45, H:.26 };
  const atoms = [ // ibuprofen C13H18O2 (para-disubstituted ring, isobutyl + propanoic acid)
    ["C",-0.7,1.2,0],["C",0.7,1.2,0],["C",1.4,0,0],["C",0.7,-1.2,0],["C",-0.7,-1.2,0],["C",-1.4,0,0],
    ["C",2.95,0,.12],["C",3.7,1.3,.2],["C",5.2,1.15,.12],["C",3.3,2.35,-.85],["C",3.35,2.0,1.5],
    ["C",-2.95,0,-.12],["C",-3.7,-1.25,-.35],["C",-3.4,1.2,-.6],
    ["O",-5.05,-1.3,-.2],["O",-3.15,-2.3,-.85],
    ["H",-1.25,2.15,0],["H",1.25,2.15,0],["H",1.25,-2.15,0],["H",-1.25,-2.15,0],
    ["H",3.2,-.85,.5],["H",5.6,.45,.86],["H",5.65,2.12,.3],["H",5.55,.78,-.85],["H",-5.45,-2.15,-.45]];
  const bonds = [[0,1],[1,2],[2,3],[3,4],[4,5],[5,0],[2,6],[6,7],[7,8],[7,9],[7,10],[5,11],[11,12],[11,13],[12,14],[12,15],[0,16],[1,17],[3,18],[4,19],[6,20],[8,21],[8,22],[8,23],[14,24]];
  const mol = new THREE.Group();
  const v = i => new THREE.Vector3(atoms[i][1],atoms[i][2],atoms[i][3]);
  atoms.forEach(a => { const m = new THREE.Mesh(new THREE.SphereGeometry(R[a[0]],28,28), MAT[a[0]]); m.position.set(a[1],a[2],a[3]); mol.add(m); });
  bonds.forEach(([i,j]) => { const a=v(i),b=v(j),d=new THREE.Vector3().subVectors(b,a);
    const c = new THREE.Mesh(new THREE.CylinderGeometry(.09,.09,d.length(),14), MAT.b);
    c.position.copy(a).add(d.clone().multiplyScalar(.5));
    c.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), d.clone().normalize()); mol.add(c); });
  const c0 = new THREE.Box3().setFromObject(mol).getCenter(new THREE.Vector3()); mol.position.sub(c0);
  scene.add(mol);
  let mx=0,my=0;
  addEventListener("pointermove", e => { mx=(e.clientX/innerWidth-.5)*.7; my=(e.clientY/innerHeight-.5)*.45; }, {passive:true});
  const rs = () => { const w=holder.clientWidth||600,h=holder.clientHeight||600;
    renderer.setSize(w,h,false); renderer.setPixelRatio(Math.min(devicePixelRatio,1.5)); cam.aspect=w/h; cam.updateProjectionMatrix(); };
  let rsT; addEventListener("resize", () => { clearTimeout(rsT); rsT = setTimeout(rs, 150); }); rs();
  let t = 0, raf = null;
  const loop = () => { t+=.004; mol.rotation.y=t+mx; mol.rotation.x=Math.sin(t*.6)*.18+my; renderer.render(scene,cam); raf = requestAnimationFrame(loop); };
  (window.__heroStart = window.__heroStart || []).push(() => { if (!raf) raf = requestAnimationFrame(loop); });
  (window.__heroStop  = window.__heroStop  || []).push(() => { if (raf) { cancelAnimationFrame(raf); raf = null; } });
  raf = requestAnimationFrame(loop);
})();

/* ---------- catalogue helpers ---------- */
/* Google Drive share links are HTML pages, not media files — convert to direct URLs */
const driveFix = (url, kind) => {
  if (!url) return url;
  const m = String(url).match(/drive\.google\.com\/(?:file\/d\/([\w-]{20,})|(?:open|uc)\?[^#]*id=([\w-]{20,}))/);
  if (!m) return url;
  const id = m[1] || m[2];
  return "https://drive.google.com/uc?export=" + (kind === "video" ? "download" : "view") + "&id=" + id;
};
const fmtPrice = v => (v === null || v === undefined || v === "") ? "On request"
  : (typeof v === "number" ? `₹ ${v.toLocaleString("en-IN")} /kg` : String(v));
/* ---------- v6: master-Excel site overrides (assets/site.js) ---------- */
function applySiteOverrides() {
  if (typeof SITE === "undefined") { console.warn("[MEDIA] site.js missing — Excel overrides skipped"); return; }
  const PREFIX = document.body.dataset.slug ? "../" : "";
  const resolveURL = u => (!u || /^(https?:)?\/\/|^data:/.test(u)) ? u : PREFIX + u.replace(/^\.?\//,"");
  const T = SITE.theme || {};
  const map = { primary:"--navy-900", secondary:"--royal", accent:"--gold", cta:"--red" };
  Object.keys(map).forEach(k => { if (T[k] && /^#[0-9a-fA-F]{3,8}$/.test(T[k].trim())) document.documentElement.style.setProperty(map[k], T[k].trim()); });
  // whitelisted keys only — sheet instruction text can never leak onto the site
  const H = SITE.homepage || {};
  if (H.headline && $("#hero-title")) $("#hero-title").innerHTML = H.headline;
  if (H.subheading && $("#hero-sub")) $("#hero-sub").textContent = H.subheading;
  const C = SITE.company || {};
  if (C.phone) $$('[data-co="phone"]').forEach(e => e.textContent = C.phone);
  if (C.email) $$('[data-co="email"]').forEach(e => e.textContent = C.email);
  const M = SITE.media || {};
  Object.keys(M).forEach(key => {
    const v = M[key]; if (!v) return;
    const e = (typeof v === "string") ? { image: v, video: v } : v;
    $$('[data-media="' + key + '"]').forEach(el => {
      if (e.visible === "NO") { el.style.display = "none"; return; }
      if (el.tagName === "IMG" && e.image) { delete el.dataset.fb; el.src = resolveURL(driveFix(e.image, "image")); console.info("[MEDIA]", key, "→", el.src); el.addEventListener("error", () => console.error("[MEDIA] Excel URL failed to load for", key, "(", el.src, ") — fallback image shown. Check the path/sharing."), { once:true }); } // fresh fallback chain for the Excel URL
      if (el.tagName === "VIDEO") { if (e.video) { el.innerHTML = ""; el.removeAttribute("data-lazyvid"); el.src = resolveURL(driveFix(e.video, "video")); console.info("[MEDIA]", key, "→", el.src); }
                                    if (e.poster) el.poster = resolveURL(driveFix(e.poster, "image")); }
      if (e.alt && el.tagName === "IMG") el.alt = e.alt;
      if (el.classList.contains("hero-reel") && e.video) { el.innerHTML = '<video class="hero-video reel-a" autoplay muted loop playsinline src="' + resolveURL(driveFix(e.video, "video")) + '"' + (e.poster ? ' poster="' + resolveURL(driveFix(e.poster, "image")) + '"' : '') + '></video>'; }
    });
  });
  const S = (SITE.seo || {})[location.pathname.split("/").pop() || "index.html"];
  if (S) { if (S.title) document.title = S.title;
    if (S.description) { const m = document.querySelector('meta[name="description"]'); if (m) m.content = S.description; } }

  // diagnostics: every applied value is logged; add ?debugmedia to the URL for a full table
  if (location.search.includes("debugmedia")) {
    console.table($$("[data-media]").map(el => ({ key: el.dataset.media, tag: el.tagName,
      excelValue: (M[el.dataset.media] && (M[el.dataset.media].image || M[el.dataset.media].video)) || "(none — default kept)",
      appliedSrc: el.src || el.poster || "(container)" })));
  }
}
try { applySiteOverrides(); } catch (e) { console.error("[MEDIA] applier error:", e); }

const chipClass = g => g.includes("VET") ? "chip vet" : (g.includes("FOOD") ? "chip food" : "chip");
function tileHTML(p){
  return `<a class="tile" href="products/${p.slug}.html" data-name="${p.name.toLowerCase()}" data-cat="${p.cat}"
     data-tags="${p.tags.join("|").toLowerCase()}" data-ind="${p.ind.join("|").toLowerCase()}"
     data-use="${p.use.toLowerCase()}" data-syn="${(p.syn||[]).join("|").toLowerCase()}" data-x="${(p.cas+" "+(p.formula||"")).toLowerCase()}">
    <div class="tile-top"><span class="tile-sym">${p.sym}</span><span class="tile-cas">CAS<br>${p.cas.split(" /")[0]}</span></div>
    <h3>${p.name}</h3><p class="use">${p.use}</p>
    <div class="tile-foot"><span class="${chipClass(p.grade)}">${p.grade}</span><span class="view">View product →</span></div>
  </a>`;
}

/* homepage best sellers — driven by the Featured sheet in the master Excel */
function ftileHTML(p){
  return `<a class="ftile" href="products/${p.slug}.html" aria-label="${p.name} — featured product">
    <span class="fbadge">Top Seller</span>
    <span class="tile-sym">${p.sym}</span>
    <h3>${p.name}</h3><p class="use">${p.use}</p>
    <span class="tile-cas">CAS ${p.cas.split(" /")[0]} · ${p.grade}</span>
    <div class="ft-foot"><span class="${chipClass(p.grade)}">${p.grade}</span><span class="ft-cta">View Product <span>→</span></span></div>
  </a>`;
}
(() => {
  const el = $("#best-sellers");
  if (!el || typeof PRODUCTS === "undefined") return;
  const DEFAULTS = ["albendazole-ip-usp","ibuprofen-bp","n-methyl-piperazine","isopropyl-alcohol-ip","citric-acid","glycerine-ip-usp","toluene","ethyl-acetate"];
  let list = DEFAULTS;
  const F = (typeof SITE !== "undefined" && Array.isArray(SITE.featured)) ? SITE.featured : [];
  if (F.length) {
    list = F.filter(f => f.visible !== "NO")
            .sort((a,b) => (a.order||99) - (b.order||99))
            .map(f => { const m = PRODUCTS.find(p => p.name.toLowerCase() === String(f.product||"").toLowerCase().trim() || p.slug === f.product); return m && m.slug; })
            .filter(Boolean);
    if (!list.length) list = DEFAULTS;
  }
  el.innerHTML = [...new Set(list)].map(sl => PRODUCTS.find(p => p.slug === sl)).filter(Boolean).map(ftileHTML).join("");
})();

/* catalogue page: search + category + tag + industry filters */
(() => {
  const grid = $("#cat-grid");
  if (!grid || typeof PRODUCTS === "undefined") return;
  grid.innerHTML = PRODUCTS.map(tileHTML).join("");
  const tiles = $$(".tile", grid);
  const q = $("#q"), note = $("#count");
  let cat = "all", tag = null, ind = null;
  const render = () => {
    const term = (q?.value || "").toLowerCase().trim();
    let n = 0;
    tiles.forEach(t => {
      const ok = (cat === "all" || t.dataset.cat === cat)
        && (!tag || t.dataset.tags.includes(tag))
        && (!ind || t.dataset.ind.includes(ind))
        && (!term || t.dataset.name.includes(term) || t.dataset.use.includes(term)
           || t.dataset.syn.includes(term) || t.dataset.x.includes(term));
      t.style.display = ok ? "" : "none"; if (ok) n++;
      t.style.opacity = 1; t.style.transform = "none";
    });
    if (note) note.textContent = `SHOWING ${n} OF ${PRODUCTS.length} PRODUCTS`;
    $("#no-match").style.display = n ? "none" : "block";
  };
  $$(".fbtn[data-cat]").forEach(b => b.onclick = () => { $$(".fbtn[data-cat]").forEach(x=>x.classList.remove("active")); b.classList.add("active"); cat=b.dataset.cat; render(); });
  $$(".tag-btn[data-tag]").forEach(b => b.onclick = () => { const on=b.classList.toggle("active"); $$(".tag-btn[data-tag]").forEach(x=>x!==b&&x.classList.remove("active")); tag=on?b.dataset.tag:null; render(); });
  $$(".tag-btn[data-ind]").forEach(b => b.onclick = () => { const on=b.classList.toggle("active"); $$(".tag-btn[data-ind]").forEach(x=>x!==b&&x.classList.remove("active")); ind=on?b.dataset.ind:null; render(); });
  q?.addEventListener("input", render);
  const sp = new URLSearchParams(location.search);
  if (sp.get("cat")) { const b=$(`.fbtn[data-cat="${sp.get("cat")}"]`); if(b) b.click(); }
  if (sp.get("q") && q) { q.value = sp.get("q"); }
  render();
})();

/* ---------- product page: pricing table + related ---------- */
(() => {
  const slugEl = document.body.dataset.slug;
  if (!slugEl || typeof PRODUCTS === "undefined") return;
  const p = PRODUCTS.find(x => x.slug === slugEl); if (!p) return;

  // pricing from single source (assets/pricing.js)
  const tbody = $("#price-rows");
  const packSel = $("#f-pack");
  const rows = (typeof PRICING !== "undefined" && PRICING[p.slug] && PRICING[p.slug].length)
    ? PRICING[p.slug]
    : p.pk.map(pk => ({ pack: pk, price: null, moq: "On request", stock: "Enquire" }));
  if (tbody) tbody.innerHTML = rows.map(r => {
    const price = fmtPrice(r.price);
    const stockCls = /ex-stock|in stock|available|ready/i.test(r.stock||"") ? "stock-ok" : "stock-po";
    return `<tr><td>${r.pack}</td><td class="pr">${price}</td><td>${r.moq||"—"}</td><td class="${stockCls}">${r.stock||"Enquire"}</td></tr>`;
  }).join("");
  const cardsBox = $("#pack-cards");
  const ov = (typeof OVERRIDES !== "undefined" && OVERRIDES[p.slug]) || {};
  const packIcon = pk => {
    const k = pk.toLowerCase();
    if (k.includes("bag")) return '<svg viewBox="0 0 64 64"><path d="M18 14h28l4 40H14z"/><path d="M24 14v-4h16v4"/><path d="M22 30h20"/></svg>';
    if (k.includes("ibc")) return '<svg viewBox="0 0 64 64"><rect x="10" y="14" width="44" height="40" rx="3"/><path d="M10 24h44M20 14v40M32 14v40M44 14v40"/><rect x="26" y="4" width="12" height="10" rx="2"/></svg>';
    if (k.includes("tanker")) return '<svg viewBox="0 0 64 64"><rect x="4" y="22" width="38" height="20" rx="9"/><path d="M42 30h10l6 8v4H42z"/><circle cx="16" cy="48" r="5"/><circle cx="50" cy="48" r="5"/></svg>';
    if (k.includes("bottle") || k.includes("glass")) return '<svg viewBox="0 0 64 64"><path d="M26 8h12v10l6 8v28a4 4 0 0 1-4 4H24a4 4 0 0 1-4-4V26l6-8z"/><path d="M20 34h24"/></svg>';
    if (k.includes("barrel") || k.includes("200") || k.includes("210") || k.includes("215") || k.includes("220") || k.includes("250") || k.includes("270") || k.includes("160")) return '<svg viewBox="0 0 64 64"><rect x="12" y="8" width="40" height="48" rx="4"/><path d="M12 20h40M12 44h40"/></svg>';
    return '<svg viewBox="0 0 64 64"><rect x="14" y="10" width="36" height="44" rx="3"/><path d="M14 22h36M14 42h36"/><ellipse cx="32" cy="10" rx="18" ry="4"/></svg>';
  };
  const setPick = pack => {
    const r = rows.find(x => x.pack === pack) || rows[0]; if (!r) return;
    if (packSel) { if (![...packSel.options].some(o=>o.value===r.pack)) { const o=document.createElement("option"); o.value=o.textContent=r.pack; packSel.appendChild(o); } packSel.value = r.pack; }
    $$(".pack-card", cardsBox).forEach(c => { const on = c.dataset.pack === r.pack; c.classList.toggle("on", on); c.setAttribute("aria-checked", on); });
    const price = $("#lp-price"), moq = $("#lp-moq"), stock = $("#lp-stock");
    if (price) price.textContent = fmtPrice(r.price);
    if (moq) moq.textContent = r.moq || "On request";
    if (stock) stock.textContent = (ov.availability && ov.availability !== "Enquire") ? ov.availability : (r.stock || "Enquire");
  };
  if (cardsBox) {
    cardsBox.innerHTML = rows.map(r =>
      `<button type="button" class="pack-card" role="radio" aria-checked="false" data-pack="${r.pack}">${packIcon(r.pack)}<span>${r.pack}</span></button>`).join("");
    cardsBox.addEventListener("click", e => { const c = e.target.closest(".pack-card"); if (c) setPick(c.dataset.pack); });
    setPick(rows[0] && rows[0].pack);
  }
  // packaging + industry visual strip
  const pir = $("#pack-icons");
  if (pir) pir.innerHTML = '<span class="pi-lbl">Packing</span>' + rows.map(r =>
    `<span class="pi" title="${r.pack}">${packIcon(r.pack)}<i>${r.pack.split("(")[0].trim()}</i></span>`).join("");
  const icr = $("#ind-chips");
  if (icr) icr.innerHTML = '<span class="pi-lbl">Industries</span>' + p.ind.map(i => `<span class="chip">${i}</span>`).join("");

  // per-product documents & gallery from the master sheet
  const docLink = (label, url) => { $$(".doc").forEach(d => { if (d.textContent.includes(label) && url) {
    d.outerHTML = `<a class="doc dl" href="${url}" target="_blank" rel="noopener">${d.innerHTML.replace(/— <b>.*<\/b>/, "— <b>download</b>")}</a>`; } }); };
  docLink("MSDS", ov.msds); docLink("Certificate of Analysis", ov.coa); docLink("Technical Data Sheet", ov.tds);
  if (ov.gallery) { const cc = $(".pd-grid");
    if (cc) cc.insertAdjacentHTML("afterend", '<div class="pi-row" style="margin-top:1.2rem">' +
      ov.gallery.split(",").map(u => `<img src="${driveFix(u.trim(),"image")}" alt="${p.name}" loading="lazy" style="width:92px;height:92px;object-fit:cover;border-radius:10px;border:1px solid rgba(255,255,255,.2)">`).join("") + "</div>"); }

  // master-sheet media overrides
  if (ov.image) { const cc = $(".chem-card"); if (cc) { cc.innerHTML = `<img src="${driveFix(ov.image,"image")}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover;border-radius:inherit">`; } }
  if (ov.video) { const sc = $(".spec-card"); if (sc) sc.insertAdjacentHTML("beforebegin",
    `<div class="wh-media" style="margin-bottom:2rem"><video muted loop playsinline autoplay preload="metadata" src="${driveFix(ov.video,"video")}" style="width:100%"></video></div>`); }
  // master-sheet overrides -> spec table
  $$("[data-f]").forEach(td => {
    const f = td.dataset.f;
    if (f === "availability" && ov.availability) td.textContent = ov.availability;
    if (f === "lead" && ov.lead) td.textContent = ov.lead;
    if (f === "purity" && ov.purity) td.textContent = ov.purity;
    if (f === "appearance" && ov.appearance) td.textContent = ov.appearance;
    if (f === "synonyms" && ov.synonyms) td.textContent = ov.synonyms;
  });

  // related products (same category, share an industry)
  const rel = $("#related");
  const pool = PRODUCTS.filter(x => x.slug!==p.slug && (x.cat===p.cat || x.ind.some(i=>p.ind.includes(i))));
  if (rel) rel.innerHTML = pool.slice(0,4).map(t => tileHTML(t).replace(/href="products\//g,'href="')).join("");
  const also = $("#also");
  if (also) {
    // deterministic rotation seeded by slug so every page shows a different, stable set
    const seed = [...p.slug].reduce((a,c)=>a+c.charCodeAt(0),0);
    const rest = PRODUCTS.filter(x => x.slug!==p.slug && !pool.slice(0,4).includes(x));
    const pick = []; for (let i=0;i<4 && rest.length;i++) pick.push(rest[(seed*7+i*13) % rest.length]);
    also.innerHTML = [...new Set(pick)].map(t => tileHTML(t).replace(/href="products\//g,'href="')).join("");
  }
})();

/* ---------- enquiry form (all pages) ---------- */
(() => {
  const form = $("#enquiry-form"); if (!form) return;
  const sel = $("#f-product");
  if (sel && typeof PRODUCTS !== "undefined" && !document.body.dataset.slug)
    PRODUCTS.forEach(p => { const o=document.createElement("option"); o.value=o.textContent=p.name; sel.appendChild(o); });
  const qp = new URLSearchParams(location.search).get("product");
  if (qp && sel) { if (![...sel.options].some(o=>o.value===qp)) { const o=document.createElement("option"); o.value=o.textContent=qp; sel.appendChild(o); } sel.value = qp; }

  const status = $("#fstatus");
  form.addEventListener("submit", async e => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(form).entries());
    d.submittedAt = new Date().toLocaleString("en-IN", { hour12:true });
    d.page = location.pathname;
    const lp = $("#lp-price"); if (lp) d.priceShown = lp.textContent;
    try { const log = JSON.parse(localStorage.getItem("ac_enquiries")||"[]"); log.unshift(d);
      localStorage.setItem("ac_enquiries", JSON.stringify(log.slice(0,800))); } catch(_){}
    const btn = form.querySelector("button[type=submit]");
    btn.disabled = true; btn.textContent = "Sending…"; status.className = "fstatus";
    // ---- primary: Google Sheets backend (if configured) ----
    if (typeof CONFIG !== "undefined" && CONFIG.GAS_URL) {
      try {
        const r = await fetch(CONFIG.GAS_URL, { method: "POST",
          body: JSON.stringify({ action: "enquiry", data: d }) }); // simple request: no preflight
        const j = await r.json();
        if (j && j.ok) {
          status.className = "fstatus ok";
          status.innerHTML = '<svg class="ok-check" viewBox="0 0 56 56"><circle cx="28" cy="28" r="25"/><path d="M17 29l8 8 15-17"/></svg>' +
            `Enquiry <b>${j.id || "received"}</b> — logged to our system. A confirmation email is on its way to you; our team reverts within 24 working hours.`;
          form.reset();
          if (typeof gsap !== "undefined" && !REDUCED) gsap.from(status, { y:14, opacity:0, duration:.5, ease:"power2.out" });
          btn.disabled = false; btn.textContent = "Send Enquiry";
          return;
        }
      } catch(_) { /* fall through to email fallback */ }
    }
    try {
      const res = await fetch("https://formsubmit.co/ajax/" + AC.email, {
        method:"POST", headers:{ "Content-Type":"application/json", Accept:"application/json" },
        body: JSON.stringify({ _subject:`Enquiry — ${d.product||"General"} — ${d.name}`, _template:"table",
          Name:d.name, Company:d.company||"-", Phone:d.phone, Email:d.email,
          Product:d.product||"General enquiry", Packing:d.packing||"-", Quantity:d.quantity||"-",
          Message:d.message||"-", "Submitted At":d.submittedAt, Page:d.page }) });
      if (!res.ok) throw 0;
      status.className = "fstatus ok";
      status.innerHTML = '<svg class="ok-check" viewBox="0 0 56 56"><circle cx="28" cy="28" r="25"/><path d="M17 29l8 8 15-17"/></svg>' +
        "Enquiry sent. Our team will revert with a firm quotation within 24 working hours.";
      form.reset();
      if (typeof gsap !== "undefined" && !REDUCED) gsap.from(status, { y:14, opacity:0, duration:.5, ease:"power2.out" });
    } catch(_) {
      const msg = encodeURIComponent(`New enquiry — Akshat Chemicals\n\nName: ${d.name}\nCompany: ${d.company||"-"}\nPhone: ${d.phone}\nEmail: ${d.email}\nProduct: ${d.product||"-"}\nPacking: ${d.packing||"-"}\nQuantity: ${d.quantity||"-"}\nMessage: ${d.message||"-"}`);
      status.className = "fstatus err";
      status.innerHTML = `Email service unreachable — your enquiry was saved. <a href="https://wa.me/${AC.waNumber}?text=${msg}" target="_blank" rel="noopener" style="text-decoration:underline;font-weight:800">Send it on WhatsApp instead →</a>`;
    }
    btn.disabled = false; btn.textContent = "Send Enquiry";
  });
})();

/* ---------- image fallback + footer year ---------- */
$$("img[loading=lazy]").forEach(i => i.addEventListener("error", () => i.style.display="none", { once:true }));
$$("[data-year]").forEach(e => e.textContent = new Date().getFullYear());


/* ---------- v3: instant search suggestions (name / CAS / formula / synonym) ---------- */
(() => {
  const q = $("#q"); if (!q || typeof PRODUCTS === "undefined") return;
  const wrap = q.closest(".search-box")?.parentElement; if (!wrap) return;
  const box = document.createElement("div"); box.className = "sugg"; wrap.appendChild(box);
  const pre = document.body.dataset.slug ? "" : "products/";
  const hi = (txt, term) => txt.replace(new RegExp("("+term.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")+")","ig"),"<b>$1</b>");
  q.addEventListener("input", () => {
    const term = q.value.trim().toLowerCase();
    if (term.length < 2) { box.classList.remove("open"); return; }
    const hits = PRODUCTS.map(p => {
      const hay = [p.name, ...(p.syn||[]), p.cas, p.formula||"", p.use, (p.ind||[]).join(" "), (p.tags||[]).join(" "), (p.pk||[]).join(" ")].join(" ").toLowerCase();
      return hay.includes(term) ? p : null;
    }).filter(Boolean).slice(0,7);
    if (!hits.length) { box.classList.remove("open"); return; }
    box.innerHTML = hits.map(p =>
      `<a href="${pre}${p.slug}.html"><span>${hi(p.name,term)}${p.syn&&p.syn.length?` <span class="s-cas">(${hi(p.syn[0],term)})</span>`:""}</span><span class="s-cas">CAS ${hi(p.cas.split(" /")[0],term)}</span></a>`).join("");
    box.classList.add("open");
  });
  document.addEventListener("click", e => { if (!wrap.contains(e.target)) box.classList.remove("open"); });
})();

/* ---------- v3: floating contact widget ---------- */
(() => {
  const fab = $("#fab"), btn = $("#fab-btn"); if (!fab || !btn) return;
  btn.onclick = () => { const o = fab.classList.toggle("open"); btn.setAttribute("aria-expanded", o); };
  document.addEventListener("click", e => { if (!fab.contains(e.target)) fab.classList.remove("open"); });
})();

/* ---------- v3: back to top ---------- */
(() => { const t = $("#totop"); if (t) t.onclick = () => scrollTo({ top:0, behavior: REDUCED ? "auto" : "smooth" }); })();

/* ---------- v3: newsletter ---------- */
(() => {
  const f = $("#news-form"); if (!f) return;
  f.addEventListener("submit", async e => {
    e.preventDefault();
    const email = f.email.value, st = $("#news-status");
    try {
      const r = await fetch("https://formsubmit.co/ajax/" + AC.email, { method:"POST",
        headers:{ "Content-Type":"application/json", Accept:"application/json" },
        body: JSON.stringify({ _subject:"Newsletter signup", _template:"table", Email: email, Type:"Market updates subscription" }) });
      if (!r.ok) throw 0;
      st.textContent = "✓ Subscribed — you'll receive our next circular."; st.style.color = "#4ADE80"; f.reset();
    } catch(_) { st.textContent = "Could not subscribe right now — email us instead."; st.style.color = "#EF3B3B"; }
  });
})();


/* ---------- v4: blended hero reel (multi-clip crossfade) ---------- */
(() => {
  const reel = $(".hero-reel"); if (!reel || REDUCED || LOWPOWER) return;
  let srcs, posters;
  try { srcs = JSON.parse(reel.dataset.reel); posters = JSON.parse(reel.dataset.posters); } catch(_) { return; }
  const A = $(".reel-a", reel), B = $(".reel-b", reel);
  if (!A || !B || srcs.length < 2) return;
  let i = 0, front = A, back = B;
  const HOLD = 12000;
  const cycle = () => {
    if (window.__heroVisible === false) { setTimeout(cycle, 4000); return; }
    const next = (i + 1) % srcs.length;
    back.poster = posters[next] || "";
    back.src = srcs[next];
    back.load();
    const go = () => {
      back.play().catch(()=>{});
      reel.classList.add("swap");
      // after fade completes, promote back->front
      setTimeout(() => {
        front.pause();
        [front, back] = [back, front];
        // rebind classes so CSS fade works next round
        front.classList.remove("reel-b"); front.classList.add("reel-a");
        back.classList.remove("reel-a"); back.classList.add("reel-b");
        reel.classList.remove("swap");
        i = next;
        setTimeout(cycle, HOLD);
      }, 1700);
    };
    if (back.readyState >= 3) go();
    else { back.oncanplay = () => { back.oncanplay = null; go(); };
           setTimeout(() => { if (back.readyState < 3) { i = next; setTimeout(cycle, HOLD); } }, 6000); }
  };
  setTimeout(cycle, HOLD);
})();

/* ---------- v4: keyboard navigation for search suggestions ---------- */
(() => {
  const q = $("#q"); if (!q) return;
  q.addEventListener("keydown", e => {
    const box = q.closest(".search-wrap")?.querySelector(".sugg");
    if (!box || !box.classList.contains("open")) return;
    const items = $$("a", box); if (!items.length) return;
    let idx = items.findIndex(a => a.classList.contains("hot"));
    if (e.key === "ArrowDown") { e.preventDefault(); idx = (idx + 1) % items.length; }
    else if (e.key === "ArrowUp") { e.preventDefault(); idx = (idx - 1 + items.length) % items.length; }
    else if (e.key === "Enter" && idx >= 0) { e.preventDefault(); items[idx].click(); return; }
    else if (e.key === "Escape") { box.classList.remove("open"); return; }
    else return;
    items.forEach((a, n) => a.classList.toggle("hot", n === idx));
    items[idx].scrollIntoView({ block: "nearest" });
  });
})();


/* ---------- v5: lazy video loader (perf) ---------- */
(() => {
  const vids = $$("video[data-lazyvid]");
  const load = v => { $$("source", v).forEach(sr => { if (sr.dataset.src && !sr.src) sr.src = sr.dataset.src; }); if (v.readyState === 0) v.load(); };
  if (LOWPOWER) {
    // weak machine: zero background decoding — poster with a tap-to-play button
    vids.forEach(v => {
      const btn = document.createElement("button");
      btn.className = "vplay"; btn.setAttribute("aria-label", "Play video"); btn.innerHTML = "▶";
      v.parentElement.style.position = "relative"; v.parentElement.appendChild(btn);
      btn.onclick = () => { vids.forEach(o => o.pause()); load(v); v.play().catch(()=>{}); btn.remove(); };
    });
  } else {
    const hook = v => {
      if (!("IntersectionObserver" in window)) { load(v); v.play().catch(()=>{}); return; }
      new IntersectionObserver(es => es.forEach(en => {
        if (en.isIntersecting) {
          load(v);
          vids.forEach(o => { if (o !== v) o.pause(); }); // one decoder at a time
          v.play().catch(()=>{});
        } else v.pause();
      }), { threshold: 0.5 }).observe(v);
    };
    vids.forEach(hook);
  }
})();

/* ---------- v5: pause hero canvases offscreen + image fallback swap ---------- */
(() => {
  const hero = $(".hero");
  window.__heroVisible = true;
  if (hero && "IntersectionObserver" in window) {
    new IntersectionObserver(es => es.forEach(en => {
      window.__heroVisible = en.isIntersecting;
      (en.isIntersecting ? (window.__heroStart||[]) : (window.__heroStop||[])).forEach(f => f());
      $$(".hero-reel video").forEach(v => en.isIntersecting ? (v.classList.contains("reel-a") && v.play().catch(()=>{})) : v.pause());
    })).observe(hero);
  }
  const mq = $(".marquee-track");
  if (mq && "IntersectionObserver" in window)
    new IntersectionObserver(es => es.forEach(en => mq.classList.toggle("paused", !en.isIntersecting))).observe(mq.parentElement);
  // 3-level chain: original -> verified remote -> LOCAL file (cannot fail). Also
  // catches images that errored BEFORE this script ran (img.complete + naturalWidth 0).
  const PRE = document.body.dataset.slug ? "../" : "";
  const SAFE_REMOTE = "https://images.pexels.com/videos/2745883/free-video-2745883.jpg?auto=compress&cs=tinysrgb&w=1400";
  const SAFE_LOCAL  = PRE + "assets/fallback.jpg";
  const rescue = img => {
    if (img.dataset.fb === "2") return;
    if (img.dataset.fb === "1") { img.dataset.fb = "2"; img.src = SAFE_LOCAL; return; }
    img.dataset.fb = "1"; img.src = SAFE_REMOTE;
  };
  $$("img").forEach(img => {
    img.addEventListener("error", () => rescue(img));
    if (img.complete && img.naturalWidth === 0 && img.src) rescue(img);   // already failed before JS loaded
  });
  // re-check after full load for stragglers
  addEventListener("load", () => $$("img").forEach(img => { if (img.complete && img.naturalWidth === 0 && img.src) rescue(img); }));
  // smooth fade-in for lazy images (boxes are pre-sized, so zero layout shift)
  $$("img[loading=lazy]").forEach(img => {
    img.classList.add("fade");
    const done = () => img.classList.add("loaded");
    if (img.complete && img.naturalWidth > 0) done(); else img.addEventListener("load", done, { once:true });
    img.addEventListener("error", done, { once:true }); // fallback image still fades in
  });
})();

/* ---------- v5: recently viewed (product pages) ---------- */
(() => {
  const slug = document.body.dataset.slug;
  if (!slug || typeof PRODUCTS === "undefined") return;
  let rv = [];
  try { rv = JSON.parse(localStorage.getItem("ac_recent") || "[]"); } catch(_){}
  const show = rv.filter(x => x !== slug).slice(0, 4);
  const grid = $("#recent"), title = $("#rv-title");
  if (grid && show.length) {
    grid.innerHTML = show.map(sl => { const p = PRODUCTS.find(x => x.slug === sl); return p ? tileHTML(p).replace(/href="products\//g,'href="') : ""; }).join("");
    if (title) title.style.display = "block";
  }
  rv = [slug, ...rv.filter(x => x !== slug)].slice(0, 8);
  try { localStorage.setItem("ac_recent", JSON.stringify(rv)); } catch(_){}
})();





/* ---------- v12: 3D tilt on category cards ---------- */
(() => {
  if (REDUCED || LOWPOWER || !matchMedia("(pointer:fine)").matches) return;
  $$("[data-tilt]").forEach(card => {
    let raf = null;
    card.addEventListener("pointermove", e => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        card.style.transform = `perspective(900px) rotateX(${(-y*7).toFixed(2)}deg) rotateY(${(x*9).toFixed(2)}deg) translateY(-6px)`;
        raf = null;
      });
    }, { passive: true });
    card.addEventListener("pointerleave", () => { card.style.transform = ""; });
  });
})();
