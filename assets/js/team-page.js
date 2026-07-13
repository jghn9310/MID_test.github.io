const navGroups = Array.from(document.querySelectorAll(".nav-group"));
const futureLinks = Array.from(document.querySelectorAll("[data-future-link]"));
const revealBlocks = Array.from(document.querySelectorAll(".reveal-block"));
const header = document.querySelector("[data-site-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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

futureLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    setMobileMenu(false);
    closeNavGroups();
  });
});

document.querySelectorAll(".contents-nav a:not([data-future-link])").forEach((link) => {
  link.addEventListener("click", () => {
    setMobileMenu(false);
    closeNavGroups();
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

window.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;

  setMobileMenu(false);
  closeNavGroups();
});

if ("IntersectionObserver" in window && !prefersReducedMotion) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -8% 0px",
    },
  );

  revealBlocks.forEach((block) => revealObserver.observe(block));
} else {
  revealBlocks.forEach((block) => block.classList.add("is-visible"));
}

const updateScrollState = () => {
  const scrollY = window.scrollY || window.pageYOffset;
  header?.classList.toggle("is-scrolled", scrollY > 24);
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

// Added only after navigation and reveal observers are ready. Without a
// successful script run, the no-JS CSS path remains readable and navigable.
document.documentElement.classList.add("has-js");
