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
  @page { size: A4; margin: 15mm 14mm; }
  * { box-sizing: border-box; }
  body { font-family: Georgia, "Times New Roman", serif; color: #111; margin: 0; font-size: 10.5pt; line-height: 1.5; }
  h1 { font-size: 19pt; margin: 0 0 3px; }
  p.sub { margin: 0 0 2px; font-size: 9.5pt; color: #555; }
  .meta { display: flex; gap: 22px; margin: 12px 0 4px; font-size: 9.5pt; color: #555; }
  .meta span { flex: 1; border-bottom: 1px solid #999; padding-bottom: 3px; }
  h2 { font-size: 11.5pt; text-transform: uppercase; letter-spacing: .09em; margin: 24px 0 8px; padding-bottom: 3px; border-bottom: 1.5px solid #111; }
  h2 .step { font-weight: 400; letter-spacing: 0; text-transform: none; color: #777; font-size: 9.5pt; }
  .lead { margin: 0 0 10px; }
  ul { list-style: none; margin: 0; padding: 0; }
  ul li { display: flex; gap: 8px; padding: 3px 0; font-size: 10pt; }
  .box { display: inline-block; width: 11px; height: 11px; border: 1px solid #666; margin-top: 3px; flex: none; }
  .line { border-bottom: 1px solid #bbb; height: 27px; }
  .item { margin-bottom: 9px; }
  .prompt { margin: 0 0 2px; font-size: 10.5pt; }
  .num { color: #777; }
  .starter { font-weight: 600; }
  .hint { color: #666; font-size: 9.5pt; font-style: italic; }
  .en-prompt { font-weight: 600; }
  table { width: 100%; border-collapse: collapse; font-size: 9.5pt; }
  th, td { text-align: left; padding: 4px 4px 4px 0; border-bottom: 1px solid #d8d8d8; vertical-align: top; }
  th { font-size: 8.5pt; text-transform: uppercase; letter-spacing: .06em; color: #666; }
  td.n { width: 18px; color: #888; }
  td.sv { width: 24%; font-weight: 600; }
  td.en { width: 24%; }
  td.ex { color: #444; font-style: italic; }
  .vf { font-size: 8.5pt; font-weight: 400; color: #555; }
  .drill-grid { display: grid; grid-template-columns: 1fr 1fr; column-gap: 20px; }
  .drill { padding: 7px 0 2px; border-bottom: 1px solid #d8d8d8; font-size: 10pt; }
  .drill .blank { display: inline-block; border-bottom: 1px solid #bbb; min-width: 40%; margin-left: 6px; }
  .target { display: flex; gap: 22px; font-size: 9.5pt; color: #555; margin: 0 0 10px; }
  .target span { border-bottom: 1px solid #999; padding-bottom: 2px; flex: 1; }
  .break { page-break-before: always; }
  .key { font-size: 9pt; color: #333; line-height: 1.7; }
  footer { margin-top: 20px; font-size: 8.5pt; color: #888; }
</style>
</head>
<body>
  <h1>${esc(mission.title)}</h1>
  <p class="sub">${esc(type.label)} · ${esc(mission.topic || "Skrivuppdrag")} · ${esc(title)}</p>
  <p class="sub">Steg 1–7 på papper: uppdrag, ord, meningar, bygg, stycke, skriv fritt och självcheck.</p>
  <div class="meta"><span>Namn</span><span>Datum</span><span>Poäng / mål</span></div>

  <h2>1. Uppdrag <span class="step">briefing</span></h2>
  <p class="lead">${esc(mission.task_sv)}</p>
  <p class="prompt">Ta med de här punkterna:</p>
  <ul>${points}</ul>
  <div class="target">
    <span>${minWords}–${maxWords} ord</span>
    <span>ca ${minutes} min</span>
    <span>${esc(type.label)}</span>
  </div>

  <h2>2. Ord <span class="step">words</span></h2>
  <table>
    <thead><tr><th></th><th>Svenska</th><th>Engelska</th><th>Exempel</th></tr></thead>
    <tbody>${wordRows}</tbody>
  </table>
  <p class="prompt" style="margin-top:14px">Testa dig själv — skriv det svenska ordet:</p>
  <div class="drill-grid">${wordDrill}</div>

  <h2>3. Meningar <span class="step">translate into Swedish</span></h2>
  <p class="lead">Översätt meningen till svenska. Skriv hela meningen.</p>
  ${sentences}

  <h2>4. Bygg <span class="step">word order</span></h2>
  <p class="lead">Sätt orden i rätt ordning. Verbet kommer på plats 2.</p>
  ${puzzleItems}
  <div class="item keep">
    <p class="prompt">Egen mening med ett bindeord (eftersom, men, medan, så att):</p>
    ${lines(2)}
  </div>

  <h2 class="break">5. Stycke <span class="step">paragraph</span></h2>
  <p class="lead">Bygg ett stycke med startmeningarna. En eller två meningar efter varje.</p>
  ${stepItems}

  <h2 class="break">6. Skriv fritt <span class="step">free text</span></h2>
  <p class="lead">${esc(mission.task_sv)}</p>
  <div class="target">
    <span>Mål: ${minWords}–${maxWords} ord</span>
    <span>Tid: ${minutes} min</span>
    <span>Antal ord: ______</span>
  </div>
  ${lines(Math.max(14, Math.round(minWords / 8)))}

  <h2>7. Självcheck <span class="step">feedback</span></h2>
  <p class="lead">Läs igenom din text och bocka av. Ringa in det som du behöver träna mer på.</p>
  <ul>${checks}</ul>
  <div class="target" style="margin-top:14px">
    <span>Min bedömning (F E D C B A)</span>
    <span>Fel jag upprepar: </span>
  </div>
  <div class="item keep">
    <p class="prompt">Tre saker jag gör bättre nästa gång:</p>
    ${lines(3)}
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