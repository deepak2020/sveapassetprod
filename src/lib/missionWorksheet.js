// Printable A4 worksheet for one Skrivuppdrag: every stage of the mission on
// paper, from briefing to self-check, with an answer key at the end.
import { fillBlank, missionType, verbLine, wordLabel } from "@/lib/writingMissions";

const esc = (s) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const CHECKLIST = {
  informal_email: [
    "Hälsning och avslut som passar en vän",
    "Alla punkter i uppdraget finns med",
    "Verb på plats 2 — även när meningen börjar med ett adverb",
    "Minst två bindeord (eftersom, men, medan, så att)",
    "en/ett och bestämd form är rätt",
    "Frågor eller utrop som gör texten levande",
  ],
  formal_email: [
    "Ärendet står i första meningen",
    "Artigt tilltal och formellt avslut",
    "Alla punkter i uppdraget finns med",
    "Verb på plats 2 och tydlig ordföljd",
    "Inga talspråksord",
    "Nästa steg eller kontaktuppgift är tydlig",
  ],
  opinion: [
    "Min åsikt står i inledningen",
    "Minst två argument med exempel",
    "Bindeord som leder läsaren (för det första, däremot, därför)",
    "Verb på plats 2 i alla meningar",
    "En avslutning som knyter ihop texten",
    "Varierade meningslängder",
  ],
};

export function printMissionWorksheet(mission) {
  const win = window.open("", "_blank");
  if (!win) return false;

  const frames = mission.frames || [];
  const puzzles = mission.puzzles || [];
  const words = mission.words || [];
  const steps = (mission.paragraph_frame || []).slice().sort((a, b) => a.step - b.step);
  const type = missionType(mission.type);
  const minWords = mission.min_words || 100;
  const maxWords = mission.max_words || Math.round(minWords * 1.5);
  const minutes = mission.time_limit_minutes || 45;
  const lines = (n) => Array.from({ length: n }, () => '<div class="line"></div>').join("");
  const title = `Skrivuppdrag: ${mission.title}`;

  const points = (mission.points_to_include || [])
    .map((p) => `<li><span class="box"></span>${esc(p)}</li>`)
    .join("");

  const wordRows = words
    .map(
      (w, i) =>
        `<tr><td class="n">${i + 1}</td><td class="sv">${esc(wordLabel(w))}${
          verbLine(w) ? `<br><span class="vf">${esc(verbLine(w))}</span>` : ""
        }</td><td class="en">${esc(w.en)}</td><td class="ex">${esc(w.example || "")}</td></tr>`
    )
    .join("");

  const wordDrill = words
    .map((w, i) => `<div class="drill"><span class="num">${i + 1}.</span> ${esc(w.en)}<span class="blank"></span></div>`)
    .join("");

  const sentences = frames
    .map(
      (f, i) =>
        `<div class="item keep"><p class="prompt"><span class="num">${i + 1}.</span> ${esc(
          f.sentence_en || ""
        )}</p>${lines(1)}</div>`
    )
    .join("");

  const puzzleItems = puzzles
    .map(
      (p, i) =>
        `<div class="item keep"><p class="prompt"><span class="num">${i + 1}.</span> ${esc(
          (p.tokens || []).join(" · ")
        )}</p>${lines(1)}</div>`
    )
    .join("");

  const stepItems = steps
    .map(
      (p) =>
        `<div class="item keep"><p class="prompt"><span class="num">${p.step}.</span> <span class="starter">${esc(
          p.starter
        )}</span>${p.hint ? ` <span class="hint">${esc(p.hint)}</span>` : ""}</p>${lines(1)}</div>`
    )
    .join("");

  const checks = (CHECKLIST[mission.type] || CHECKLIST.informal_email)
    .map((c) => `<li><span class="box"></span>${esc(c)}</li>`)
    .join("");

  const keySentences = frames
    .map((f, i) => `${i + 1}. ${esc(fillBlank(f.sentence_with_blank, f.answer))}`)
    .join("<br>");
  const keyPuzzles = puzzles.map((p, i) => `${i + 1}. ${esc(p.answer)}`).join("<br>");

  win.document.write(`<!doctype html>
<html lang="sv">
<head>
<meta charset="utf-8" />
<title>${esc(title)}</title>
<style>
  @page { size: A4; margin: 10mm; }
  * { box-sizing: border-box; }
  body { font-family: Georgia, "Times New Roman", serif; color: #111; margin: 0; font-size: 8.6pt; line-height: 1.25; }
  .head { display: flex; align-items: baseline; flex-wrap: wrap; gap: 2px 10px; }
  h1 { font-size: 14pt; margin: 0; }
  p.sub { margin: 0; font-size: 7.6pt; color: #666; }
  .meta { display: flex; gap: 12px; margin: 4px 0 2px; font-size: 7.6pt; color: #555; }
  .meta span { flex: 1; border-bottom: 1px solid #999; padding-bottom: 1px; }
  h2 { font-size: 9pt; text-transform: uppercase; letter-spacing: .07em; margin: 8px 0 3px; padding-bottom: 1.5px; border-bottom: 1.3px solid #111; break-after: avoid; page-break-after: avoid; }
  h2 .step { font-weight: 400; letter-spacing: 0; text-transform: none; color: #888; font-size: 7pt; }
  .lead { margin: 0 0 3px; font-size: 8pt; }
  ul { list-style: none; margin: 0; padding: 0; }
  ul li { display: flex; gap: 5px; padding: 0.5px 0; font-size: 8pt; }
  .box { display: inline-block; width: 9px; height: 9px; border: 1px solid #666; margin-top: 2px; flex: none; }
  .line { border-bottom: 1px solid #c3c3c3; height: 21px; }
  .item { margin-bottom: 3px; break-inside: avoid; page-break-inside: avoid; }
  .prompt { margin: 0 0 1px; font-size: 8.2pt; }
  .num { color: #888; }
  .starter { font-weight: 600; }
  .hint { color: #666; font-size: 7.2pt; font-style: italic; }
  table { width: 100%; border-collapse: collapse; font-size: 7.6pt; }
  th, td { text-align: left; padding: 1px 4px 1px 0; border-bottom: 1px solid #e6e6e6; vertical-align: top; }
  th { font-size: 6.6pt; text-transform: uppercase; letter-spacing: .05em; color: #777; }
  td.n { width: 12px; color: #aaa; }
  td.sv { width: 30%; font-weight: 600; }
  td.en { width: 26%; }
  td.ex { color: #444; font-style: italic; }
  .vf { font-size: 6.8pt; font-weight: 400; color: #666; }
  .two { display: grid; grid-template-columns: 1fr 1fr; column-gap: 6mm; align-items: start; }
  .stepcols { columns: 2; column-gap: 6mm; }
  .drills { font-size: 7.6pt; }
  .drill { padding: 0.5px 0; border-bottom: 1px dotted #d5d5d5; break-inside: avoid; page-break-inside: avoid; }
  .drill .blank { display: inline-block; border-bottom: 1px solid #bbb; min-width: 26mm; margin-left: 4px; }
  .target { display: flex; gap: 10px; font-size: 7.6pt; color: #555; margin: 0 0 4px; }
  .target span { border-bottom: 1px solid #999; padding-bottom: 1px; flex: 1; }
  .break { page-break-before: always; }
  .key { font-size: 7.6pt; color: #333; line-height: 1.35; columns: 2; column-gap: 6mm; }
  footer { margin-top: 6px; font-size: 6.8pt; color: #999; }
</style>
</head>
<body>
  <div class="head">
    <h1>${esc(mission.title)}</h1>
    <p class="sub">${esc(type.label)} · ${esc(mission.topic || "Skrivuppdrag")} · ${minWords}–${maxWords} ord · ca ${minutes} min</p>
  </div>
  <div class="meta"><span>Namn</span><span>Datum</span><span>Poäng / mål</span></div>

  <h2>1. Uppdrag <span class="step">briefing</span></h2>
  <p class="lead">${esc(mission.task_sv)}</p>
  <ul>${points}</ul>

  <h2>2. Ord <span class="step">words</span></h2>
  <div class="two">
    <table>
      <thead><tr><th></th><th>Svenska</th><th>Engelska</th><th>Exempel</th></tr></thead>
      <tbody>${wordRows}</tbody>
    </table>
    <div>
      <p class="prompt">Testa dig själv — skriv det svenska ordet:</p>
      <div class="drills">${wordDrill}</div>
    </div>
  </div>

  <div class="two">
    <div>
      <h2>3. Meningar <span class="step">translate</span></h2>
      <p class="lead">Översätt meningen till svenska. Skriv hela meningen.</p>
      ${sentences}
    </div>
    <div>
      <h2>4. Bygg <span class="step">word order</span></h2>
      <p class="lead">Sätt orden i rätt ordning. Verbet kommer på plats 2.</p>
      ${puzzleItems}
      <div class="item keep">
        <p class="prompt">Egen mening med ett bindeord (eftersom, men, medan, så att):</p>
        ${lines(2)}
      </div>
    </div>
  </div>

  <h2>5. Stycke <span class="step">paragraph</span></h2>
  <p class="lead">Bygg ett stycke med startmeningarna. En eller två meningar efter varje.</p>
  <div class="stepcols">${stepItems}</div>

  <h2>6. Skriv fritt <span class="step">free text</span></h2>
  <div class="target">
    <span>Mål: ${minWords}–${maxWords} ord</span>
    <span>Tid: ${minutes} min</span>
    <span>Antal ord: ______</span>
  </div>
  ${lines(Math.max(14, Math.round(minWords / 8)))}

  <h2>7. Självcheck <span class="step">feedback</span></h2>
  <div class="two">
    <ul>${checks}</ul>
    <div>
      <div class="target">
        <span>Min bedömning (F E D C B A)</span>
        <span>Fel jag upprepar: </span>
      </div>
      <div class="item keep">
        <p class="prompt">Tre saker jag gör bättre nästa gång:</p>
        ${lines(3)}
      </div>
    </div>
  </div>

  <h2 class="break">Facit <span class="step">vik undan</span></h2>
  <div class="key">
    <p><strong>3. Meningar</strong><br>${keySentences}</p>
    <p><strong>4. Bygg</strong><br>${keyPuzzles}</p>
  </div>

  <footer>Sveapasset · Skrivuppdrag · ${esc(mission.title)}</footer>
</body>
</html>`);
  win.document.close();
  setTimeout(() => {
    win.focus();
    win.print();
  }, 300);
  return true;
}