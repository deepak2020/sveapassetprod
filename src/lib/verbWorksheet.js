// Printable verb worksheet for the Verb att kunna page: the English verb is
// given and the learner writes the four Swedish forms on blank lines. The
// answer key prints on its own page at the end.
const esc = (s) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const CSS = `
  @page { size: A4; margin: 12mm 11mm 9mm; }
  * { box-sizing: border-box; }
  body { font-family: Georgia, "Times New Roman", serif; color: #111; margin: 0; font-size: 9pt; }
  h1 { font-size: 15pt; margin: 0; }
  p.sub { margin: 2px 0 0; font-size: 8.6pt; color: #555; }
  .meta { display: flex; gap: 24px; margin: 11px 0 6px; font-size: 9pt; color: #444; }
  .meta span { flex: 1; border-bottom: 1px solid #999; padding-bottom: 3px; }
  .cols { columns: 2; column-gap: 9mm; }
  .card { break-inside: avoid; page-break-inside: avoid; margin: 0 0 6px; padding-bottom: 4px; border-bottom: 1px solid #dcdcdc; }
  h3 { font-size: 9.4pt; margin: 0 0 1px; }
  h3 .tag { float: right; font-weight: 400; font-size: 6.6pt; letter-spacing: .04em; text-transform: uppercase; color: #999; }
  .blanks { display: flex; gap: 3mm; margin-top: 2px; }
  .b { flex: 1; border-bottom: 1px solid #bbb; height: 13px; position: relative; }
  .b i { position: absolute; left: 0; top: 1px; font-size: 6.2pt; font-style: normal; letter-spacing: .04em; text-transform: uppercase; color: #aaa; }
  .key { break-before: page; page-break-before: always; }
  .key .cols { columns: 2; column-gap: 9mm; }
  .key table { width: 100%; border-collapse: collapse; font-size: 8.4pt; }
  .key tr { break-inside: avoid; page-break-inside: avoid; }
  .key td { padding: 1.5px 4px 1.5px 0; border-bottom: 1px solid #eee; vertical-align: top; }
  .key td.n { width: 17px; color: #999; }
  .key td.en { width: 34%; color: #555; }
  footer { margin-top: 8px; font-size: 7pt; color: #999; text-align: center; }
`;

export function printVerbWorksheet(verbs, groupLabel = "") {
  const win = window.open("", "_blank");
  if (!win) return false;

  const list = (verbs || []).slice().sort((a, b) => a.infinitive.localeCompare(b.infinitive, "sv"));

  const cards = list
    .map((v, i) => `<div class="card">
        <h3>${i + 1}. ${esc(v.english)}${v.group ? `<span class="tag">grupp ${esc(v.group)}</span>` : ""}</h3>
        <div class="blanks">
          <span class="b"><i>infinitiv</i></span>
          <span class="b"><i>presens</i></span>
          <span class="b"><i>preteritum</i></span>
          <span class="b"><i>supinum</i></span>
        </div>
      </div>`)
    .join("");

  const keyRows = list
    .map((v, i) => `<tr>
        <td class="n">${i + 1}</td>
        <td class="en">${esc(v.english)}</td>
        <td><b>${esc(v.infinitive)}</b> · ${esc(v.present)} · ${esc(v.past)}${
          (v.supine || "").trim() ? ` · ${esc(v.supine)}` : ""
        }</td>
      </tr>`)
    .join("");

  const title = "Verb att kunna – arbetsblad";

  win.document.write(`<!doctype html>
<html lang="sv">
<head>
<meta charset="utf-8" />
<title>${esc(title)}</title>
<style>${CSS}</style>
</head>
<body>
  <h1>Verb att kunna · arbetsblad</h1>
  <p class="sub">${esc(groupLabel)} · ${list.length} verb · skriv de fyra formerna</p>
  <p class="sub">Skriv infinitiv, presens, preteritum och supinum. <em>Write the four Swedish forms for each English verb.</em></p>
  <div class="meta"><span>Namn</span><span>Datum</span><span>Rätt: ____ / ${list.length}</span></div>
  <div class="cols">${cards}</div>
  <footer>Sveapasset · Verb att kunna · SFI C</footer>

  <div class="key">
    <h1>Facit · ${list.length} verb</h1>
    <p class="sub">Infinitiv · presens · preteritum · supinum</p>
    <div class="cols"><table><tbody>${keyRows}</tbody></table></div>
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