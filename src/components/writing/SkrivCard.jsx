import { Link } from "react-router-dom";
import { PenLine, ArrowRight } from "lucide-react";

// Entry point shown at the top of the Skriva page.
export default function SkrivCard() {
  return (
    <Link
      to="/writing-practice"
      className="block rounded-2xl border-2 border-amber-300 dark:border-amber-700 bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 dark:from-amber-950/30 dark:via-orange-950/20 dark:to-rose-950/20 p-5 transition-shadow hover:shadow-md"
    >
      <div className="flex items-start gap-3">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shrink-0 shadow-sm">
          <PenLine className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold leading-tight">Skrivträning</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            30 riktiga skrivuppgifter för SFI kurs C — mejl och åsiktstexter.
          </p>
          <p className="text-[11px] italic text-muted-foreground/80 mt-0.5">
            Writing practice for SFI course C, graded by Svea
          </p>
        </div>
        <ArrowRight className="w-4 h-4 text-amber-700 dark:text-amber-300 shrink-0 mt-1" />
      </div>
    </Link>
  );
}