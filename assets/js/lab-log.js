/* =====================================================================
   Lab Log — 연구실 사람들의 소소하고 재미있는 소식 기록장.

   로그를 올리는 방법은 두 가지입니다. 하나만 쓰면 됩니다.

   ── 방법 1 (추천): 구글 시트 — 연구실 누구나 코드 없이 추가 ──────────────
     1) 구글 시트를 하나 만들고 첫 줄(헤더)에 세 칸을 적습니다:  date | event | emoji
     2) 그 아래로 한 줄씩 기록을 채웁니다. 예)
            date         event                         emoji
            2026-07-09   오늘 있었던 일을 한 문장으로      🎉
     3) 구글 시트 메뉴 [파일] → [공유] → [웹에 게시] → 형식을 'CSV' 로 선택 → 게시.
        나오는 링크(...&output=csv)를 아래 SHEET_CSV_URL 에 붙여넣습니다.
     이후로는 시트에 줄만 추가하면 홈페이지가 새로고침될 때 자동 반영됩니다.
     (emoji 칸은 비워도 됩니다. 날짜는 "YYYY-MM-DD", 일자를 모르면 "YYYY-MM" 도 OK.)

   ── 방법 2: 아래 LAB_LOG 배열 직접 편집 ──────────────────────────────────
     시트를 안 쓰거나, 시트를 못 불러올 때(오프라인 등)를 위한 기본 목록입니다.
     { date: "2026-07-09", event: "한 문장", emoji: "🎉" } 처럼 한 줄 추가하면 됩니다.

   두 방법 모두 순서는 신경 쓰지 마세요 — 최신순 자동 정렬 + 연도별 자동 그룹핑.
   ===================================================================== */

// ▼ 구글 시트 '웹에 게시(CSV)' 링크를 여기에 붙여넣으세요. 비워두면 아래 LAB_LOG 를 씁니다.
const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRSWbJaHTvwIgIQiP2GjjrUyQJLmCgczh2YMv3YuCzx3mMR4fpoNnx38nDabmz8Y7JcI3RPpMdI3vtR/pub?output=csv";

// 시트를 못 불러오면 이 목록으로 폴백합니다 (그리고 방법 2를 쓸 때의 실제 데이터).
const LAB_LOG = [
  { date: "2026-07-08", event: "연구실 풋살 3파전에서 Woosub Choi가 3골을 기록", emoji: "⚽" },
  { date: "2026-05-15", event: "스승의 날 — 케이크와 함께 정경재 교수님께 감사 인사", emoji: "🎂" },
  { date: "2026-03-18", event: "Jumin Kwon 생일 — 연구실 단체 사진 각도 논쟁 발생", emoji: "🎈" },
  { date: "2026-03-04", event: "새 학기 시작. 화이트보드 완전 초기화 성공(3개월 만)", emoji: "🧹" },
  { date: "2026-02-02", event: "Woosub Choi, Jumin Kwon 학생이 연구실에 합류", emoji: "🎉" },
  { date: "2026-01-09", event: "MID Lab 2026년 첫 랩세미나", emoji: "🚀" },
];

/* ---------------------------------------------------------------------
   여기서부터는 데이터 로딩 + 화면 그리기 코드입니다. 로그만 추가할 거라면
   (시트 링크 넣기 / 배열 편집) 아래는 안 만져도 됩니다.
   --------------------------------------------------------------------- */

// 따옴표·쉼표·줄바꿈이 들어간 셀도 안전하게 처리하는 최소 CSV 파서.
const parseCsv = (text) => {
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

// CSV 행들을 { date, event, emoji } 로 변환. 헤더 이름(한/영)으로 열을 찾고,
// 헤더가 없으면 열 순서( date, event, emoji )로 해석한다.
const rowsToEntries = (rows) => {
  if (!rows.length) return [];
  const header = rows[0].map((c) => c.trim().toLowerCase());
  const find = (names) => header.findIndex((h) => names.some((n) => h.includes(n)));

  let di = find(["date", "날짜"]);
  let ei = find(["event", "사건", "내용"]);
  let mi = find(["emoji", "이모지", "아이콘"]);
  let body;

  if (di === -1 || ei === -1) {
    di = 0; ei = 1; mi = 2; // 헤더 없음 → 위치 기반, 첫 줄부터 데이터로 취급
    body = rows;
  } else {
    body = rows.slice(1);
  }

  return body
    .map((r) => ({
      date: (r[di] || "").trim(),
      event: (r[ei] || "").trim(),
      emoji: mi !== -1 ? (r[mi] || "").trim() : "",
    }))
    .filter((e) => e.date && e.event);
};

// 데이터 출처 결정: 시트 링크가 있으면 시트를, 실패하면 내장 LAB_LOG 로 폴백.
const loadEntries = async () => {
  if (!SHEET_CSV_URL) return LAB_LOG;
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(SHEET_CSV_URL, { signal: controller.signal, cache: "no-store" });
    clearTimeout(timer);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const parsed = rowsToEntries(parseCsv(await res.text()));
    return parsed.length ? parsed : LAB_LOG;
  } catch (err) {
    console.warn("[lab-log] 시트를 불러오지 못해 내장 목록을 사용합니다:", err);
    return LAB_LOG;
  }
};

/* =====================================================================
   V4 — "터미널 부팅 + Lab OS 콘솔" 렌더러.
   구조는 V3(콘솔 창 + 연도 로그파일 사이드바(탭) + 스트림 + 상태바), 스킨/피드는
   V1(그래파이트 tail -f 스트림: DATE │ EMOJI │ EVENT + 블록 커서). 진입 시엔
   짧은 터미널 부팅(명령 타이핑 → 창이 켜져 들어옴 → 로그 라인 스트리밍)이
   한 번 재생된다. 부팅은 순수 시각 레이어라 실제 콘텐츠는 즉시 DOM 에 있다.
   데이터 계약({ date, event, emoji? })·최신순 정렬·연도 그룹핑은 그대로.
   ===================================================================== */
(async () => {
  const mount = document.querySelector("[data-lab-log]");
  if (!mount) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---- 부팅: 히어로의 프롬프트에 명령을 타이핑한다 (시각 전용, 비차단) ----
  // 데이터 fetch 와 무관하게 곧바로 시작해 도착감을 살린다.
  const bootEl = document.querySelector("[data-term-boot]");
  const bootCmdEl = document.querySelector("[data-boot-cmd]");
  const runBootType = () => {
    if (!bootCmdEl) return Promise.resolve();
    const target = bootCmdEl.getAttribute("data-boot-target") || "";
    if (prefersReducedMotion) {
      bootCmdEl.textContent = target;
      bootEl && bootEl.classList.add("is-done");
      return Promise.resolve();
    }
    return new Promise((resolve) => {
      let i = 0;
      const step = () => {
        bootCmdEl.textContent = target.slice(0, i);
        i += 1;
        if (i <= target.length) {
          setTimeout(step, 30);
        } else {
          setTimeout(() => {
            bootEl && bootEl.classList.add("is-done");
            resolve();
          }, 140);
        }
      };
      step();
    });
  };
  const bootTyped = runBootType();

  const LOG_DATA = await loadEntries();

  // "YYYY-MM-DD" / "YYYY-MM" / "YYYY.MM.DD" 등 숫자 구분만 되면 모두 파싱한다.
  const parse = (raw) => {
    const [y, m = 0, d = 0] = String(raw).split(/\D+/).filter(Boolean).map(Number);
    return { y, m, d, key: y * 10000 + m * 100 + d };
  };

  // 데이터를 정규화하고 최신순 정렬. 원본 순서와 무관하게 항상 정렬된다.
  const entries = LOG_DATA
    .filter((item) => item && item.date && item.event)
    .map((item) => ({ ...item, when: parse(item.date) }))
    // 날짜에서 연도(숫자)를 못 뽑은 행(예: "TBD")은 버린다 — "undefined.log" 탭·NaN 정렬 방지.
    .filter((item) => Number.isFinite(item.when.y))
    .sort((a, b) => b.when.key - a.when.key);

  const pad = (n) => String(n).padStart(2, "0");
  // 로그 라인용 전체 타임스탬프. 일자를 모르면(YYYY-MM) 날짜만 찍는다.
  const stamp = (w) => (w.d ? `${w.y}-${pad(w.m)}-${pad(w.d)}` : `${w.y}-${pad(w.m)}`);

  // 연도별 그룹 (최신 연도 우선). 사이드바의 로그 '파일' 목록이 여기서 나온다.
  const years = [];
  const byYear = new Map();
  entries.forEach((entry) => {
    const y = entry.when.y;
    if (!byYear.has(y)) {
      byYear.set(y, []);
      years.push(y);
    }
    byYear.get(y).push(entry);
  });

  const escapeHtml = (str) =>
    String(str).replace(/[&<>"']/g, (ch) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    })[ch]);

  // 검색어를 이벤트 텍스트 안에서 강조(<mark>)한다.
  const highlight = (text, query) => {
    const safe = escapeHtml(text);
    if (!query) return safe;
    const q = query.toLowerCase();
    let out = "";
    let i = 0;
    const lower = text.toLowerCase();
    while (i < text.length) {
      const at = lower.indexOf(q, i);
      if (at === -1) {
        out += escapeHtml(text.slice(i));
        break;
      }
      out += escapeHtml(text.slice(i, at));
      out += `<mark>${escapeHtml(text.slice(at, at + q.length))}</mark>`;
      i = at + q.length;
    }
    return out;
  };

  // ---- 콘솔 창(window) 셸: 타이틀바 + 사이드바(탭) + 페인 + 상태바 ----
  const win = document.createElement("div");
  win.className = "labos" + (prefersReducedMotion ? "" : " is-booting");
  win.innerHTML = `
    <div class="labos-titlebar">
      <span class="labos-dots" aria-hidden="true"><i></i><i></i><i></i></span>
      <span class="labos-title">
        <span class="labos-title-file">lab-log.log</span>
        <span class="labos-title-sep" aria-hidden="true">—</span>
        <span class="labos-title-host">MID Lab</span>
      </span>
      <span class="labos-titlebar-spacer" aria-hidden="true"></span>
    </div>
    <div class="labos-body">
      <aside class="labos-side">
        <p class="labos-side-label" id="labos-files-label" aria-hidden="true">~/lab-log</p>
        <div class="labos-files" role="tablist" aria-orientation="vertical"
          aria-label="연도별 로그 파일"></div>
      </aside>
      <div class="labos-pane">
        <div class="labos-prompt">
          <span class="labos-prompt-sign" aria-hidden="true">grep</span>
          <label class="labos-vh" for="labos-search">로그 검색</label>
          <input id="labos-search" class="labos-search-input" type="search"
            placeholder="filter the feed…   ( / 로 포커스 )" autocomplete="off" spellcheck="false">
        </div>
        <div class="labos-feed" id="labos-feed" tabindex="0" role="tabpanel"
          aria-labelledby="labos-files-label"></div>
        <p class="labos-empty term-empty" hidden>grep: no matching lines in the log.</p>
      </div>
    </div>
    <div class="labos-status">
      <span class="labos-status-mode" aria-hidden="true"><span class="labos-status-dot"></span>tail -f</span>
      <span class="labos-status-count" role="status" aria-live="polite"></span>
      <span class="labos-caret" aria-hidden="true"></span>
    </div>
  `;
  mount.appendChild(win);

  const filesWrap = win.querySelector(".labos-files");
  const feed = win.querySelector(".labos-feed");
  const emptyState = win.querySelector(".labos-empty");
  const countEl = win.querySelector(".labos-status-count");
  const searchInput = win.querySelector(".labos-search-input");
  const footerCount = document.querySelector("[data-log-count]");

  // 사이드바 '파일' 탭: all.log + 각 연도 YYYY.log (ARIA tab 패턴).
  const files = [
    { label: "all.log", value: "all", count: entries.length },
    ...years.map((y) => ({ label: `${y}.log`, value: String(y), count: byYear.get(y).length })),
  ];
  files.forEach((file, idx) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "labos-file" + (idx === 0 ? " is-active" : "");
    btn.id = `labos-file-${file.value}`;
    btn.setAttribute("role", "tab");
    btn.setAttribute("aria-controls", "labos-feed");
    btn.setAttribute("aria-selected", idx === 0 ? "true" : "false");
    btn.tabIndex = idx === 0 ? 0 : -1;
    btn.dataset.year = file.value;
    btn.innerHTML = `
      <span class="labos-file-ico" aria-hidden="true">›</span>
      <span class="labos-file-name">${escapeHtml(file.label)}</span>
      <span class="labos-file-n">${file.count}</span>
    `;
    filesWrap.appendChild(btn);
  });

  // ---- 상태 ----
  let activeYear = "all";
  let query = "";

  // 갓 그린 로그 라인들을 순차적으로(빠르게) 드러낸다. reduced-motion이면 즉시.
  const REVEAL_CAP = 16;
  const revealLines = () => {
    const items = feed.querySelectorAll(".term-line");
    if (prefersReducedMotion) {
      items.forEach((el) => el.classList.add("is-in"));
      return;
    }
    items.forEach((el, i) => el.style.setProperty("--i", Math.min(i, REVEAL_CAP)));
    // 초기 opacity:0 이 먼저 페인트된 뒤 is-in 을 토글해야 전이가 재생된다.
    requestAnimationFrame(() =>
      requestAnimationFrame(() => items.forEach((el) => el.classList.add("is-in"))),
    );
  };

  // q 는 render 에서 이미 trim+lowercase 된 검색어 — 필터와 하이라이트가 같은 문자열을 쓰게 넘긴다.
  const lineHtml = (entry, q) => `
    <div class="term-line">
      <time class="tl-date" datetime="${escapeHtml(entry.date)}">${stamp(entry.when)}</time>
      <span class="tl-emoji" aria-hidden="true">${entry.emoji ? escapeHtml(entry.emoji) : ""}</span>
      <span class="tl-event">${highlight(entry.event, q)}</span>
    </div>`;

  // 연도 그룹을 피드에 그린다. all.log 에선 밴드 헤더를 붙이고, 특정 연도 파일
  // 에선(=이미 그 연도만 보므로) 헤더 없이 라인만 스트리밍한다.
  const renderYear = (year, q, withHeader) => {
    const matches = byYear.get(year).filter((e) => !q || e.event.toLowerCase().includes(q));
    if (!matches.length) return 0;

    if (withHeader) {
      const band = document.createElement("div");
      band.className = "term-band";
      band.innerHTML =
        `<span class="term-band-tag" aria-hidden="true">##</span>` +
        `<span class="term-band-year">${year}</span>` +
        `<span class="term-band-count">${matches.length} log${matches.length > 1 ? "s" : ""}</span>`;
      feed.appendChild(band);
    }

    const frag = document.createElement("div");
    frag.innerHTML = matches.map((e) => lineHtml(e, q)).join("");
    while (frag.firstElementChild) feed.appendChild(frag.firstElementChild);
    return matches.length;
  };

  const render = (doReveal = true) => {
    const q = query.trim().toLowerCase();
    feed.innerHTML = "";
    let shown = 0;

    if (activeYear === "all") {
      years.forEach((year) => { shown += renderYear(year, q, true); });
    } else {
      shown += renderYear(Number(activeYear), q, false);
    }

    // 스트림 끝에서 깜빡이는 블록 커서 — 라이브 tail 이 다음 줄을 기다리는 모습.
    if (shown > 0) {
      const caret = document.createElement("div");
      caret.className = "term-caret-line";
      caret.innerHTML =
        `<span class="tl-date tl-date-live" aria-hidden="true">tail -f</span>` +
        `<span class="term-cursor" aria-hidden="true">&#9619;</span>`;
      feed.appendChild(caret);
    }

    emptyState.hidden = shown !== 0;
    feed.hidden = shown === 0;

    const total = entries.length;
    countEl.textContent =
      shown === total ? `${total} lines · live` : `${shown} / ${total} lines`;
    if (footerCount) footerCount.textContent = `${shown}/${total} ln`;

    if (doReveal) revealLines();
  };

  // ---- 파일 탭 전환 (클릭 + 방향키, ARIA tab 패턴) ----
  const activateFile = (btn, focus) => {
    if (!btn) return;
    filesWrap.querySelectorAll(".labos-file").forEach((b) => {
      const on = b === btn;
      b.classList.toggle("is-active", on);
      b.setAttribute("aria-selected", on ? "true" : "false");
      b.tabIndex = on ? 0 : -1;
    });
    activeYear = btn.dataset.year;
    feed.setAttribute("aria-labelledby", btn.id);
    if (focus) btn.focus();
    render();
    feed.scrollTop = 0;
  };

  filesWrap.addEventListener("click", (e) => {
    const btn = e.target.closest(".labos-file");
    if (btn) activateFile(btn, false);
  });

  filesWrap.addEventListener("keydown", (e) => {
    const keys = ["ArrowDown", "ArrowUp", "ArrowRight", "ArrowLeft", "Home", "End"];
    if (!keys.includes(e.key)) return;
    e.preventDefault();
    const tabs = [...filesWrap.querySelectorAll(".labos-file")];
    const cur = filesWrap.querySelector(".labos-file.is-active");
    const idx = Math.max(0, tabs.indexOf(cur));
    let next = idx;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") next = (idx + 1) % tabs.length;
    else if (e.key === "ArrowUp" || e.key === "ArrowLeft") next = (idx - 1 + tabs.length) % tabs.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = tabs.length - 1;
    activateFile(tabs[next], true);
  });

  // ---- 검색 (grep) ----
  let debounce;
  searchInput.addEventListener("input", () => {
    clearTimeout(debounce);
    debounce = setTimeout(() => {
      query = searchInput.value;
      render();
    }, 120);
  });

  // "/" 로 검색창 포커스, Esc 로 지우기 — 소소한 파워유저 재미.
  document.addEventListener("keydown", (e) => {
    if (e.key === "/" && document.activeElement !== searchInput) {
      e.preventDefault();
      searchInput.focus();
    } else if (e.key === "Escape" && document.activeElement === searchInput) {
      searchInput.value = "";
      query = "";
      render();
      searchInput.blur();
    }
  });

  // 초기 활성 파일로 tabpanel 라벨을 맞춘다.
  const firstTab = filesWrap.querySelector(".labos-file.is-active");
  if (firstTab) feed.setAttribute("aria-labelledby", firstTab.id);

  // ---- 첫 렌더 + 부팅 시퀀스 ----
  if (prefersReducedMotion) {
    // 부팅 생략: 창은 이미 보이고 라인도 즉시 최종 상태.
    render(true);
  } else {
    // 부팅: 라인은 아직 숨긴 채로 그려두고(비어 있지 않게), 타이핑이 끝나면
    // 창을 켜 들여온 뒤 라인을 순차적으로 스트리밍한다.
    render(false);
    bootTyped.then(() => {
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          win.classList.remove("is-booting");
          revealLines();
        }),
      );
    });
  }
})();
