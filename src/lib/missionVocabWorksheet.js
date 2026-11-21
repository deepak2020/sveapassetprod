// Printable A4 booklet with the vocabulary of every Skrivuppdrag, grouped by
// text type: study list per topic, then an English → Swedish drill, then a key.
import { MISSION_TYPES, missionType, verbLine, wordLabel } from "@/lib/writingMissions";

const esc = (s) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const CSS = `
  @page { size: A4; margin: 10mm 10mm 8mm; }
  * { box-sizing: border-box; }
  body { font-family: Georgia, "Times New Roman", serif; color: #111; margin: 0; font-size: 8.5pt; line-height: 1.22; }
  .head { display: flex; align-items: baseline; flex-wrap: wrap; gap: 4px 12px; }
  h1 { font-size: 14pt; margin: 0; }
  p.sub { margin: 0; font-size: 8pt; color: #555; }
  .meta { display: flex; gap: 14px; margin: 5px 0 0; font-size: 8pt; color: #555; }
  .meta span { flex: 1; border-bottom: 1px solid #999; padding-bottom: 1px; }
  .howto { margin: 5px 0 0; padding: 5px 8px; border: 1px solid #ccc; background: #fafafa; font-size: 7.8pt; line-height: 1.28; columns: 2; column-gap: 8mm; }
  .howto strong { display: block; margin-bottom: 1px; }
  h2 { font-size: 9.5pt; text-transform: uppercase; letter-spacing: .08em; margin: 9px 0 4px; padding-bottom: 2px; border-bottom: 1.4px solid #111; break-after: avoid; }
  h2 .note { font-weight: 400; text-transform: none; letter-spacing: 0; color: #777; font-size: 7.5pt; }
  h3 { font-size: 8.6pt; margin: 0 0 1px; }
  h3 .tag { font-weight: 400; color: #888; font-size: 6.8pt; letter-spacing: .03em; text-transform: uppercase; }
  .cols { columns: 2; column-gap: 8mm; }
  .card { break-inside: avoid; page-break-inside: avoid; margin: 0 0 5px; }
  table { width: 100%; border-collapse: collapse; font-size: 7.8pt; }
  tr { break-inside: avoid; page-break-inside: avoid; }
  th, td { text-align: left; padding: 0.5px 4px 0.5px 0; border-bottom: 1px solid #e8e8e8; vertical-align: top; }
  th { font-size: 6.6pt; text-transform: uppercase; letter-spacing: .05em; color: #777; }
  td.n { width: 12px; color: #aaa; }
  td.sv { width: 42%; font-weight: 600; }
  .vf { font-size: 6.8pt; font-weight: 400; color: #666; }
  .subline { margin: 0 0 3px; font-size: 7.8pt; color: #555; }
  .drills { font-size: 8pt; }
  .drill { padding: 1px 0; border-bottom: 1px dotted #d5d5d5; break-inside: avoid; page-break-inside: avoid; }
  .drill .num { color: #999; }
  .drill .blank { display: inline-block; min-width: 24mm; border-bottom: 1px solid #bbb; }
  .key p { margin: 0 0 3px; font-size: 7.8pt; color: #333; break-inside: avoid; page-break-inside: avoid; }
  .key strong { color: #111; }
  .break { page-break-before: always; }
  footer { margin-top: 6px; font-size: 6.8pt; color: #999; text-align: center; }
`;

function wordTable(words) {
  const rows = words
    .map(
      (w, i) =>
        `<tr><td class="n">${i + 1}</td><td class="sv">${esc(wordLabel(w))}${
          verbLine(w) ? `<br><span class="vf">${verbLine(w)}</span>` : ""
        }</td><td>${esc(w.en)}</td></tr>`
    )
    .join("");
  return `<table><thead><tr><th></th><th>Svenska</th><th>Engelska</th></tr></thead><tbody>${rows}</tbody></table>`;
}

function drillBlock(words) {
  const items = words
    .map(
      (w, i) =>
        `<div class="drill"><span class="num">${i + 1}.</span> ${esc(w.en)} <span class="blank"></span></div>`
    )
    .join("");
  return `<div class="drills">${items}</div>`;
}

// Pure fill-in worksheet: only the English word is printed, with a line to
// write the Swedish word on. Answer key on its own page at the end.
export function printVocabDrill(missions) {
  const win = window.open("", "_blank");
  if (!win) return false;

  const usable = (missions || []).filter((m) => (m.words || []).length > 0);
  const totalWords = usable.reduce((n, m) => n + m.words.length, 0);

  const groups = MISSION_TYPES.map((type) => ({
    type,
    missions: usable.filter((m) => m.type === type.id),
  })).filter((g) => g.missions.length);

  const drillCard = (m) =>
    `<div class="card"><h3>${esc(m.title)} <span class="tag">${esc(m.topic || "")}</span></h3>${m.words
      .map(
        (w, i) =>
          `<div class="drill"><span class="num">${i + 1}.</span> <span class="en">${esc(w.en)}</span> <span class="blank"></span></div>`
      )
      .join("")}</div>`;

  const sheets = groups
    .map(
      (g) => `
      <h2>${esc(g.type.label)} <span class="note">${esc(g.type.en)}</span></h2>
      <div class="cols">${g.missions.map(drillCard).join("")}</div>`
    )
    .join("");

  const key = groups
    .map(
      (g) => `
      <h3>${esc(g.type.label)}</h3>
      ${g.missions
        .map(
          (m) =>
            `<p><strong>${esc(m.title)}</strong><br>${m.words
              .map((w, i) => `${i + 1}. ${esc(wordLabel(w))}`)
              .join(" · ")}</p>`
        )
        .join("")}`
    )
    .join("");

  win.document.write(`<!doctype html>
<html lang="sv">
<head>
<meta charset="utf-8" />
<title>Arbetsblad — skriv det svenska ordet</title>
<style>${CSS}
  .drill .en { display: inline-block; min-width: 34mm; }
  .drill .blank { min-width: 34mm; }
  .drill { padding: 2.5px 0; }
</style>
</head>
<body>
  <div class="head">
    <h1>Arbetsblad: skriv det svenska ordet</h1>
    <p class="sub">${usable.length} uppdrag · ${totalWords} ord · engelska → svenska</p>
  </div>
  <div class="meta"><span>Namn</span><span>Datum</span><span>Rätt: ____ / ${totalWords}</span></div>
  <div class="howto">
    <strong>Så gör du</strong>
    1. Läs det engelska ordet och skriv det svenska ordet på raden. Ta med artikel (en/ett) eller att + verb.<br>
    2. Rätta själv med facit på sista sidan och ringa in de ord du missade.<br>
    3. Gör om de missade orden nästa dag — skriv dem tre gånger.
  </div>

  ${sheets}

  <h2 class="break">Facit</h2>
  <div class="cols key">${key}</div>

  <footer>Sveapasset · Arbetsblad skrivuppdrag · engelska → svenska</footer>
</body>
</html>`);
  win.document.close();
  setTimeout(() => {
    win.focus();
    win.print();
  }, 300);
  return true;
}

export function printVocabWorksheet(missions) {
  const win = window.open("", "_blank");
  if (!win) return false;

  const usable = (missions || []).filter((m) => (m.words || []).length > 0);
  const totalWords = usable.reduce((n, m) => n + m.words.length, 0);

  const groups = MISSION_TYPES.map((type) => ({
    type,
    missions: usable.filter((m) => m.type === type.id),
  })).filter((g) => g.missions.length);

  const listSections = groups
    .map(
      (g) => `
      <h2>${esc(g.type.label)} <span class="note">${esc(g.type.en)} · ${g.missions.length} uppdrag</span></h2>
      <div class="cols">
      ${g.missions
        .map(
          (m) => `<div class="card"><h3>${esc(m.title)} <span class="tag">${esc(m.topic || "")}</span></h3>${wordTable(
            m.words
          )}</div>`
        )
        .join("")}
      </div>`
    )
    .join("");

  const drillSections = groups
    .map(
      (g) => `
      <h2>Öva: engelska → svenska <span class="note">${esc(g.type.label)}</span></h2>
      <p class="subline">Skriv det svenska ordet med artikel (en/ett) eller med att + verb. Rätta själv med facit.</p>
      <div class="cols">
      ${g.missions
        .map(
          (m) => `<div class="card"><h3>${esc(m.title)} <span class="tag">${esc(m.topic || "")}</span></h3>${drillBlock(
            m.words
          )}</div>`
        )
        .join("")}
      </div>`
    )
    .join("");

  const keySections = groups
    .map(
      (g) => `
      <h3>${esc(g.type.label)}</h3>
      ${g.missions
        .map(
          (m) =>
            `<p><strong>${esc(m.title)}</strong><br>${m.words
              .map((w, i) => `${i + 1}. ${esc(wordLabel(w))}`)
              .join(" · ")}</p>`
        )
        .join("")}`
    )
    .join("");

  const title = "Ordbank — alla skrivuppdrag";

  win.document.write(`<!doctype html>
<html lang="sv">
<head>
<meta charset="utf-8" />
<title>${esc(title)}</title>
<style>${CSS}</style>
</head>
<body>
  <div class="head">
    <h1>Ordbank för SFI 3C</h1>
    <p class="sub">${usable.length} uppdrag · ${totalWords} ord · ordlista, övning engelska → svenska och facit sist</p>
  </div>
  <div class="meta"><span>Namn</span><span>Datum</span><span>Mål</span></div>
  <div class="howto">
    <strong>Så använder du häftet</strong>
    1. Läs ordlistan för ett ämne högt — säg orden, inte bara titta på dem.<br>
    2. Vik undan ordlistan och gör övningen engelska → svenska på tid (12 ord på 4 minuter).<br>
    3. Rätta med facit och ringa in de ord du missade. Gör om dem nästa dag.<br>
    4. Skriv sedan en egen mening med minst fem av orden — då fastnar de.
  </div>

  ${listSections}
  ${drillSections}

  <h2 class="break">Facit</h2>
  <div class="cols key">${keySections}</div>

  <footer>Sveapasset · Ordbank skrivuppdrag · ${esc(missionType("informal_email").label)} / ${esc(
    missionType("formal_email").label
  )} / ${esc(missionType("opinion").label)}</footer>
</body>
</html>`);
  win.document.close();
  setTimeout(() => {
    win.focus();
    win.print();
  }, 300);
  return true;
}