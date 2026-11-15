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
  @page { size: A4; margin: 14mm 13mm; }
  * { box-sizing: border-box; }
  body { font-family: Georgia, "Times New Roman", serif; color: #111; margin: 0; font-size: 10pt; line-height: 1.45; }
  h1 { font-size: 20pt; margin: 0 0 4px; }
  p.sub { margin: 0 0 3px; font-size: 9.5pt; color: #555; }
  .meta { display: flex; gap: 22px; margin: 14px 0 6px; font-size: 9.5pt; color: #555; }
  .meta span { flex: 1; border-bottom: 1px solid #999; padding-bottom: 3px; }
  .howto { margin: 12px 0 0; padding: 10px 12px; border: 1px solid #ccc; background: #fafafa; font-size: 9.5pt; }
  .howto strong { display: block; margin-bottom: 3px; }
  h2 { font-size: 12pt; text-transform: uppercase; letter-spacing: .09em; margin: 22px 0 10px; padding-bottom: 3px; border-bottom: 1.6px solid #111; }
  h3 { font-size: 10.5pt; margin: 14px 0 5px; }
  h3 .tag { font-weight: 400; color: #777; font-size: 8.5pt; letter-spacing: .04em; text-transform: uppercase; }
  table { width: 100%; border-collapse: collapse; font-size: 9pt; }
  tr { page-break-inside: avoid; }
  th, td { text-align: left; padding: 3px 6px 3px 0; border-bottom: 1px solid #e2e2e2; vertical-align: top; }
  th { font-size: 8pt; text-transform: uppercase; letter-spacing: .06em; color: #666; }
  td.n { width: 20px; color: #888; }
  td.sv { width: 34%; font-weight: 600; }
  .vf { font-size: 8pt; font-weight: 400; color: #555; }
  .grid { display: grid; grid-template-columns: 1fr 1fr; column-gap: 18px; }
  .drill { padding: 6px 0 1px; border-bottom: 1px solid #d8d8d8; font-size: 9.5pt; page-break-inside: avoid; }
  .drill .num { color: #888; }
  .drill .blank { display: block; border-bottom: 1px solid #bbb; height: 15px; margin: 2px 0 4px; }
  .key p { margin: 0 0 5px; font-size: 9pt; color: #333; }
  .key strong { color: #111; }
  .break { page-break-before: always; }
  footer { margin-top: 18px; font-size: 8pt; color: #888; text-align: center; }
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
        `<div class="drill"><span class="num">${i + 1}.</span> ${esc(w.en)}<span class="blank"></span></div>`
    )
    .join("");
  return `<div class="grid">${items}</div>`;
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
      <h2 class="break">${esc(g.type.label)} <span style="font-weight:400;text-transform:none;letter-spacing:0;color:#777;font-size:9.5pt">${esc(
        g.type.en
      )} · ${g.missions.length} uppdrag</span></h2>
      ${g.missions
        .map(
          (m) => `<h3>${esc(m.title)} <span class="tag">${esc(m.topic || "")}</span></h3>${wordTable(
            m.words
          )}`
        )
        .join("")}`
    )
    .join("");

  const drillSections = groups
    .map(
      (g) => `
      <h2 class="break">Öva: engelska → svenska <span style="font-weight:400;text-transform:none;letter-spacing:0;color:#777;font-size:9.5pt">${esc(
        g.type.label
      )}</span></h2>
      <p class="sub">Skriv det svenska ordet med artikel (en/ett) eller med att + verb. Rätta själv med facit.</p>
      ${g.missions
        .map(
          (m) => `<h3>${esc(m.title)} <span class="tag">${esc(m.topic || "")}</span></h3>${drillBlock(
            m.words
          )}`
        )
        .join("")}`
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
  <h1>Ordbank för SFI 3C</h1>
  <p class="sub">${usable.length} uppdrag · ${totalWords} ord · skrivuppdrag (mejl och åsiktstexter)</p>
  <p class="sub">Alla uppdragens ord på papper: ordlista per ämne, övning engelska → svenska och facit sist.</p>
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
  <div class="key">${keySections}</div>

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