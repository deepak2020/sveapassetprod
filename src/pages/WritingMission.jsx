import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, Loader2, Trash2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { useMissions, useMissionProgress, useMissionSubmissions } from "@/hooks/useWritingMissions";
import { useErrorLog, logWritingErrors, summarizeErrors } from "@/hooks/useErrorLog";
import { addVocabSRSCards } from "@/hooks/useVocabSRS";
import { awardXP } from "@/lib/xp";
import {
  MISSION_XP,
  countWords,
  errorsPer100,
  fullFeedback,
  nextStage,
  progressPercent,
} from "@/lib/writingMissions";
import StageBar from "@/components/writing-missions/StageBar";
import BriefingStage from "@/components/writing-missions/BriefingStage";
import WordsStage from "@/components/writing-missions/WordsStage";
import SentencesStage from "@/components/writing-missions/SentencesStage";
import BuildStage from "@/components/writing-missions/BuildStage";
import ParagraphStage from "@/components/writing-missions/ParagraphStage";
import FreeTextStage from "@/components/writing-missions/FreeTextStage";
import MissionFeedbackStage from "@/components/writing-missions/MissionFeedbackStage";

const giveXP = (amount, label) => {
  awardXP(base44, amount, label).catch(() => {});
};

export default function WritingMission() {
  const { missionId } = useParams();
  const [params] = useSearchParams();
  const { missions, loading } = useMissions();
  const { progressFor, save: saveProgress, loading: progressLoading, signedIn } = useMissionProgress();
  const { submissions, save: saveSubmission, remove: removeSubmission } = useMissionSubmissions();
  const { errors } = useErrorLog(signedIn);

  const [stage, setStage] = useState(null);
  const [missedWords, setMissedWords] = useState([]);
  const [latest, setLatest] = useState(null);
  const [draft, setDraft] = useState("");
  const [rewriteOf, setRewriteOf] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const mission = missions.find((m) => m.id === missionId);
  const progress = progressFor(missionId);
  const completed = progress?.completed_stages || [];
  const missionSubs = useMemo(
    () => submissions.filter((s) => s.mission_id === missionId),
    [submissions, missionId]
  );

  const warmUp = useMemo(() => {
    const groups = summarizeErrors(errors);
    return groups.slice(0, 2).flatMap((group) => group.rows).slice(0, 2);
  }, [errors]);

  useEffect(() => {
    if (stage !== null || loading || progressLoading) return;
    const requested = Number(params.get("stage"));
    setStage(requested >= 1 && requested <= 7 ? requested : nextStage(progress));
  }, [stage, loading, progressLoading, progress, params]);

  const completeStage = async (value, extra = {}) => {
    const next = Array.from(new Set([...(completed || []), value])).sort((a, b) => a - b);
    await saveProgress(missionId, {
      completed_stages: next,
      current_stage: Math.min(7, value + 1),
      ...extra,
    });
    setStage(Math.min(7, value + 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const showFeedback = latest || (missionSubs[0]
    ? {
        ...(missionSubs[0].feedback_json || {}),
        text: missionSubs[0].text,
        word_count: missionSubs[0].word_count,
        errors_per_100: missionSubs[0].errors_per_100,
        id: missionSubs[0].id,
      }
    : null);

  const submitText = async ({ text, seconds, mode }) => {
    setBusy(true);
    setError("");
    try {
      const data = await fullFeedback({ mission, text, stageMode: mode });
      const wordCount = countWords(text);
      const per100 = errorsPer100((data.errors || []).length, wordCount);
      const previous = missionSubs[0];

      const record = await saveSubmission({
        mission_id: mission.id,
        prompt_title: mission.title,
        prompt_type: mission.type,
        text,
        word_count: wordCount,
        time_used_seconds: seconds,
        mode: mode === "test" ? "test" : "practice",
        estimated_grade: data.estimated_grade,
        errors_per_100: per100,
        feedback_json: data,
        rewrite_of: rewriteOf || "",
      });

      setLatest({ ...data, text, word_count: wordCount, errors_per_100: per100, id: record?.id });

      try {
        await logWritingErrors(data.errors || []);
      } catch {
        // the error log is a bonus — never block the feedback screen on it
      }

      giveXP(MISSION_XP.submit, "Text inlämnad");
      if (rewriteOf) giveXP(MISSION_XP.rewrite, "Omskriven text");
      if (previous?.errors_per_100 != null && per100 < previous.errors_per_100) {
        giveXP(MISSION_XP.fewer_errors, "Färre fel än förra gången!");
      }

      await saveProgress(missionId, {
        completed_stages: Array.from(new Set([...completed, 6, 7])).sort((a, b) => a - b),
        current_stage: 7,
      });
      setRewriteOf("");
      setStage(7);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e) {
      setError(e?.response?.data?.message || "Svea kunde inte läsa texten just nu. Försök igen.");
    } finally {
      setBusy(false);
    }
  };

  const startRewrite = () => {
    setDraft(showFeedback?.text || "");
    setRewriteOf(showFeedback?.id || "");
    setStage(6);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteSubmission = async (id) => {
    if (!window.confirm("Radera den här texten? Det går inte att ångra.")) return;
    await removeSubmission(id);
    setLatest(null);
    setStage(6);
  };

  if (loading || progressLoading || stage === null) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!mission) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <p className="text-muted-foreground">Uppdraget finns inte.</p>
        <Button asChild>
          <Link to="/writing-missions">Till alla uppdrag</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-24 md:pb-10 space-y-5">
      <Link
        to="/writing-missions"
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Alla uppdrag
      </Link>

      <div className="space-y-2">
        <div className="flex items-baseline justify-between gap-2">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            Skrivuppdrag · {progressPercent(progress)}% klart
          </p>
          {!signedIn && <span className="text-[11px] italic text-muted-foreground">sparas på den här enheten</span>}
        </div>
        <StageBar stage={stage} completed={completed} onSelect={setStage} />
      </div>

      {rewriteOf && stage === 6 && (
        <p className="rounded-xl bg-primary/5 px-3 py-2 text-xs">
          Omskrivning · <span className="italic text-muted-foreground">rewrite using Svea's corrections</span>
        </p>
      )}

      {stage === 1 && (
        <BriefingStage
          mission={mission}
          warmUp={warmUp}
          onNext={() => completeStage(1)}
        />
      )}

      {stage === 2 && (
        <WordsStage
          mission={mission}
          onDone={(score, missed) => {
            setMissedWords(missed || []);
            addVocabSRSCards(
              (mission.words || []).map((w) => ({ swedish: w.sv, english: w.en })),
              `mission::${mission.id}`,
              mission.title
            );
            completeStage(2, { word_quiz_score: score });
            if (score >= 70) giveXP(MISSION_XP.word_pass, "Ordquiz klarat");
          }}
        />
      )}

      {stage === 3 && (
        <SentencesStage
          mission={mission}
          missed={missedWords}
          onDone={() => {
            completeStage(3);
            giveXP(MISSION_XP.sentences, "Meningar klara");
          }}
        />
      )}

      {stage === 4 && (
        <BuildStage
          mission={mission}
          onDone={() => {
            completeStage(4);
            giveXP(MISSION_XP.build, "Bygg klart");
          }}
        />
      )}

      {stage === 5 && (
        <ParagraphStage
          mission={mission}
          onDone={() => {
            completeStage(5);
            giveXP(MISSION_XP.paragraph, "Stycke klart");
          }}
        />
      )}

      {stage === 6 && (
        <FreeTextStage
          key={rewriteOf || "first"}
          mission={mission}
          initialText={draft}
          onSubmit={submitText}
          busy={busy}
          error={error}
        />
      )}

      {stage === 7 && (
        <>
          <MissionFeedbackStage
            mission={mission}
            feedback={showFeedback}
            onRewrite={startRewrite}
            onDelete={() => deleteSubmission(showFeedback?.id)}
          />

          {missionSubs.length > 1 && (
            <div className="space-y-2">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                Tidigare texter · <span className="italic normal-case">earlier submissions</span>
              </p>
              {missionSubs.map((sub) => (
                <div key={sub.id} className="flex items-center gap-2 rounded-xl border border-border/50 bg-card px-3 py-2">
                  <span className="text-xs font-bold text-primary">{sub.estimated_grade || "–"}</span>
                  <span className="min-w-0 flex-1 truncate text-xs text-muted-foreground">
                    {sub.word_count || 0} ord
                    {sub.rewrite_of ? " · omskrivning" : ""}
                  </span>
                  <button
                    type="button"
                    onClick={() => deleteSubmission(sub.id)}
                    aria-label="Radera texten"
                    className="p-1.5 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}