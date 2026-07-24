/* ============================================================
   Ibermar Motor Gallery · main.js
   ============================================================ */
(function () {
  "use strict";
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  /* ---------- PRELOADER ---------- */
  const preloader = $("#preloader");
  const bar = $(".preloader__bar i");
  let p = 0;
  const tick = setInterval(() => {
    p = Math.min(100, p + Math.random() * 22);
    if (bar) bar.style.width = p + "%";
    if (p >= 100) {
      clearInterval(tick);
      setTimeout(() => preloader && preloader.classList.add("is-done"), 350);
    }
  }, 180);
  window.addEventListener("load", () => { p = 100; if (bar) bar.style.width = "100%"; });

  /* ---------- YEAR ---------- */
  const yearEl = $("#year"); if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- HEADER SCROLL ---------- */
  const header = $("#header");
  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 40);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- NAV ACTIVA (scroll spy) ---------- */
  const navLinks = $$("#headerNav a[href^='#']");
  if (navLinks.length) {
    const map = new Map();
    navLinks.forEach(a => {
      const el = document.querySelector(a.getAttribute("href"));
      if (el) map.set(el, a);
    });
    const spy = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        navLinks.forEach(a => a.classList.remove("is-active"));
        const link = map.get(e.target);
        link && link.classList.add("is-active");
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    map.forEach((_, el) => spy.observe(el));
  }

  /* ---------- THEME ---------- */
  const themeBtn = $("#themeBtn");
  themeBtn && themeBtn.addEventListener("click", () => {
    const html = document.documentElement;
    html.setAttribute("data-theme", html.getAttribute("data-theme") === "light" ? "dark" : "light");
  });

  /* ---------- FULLSCREEN MENU ---------- */
  const menu = $("#menu"), menuBtn = $("#menuBtn");
  const toggleMenu = (force) => {
    const open = force !== undefined ? force : !menu.classList.contains("is-open");
    menu.classList.toggle("is-open", open);
    document.body.classList.toggle("menu-open", open);
    menu.setAttribute("aria-hidden", String(!open));
  };
  menuBtn && menuBtn.addEventListener("click", () => toggleMenu());
  $$("#menu .menu__link").forEach(a => a.addEventListener("click", () => toggleMenu(false)));

  /* ---------- SEARCH OVERLAY ---------- */
  const searchbar = $("#searchbar"), searchBtn = $("#searchBtn"), searchClose = $("#searchClose"), globalSearch = $("#globalSearch");
  const toggleSearch = (open) => {
    searchbar.classList.toggle("is-open", open);
    searchbar.setAttribute("aria-hidden", String(!open));
    if (open) setTimeout(() => globalSearch && globalSearch.focus(), 200);
  };
  searchBtn && searchBtn.addEventListener("click", () => toggleSearch(true));
  searchClose && searchClose.addEventListener("click", () => toggleSearch(false));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") { toggleSearch(false); toggleMenu(false); }
  });
  // La búsqueda global alimenta el buscador del marketplace
  globalSearch && globalSearch.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const q = globalSearch.value.trim();
      const ms = $("#marketSearch");
      if (ms) { ms.value = q; ms.dispatchEvent(new Event("input")); }
      toggleSearch(false);
      $("#marketplace").scrollIntoView({ behavior: "smooth" });
    }
  });

  /* ---------- HERO CAROUSEL ---------- */
  const slides = $$("#heroSlides .hero__slide");
  const dotsWrap = $("#heroDots");
  const idxEl = $("#heroIdx"), totalEl = $("#heroTotal");
  let cur = 0, timer;
  if (totalEl) totalEl.textContent = String(slides.length).padStart(2, "0");

  slides.forEach((_, i) => {
    const b = document.createElement("button");
    b.setAttribute("aria-label", "Ir al slide " + (i + 1));
    b.addEventListener("click", () => goTo(i, true));
    dotsWrap && dotsWrap.appendChild(b);
  });
  const dots = dotsWrap ? $$("button", dotsWrap) : [];

  function goTo(i, manual) {
    slides[cur].classList.remove("is-active");
    dots[cur] && dots[cur].classList.remove("is-active");
    cur = (i + slides.length) % slides.length;
    slides[cur].classList.add("is-active");
    dots[cur] && dots[cur].classList.add("is-active");
    if (idxEl) idxEl.textContent = String(cur + 1).padStart(2, "0");
    if (manual) restart();
  }
  function next() { goTo(cur + 1); }
  function restart() { clearInterval(timer); timer = setInterval(next, 6000); }
  if (slides.length) { dots[0] && dots[0].classList.add("is-active"); restart(); }

  /* ---------- IMPORT CONFIGURATOR (marca → modelo → servicio) ---------- */
  const DATA = {
    "Ferrari":       ["SF90 Stradale", "296 GTB", "Purosangue", "12Cilindri", "Roma"],
    "Lamborghini":   ["Revuelto", "Urus SE", "Huracán STO", "Aventador SVJ"],
    "Rolls-Royce":   ["Spectre", "Cullinan", "Ghost", "Phantom"],
    "Mercedes-AMG":  ["G 63", "GT 63 S", "SL 63", "S 680 Maybach"],
    "Porsche":       ["911 Turbo S", "Cayenne Turbo GT", "Taycan Turbo S", "718 Spyder"],
    "Bentley":       ["Continental GT", "Bentayga", "Flying Spur"],
    "Aston Martin":  ["DB12", "Vantage", "DBX 707"],
    "McLaren":       ["750S", "Artura", "GT"]
  };
  const SERVICES = ["Importación estándar", "Express · 30 días", "Homologación incluida", "Llave en mano (matriculado)"];
  const cfgBrand = $("#cfgBrand"), cfgModel = $("#cfgModel"), cfgPack = $("#cfgPack"),
        cfgForm = $("#configForm"), cfgResult = $("#configResult");
  function fill(sel, items, placeholder) {
    sel.innerHTML = `<option value="" selected disabled>${placeholder}</option>` +
      items.map(v => `<option value="${v}">${v}</option>`).join("");
  }
  if (cfgBrand) {
    fill(cfgBrand, Object.keys(DATA), "Selecciona marca");
    cfgBrand.addEventListener("change", () => {
      fill(cfgModel, DATA[cfgBrand.value], "Selecciona modelo");
      cfgModel.disabled = false;
      cfgPack.disabled = true; fill(cfgPack, [], "Selecciona servicio");
      cfgResult.textContent = "";
    });
    cfgModel.addEventListener("change", () => {
      fill(cfgPack, SERVICES, "Selecciona servicio");
      cfgPack.disabled = false;
      cfgResult.textContent = "";
    });
    cfgForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!cfgBrand.value || !cfgModel.value || !cfgPack.value) {
        cfgResult.textContent = "Completa las tres opciones para continuar.";
        return;
      }
      cfgResult.textContent = `✦ ${cfgBrand.value} ${cfgModel.value} · ${cfgPack.value} — te enviaremos un presupuesto de importación cerrado.`;
    });
  }

  /* ---------- MARKETPLACE (inspiración: duPont Registry) ---------- */
  const CARS = [
    { name: "2026 Ferrari Purosangue", brand: "Ferrari", price: "584.995 €", mo: "10.081 €/mes", km: "254 km", origin: "Italia", badge: "STOCK", img: "car-urus.jpg", cv: 725, acc: "3,3 s", vmax: "310 km/h" },
    { name: "2021 Lamborghini Aventador SVJ", brand: "Lamborghini", price: "Consultar", mo: "", km: "7.886 km", origin: "Alemania", badge: "BAJO PEDIDO", img: "car-750s.jpg", cv: 770, acc: "2,8 s", vmax: "350 km/h" },
    { name: "2026 Porsche 911 GT3 RS", brand: "Porsche", price: "289.000 €", mo: "4.980 €/mes", km: "1.002 km", origin: "Suiza", badge: "STOCK", img: "car-911.jpg", cv: 525, acc: "3,2 s", vmax: "296 km/h" },
    { name: "2025 Rolls-Royce Spectre", brand: "Rolls-Royce", price: "499.000 €", mo: "8.600 €/mes", km: "540 km", origin: "Reino Unido", badge: "EN TRÁNSITO", img: "car-db12.jpg", cv: 585, acc: "4,5 s", vmax: "250 km/h" },
    { name: "2021 McLaren 765LT", brand: "McLaren", price: "750.000 €", mo: "12.924 €/mes", km: "5.948 km", origin: "EE. UU.", badge: "", img: "car-750s.jpg", cv: 765, acc: "2,7 s", vmax: "330 km/h" },
    { name: "2024 Ferrari 296 GTB", brand: "Ferrari", price: "349.900 €", mo: "6.030 €/mes", km: "3.120 km", origin: "Italia", badge: "STOCK", img: "car-296.jpg", cv: 830, acc: "2,9 s", vmax: "330 km/h" },
    { name: "2023 Lamborghini Huracán STO", brand: "Lamborghini", price: "412.000 €", mo: "7.100 €/mes", km: "2.400 km", origin: "Italia", badge: "", img: "car-750s.jpg", cv: 640, acc: "3,0 s", vmax: "310 km/h" },
    { name: "2025 Rolls-Royce Cullinan", brand: "Rolls-Royce", price: "Consultar", mo: "", km: "1.150 km", origin: "Emiratos", badge: "BAJO PEDIDO", img: "car-cullinan.jpg", cv: 571, acc: "5,0 s", vmax: "250 km/h" },
    { name: "2024 Porsche 911 Turbo S", brand: "Porsche", price: "268.500 €", mo: "4.628 €/mes", km: "6.800 km", origin: "Alemania", badge: "STOCK", img: "car-911.jpg", cv: 650, acc: "2,7 s", vmax: "330 km/h" },
    { name: "2022 McLaren Artura", brand: "McLaren", price: "232.000 €", mo: "3.998 €/mes", km: "9.200 km", origin: "Reino Unido", badge: "", img: "car-296.jpg", cv: 680, acc: "3,0 s", vmax: "330 km/h" },
    { name: "2011 Ferrari 599 GTO", brand: "Ferrari", price: "2.249.990 €", mo: "38.773 €/mes", km: "2.851 km", origin: "Japón", badge: "COLECCIÓN", img: "car-296.jpg", cv: 670, acc: "3,3 s", vmax: "335 km/h" },
    { name: "2024 Lamborghini Revuelto", brand: "Lamborghini", price: "612.000 €", mo: "10.550 €/mes", km: "780 km", origin: "Italia", badge: "EN TRÁNSITO", img: "car-urus.jpg", cv: 1015, acc: "2,5 s", vmax: "350 km/h" }
  ];
  const grid = $("#marketGrid"), empty = $("#marketEmpty"), countEl = $("#marketCount");
  const heart = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 20s-7-4.6-9.3-8.4C1 8.5 2.6 5.5 5.6 5.5c1.9 0 3.2 1.1 4.4 2.6 1.2-1.5 2.5-2.6 4.4-2.6 3 0 4.6 3 2.9 6.1C19 15.4 12 20 12 20z"/></svg>`;

  function mediaBg(img) {
    return `background-color:#111;background-image:url('/images/${img}');background-size:cover;background-position:center`;
  }
  function render(list) {
    if (!grid) return;
    grid.innerHTML = list.map(c => `
      <article class="mcard" data-name="${c.name}">
        <div class="mcard__media" style="${mediaBg(c.img)}">
          ${c.badge ? `<span class="mcard__badge">${c.badge}</span>` : ""}
          <button class="mcard__fav" aria-label="Guardar">${heart}</button>
        </div>
        <div class="mcard__body">
          <h3 class="mcard__name">${c.name}</h3>
          <span class="mcard__meta">${c.km} · Origen: ${c.origin}</span>
          <span class="mcard__price">${c.price} ${c.mo ? `<small>· est. ${c.mo}</small>` : ""}</span>
          <div class="mcard__cta">
            <span class="mcard__avail">Solicitar importación</span>
            <span class="mcard__phone">+34 000 000</span>
          </div>
        </div>
      </article>`).join("");
    if (empty) empty.hidden = list.length !== 0;
    if (countEl) countEl.innerHTML = `<b>${list.length}</b> ${list.length === 1 ? "coche disponible" : "coches disponibles"}`;
  }
  render(CARS);

  let activeFilter = "all", query = "";
  function apply() {
    const q = query.toLowerCase();
    render(CARS.filter(c =>
      (activeFilter === "all" || c.brand === activeFilter) &&
      (q === "" || c.name.toLowerCase().includes(q) || c.brand.toLowerCase().includes(q))
    ));
  }
  $$("#marketFilters .chip").forEach(ch => ch.addEventListener("click", () => {
    $$("#marketFilters .chip").forEach(x => x.classList.remove("is-active"));
    ch.classList.add("is-active");
    activeFilter = ch.dataset.filter;
    apply();
  }));
  const marketSearch = $("#marketSearch");
  marketSearch && marketSearch.addEventListener("input", () => { query = marketSearch.value; apply(); });
  grid && grid.addEventListener("click", (e) => {
    const fav = e.target.closest(".mcard__fav");
    if (fav) { fav.style.color = fav.style.color === "rgb(210, 31, 43)" ? "" : "rgb(210, 31, 43)"; }
  });

  /* ---------- COUNT-UP (specs Brabus) ---------- */
  function countUp(el) {
    const target = parseFloat(el.dataset.count);
    const dec = parseInt(el.dataset.decimals || "0", 10);
    const suffix = el.dataset.suffix || "";
    el.setAttribute("data-live-suffix", suffix);
    const dur = 1600; let start = null;
    function step(t) {
      if (!start) start = t;
      const prog = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - prog, 3);
      const val = target * eased;
      el.firstChild ? (el.childNodes[0].nodeValue = val.toFixed(dec)) : (el.textContent = val.toFixed(dec));
      if (prog < 1) requestAnimationFrame(step);
      else el.childNodes[0].nodeValue = target.toFixed(dec);
    }
    requestAnimationFrame(step);
  }

  /* ---------- REVEAL ON SCROLL + trigger counters ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add("is-in");
      const num = e.target.querySelector ? e.target.querySelector(".spec__num[data-count]") : null;
      if (num && !num.dataset.done) { num.dataset.done = "1"; countUp(num); }
      io.unobserve(e.target);
    });
  }, { threshold: 0.18, rootMargin: "0px 0px -8% 0px" });
  // Stagger: los hijos de cada rejilla se revelan en cascada
  [".collection__grid", ".steps__grid", ".tstm__grid", ".universe__list"].forEach(sel => {
    const c = $(sel); if (!c) return;
    [...c.children].forEach((el, i) => { if (el.classList.contains("reveal")) el.style.transitionDelay = (i % 4) * 0.08 + "s"; });
  });
  $$(".reveal").forEach(el => io.observe(el));

  /* ---------- NEWSLETTER ---------- */
  const nl = $("#newsletter"), nlMsg = $("#newsletterMsg");
  nl && nl.addEventListener("submit", (e) => {
    e.preventDefault();
    nlMsg.textContent = "✦ Gracias. Bienvenido al acceso privado Ibermar.";
    nl.reset();
  });

  /* ---------- FAQ ACCORDION ---------- */
  const faqList = $("#faqList");
  faqList && faqList.addEventListener("click", (e) => {
    const q = e.target.closest(".faq__q");
    if (!q) return;
    const item = q.parentElement;
    const open = item.classList.toggle("is-open");
    q.setAttribute("aria-expanded", String(open));
    // cierra los demás (comportamiento acordeón)
    $$(".faq__item", faqList).forEach(it => {
      if (it !== item) { it.classList.remove("is-open"); const b = $(".faq__q", it); b && b.setAttribute("aria-expanded", "false"); }
    });
  });

  /* ---------- FLOATING ACTIONS ---------- */
  const fab = $("#fab"), totop = $("#totop");
  const onScrollFabs = () => {
    const show = window.scrollY > window.innerHeight * 0.9;
    fab && fab.classList.toggle("is-visible", show);
    totop && totop.classList.toggle("is-visible", show);
  };
  onScrollFabs();
  window.addEventListener("scroll", onScrollFabs, { passive: true });
  totop && totop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  /* ---------- SCROLL PROGRESS BAR ---------- */
  const prog = $("#scrollprog");
  const onProg = () => {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    prog && (prog.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + "%");
  };
  onProg();
  window.addEventListener("scroll", onProg, { passive: true });
  window.addEventListener("resize", onProg);

  /* ---------- REQUEST FORM ---------- */
  const rBrand = $("#rf-brand"), reqForm = $("#requestForm"), reqMsg = $("#requestMsg");
  if (rBrand) rBrand.innerHTML = `<option value="">Sin preferencia</option>` +
    Object.keys(DATA).map(b => `<option>${b}</option>`).join("");
  const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  reqForm && reqForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = $("#rf-name"), email = $("#rf-email");
    let bad = false;
    [name, email].forEach(f => { const ok = f === email ? emailOk(f.value.trim()) : f.value.trim().length > 1; f.classList.toggle("invalid", !ok); if (!ok) bad = true; });
    if (bad) { reqMsg.textContent = "Revisa tu nombre y un email válido."; return; }
    const first = name.value.trim().split(" ")[0];
    reqForm.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:30px 0">
      <div style="font-family:var(--ff-serif);font-size:52px;color:var(--gold-2);line-height:1">✦</div>
      <h3 style="font-family:var(--ff-display);text-transform:uppercase;letter-spacing:.04em;margin:14px 0 8px">Gracias, ${first}</h3>
      <p style="color:var(--muted);max-width:420px;margin:0 auto">Hemos recibido tu solicitud. Un asesor de Ibermar te contactará en menos de 24&nbsp;h con un presupuesto de importación cerrado.</p>
    </div>`;
  });

  /* ---------- VEHICLE MODAL ---------- */
  const vmodal = $("#vmodal"), vmMedia = $(".vmodal__media", vmodal), vmBadge = $("#vmBadge"),
        vmOrigin = $("#vmOrigin"), vmName = $("#vmName"), vmPrice = $("#vmPrice"),
        vmSpecs = $("#vmSpecs"), vmNote = $("#vmNote"), vmRequest = $("#vmRequest");
  const toneImg = { a: "car-296.jpg", b: "car-cullinan.jpg", c: "car-urus.jpg", d: "car-db12.jpg", e: "car-750s.jpg", f: "car-911.jpg" };
  let vmCurrent = null;

  function openVehicle(v) {
    vmCurrent = v;
    vmMedia.style.backgroundImage = `url('/images/${v.img}')`;
    vmBadge.textContent = v.badge || "";
    vmOrigin.textContent = "Origen · " + v.origin;
    vmName.textContent = v.name;
    vmPrice.innerHTML = v.price + (v.mo ? `<small>est. ${v.mo}</small>` : "");
    if (v.cv) {
      vmSpecs.style.display = "grid";
      vmSpecs.innerHTML = `
        <div><span>Potencia</span><strong>${v.cv} CV</strong></div>
        <div><span>0–100 km/h</span><strong>${v.acc}</strong></div>
        <div><span>Vel. máx</span><strong>${v.vmax}</strong></div>
        <div><span>Kilómetros</span><strong>${v.km}</strong></div>`;
    } else { vmSpecs.style.display = "none"; }
    vmNote.textContent = v.note || `Importación con homologación y matriculación europea incluidas. Presupuesto cerrado y entrega puerta a puerta.`;
    vmTrigger = document.activeElement;
    vmodal.classList.add("is-open");
    vmodal.setAttribute("aria-hidden", "false");
    document.documentElement.style.overflow = "hidden";
    const closeBtn = $(".vmodal__close", vmodal);
    closeBtn && closeBtn.focus();
  }
  let vmTrigger = null;
  function closeVehicle() {
    if (!vmodal.classList.contains("is-open")) return;
    vmodal.classList.remove("is-open");
    vmodal.setAttribute("aria-hidden", "true");
    document.documentElement.style.overflow = "";
    if (vmTrigger && vmTrigger.focus) vmTrigger.focus();
  }
  vmodal && vmodal.addEventListener("click", (e) => { if (e.target.hasAttribute("data-close")) closeVehicle(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeVehicle(); });
  vmRequest && vmRequest.addEventListener("click", () => {
    if (vmCurrent) {
      const m = $("#rf-model"); if (m) m.value = vmCurrent.name.replace(/^\d{4}\s+/, "");
      if (rBrand && vmCurrent.brand) { [...rBrand.options].forEach(o => { if (o.value === vmCurrent.brand) rBrand.value = vmCurrent.brand; }); }
    }
    closeVehicle();
    const s = $("#solicitud"); s && s.scrollIntoView({ behavior: "smooth" });
  });

  // Stock cards → modal
  grid && grid.addEventListener("click", (e) => {
    if (e.target.closest(".mcard__fav")) return;
    const card = e.target.closest(".mcard");
    if (!card) return;
    const car = CARS.find(c => c.name === card.dataset.name);
    if (car) openVehicle(car);
  });
  // Hero featured thumbnails → modal
  const heroFeature = $("#heroFeature");
  heroFeature && heroFeature.addEventListener("click", (e) => {
    const b = e.target.closest(".hfeat");
    if (!b) return;
    const car = CARS.find(c => c.name === b.dataset.name);
    if (car) openVehicle(car);
  });
  // Collection cards → modal
  const collGrid = $(".collection__grid");
  collGrid && collGrid.addEventListener("click", (e) => {
    const card = e.target.closest(".ccard");
    if (!card) return;
    openVehicle({
      img: toneImg[card.dataset.tone] || "car-296.jpg",
      name: ($(".ccard__body h3", card) || {}).textContent || "",
      badge: "IMPORTADO",
      origin: (($(".ccard__tag", card) || {}).textContent || "").replace(/\s*→\s*$/, ""),
      price: "Consultar",
      note: ($(".ccard__body p", card) || {}).textContent || ""
    });
  });

  /* ---------- HERO VIDEO (fundido consistente) ---------- */
  const heroSound = $("#heroSound"), heroVideo = $(".hero__video");
  if (heroVideo) {
    const showVideo = () => heroVideo.classList.add("is-ready");
    if (heroVideo.readyState >= 2) showVideo();
    heroVideo.addEventListener("loadeddata", showVideo);
    heroVideo.addEventListener("playing", showVideo);
  }

  heroSound && heroVideo && heroSound.addEventListener("click", () => {
    heroVideo.muted = !heroVideo.muted;
    if (!heroVideo.muted) { heroVideo.play().catch(() => {}); }
    heroSound.classList.toggle("is-on", !heroVideo.muted);
    heroSound.setAttribute("aria-pressed", String(!heroVideo.muted));
    heroSound.setAttribute("aria-label", heroVideo.muted ? "Activar sonido" : "Silenciar");
  });
})();
