import { useState } from "react";
import { Copy, Printer, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const SITE = "https://sveapasset.se";

function printFlyer(link, school) {
  const w = window.open("", "_blank");
  w.document.write(`<html><head><title>Sveapasset flyer</title></head><body style="font-family:Arial,sans-serif;text-align:center;padding:48px;color:#161d27">
  <h1 style="color:#154184;font-size:40px;margin:0">Sveapasset</h1>
  <p style="font-size:20px">Öva svenska gratis · Practice Swedish for free</p>
  ${school ? `<p style="font-size:18px"><b>${school.replace(/</g, "")}</b></p>` : ""}
  <ul style="text-align:left;display:inline-block;font-size:18px;line-height:1.8">
  <li>SFI kurs A–D: lektioner, ord och grammatik</li><li>Tala: öva att prata med AI</li><li>Samhällskunskap och medborgarskapsprov 2027</li></ul>
  <p style="font-size:16px;margin-top:32px">Gå till · Go to:</p>
  <p style="font-size:26px;font-weight:bold;color:#154184">${link}</p>
  <script>window.onload=()=>window.print()</script></body></html>`);
  w.document.close();
}

export default function ClassLinkBox() {
  const [school, setSchool] = useState("");
  const [copied, setCopied] = useState(false);
  const slug = school.trim().toLowerCase().replace(/[^a-z0-9åäö]+/g, "-").replace(/^-|-$/g, "");
  const link = slug ? `${SITE}/?ref=${slug}` : SITE;

  const copy = async () => {
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl border border-border/50 bg-card p-6 space-y-4">
      <h2 className="text-xl font-bold">Din klasslänk · Your class link</h2>
      <Input placeholder="Skolans namn · School name (optional)" value={school} onChange={(e) => setSchool(e.target.value)} />
      <div className="rounded-xl bg-muted px-4 py-3 font-mono text-sm break-all">{link}</div>
      <div className="flex flex-wrap gap-2">
        <Button onClick={copy} className="gap-2">{copied ? <Check /> : <Copy />} {copied ? "Kopierad" : "Kopiera länk"}</Button>
        <Button variant="outline" onClick={() => printFlyer(link, school.trim())} className="gap-2"><Printer /> Skriv ut flyer</Button>
      </div>
    </div>
  );
}