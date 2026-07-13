/* Publications are pre-rendered from the validated local snapshot.
   JavaScript only enhances the archive toggle; it never imports or renders data. */
(() => {
  "use strict";

  const page = document.querySelector(".pub-page");
  const toggle = document.querySelector("[data-archive-toggle]");
  if (!page || !toggle) return;

  const label = toggle.querySelector("[data-archive-label]");
  const setOpen = (open) => {
    page.classList.toggle("is-archive-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    const nextLabel = open ? toggle.dataset.labelOpen : toggle.dataset.labelClosed;
    if (label && nextLabel) label.textContent = nextLabel;
  };

  toggle.addEventListener("click", () => {
    setOpen(!page.classList.contains("is-archive-open"));
  });
})();
