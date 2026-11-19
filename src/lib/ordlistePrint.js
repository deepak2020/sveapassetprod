// Printable / PDF word list for Språkvägen C: every ordlista with the Swedish
// word and its English translation, grouped by chapter and level.
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
  td { padding: 0.6px 5px 0.6px 0; border-bottom: 1px solid #ececec; vertical-align: top; }
  td.n { width: 13px; color: #aaa; }
  td.sv { width: 44%; font-weight: 600; }
  footer { margin-top: 8px; font-size: 6.8pt; color: #999; text-align: center; }
`;

export function printOrdliste() {
  const win = window.open("", "_blank");
  if (!win) return false;

  const chapters = ORDLISTOR.map((ch) => ({
    chapter: ch.chapter,
    title: ch.title,
    titleEn: ch.titleEn,
    lists: ch.lists.map((l) => ({
      level: l.level,
      words: l.words || [],
    })),
  }));

  const body = chapters
    .map(
      (ch) => `
      <h2>${esc(ch.chapter)}. ${esc(ch.title)} <span class="en">${esc(ch.titleEn || "")}</span></h2>
      <div class="cols">
        ${ch.lists
          .map(
            (l) => `<div>
              <h3>Nivå ${esc(l.level)} · ${l.words.length} ord</h3>
              <table><tbody>${l.words
                .map(
                  ([sv, en], i) =>
                    `<tr><td class="n">${i + 1}</td><td class="sv">${esc(sv)}</td><td>${esc(en)}</td></tr>`
                )
                .join("")}</tbody></table>
            </div>`
          )
          .join("")}
      </div>`
    )
    .join("");

  const title = "Ordlistor Språkvägen C — svenska och engelska";

  win.document.write(`<!doctype html>
<html lang="sv">
<head>
<meta charset="utf-8" />
<title>${esc(title)}</title>
<style>${CSS}</style>
</head>
<body>
  <h1>Ordlistor · Språkvägen C</h1>
  <p class="sub">${TOTAL_WORDS} ord · svenska → engelska · alla kapitel och nivåer</p>
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