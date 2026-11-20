// Printable / PDF word list for Språkvägen C: every ordlista with the Swedish
// word, its English translation and an example sentence pair.
import { ORDLISTOR, TOTAL_WORDS } from "@/data/sprakvagenC";

const esc = (s) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const CSS = `
  @page { size: A4; margin: 11mm 10mm 9mm; }
  * { box-sizing: border-box; }
  body { font-family: Georgia, "Times New Roman", serif; color: #111; margin: 0; font-size: 8.6pt; line-height: 1.24; }
  h1 { font-size: 14pt; margin: 0; }
  p.sub { margin: 1px 0 0; font-size: 8pt; color: #555; }
  h2 { font-size: 9.8pt; margin: 10px 0 3px; padding-bottom: 2px; border-bottom: 1.4px solid #111; break-after: avoid; page-break-after: avoid; }
  h2 .en { font-weight: 400; font-style: italic; color: #777; font-size: 8pt; }
  h3 { font-size: 7.4pt; text-transform: uppercase; letter-spacing: .07em; color: #777; margin: 5px 0 2px; break-after: avoid; page-break-after: avoid; }
  .cols { columns: 2; column-gap: 8mm; }
  table { width: 100%; border-collapse: collapse; font-size: 8pt; }
  tr { break-inside: avoid; page-break-inside: avoid; }
  td { padding: 1px 5px 1px 0; vertical-align: top; }
  td.n { width: 13px; color: #aaa; }
  td.sv { width: 42%; font-weight: 600; border-bottom: 1px solid #ececec; }
  td.tr { border-bottom: 1px solid #ececec; }
  td.ex { padding: 0 5px 3px 0; font-size: 7.4pt; color: #555; }
  td.ex .en { display: block; color: #8a8a8a; font-style: italic; }
  footer { margin-top: 8px; font-size: 6.8pt; color: #999; text-align: center; }
`;

function wordRows(words, examples) {
  return words
    .map(([sv, en], i) => {
      const ex = examples[sv];
      const sentence = ex?.sentence_sv
        ? `<tr><td></td><td class="ex" colspan="2">${esc(ex.sentence_sv)}${
            ex.sentence_en ? `<span class="en">${esc(ex.sentence_en)}</span>` : ""
          }</td></tr>`
        : "";
      return `<tr><td class="n">${i + 1}</td><td class="sv">${esc(sv)}</td><td class="tr">${esc(en)}</td></tr>${sentence}`;
    })
    .join("");
}

export function printOrdliste(examples = {}) {
  const win = window.open("", "_blank");
  if (!win) return false;

  const body = ORDLISTOR.map(
    (ch) => `
      <h2>${esc(ch.chapter)}. ${esc(ch.title)} <span class="en">${esc(ch.titleEn || "")}</span></h2>
      <div class="cols">
        ${ch.lists
          .map(
            (l) => `<div>
              <h3>Nivå ${esc(l.level)} · ${l.words.length} ord</h3>
              <table><tbody>${wordRows(l.words, examples)}</tbody></table>
            </div>`
          )
          .join("")}
      </div>`
  ).join("");

  const title = "Ordlistor Språkvägen C — svenska, engelska och exempelmeningar";

  win.document.write(`<!doctype html>
<html lang="sv">
<head>
<meta charset="utf-8" />
<title>${esc(title)}</title>
<style>${CSS}</style>
</head>
<body>
  <h1>Ordlistor · Språkvägen C</h1>
  <p class="sub">${TOTAL_WORDS} ord · svenska → engelska · en exempelmening per ord</p>
  ${body}
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