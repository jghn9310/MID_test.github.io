/* =====================================================================
   Gallery — 연구실 사진첩. lab-log 와 똑같이 "구글 시트"로 코드 없이 관리합니다.

   ── 사진을 올리는 방법 (아주 쉬움) ─────────────────────────────────────
     1) 구글 드라이브에 사진을 올립니다.
     2) 그 사진을 우클릭 → [공유] → "링크가 있는 모든 사용자" 로 바꾸고
        → [링크 복사].
     3) 구글 시트를 열어 한 줄 추가하고 다섯 칸을 채웁니다:
            모음        | 제목        | 날짜/이름   | 사진 링크(2번에서 복사)     | 설명(선택)
            연구실 일상 | 신입생 환영 | 2026.09     | https://drive.google.com/... | 신입생 환영회 사진
     4) 끝! 홈페이지는 새로고침되면 시트를 읽어 자동으로 그립니다.

   ── 알아두면 좋은 것 ───────────────────────────────────────────────────
     • "모음" 이 같은 줄끼리 한 묶음(섹션)으로 모입니다. (예: 연구실 일상 / 세미나·학회)
     • "제목" 과 "날짜/이름" 이 똑같은 줄을 여러 개 만들면 → 한 카드 안에서
       사진이 넘어가는 슬라이드(로테이터)가 됩니다. 서로 다르면 각각 다른 카드.
     • 순서는 시트에 적은 순서 그대로 나옵니다. 위로 옮기고 싶으면 시트에서 줄을 위로.
     • 사진 링크는 구글 드라이브 공유링크가 가장 편하지만, 인터넷에 있는
       이미지 주소(...jpg/.png)나 이 사이트 안의 경로(../assets/img/...)도 됩니다.
       ⚠ '구글 포토(photos.app.goo.gl)' 링크는 홈페이지에 못 띄웁니다 — 드라이브를 쓰세요.

   ── 구글 시트를 CSV로 '웹에 게시' 하고 아래 링크에 붙여넣기 ────────────────
     구글 시트 [파일] → [공유] → [웹에 게시] → 형식 'CSV' → 게시.
     나오는 링크(...&output=csv)를 아래 GALLERY_CSV_URL 에 붙여넣으세요.
     비워두면 맨 아래 GALLERY 목록(현재 사진)을 대신 씁니다.
   ===================================================================== */

// ▼ 구글 시트 '웹에 게시(CSV)' 링크를 여기에 붙여넣으세요. 비우면 아래 GALLERY 를 씁니다.
const GALLERY_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vT5W02_9mf3JsJj5cWmWSrkbyoWZHSFFgb3YYHIFFX8ukJfbXmQfe2EFBsf1z_l0U0Y-QwiKt2UoBVo/pub?gid=1078143835&single=true&output=csv";

// ▼ 표시 순서. true = 최신이 맨 위(역순): 시트 '맨 아래'에 새 사진을 추가하면
//   갤러리 제일 위에 나옵니다. false = 시트에 적힌 순서 그대로(맨 아래에 추가 → 맨 아래에 표시).
const NEWEST_FIRST = true;

// 시트를 못 불러오면(또는 링크를 안 넣었으면) 이 목록으로 그립니다.
// = 현재 홈페이지에 보이는 사진들. 시트를 쓰기 시작하면 이건 안전망으로만 남습니다.
const GALLERY = [
  // 모음(group) · 제목(title) · 날짜/이름(meta) · 사진(photo) · 설명(alt)
  { group: "Seminars & Conferences", title: "랩세미나", meta: "2026.05", photo: "../assets/img/gallery/gallery-lab-seminar.jpg", alt: "랩세미나 및 토론 모습" },
  { group: "Seminars & Conferences", title: "대한금속·재료학회 춘계학술대회", meta: "2026.04", photo: "../assets/img/gallery/gallery-spring-conference.jpg", alt: "대한금속·재료학회 춘계학술대회 현장" },
  { group: "Seminars & Conferences", title: "대한금속·재료학회 춘계학술대회", meta: "2026.04", photo: "../assets/img/gallery/gallery-conference-giuk-song.jpg", alt: "춘계학술대회 발표 — Giuk Song" },
  { group: "Seminars & Conferences", title: "대한금속·재료학회 춘계학술대회", meta: "2026.04", photo: "../assets/img/gallery/gallery-conference-gangsan-kim.jpg", alt: "춘계학술대회 발표 — Gangsan Kim" },

  { group: "Moments Together", title: "생일 축하", meta: "Jumin Kwon", photo: "../assets/img/gallery/gallery-jumin-kwon-birthday.jpg", alt: "Jumin Kwon 생일 축하 모습" },
  { group: "Moments Together", title: "스승의 날", meta: "2026.05", photo: "../assets/img/gallery/gallery-teachers-day.jpg", alt: "스승의 날 축하 모습" },
  { group: "Moments Together", title: "스승의 날", meta: "2026.05", photo: "../assets/img/gallery/gallery-teachers-day-cake.jpg", alt: "스승의 날 케이크" },
  { group: "Moments Together", title: "랩 일상", meta: "Giuk Song", photo: "../assets/img/gallery/gallery-giuk-song.jpg", alt: "Giuk Song 연구실 일상" },
  { group: "Moments Together", title: "랩 일상", meta: "Woosub Choi", photo: "../assets/img/gallery/gallery-woosub-choi.jpg", alt: "Woosub Choi 연구실 일상" },
  { group: "Moments Together", title: "생일 축하", meta: "Heemook Kang", photo: "../assets/img/gallery/gallery-heemook-kang-birthday.jpg", alt: "Heemook Kang 생일 축하 모습" },
  { group: "Moments Together", title: "생일 축하", meta: "Woosub Choi", photo: "../assets/img/gallery/gallery-woosub-birthday.png", alt: "Woosub Choi 생일 축하 모습" },
];

// 알려진 모음 이름에는 작은 영문 꼬리표(eyebrow)를 붙여 현재 디자인을 유지한다.
// 새 모음(시트에서 만든 이름)은 꼬리표 없이 제목만 깔끔하게 나온다.
const GROUP_KICKER = {
  "Seminars & Conferences": "Academic",
  "Moments Together": "Lab Life",
  "세미나·학회": "Academic",
  "연구실 일상": "Lab Life",
};

/* ---------------------------------------------------------------------
   여기서부터는 데이터 로딩 + 화면 그리기 코드입니다. 사진만 추가할 거라면
   (시트 링크 넣기 / GALLERY 편집) 아래는 안 만져도 됩니다.
   --------------------------------------------------------------------- */

const galleryReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// 따옴표·쉼표·줄바꿈이 들어간 셀도 안전하게 처리하는 최소 CSV 파서. (lab-log 와 동일)
const parseGalleryCsv = (text) => {
  const clean = String(text).replace(/^﻿/, "");
  const rows = [];
  let row = [];
  let cell = "";
  let inQuotes = false;

  for (let i = 0; i < clean.length; i++) {
    const ch = clean[i];
    if (inQuotes) {
      if (ch === '"') {
        if (clean[i + 1] === '"') { cell += '"'; i++; }
        else inQuotes = false;
      } else {
        cell += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      row.push(cell); cell = "";
    } else if (ch === "\n") {
      row.push(cell); rows.push(row); row = []; cell = "";
    } else if (ch !== "\r") {
      cell += ch;
    }
  }
  if (cell !== "" || row.length) { row.push(cell); rows.push(row); }

  return rows.filter((r) => r.some((c) => c.trim() !== ""));
};

// CSV 행들을 { group, title, meta, photo, alt } 로 변환. 헤더 이름(한/영)으로 열을
// 찾고, 헤더가 없으면 열 순서(모음, 제목, 날짜/이름, 사진, 설명)로 해석한다.
const rowsToPhotos = (rows) => {
  if (!rows.length) return [];
  const header = rows[0].map((c) => c.trim().toLowerCase());
  const find = (names) => header.findIndex((h) => names.some((n) => h.includes(n)));

  let gi = find(["group", "모음", "섹션", "분류"]);
  let ti = find(["title", "제목", "이름표", "카드"]);
  let mi = find(["meta", "날짜", "date", "이름", "name"]);
  let pi = find(["photo", "사진", "link", "링크", "url", "image", "이미지"]);
  let ai = find(["alt", "설명", "desc", "caption"]);
  let body;

  if (gi === -1 || ti === -1 || pi === -1) {
    gi = 0; ti = 1; mi = 2; pi = 3; ai = 4; // 헤더 없음 → 위치 기반, 첫 줄부터 데이터
    body = rows;
  } else {
    body = rows.slice(1);
  }

  return body
    .map((r) => ({
      group: (r[gi] || "").trim(),
      title: (r[ti] || "").trim(),
      meta: mi !== -1 ? (r[mi] || "").trim() : "",
      photo: (r[pi] || "").trim(),
      alt: ai !== -1 ? (r[ai] || "").trim() : "",
    }))
    .filter((e) => e.group && e.title && e.photo);
};

// 데이터 출처 결정: 시트 링크가 있으면 시트를, 실패하면 내장 GALLERY 로 폴백.
const loadPhotos = async () => {
  if (!GALLERY_CSV_URL) return GALLERY;
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(GALLERY_CSV_URL, { signal: controller.signal, cache: "no-store" });
    clearTimeout(timer);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const parsed = rowsToPhotos(parseGalleryCsv(await res.text()));
    return parsed.length ? parsed : GALLERY;
  } catch (err) {
    console.warn("[gallery] 시트를 불러오지 못해 내장 목록을 사용합니다:", err);
    return GALLERY;
  }
};

// 사진 주소를 홈페이지에서 바로 띄울 수 있는 형태로 바꾼다.
//  • 구글 드라이브 공유링크(어떤 형식이든) → 이미지로 직접 뜨는 thumbnail 주소로 변환.
//  • 구글 포토 링크는 못 띄우므로 경고만 남기고 그대로 둔다(비어 보이면 이 때문).
//  • 그 밖의 인터넷 이미지 주소·사이트 내부 경로는 그대로 사용.
const resolvePhoto = (raw) => {
  const url = String(raw || "").trim();
  if (!url) return "";
  if (!/^https?:\/\//i.test(url)) return url; // ../assets/... 같은 내부 경로

  if (/drive\.google\.com/i.test(url)) {
    const id = url.match(/\/d\/([-\w]{20,})/)?.[1] || url.match(/[?&]id=([-\w]{20,})/)?.[1];
    if (id) return `https://drive.google.com/thumbnail?id=${id}&sz=w1600`;
    return url;
  }
  if (/photos\.(app\.goo\.gl|google\.com)/i.test(url)) {
    console.warn("[gallery] 구글 포토 링크는 홈페이지에 띄울 수 없습니다. 드라이브 공유링크를 쓰세요:", url);
    return url;
  }
  return url; // 직접 이미지 URL
};

const escapeAttr = (str) =>
  String(str).replace(/[&<>"']/g, (ch) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[ch]);

// 사진들을 (모음 → 카드) 로 묶는다. 카드 키 = 제목+날짜/이름 (둘 다 같으면 한 카드에
// 사진이 쌓여 로테이터가 된다). 모음·카드·사진 모두 시트에 적힌 순서를 지킨다.
const groupPhotos = (photos) => {
  const groups = new Map(); // group -> Map(cardKey -> { title, meta, shots: [] })
  photos.forEach((p) => {
    if (!groups.has(p.group)) groups.set(p.group, new Map());
    const cards = groups.get(p.group);
    const key = `${p.title} ${p.meta}`;
    if (!cards.has(key)) cards.set(key, { title: p.title, meta: p.meta, shots: [] });
    cards.get(key).shots.push({ src: resolvePhoto(p.photo), alt: p.alt || p.title });
  });
  return [...groups.entries()].map(([group, cards]) => ({
    group,
    kicker: GROUP_KICKER[group] || "",
    cards: [...cards.values()],
  }));
};

// 카드 하나의 미디어(사진 1장 또는 로테이터) HTML.
const cardMediaHtml = (card) => {
  const shots = card.shots;
  if (shots.length === 1) {
    const s = shots[0];
    return `
      <button class="gallery-card-media" type="button" data-lightbox aria-label="사진 크게 보기: ${escapeAttr(card.title)}">
        <img src="${escapeAttr(s.src)}" alt="${escapeAttr(s.alt)}" loading="lazy">
      </button>`;
  }
  const slides = shots.map((s, i) => `
        <button class="gallery-rotator-slide${i === 0 ? " is-active" : ""}" type="button" data-lightbox aria-label="사진 크게 보기"${i === 0 ? "" : ' tabindex="-1" aria-hidden="true"'}>
          <img src="${escapeAttr(s.src)}" alt="${escapeAttr(s.alt)}" loading="lazy">
        </button>`).join("");
  return `
      <div class="gallery-card-media gallery-rotator" data-rotator aria-roledescription="carousel" aria-label="${escapeAttr(card.title)} 사진">${slides}
        <button class="gallery-rotator-arrow gallery-rotator-prev" type="button" data-rotator-step="prev" aria-label="이전 사진"><span aria-hidden="true">&#8249;</span></button>
        <button class="gallery-rotator-arrow gallery-rotator-next" type="button" data-rotator-step="next" aria-label="다음 사진"><span aria-hidden="true">&#8250;</span></button>
        <div class="gallery-rotator-dots" data-rotator-dots aria-hidden="true"></div>
      </div>`;
};

// 모음(섹션) 하나를 통째로 그린다 — 현재 정적 HTML 과 같은 구조/클래스.
const sectionHtml = (block, idx) => {
  const titleId = `gallery-group-${idx}`;
  const cards = block.cards.map((card) => `
          <li>
            <figure class="gallery-card">${cardMediaHtml(card)}
              <figcaption>
                <span class="gallery-caption-title">${escapeAttr(card.title)}</span>
                ${card.meta ? `<span class="gallery-caption-meta">${escapeAttr(card.meta)}</span>` : ""}
              </figcaption>
            </figure>
          </li>`).join("");
  return `
      <section class="gallery-group reveal-block" aria-labelledby="${titleId}">
        <div class="section-label">
          ${block.kicker ? `<p>${escapeAttr(block.kicker)}</p>` : ""}
          <h2 id="${titleId}">${escapeAttr(block.group)}</h2>
        </div>
        <ul class="gallery-grid" aria-label="${escapeAttr(block.group)} 사진">${cards}
        </ul>
      </section>`;
};

/* ---- 로테이터: 카드 안에서 사진이 자동으로 넘어가고, 화살표로도 넘긴다. ---- */
const AUTO_ADVANCE_MS = 5000;

const initRotators = (scope) => {
  Array.from(scope.querySelectorAll("[data-rotator]")).forEach((rotator) => {
    const slides = Array.from(rotator.querySelectorAll(".gallery-rotator-slide"));
    if (slides.length < 2) return;

    const dotsWrap = rotator.querySelector("[data-rotator-dots]");
    let index = Math.max(0, slides.findIndex((slide) => slide.classList.contains("is-active")));
    let timer = null;

    const dots = slides.map((_, i) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "gallery-rotator-dot";
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
};

/* ---- 라이트박스: 모든 갤러리 사진을 한 창에서 크게 보는 뷰어. ---- */
const initLightbox = () => {
  const root = document.querySelector("[data-lightbox-root]");
  const triggers = Array.from(document.querySelectorAll("[data-lightbox]"));
  if (!root || !triggers.length) return;

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
};

/* ---- 동적으로 넣은 섹션의 등장(reveal) 처리 ----
   team-page.js 의 IntersectionObserver 는 '로드 시점'의 .reveal-block 만 관찰하므로,
   여기서 새로 만든 섹션은 우리가 직접 관찰(스크롤 시 페이드인)해 준다. */
const initReveal = (blocks) => {
  if (galleryReducedMotion || !("IntersectionObserver" in window)) {
    blocks.forEach((b) => b.classList.add("is-visible"));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -8% 0px" },
  );
  blocks.forEach((b) => observer.observe(b));
};

/* ---- 첫 렌더 ---- */
(async () => {
  const mount = document.querySelector("[data-gallery]");
  if (!mount) return;

  const photos = await loadPhotos();
  const ordered = NEWEST_FIRST ? photos.slice().reverse() : photos;
  const blocks = groupPhotos(ordered);
  if (!blocks.length) {
    mount.innerHTML = `<p class="gallery-empty">아직 등록된 사진이 없습니다.</p>`;
    return;
  }

  mount.innerHTML = blocks.map(sectionHtml).join("");

  const sections = Array.from(mount.querySelectorAll(".gallery-group"));
  initReveal(sections);
  initRotators(mount);
  initLightbox();
})();
