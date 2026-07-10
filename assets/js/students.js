/* =====================================================================
   Students — 연구실 학생 명단. gallery/lab-log 와 똑같이 "구글 시트"로 관리합니다.

   ── 학생을 추가/수정하는 방법 (코드 필요 없음) ────────────────────────────
     1) (사진이 있으면) 구글 드라이브에 사진 업로드 → 우클릭 → [공유]
        → "링크가 있는 모든 사용자" → [링크 복사].
     2) 구글 시트에 한 줄 추가하고 여섯 칸을 채웁니다:
            구분        | 이름        | 과정                 | 분야            | 이메일            | 사진 링크
            대학원생    | 홍길동      | 석박사통합과정        | CALPHAD, 합금설계 | hong@g.skku.edu  | (1번 드라이브 링크)
     3) 저장하면 끝. 홈페이지가 새로고침될 때 자동 반영됩니다.

   ── 알아두면 좋은 것 ───────────────────────────────────────────────────
     • "구분"이 같은 줄끼리 한 묶음(섹션)으로 모입니다. 예) 대학원생 / 학부생.
       (Graduate Students / Undergraduate Students 처럼 영어로 적어도 됩니다.)
     • "분야"는 쉼표(,)로 여러 개를 적으면 각각 태그로 나옵니다. 예) FEM, 합금설계
     • 순서는 시트에 적은 순서 그대로. 사진·이메일·과정·분야는 비워도 됩니다.
     • 사진은 구글 '드라이브' 공유링크를 쓰세요. 구글 '포토' 링크는 안 됩니다.

   ── 구글 시트를 CSV로 '웹에 게시' 하고 아래 링크에 붙여넣기 ────────────────
     [파일] → [공유] → [웹에 게시] → 이 시트 선택 → 형식 'CSV' → 게시.
     나오는 링크(...output=csv)를 아래 STUDENTS_CSV_URL 에 붙여넣으세요.
     비워두면 맨 아래 STUDENTS 목록(현재 명단)을 대신 씁니다.
   ===================================================================== */

// ▼ 구글 시트 '웹에 게시(CSV)' 링크를 여기에 붙여넣으세요. 비우면 아래 STUDENTS 를 씁니다.
const STUDENTS_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRpMSt05TVacUYFaAdzn-cxhM6Ew63e504APbfx7o8thOZlG9lElvGi_fVob1rDeAbpRSQdvyzAXmEm/pub?gid=1608149247&single=true&output=csv";

// 시트를 못 불러오면(또는 링크를 안 넣었으면) 이 목록으로 그립니다. = 현재 명단.
const STUDENTS = [
  // 구분(group) · 이름(name) · 과정(course) · 분야(fields, 쉼표구분) · 이메일(email) · 사진(photo)
  { group: "Graduate Students", name: "Gangsan Kim", course: "MS and PhD Integrated Course", fields: "FEM, Structural Materials", email: "john6742@g.skku.edu", photo: "../assets/img/people/gangsan-kim.jpg" },
  { group: "Graduate Students", name: "Hoon Jeong", course: "MS and PhD Integrated Course", fields: "CALPHAD, Alloy Design", email: "jghn9310@g.skku.edu", photo: "../assets/img/people/hoon-jeong.png" },
  { group: "Graduate Students", name: "Giuk Song", course: "MS and PhD Integrated Course", fields: "FEM, Electronic Materials", email: "gwook4412@g.skku.edu", photo: "../assets/img/people/giuk-song.jpg" },
  { group: "Graduate Students", name: "Heeju Ahn", course: "MS Course", fields: "AI, Alloys", email: "hjahn8395@g.skku.edu", photo: "../assets/img/people/heeju-ahn.jpg" },
  { group: "Graduate Students", name: "Jumin Kwon", course: "MS and PhD Integrated Course", fields: "Alloy Design, Sintering", email: "kjm010622@g.skku.edu", photo: "../assets/img/people/jumin-kwon.jpg" },
  { group: "Graduate Students", name: "Woosub Choi", course: "MS and PhD Integrated Course", fields: "CPFEM, Alloy Design", email: "cws3450@g.skku.edu", photo: "../assets/img/people/woosub-choi.jpg" },
  { group: "Undergraduate Students", name: "Heemook Kang", course: "Undergraduate Research Course", fields: "FEM, Materials Informatics", email: "hmkangop@gmail.com", photo: "../assets/img/people/heemook-kang.jpg" },
];

/* ---------------------------------------------------------------------
   여기서부터는 데이터 로딩 + 화면 그리기 코드입니다. 명단만 고칠 거라면
   (시트 링크 넣기 / STUDENTS 편집) 아래는 안 만져도 됩니다.
   --------------------------------------------------------------------- */

// 따옴표·쉼표·줄바꿈이 들어간 셀도 안전하게 처리하는 최소 CSV 파서.
const parseStudentsCsv = (text) => {
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

// CSV 행들을 { group, name, course, fields, email, photo } 로 변환. 헤더 이름(한/영)
// 으로 열을 찾고, 헤더가 없으면 열 순서로 해석한다.
const rowsToStudents = (rows) => {
  if (!rows.length) return [];
  const header = rows[0].map((c) => c.trim().toLowerCase());
  const find = (names) => header.findIndex((h) => names.some((n) => h.includes(n)));

  let gi = find(["group", "구분", "분류", "섹션"]);
  let ni = find(["name", "이름", "성명"]);
  let ci = find(["course", "과정", "학위"]);
  let fi = find(["field", "분야", "관심", "topic"]);
  let ei = find(["email", "이메일", "메일"]);
  let pi = find(["photo", "사진", "link", "링크", "url", "image", "이미지"]);
  let body;

  if (gi === -1 || ni === -1) {
    gi = 0; ni = 1; ci = 2; fi = 3; ei = 4; pi = 5; // 헤더 없음 → 위치 기반
    body = rows;
  } else {
    body = rows.slice(1);
  }

  const at = (r, idx) => (idx !== -1 ? (r[idx] || "").trim() : "");
  return body
    .map((r) => ({
      group: at(r, gi),
      name: at(r, ni),
      course: at(r, ci),
      fields: at(r, fi),
      email: at(r, ei),
      photo: at(r, pi),
    }))
    .filter((e) => e.group && e.name);
};

// 데이터 출처 결정: 시트 링크가 있으면 시트를, 실패하면 내장 STUDENTS 로 폴백.
const loadStudents = async () => {
  if (!STUDENTS_CSV_URL) return STUDENTS;
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(STUDENTS_CSV_URL, { signal: controller.signal, cache: "no-store" });
    clearTimeout(timer);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const parsed = rowsToStudents(parseStudentsCsv(await res.text()));
    return parsed.length ? parsed : STUDENTS;
  } catch (err) {
    console.warn("[students] 시트를 불러오지 못해 내장 목록을 사용합니다:", err);
    return STUDENTS;
  }
};

// 사진 주소를 홈페이지에서 바로 띄울 수 있는 형태로 바꾼다. (gallery 와 동일 규칙)
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
    console.warn("[students] 구글 포토 링크는 띄울 수 없습니다. 드라이브 공유링크를 쓰세요:", url);
    return url;
  }
  return url;
};

const escapeHtml = (str) =>
  String(str).replace(/[&<>"']/g, (ch) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[ch]);

// 학생들을 구분(group)별로 묶는다. 그룹 순서·그룹 내 순서 모두 시트에 적힌 순서를 지킨다.
const groupStudents = (people) => {
  const groups = new Map();
  people.forEach((p) => {
    if (!groups.has(p.group)) groups.set(p.group, []);
    groups.get(p.group).push(p);
  });
  return [...groups.entries()].map(([group, members]) => ({ group, members }));
};

// 학생 카드 하나. 사진/이메일/과정/분야는 있을 때만 그린다.
const cardHtml = (p) => {
  const src = resolvePhoto(p.photo);
  const photo = src
    ? `<figure class="student-photo"><img src="${escapeHtml(src)}" alt="${escapeHtml(p.name)}" loading="lazy"></figure>`
    : "";
  const course = p.course ? `<p class="student-course">${escapeHtml(p.course)}</p>` : "";
  const tags = p.fields
    ? `<p class="student-fields">${p.fields.split(",").map((f) => f.trim()).filter(Boolean)
        .map((f) => `<span>${escapeHtml(f)}</span>`).join("")}</p>`
    : "";
  const email = p.email
    ? `<a class="student-email" href="mailto:${escapeHtml(p.email)}">${escapeHtml(p.email)}</a>`
    : "";
  return `
    <article class="student-card">
      ${photo}
      <div class="student-info">
        ${course}
        <h3>${escapeHtml(p.name)}</h3>
        ${tags}
        ${email}
      </div>
    </article>`;
};

// 구분(그룹) 하나 — 현재 정적 HTML 과 같은 구조/클래스.
const groupHtml = (block) => `
  <div class="roster-group">
    <div class="roster-heading">
      <h2>${escapeHtml(block.group)}</h2>
    </div>
    <div class="student-grid">${block.members.map(cardHtml).join("")}
    </div>
  </div>`;

/* ---- 첫 렌더 ---- */
(async () => {
  const mount = document.querySelector("[data-roster]");
  if (!mount) return;

  const blocks = groupStudents(await loadStudents());
  if (!blocks.length) {
    mount.innerHTML = `<p class="roster-empty">아직 등록된 구성원이 없습니다.</p>`;
    return;
  }
  mount.innerHTML = blocks.map(groupHtml).join("");
})();
