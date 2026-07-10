// Publications jump-nav fold: the jump nav shows only the recent years
// (In Prep, 2026, 2025, 2024); the older-year chips (2017-2023) fold behind an
// "Earlier" toggle so the nav stays compact. The body list is unaffected — every
// year is always shown there. Progressive enhancement: without JS the CSS keeps
// all chips visible and hides this toggle.
//
// Wrapped in an IIFE so its locals don't collide with team-page.js, which shares
// the same global scope and already declares e.g. `prefersReducedMotion`.
(() => {
  const page = document.querySelector(".pub-page");
  const toggles = Array.from(document.querySelectorAll("[data-archive-toggle]"));
  if (!page || !toggles.length) return;

  const setOpen = (isOpen) => {
    page.classList.toggle("is-archive-open", isOpen);

    toggles.forEach((toggle) => {
      toggle.setAttribute("aria-expanded", String(isOpen));

      const label = toggle.querySelector("[data-archive-label]");
      const next = isOpen ? toggle.dataset.labelOpen : toggle.dataset.labelClosed;
      if (label && next) label.textContent = next;
    });
  };

  toggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      setOpen(!page.classList.contains("is-archive-open"));
    });
  });
})();
