(() => {
  const root = document.documentElement;
  const progress = document.querySelector(".page-progress span");
  const sections = [...document.querySelectorAll(".palette-section")];
  sections.forEach((section) => {
    section.style.setProperty("--section-bg", section.dataset.bg);
    section.style.setProperty("--section-ink", section.dataset.ink);
  });
  let queued = false;
  const render = () => {
    const range = Math.max(1, document.documentElement.scrollHeight - innerHeight); // SOURCE: normalized document scroll range.
    if (progress) progress.style.transform = `scaleX(${Math.min(1, Math.max(0, scrollY / range))})`;
    const readingLine = innerHeight * 0.5; // SOURCE: viewport midpoint is the active reading region.
    const active = sections.find((section) => { const rect = section.getBoundingClientRect(); return rect.top <= readingLine && rect.bottom >= readingLine; });
    if (active) { root.style.setProperty("--bg", active.dataset.bg); root.style.setProperty("--ink", active.dataset.ink); }
    queued = false;
  };
  addEventListener("scroll", () => { if (!queued) { queued = true; requestAnimationFrame(render); } }, { passive: true });
  addEventListener("resize", render);
  render();
})();
