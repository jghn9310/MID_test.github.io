(() => {
  "use strict";

  const CONTROL_CHARACTERS = /[\u0000-\u001f\u007f]/;
  const HTTPS_DEFAULT_PORT = "443";
  const PUBLICATION_YEAR = /^(19|20)\d{2}$/;
  const PUBLICATION_STATUSES = new Map([
    ["in preparation", "In Preparation"],
    ["in prep", "In Preparation"],
    ["준비중", "In Preparation"],
  ]);
  const EMAIL = /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/i;

  const cleanInput = (value) => {
    const text = String(value ?? "").trim();
    if (!text || CONTROL_CHARACTERS.test(text) || text.startsWith("//") || text.includes("\\")) return "";
    return text;
  };

  const parseUrl = (value, baseUrl = document.baseURI) => {
    const text = cleanInput(value);
    if (!text) return null;
    try {
      const parsed = new URL(text, baseUrl);
      if (parsed.username || parsed.password) return null;
      let decodedPath;
      try {
        decodedPath = decodeURIComponent(`${parsed.pathname}${parsed.search}${parsed.hash}`);
      } catch (_) {
        return null;
      }
      if (CONTROL_CHARACTERS.test(decodedPath) || decodedPath.includes("\\")) return null;
      return parsed;
    } catch (_) {
      return null;
    }
  };

  const safeHttpsUrl = (value) => {
    const parsed = parseUrl(value);
    if (!parsed || parsed.protocol !== "https:") return "";
    if (parsed.port && parsed.port !== HTTPS_DEFAULT_PORT) return "";
    return parsed.href;
  };

  const safeMailtoUrl = (value) => {
    const text = cleanInput(value);
    if (!text || !text.toLowerCase().startsWith("mailto:")) return "";
    const address = text.slice(7);
    if (!EMAIL.test(address)) return "";
    return `mailto:${address}`;
  };

  const safeImageUrl = (value, allowedHttpsHosts = []) => {
    const text = cleanInput(value);
    const parsed = parseUrl(text);
    if (!parsed) return "";

    if (parsed.origin === window.location.origin) {
      const path = parsed.pathname.replace(/\/{2,}/g, "/");
      return path.includes("/assets/img/") ? parsed.href : "";
    }

    if (parsed.protocol !== "https:" || (parsed.port && parsed.port !== HTTPS_DEFAULT_PORT)) return "";
    const hosts = new Set(allowedHttpsHosts.map((host) => String(host).toLowerCase()));
    return hosts.has(parsed.hostname.toLowerCase()) ? parsed.href : "";
  };

  const normalizePublicationYear = (value) => {
    const text = String(value ?? "").trim();
    if (PUBLICATION_YEAR.test(text)) return text;
    return PUBLICATION_STATUSES.get(text.toLowerCase()) || "";
  };

  const publicationDomId = (value) => {
    const normalized = normalizePublicationYear(value);
    if (!normalized) return "";
    return normalized === "In Preparation" ? "in-preparation" : `y${normalized}`;
  };

  const hardenBlankLinks = (scope = document) => {
    scope.querySelectorAll('a[target="_blank"]').forEach((link) => {
      link.relList.add("noopener", "noreferrer");
      const href = link.getAttribute("href") || "";
      if (!safeHttpsUrl(href)) {
        link.removeAttribute("href");
        link.removeAttribute("target");
        link.setAttribute("aria-disabled", "true");
      }
    });
  };

  window.MidSecurity = Object.freeze({
    hardenBlankLinks,
    normalizePublicationYear,
    publicationDomId,
    safeHttpsUrl,
    safeImageUrl,
    safeMailtoUrl,
  });

  hardenBlankLinks();
})();
