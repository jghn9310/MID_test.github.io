/* Gallery interactions — the in-card photo rotators and the full-screen
   lightbox. Chrome, reveal and header behaviour come from team-page.js. */
const galleryReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Grouped cards (conference, teacher's day): one window that auto-advances and
   can also be stepped by the visitor. Auto-advance pauses on hover/focus and
   while the lightbox (which also sets body.nav-open) is open. */
const AUTO_ADVANCE_MS = 5000;

Array.from(document.querySelectorAll("[data-rotator]")).forEach((rotator) => {
  const slides = Array.from(rotator.querySelectorAll(".gallery-rotator-slide"));
  if (slides.length < 2) return;

  const dotsWrap = rotator.querySelector("[data-rotator-dots]");
  let index = Math.max(0, slides.findIndex((slide) => slide.classList.contains("is-active")));
  let timer = null;

  const dots = slides.map((_, i) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "gallery-rotator-dot";
    // Dots live in an aria-hidden wrapper and duplicate the prev/next arrows, so
    // keep them out of the tab order (mouse indicator only) — no focusable
    // controls inside aria-hidden. Keyboard users navigate via the arrows.
    dot.tabIndex = -1;
    dot.setAttribute("aria-label", `${i + 1}번째 사진 보기`);
    dot.addEventListener("click", () => {
      show(i);
      restart();
    });
    dotsWrap?.appendChild(dot);
    return dot;
  });

  const show = (next) => {
    index = (next + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      const isActive = i === index;
      slide.classList.toggle("is-active", isActive);
      slide.setAttribute("tabindex", isActive ? "0" : "-1");
      slide.setAttribute("aria-hidden", isActive ? "false" : "true");
      dots[i].classList.toggle("is-active", isActive);
    });
  };

  const stop = () => {
    if (timer) {
      window.clearInterval(timer);
      timer = null;
    }
  };

  const start = () => {
    if (galleryReducedMotion) return;
    stop();
    timer = window.setInterval(() => {
      if (document.body.classList.contains("nav-open")) return;
      show(index + 1);
    }, AUTO_ADVANCE_MS);
  };

  const restart = () => {
    stop();
    start();
  };

  rotator.querySelectorAll("[data-rotator-step]").forEach((button) => {
    button.addEventListener("click", () => {
      show(index + (button.dataset.rotatorStep === "prev" ? -1 : 1));
      restart();
    });
  });

  rotator.addEventListener("mouseenter", stop);
  rotator.addEventListener("mouseleave", start);
  rotator.addEventListener("focusin", stop);
  rotator.addEventListener("focusout", (event) => {
    if (rotator.contains(event.relatedTarget)) return;
    start();
  });

  show(index);
  start();
});

/* Lightbox — a single-window viewer over every gallery photo. */
const root = document.querySelector("[data-lightbox-root]");
const triggers = Array.from(document.querySelectorAll("[data-lightbox]"));

if (root && triggers.length) {
  const image = root.querySelector("[data-lightbox-image]");
  const caption = root.querySelector("[data-lightbox-caption]");
  const closeControls = Array.from(root.querySelectorAll("[data-lightbox-dismiss]"));
  const stepControls = Array.from(root.querySelectorAll("[data-lightbox-step]"));

  const slides = triggers.map((trigger) => {
    const img = trigger.querySelector("img");
    const figure = trigger.closest("figure");
    const title = figure?.querySelector(".gallery-caption-title")?.textContent?.trim() ?? "";
    const meta = figure?.querySelector(".gallery-caption-meta")?.textContent?.trim() ?? "";

    return {
      src: img?.getAttribute("src") ?? "",
      alt: img?.getAttribute("alt") ?? "",
      label: [title, meta].filter(Boolean).join(" · "),
    };
  });

  let current = 0;
  let lastFocused = null;

  const render = () => {
    const slide = slides[current];
    if (!slide) return;

    image.setAttribute("src", slide.src);
    image.setAttribute("alt", slide.alt);
    caption.textContent = slide.label;
  };

  const open = (index) => {
    current = index;
    lastFocused = document.activeElement;
    render();
    root.classList.add("is-open");
    root.setAttribute("aria-hidden", "false");
    document.body.classList.add("nav-open");
    stepControls.find((btn) => btn.dataset.lightboxStep === "next")?.focus();
  };

  const close = () => {
    root.classList.remove("is-open");
    root.setAttribute("aria-hidden", "true");
    document.body.classList.remove("nav-open");
    if (lastFocused instanceof HTMLElement) lastFocused.focus();
  };

  const step = (delta) => {
    current = (current + delta + slides.length) % slides.length;
    render();
  };

  triggers.forEach((trigger, index) => {
    trigger.addEventListener("click", () => open(index));
  });

  closeControls.forEach((control) => control.addEventListener("click", close));

  stepControls.forEach((control) => {
    control.addEventListener("click", () => {
      step(control.dataset.lightboxStep === "prev" ? -1 : 1);
    });
  });

  window.addEventListener("keydown", (event) => {
    if (!root.classList.contains("is-open")) return;

    if (event.key === "Escape") close();
    else if (event.key === "ArrowLeft") step(-1);
    else if (event.key === "ArrowRight") step(1);
    else if (event.key === "Tab") {
      // Trap keyboard focus inside the dialog while it is open. aria-modal keeps
      // screen readers out of the background; this keeps Tab from escaping too.
      const focusable = Array.from(root.querySelectorAll("button"));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      if (event.shiftKey && (active === first || !root.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (active === last || !root.contains(active))) {
        event.preventDefault();
        first.focus();
      }
    }
  });
}
