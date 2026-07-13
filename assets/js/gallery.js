/* Gallery cards are pre-rendered from the validated local snapshot.
   This file adds carousel and lightbox behavior without importing or rendering data. */
(() => {
  "use strict";

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const safeImageUrl = window.MidSecurity?.safeImageUrl;
  const autoAdvanceMs = 5000;

  const initRotators = () => {
    document.querySelectorAll("[data-rotator]").forEach((rotator) => {
      const slides = Array.from(rotator.querySelectorAll(".gallery-rotator-slide"));
      if (slides.length < 2) return;

      const dotsWrap = rotator.querySelector("[data-rotator-dots]");
      let index = Math.max(0, slides.findIndex((slide) => slide.classList.contains("is-active")));
      let timer = null;

      const show = (next) => {
        index = (next + slides.length) % slides.length;
        slides.forEach((slide, slideIndex) => {
          const active = slideIndex === index;
          slide.classList.toggle("is-active", active);
          slide.setAttribute("tabindex", active ? "0" : "-1");
          slide.setAttribute("aria-hidden", String(!active));
        });
        dots.forEach((dot, dotIndex) => dot.classList.toggle("is-active", dotIndex === index));
      };

      const stop = () => {
        if (timer !== null) {
          window.clearInterval(timer);
          timer = null;
        }
      };

      const start = () => {
        if (reducedMotion) return;
        stop();
        timer = window.setInterval(() => {
          if (!document.hidden && !document.body.classList.contains("lightbox-open")) show(index + 1);
        }, autoAdvanceMs);
      };

      const restart = () => {
        stop();
        start();
      };

      const dots = slides.map((_, dotIndex) => {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = "gallery-rotator-dot";
        dot.tabIndex = -1;
        dot.setAttribute("aria-label", `${dotIndex + 1}번째 사진 보기`);
        dot.addEventListener("click", () => {
          show(dotIndex);
          restart();
        });
        dotsWrap?.appendChild(dot);
        return dot;
      });

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
        if (!rotator.contains(event.relatedTarget)) start();
      });

      show(index);
      start();
    });
  };

  const initLightbox = () => {
    const root = document.querySelector("[data-lightbox-root]");
    const image = root?.querySelector("[data-lightbox-image]");
    const avifSource = root?.querySelector("[data-lightbox-source-avif]");
    const webpSource = root?.querySelector("[data-lightbox-source-webp]");
    const caption = root?.querySelector("[data-lightbox-caption]");
    if (!root || !image || !avifSource || !webpSource || !caption || typeof safeImageUrl !== "function") return;

    const triggers = Array.from(document.querySelectorAll("[data-lightbox]"));
    const slides = triggers.map((trigger) => {
      const source = trigger.querySelector("img");
      const figure = trigger.closest("figure");
      const title = figure?.querySelector(".gallery-caption-title")?.textContent?.trim() || "";
      const meta = figure?.querySelector(".gallery-caption-meta")?.textContent?.trim() || "";
      const fallback = safeImageUrl(trigger.dataset.lightboxFallback || "");
      const avif = safeImageUrl(trigger.dataset.lightboxAvif || "");
      const webp = safeImageUrl(trigger.dataset.lightboxWebp || "");
      const width = Number.parseInt(trigger.dataset.lightboxWidth || "", 10);
      const height = Number.parseInt(trigger.dataset.lightboxHeight || "", 10);
      return {
        fallback,
        avif,
        webp,
        width: Number.isInteger(width) && width > 0 && width <= 4096 ? width : 1600,
        height: Number.isInteger(height) && height > 0 && height <= 4096 ? height : 1200,
        alt: source?.getAttribute("alt") || "",
        label: [title, meta].filter(Boolean).join(" · "),
        trigger,
      };
    }).filter((slide) => slide.fallback && slide.avif && slide.webp);

    if (!slides.length) return;

    let current = 0;
    let lastFocused = null;

    const render = () => {
      const slide = slides[current];
      avifSource.setAttribute("srcset", slide.avif);
      webpSource.setAttribute("srcset", slide.webp);
      image.setAttribute("src", slide.fallback);
      image.setAttribute("alt", slide.alt);
      image.setAttribute("width", String(slide.width));
      image.setAttribute("height", String(slide.height));
      caption.textContent = slide.label;
    };

    const open = (index) => {
      current = index;
      lastFocused = document.activeElement;
      render();
      root.classList.add("is-open");
      root.setAttribute("aria-hidden", "false");
      document.body.classList.add("lightbox-open");
      root.querySelector(".lightbox-close")?.focus();
    };

    const close = () => {
      root.classList.remove("is-open");
      root.setAttribute("aria-hidden", "true");
      document.body.classList.remove("lightbox-open");
      if (lastFocused instanceof HTMLElement) lastFocused.focus();
    };

    const step = (delta) => {
      current = (current + delta + slides.length) % slides.length;
      render();
    };

    slides.forEach((slide, index) => {
      slide.trigger.addEventListener("click", () => open(index));
    });

    root.querySelectorAll("[data-lightbox-dismiss]").forEach((control) => {
      control.addEventListener("click", close);
    });

    root.querySelectorAll("[data-lightbox-step]").forEach((control) => {
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
        const controls = Array.from(root.querySelectorAll("button"));
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (!first || !last) return;
        if (event.shiftKey && (document.activeElement === first || !root.contains(document.activeElement))) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && (document.activeElement === last || !root.contains(document.activeElement))) {
          event.preventDefault();
          first.focus();
        }
      }
    });
  };

  initRotators();
  initLightbox();
})();
