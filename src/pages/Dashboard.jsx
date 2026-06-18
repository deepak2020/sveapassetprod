import { useQuery, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Flame, Zap, Trophy, Target, LogOut, Trash2, CalendarDays, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getLevelProgress, getNextLevel, healStreak } from "@/lib/xp";
import { useState, useRef, useCallback, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import WeakAreaCard from "../components/dashboard/WeakAreaCard";
import MasteryCard from "../components/dashboard/MasteryCard";
import CoachCard from "../components/dashboard/CoachCard";
import DailyQuizCard from "../components/dashboard/DailyQuizCard";
import DailyReviewCard from "../components/dashboard/DailyReviewCard";
import TodaysPlanCard from "../components/planner/TodaysPlanCard";
import CreateStudyPlanModal from "../components/planner/CreateStudyPlanModal";
import { useStudyPlan } from "@/hooks/useStudyPlan";
import { usePageView } from "@/hooks/usePageView";
import VocabTreeMockup from "./VocabTreeMockup";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "God morgon";
  if (h < 17) return "God eftermiddag";
  return "God kväll";
}

const XP_LEVEL_COLORS = {
  "Nybörjare": "bg-slate-100 text-slate-600",
  "Elev": "bg-blue-100 text-blue-700",
  "Student": "bg-violet-100 text-violet-700",
  "Avancerad": "bg-amber-100 text-amber-700",
  "Medborgare": "bg-emerald-100 text-emerald-700",
};

export default function Dashboard() {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const touchStartY = useRef(null);
  const queryClient = useQueryClient();

  const { data: user, refetch } = useQuery({
    queryKey: ["me"],
    queryFn: () => base44.auth.me(),
  });

  usePageView("dashboard");

  useEffect(() => { healStreak(base44); }, []);

  const { plan, createPlan, deletePlan, getDayNumber, getProgress, getBehindCount, getDailyTarget } = useStudyPlan(user?.id);

  const { data: quizResults } = useQuery({
    queryKey: ["quiz-results-recent"],
    queryFn: () => base44.entities.QuizResult.list("-created_date", 20),
    initialData: [],
  });

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries();
    setRefreshing(false);
  }, [queryClient]);

  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    if (touchStartY.current === null) return;
    const delta = e.changedTouches[0].clientY - touchStartY.current;
    if (delta > 80 && window.scrollY === 0) {
      handleRefresh();
    }
    touchStartY.current = null;
  };

  const { data: vocabulary = [] } = useQuery({
    queryKey: ["my-vocabulary"],
    queryFn: () => base44.entities.UserVocabulary.list(),
  });

  const { data: results = [], isLoading: resultsLoading } = useQuery({
    queryKey: ["quizResults"],
    queryFn: () => base44.entities.QuizResult.list("-created_date", 100),
  });

  if (!user) return null;

  const handleUpdate = async (fields) => {
    setSaving(true);
    await base44.auth.updateMe(fields);
    await refetch();
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleDeleteVocab = async (vocabId) => {
    await base44.entities.UserVocabulary.delete(vocabId);
    queryClient.invalidateQueries({ queryKey: ["my-vocabulary"] });
    base44.analytics.track({ eventName: "vocabulary_word_deleted", properties: { source: "dashboard" } });
  };

  const today = new Date().toISOString().split("T")[0];

  // Estimate today's activity in minutes: each quiz result = ~2 min, each SRS card answered today = ~0.5 min
  const todayResults = quizResults.filter(r => r.created_date?.startsWith(today));
  const estimatedMinutesToday = todayResults.length * 2;
  const dailyGoalPct = user.daily_goal_minutes
    ? Math.min(100, Math.round((estimatedMinutesToday / user.daily_goal_minutes) * 100))
    : 0;

  const xp = user.xp_total || 0;
  const streak = user.streak_days || 0;
  const { level, progress, xpInLevel, xpNeeded } = getLevelProgress(xp);
  const nextLevel = getNextLevel(xp);
  const initials = user.full_name?.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() || "?";

  const SFI_LEVELS = ["A", "B", "C", "D"];
  const DAILY_GOALS = [5, 10, 15, 30];

  return (
    <div
      className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {refreshing && (
        <div className="flex justify-center mb-4">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      <Tabs defaultValue="home" className="w-full space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="home">Hem</TabsTrigger>
          <TabsTrigger value="tree" className="gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Ordträd
          </TabsTrigger>
          <TabsTrigger value="settings">Inställningar</TabsTrigger>
        </TabsList>

        {/* Home Tab */}
        <TabsContent value="home" className="space-y-8">

      {/* Header greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">
            {getGreeting()}, {user.full_name?.split(" ")[0] || "Inlärare"}! 👋
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {user.sfi_level ? `SFI ${user.sfi_level} • ` : ""}{user.goal || "Fortsätt lära dig svenska!"}
          </p>
          <p className="text-muted-foreground/60 mt-0.5 text-xs italic">
            {user.sfi_level ? `SFI ${user.sfi_level} • ` : ""}Keep learning Swedish!
          </p>
        </div>

        {/* Streak + XP badges */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-orange-50 border border-orange-200 rounded-xl px-3 py-2">
            <Flame className="w-5 h-5 text-orange-500" />
            <span className="font-bold text-orange-600">{streak}</span>
            <span className="text-xs text-orange-500">dagars svit</span>
          </div>
          <div className="flex items-center gap-1.5 bg-primary/5 border border-primary/20 rounded-xl px-3 py-2">
            <Zap className="w-5 h-5 text-primary" />
            <span className="font-bold text-primary">{xp.toLocaleString()}</span>
            <span className="text-xs text-muted-foreground">XP</span>
          </div>
        </div>
      </div>


      {/* Daily goal */}
      {user.daily_goal_minutes && (
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Target className="w-4 h-4 text-primary" />
                <span>Dagligt mål <span className="font-normal text-muted-foreground/70 italic">· Daily goal</span></span>
              </div>
              <span className="text-xs text-muted-foreground">{user.daily_goal_minutes} min mål</span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-secondary rounded-full transition-all duration-700" style={{ width: `${dailyGoalPct}%` }} />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {dailyGoalPct >= 100 ? "🎉 Dagligt mål uppnått! · Daily goal met!" : `~${estimatedMinutesToday} / ${user.daily_goal_minutes} min idag · today`}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Study Plan */}
      {plan ? (
        <TodaysPlanCard
          plan={plan}
          onDelete={() => { if (window.confirm("Delete your study plan? This cannot be undone.")) { deletePlan(); base44.analytics.track({ eventName: "study_plan_deleted" }); } }}
          getDayNumber={getDayNumber}
          getProgress={getProgress}
          getBehindCount={getBehindCount}
          getDailyTarget={getDailyTarget}
          results={results}
        />
      ) : (
        <button
          onClick={() => setShowPlanModal(true)}
          className="w-full p-4 rounded-xl border-2 border-dashed border-primary/30 hover:border-primary/60 hover:bg-primary/5 transition-all text-left group"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <CalendarDays className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-sm group-hover:text-primary transition-colors">Create Study Plan</p>
              <p className="text-xs text-muted-foreground">Set a goal and get a day-by-day lesson schedule</p>
            </div>
          </div>
        </button>
      )}

      {/* Daily warm-up review nudge */}
      <DailyReviewCard />

      {/* Four short quiz check-ins through the day */}
      <DailyQuizCard results={results} />

      {/* Personalised LLM coaching message */}
      <CoachCard results={results} />

      {/* Mastery per skill + overall test readiness */}
      <MasteryCard results={results} targetCourse={user.sfi_level} />

      {/* Weak area recommendations — shows after ≥3 quizzes in any skill */}
      <WeakAreaCard results={results} userSfiLevel={user.sfi_level} />


        </TabsContent>

        {/* Vocab Tree Tab (mockup) */}
        <TabsContent value="tree" className="-mx-4 sm:-mx-6 lg:-mx-8">
          <VocabTreeMockup />
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">{initials}</span>
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold">{user.full_name || "Learner"}</h2>
              <p className="text-muted-foreground text-sm">{user.email}</p>
            </div>
          </div>

          {user.email === "deepak2020rana@gmail.com" && (
            <>
              <a
                href="/admin/users"
                className="block p-4 rounded-xl border border-primary/30 bg-primary/5 hover:bg-primary/10 transition-colors"
              >
                <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">Admin</p>
                <p className="font-semibold">📊 User Activity Board</p>
                <p className="text-xs text-muted-foreground mt-0.5">Track active, at-risk, and churned users</p>
              </a>
              <AdminBrevoSync />
            </>
          )}

          <Card className="border-border/50 bg-gradient-to-r from-primary/5 to-transparent">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-primary" />
                  <span className={`text-sm font-bold px-2 py-0.5 rounded-full ${
                    level.name === "Nybörjare" ? "bg-slate-100 text-slate-600" :
                    level.name === "Elev" ? "bg-blue-100 text-blue-700" :
                    level.name === "Student" ? "bg-violet-100 text-violet-700" :
                    level.name === "Avancerad" ? "bg-amber-100 text-amber-700" :
                    "bg-emerald-100 text-emerald-700"
                  }`}>
                    {level.name}
                  </span>
                </div>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${progress}%` }} />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="p-5 space-y-5">
              <h3 className="font-semibold">Inställningar</h3>

              <div>
                <label className="text-sm text-muted-foreground mb-2 block">SFI-nivå</label>
                <div className="flex gap-2">
                  {SFI_LEVELS.map(l => (
                    <button
                      key={l}
                      onClick={() => handleUpdate({ sfi_level: l })}
                      className={`flex-1 py-2 rounded-lg border-2 text-sm font-bold transition-all ${user.sfi_level === l ? "border-primary bg-primary text-primary-foreground" : "border-border/50 hover:border-primary/30"}`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Dagligt mål (minuter)</label>
                <div className="flex gap-2">
                  {DAILY_GOALS.map(g => (
                    <button
                      key={g}
                      onClick={() => handleUpdate({ daily_goal_minutes: g })}
                      className={`flex-1 py-2 rounded-lg border-2 text-sm font-semibold transition-all ${user.daily_goal_minutes === g ? "border-primary bg-primary text-primary-foreground" : "border-border/50 hover:border-primary/30"}`}
                    >
                      {g}m
                    </button>
                  ))}
                </div>
              </div>

              {saved && <p className="text-sm text-emerald-600 font-medium">✓ Sparat!</p>}
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="p-5">
              <h3 className="font-semibold mb-4">Min Ordlista</h3>
              {vocabulary.length === 0 ? (
                <p className="text-sm text-muted-foreground">Din ordlista är tom</p>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {vocabulary.map((word) => (
                    <div key={word.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{word.swedish}</p>
                        <p className="text-xs text-muted-foreground truncate">{word.english}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteVocab(word.id)}
                        className="text-destructive hover:bg-destructive/10 ml-2 shrink-0"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Button
            variant="outline"
            className="w-full gap-2 text-destructive border-destructive/30 hover:bg-destructive/5"
            onClick={() => base44.auth.logout()}
          >
            <LogOut className="w-4 h-4" /> Logga ut
          </Button>

          <Card className="border-destructive/30">
            <CardContent className="p-5 space-y-3">
              <h3 className="font-semibold text-destructive">Radera konto</h3>
              <p className="text-sm text-muted-foreground">
                Detta tar bort alla dina data permanent och kan inte ångras.
              </p>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full gap-2">
                    <Trash2 className="w-4 h-4" /> Radera mitt konto
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Är du helt säker?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Det här raderar permanent ditt konto och all din data — XP, framsteg, ordlista och allt annat. Det går inte att ångra.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Avbryt</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      onClick={async () => {
                        await base44.entities.User.delete(user.id);
                        base44.auth.logout();
                      }}
                    >
                      Ja, radera konto
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <CreateStudyPlanModal
        open={showPlanModal}
        onClose={() => setShowPlanModal(false)}
        userId={user?.id}
        primaryCourse={user?.sfi_level || "A"}
        onCreated={async (planData) => {
          await createPlan(planData);
          base44.analytics.track({ eventName: "study_plan_created", properties: { course: planData.course, target_days: planData.target_days, focus_skills: planData.focus_skills } });
          setShowPlanModal(false);
        }}
      />
    </div>
  );
}

function AdminBrevoSync() {
  const [status, setStatus] = useState("idle");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSync = async () => {
    setStatus("loading");
    setError(null);
    setResult(null);
    try {
      const res = await base44.functions.invoke("syncAllUsersToBrevo", {});
      setResult(res);
      setStatus("done");
    } catch (e) {
      setError(e.message || "Unknown error");
      setStatus("error");
    }
  };

  return (
    <div className="p-4 rounded-xl border border-border bg-muted/30 space-y-3">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Admin — Brevo Sync</p>
      <button
        onClick={handleSync}
        disabled={status === "loading"}
        className="text-sm px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
      >
        {status === "loading" ? "Syncing..." : "Sync all users → Brevo"}
      </button>
      {status === "done" && result && (
        <p className="text-sm text-green-600 dark:text-green-400">
          ✅ Synced {result.synced}/{result.total} users to Brevo
        </p>
      )}
      {status === "error" && (
        <p className="text-sm text-red-600 dark:text-red-400">
          ❌ {error}
        </p>
      )}
    </div>
  );
}