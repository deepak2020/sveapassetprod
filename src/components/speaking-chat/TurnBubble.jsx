import { useState } from "react";
import { CheckCircle2, AlertCircle, ChevronDown } from "lucide-react";
import SpeakButton from "@/components/shared/SpeakButton";

// Traffic-light dot per user turn: green = perfect, amber = small slip, red = try again.
function scoreTone(score, hasMistakes) {
  if (!hasMistakes && (score ?? 100) >= 90) return "green";
  if ((score ?? 0) >= 70) return "amber";
  return "red";
}

const TONE_STYLES = {
  green: "border-green-300 dark:border-green-700",
  amber: "border-amber-300 dark:border-amber-700",
  red: "border-red-300 dark:border-red-700",
};

const TONE_DOT = {
  green: "bg-green-500",
  amber: "bg-amber-500",
  red: "bg-red-500",
};

// Render one conversation turn — Svea or user.
export default function TurnBubble({ turn }) {
  const [expanded, setExpanded] = useState(false);

  if (turn.role === "svea") {
    return (
      <div className="flex gap-2">
        <div className="w-10 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-[10px] font-bold shrink-0 px-1">
          SveAI
        </div>
        <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-muted px-3.5 py-2.5">
          <div className="flex items-start gap-2">
            <p className="text-sm text-foreground flex-1">{turn.text_sv}</p>
            <SpeakButton text={turn.text_sv} lang="sv-SE" />
          </div>
          {turn.text_en && (
            <p className="text-xs text-muted-foreground italic mt-1">{turn.text_en}</p>
          )}
        </div>
      </div>
    );
  }

  // User turn
  const hasMistakes = (turn.mistakes?.length ?? 0) > 0;
  const tone = scoreTone(turn.grammar_score, hasMistakes);
  const wasCorrected =
    turn.corrected_sv && turn.corrected_sv.trim() !== (turn.text_sv || "").trim();

  return (
    <div className="flex justify-end gap-2">
      <div className={`max-w-[85%] rounded-2xl rounded-tr-sm bg-primary/5 border ${TONE_STYLES[tone]} px-3.5 py-2.5`}>
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${TONE_DOT[tone]} shrink-0`} />
          <p className="text-sm text-foreground flex-1">{turn.text_sv}</p>
        </div>

        {(wasCorrected || hasMistakes || turn.encouragement_en) && (
          <button
            onClick={() => setExpanded((e) => !e)}
            className="mt-1.5 flex items-center gap-1 text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            {tone === "green" ? (
              <>
                <CheckCircle2 className="w-3 h-3 text-green-600" />
                Nice.
              </>
            ) : (
              <>
                <AlertCircle className="w-3 h-3" />
                {wasCorrected ? "Svea corrected this" : "See feedback"}
              </>
            )}
            <ChevronDown className={`w-3 h-3 transition-transform ${expanded ? "rotate-180" : ""}`} />
          </button>
        )}

        {expanded && (
          <div className="mt-2 pt-2 border-t border-border/40 space-y-2">
            {wasCorrected && (
              <div>
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-0.5">Corrected</p>
                <p className="text-sm font-medium text-green-700 dark:text-green-400">
                  {turn.corrected_sv}
                </p>
              </div>
            )}
            {hasMistakes && (
              <ul className="space-y-1">
                {turn.mistakes.map((m, i) => (
                  <li key={i} className="text-xs bg-amber-50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/40 rounded-lg px-2 py-1.5">
                    <span className="line-through text-red-600 dark:text-red-400">{m.wrong}</span>
                    {" → "}
                    <span className="font-semibold text-green-700 dark:text-green-400">{m.correct}</span>
                    {m.rule && <p className="text-[11px] text-muted-foreground mt-0.5">{m.rule}</p>}
                  </li>
                ))}
              </ul>
            )}
            {turn.encouragement_en && (
              <p className="text-xs text-muted-foreground italic">💬 {turn.encouragement_en}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}