(() => {
  // Header / progress
  const header = document.querySelector(".site-header");
  const scrollBar = document.getElementById("scrollBar");

  // Navbar
  const navList = document.getElementById("navList");
  const navToggle = document.querySelector(".nav-toggle");

  // Sections to animate + sync verse panel
  const sections = Array.from(document.querySelectorAll(".content-section.reveal"));

  // Key panel elements
  const keyTitle = document.getElementById("keyTitle");
  const keyVerse = document.getElementById("keyVerse");
  const keyMeta = document.getElementById("keyMeta");
  const keySection = document.getElementById("keySection");

  let activeId = null;

  function setScrollProgress() {
    const doc = document.documentElement;
    const max = doc.scrollHeight - doc.clientHeight;
    const pct = max > 0 ? (doc.scrollTop / max) * 100 : 0;
    if (scrollBar) scrollBar.style.width = `${pct}%`;
  }

  function setKeyPanel(sectionEl) {
    if (!sectionEl) return;
    const t = sectionEl.dataset.keyTitle || "";
    const v = sectionEl.dataset.keyVerse || "";
    const m = sectionEl.dataset.keyMeta || "";

    if (keyTitle) keyTitle.textContent = t;
    if (keyVerse) keyVerse.textContent = v;
    if (keySection) keySection.textContent = m;
    if (keyMeta) keyMeta.style.opacity = "1";
  }

  function setActiveNav(sectionId) {
    if (!navList) return;
    const links = Array.from(navList.querySelectorAll("a[data-nav]"));
    links.forEach(a => {
      const href = a.getAttribute("href") || "";
      const target = href.startsWith("#") ? href.slice(1) : "";
      a.classList.toggle("active", target === sectionId);
    });
  }

  function activateSection(sectionEl) {
    const id = sectionEl?.id;
    if (!id || id === activeId) return;
    activeId = id;

    setKeyPanel(sectionEl);
    setActiveNav(id);
  }

  function initReveal() {
    // Animate sections when they enter the viewport
    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) entry.target.classList.add("is-visible");
      }
    }, { threshold: 0.2 });

    sections.forEach(s => io.observe(s));
  }

  function initKeyPanelSync() {
    // Pick the most visible section
    const io = new IntersectionObserver((entries) => {
      const visible = entries
        .filter(e => e.isIntersecting)
        .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0));

      if (visible[0]?.target) activateSection(visible[0].target);
    }, { threshold: [0.25, 0.4, 0.55, 0.7] });

    sections.forEach(s => io.observe(s));
  }

  function initNavToggle() {
    if (!navToggle || !navList) return;

    navToggle.addEventListener("click", () => {
      const isOpen = navList.classList.toggle("show");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    // Close menu when clicking a link
    const links = Array.from(navList.querySelectorAll("a"));
    links.forEach(a => {
      a.addEventListener("click", () => {
        navList.classList.remove("show");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  function initYear() {
    const el = document.getElementById("year");
    if (!el) return;
    el.textContent = String(new Date().getFullYear());
  }

  function init() {
    initReveal();
    initKeyPanelSync();
    initNavToggle();
    initYear();

    // Initial UI
    if (sections[0]) {
      setKeyPanel(sections[0]);
      setActiveNav(sections[0].id);
    }

    setScrollProgress();
    window.addEventListener("scroll", setScrollProgress, { passive: true });
  }

  init();
})();
