import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, ChevronDown, CheckCircle2, PlayCircle, RotateCcw, Zap, Lock } from "lucide-react";
import { GRAMMAR_CATEGORIES } from "@/data/grammarTopics";

const COLOR = {
  green: {
    card: "border-green-200 bg-green-50/40 dark:border-green-900/40 dark:bg-green-950/20",
    badge: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
    bar: "bg-green-500",
    ring: "ring-green-300 dark:ring-green-700",
    icon: "text-green-600 dark:text-green-400",
    heading: "text-green-800 dark:text-green-300",
    topicBorder: "border-green-200 dark:border-green-900/50",
    topicActive: "border-green-400 ring-2 ring-green-200 dark:ring-green-800",
  },
  amber: {
    card: "border-amber-200 bg-amber-50/40 dark:border-amber-900/40 dark:bg-amber-950/20",
    badge: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    bar: "bg-amber-500",
    ring: "ring-amber-300 dark:ring-amber-700",
    icon: "text-amber-600 dark:text-amber-400",
    heading: "text-amber-800 dark:text-amber-300",
    topicBorder: "border-amber-200 dark:border-amber-900/50",
    topicActive: "border-amber-400 ring-2 ring-amber-200 dark:ring-amber-800",
  },
  violet: {
    card: "border-violet-200 bg-violet-50/40 dark:border-violet-900/40 dark:bg-violet-950/20",
    badge: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
    bar: "bg-violet-500",
    ring: "ring-violet-300 dark:ring-violet-700",
    icon: "text-violet-600 dark:text-violet-400",
    heading: "text-violet-800 dark:text-violet-300",
    topicBorder: "border-violet-200 dark:border-violet-900/50",
    topicActive: "border-violet-400 ring-2 ring-violet-200 dark:ring-violet-800",
  },
};

function getProgress(topicId) {
  try {
    const raw = localStorage.getItem(`grammar:progress:${topicId}`);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function CategoryCard({ category, isSelected, onClick, allProgress }) {
  const c = COLOR[category.color];
  const topics = category.topics;
  const doneTopics = topics.filter(t => {
    const p = allProgress[t.id];
    return p && p.completed;
  }).length;
  const inProgressTopics = topics.filter(t => {
    const p = allProgress[t.id];
    return p && !p.completed && p.done > 0;
  }).length;
  const pct = topics.length > 0 ? Math.round((doneTopics / topics.length) * 100) : 0;

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`w-full text-left rounded-2xl border-2 p-5 transition-all ${c.card} ${
        isSelected ? `${c.ring} ring-2 shadow-lg` : "hover:shadow-md"
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <div className="text-3xl mb-1">{category.emoji}</div>
          <h3 className={`font-bold text-lg ${c.heading}`}>{category.label}</h3>
          <p className="text-xs text-muted-foreground italic">{category.labelSv}</p>
        </div>
        <div className="text-right">
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${c.badge}`}>
            {doneTopics}/{topics.length} done
          </span>
          {inProgressTopics > 0 && (
            <p className="text-[10px] text-muted-foreground mt-1">{inProgressTopics} in progress</p>
          )}
        </div>
      </div>
      <p className="text-sm text-muted-foreground mb-3">{category.description}</p>
      <div className="space-y-1">
        <div className="flex justify-between text-[11px] text-muted-foreground">
          <span>{topics.length} topics</span>
          <span>{pct}%</span>
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div className={`h-full ${c.bar} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
        </div>
      </div>
      <div className={`flex items-center gap-1 mt-3 text-xs font-semibold ${c.icon}`}>
        {isSelected
          ? <><ChevronDown className="w-3.5 h-3.5" /> Hide topics</>
          : <><PlayCircle className="w-3.5 h-3.5" /> Show topics</>
        }
      </div>
    </motion.button>
  );
}

function TopicCard({ topic, category, index, progress, onClick }) {
  const c = COLOR[category.color];
  const total = topic.exercises.length;
  const done = progress?.done || 0;
  const completed = progress?.completed || false;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  const isNew = done === 0 && !completed;
  const isInProgress = done > 0 && !completed;

  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      whileHover={{ y: -2 }}
      className={`w-full text-left rounded-2xl border-2 bg-card p-5 transition-all shadow-sm hover:shadow-md ${
        completed
          ? "border-green-300 ring-2 ring-green-200/60 dark:ring-green-900/40"
          : isInProgress
          ? c.topicActive
          : c.topicBorder
      }`}
    >
      {/* Status badge */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          {completed
            ? <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
            : <BookOpen className={`w-5 h-5 flex-shrink-0 ${isInProgress ? c.icon : "text-muted-foreground"}`} />
          }
          <div className="min-w-0">
            <h4 className="font-bold text-sm truncate">{topic.title}</h4>
            <p className="text-xs italic text-muted-foreground truncate">{topic.titleSv}</p>
          </div>
        </div>
        {completed
          ? <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400 whitespace-nowrap">✓ Done</span>
          : isInProgress
          ? <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${c.badge}`}>{done}/{total}</span>
          : <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-muted text-muted-foreground whitespace-nowrap">{total} exercises</span>
        }
      </div>

      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{topic.description}</p>

      {/* Progress bar */}
      <div className="h-1.5 bg-muted rounded-full overflow-hidden mb-3">
        <div
          className={`h-full rounded-full transition-all duration-500 ${completed ? "bg-green-500" : isInProgress ? c.bar : "bg-muted-foreground/20"}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* CTA */}
      <div className={`flex items-center gap-1 text-xs font-semibold ${
        completed ? "text-green-600 dark:text-green-400"
        : isInProgress ? c.icon
        : "text-primary"
      }`}>
        {completed
          ? <><RotateCcw className="w-3.5 h-3.5" /> Repetera</>
          : isInProgress
          ? <><RotateCcw className="w-3.5 h-3.5" /> Fortsätt · <span className="italic font-normal">Continue</span></>
          : <><PlayCircle className="w-3.5 h-3.5" /> Börja · <span className="italic font-normal">Start</span></>
        }
      </div>
    </motion.button>
  );
}

export default function Grammar() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [allProgress, setAllProgress] = useState({});

  useEffect(() => {
    const p = {};
    for (const cat of GRAMMAR_CATEGORIES) {
      for (const topic of cat.topics) {
        p[topic.id] = getProgress(topic.id);
      }
    }
    setAllProgress(p);
    const onFocus = () => {
      const fresh = {};
      for (const cat of GRAMMAR_CATEGORIES) {
        for (const topic of cat.topics) {
          fresh[topic.id] = getProgress(topic.id);
        }
      }
      setAllProgress(fresh);
    };
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  const toggleCategory = (catId) => {
    setSelectedCategory(prev => prev === catId ? null : catId);
  };

  const activeCat = GRAMMAR_CATEGORIES.find(c => c.id === selectedCategory);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pb-24 md:pb-10">
      {/* Page header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <span className="text-xl">🔤</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold">Grammar · <span className="italic font-normal text-muted-foreground">Grammatik</span></h1>
            <p className="text-sm text-muted-foreground">AI-powered exercises with instant explanations</p>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground bg-muted/50 rounded-xl px-4 py-2 border border-border/50">
          <Zap className="w-3.5 h-3.5 text-primary" />
          Wrong answers trigger an AI explanation of the grammar rule — personalised to your mistake
        </div>
      </div>

      {/* 3 Category cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {GRAMMAR_CATEGORIES.map(cat => (
          <CategoryCard
            key={cat.id}
            category={cat}
            isSelected={selectedCategory === cat.id}
            onClick={() => toggleCategory(cat.id)}
            allProgress={allProgress}
          />
        ))}
      </div>

      {/* Topic grid — shown below when category selected */}
      <AnimatePresence>
        {activeCat && (
          <motion.div
            key={activeCat.id}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {/* Section header */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">{activeCat.emoji}</span>
              <h2 className={`font-bold text-lg ${COLOR[activeCat.color].heading}`}>
                {activeCat.label} Topics
              </h2>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${COLOR[activeCat.color].badge}`}>
                {activeCat.topics.length} topics
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeCat.topics.map((topic, idx) => (
                <TopicCard
                  key={topic.id}
                  topic={topic}
                  category={activeCat}
                  index={idx}
                  progress={allProgress[topic.id]}
                  onClick={() => navigate(`/grammar/${activeCat.id}/${topic.id}`)}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty state — nothing selected */}
      {!selectedCategory && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-10 text-muted-foreground">
          <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">Select a category above to see topics</p>
        </motion.div>
      )}
    </div>
  );
}
