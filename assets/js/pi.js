/* =====================================================================
   Principal Investigator — 교수 프로필. 다른 페이지처럼 "구글 시트"로 관리합니다.

   PI 페이지는 한 명의 프로필이라 여러 구역으로 나뉩니다. 그래서 시트의 첫 칸
   "구역" 으로 그 줄이 어디에 들어갈지 정합니다. 구역은 네 가지:

     • 기본정보(profile) — 이름/직함/이메일/구글스콜라/사진
     • 학력(education)   — 학위 이력 (기간 + 학위 + 상세)
     • 경력(experience)  — 경력 이력 (기간 + 직위 + 상세)
     • 수상(award)       — 수상/영예 목록 (연도 + 내용)

   ── 칸 구성 (네 칸) ────────────────────────────────────────────────────
        구역        | 기간/연도        | 제목                         | 상세 (여러 줄은 ; 로 구분)
        기본정보    |                  | 이름                         | Kyeongjae Jeong (정경재), Ph.D.
        기본정보    |                  | 사진                         | (구글 드라이브 공유링크)
        학력        | 2017.03 - 2022.08| Ph.D., Materials Sci. & Eng. | Seoul National Univ.; Supervisor: Prof. …
        수상        | 2024             | Postdoctoral Fellowship, …   |

     • 기본정보 줄: "제목"에 항목이름(이름/직함/이메일/스콜라/사진), "상세"에 값.
     • 학력·경력 줄: "상세"에 여러 줄을 세미콜론(;)으로 이으면 줄마다 표시됩니다.
     • 사진은 구글 '드라이브' 공유링크(구글 '포토'는 안 됨). 순서는 시트 순서대로.

   ── 구글 시트 CSV '웹에 게시' 링크를 아래 PI_CSV_URL 에 붙여넣기 ────────────
     비워두면 맨 아래 PI_DATA(현재 내용)를 씁니다.
   ===================================================================== */

// ▼ 구글 시트 '웹에 게시(CSV)' 링크. 비우면 아래 PI_DATA 를 씁니다.
const PI_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRfiszctkHJJDNnwJbHXGyDXWZN318DorVXc75E-rdzvh8EA9eaDWa2InMbToupjn9W2txpA4t-pgal/pub?gid=139209004&single=true&output=csv";

// 시트를 못 불러오면(또는 링크를 안 넣었으면) 이 내용으로 그립니다. = 현재 프로필.
const PI_DATA = [
  { section: "기본정보", date: "", title: "이름", detail: "Kyeongjae Jeong (정경재), Ph.D." },
  { section: "기본정보", date: "", title: "직함", detail: "Assistant Professor, SKKU" },
  { section: "기본정보", date: "", title: "이메일", detail: "k.jeong@skku.edu" },
  { section: "기본정보", date: "", title: "스콜라", detail: "https://scholar.google.com/citations?user=clSwqSwAAAAJ&hl=ko" },
  { section: "기본정보", date: "", title: "사진", detail: "../assets/img/people/kyeongjae-jeong.jpg" },

  { section: "학력", date: "2017.03 - 2022.08", title: "Ph.D., Materials Science and Engineering", detail: "Seoul National University, South Korea; Supervisor: Prof. Heung Nam Han; Thesis: Tensile Properties Extraction from Indentation Responses via Neural Networks" },
  { section: "학력", date: "2010.03 - 2017.02", title: "B.S., Materials Science and Engineering", detail: "Seoul National University, South Korea" },

  { section: "경력", date: "2025.03 - Present", title: "Assistant Professor", detail: "School of Advanced Materials Science and Engineering, Sungkyunkwan University, South Korea" },
  { section: "경력", date: "2023.05 - 2025.02", title: "Postdoctoral Research Associate", detail: "Department of Microstructure Physics and Alloy Design, Max Planck Institute for Iron Research, Germany; Advisor: Prof. Dierk Raabe and Prof. Franz Roters" },
  { section: "경력", date: "2022.09 - 2023.04", title: "Postdoctoral Research Associate", detail: "Research Institute of Advanced Materials, Seoul National University, South Korea; Advisor: Prof. Heung Nam Han" },

  { section: "수상", date: "2024.09 - 2025.02", title: "Postdoctoral Fellowship, Max Planck Society of Germany", detail: "" },
  { section: "수상", date: "2023.03 - 2025.02", title: "POSCO Science Fellowship (Post-doc), POSCO TJ Park Foundation", detail: "" },
  { section: "수상", date: "2022.09 - 2024.08", title: "Postdoctoral Fellowship, National Research Foundation of Korea", detail: "" },
  { section: "수상", date: "2022", title: "Excellent Ph.D. Thesis Award, Department of Materials Science and Engineering, Seoul National University", detail: "" },
  { section: "수상", date: "2022", title: "Outstanding Teaching Assistant Award, Department of Materials Science and Engineering, Seoul National University", detail: "" },
  { section: "수상", date: "2022", title: "Best Presentation Award, International Conference on Electronic Materials and Nanotechnology for Green Environment", detail: "" },
  { section: "수상", date: "2021", title: "Best Presentation Award, The Korean Institute of Metals and Materials", detail: "" },
  { section: "수상", date: "2019.09 - 2021.08", title: "Ph.D. Research Scholarship, National Research Foundation of Korea", detail: "" },
  { section: "수상", date: "2015", title: "Servant Leader Scholarship, Dongwon Foundation", detail: "" },
  { section: "수상", date: "2014", title: "Hoban Scholarship, Hoban Foundation", detail: "" },
];

/* ---------------------------------------------------------------------
   여기서부터는 데이터 로딩 + 화면 그리기 코드입니다. 내용만 고칠 거라면
   (시트 링크 넣기 / PI_DATA 편집) 아래는 안 만져도 됩니다.
   --------------------------------------------------------------------- */

const parsePiCsv = (text) => {
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
      } else { cell += ch; }
    } else if (ch === '"') { inQuotes = true; }
    else if (ch === ",") { row.push(cell); cell = ""; }
    else if (ch === "\n") { row.push(cell); rows.push(row); row = []; cell = ""; }
    else if (ch !== "\r") { cell += ch; }
  }
  if (cell !== "" || row.length) { row.push(cell); rows.push(row); }
  return rows.filter((r) => r.some((c) => c.trim() !== ""));
};

const rowsToPi = (rows) => {
  if (!rows.length) return [];
  const header = rows[0].map((c) => c.trim().toLowerCase());
  const find = (names) => header.findIndex((h) => names.some((n) => h.includes(n)));
  let si = find(["구역", "section", "구분", "분류"]);
  let di = find(["기간", "연도", "날짜", "date", "year"]);
  let ti = find(["제목", "항목", "title", "name"]);
  let xi = find(["상세", "내용", "detail", "value", "desc"]);
  let body;
  if (si === -1 || ti === -1) {
    si = 0; di = 1; ti = 2; xi = 3; body = rows;
  } else {
    body = rows.slice(1);
  }
  const at = (r, idx) => (idx !== -1 ? (r[idx] || "").trim() : "");
  return body
    .map((r) => ({ section: at(r, si), date: at(r, di), title: at(r, ti), detail: at(r, xi) }))
    .filter((e) => e.section && (e.title || e.detail));
};

const loadPi = async () => {
  if (!PI_CSV_URL) return PI_DATA;
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(PI_CSV_URL, { signal: controller.signal, cache: "no-store" });
    clearTimeout(timer);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const parsed = rowsToPi(parsePiCsv(await res.text()));
    return parsed.length ? parsed : PI_DATA;
  } catch (err) {
    console.warn("[pi] 시트를 불러오지 못해 내장 내용을 사용합니다:", err);
    return PI_DATA;
  }
};

const resolvePhoto = (raw) => {
  const url = String(raw || "").trim();
  if (!url) return "";
  if (!/^https?:\/\//i.test(url)) return url;
  if (/drive\.google\.com/i.test(url)) {
    const id = url.match(/\/d\/([-\w]{20,})/)?.[1] || url.match(/[?&]id=([-\w]{20,})/)?.[1];
    if (id) return `https://drive.google.com/thumbnail?id=${id}&sz=w1000`;
    return url;
  }
  if (/photos\.(app\.goo\.gl|google\.com)/i.test(url)) {
    console.warn("[pi] 구글 포토 링크는 띄울 수 없습니다. 드라이브 공유링크를 쓰세요:", url);
    return url;
  }
  return url;
};

const escapeHtml = (str) =>
  String(str).replace(/[&<>"']/g, (ch) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[ch]);

// 구역 이름을 표준 키로 정규화. 한/영 여러 표현을 허용한다.
const sectionKey = (raw) => {
  const s = String(raw).toLowerCase();
  if (/기본|프로필|profile|identity/.test(s)) return "profile";
  if (/학력|education|학위/.test(s)) return "education";
  if (/경력|experience|appoint|career/.test(s)) return "experience";
  if (/수상|award|honor|영예|scholarship/.test(s)) return "award";
  return "";
};

// 상세(detail)를 여러 줄로: 세미콜론 또는 줄바꿈으로 나눈다.
const detailLines = (detail) =>
  String(detail).split(/[;\n]/).map((s) => s.trim()).filter(Boolean);

// 학력/경력 타임라인 한 항목.
const timelineHtml = (e) => `
    <article>
      <time>${escapeHtml(e.date)}</time>
      <div>
        <h3>${escapeHtml(e.title)}</h3>
        ${detailLines(e.detail).map((line) => `<p>${escapeHtml(line)}</p>`).join("")}
      </div>
    </article>`;

/* ---- 렌더 ---- */
(async () => {
  const nameEl = document.querySelector("[data-pi-name]");
  const titleEl = document.querySelector("[data-pi-title]");
  const actionsEl = document.querySelector("[data-pi-actions]");
  const photoEl = document.querySelector("[data-pi-photo]");
  const eduEl = document.querySelector("[data-pi-education]");
  const expEl = document.querySelector("[data-pi-experience]");
  const awardEl = document.querySelector("[data-pi-awards]");
  if (!nameEl && !eduEl && !awardEl) return; // PI 페이지가 아님

  const rows = await loadPi();

  const buckets = { profile: [], education: [], experience: [], award: [] };
  rows.forEach((r) => {
    const key = sectionKey(r.section);
    if (key) buckets[key].push(r);
  });

  // ---- 기본정보(profile) ----
  let personName = "";
  const actions = [];
  buckets.profile.forEach((p) => {
    const field = p.title.toLowerCase();
    const value = p.detail.trim();
    if (!value) return;
    if (/이름|name/.test(field)) {
      personName = value;
      if (nameEl) nameEl.textContent = value;
    } else if (/직함|title|position/.test(field)) {
      if (titleEl) titleEl.textContent = value;
    } else if (/이메일|email|메일/.test(field)) {
      actions.push(`<a href="mailto:${escapeHtml(value)}">${escapeHtml(value)}</a>`);
    } else if (/스콜라|scholar|구글|google/.test(field)) {
      actions.push(`<a href="${escapeHtml(value)}" target="_blank" rel="noreferrer">Google Scholar</a>`);
    } else if (/사진|photo|image|이미지/.test(field)) {
      if (photoEl) {
        photoEl.setAttribute("src", resolvePhoto(value));
        photoEl.setAttribute("alt", personName || "Principal Investigator");
      }
    }
  });
  if (actionsEl && actions.length) actionsEl.innerHTML = actions.join("");
  if (photoEl && personName) photoEl.setAttribute("alt", personName);

  // ---- 학력 / 경력 ----
  if (eduEl) eduEl.innerHTML = buckets.education.map(timelineHtml).join("");
  if (expEl) expEl.innerHTML = buckets.experience.map(timelineHtml).join("");

  // ---- 수상 ----
  if (awardEl) {
    awardEl.innerHTML = buckets.award
      .map((a) => `<li>${a.date ? `<span>${escapeHtml(a.date)}</span>` : ""}${escapeHtml(a.title)}</li>`)
      .join("");
  }
})();
