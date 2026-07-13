/* =====================================================================
   News — 소식. 다른 페이지처럼 "구글 시트"로 관리합니다.
   (뉴스 페이지 전체 목록 + 홈 메인의 최신 3개에 함께 반영됩니다.)

   ── 소식을 추가/수정하는 방법 (코드 필요 없음) ──────────────────────────
     구글 시트에 한 줄을 추가하고 네 칸을 채웁니다:
         날짜        | 태그          | 제목                    | 내용
         2026.07     | Award         | 우수논문상 수상          | 한두 문장으로 소식을 설명.
     저장하면 끝. 홈페이지가 새로고침될 때 자동 반영됩니다.

   ── 알아두면 좋은 것 ───────────────────────────────────────────────────
     • 맨 위 줄이 최신입니다. 새 소식은 시트 '맨 위'에 추가하세요.
       (홈 메인에는 맨 위 3개가 보이고, 뉴스 페이지에는 전체가 보입니다.)
     • '태그'는 Award / Graduation / Research Grant / In the Media 등 자유롭게.
       비우면 태그 없이 표시됩니다.
     • '내용'은 비워도 됩니다(제목만 표시).
     • 줄이 하나도 없으면 뉴스 페이지는 '준비 중' 안내를 보여줍니다.

   ── 구글 시트를 CSV로 '웹에 게시' 하고 아래 링크에 붙여넣기 ────────────────
     [파일] → [공유] → [웹에 게시] → 이 시트 선택 → 형식 'CSV' → 게시.
     나오는 링크(...output=csv)를 아래 NEWS_CSV_URL 에 붙여넣으세요.
     비워두면 아래 NEWS 목록(현재 = 빈 소식 3개)을 대신 씁니다.
   ===================================================================== */

// ▼ 구글 시트 '웹에 게시(CSV)' 링크를 여기에 붙여넣으세요. 비우면 아래 NEWS 를 씁니다.
const NEWS_CSV_URL = "";

// 시트를 못 불러오면(또는 링크를 안 넣었으면) 이 목록으로 그립니다.
// 지금은 '빈 소식 3개'입니다. 시트를 연결하거나 아래 값을 채우면 됩니다.
// { date: 날짜, tag: 태그, title: 제목, body: 내용 }
const NEWS = [
  { date: "", tag: "", title: "", body: "" },
  { date: "", tag: "", title: "", body: "" },
  { date: "", tag: "", title: "", body: "" },
];

/* ---------------------------------------------------------------------
   여기서부터는 데이터 로딩 + 화면 그리기 코드입니다. 소식만 고칠 거라면
   (시트 링크 넣기 / NEWS 편집) 아래는 안 만져도 됩니다.
   --------------------------------------------------------------------- */

const escapeNewsHtml = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

// 따옴표·쉼표·줄바꿈이 들어간 셀도 안전하게 처리하는 최소 CSV 파서.
const parseNewsCsv = (text) => {
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
  return rows;
};

// 시트 행 → 소식 목록. 헤더 줄과 완전히 빈 줄은 건너뜁니다.
const rowsToNews = (rows) => {
  const out = [];
  rows.forEach((r, i) => {
    const date = (r[0] || "").trim();
    const tag = (r[1] || "").trim();
    const title = (r[2] || "").trim();
    const body = (r[3] || "").trim();
    if (i === 0 && /날짜|date/i.test(date) && /제목|title/i.test(title)) return; // 헤더
    if (!date && !tag && !title && !body) return; // 빈 줄
    out.push({ date, tag, title, body });
  });
  return out;
};

// 빈 소식(내용이 아직 없는 항목)은 '작성 형식'을 보여주는 정돈된 자리표시로 그립니다.
const PH_DATE = "0000년 00월 00일";
const isEmptyNews = (n) => !n.date && !n.tag && !n.title && !n.body;

// muted 색 + 은은한 자리표시 스타일
const phTime = `<time style="color:var(--muted);letter-spacing:0.02em;">${PH_DATE}</time>`;
const phTag =
  '<span class="news-tag" style="color:var(--muted);border-style:dashed;">예정</span>';

// 뉴스 페이지 한 줄
const newsEntryHtml = (n) => {
  if (isEmptyNews(n)) {
    return (
      '<article class="news-entry" style="opacity:0.85;">' +
        `<div class="news-entry-meta">${phTime}${phTag}</div>` +
        '<div class="news-entry-body">' +
          '<h3 style="color:var(--muted);font-weight:500;">새로운 소식을 준비하고 있습니다</h3>' +
          '<p style="color:var(--muted);">연구실의 새로운 소식을 이곳에서 순차적으로 전해드리겠습니다.</p>' +
        '</div>' +
      '</article>'
    );
  }
  const time = `<time>${escapeNewsHtml(n.date || PH_DATE)}</time>`;
  const tag = n.tag ? `<span class="news-tag">${escapeNewsHtml(n.tag)}</span>` : "";
  const body = n.body ? `<p>${escapeNewsHtml(n.body)}</p>` : "";
  return (
    '<article class="news-entry">' +
      `<div class="news-entry-meta">${time}${tag}</div>` +
      `<div class="news-entry-body"><h3>${escapeNewsHtml(n.title)}</h3>${body}</div>` +
    "</article>"
  );
};

// 뉴스 페이지 — 전체 목록(.news-list / .news-entry). 항목이 없으면 '준비 중' 안내.
const renderNewsFeed = (mount, items) => {
  if (!items.length) {
    mount.innerHTML =
      '<div class="news-empty">' +
        '<p class="news-empty-eyebrow">Coming soon</p>' +
        '<h2>The first stories are on their way.</h2>' +
        '<p class="news-empty-note">When the lab wins a new research grant, celebrates a graduation, receives an award, or appears in the press, it will be recorded here.</p>' +
        '<ul class="news-legend"><li>Research Grants</li><li>Graduations</li><li>Awards</li><li>In the Media</li></ul>' +
      '</div>';
    return;
  }
  mount.innerHTML = `<ol class="news-list">${items.map(newsEntryHtml).join("")}</ol>`;
};

// 홈 메인 한 줄 (time + h4)
const newsHomeHtml = (n) => {
  if (isEmptyNews(n)) {
    return (
      '<a href="board/news.html" style="opacity:0.85;">' +
        phTime +
        '<h4 style="color:var(--muted);font-weight:500;">새로운 소식 준비 중</h4>' +
      '</a>'
    );
  }
  const time = `<time>${escapeNewsHtml(n.date || PH_DATE)}</time>`;
  return `<a href="board/news.html">${time}<h4>${escapeNewsHtml(n.title)}</h4></a>`;
};

// 홈 메인 — 최신 3개. 클릭 시 뉴스 페이지로.
const renderNewsHome = (mount, items) => {
  const top = items.slice(0, 3);
  mount.innerHTML = top.length ? top.map(newsHomeHtml).join("") : "";
};

const loadNews = async () => {
  let items = NEWS; // 기본: 빈 소식 3개(placeholder)
  if (NEWS_CSV_URL) {
    try {
      const res = await fetch(NEWS_CSV_URL, { cache: "no-store" });
      if (res.ok) items = rowsToNews(parseNewsCsv(await res.text()));
    } catch (e) {
      items = NEWS; // 폴백 유지
    }
  }
  const feed = document.querySelector("[data-news]");
  if (feed) renderNewsFeed(feed, items);
  const home = document.querySelector("[data-news-home]");
  if (home) renderNewsHome(home, items);
};

loadNews();
