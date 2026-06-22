import { Lightbulb, ThumbsUp, CheckCircle2, MessageSquare, BookOpen, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import SveaLogo from "@/components/shared/SveaLogo";
import SpeakButton from "@/components/shared/SpeakButton";
import { diffWordsInline } from "@/lib/wordDiff";

function normalize(text) {
  return text?.trim().replace(/\s+/g, " ") || "";
}

function AnnotatedText({ original, correctedText }) {
  if (!correctedText || normalize(original) === normalize(correctedText)) return null;
  const segments = diffWordsInline(original || "", correctedText);
  return (
    <span className="text-sm leading-relaxed">
      {segments.map((seg, i) => {
        if (seg.type === "same")
          return <span key={i} className="text-foreground">{seg.text} </span>;
        if (seg.type === "del")
          return <s key={i} className="text-red-500 dark:text-red-400 mr-1">{seg.text}</s>;
        if (seg.type === "ins")
          return (
            <span key={i} className="font-semibold text-green-700 dark:text-green-400 mr-1">
              {seg.text}{" "}
            </span>
          );
        // replace: wrong → right, inline
        return (
          <span key={i} className="mr-1">
            <s className="text-red-500 dark:text-red-400">{seg.del.join(" ")}</s>{" "}
            <span className="font-semibold text-green-700 dark:text-green-400">{seg.ins.join(" ")}</span>{" "}
          </span>
        );
      })}
    </span>
  );
}

const SCORE_STYLES = {
  great: {
    bg: "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800/40",
    text: "text-green-800 dark:text-green-300",
    icon: <ThumbsUp className="w-4 h-4 text-green-600 shrink-0" />,
  },
  good: {
    bg: "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800/40",
    text: "text-blue-800 dark:text-blue-300",
    icon: <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />,
  },
  needs_work: {
    bg: "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/40",
    text: "text-amber-800 dark:text-amber-200",
    icon: <MessageSquare className="w-4 h-4 text-amber-500 shrink-0" />,
  },
};

function GrammarIssueCard({ issue }) {
  return (
    <div className="rounded-xl border border-amber-200 dark:border-amber-800/40 bg-amber-50 dark:bg-amber-950/20 px-3 py-2.5">
      <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
        <span className="text-xs font-mono bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 line-through px-1.5 py-0.5 rounded">
          {issue.wrong}
        </span>
        <span className="text-xs text-muted-foreground">→</span>
        <span className="text-xs font-mono font-semibold bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-400 px-1.5 py-0.5 rounded">
          {issue.correct}
        </span>
      </div>
      <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
        💡 {issue.explanation}
      </p>
    </div>
  );
}

export default function SveaProductionFeedback({ userAnswer, feedback, loading }) {
  return (
    <div className="rounded-xl border border-violet-200 dark:border-violet-800 bg-violet-50/60 dark:bg-violet-950/20 p-4 space-y-3">
      {/* Svea header */}
      <div className="flex items-baseline gap-2">
        <SveaLogo className="text-base" />
        <span className="text-xs text-violet-600 dark:text-violet-400 italic">your tutor</span>
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-sm text-violet-600 dark:text-violet-400">
          <Loader2 className="w-4 h-4 animate-spin" /> Reviewing your answer…
        </div>
      )}

      {!loading && feedback && (
        <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          {/* Corrected text with diff + listen */}
          {feedback.corrected_text && normalize(feedback.corrected_text) !== normalize(userAnswer) && (
            <div className="rounded-xl p-3 border border-green-200 dark:border-green-800/40 bg-green-50 dark:bg-green-950/30">
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-sm font-medium text-green-700 dark:text-green-400">Corrected:</p>
                <SpeakButton text={feedback.corrected_text} lang="sv-SE" />
              </div>
              <AnnotatedText original={userAnswer || ""} correctedText={feedback.corrected_text} />
            </div>
          )}

          {/* Overall verdict */}
          {feedback.overall && (() => {
            const style = SCORE_STYLES[feedback.score] || SCORE_STYLES.good;
            return (
              <div className={`flex items-start gap-2 rounded-xl px-3 py-2.5 border ${style.bg}`}>
                {style.icon}
                <p className={`text-xs font-medium leading-relaxed ${style.text}`}>{feedback.overall}</p>
              </div>
            );
          })()}

          {/* Grammar issue cards */}
          {feedback.grammar_issues?.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-amber-500" />
                Grammar notes ({feedback.grammar_issues.length})
              </p>
              {feedback.grammar_issues.map((issue, i) => (
                <GrammarIssueCard key={i} issue={issue} />
              ))}
            </div>
          )}

          {/* Tip */}
          {feedback.suggestion && (
            <div className="flex items-start gap-2 bg-violet-100/60 dark:bg-violet-900/30 border border-violet-200/60 dark:border-violet-800/40 rounded-xl px-3 py-2.5">
              <Lightbulb className="w-3.5 h-3.5 text-violet-500 shrink-0 mt-0.5" />
              <p className="text-xs text-violet-800 dark:text-violet-300">{feedback.suggestion}</p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}