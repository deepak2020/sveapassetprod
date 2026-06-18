// MOCKUP ONLY — static visual concept for the Personal Vocab Tree.
// No data, no API calls. Delete this file once we decide whether to build it for real.
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  Sparkles,
  Target,
  TrendingUp,
  Home as HomeIcon,
  Briefcase,
  Utensils,
  Heart,
  Plane,
  GraduationCap,
  Volume2,
  Play,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// --- Mock data: simulates what would be auto-built from the user's UserVocabulary ---
const TREE = [
  {
    id: "home",
    label: "Hem",
    labelEn: "Home",
    icon: HomeIcon,
    color: "from-blue-500 to-blue-600",
    bg: "bg-blue-50 dark:bg-blue-950/30",
    text: "text-blue-700 dark:text-blue-300",
    total: 47,
    mastered: 32,
    branches: [
      {
        label: "Köket",
        labelEn: "Kitchen",
        emoji: "🍳",
        words: [
          { sv: "gaffel", en: "fork", mastery: 100 },
          { sv: "kniv", en: "knife", mastery: 100 },
          { sv: "sked", en: "spoon", mastery: 75 },
          { sv: "tallrik", en: "plate", mastery: 50 },
          { sv: "kylskåp", en: "fridge", mastery: 75 },
          { sv: "spis", en: "stove", mastery: 25 },
          { sv: "laga mat", en: "to cook", mastery: 100 },
          { sv: "diska", en: "to wash dishes", mastery: 0 },
        ],
      },
      {
        label: "Sovrummet",
        labelEn: "Bedroom",
        emoji: "🛏️",
        words: [
          { sv: "säng", en: "bed", mastery: 100 },
          { sv: "kudde", en: "pillow", mastery: 75 },
          { sv: "täcke", en: "duvet", mastery: 50 },
          { sv: "sova", en: "to sleep", mastery: 100 },
          { sv: "vakna", en: "to wake up", mastery: 75 },
        ],
      },
      {
        label: "Badrummet",
        labelEn: "Bathroom",
        emoji: "🚿",
        words: [
          { sv: "dusch", en: "shower", mastery: 75 },
          { sv: "tvål", en: "soap", mastery: 50 },
          { sv: "handduk", en: "towel", mastery: 100 },
        ],
      },
    ],
  },
  {
    id: "work",
    label: "Arbete",
    labelEn: "Work",
    icon: Briefcase,
    color: "from-purple-500 to-purple-600",
    bg: "bg-purple-50 dark:bg-purple-950/30",
    text: "text-purple-700 dark:text-purple-300",
    total: 38,
    mastered: 14,
    branches: [
      {
        label: "Möten",
        labelEn: "Meetings",
        emoji: "💼",
        words: [
          { sv: "möte", en: "meeting", mastery: 100 },
          { sv: "kollega", en: "colleague", mastery: 75 },
          { sv: "chef", en: "boss", mastery: 100 },
          { sv: "diskutera", en: "to discuss", mastery: 25 },
          { sv: "bestämma", en: "to decide", mastery: 0 },
        ],
      },
      {
        label: "Email & samtal",
        labelEn: "Email & calls",
        emoji: "📧",
        words: [
          { sv: "skicka", en: "to send", mastery: 75 },
          { sv: "svara", en: "to reply", mastery: 50 },
          { sv: "ringa", en: "to call", mastery: 100 },
        ],
      },
    ],
  },
  {
    id: "food",
    label: "Mat & dryck",
    labelEn: "Food & drink",
    icon: Utensils,
    color: "from-orange-500 to-orange-600",
    bg: "bg-orange-50 dark:bg-orange-950/30",
    text: "text-orange-700 dark:text-orange-300",
    total: 62,
    mastered: 41,
    branches: [],
  },
  {
    id: "emotions",
    label: "Känslor",
    labelEn: "Emotions",
    icon: Heart,
    color: "from-pink-500 to-pink-600",
    bg: "bg-pink-50 dark:bg-pink-950/30",
    text: "text-pink-700 dark:text-pink-300",
    total: 23,
    mastered: 8,
    branches: [],
  },
  {
    id: "travel",
    label: "Resor",
    labelEn: "Travel",
    icon: Plane,
    color: "from-cyan-500 to-cyan-600",
    bg: "bg-cyan-50 dark:bg-cyan-950/30",
    text: "text-cyan-700 dark:text-cyan-300",
    total: 19,
    mastered: 5,
    branches: [],
  },
  {
    id: "study",
    label: "Studier",
    labelEn: "Study",
    icon: GraduationCap,
    color: "from-emerald-500 to-emerald-600",
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    text: "text-emerald-700 dark:text-emerald-300",
    total: 31,
    mastered: 22,
    branches: [],
  },
];

function masteryColor(m) {
  if (m === 100) return "bg-green-500";
  if (m >= 75) return "bg-emerald-400";
  if (m >= 50) return "bg-amber-400";
  if (m >= 25) return "bg-orange-400";
  return "bg-slate-300 dark:bg-slate-600";
}

function MasteryDot({ value }) {
  return <span className={`inline-block w-2 h-2 rounded-full ${masteryColor(value)}`} />;
}

export default function VocabTreeMockup() {
  const [openId, setOpenId] = useState("home");
  const [openBranch, setOpenBranch] = useState("Köket");

  const totalWords = TREE.reduce((s, t) => s + t.total, 0);
  const totalMastered = TREE.reduce((s, t) => s + t.mastered, 0);
  const pct = Math.round((totalMastered / totalWords) * 100);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Mockup banner */}
      <div className="bg-amber-100 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-800 rounded-xl px-4 py-3 text-sm font-medium flex items-center gap-2">
        <Sparkles className="w-4 h-4" />
        Mockup — visual concept only. Data shown is fake to illustrate the idea.
      </div>

      {/* Header */}
      <div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">Your Vocab Tree 🌳</h1>
        <p className="text-muted-foreground mt-1">
          Every word you've learned, organized the way your brain stores it — by topic.
        </p>
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Words in tree</p>
          <p className="text-2xl font-bold mt-1">{totalWords}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Mastered</p>
          <p className="text-2xl font-bold mt-1 text-green-600 dark:text-green-400">{totalMastered}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Overall mastery</p>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-2xl font-bold">{pct}%</p>
            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full" style={{ width: `${pct}%` }} />
            </div>
          </div>
        </Card>
      </div>

      {/* Tree */}
      <div className="space-y-3">
        {TREE.map((topic) => {
          const Icon = topic.icon;
          const isOpen = openId === topic.id;
          const topicPct = Math.round((topic.mastered / topic.total) * 100);

          return (
            <Card key={topic.id} className="overflow-hidden">
              {/* Topic row */}
              <button
                onClick={() => setOpenId(isOpen ? null : topic.id)}
                className="w-full p-4 flex items-center gap-4 hover:bg-muted/40 transition text-left"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${topic.color} flex items-center justify-center text-white shrink-0`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <h3 className="font-bold text-lg">{topic.label}</h3>
                    <span className="text-sm text-muted-foreground">{topic.labelEn}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 max-w-xs h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className={`h-full bg-gradient-to-r ${topic.color}`} style={{ width: `${topicPct}%` }} />
                    </div>
                    <span className="text-xs text-muted-foreground tabular-nums">
                      {topic.mastered}/{topic.total}
                    </span>
                  </div>
                </div>
                <ChevronRight className={`w-5 h-5 text-muted-foreground transition-transform ${isOpen ? "rotate-90" : ""}`} />
              </button>

              {/* Branches */}
              <AnimatePresence initial={false}>
                {isOpen && topic.branches.length > 0 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`border-t ${topic.bg}`}
                  >
                    <div className="p-4 space-y-3">
                      {topic.branches.map((branch) => {
                        const branchOpen = openBranch === branch.label;
                        const branchPct = Math.round(
                          branch.words.reduce((s, w) => s + w.mastery, 0) / branch.words.length
                        );

                        return (
                          <div key={branch.label} className="bg-card rounded-xl border overflow-hidden">
                            <button
                              onClick={() => setOpenBranch(branchOpen ? null : branch.label)}
                              className="w-full p-3 flex items-center gap-3 hover:bg-muted/40 transition text-left"
                            >
                              <div className="text-2xl shrink-0">{branch.emoji}</div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-baseline gap-2">
                                  <span className="font-semibold">{branch.label}</span>
                                  <span className="text-xs text-muted-foreground">{branch.labelEn}</span>
                                </div>
                                <div className="flex items-center gap-1.5 mt-1">
                                  {branch.words.map((w, i) => (
                                    <MasteryDot key={i} value={w.mastery} />
                                  ))}
                                  <span className="text-xs text-muted-foreground ml-1">{branchPct}%</span>
                                </div>
                              </div>
                              <Button
                                size="sm"
                                className="shrink-0 gap-1.5 bg-primary"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Target className="w-3.5 h-3.5" /> Drill
                              </Button>
                              <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${branchOpen ? "rotate-90" : ""}`} />
                            </button>

                            {/* Leaf words */}
                            <AnimatePresence initial={false}>
                              {branchOpen && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="border-t"
                                >
                                  <div className="divide-y">
                                    {branch.words.map((w) => (
                                      <div key={w.sv} className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted/40">
                                        <MasteryDot value={w.mastery} />
                                        <div className="flex-1 min-w-0">
                                          <div className="flex items-baseline gap-2 flex-wrap">
                                            <span className="font-semibold">{w.sv}</span>
                                            <span className="text-sm text-muted-foreground">{w.en}</span>
                                          </div>
                                        </div>
                                        <span className="text-xs text-muted-foreground tabular-nums w-9 text-right">{w.mastery}%</span>
                                        <button className="p-1.5 rounded hover:bg-muted text-muted-foreground">
                                          <Volume2 className="w-4 h-4" />
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {isOpen && topic.branches.length === 0 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`border-t ${topic.bg}`}
                  >
                    <div className="p-6 text-center text-sm text-muted-foreground">
                      Branches would appear here once you've learned words in this topic.
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <Card className="p-5 bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold">Weakest branch: Köket → Spis & diska</h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              5 kitchen verbs you haven't mastered yet. A focused 3-min drill could lock them in today.
            </p>
          </div>
          <Button className="gap-2 shrink-0">
            <Play className="w-4 h-4" /> Start drill
          </Button>
        </div>
      </Card>

      <p className="text-xs text-muted-foreground text-center pt-4">
        🌳 Tree auto-builds from your saved vocabulary · AI groups words by topic · Tap any branch to drill just those words
      </p>
    </div>
  );
}