const navLinks = Array.from(document.querySelectorAll(".contents-nav a"));
const navGroups = Array.from(document.querySelectorAll(".nav-group"));
const futureLinks = Array.from(document.querySelectorAll("[data-future-link]"));
const animatedSections = Array.from(document.querySelectorAll(".content-section"));
const header = document.querySelector("[data-site-header]");
const heroImage = document.querySelector(".hero-image");
const scrollCue = document.querySelector("[data-scroll-cue]");
const galleryRotator = document.querySelector("[data-gallery-rotator]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const introSettleDelay = prefersReducedMotion ? 0 : 3800;
let scrollUpdateQueued = false;

const setNavGroupExpanded = (group, isExpanded) => {
  const trigger = group.querySelector(".nav-trigger");

  group.classList.toggle("is-open", isExpanded);
  trigger?.setAttribute("aria-expanded", String(isExpanded));
};

const closeNavGroups = () => {
  navGroups.forEach((group) => setNavGroupExpanded(group, false));
};

const setMobileMenu = (isOpen) => {
  document.body.classList.toggle("nav-open", isOpen);
  menuToggle?.setAttribute("aria-expanded", String(isOpen));
  menuToggle?.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");

  closeNavGroups();
};

window.requestAnimationFrame(() => {
  document.documentElement.classList.add("is-ready");
});

window.setTimeout(() => {
  document.documentElement.classList.add("is-intro-finished");
}, introSettleDelay);

animatedSections.forEach((section) => {
  section.classList.add("will-reveal");
});

navGroups.forEach((group) => {
  const trigger = group.querySelector(".nav-trigger");

  group.addEventListener("mouseenter", () => {
    if (document.body.classList.contains("nav-open")) return;

    setNavGroupExpanded(group, true);
  });
  group.addEventListener("mouseleave", () => {
    if (document.body.classList.contains("nav-open")) return;

    setNavGroupExpanded(group, false);
  });

  group.addEventListener("focusin", () => {
    if (document.body.classList.contains("nav-open")) return;

    setNavGroupExpanded(group, true);
  });
  group.addEventListener("focusout", (event) => {
    if (document.body.classList.contains("nav-open")) return;
    if (group.contains(event.relatedTarget)) return;

    setNavGroupExpanded(group, false);
  });

  trigger?.addEventListener("click", () => {
    // Desktop: click confirms the hovered group open. Mobile menu: tap toggles
    // this group as a collapsible accordion row, closing any other open group.
    const isMobileMenu = document.body.classList.contains("nav-open");
    const shouldOpen = isMobileMenu ? !group.classList.contains("is-open") : true;

    navGroups.forEach((navGroup) => {
      if (navGroup !== group) setNavGroupExpanded(navGroup, false);
    });
    setNavGroupExpanded(group, shouldOpen);
  });
});

navLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const href = link.getAttribute("href");

    // Real page links navigate normally now that their target pages exist.
    // Only empty in-page anchors are held back; links still marked
    // data-future-link are prevented by the futureLinks handler below.
    if (href === "#") {
      event.preventDefault();
    }

    closeNavGroups();
    setMobileMenu(false);
  });
});

futureLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    setMobileMenu(false);
  });
});

menuToggle?.addEventListener("click", () => {
  setMobileMenu(!document.body.classList.contains("nav-open"));
});

// Tap anywhere outside the open mobile menu (and outside its toggle) to dismiss it.
document.addEventListener("click", (event) => {
  if (!document.body.classList.contains("nav-open")) return;
  if (event.target.closest(".contents-nav")) return;
  if (event.target.closest("[data-menu-toggle]")) return;

  setMobileMenu(false);
});

// Whole Contact card acts as a link to the Contact page. Clicks on the inner
// email link keep their own behavior. Selecting text (e.g. copying the email)
// or dragging must NOT trigger navigation.
const contactCard = document.querySelector("[data-contact-card]");

if (contactCard) {
  const contactHref = contactCard.dataset.href;

  const openContact = () => {
    if (contactHref) window.location.href = contactHref;
  };

  let pressX = 0;
  let pressY = 0;

  contactCard.addEventListener("pointerdown", (event) => {
    pressX = event.clientX;
    pressY = event.clientY;
  });

  contactCard.addEventListener("click", (event) => {
    if (event.target.closest("a, button")) return;
    // Don't navigate while text is selected (copying the email address).
    if (window.getSelection && String(window.getSelection()).length > 0) return;
    // Don't navigate if the click was really the end of a drag/selection.
    if (Math.abs(event.clientX - pressX) > 6 || Math.abs(event.clientY - pressY) > 6) return;
    openContact();
  });

  contactCard.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    if (event.target.closest("a, button")) return;
    event.preventDefault();
    openContact();
  });
}

window.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;

  setMobileMenu(false);
  closeNavGroups();
});

scrollCue?.addEventListener("click", () => {
  document.getElementById("research")?.scrollIntoView({
    behavior: prefersReducedMotion ? "auto" : "smooth",
    block: "start",
  });
});

const initialHash = window.location.hash.slice(1);

if (initialHash) {
  const initialTarget = document.getElementById(decodeURIComponent(initialHash));

  window.requestAnimationFrame(() => {
    initialTarget?.scrollIntoView({ behavior: "auto", block: "start" });
  });
}

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    },
    {
      root: null,
      threshold: 0.08,
      rootMargin: "0px 0px -6% 0px",
    },
  );

  animatedSections.forEach((section) => revealObserver.observe(section));
} else {
  animatedSections.forEach((section) => section.classList.add("is-visible"));
}

const updateScrollState = () => {
  const scrollY = window.scrollY || window.pageYOffset;
  header?.classList.toggle("is-scrolled", scrollY > 24);
  scrollCue?.classList.toggle("is-hidden", scrollY > 120);

  if (heroImage && !prefersReducedMotion) {
    const shift = Math.max(-28, -scrollY * 0.035);
    heroImage.style.transform = `translate3d(${shift}px, 0, 0) scale(1.01)`;
  }
};

const requestScrollStateUpdate = () => {
  if (scrollUpdateQueued) return;

  scrollUpdateQueued = true;
  window.requestAnimationFrame(() => {
    updateScrollState();
    scrollUpdateQueued = false;
  });
};

window.addEventListener("scroll", requestScrollStateUpdate, { passive: true });
updateScrollState();

if (galleryRotator) {
  const gallerySlides = Array.from(galleryRotator.querySelectorAll("figure"));
  let activeGalleryIndex = gallerySlides.findIndex((slide) => slide.classList.contains("is-active"));

  if (activeGalleryIndex < 0) activeGalleryIndex = 0;

  const showGallerySlide = (nextIndex) => {
    if (!gallerySlides.length) return;

    gallerySlides[activeGalleryIndex].classList.remove("is-active");
    gallerySlides[activeGalleryIndex].setAttribute("aria-hidden", "true");

    activeGalleryIndex = (nextIndex + gallerySlides.length) % gallerySlides.length;

    gallerySlides[activeGalleryIndex].classList.add("is-active");
    gallerySlides[activeGalleryIndex].setAttribute("aria-hidden", "false");
  };

  gallerySlides.forEach((slide, index) => {
    const isActive = index === activeGalleryIndex;
    slide.classList.toggle("is-active", isActive);
    slide.setAttribute("aria-hidden", String(!isActive));
  });

  galleryRotator.addEventListener("click", (event) => {
    const stepButton = event.target.closest("[data-gallery-step]");

    if (!stepButton || !galleryRotator.contains(stepButton)) return;

    const direction = stepButton.dataset.galleryStep === "prev" ? -1 : 1;
    showGallerySlide(activeGalleryIndex + direction);
  });

  if (gallerySlides.length > 1 && !prefersReducedMotion) {
    galleryRotator.classList.add("is-running");

    window.setInterval(() => {
      showGallerySlide(activeGalleryIndex + 1);
    }, 4800);
  }
}
