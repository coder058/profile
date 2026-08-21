(() => {
  const root = document.documentElement;
  const progress = document.querySelector(".page-progress span");
  const sections = [...document.querySelectorAll(".palette-section")];
  const reveals = [...document.querySelectorAll(".reveal")];
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  sections.forEach((section) => {
    section.style.setProperty("--section-bg", section.dataset.bg);
    section.style.setProperty("--section-ink", section.dataset.ink);
  });
  if (!reduced) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("in-view"));
    }, { threshold: 0.12 }); // GUESS: reveal threshold chosen for pacing; calibrate with user testing.
    reveals.forEach((item) => observer.observe(item));
  } else reveals.forEach((item) => item.classList.add("in-view"));
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
