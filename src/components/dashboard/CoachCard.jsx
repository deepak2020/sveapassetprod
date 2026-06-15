import { useState, useEffect, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { RefreshCw } from "lucide-react";
import { skillMastery, weakestSkills } from "@/lib/planner";
import SveaLogo from "@/components/shared/SveaLogo";

const today = () => new Date().toISOString().slice(0, 10);
const cacheKey = () => `svenska:coach_tip:${today()}`;

// A personalised "what to focus on" message from the LLM tutor, based on the
// learner's weakest skills. Cached per day to avoid repeated calls.
export default function CoachCard({ results = [] }) {
  const { user } = useAuth();
  const [tip, setTip] = useState(null);
  const [loading, setLoading] = useState(false);

  const weak = weakestSkills(
    skillMastery((results || []).filter((r) => r.skill && typeof r.percentage === "number")),
    2
  );
  const weakKey = weak.map((w) => w.key).join(",");

  const fetchTip = useCallback(async () => {
    if (weak.length === 0) return;
    setLoading(true);
    try {
      const res = await base44.functions.invoke("coach", {
        kind: "focus",
        course: user?.sfi_level || "C",
        weakSkills: weak.map((w) => `${w.label} (${w.score}%)`).join(", "),
        streak: user?.streak_days || 0,
      });
      const text = res.data?.text;
      if (text) {
        setTip(text);
        try { localStorage.setItem(cacheKey(), text); } catch { /* ignore */ }
      }
    } catch { /* keep silent — coach is non-critical */ }
    setLoading(false);
  }, [weakKey, user?.sfi_level, user?.streak_days]);

  useEffect(() => {
    try {
      const cached = localStorage.getItem(cacheKey());
      if (cached) { setTip(cached); return; }
    } catch { /* ignore */ }
    if (weak.length > 0) fetchTip();
  }, [weakKey, fetchTip, weak.length]);

  if (weak.length === 0) return null;
  if (!tip && !loading) return null;

  return (
    <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
      <CardContent className="p-5">
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm flex items-center gap-1.5">
              <SveaLogo className="text-base" /> <span className="text-xs font-normal text-muted-foreground italic">· din svenska-coach</span>
            </p>
            <p className="text-sm text-foreground/90 mt-1">
              {loading && !tip ? "Tänker…" : tip}
            </p>
          </div>
          <button
            onClick={fetchTip}
            disabled={loading}
            title="Nytt tips"
            className="p-1.5 text-muted-foreground hover:text-primary transition-colors shrink-0"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
