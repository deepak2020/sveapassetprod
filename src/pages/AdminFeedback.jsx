import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { supabase } from "@/api/supabaseClient";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Bug, Lightbulb, FileWarning, ThumbsUp, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";

const CATEGORY_ICONS = {
  "Bug report":       { icon: Bug,          color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
  "Feature idea":     { icon: Lightbulb,    color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
  "Content error":    { icon: FileWarning,  color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" },
  "General feedback": { icon: MessageSquare,color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
};

const MOOD_COLORS = {
  "😍": "bg-pink-50 dark:bg-pink-900/20",
  "😊": "bg-green-50 dark:bg-green-900/20",
  "😐": "bg-gray-50 dark:bg-gray-900/20",
  "😕": "bg-yellow-50 dark:bg-yellow-900/20",
  "🐛": "bg-red-50 dark:bg-red-900/20",
};

export default function AdminFeedback() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");

  const { data: user } = useQuery({
    queryKey: ["me"],
    queryFn: () => base44.auth.me(),
  });

  const { data: feedback = [], isLoading, refetch } = useQuery({
    queryKey: ["admin-feedback"],
    queryFn: async () => {
      const { data, error } = await supabase.feedback.list();
      if (error) throw error;
      return data || [];
    },
    enabled: user?.role === "admin",
  });

  useEffect(() => {
    if (user && user.role !== "admin") navigate("/dashboard");
  }, [user]);

  if (!user || user.role !== "admin") return null;

  const categories = ["all", ...Object.keys(CATEGORY_ICONS)];
  const filtered = filter === "all" ? feedback : feedback.filter(f => f.category === filter);

  const counts = Object.fromEntries(
    Object.keys(CATEGORY_ICONS).map(c => [c, feedback.filter(f => f.category === c).length])
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">User Feedback</h1>
          <p className="text-muted-foreground mt-1 text-sm">{feedback.length} total submissions</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()} className="gap-2">
          <RefreshCw className="w-4 h-4" /> Refresh
        </Button>
      </div>

      {/* Summary chips */}
      <div className="flex flex-wrap gap-3">
        {Object.entries(CATEGORY_ICONS).map(([cat, { icon: Icon, color }]) => (
          <div key={cat} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium ${color}`}>
            <Icon className="w-4 h-4" />
            {cat}: <span className="font-bold">{counts[cat] || 0}</span>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {categories.map(c => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              filter === c
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {c === "all" ? `All (${feedback.length})` : `${c} (${counts[c] || 0})`}
          </button>
        ))}
      </div>

      {/* Feedback list */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16 gap-2 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin" /> Loading feedback…
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <ThumbsUp className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>No feedback yet in this category.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(item => {
            const meta = CATEGORY_ICONS[item.category] || CATEGORY_ICONS["General feedback"];
            const Icon = meta.icon;
            const moodEmoji = item.mood?.split(" ")[0];

            return (
              <Card key={item.id} className={`border-border/50 ${moodEmoji ? MOOD_COLORS[moodEmoji] || "" : ""}`}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    {/* Mood */}
                    {moodEmoji && (
                      <span className="text-2xl shrink-0 mt-0.5">{moodEmoji}</span>
                    )}

                    <div className="flex-1 min-w-0">
                      {/* Top row */}
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${meta.color}`}>
                          <Icon className="w-3 h-3" /> {item.category}
                        </span>
                        {item.page_url && (
                          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full font-mono">
                            {item.page_url}
                          </span>
                        )}
                        <span className="text-xs text-muted-foreground ml-auto">
                          {item.created_at
                            ? formatDistanceToNow(new Date(item.created_at), { addSuffix: true })
                            : ""}
                        </span>
                      </div>

                      {/* Message */}
                      <p className="text-sm text-foreground leading-relaxed">{item.message}</p>

                      {/* User email */}
                      {item.user_email && (
                        <p className="text-xs text-muted-foreground mt-2">
                          From: {item.user_email}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
