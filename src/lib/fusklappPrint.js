// A4 printout of the whole SFI 3C cheat sheet.
import { SECTIONS } from "@/data/sfi3cFusklapp";

const esc = (s) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

export function printFusklapp() {
  const win = window.open("", "_blank");
  if (!win) return false;

  const body = SECTIONS.map((section) => {
    const tables = (section.tables || [])
      .map(
        (table) => `
        ${table.label ? `<p class="lab">${esc(table.label)}</p>` : ""}
        <table>
          <thead><tr>${table.columns.map((c) => `<th>${esc(c)}</th>`).join("")}</tr></thead>
          <tbody>${table.rows
            .map((row) => `<tr>${row.map((cell) => `<td>${esc(cell)}</td>`).join("")}</tr>`)
            .join("")}</tbody>
        </table>`
      )
      .join("");
    const notes = (section.notes || []).length
      ? `<ul class="notes">${section.notes.map((n) => `<li>${esc(n)}</li>`).join("")}</ul>`
      : "";
    return `<section>
      <h2>${esc(section.title)} <span class="en">${esc(section.en)}</span></h2>
      ${section.intro ? `<p class="intro">${esc(section.intro)}</p>` : ""}
      ${tables}${notes}
    </section>`;
  }).join("");

  win.document.write(`<!doctype html>
<html lang="sv">
<head>
<meta charset="utf-8" />
<title>Fusklapp SFI 3C</title>
<style>
  @page { size: A4; margin: 10mm; }
  * { box-sizing: border-box; }
  body { font-family: Georgia, "Times New Roman", serif; color: #111; margin: 0; font-size: 8.4pt; line-height: 1.25; }
  h1 { font-size: 15pt; margin: 0; }
  p.sub { margin: 1px 0 6px; font-size: 7.8pt; color: #666; }
  section { margin-bottom: 7px; break-inside: auto; }
  h2 { font-size: 9pt; text-transform: uppercase; letter-spacing: .07em; margin: 8px 0 3px; padding-bottom: 1.5px; border-bottom: 1.3px solid #111; break-after: avoid; page-break-after: avoid; }
  h2 .en { font-weight: 400; letter-spacing: 0; text-transform: none; color: #888; font-size: 7pt; }
  .intro { margin: 0 0 3px; font-size: 8pt; color: #333; }
  .lab { margin: 5px 0 1.5px; font-size: 7.4pt; font-weight: 700; color: #555; break-after: avoid; page-break-after: avoid; }
  table { width: 100%; border-collapse: collapse; font-size: 7.6pt; }
  th, td { text-align: left; padding: 1px 4px 1px 0; border-bottom: 1px solid #e6e6e6; vertical-align: top; }
  th { font-size: 6.6pt; text-transform: uppercase; letter-spacing: .05em; color: #777; }
  td:first-child { font-weight: 600; white-space: nowrap; }
  tr { break-inside: avoid; page-break-inside: avoid; }
  ul.notes { margin: 3px 0 0; padding-left: 14px; font-size: 7.8pt; }
  ul.notes li { margin-bottom: 1px; }
  footer { margin-top: 6px; font-size: 6.8pt; color: #999; }
</style>
</head>
<body>
  <h1>Fusklapp · SFI 3C</h1>
  <p class="sub">Verb och former · ord · adjektiv och adverb · prepositioner · åsikter · fraser för muntligt prov</p>
  ${body}
  <footer>Sveapasset · Fusklapp SFI 3C</footer>
</body>
</html>`);
  win.document.close();
  setTimeout(() => {
    win.focus();
    win.print();
  }, 300);
  return true;
}