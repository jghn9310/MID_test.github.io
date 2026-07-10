/* =====================================================================
   Research — 4개 연구 토픽 페이지. 페이지마다 '각각의' 구글 시트로 관리합니다.
   (Materials Design / CALPHAD / FE Simulation / Artificial Intelligence)

   각 페이지의 시트는 네 칸이며, "구역" 으로 그 페이지의 어디에 들어갈지 정합니다.

   ── 칸 구성 (네 칸) ────────────────────────────────────────────────────
        구역 | 제목 | 메타 | 링크
     • 기본  — 제목=큰 제목(줄바꿈은 셀 안에서 Alt+Enter), 메타=부제.
     • 태그  — 제목=쉼표로 여러 개(예: Welding, Composite, SPS).
     • 이미지 — 링크=구글 드라이브 공유링크(또는 이미지 주소), 제목=그림 설명(alt).
     • 개요  — 제목=문단 하나. 여러 문단이면 '개요' 줄을 여러 개.
     • 과제  — 제목=(국문) 과제명, 메타=(영문) 과제명(선택).
     • 논문  — 제목=논문 제목, 메타=서지정보, 링크=주소.
     · 그 페이지에 원래 없는 구역은 그냥 안 나옵니다. 사진은 드라이브 링크만.

   ── 페이지별 시트 CSV '웹에 게시' 링크를 아래에 하나씩 붙여넣기 ───────────────
     페이지마다 시트를 따로 만들고, 아래 RESEARCH_CSV 에 페이지별로 링크를 넣습니다.
     비워두면 그 페이지는 맨 아래 RESEARCH(현재 내용)를 씁니다.
   ===================================================================== */

// ▼ 페이지별 구글 시트 '웹에 게시(CSV)' 링크. 비우면 내장 RESEARCH 를 씁니다.
const RESEARCH_CSV = {
  "materials-design": "https://docs.google.com/spreadsheets/d/e/2PACX-1vToiIBOykuqZ-PvMnmHfor_B4QkLYRyOrNhyr2-MQpKyEBBv4SBZHZQNEkiFnQ6DcmlXSbx2hRkmVI4/pub?gid=1069215569&single=true&output=csv",
  "calphad": "https://docs.google.com/spreadsheets/d/e/2PACX-1vRwp4VZz2z0Z_UN2kDh63EJmORbCJGA9gQ0H62MlDsDZk2b8QZ0_WbTBERA98iVSvrmNIcJv5gBMMQp/pub?gid=819911698&single=true&output=csv",
  "fe-simulation": "https://docs.google.com/spreadsheets/d/e/2PACX-1vRZtqZOBNAgMrflEAgbTlij7htKHeut8oBD7SAqMqe_MzNDZSCpu9rAHozmUXJodAa3bot5__MFBFgj/pub?gid=1221802886&single=true&output=csv",
  "artificial-intelligence": "https://docs.google.com/spreadsheets/d/e/2PACX-1vQX1B3cnl7uiCne78cAtwYJex5J2O8N83H47JnvXBxanO3dnpWDTcROGVhzCU3Fx0G5zOKJ2rnYewJO/pub?gid=751900026&single=true&output=csv",
};

// 시트를 못 불러오면(또는 링크를 안 넣었으면) 이 내용으로 그립니다. = 현재 4개 페이지.
const RESEARCH = [
  { topic: "Materials Design", section: "기본", text: "Metallic Materials\nDesign", meta: "Designing advanced metallic materials for various applications", link: "" },
  { topic: "Materials Design", section: "태그", text: "Welding, Composite, SPS, Multiphase Steel, MAX", meta: "", link: "" },
  { topic: "Materials Design", section: "이미지", text: "Materials with improved properties: aluminum-copper welded joints, additively manufactured metals, tungsten-chromium sintered composites, and functionally gradient steel, spanning electronics, aerospace, nuclear-fusion, and automotive applications.", meta: "", link: "../assets/img/research/materials-design.png" },
  { topic: "Materials Design", section: "개요", text: "Developing metallic materials is crucial as they are utilized in a wide range of industries, including automotive, aerospace, energy, and infrastructure. Advancing metallic materials leads to improved performance, durability, and efficiency in industrial products. Innovations in metallic materials can also reduce environmental impact and energy consumption, playing a key role in sustainable development. Therefore, continuous research and development in this field are vital for technological progress and economic growth.", meta: "", link: "" },
  { topic: "Materials Design", section: "개요", text: "In this respect, our research lab is dedicated to designing advanced metallic materials with a focus on innovative solutions for various industries. By exploring new alloys and enhancing the properties of materials, we aim to address the evolving needs of the sectors, such as driving technological advances, improving processing efficiency, and contributing to sustainable development. To this end, we comprehensively analyze the crystal structure and microstructure using well-known facilities, perform thermodynamic and kinetic simulations, and obtain process–structure–property linkages through multiscale property measurements.", meta: "", link: "" },
  { topic: "Materials Design", section: "논문", text: "Athermally enhanced recrystallization kinetics of ultra-low carbon steel via electric current treatment", meta: "K. Jeong et al. · Acta Materialia 232, 117925 (2022)", link: "https://www.sciencedirect.com/science/article/pii/S135964542200307X" },
  { topic: "Materials Design", section: "논문", text: "Development of functionally graded austenitic lightweight steel through electrically assisted pressure solid-state joining", meta: "S. Lee, K. Jeong et al. · Materials Science and Engineering: A 891, 146003 (2024)", link: "https://www.sciencedirect.com/science/article/pii/S0921509323014272" },
  { topic: "Materials Design", section: "논문", text: "Effect of the Ni plating on Al–Cu dissimilar metal laser welded joint", meta: "H. M. Sung, K. Jeong et al. · Journal of Materials Research and Technology 31, 2473–2483 (2024)", link: "https://www.sciencedirect.com/science/article/pii/S2238785424015606" },
  { topic: "Materials Design", section: "논문", text: "Bimodal structured chromium–tungsten composite as plasma-facing materials: sinterability, mechanical properties, and deuterium retention assessment", meta: "N. Kwak, K. Jeong et al. · Acta Materialia 262, 119453 (2024)", link: "https://www.sciencedirect.com/science/article/pii/S1359645423007838" },
  { topic: "CALPHAD", section: "기본", text: "Computational Thermodynamics", meta: "CALPHAD-based thermodynamic database development", link: "" },
  { topic: "CALPHAD", section: "태그", text: "FactSage, OpenCalphad, Database", meta: "", link: "" },
  { topic: "CALPHAD", section: "이미지", text: "Thermodynamic database development workflow: software (FactSage, OpenCalphad), experiments (phase equilibrium, phase transition), modeling (quaternary MAX phases, compound energy formalism), parameter optimization and validation, and application to materials design and process engineering.", meta: "", link: "../assets/img/research/calphad.png" },
  { topic: "CALPHAD", section: "개요", text: "Computational thermodynamics is a powerful approach for understanding and predicting phase stability in complex material systems. By calculating phase equilibria, phase transformations, and thermodynamic driving forces, this methodology provides essential guidance for designing new alloys and optimizing processing conditions.", meta: "", link: "" },
  { topic: "CALPHAD", section: "개요", text: "Our research lab focuses on CALPHAD-based thermodynamic database development for multicomponent metallic and ceramic materials. We integrate experimental phase equilibrium data, thermodynamic models, and computational optimization to construct reliable databases and calculate phase diagrams. These databases allow us to efficiently explore composition–temperature relationships and identify promising processing windows for advanced materials.", meta: "", link: "" },
  { topic: "CALPHAD", section: "개요", text: "In particular, we are interested in MAX phases, transition-metal carbides/nitrides, and related high-temperature material systems. Through thermodynamic modeling and database validation, we aim to accelerate the design of materials with improved phase stability, functionality, and processing reliability.", meta: "", link: "" },
  { topic: "CALPHAD", section: "과제", text: "맥신 플랫폼 구조를 이용한 이차원 반도체 및 자성체 개발 기초 연구실", meta: "Basic Research Laboratory for 2D Semiconductors and Magnetic Materials Development Utilizing MXene Structural Platform", link: "" },
  { topic: "FE Simulation", section: "기본", text: "Multiscale & Multiphysics Simulation", meta: "Multiscale and multiphysics finite element simulation", link: "" },
  { topic: "FE Simulation", section: "태그", text: "Abaqus, DAMASK, FEM, CPFEM", meta: "", link: "" },
  { topic: "FE Simulation", section: "이미지", text: "Multiphysics finite element simulation: electrical-mechanical coupling (e-beam induced viscoplasticity of a nano ceramic pillar), thermal-mechanical coupling (yield-stress gradient in cooled steel), and diffusional-mechanical coupling (lithium-ion battery cathode delithiation).", meta: "", link: "../assets/img/research/fe-simulation.png" },
  { topic: "FE Simulation", section: "개요", text: "Our research lab specializes in multiscale and multiphysics finite element simulations, a powerful computational approach that allows us to model and analyze complex material behaviors across different scales and physical phenomena. This technique is crucial for understanding how materials respond to various environments from microscopic to macroscopic perspectives.", meta: "", link: "" },
  { topic: "FE Simulation", section: "개요", text: "By integrating multiple physical models, such as mechanical, thermal, and electrical properties, we can optimize material design, predict performance, and improve the reliability of components used in industries. Through this advanced simulation methodology, we are able to accelerate the development of cutting-edge materials and technologies while reducing experimentation time and costs.", meta: "", link: "" },
  { topic: "FE Simulation", section: "과제", text: "Free-Cycling 대응 STMP 기반 강재 설계·제어 플랫폼 구축을 통한 상반 물성 동시 구현", meta: "", link: "" },
  { topic: "FE Simulation", section: "논문", text: "A fully coupled diffusional–mechanical finite element modeling for tin oxide-coated copper anode system in lithium-ion batteries", meta: "K. Jeong et al. · Computational Materials Science 172, 109343 (2020)", link: "https://www.sciencedirect.com/science/article/pii/S0927025619306421" },
  { topic: "FE Simulation", section: "논문", text: "Suppressing high-current-induced phase separation in Ni-rich layered oxides by electrochemically manipulating dynamic lithium distribution", meta: "H. Hyun, K. Jeong et al. · Advanced Materials 33, 2105337 (2021)", link: "https://advanced.onlinelibrary.wiley.com/doi/full/10.1002/adma.202105337" },
  { topic: "FE Simulation", section: "논문", text: "Athermal glass work at the nanoscale: engineered electron-beam-induced viscoplasticity for mechanical shaping of brittle amorphous silica", meta: "S. G. Kang, K. Jeong et al. · Acta Materialia 238, 118203 (2022)", link: "https://www.sciencedirect.com/science/article/pii/S1359645422005845" },
  { topic: "FE Simulation", section: "논문", text: "A kinetic indicator of ultrafast nickel-rich layered oxide cathodes", meta: "J. Wang, K. Jeong et al. · ACS Energy Letters 8, 2986–2995 (2023)", link: "https://pubs.acs.org/doi/full/10.1021/acsenergylett.3c00513" },
  { topic: "Artificial Intelligence", section: "기본", text: "Artificial Intelligence for Materials", meta: "Machine / deep learning for efficient materials development", link: "" },
  { topic: "Artificial Intelligence", section: "태그", text: "Deep Learning, Property Characterization, Reverse Engineering", meta: "", link: "" },
  { topic: "Artificial Intelligence", section: "이미지", text: "Machine and deep learning for materials development: macro and micro indentation, microstructure imaging, tensile testing, residual stress, and phase identification (austenite, ferrite, martensite), connected through a deep learning system for regression and classification.", meta: "", link: "../assets/img/research/artificial-intelligence.png" },
  { topic: "Artificial Intelligence", section: "개요", text: "Machine learning algorithms help identify hidden patterns in large datasets, enabling us to optimize material properties and reduce trial-and-error experimentation. Deep learning models further enhance our ability to simulate complex material behaviors and predict their performance under various conditions. This cutting-edge approach allows us to explore innovative alloys and tailor material properties, significantly advancing the field of materials science.", meta: "", link: "" },
  { topic: "Artificial Intelligence", section: "개요", text: "Our research lab focuses on the integration of machine learning and deep learning techniques with computational simulations to accelerate the development and characterization of materials. By leveraging these advanced technologies, we are able to efficiently analyze and predict the microstructure–property relationships of metals, which are crucial for designing high-performance materials.", meta: "", link: "" },
  { topic: "Artificial Intelligence", section: "과제", text: "Free-Cycling 대응 STMP 기반 강재 설계·제어 플랫폼 구축을 통한 상반 물성 동시 구현", meta: "", link: "" },
  { topic: "Artificial Intelligence", section: "논문", text: "Prediction of uniaxial tensile flow using finite element-based indentation and optimized artificial neural networks", meta: "K. Jeong et al. · Materials & Design 196, 109104 (2020)", link: "https://www.sciencedirect.com/science/article/pii/S0264127520306390" },
  { topic: "Artificial Intelligence", section: "논문", text: "Deep learning-based indentation plastometry in anisotropic materials", meta: "K. Jeong et al. · International Journal of Plasticity 157, 103403 (2022)", link: "https://www.sciencedirect.com/science/article/pii/S0749641922001826" },
  { topic: "Artificial Intelligence", section: "논문", text: "Parameter determination of anisotropic yield function using neural network-based indentation plastometry", meta: "K. Jeong et al. · International Journal of Mechanical Sciences 263, 108776 (2024)", link: "https://www.sciencedirect.com/science/article/pii/S0020740323006781" },
];

/* ---------------------------------------------------------------------
   여기서부터는 데이터 로딩 + 화면 그리기 코드입니다. 내용만 고칠 거라면
   (시트 링크 넣기 / RESEARCH 편집) 아래는 안 만져도 됩니다.
   --------------------------------------------------------------------- */

const parseResearchCsv = (text) => {
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

const rowsToResearch = (rows) => {
  if (!rows.length) return [];
  const header = rows[0].map((c) => c.trim().toLowerCase());
  const find = (names) => header.findIndex((h) => names.some((n) => h.includes(n)));
  let si = find(["구역", "section", "구분"]);
  let xi = find(["제목", "내용", "text", "title"]);
  let mi = find(["메타", "meta", "부제", "서지", "영문"]);
  let li = find(["링크", "link", "url", "이미지", "주소"]);
  let body;
  if (si === -1) {
    si = 0; xi = 1; mi = 2; li = 3; body = rows;
  } else {
    body = rows.slice(1);
  }
  const at = (r, idx) => (idx !== -1 ? (r[idx] || "").trim() : "");
  return body
    .map((r) => ({ section: at(r, si), text: at(r, xi), meta: at(r, mi), link: at(r, li) }))
    .filter((e) => e.section && (e.text || e.link));
};

const loadResearch = async (slug, topicNorm) => {
  const fallback = RESEARCH.filter((r) => normTopic(r.topic) === topicNorm);
  const url = RESEARCH_CSV[slug];
  if (!url) return fallback;
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(url, { signal: controller.signal, cache: "no-store" });
    clearTimeout(timer);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const parsed = rowsToResearch(parseResearchCsv(await res.text()));
    return parsed.length ? parsed : fallback;
  } catch (err) {
    console.warn("[research] 시트를 불러오지 못해 내장 내용을 사용합니다:", err);
    return fallback;
  }
};

const resolvePhoto = (raw) => {
  const url = String(raw || "").trim();
  if (!url) return "";
  if (!/^https?:\/\//i.test(url)) return url;
  if (/drive\.google\.com/i.test(url)) {
    const id = url.match(/\/d\/([-\w]{20,})/)?.[1] || url.match(/[?&]id=([-\w]{20,})/)?.[1];
    if (id) return `https://drive.google.com/thumbnail?id=${id}&sz=w1600`;
    return url;
  }
  if (/photos\.(app\.goo\.gl|google\.com)/i.test(url)) {
    console.warn("[research] 구글 포토 링크는 띄울 수 없습니다. 드라이브 공유링크를 쓰세요:", url);
    return url;
  }
  return url;
};

const escapeHtml = (str) =>
  String(str).replace(/[&<>"']/g, (ch) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[ch]);

// 토픽 이름을 느슨하게 비교(대소문자·공백·하이픈 무시). 시트가 "Materials Design"이든
// "materials-design"이든 페이지의 data-research-topic 과 매칭된다.
const normTopic = (s) => String(s).toLowerCase().replace(/[^a-z0-9가-힣]/g, "");

const sectionKey = (raw) => {
  const s = String(raw).toLowerCase();
  if (/기본|title|hero|identity/.test(s)) return "basic";
  if (/태그|tag|키워드|keyword/.test(s)) return "tag";
  if (/이미지|image|사진|figure|그림/.test(s)) return "image";
  if (/개요|overview|about|소개/.test(s)) return "overview";
  if (/과제|project|funded|ongoing|연구실/.test(s)) return "project";
  if (/논문|paper|publication|출판/.test(s)) return "paper";
  return "";
};

/* ---- 렌더 ---- */
(async () => {
  const main = document.querySelector("[data-research-topic]");
  if (!main) return;
  const slug = main.getAttribute("data-research-topic");
  const topic = normTopic(slug);

  const rows = await loadResearch(slug, topic);
  if (!rows.length) return;

  const bucket = {};
  rows.forEach((r) => {
    const key = sectionKey(r.section);
    if (!key) return;
    (bucket[key] = bucket[key] || []).push(r);
  });

  const setText = (sel, value, htmlize) => {
    const el = main.querySelector(sel);
    if (el && value) el.innerHTML = htmlize ? htmlize(value) : escapeHtml(value);
  };

  // 기본: 제목 + 부제
  if (bucket.basic && bucket.basic[0]) {
    const b = bucket.basic[0];
    setText("[data-research-title]", b.text, (v) => escapeHtml(v).replace(/\n/g, "<br>"));
    setText("[data-research-subtitle]", b.meta);
  }

  // 태그
  const tagsEl = main.querySelector("[data-research-tags]");
  if (tagsEl && bucket.tag && bucket.tag[0]) {
    const tags = bucket.tag[0].text.split(",").map((t) => t.trim()).filter(Boolean);
    if (tags.length) tagsEl.innerHTML = tags.map((t) => `<li>${escapeHtml(t)}</li>`).join("");
  }

  // 이미지
  const imgEl = main.querySelector("[data-research-image]");
  if (imgEl && bucket.image && bucket.image[0]) {
    const im = bucket.image[0];
    if (im.link) imgEl.setAttribute("src", resolvePhoto(im.link));
    if (im.text) imgEl.setAttribute("alt", im.text);
  }

  // 개요(문단 여러 개)
  const ovEl = main.querySelector("[data-research-overview]");
  if (ovEl && bucket.overview) {
    ovEl.innerHTML = bucket.overview.map((p) => `<p>${escapeHtml(p.text)}</p>`).join("");
  }

  // 과제(Ongoing Research): 국문 strong + 영문 span(선택)
  const projEl = main.querySelector("[data-research-projects]");
  if (projEl && bucket.project) {
    projEl.innerHTML = bucket.project
      .map((p) => `<li><strong lang="ko">${escapeHtml(p.text)}</strong>${p.meta ? `<span>${escapeHtml(p.meta)}</span>` : ""}</li>`)
      .join("");
  }

  // 논문(Selected Papers): 링크 + 서지정보
  const papersEl = main.querySelector("[data-research-papers]");
  if (papersEl && bucket.paper) {
    papersEl.innerHTML = bucket.paper
      .map((p) => {
        const title = p.link
          ? `<a href="${escapeHtml(p.link)}" target="_blank" rel="noreferrer">${escapeHtml(p.text)}</a>`
          : escapeHtml(p.text);
        return `<li>${title}${p.meta ? `<span class="paper-meta">${escapeHtml(p.meta)}</span>` : ""}</li>`;
      })
      .join("");
  }
})();
