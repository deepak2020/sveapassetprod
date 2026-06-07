import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, Loader2, CheckCircle2, AlertCircle, RefreshCw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/AuthContext";
import { supabase } from "@/api/supabaseClient";
import { base44 } from "@/api/base44Client";
import { GRAMMAR_CATEGORIES } from "@/data/grammarTopics";

const SESSIONS_PER_TOPIC = 8;  // exercises shown per session
const GENERATE_COUNT = 20;      // how many to generate per click

// Build flat list of all topics with category info
const ALL_TOPICS = GRAMMAR_CATEGORIES.flatMap(cat =>
  cat.topics.map(t => ({ ...t, categoryLabel: cat.label, categoryEmoji: cat.emoji, color: cat.color }))
);

const DIFFICULTY_COLORS = {
  easy:   "bg-green-100 text-green-700",
  medium: "bg-amber-100 text-amber-700",
  hard:   "bg-red-100 text-red-700",
};

async function generateExercises(topic, count = GENERATE_COUNT) {
  const existing = topic.exercises
    ?.filter(e => e.q && Array.isArray(e.options) && e.correct >= 0 && e.correct < e.options.length)
    .slice(0, 3)
    .map(e =>
      `Q: ${e.q}\nOptions: ${e.options.join(" / ")}\nCorrect: ${e.options[e.correct]}`
    ).join("\n\n");

  const result = await base44.integrations.Core.InvokeLLM({
    prompt: `You are a Swedish language teacher. Generate ${count} practice exercises for the grammar topic below.

TOPIC: ${topic.title} (${topic.titleSv})
RULE: ${topic.rule}

STYLE GUIDE — match these existing exercises exactly:
${existing}

REQUIREMENTS:
- Mix of difficulty: roughly 30% easy, 50% medium, 20% hard
- VARY the question format — do NOT repeat the same question phrasing. Use a mix of:
  • Fill in the blank: "Complete: '___ hund är stor.'"
  • Spot the mistake: "Find the error: 'ett hund springer'"
  • Translation: "Translate 'a house' into Swedish:"
  • Gender identification: "What gender is 'bil'?"
  • Choose the correct form: "Pick the right form: ..."
  • True/false style: "Is this correct? 'ett dag är lång'"
- Questions in English or Swedish, answers always in Swedish
- Each question tests one concrete aspect of the rule
- Explanations must state the grammar rule clearly (1 sentence)
- No duplicate questions and no repeating the same question stem
- Vary the vocabulary — use different nouns, verbs, adjectives each time

Return JSON only.`,
    add_context_from_history: false,
    response_json_schema: {
      type: "object",
      properties: {
        exercises: {
          type: "array",
          items: {
            type: "object",
            properties: {
              question:      { type: "string" },
              options:       { type: "array", items: { type: "string" }, minItems: 2, maxItems: 4 },
              correct_index: { type: "integer" },
              explanation:   { type: "string" },
              difficulty:    { type: "string", enum: ["easy", "medium", "hard"] },
            },
            required: ["question", "options", "correct_index", "explanation", "difficulty"],
          },
        },
      },
      required: ["exercises"],
    },
  });

  return result?.exercises || [];
}

export default function AdminGrammar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [counts, setCounts] = useState({});       // { topicId: number }
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState({}); // { topicId: true }
  const [results, setResults] = useState({});       // { topicId: { ok, count, error } }

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    if (!isAdmin) { navigate("/dashboard"); return; }
    loadCounts();
  }, [isAdmin]);

  const loadCounts = async () => {
    setLoading(true);
    try {
      const { data } = await supabase.grammar.getExerciseCountByTopic();
      const map = {};
      for (const row of (data || [])) {
        map[row.topic_id] = (map[row.topic_id] || 0) + 1;
      }
      setCounts(map);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async (topic) => {
    setGenerating(g => ({ ...g, [topic.id]: true }));
    setResults(r => ({ ...r, [topic.id]: null }));
    try {
      const generated = await generateExercises(topic, GENERATE_COUNT);
      const exercises = generated.filter(e =>
        e.question?.trim() &&
        Array.isArray(e.options) && e.options.length >= 2 &&
        Number.isInteger(e.correct_index) && e.correct_index >= 0 && e.correct_index < e.options.length &&
        e.explanation?.trim()
      );
      if (!exercises.length) throw new Error("No valid exercises returned");

      const rows = exercises.map((e, i) => ({
        topic_id:      topic.id,
        question:      e.question,
        options:       e.options,
        correct_index: e.correct_index,
        explanation:   e.explanation,
        difficulty:    e.difficulty || "medium",
        sort_order:    (counts[topic.id] || 0) + i + 1,
        ai_generated:  true,
      }));

      const { error } = await supabase.grammar.insertExercises(rows);
      if (error) throw new Error(JSON.stringify(error));

      setCounts(c => ({ ...c, [topic.id]: (c[topic.id] || 0) + exercises.length }));
      setResults(r => ({ ...r, [topic.id]: { ok: true, count: exercises.length } }));
    } catch (err) {
      setResults(r => ({ ...r, [topic.id]: { ok: false, error: err.message } }));
    } finally {
      setGenerating(g => ({ ...g, [topic.id]: false }));
    }
  };

  const totalExercises = Object.values(counts).reduce((a, b) => a + b, 0);
  const topicsReady = ALL_TOPICS.filter(t => (counts[t.id] || 0) >= SESSIONS_PER_TOPIC).length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pb-24 md:pb-10 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Grammar Exercise Generator</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Generate AI exercises for each topic and store them in Supabase.
          Sessions randomly sample {SESSIONS_PER_TOPIC} exercises from the bank.
        </p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total exercises", value: loading ? "…" : totalExercises },
          { label: "Topics ready", value: loading ? "…" : `${topicsReady} / ${ALL_TOPICS.length}` },
          { label: "Per session", value: SESSIONS_PER_TOPIC },
        ].map(s => (
          <div key={s.label} className="rounded-xl border border-border/50 bg-card p-4 text-center">
            <p className="text-2xl font-bold text-primary">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Refresh */}
      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={loadCounts} disabled={loading} className="gap-2">
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh counts
        </Button>
      </div>

      {/* Topic table */}
      {GRAMMAR_CATEGORIES.map(cat => (
        <div key={cat.id} className="space-y-3">
          <h2 className="font-bold text-base flex items-center gap-2">
            {cat.emoji} {cat.label}
          </h2>
          <div className="rounded-2xl border border-border/50 overflow-hidden">
            {cat.topics.map((topic, i) => {
              const count = counts[topic.id] || 0;
              const isReady = count >= SESSIONS_PER_TOPIC;
              const result = results[topic.id];
              const isGenerating = generating[topic.id];

              return (
                <div
                  key={topic.id}
                  className={`flex items-center gap-4 px-5 py-4 ${i > 0 ? "border-t border-border/40" : ""} ${isGenerating ? "bg-muted/30" : ""}`}
                >
                  {/* Status icon */}
                  <div className="flex-shrink-0">
                    {isReady
                      ? <CheckCircle2 className="w-5 h-5 text-green-500" />
                      : <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30" />
                    }
                  </div>

                  {/* Topic info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{topic.title}</p>
                    <p className="text-xs italic text-muted-foreground">{topic.titleSv}</p>
                  </div>

                  {/* Exercise count */}
                  <div className="text-right flex-shrink-0">
                    <p className={`text-sm font-bold ${isReady ? "text-green-600" : "text-muted-foreground"}`}>
                      {count} exercises
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {count === 0 ? "none yet" : `~${Math.floor(count / SESSIONS_PER_TOPIC)} sessions`}
                    </p>
                  </div>

                  {/* Result badge */}
                  {result && (
                    <div className={`text-xs px-2 py-1 rounded-lg flex-shrink-0 ${result.ok ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {result.ok ? `+${result.count} added` : "Error"}
                    </div>
                  )}

                  {/* Generate button */}
                  <Button
                    size="sm"
                    variant={isReady ? "outline" : "default"}
                    onClick={() => handleGenerate({ ...topic, exercises: topic.exercises })}
                    disabled={isGenerating}
                    className="flex-shrink-0 gap-1.5 min-w-[110px]"
                  >
                    {isGenerating
                      ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Generating…</>
                      : <><Sparkles className="w-3.5 h-3.5" /> +{GENERATE_COUNT} more</>
                    }
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Generate all button */}
      <div className="pt-4 border-t border-border/40">
        <Button
          size="lg"
          className="w-full gap-2"
          onClick={async () => {
            for (const topic of ALL_TOPICS) {
              await handleGenerate({ ...topic });
              await new Promise(r => setTimeout(r, 500)); // small delay between requests
            }
          }}
          disabled={Object.values(generating).some(Boolean)}
        >
          <Sparkles className="w-4 h-4" />
          Generate {GENERATE_COUNT} exercises for ALL {ALL_TOPICS.length} topics
        </Button>
        <p className="text-xs text-center text-muted-foreground mt-2">
          This will make {ALL_TOPICS.length} AI calls sequentially (~2–3 min)
        </p>
      </div>
    </div>
  );
}
