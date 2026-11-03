import { topicWords } from "@/lib/ordlistor";

export const WORKSHEET_DIRECTIONS = [
  { id: "en-sv", label: "Engelska → Svenska", sub: "Skriv det svenska ordet", answerLang: "sv" },
  { id: "sv-en", label: "Svenska → Engelska", sub: "Skriv det engelska ordet", answerLang: "en" },
];

// The numbered items of one word list, in list order. The answer travels with
// the item so the correction step can mark the sheet.
export function worksheetItems(chapter, level, direction) {
  return topicWords(chapter, level).map((w, i) => ({
    n: i + 1,
    prompt: direction === "en-sv" ? w.en : w.sv,
    answer: direction === "en-sv" ? w.sv : w.en,
  }));
}

const esc = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

// Opens a clean print-only page (no app chrome) and sends it to the printer
export function printWorksheet({ title, directionLabel, instruction, items }) {
  const win = window.open("", "_blank");
  if (!win) return false;

  const rows = items
    .map((it) => `<tr><td class="n">${it.n}.</td><td class="p">${esc(it.prompt)}</td><td class="a"></td></tr>`)
    .join("");

  win.document.write(`<!doctype html>
<html lang="sv">
<head>
<meta charset="utf-8" />
<title>${esc(title)}</title>
<style>
  @page { size: A4; margin: 16mm 14mm; }
  * { box-sizing: border-box; }
  body { font-family: Georgia, "Times New Roman", serif; color: #111; margin: 0; }
  h1 { font-size: 17pt; margin: 0 0 4px; }
  p.sub { margin: 0 0 3px; font-size: 10pt; color: #444; }
  .meta { display: flex; gap: 26px; margin: 14px 0 16px; font-size: 10pt; color: #444; }
  .meta span { flex: 1; border-bottom: 1px solid #999; padding-bottom: 3px; }
  table { width: 100%; border-collapse: collapse; }
  td { padding: 7px 0 3px; border-bottom: 1px solid #d4d4d4; font-size: 11pt; vertical-align: bottom; }
  td.n { width: 30px; color: #777; font-size: 10pt; }
  td.p { width: 44%; font-weight: 600; }
  td.a { width: 52%; }
  footer { margin-top: 18px; font-size: 9pt; color: #777; }
</style>
</head>
<body>
  <h1>${esc(title)}</h1>
  <p class="sub">${esc(directionLabel)} · ${items.length} ord</p>
  <p class="sub">${esc(instruction)}</p>
  <div class="meta"><span>Namn</span><span>Datum</span><span>Svar: ____ / ${items.length}</span></div>
  <table>${rows}</table>
  <footer>Sveapasset · Ordlistor Språkvägen C</footer>
</body>
</html>`);
  win.document.close();
  setTimeout(() => {
    win.focus();
    win.print();
  }, 300);
  return true;
}