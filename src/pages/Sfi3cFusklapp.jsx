import { Link } from "react-router-dom";
import { ArrowLeft, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SECTIONS } from "@/data/sfi3cFusklapp";
import { printFusklapp } from "@/lib/fusklappPrint";
import FusklappTable from "@/components/fusklapp/FusklappTable";

export default function Sfi3cFusklapp() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 pb-24 md:pb-10 space-y-5">
      <Link
        to="/3c"
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Skriv & tala 3C
      </Link>

      <div className="space-y-1">
        <h1 className="text-2xl font-bold">
          Fusklapp · <span className="font-display italic font-normal text-muted-foreground">SFI 3C</span>
        </h1>
        <p className="text-sm text-muted-foreground">
          Verb och former, ord, adjektiv och adverb, prepositioner, åsikter och fraser för muntligt prov.
        </p>
        <Button variant="outline" size="sm" className="mt-2" onClick={() => printFusklapp()}>
          <Printer className="w-4 h-4" /> Skriv ut fusklappen
        </Button>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {SECTIONS.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className="rounded-full border border-border/60 bg-card px-2.5 py-1 text-[11px] font-medium hover:border-primary/50 hover:text-primary transition-colors"
          >
            {section.title}
          </a>
        ))}
      </div>

      {SECTIONS.map((section) => (
        <section key={section.id} id={section.id} className="space-y-3 scroll-mt-4">
          <div className="space-y-0.5">
            <h2 className="text-sm font-semibold">{section.title}</h2>
            <p className="text-[11px] italic text-muted-foreground">{section.en}</p>
          </div>
          {section.intro && <p className="text-xs text-muted-foreground">{section.intro}</p>}
          {section.tables.map((table, index) => (
            <FusklappTable key={index} table={table} />
          ))}
          {section.notes.length > 0 && (
            <ul className="rounded-xl border border-primary/20 bg-primary/5 p-3 space-y-1">
              {section.notes.map((note) => (
                <li key={note} className="flex gap-2 text-xs text-foreground">
                  <span className="text-primary">•</span>
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}
    </div>
  );
}