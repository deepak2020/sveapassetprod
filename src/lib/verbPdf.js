// Printable verb reference for the Verb att kunna page: every verb with its
// four forms and the three example sentences (presens, preteritum, supinum).
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
  .head { display: flex; align-items: baseline; flex-wrap: wrap; gap: 4px 12px; }
  h1 { font-size: 14pt; margin: 0; }
  p.sub { margin: 1px 0 0; font-size: 8pt; color: #555; }
  .howto { margin: 6px 0 0; padding: 5px 8px; border: 1px solid #ccc; background: #fafafa; font-size: 7.8pt; line-height: 1.28; columns: 2; column-gap: 8mm; }
  .howto strong { display: block; margin-bottom: 1px; }
  .cols { columns: 2; column-gap: 8mm; }
  .card { break-inside: avoid; page-break-inside: avoid; margin: 0 0 5px; padding-bottom: 4px; border-bottom: 1px solid #ececec; }
  h3 { font-size: 9pt; margin: 0; }
  h3 .en { font-weight: 400; font-style: italic; color: #666; font-size: 7.6pt; }
  h3 .tag { float: right; font-weight: 400; font-size: 6.6pt; letter-spacing: .04em; text-transform: uppercase; color: #999; }
  .forms { margin: 1px 0 2px; font-size: 7.8pt; color: #333; }
  .forms b { font-weight: 600; }
  .forms .lbl { color: #888; font-size: 6.8pt; text-transform: uppercase; letter-spacing: .04em; }
  .ex { margin: 0; font-size: 7.6pt; color: #444; }
  .ex .lbl { display: inline-block; min-width: 15mm; color: #999; font-size: 6.6pt; text-transform: uppercase; letter-spacing: .04em; }
  footer { margin-top: 7px; font-size: 6.8pt; color: #999; text-align: center; }
`;

export function printVerbList(verbs, groupLabel) {
  const win = window.open("", "_blank");
  if (!win) return false;

  const list = (verbs || []).slice().sort((a, b) => a.infinitive.localeCompare(b.infinitive, "sv"));

  const cards = list
    .map((v) => {
      const forms = [
        ["Presens", v.present],
        ["Preteritum", v.past],
        ["Supinum", v.supine],
      ]
        .filter(([, value]) => (value || "").trim())
        .map(([label, value]) => `<span class="lbl">${label}</span> <b>${esc(value)}</b>`)
        .join(" · ");

      const examples = [
        ["Presens", v.present_sentence],
        ["Preteritum", v.past_sentence],
        ["Supinum", v.supine_sentence],
      ]
        .filter(([, sentence]) => (sentence || "").trim())
        .map(([label, sentence]) => `<p class="ex"><span class="lbl">${label}</span>${esc(sentence)}</p>`)
        .join("");

      return `<div class="card">
        <h3>${esc(v.infinitive)} <span class="en">${esc(v.english)}</span>${
          v.group ? `<span class="tag">grupp ${esc(v.group)}</span>` : ""
        }</h3>
        <p class="forms">${forms}</p>
        ${examples}
      </div>`;
    })
    .join("");

  const title = "Verb att kunna – SFI C";

  win.document.write(`<!doctype html>
<html lang="sv">
<head>
<meta charset="utf-8" />
<title>${esc(title)}</title>
<style>${CSS}</style>
</head>
<body>
  <div class="head">
    <h1>Verb att kunna · SFI C</h1>
    <p class="sub">${esc(groupLabel)} · ${list.length} verb · fyra former och tre exempelmeningar per verb</p>
  </div>
  <div class="howto">
    <strong>Så använder du listan</strong>
    1. Läs infinitiven högt och säg de tre formerna utan att titta: presens, preteritum, supinum.<br>
    2. Läs exempelmeningarna högt — då hör du formen i en riktig mening.<br>
    3. Vik pappret så att formerna försvinner och skriv dem själv. Rätta direkt.<br>
    4. Markera de verb du missade och gör om dem i morgon.
  </div>
  <div class="cols" style="margin-top:7px">${cards}</div>
  <footer>Sveapasset · Verb att kunna · SFI C</footer>
</body>
</html>`);
  win.document.close();
  setTimeout(() => {
    win.focus();
    win.print();
  }, 300);
  return true;
}