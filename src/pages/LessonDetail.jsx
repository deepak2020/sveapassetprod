import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { supabase } from "@/api/supabaseClient";
import { useAuth } from "@/lib/AuthContext";
import { Link, useSearchParams } from "react-router-dom";
// analytics: lesson tab clicks tracked via base44.analytics.track
import confetti from "canvas-confetti";
import { ArrowLeft, ArrowRight, BookOpen, Trophy } from "lucide-react";
import { useLessonCompletion, setLastLesson } from "@/hooks/useLessonProgress";
import { addVocabSRSCards } from "@/hooks/useVocabSRS";
import { awardXP } from "@/lib/xp";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import FlashcardDeck from "../components/lesson/FlashcardDeck";
import FillInBlanks from "../components/lesson/FillInBlanks";
import WritingExercise from "../components/lesson/WritingExercise";
import SpeakingPractice from "../components/lesson/SpeakingPractice";
import QuizRunner from "../components/shared/QuizRunner";
import SentenceTranslation from "../components/lesson/SentenceTranslation";
import MatchingExercise from "../components/lesson/MatchingExercise";
import ListeningExercise from "../components/lesson/ListeningExercise";
import LessonBottomNav from "../components/lesson/LessonBottomNav";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";

const TAB_LABELS = {
  content: "Lesson",
  learn: "🃏 Vocabulary",
  practice: "🧩 Practice",
  match: "🔗 Match",
  writing: "✍️ Writing",
  speaking: "🗣️ Speaking",
  listening: "👂 Listening",
  translate: "✍️ Translate",
  review: "🔁 Review",
  quiz: "🎯 Quiz",
};

const TAB_SHORT = {
  learn: "Vocab",
  practice: "Practice",
  match: "Match",
  writing: "Writing",
  speaking: "Speaking",
  listening: "Listening",
  translate: "Translate",
  review: "Review",
  quiz: "Quiz",
};

function readLocalProgress(lessonId, tab) {
  try {
    const raw = localStorage.getItem(`ep:${lessonId}-${tab}`);
    if (!raw) return null;
    const saved = JSON.parse(raw);
    if (Date.now() - saved.ts > 7 * 24 * 60 * 60 * 1000) { localStorage.removeItem(`ep:${lessonId}-${tab}`); return null; }
    return saved;
  } catch { return null; }
}

export default function LessonDetail() {
  const pathParts = window.location.pathname.split("/");
  const lessonId = pathParts[pathParts.length - 1];
  const { completed, scores, markComplete } = useLessonCompletion(lessonId);
  const { user } = useAuth();
  const confettiFired = useRef(false);
  const planSyncFired = useRef(false);
  const tabsRef = useRef(null);
  const initialDoneRef = useRef(null); // tracks whether lesson was already done on mount

  const { data: lesson, isLoading } = useQuery({
    queryKey: ["lesson", lessonId],
    queryFn: async () => {
      const lessons = await base44.entities.Lesson.filter({ id: lessonId });
      return lessons[0];
    },
    enabled: !!lessonId,
  });

  // Sibling lessons in the same course → prev/next navigation
  const { data: siblings = [] } = useQuery({
    queryKey: ["lesson-siblings", lesson?.sfi_course],
    queryFn: () =>
      base44.entities.Lesson.filter({ sfi_course: lesson.sfi_course }, "order", 500),
    enabled: !!lesson?.sfi_course,
  });

  // Fetch saved exercise progress from Supabase for cross-device restore
  const { data: remoteProgress = {} } = useQuery({
    queryKey: ["exercise-progress", lessonId, user?.id],
    queryFn: async () => {
      const records = await supabase.exerciseProgress.getForLesson(user.id, lessonId);
      return Object.fromEntries(records.map(r => [r.tab, { current: r.current_index, score: r.score }]));
    },
    enabled: !!user?.id && !!lessonId,
  });

  const currentIdx = siblings.findIndex((l) => l.id === lessonId);
  const prevLesson = currentIdx > 0 ? siblings[currentIdx - 1] : null;
  const nextLesson = currentIdx >= 0 && currentIdx < siblings.length - 1 ? siblings[currentIdx + 1] : null;

  // Remember this lesson so Home can offer "Continue learning"
  useEffect(() => {
    if (lesson) setLastLesson(lesson);
  }, [lesson]);

  // Track lesson opened — fires once when lesson data loads; also touches last_active_date for streak
  useEffect(() => {
    if (!lesson) return;
    base44.analytics.track({
      eventName: "lesson_opened",
      properties: { lesson_id: lesson.id, lesson_title: lesson.title, sfi_course: lesson.sfi_course || null, topic: lesson.topic || null, skill: lesson.skill || null },
    });
    awardXP(base44, 0); // update last_active_date so streak is maintained even if no exercise is done
    // Track abandonment on unmount if no tab was completed yet
    return () => {
      base44.analytics.track({
        eventName: "lesson_exited",
        properties: { lesson_id: lesson.id, sfi_course: lesson.sfi_course || null },
      });
    };
  }, [lesson?.id]);

  // Sync lesson completion to study plan in Supabase (must be before early returns)
  const allDoneForSync = !isLoading && !!lesson;
  useEffect(() => {
    if (!allDoneForSync || !user?.id || planSyncFired.current) return;
    // Check if all available tabs are completed
    const hasVocabCheck = lesson?.word_pairs?.length > 0;
    const hasBlanksCheck = lesson?.fill_in_blanks?.length > 0;
    const hasQuizCheck = lesson?.quiz_questions?.length > 0;
    const hasReviewCheck = lesson?.review_questions?.length > 0;
    const hasWritingCheck = lesson?.writing_prompts?.length > 0;
    const hasSpeakingCheck = lesson?.speaking_phrases?.length > 0;
    const hasListeningCheck = lesson?.listening_phrases?.length > 0;
    const hasTranslateCheck = lesson?.word_pairs?.some(wp => wp.example_en && wp.example_sv);
    const hasMatchCheck = lesson?.match_pairs?.length > 0;
    const keys = [
      hasVocabCheck && "learn", hasBlanksCheck && "practice", hasMatchCheck && "match",
      hasWritingCheck && "writing", hasSpeakingCheck && "speaking", hasListeningCheck && "listening",
      hasTranslateCheck && "translate", hasReviewCheck && "review", hasQuizCheck && "quiz",
    ].filter(Boolean);
    if (keys.length === 0 || !keys.every(k => completed.includes(k))) return;
    planSyncFired.current = true;
    (async () => {
      const { data: plans } = await supabase.from('study_plans').getByUserId(user.id);
      const plan = Array.isArray(plans) ? plans[0] : plans;
      if (!plan) return;
      const current = plan.completed_lesson_ids || [];
      if (current.includes(lessonId)) return;
      await supabase.from('study_plans').update(plan.id, {
        completed_lesson_ids: [...current, lessonId],
      });
    })();
  }, [allDoneForSync, completed, user?.id, lessonId]);

  // Controlled tab state — default to "learn" if available, else "practice", else "content"
  const defaultTab = lesson
    ? (lesson.word_pairs?.length > 0 ? "learn" : lesson.fill_in_blanks?.length > 0 ? "practice" : "content")
    : "content";
  // Allow deep-linking to a tab via ?tab=speaking (used by the study planner).
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || defaultTab);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Skeleton className="h-8 w-64 mb-4" />
        <Skeleton className="h-5 w-40 mb-8" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <p className="text-muted-foreground">Lesson not found.</p>
        <Link to="/language">
          <Button variant="outline" className="mt-4 gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to lessons
          </Button>
        </Link>
      </div>
    );
  }

  const hasVocab = lesson.word_pairs?.length > 0;
  const hasBlanks = lesson.fill_in_blanks?.length > 0;
  const hasQuiz = lesson.quiz_questions?.length > 0;
  const hasReview = lesson.review_questions?.length > 0;
  const hasWriting = lesson.writing_prompts?.length > 0;
  const hasSpeaking = lesson.speaking_phrases?.length > 0;
  const hasListening = lesson.listening_phrases?.length > 0;
  const hasTranslate = lesson.word_pairs?.some(wp => wp.example_en && wp.example_sv);
  const hasMatch = lesson.match_pairs?.length > 0;

  const availableKeys = [
    hasVocab && "learn",
    hasBlanks && "practice",
    hasMatch && "match",
    hasWriting && "writing",
    hasSpeaking && "speaking",
    hasListening && "listening",
    hasTranslate && "translate",
    hasReview && "review",
    hasQuiz && "quiz",
  ].filter(Boolean);
  const doneCount = availableKeys.filter((k) => completed.includes(k)).length;
  const allDone = availableKeys.length > 0 && doneCount === availableKeys.length;

  // Capture whether lesson was already done when the page first loaded
  if (initialDoneRef.current === null && availableKeys.length > 0) {
    initialDoneRef.current = allDone;
  }
  // Only celebrate if the user completed it during THIS visit (not already done before)
  const justCompleted = allDone && initialDoneRef.current === false;

  // Totals for each exercise type (for progress display)
  const tabTotals = {
    learn: lesson.word_pairs?.length ?? 0,
    practice: lesson.fill_in_blanks?.length ?? 0,
    quiz: lesson.quiz_questions?.length ?? 0,
    review: lesson.review_questions?.length ?? 0,
    match: lesson.match_pairs?.length ?? 0,
    translate: lesson.word_pairs?.filter(wp => wp.example_en && wp.example_sv).length ?? 0,
    writing: lesson.writing_prompts?.length ?? 0,
    speaking: lesson.speaking_phrases?.length ?? 0,
    listening: lesson.listening_phrases?.length ?? 0,
  };

  // Best (furthest) saved progress for each tab: prefer Supabase remote if further ahead
  const tabProgress = {};
  for (const key of availableKeys) {
    if (completed.includes(key)) continue; // already finished
    let local;
    if (key === "writing") {
      // WritingExercise uses its own localStorage key (svenska:writing:{lessonId})
      try {
        const raw = localStorage.getItem(`svenska:writing:${lessonId}`);
        const ans = raw ? JSON.parse(raw) : {};
        const n = Object.keys(ans).length;
        local = n > 0 ? { current: n } : null;
      } catch { local = null; }
    } else {
      local = readLocalProgress(lessonId, key);
    }
    const remote = remoteProgress[key];
    const localN = key === "match" ? (local?.matched?.length ?? 0) : (local?.current ?? 0);
    const remoteN = key === "match" ? 0 : (remote?.current ?? 0);
    if (localN > 0 || remoteN > 0) {
      tabProgress[key] = remoteN > localN ? remote : local;
    }
  }

  const inProgressKeys = availableKeys.filter(k => !completed.includes(k) && tabProgress[k]);

  // Returns a small inline indicator for each tab trigger
  const tabStatus = (key) => {
    if (completed.includes(key)) {
      const s = scores[key];
      return <span className="ml-1 text-green-500 text-[10px] font-bold leading-none">✓{s ? ` ${s.percentage}%` : ""}</span>;
    }
    const p = tabProgress[key];
    if (p) {
      const n = key === "match" ? (p.matched?.length ?? 0) : (p.current ?? 0);
      const tot = tabTotals[key];
      return <span className="ml-1 text-amber-500 text-[10px] font-semibold leading-none">{n}/{tot}</span>;
    }
    return null;
  };

  // Fire confetti once when lesson is completed in this session
  if (justCompleted && !confettiFired.current && typeof window !== "undefined") {
    confettiFired.current = true;
    setTimeout(() => {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
      });
    }, 200);
  }

  const pct = availableKeys.length ? Math.round((doneCount / availableKeys.length) * 100) : 0;

  const allTabs = ["content", ...availableKeys];

  // If a ?tab= deep-link points to a tab this lesson doesn't have, fall back
  // (computed, not stateful, to avoid a hook after the early returns above).
  const effectiveTab = allTabs.includes(activeTab) ? activeTab : defaultTab;

  const goToTab = (key) => {
    setActiveTab(key);
    tabsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    base44.analytics.track({
      eventName: "lesson_tab_clicked",
      properties: { tab: key, lesson_id: lesson.id, lesson_title: lesson.title, sfi_course: lesson.sfi_course || null, topic: lesson.topic || null },
    });
  };

  const nextTabKey = allTabs[allTabs.indexOf(effectiveTab) + 1] ?? null;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-40 md:pb-28">
      {/* Back */}
      <Link to={lesson.topic ? `/language/topic/${lesson.sfi_course}/${encodeURIComponent(lesson.topic)}` : "/language"} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" /> {lesson.topic ? `Back to ${lesson.topic}` : "Back to lessons"}
      </Link>

      {/* Header — clean & calm */}
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
          {lesson.sfi_course && `SFI ${lesson.sfi_course}`}
          {lesson.topic && lesson.sfi_course && " · "}
          {lesson.topic}
        </p>
        <h1 className="font-display text-3xl font-bold text-foreground leading-tight">{lesson.title}</h1>
        {lesson.title_sv && lesson.title_sv !== lesson.title && (
          <p className="text-muted-foreground italic mt-1">{lesson.title_sv}</p>
        )}
      </div>

      {/* Slim progress bar */}
      {availableKeys.length > 0 && (
        <div className="mb-6 flex items-center gap-3">
          <div className="h-1.5 flex-1 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full transition-all ${allDone ? "bg-green-500" : "bg-primary"}`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
            {doneCount}/{availableKeys.length} klart
          </span>
        </div>
      )}

      {/* In-progress banner — activities left mid-way */}
      {!allDone && inProgressKeys.length > 0 && (
        <div className="mb-5 p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50">
          <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-2">📍 Resume where you left off</p>
          <div className="flex flex-wrap gap-2">
            {inProgressKeys.map(key => {
              const p = tabProgress[key];
              const n = key === "match" ? (p?.matched?.length ?? 0) : (p?.current ?? 0);
              const tot = tabTotals[key];
              return (
                <button
                  key={key}
                  onClick={() => goToTab(key)}
                  className="text-xs px-2.5 py-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 font-medium hover:bg-amber-200 dark:hover:bg-amber-800/60 transition-colors"
                >
                  {TAB_SHORT[key]} — {n}/{tot} done
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Completion banner — only when completed during this visit */}
      {justCompleted && (
        <div className="mb-6 p-4 rounded-xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800/50 flex items-center gap-3">
          <Trophy className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0" />
          <div>
            <p className="font-semibold text-green-800 dark:text-green-300 text-sm">Lesson complete! 🎉</p>
            <p className="text-xs text-green-600 dark:text-green-400">You've finished all activities for this lesson.</p>
          </div>
          {nextLesson && (
            <Link to={`/language/${nextLesson.id}`} className="ml-auto">
              <Button size="sm" variant="outline" className="border-green-300 dark:border-green-700 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30">Next lesson</Button>
            </Link>
          )}
        </div>
      )}

      {/* Tabs */}
      <div ref={tabsRef}>
      <Tabs
        value={effectiveTab}
        onValueChange={goToTab}
        className="space-y-6"
      >
        <TabsList className="flex w-full max-w-full overflow-x-auto sm:flex-wrap h-auto gap-1 justify-start sm:justify-center scrollbar-none bg-muted/50 p-1 rounded-xl">
          <TabsTrigger value="content" aria-label="Lesson" className="shrink-0 gap-1.5 text-sm data-[state=active]:bg-background">
            <BookOpen className="w-3.5 h-3.5" /> Lesson
          </TabsTrigger>
          {hasVocab && (
            <TabsTrigger value="learn" aria-label={`Learn vocabulary${completed.includes("learn") ? " — completed" : tabProgress["learn"] ? " — in progress" : ""}`} className="shrink-0 text-sm data-[state=active]:bg-background">
              🃏 Learn{tabStatus("learn")}
            </TabsTrigger>
          )}
          {hasBlanks && (
            <TabsTrigger value="practice" aria-label={`Practice${completed.includes("practice") ? " — completed" : tabProgress["practice"] ? " — in progress" : ""}`} className="shrink-0 text-sm data-[state=active]:bg-background">
              🧩 Practice{tabStatus("practice")}
            </TabsTrigger>
          )}
          {hasMatch && (
            <TabsTrigger value="match" aria-label={`Match${completed.includes("match") ? " — completed" : tabProgress["match"] ? " — in progress" : ""}`} className="shrink-0 text-sm data-[state=active]:bg-background">
              🔗 Match{tabStatus("match")}
            </TabsTrigger>
          )}
          {hasWriting && (
            <TabsTrigger value="writing" aria-label={`Writing${completed.includes("writing") ? " — completed" : ""}`} className="shrink-0 text-sm data-[state=active]:bg-background">
              ✍️ Writing{tabStatus("writing")}
            </TabsTrigger>
          )}
          {hasSpeaking && (
            <TabsTrigger value="speaking" aria-label={`Speaking${completed.includes("speaking") ? " — completed" : ""}`} className="shrink-0 text-sm data-[state=active]:bg-background">
              🗣️ Speaking{tabStatus("speaking")}
            </TabsTrigger>
          )}
          {hasListening && (
            <TabsTrigger value="listening" aria-label={`Listening${completed.includes("listening") ? " — completed" : tabProgress["listening"] ? " — in progress" : ""}`} className="shrink-0 text-sm data-[state=active]:bg-background">
              👂 Listening{tabStatus("listening")}
            </TabsTrigger>
          )}
          {hasTranslate && (
            <TabsTrigger value="translate" aria-label={`Translate${completed.includes("translate") ? " — completed" : tabProgress["translate"] ? " — in progress" : ""}`} className="shrink-0 text-sm data-[state=active]:bg-background">
              ✍️ Translate{tabStatus("translate")}
            </TabsTrigger>
          )}
          {hasReview && (
            <TabsTrigger value="review" aria-label={`Review${completed.includes("review") ? " — completed" : tabProgress["review"] ? " — in progress" : ""}`} className="shrink-0 text-sm data-[state=active]:bg-background">
              🔁 Review{tabStatus("review")}
            </TabsTrigger>
          )}
          {hasQuiz && (
            <TabsTrigger value="quiz" aria-label={`Quiz${completed.includes("quiz") ? " — completed" : tabProgress["quiz"] ? " — in progress" : ""}`} className="shrink-0 text-sm data-[state=active]:bg-background">
              🎯 Quiz{tabStatus("quiz")}
            </TabsTrigger>
          )}
        </TabsList>

        {/* Lesson content */}
        <TabsContent value="content">
          {lesson.content ? (
            <div className="prose prose-slate dark:prose-invert max-w-none bg-card rounded-xl border border-border/50 p-6 lesson-text lesson-prose prose-headings:font-bold prose-h1:text-2xl prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-3 prose-h3:text-lg prose-strong:text-foreground prose-strong:font-semibold prose-hr:my-8 prose-hr:border-t-2 prose-table:my-4 prose-li:my-1">
              <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>{lesson.content}</ReactMarkdown>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p>No written content for this lesson yet.</p>
              {hasVocab && <p className="text-sm mt-1">Head to the <strong>Learn</strong> tab to start with flashcards!</p>}
            </div>
          )}
          {nextTabKey && (
            <div className="mt-4 flex justify-end">
              <Button onClick={() => goToTab(nextTabKey)} variant="outline" className="gap-2">
                Next: {TAB_LABELS[nextTabKey]} <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </TabsContent>

        {/* Babbel-style flashcards */}
        {hasVocab && (
          <TabsContent value="learn">
            <div className="space-y-2 mb-4">
              <h2 className="font-semibold text-lg">🃏 Vocabulary Flashcards</h2>
              <p className="text-sm text-muted-foreground">Flip each card, then mark yourself — Babbel style.</p>
            </div>
            <FlashcardDeck
              wordPairs={lesson.word_pairs}
              onComplete={(score, total) => {
                markComplete("learn", { score, total });
                addVocabSRSCards(lesson.word_pairs, lesson.id, lesson.title);
              }}
              lessonId={lesson.id}
              lessonTitle={lesson.title}
              previousResult={scores["learn"]}
              storageKey={`${lessonId}-learn`}
              userId={user?.id}
              tab="learn"
              initialProgress={remoteProgress["learn"]}
            />
            {nextTabKey && (
              <div className="mt-4 flex justify-end">
                <Button onClick={() => goToTab(nextTabKey)} variant="outline" className="gap-2">
                  Next: {TAB_LABELS[nextTabKey]} <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </TabsContent>
        )}

        {/* Clozemaster-style fill-in-blanks */}
        {hasBlanks && (
          <TabsContent value="practice">
            <div className="space-y-2 mb-4">
              <h2 className="font-semibold text-lg">🧩 Fill in the Blank</h2>
              <p className="text-sm text-muted-foreground">Complete the Swedish sentence — Clozemaster style.</p>
            </div>
            <FillInBlanks
              exercises={lesson.fill_in_blanks}
              onComplete={(score, total) => markComplete("practice", { score, total })}
              previousResult={scores["practice"]}
              storageKey={`${lessonId}-practice`}
              userId={user?.id}
              lessonId={lessonId}
              tab="practice"
              initialProgress={remoteProgress["practice"]}
            />
            {nextTabKey && (
              <div className="mt-4 flex justify-end">
                <Button onClick={() => goToTab(nextTabKey)} variant="outline" className="gap-2">
                  Next: {TAB_LABELS[nextTabKey]} <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </TabsContent>
        )}

        {/* Matching Exercise */}
        {hasMatch && (
          <TabsContent value="match">
            <div className="space-y-2 mb-4">
              <h2 className="font-semibold text-lg">🔗 Match the Pairs</h2>
              <p className="text-sm text-muted-foreground">Connect each Swedish word or phrase to its correct match.</p>
            </div>
            <MatchingExercise
              pairs={lesson.match_pairs}
              onComplete={(score, total) => markComplete("match", { score, total })}
              storageKey={`${lessonId}-match`}
              userId={user?.id}
              lessonId={lessonId}
              tab="match"
              initialProgress={remoteProgress["match"]}
            />
            {nextTabKey && (
              <div className="mt-4 flex justify-end">
                <Button onClick={() => goToTab(nextTabKey)} variant="outline" className="gap-2">
                  Next: {TAB_LABELS[nextTabKey]} <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </TabsContent>
        )}

        {/* Writing */}
        {hasWriting && (
          <TabsContent value="writing">
            <div className="space-y-2 mb-4">
              <h2 className="font-semibold text-lg">✍️ Writing Practice</h2>
              <p className="text-sm text-muted-foreground">Short writing exercises to reinforce your learning.</p>
            </div>
            <WritingExercise prompts={lesson.writing_prompts} lessonId={lessonId} onComplete={() => markComplete("writing")} />
            {nextTabKey && (
              <div className="mt-4 flex justify-end">
                <Button onClick={() => goToTab(nextTabKey)} variant="outline" className="gap-2">
                  Next: {TAB_LABELS[nextTabKey]} <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </TabsContent>
        )}

        {/* Speaking */}
        {hasSpeaking && (
          <TabsContent value="speaking">
            <div className="space-y-2 mb-4">
              <h2 className="font-semibold text-lg">🗣️ Speaking Practice</h2>
              <p className="text-sm text-muted-foreground">Read these phrases aloud to practice your pronunciation.</p>
            </div>
            <SpeakingPractice
              phrases={lesson.speaking_phrases}
              onComplete={() => markComplete("speaking")}
              previousResult={scores["speaking"]}
              storageKey={`${lessonId}-speaking`}
              userId={user?.id}
              lessonId={lessonId}
              tab="speaking"
              initialProgress={remoteProgress["speaking"]}
            />
            {nextTabKey && (
              <div className="mt-4 flex justify-end">
                <Button onClick={() => goToTab(nextTabKey)} variant="outline" className="gap-2">
                  Next: {TAB_LABELS[nextTabKey]} <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </TabsContent>
        )}

        {/* Listening */}
        {hasListening && (
          <TabsContent value="listening">
            <div className="space-y-2 mb-4">
              <h2 className="font-semibold text-lg">👂 Listening Comprehension</h2>
              <p className="text-sm text-muted-foreground">Listen to Swedish phrases and test your comprehension.</p>
            </div>
            <ListeningExercise
              phrases={lesson.listening_phrases}
              onComplete={(score, total) => markComplete("listening", { score, total })}
              previousResult={scores["listening"]}
              storageKey={`${lessonId}-listening`}
              userId={user?.id}
              lessonId={lessonId}
              tab="listening"
              initialProgress={remoteProgress["listening"]}
            />
            {nextTabKey && (
              <div className="mt-4 flex justify-end">
                <Button onClick={() => goToTab(nextTabKey)} variant="outline" className="gap-2">
                  Next: {TAB_LABELS[nextTabKey]} <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </TabsContent>
        )}

        {/* Sentence Translation */}
        {hasTranslate && (
          <TabsContent value="translate">
            <div className="space-y-2 mb-4">
              <h2 className="font-semibold text-lg">✍️ Translate to Swedish</h2>
              <p className="text-sm text-muted-foreground">Read the English sentence and type the Swedish translation.</p>
            </div>
            <SentenceTranslation
              wordPairs={lesson.word_pairs}
              onComplete={(score, total) => markComplete("translate", { score, total })}
              previousResult={scores["translate"]}
              storageKey={`${lessonId}-translate`}
              userId={user?.id}
              lessonId={lessonId}
              tab="translate"
              initialProgress={remoteProgress["translate"]}
            />
            {nextTabKey && (
              <div className="mt-4 flex justify-end">
                <Button onClick={() => goToTab(nextTabKey)} variant="outline" className="gap-2">
                  Next: {TAB_LABELS[nextTabKey]} <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </TabsContent>
        )}

        {/* Review — recycles vocabulary from earlier lessons */}
        {hasReview && (
          <TabsContent value="review">
            <div className="space-y-2 mb-4">
              <h2 className="font-semibold text-lg">🔁 Review Previous Lessons</h2>
              <p className="text-sm text-muted-foreground">Warm up with questions from earlier lessons to reinforce what you already know.</p>
            </div>
            <QuizRunner
              questions={lesson.review_questions}
              quizType="language"
              sourceId={lesson.id}
              sourceTitle={`${lesson.title} — Review`}
              onComplete={(score, total) => markComplete("review", { score, total })}
              previousResult={scores["review"]}
              storageKey={`${lessonId}-review`}
              userId={user?.id}
              tab="review"
              initialProgress={remoteProgress["review"]}
            />
            {nextTabKey && (
              <div className="mt-4 flex justify-end">
                <Button onClick={() => goToTab(nextTabKey)} variant="outline" className="gap-2">
                  Next: {TAB_LABELS[nextTabKey]} <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </TabsContent>
        )}

        {/* Quiz */}
        {hasQuiz && (
          <TabsContent value="quiz">
            <div className="space-y-2 mb-4">
              <h2 className="font-semibold text-lg">🎯 Final Quiz</h2>
              <p className="text-sm text-muted-foreground">Test your knowledge and track your score.</p>
            </div>
            <QuizRunner
              questions={lesson.quiz_questions}
              quizType="language"
              sourceId={lesson.id}
              sourceTitle={lesson.title}
              onComplete={(score, total) => markComplete("quiz", { score, total })}
              previousResult={scores["quiz"]}
              storageKey={`${lessonId}-quiz`}
              userId={user?.id}
              tab="quiz"
              initialProgress={remoteProgress["quiz"]}
            />
            {/* No nextTabKey on last tab — lesson complete banner handles it */}
          </TabsContent>
        )}
      </Tabs>
      </div>

      <LessonBottomNav prevLesson={prevLesson} nextLesson={nextLesson} />
    </div>
  );
}