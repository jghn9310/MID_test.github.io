/* Lab Log entries are pre-rendered from the validated local snapshot.
   JavaScript provides optional typing, filtering, and ARIA tab enhancement only. */
(() => {
  "use strict";

  const mount = document.querySelector("[data-lab-log]");
  if (!mount) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const boot = document.querySelector("[data-term-boot]");
  const bootCommand = document.querySelector("[data-boot-cmd]");
  const target = bootCommand?.dataset.bootTarget || "";

  if (bootCommand) {
    if (reducedMotion) {
      bootCommand.textContent = target;
      boot?.classList.add("is-done");
    } else {
      let index = 0;
      const typeNext = () => {
        bootCommand.textContent = target.slice(0, index);
        index += 1;
        if (index <= target.length) window.setTimeout(typeNext, 30);
        else boot?.classList.add("is-done");
      };
      typeNext();
    }
  }

  const files = Array.from(mount.querySelectorAll(".labos-file"));
  const lines = Array.from(mount.querySelectorAll(".term-line"));
  const bands = Array.from(mount.querySelectorAll(".term-band"));
  const feed = mount.querySelector(".labos-feed");
  const search = mount.querySelector(".labos-search-input");
  const empty = mount.querySelector(".labos-empty");
  const count = mount.querySelector(".labos-status-count");
  const footerCount = document.querySelector("[data-log-count]");
  let activeYear = "all";

  lines.forEach((line) => line.classList.add("is-in"));

  const render = () => {
    const query = search?.value.trim().toLowerCase() || "";
    let shown = 0;
    lines.forEach((line) => {
      const yearMatches = activeYear === "all" || line.dataset.year === activeYear;
      const textMatches = !query || (line.textContent || "").toLowerCase().includes(query);
      const visible = yearMatches && textMatches;
      line.hidden = !visible;
      if (visible) shown += 1;
    });

    bands.forEach((band) => {
      const year = band.dataset.year || "";
      const hasVisibleLine = lines.some((line) => line.dataset.year === year && !line.hidden);
      band.hidden = activeYear !== "all" || !hasVisibleLine;
    });

    if (empty) empty.hidden = shown !== 0;
    if (feed) feed.hidden = shown === 0;
    if (count) count.textContent = `${shown} / ${lines.length} lines`;
    if (footerCount) footerCount.textContent = `${shown}/${lines.length} ln`;
  };

  const activate = (button, focus = false) => {
    if (!button) return;
    files.forEach((candidate) => {
      const selected = candidate === button;
      candidate.classList.toggle("is-active", selected);
      candidate.setAttribute("aria-selected", String(selected));
      candidate.tabIndex = selected ? 0 : -1;
    });
    activeYear = button.dataset.year || "all";
    if (feed && button.id) feed.setAttribute("aria-labelledby", button.id);
    if (focus) button.focus();
    render();
    if (feed) feed.scrollTop = 0;
  };

  files.forEach((button) => {
    button.addEventListener("click", () => activate(button));
  });

  mount.querySelector(".labos-files")?.addEventListener("keydown", (event) => {
    const keys = ["ArrowDown", "ArrowUp", "ArrowRight", "ArrowLeft", "Home", "End"];
    if (!keys.includes(event.key) || !files.length) return;
    event.preventDefault();
    const current = Math.max(0, files.findIndex((button) => button.classList.contains("is-active")));
    let next = current;
    if (event.key === "ArrowDown" || event.key === "ArrowRight") next = (current + 1) % files.length;
    else if (event.key === "ArrowUp" || event.key === "ArrowLeft") next = (current - 1 + files.length) % files.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = files.length - 1;
    activate(files[next], true);
  });

  let debounce = null;
  search?.addEventListener("input", () => {
    window.clearTimeout(debounce);
    debounce = window.setTimeout(render, 120);
  });

  document.addEventListener("keydown", (event) => {
    if (!search) return;
    if (event.key === "/" && document.activeElement !== search) {
      event.preventDefault();
      search.focus();
    } else if (event.key === "Escape" && document.activeElement === search) {
      search.value = "";
      search.blur();
      render();
    }
  });

  activate(files.find((button) => button.classList.contains("is-active")) || files[0]);
})();
