// Printable worksheet for all Språkvägen C word lists: the English word is
// printed and the learner writes the Swedish word on the line. The answer key
// prints on its own page at the end.
import { ORDLISTOR, TOTAL_WORDS } from "@/data/sprakvagenC";

const esc = (s) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const CSS = `
  @page { size: A4; margin: 13mm 12mm 10mm; }
  * { box-sizing: border-box; }
  body { font-family: Georgia, "Times New Roman", serif; color: #111; margin: 0; font-size: 9.6pt; }
  h1 { font-size: 15pt; margin: 0; }
  p.sub { margin: 2px 0 0; font-size: 9pt; color: #555; }
  .meta { display: flex; gap: 24px; margin: 12px 0 4px; font-size: 9.5pt; color: #444; }
  .meta span { flex: 1; border-bottom: 1px solid #999; padding-bottom: 3px; }
  h2 { font-size: 10pt; margin: 11px 0 3px; padding-bottom: 2px; border-bottom: 1.3px solid #111; break-after: avoid; page-break-after: avoid; }
  h2 .en { font-weight: 400; font-style: italic; color: #777; font-size: 8.6pt; }
  .cols { columns: 2; column-gap: 9mm; }
  table { width: 100%; border-collapse: collapse; font-size: 9.4pt; }
  tr { break-inside: avoid; page-break-inside: avoid; }
  td { padding: 5px 4px 3px 0; vertical-align: bottom; border-bottom: 1px solid #cfcfcf; }
  td.n { width: 17px; color: #999; font-size: 8.6pt; }
  td.p { width: 45%; font-weight: 600; }
  .key { break-before: page; page-break-before: always; }
  .key h1 { font-size: 14pt; }
  .key .cols { columns: 3; column-gap: 7mm; }
  .key table { font-size: 8.6pt; }
  .key td { padding: 1px 4px 1px 0; border-bottom: 1px solid #eee; }
  .key td.n { width: 15px; }
  .key .sv { font-weight: 600; }
  footer { margin-top: 9px; font-size: 7.4pt; color: #999; text-align: center; }
`;

export function printOrdlisteWorksheet() {
  const win = window.open("", "_blank");
  if (!win) return false;

  let n = 0;
  const keyRows = [];
  const body = ORDLISTOR.map((ch) => {
    const lists = ch.lists
      .map((l) => {
        const rows = l.words
          .map(([sv, en]) => {
            n += 1;
            keyRows.push(`<tr><td class="n">${n}</td><td class="sv">${esc(sv)}</td><td>${esc(en)}</td></tr>`);
            return `<tr><td class="n">${n}.</td><td class="p">${esc(en)}</td><td></td></tr>`;
          })
          .join("");
        return `<div><table><tbody>${rows}</tbody></table></div>`;
      })
      .join("");
    return `<h2>${esc(ch.chapter)}. ${esc(ch.title)} <span class="en">${esc(ch.titleEn || "")}</span></h2>
      <div class="cols">${lists}</div>`;
  }).join("");

  const title = "Arbetsblad — skriv det svenska ordet";

  win.document.write(`<!doctype html>
<html lang="sv">
<head>
<meta charset="utf-8" />
<title>${esc(title)}</title>
<style>${CSS}</style>
</head>
<body>
  <h1>${esc(title)}</h1>
  <p class="sub">Språkvägen C · ${TOTAL_WORDS} ord · engelska → svenska</p>
  <p class="sub">Skriv det svenska ordet på raden. <em>Write the Swedish word for the English.</em></p>
  <div class="meta"><span>Namn</span><span>Datum</span><span>Svar: ____ / ${n}</span></div>
  ${body}
  <footer>Sveapasset · Ordlistor Språkvägen C</footer>

  <div class="key">
    <h1>Facit · ${n} ord</h1>
    <p class="sub">Svenska ordet och den engelska översättningen.</p>
    <div class="cols"><table><tbody>${keyRows.join("")}</tbody></table></div>
  </div>
</body>
</html>`);
  win.document.close();
  setTimeout(() => {
    win.focus();
    win.print();
  }, 300);
  return true;
}