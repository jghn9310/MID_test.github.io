/* =====================================================================
   Publications — 논문 목록. 다른 페이지처럼 "구글 시트"로 관리합니다.

   ── 시트 칸 구성 (다섯 칸) ─────────────────────────────────────────────
        연도    | 제목                     | 저자                          | 게재정보(저널)                       | 링크
        2026    | Phase stability in …     | H. Choi, …, K. Jeong, …*      | Acta Materialia, 311, 122167 (2026) | https://…
        준비중  | Robust deep learning …   |                               |                                     |

   ── 규칙 ───────────────────────────────────────────────────────────────
     • 시트는 "오래된 논문이 맨 위" 순서로 둡니다. 새 논문은 시트 맨 아래에 추가하세요.
       → 번호(1,2,3,…)는 시트 순서대로 자동으로 매겨집니다(직접 안 적어도 됨).
       → 화면에는 최신이 먼저 보이도록 자동 정렬됩니다(In Prep → 2026 → … → 2017).
     • "연도"에 숫자(2026 등)를 적으면 그 해에, "준비중"/"In Preparation" 을 적으면
       In Preparation 묶음에 들어갑니다(준비중 줄은 저자·저널·링크를 비워도 됨).
     • 저자: "K. Jeong" 은 자동으로 굵게 표시됩니다. 공동1저자는 이름 뒤에 †,
       교신저자는 * 를 붙이세요(예: H. N. Han*  또는  S.-G. Kang†,*). 자동으로 위첨자 처리됩니다.
     • 게재정보: 저널명 뒤에 쉼표를 찍고 권/페이지/연도를 적으면 저널명이 자동으로 이탤릭이 됩니다.
       예) Acta Materialia, 311, 122167 (2026)

   ── 구글 시트 CSV '웹에 게시' 링크를 아래 PUB_CSV_URL 에 붙여넣기 ────────────
     비워두면 맨 아래 PUB(현재 목록)을 씁니다.
   ===================================================================== */

// ▼ 구글 시트 '웹에 게시(CSV)' 링크. 비우면 아래 PUB 를 씁니다.
const PUB_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vS4bqiWWp14gHcu6XciQUj-7ZuY1ZKuPr4ouJV2b0LFb1zAQgp6eYyxb7B3o1gwXcUzBM6_PvcxJrL1/pub?gid=476923046&single=true&output=csv";

// 시트를 못 불러오면(또는 링크를 안 넣었으면) 이 목록으로 그립니다. = 현재 논문 목록.
// (오래된 것 → 최신 순. 화면 표시는 코드가 최신 먼저로 뒤집습니다.)
const PUB = [
  { year: "2017", title: "Effect of cooling rate on the microstructure and mechanical properties of Fe-Mn-Al-C light-weight steels", authors: "J. Y. Park, S.-J. Park, J.-H. Lee, J. Moon, T.-H. Lee, K. Jeong, H. N. Han, J.-H. Shin*", venue: "Korean Journal of Metals and Materials, 55, 825–835 (2017)", url: "http://kjmm.org/journal/view.php?number=239" },
  { year: "2019", title: "Effect of pulsed electric current on TRIP-aided steel", authors: "H.-J. Jeong, J.-W. Park, K. Jeong, N. M. Hwang, S.-T. Hong, H. N. Han*", venue: "International Journal of Precision Engineering and Manufacturing-Green Technology, 6, 315–327 (2019)", url: "https://link.springer.com/article/10.1007/s40684-019-00060-1" },
  { year: "2020", title: "Microstructures and mechanical properties of austenitic light-weight steels, and prediction of property distribution in large-scale slab", authors: "T.-H. Kim, Y.-S. Choi, K.-W. Kim, S.-J. Park, J. Y. Park, K. Jeong, H. N. Han, J.-H. Shin*", venue: "Korean Journal of Metals and Materials, 58, 830–842 (2020)", url: "http://kjmm.org/journal/view.php?doi=10.3365/KJMM.2020.58.12.830" },
  { year: "2020", title: "Integrated porous cobalt oxide/cobalt anode with micro- and nano-pores for lithium ion battery", authors: "H. Park, K. Kim, K. Jeong, J. S. Kang, H.-H. Cho, B. Thirumalraj, Y.-E. Sung, H. N. Han, J.-H. Kim, D. C. Dunand, H. Cho*", venue: "Applied Surface Science, 525, 146592 (2020)", url: "https://www.sciencedirect.com/science/article/pii/S0169433220313490" },
  { year: "2020", title: "A fully coupled diffusional-mechanical finite element modeling for tin oxide-coated copper anode system in lithium-ion batteries", authors: "K. Jeong†, H.-H. Cho†, H. N. Han*, D. C. Dunand*", venue: "Computational Materials Science, 172, 109343 (2020)", url: "https://www.sciencedirect.com/science/article/pii/S0927025619306421" },
  { year: "2020", title: "Prediction of uniaxial tensile flow using finite element-based indentation and optimized artificial neural networks", authors: "K. Jeong, H. Lee, O. M. Kwon, J. Jung, D. Kwon, H. N. Han*", venue: "Materials & Design, 196, 109104 (2020)", url: "https://www.sciencedirect.com/science/article/pii/S0264127520306390" },
  { year: "2021", title: "Prediction of precipitation kinetics and strengthening in FeMnAlC lightweight steels", authors: "J. Lee†, H. Kim†, K. Jeong, S.-J. Park, J. Moon, S.-G. Kang*, H. N. Han*", venue: "Journal of Materials Research and Technology, 14, 2897–2908 (2021)", url: "https://www.sciencedirect.com/science/article/pii/S2238785421009224" },
  { year: "2021", title: "Suppressing high-current-induced phase separation in Ni-rich layered oxides by electrochemically manipulating dynamic lithium distribution", authors: "H. Hyun, K. Jeong, H. Hong, S. Seo, B. Koo, D. Lee, S. Choi, S. Jo, K. Jung, H.-H. Cho, H. N. Han, T. J. Shin*, J. Lim*", venue: "Advanced Materials, 33, 2105337 (2021)", url: "https://advanced.onlinelibrary.wiley.com/doi/full/10.1002/adma.202105337" },
  { year: "2022", title: "Athermal glass work at nanoscale: engineered electron beam induced visco-plasticity for mechanical shaping of brittle amorphous silica", authors: "S.-G. Kang, K. Jeong, J. Paeng, J.-P. Ahn, S. Boles, H. N. Han*, I.-S. Choi*", venue: "Acta Materialia, 238, 118203 (2022)", url: "https://www.sciencedirect.com/science/article/pii/S1359645422005845" },
  { year: "2022", title: "Athermally enhanced recrystallization kinetics of ultra-low carbon steel via electric current treatment", authors: "K. Jeong†, S.-W. Jin†, S.-G. Kang, J.-W. Park, H.-J. Jeong, S.-T. Hong, S. H. Cho, M.-J. Kim*, H. N. Han*", venue: "Acta Materialia, 232, 117925 (2022)", url: "https://www.sciencedirect.com/science/article/pii/S135964542200307X" },
  { year: "2022", title: "Deep learning-based indentation plastometry in anisotropic materials", authors: "K. Jeong, K. Lee, S. Lee, S.-G. Kang, J. Jung, H. Lee, N. Kwak, D. Kwon, H. N. Han*", venue: "International Journal of Plasticity, 157, 103403 (2022)", url: "https://www.sciencedirect.com/science/article/pii/S0749641922001826" },
  { year: "2023", title: "A kinetic indicator of ultrafast nickel-rich layered oxide cathodes", authors: "J. Wang†,*, H. Hyun†, S. Seo†, K. Jeong, J. Han, S. Jo, H. Kim, B. Koo, D. Eum, J. Kim, J. Chung, H.-H. Cho, H. N. Han, T. J. Shin, M. Ni, K. Kang*, J. Lim*", venue: "ACS Energy Letters, 8, 2986–2995 (2023)", url: "https://pubs.acs.org/doi/full/10.1021/acsenergylett.3c00513" },
  { year: "2023", title: "New approach to hole-expansion ratio in complex phase and martensitic steels: understanding the role of punching damage", authors: "W. Cho†, B.-S. Jeong†, K. Jeong, S.-H. Lee, H. Kim, J. Lee, S.-I. Kim, H. N. Han*", venue: "Journal of Materials Research and Technology, 26, 837–849 (2023)", url: "https://www.sciencedirect.com/science/article/pii/S2238785423017829" },
  { year: "2023", title: "Improving thermal conductivity of reduced-activation ferritic/martensitic steel using three-dimensional woven copper fiber", authors: "Y. H. Cho, H. J. Yang, K. Jeong, C.-H. Lee, S.-J. Hong, W.-R. Yu, H. N. Han*", venue: "Fusion Engineering and Design, 197, 114079 (2023)", url: "https://www.sciencedirect.com/science/article/pii/S0920379623006592" },
  { year: "2024", title: "Bimodal structured chromium–tungsten composite as plasma-facing materials: sinterability, mechanical properties, and deuterium retention assessment", authors: "N. Kwak†, S.-G. Kang†, G. Min, R. Arredondo, K. Jeong, H. Kim, T. Schwarz-Selinger, M. Balden, A. Manhard, J.-H. You*, H. N. Han*", venue: "Acta Materialia, 262, 119453 (2024)", url: "https://www.sciencedirect.com/science/article/pii/S1359645423007838" },
  { year: "2024", title: "Development of functionally graded austenitic lightweight steel through electrically assisted pressure solid-state joining", authors: "S. Lee, J. Moon, H. Kim, Y. H. Cho, H. H. Lee, H. Choi, Y. Kim, D.-W. Suh, K. Jeong*, H. N. Han*", venue: "Materials Science and Engineering: A, 891, 146003 (2024)", url: "https://www.sciencedirect.com/science/article/pii/S0921509323014272" },
  { year: "2024", title: "Parameter determination of anisotropic yield function using neural network-based indentation plastometry", authors: "K. Jeong, K. Lee, D. Kwon, M.-G. Lee*, H. N. Han*", venue: "International Journal of Mechanical Sciences, 263, 108776 (2024)", url: "https://www.sciencedirect.com/science/article/pii/S0020740323006781" },
  { year: "2024", title: "Effect of the Ni plating on Al–Cu dissimilar metal laser welded joint", authors: "H.-M. Sung, S. Lee, D. Lee, H. Kim, S.-G. Kang, G.-D. Lee, K. Jeong*, H. N. Han*", venue: "Journal of Materials Research and Technology, 31, 2473–2483 (2024)", url: "https://www.sciencedirect.com/science/article/pii/S2238785424015606" },
  { year: "2025", title: "Copper lattice-embedded steel composite: one-step fabrication and its thermal and mechanical properties", authors: "Y. H. Cho†, D. Choi†, K. Jeong, Y. Kim, M. Park, S. Lee, H. Choi, I.-S. Choi, S.-G. Kang*, H. N. Han*", venue: "Journal of Materials Research and Technology, 37, 89–101 (2025)", url: "https://www.sciencedirect.com/science/article/pii/S2238785425014097" },
  { year: "2025", title: "Unexpected microstructural evolution of FeCrAl heat-resistant alloy under electrical heating: potential risks in industrial electrification", authors: "S. Lee†, Y. Kim†, K. Jeong, Y. H. Cho, H. Choi, S.-G. Kang, I.-H. Jung, H. Kim*, H. N. Han*", venue: "Materials & Design, 260, 115052 (2025)", url: "https://www.sciencedirect.com/science/article/pii/S026412752501473X" },
  { year: "2026", title: "Thermally activated migrating boundary-induced plasticity: mechanistic and predictive framework across atomistic-to-macroscopic scales", authors: "S. Sung, D. Choi, K. Jeong*, H. N. Han*", venue: "Acta Materialia, 304, 121806 (2026)", url: "https://www.sciencedirect.com/science/article/pii/S1359645425010936" },
  { year: "2026", title: "Indentation-informed convolutional neural network for simultaneous prediction of non-equibiaxial residual stress and plastic flow", authors: "M. Park, D. Chung, W. Woo, S. Oh, K. Jeong*, H. N. Han*", venue: "International Journal of Plasticity, 197, 104606 (2026)", url: "https://www.sciencedirect.com/science/article/pii/S074964192500364X" },
  { year: "2026", title: "Thermomechanics of picoliter liquids encapsulated in metal microarchitectures", authors: "S.-G. Kang†,*, K. Jeong†, B. Bellón, L. K. Bhaskar, L. S. Aota, J. Paeng, D. Sonawane, K. Ding, S.-H. Kim, A. Goetz, B. A. Zubiri, E. Spiecker, A. El-Zoka, B. Gault, G. Dehm, R. Ramachandramoorthy*", venue: "Advanced Materials, e15677 (2026)", url: "https://advanced.onlinelibrary.wiley.com/doi/10.1002/adma.202515677" },
  { year: "2026", title: "Phase stability in metals under electric current: the role of defect-induced charge imbalance", authors: "H. Choi, J. Chae, S. Lee, Y. Kim, T. Kim, I.-H. Jung, S. Yoo, Y.-K. Kwon, H. Chae, Y. Baik, W. Woo, K. Jeong, S.-G. Kang*, H. N. Han*", venue: "Acta Materialia, 311, 122167 (2026)", url: "https://www.sciencedirect.com/science/article/pii/S1359645426002739" },
  { year: "In Preparation", title: "Paradoxically retarded phase evolution by electrical athermal effect", authors: "", venue: "", url: "" },
  { year: "In Preparation", title: "Robust deep learning approach for determining parameters of crystal plasticity constitutive law from stress-strain curves", authors: "", venue: "", url: "" },
  { year: "In Preparation", title: "Effect of nitriding treatment on the surface gradient structure of Ti-based ceramic-metal composites", authors: "", venue: "", url: "" },
  { year: "In Preparation", title: "Identifiability analysis of parameters in advanced yield function via deep learning-based reverse engineering", authors: "", venue: "", url: "" },
  { year: "In Preparation", title: "Hole expansion ratio derived from tensile flow based on numerical simulations and deep learning", authors: "", venue: "", url: "" },
  { year: "In Preparation", title: "The influence of electron-beam excited electrons on the athermal softening processes of fused silica", authors: "", venue: "", url: "" },
  { year: "In Preparation", title: "Comprehensive analysis of neural network architectures for indentation plastometry", authors: "", venue: "", url: "" },
  { year: "In Preparation", title: "Parameter determination for crystal plasticity simulations for dual-phase steel via deep learning", authors: "", venue: "", url: "" },
];

/* ---------------------------------------------------------------------
   여기서부터는 데이터 로딩 + 화면 그리기 코드입니다. 논문만 고칠 거라면
   (시트 링크 넣기 / PUB 편집) 아래는 안 만져도 됩니다.
   --------------------------------------------------------------------- */

const parsePubCsv = (text) => {
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

const rowsToPubs = (rows) => {
  if (!rows.length) return [];
  const header = rows[0].map((c) => c.trim().toLowerCase());
  const find = (names) => header.findIndex((h) => names.some((n) => h.includes(n)));
  let yi = find(["연도", "year", "구분"]);
  let ti = find(["제목", "title"]);
  let ai = find(["저자", "author"]);
  let vi = find(["게재", "저널", "venue", "journal", "정보"]);
  let ui = find(["링크", "url", "link", "doi"]);
  let body;
  if (yi === -1 || ti === -1) {
    yi = 0; ti = 1; ai = 2; vi = 3; ui = 4; body = rows;
  } else {
    body = rows.slice(1);
  }
  const at = (r, idx) => (idx !== -1 ? (r[idx] || "").trim() : "");
  return body
    .map((r) => ({ year: at(r, yi), title: at(r, ti), authors: at(r, ai), venue: at(r, vi), url: at(r, ui) }))
    .filter((e) => e.year && e.title);
};

const loadPubs = async () => {
  if (!PUB_CSV_URL) return PUB;
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(PUB_CSV_URL, { signal: controller.signal, cache: "no-store" });
    clearTimeout(timer);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const parsed = rowsToPubs(parsePubCsv(await res.text()));
    return parsed.length ? parsed : PUB;
  } catch (err) {
    console.warn("[pub] 시트를 불러오지 못해 내장 목록을 사용합니다:", err);
    return PUB;
  }
};

const escapeHtml = (str) =>
  String(str).replace(/[&<>"']/g, (ch) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[ch]);

// 저자 문자열: "K. Jeong" 자동 굵게 + 이름 뒤 †/* 마커 자동 위첨자.
const formatAuthors = (raw) => {
  let s = escapeHtml(raw);
  s = s.replace(/K\. Jeong/g, "<strong>K. Jeong</strong>");
  // 공백 없이 붙은 †/* (와 그 사이 쉼표) 묶음을 위첨자로. 저자 구분용 ", " 는 건드리지 않음.
  s = s.replace(/[†*](?:[,†*]*[†*])?/g, (m) => `<sup>${m}</sup>`);
  return s;
};

// 게재정보: 첫 쉼표 앞 저널명을 이탤릭(cite)으로.
const formatVenue = (raw) => {
  const s = escapeHtml(raw);
  const ci = s.indexOf(",");
  return ci === -1 ? `<cite>${s}</cite>` : `<cite>${s.slice(0, ci)}</cite>${s.slice(ci)}`;
};

const isPrep = (year) => /prep|준비/i.test(year);

// 논문 항목 한 줄.
const itemHtml = (e) => {
  if (isPrep(e.year)) {
    return `
          <li class="pub-item is-prep">
            <span class="pub-index" aria-hidden="true">${e.idx}</span>
            <div class="pub-body">
              <p class="pub-title">${escapeHtml(e.title)}</p>
              <span class="pub-status">In preparation</span>
            </div>
          </li>`;
  }
  const title = e.url
    ? `<a class="pub-title" href="${escapeHtml(e.url)}" target="_blank" rel="noreferrer">${escapeHtml(e.title)}</a>`
    : `<p class="pub-title">${escapeHtml(e.title)}</p>`;
  return `
          <li class="pub-item">
            <span class="pub-index">${e.idx}</span>
            <div class="pub-body">
              ${title}
              ${e.authors ? `<p class="pub-authors">${formatAuthors(e.authors)}</p>` : ""}
              ${e.venue ? `<p class="pub-venue">${formatVenue(e.venue)}</p>` : ""}
            </div>
          </li>`;
};

// 섹션(연도 묶음) 하나.
const sectionHtml = (sec) => `
      <section class="pub-section reveal-block" id="${sec.id}" aria-labelledby="${sec.id}-title">
        <div class="pub-year-head">
          <h2 id="${sec.id}-title">${escapeHtml(sec.label)}</h2>
        </div>
        <ol class="pub-list">${sec.items.map(itemHtml).join("")}
        </ol>
      </section>`;

/* ---- 동적으로 넣은 섹션의 등장(reveal) 처리 (gallery 와 동일) ---- */
const initReveal = (blocks) => {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window)) {
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

// 연도 점프내비의 "Earlier(옛 연도 접기)" 토글.
const initArchiveToggle = (page) => {
  const toggle = document.querySelector("[data-archive-toggle]");
  if (!toggle) return;
  toggle.addEventListener("click", () => {
    const open = !page.classList.contains("is-archive-open");
    page.classList.toggle("is-archive-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    const label = toggle.querySelector("[data-archive-label]");
    const next = open ? toggle.dataset.labelOpen : toggle.dataset.labelClosed;
    if (label && next) label.textContent = next;
  });
};

/* ---- 첫 렌더 ---- */
(async () => {
  const sectionsMount = document.querySelector("[data-pub-sections]");
  const navMount = document.querySelector("[data-pub-yearnav]");
  if (!sectionsMount) return;

  // 시트(오래된 것 먼저) 순서대로 번호 자동 부여.
  const rows = (await loadPubs()).map((r, i) => ({ ...r, idx: i + 1 }));

  const byIdxDesc = (a, b) => b.idx - a.idx;
  const prep = rows.filter((r) => isPrep(r.year)).sort(byIdxDesc);
  const byYear = new Map();
  rows.filter((r) => !isPrep(r.year)).forEach((r) => {
    const y = r.year.trim();
    if (!byYear.has(y)) byYear.set(y, []);
    byYear.get(y).push(r);
  });
  const years = [...byYear.keys()].sort((a, b) => Number(b) - Number(a));
  years.forEach((y) => byYear.get(y).sort(byIdxDesc));

  // 표시 순서: In Preparation 먼저, 그다음 연도 내림차순.
  const sections = [];
  if (prep.length) sections.push({ id: "in-preparation", label: "In Preparation", items: prep });
  years.forEach((y) => sections.push({ id: "y" + y, label: y, items: byYear.get(y) }));

  sectionsMount.innerHTML = sections.map(sectionHtml).join("");

  // 연도 점프내비: In Prep + 연도(최신 3개는 노출, 나머지는 'Earlier'로 접힘).
  if (navMount) {
    const links = [];
    if (prep.length) links.push(`<a href="#in-preparation">In Prep</a>`);
    years.forEach((y, i) => {
      const cls = i >= 3 ? ' class="pub-yearnav-extra"' : "";
      links.push(`<a${cls} href="#y${y}">${escapeHtml(y)}</a>`);
    });
    if (years.length > 3) {
      links.push(
        `<button class="pub-yearnav-toggle" type="button" data-archive-toggle aria-expanded="false" data-label-closed="Earlier" data-label-open="Less"><span class="pub-yearnav-toggle-label" data-archive-label>Earlier</span></button>`,
      );
    }
    navMount.innerHTML = links.join("\n        ");
  }

  initReveal(Array.from(sectionsMount.querySelectorAll(".pub-section")));
  initArchiveToggle(document.querySelector(".pub-page") || document.body);
})();
