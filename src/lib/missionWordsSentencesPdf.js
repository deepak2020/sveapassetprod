// Printable / PDF reference booklet: every Skrivuppdrag with its words and its
// English → Swedish sentences, so the learner can read the pairs aloud.
import { MISSION_TYPES, fillBlank, verbLine, wordLabel } from "@/lib/writingMissions";

const esc = (s) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const CSS = `
  @page { size: A4; margin: 10mm 10mm 8mm; }
  * { box-sizing: border-box; }
  body { font-family: Georgia, "Times New Roman", serif; color: #111; margin: 0; font-size: 8.4pt; line-height: 1.24; }
  h1 { font-size: 14pt; margin: 0; }
  p.sub { margin: 1px 0 0; font-size: 8pt; color: #555; }
  .howto { margin: 5px 0 8px; padding: 5px 8px; border: 1px solid #ccc; background: #fafafa; font-size: 7.8pt; line-height: 1.3; }
  h2 { font-size: 9.5pt; text-transform: uppercase; letter-spacing: .08em; margin: 10px 0 5px; padding-bottom: 2px; border-bottom: 1.4px solid #111; break-after: avoid; page-break-after: avoid; }
  h2 .note { font-weight: 400; text-transform: none; letter-spacing: 0; color: #777; font-size: 7.5pt; }
  .card { break-inside: avoid; page-break-inside: avoid; margin: 0 0 7px; padding-bottom: 5px; border-bottom: 1px solid #e2e2e2; }
  h3 { font-size: 9pt; margin: 0 0 2px; }
  h3 .tag { font-weight: 400; color: #888; font-size: 6.8pt; letter-spacing: .03em; text-transform: uppercase; }
  h4 { font-size: 7.2pt; text-transform: uppercase; letter-spacing: .06em; color: #777; margin: 3px 0 1px; }
  table { width: 100%; border-collapse: collapse; font-size: 7.8pt; }
  tr { break-inside: avoid; page-break-inside: avoid; }
  th, td { text-align: left; padding: 0.5px 4px 0.5px 0; border-bottom: 1px solid #ececec; vertical-align: top; }
  th { font-size: 6.4pt; text-transform: uppercase; letter-spacing: .05em; color: #888; }
  td.n { width: 12px; color: #aaa; }
  td.sv { width: 44%; font-weight: 600; }
  .vf { font-size: 6.8pt; font-weight: 400; color: #666; }
  ol.sent { margin: 0; padding-left: 13px; font-size: 7.9pt; }
  ol.sent li { margin-bottom: 1.5px; break-inside: avoid; page-break-inside: avoid; }
  ol.sent .en { color: #555; font-style: italic; }
  ol.sent .sv { font-weight: 600; }
  .cols { columns: 2; column-gap: 8mm; }
  footer { margin-top: 6px; font-size: 6.8pt; color: #999; text-align: center; }
`;

function wordTable(words) {
  const rows = words
    .map(
      (w, i) =>
        `<tr><td class="n">${i + 1}</td><td class="sv">${esc(wordLabel(w))}${
          verbLine(w) ? `<br><span class="vf">${esc(verbLine(w))}</span>` : ""
        }</td><td>${esc(w.en)}</td></tr>`
    )
    .join("");
  return `<table><thead><tr><th></th><th>Svenska</th><th>Engelska</th></tr></thead><tbody>${rows}</tbody></table>`;
}

function sentenceList(frames) {
  const items = frames
    .map(
      (f, i) =>
        `<li><span class="en">${esc(f.sentence_en || "")}</span><br><span class="sv">${esc(
          fillBlank(f.sentence_with_blank, f.answer)
        )}</span></li>`
    )
    .join("");
  return `<ol class="sent">${items}</ol>`;
}

export function printMissionWordsSentences(missions) {
  const win = window.open("", "_blank");
  if (!win) return false;

  const usable = (missions || []).filter((m) => (m.words || []).length > 0);
  const totalWords = usable.reduce((n, m) => n + (m.words || []).length, 0);
  const totalSentences = usable.reduce((n, m) => n + (m.frames || []).length, 0);

  const groups = MISSION_TYPES.map((type) => ({
    type,
    missions: usable.filter((m) => m.type === type.id),
  })).filter((g) => g.missions.length);

  const sections = groups
    .map(
      (g) => `
      <h2>${esc(g.type.label)} <span class="note">${esc(g.type.en)} · ${g.missions.length} uppdrag</span></h2>
      ${g.missions
        .map(
          (m) => `<div class="card">
            <h3>${esc(m.title)} <span class="tag">${esc(m.topic || "")}</span></h3>
            <h4>Ord</h4>
            ${wordTable(m.words || [])}
            ${
              (m.frames || []).length
                ? `<h4>Meningar</h4>${sentenceList(m.frames)}`
                : ""
            }
          </div>`
        )
        .join("")}`
    )
    .join("");

  const title = "Ord och meningar — alla skrivuppdrag";

  win.document.write(`<!doctype html>
<html lang="sv">
<head>
<meta charset="utf-8" />
<title>${esc(title)}</title>
<style>${CSS}</style>
</head>
<body>
  <h1>Ord och meningar — SFI 3C</h1>
  <p class="sub">${usable.length} uppdrag · ${totalWords} ord · ${totalSentences} meningar</p>
  <div class="howto">
    <strong>Så använder du häftet:</strong> läs den engelska meningen, säg den svenska högt innan du tittar på svaret.
    Täck den svenska raden med ett papper första gången. Orden överst i varje ämne är byggstenarna i meningarna.
  </div>
  ${sections}
  <footer>Sveapasset · Ord och meningar · Skrivuppdrag</footer>
</body>
</html>`);
  win.document.close();
  setTimeout(() => {
    win.focus();
    win.print();
  }, 300);
  return true;
}