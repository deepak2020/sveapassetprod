import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, BookOpenCheck } from "lucide-react";
import { supabase } from "@/api/supabaseClient";
import { useAuth } from "@/lib/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import PageSEO from "@/components/shared/PageSEO";
import MissionCatalogCard from "@/components/admin/MissionCatalogCard";
import { MISSION_CATALOG } from "@/data/missionCatalog";

const LEVELS = ["all", "A1", "A2", "B1", "B2", "C1"];

// Admin-only catalog view: every planned mission as a card,
// each with "Copy Claude prompt" so you can paste into your own Claude
// and drop the returned JSON into the DB (SpeakingTopic entity).
export default function AdminMissions() {
  const { user, isLoadingAuth } = useAuth();
  const [levelFilter, setLevelFilter] = useState("all");
  const [showOnly, setShowOnly] = useState("all"); // 'all' | 'missing' | 'seeded'
  const [q, setQ] = useState("");

  const { data: existing = [], isLoading } = useQuery({
    queryKey: ["speaking-topics-all-admin"],
    queryFn: () => supabase.speakingTopics.list(),
    enabled: !!user && user.role === "admin",
  });

  const seededTitles = useMemo(
    () => new Set(existing.map((t) => t.title_sv)),
    [existing]
  );

  const filtered = useMemo(() => {
    return MISSION_CATALOG.filter((m) => {
      if (levelFilter !== "all" && m.level !== levelFilter) return false;
      const seeded = seededTitles.has(m.title_sv);
      if (showOnly === "missing" && seeded) return false;
      if (showOnly === "seeded" && !seeded) return false;
      if (q.trim()) {
        const needle = q.toLowerCase();
        if (
          !m.title_sv.toLowerCase().includes(needle) &&
          !m.title_en.toLowerCase().includes(needle) &&
          !m.category.toLowerCase().includes(needle)
        )
          return false;
      }
      return true;
    });
  }, [levelFilter, showOnly, q, seededTitles]);

  const seededCount = MISSION_CATALOG.filter((m) => seededTitles.has(m.title_sv)).length;

  if (isLoadingAuth) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10">
        <Skeleton className="h-8 w-64 mb-4" />
        <Skeleton className="h-40" />
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10 text-center">
        <p className="text-muted-foreground">Endast administratörer.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
      <PageSEO title="Mission catalog · Admin · Sveapasset" />

      <div>
        <div className="flex items-center gap-2 mb-1">
          <BookOpenCheck className="w-5 h-5 text-primary" />
          <h1 className="font-display text-2xl font-bold">Mission catalog</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Every planned speaking mission. Copy a prompt, feed it to your Claude agent, then insert the
          returned JSON into the <code className="text-[11px] bg-muted px-1 py-0.5 rounded">speaking_topics</code>{" "}
          table in Supabase. Cards turn green once the topic exists in the database.
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          <span className="font-semibold text-foreground">{seededCount} / {MISSION_CATALOG.length}</span> missions in DB.
          {isLoading && <span className="ml-2 italic">Checking DB…</span>}
        </p>
      </div>

      {/* How-to */}
      <Card className="border-dashed">
        <CardContent className="p-4 text-xs text-muted-foreground space-y-1.5 leading-relaxed">
          <p><span className="font-semibold text-foreground">1.</span> Click <strong>Copy Claude prompt</strong> on a card.</p>
          <p><span className="font-semibold text-foreground">2.</span> Paste it into Claude — it returns a single JSON object with the mission content.</p>
          <p><span className="font-semibold text-foreground">3.</span> Combine that JSON with the card's <strong>metadata</strong> (title_sv, title_en, level, category, emoji, order) and create a new <code className="bg-muted px-1 rounded">SpeakingTopic</code> record with all fields.</p>
          <p className="pt-1"><span className="font-semibold text-foreground">Tip:</span> the prompt already tells Claude to skip the metadata fields so you don't get duplicates.</p>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search title or category…"
            className="pl-9"
          />
        </div>
        <div className="flex gap-1 flex-wrap">
          {LEVELS.map((lvl) => (
            <Button
              key={lvl}
              size="sm"
              variant={levelFilter === lvl ? "default" : "outline"}
              onClick={() => setLevelFilter(lvl)}
              className="h-8 text-xs"
            >
              {lvl === "all" ? "All levels" : lvl}
            </Button>
          ))}
        </div>
        <div className="flex gap-1">
          {[
            { id: "all", label: "All" },
            { id: "missing", label: "Missing" },
            { id: "seeded", label: "In DB" },
          ].map((opt) => (
            <Button
              key={opt.id}
              size="sm"
              variant={showOnly === opt.id ? "default" : "outline"}
              onClick={() => setShowOnly(opt.id)}
              className="h-8 text-xs"
            >
              {opt.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Catalog grid */}
      {filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-10">No missions match these filters.</p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-3">
          {filtered.map((m) => (
            <MissionCatalogCard
              key={m.title_sv}
              mission={m}
              seeded={seededTitles.has(m.title_sv)}
            />
          ))}
        </div>
      )}
    </div>
  );
}