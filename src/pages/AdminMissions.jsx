import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Search, BookOpenCheck, DatabaseZap, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import PageSEO from "@/components/shared/PageSEO";
import MissionCatalogCard from "@/components/admin/MissionCatalogCard";
import { MISSION_CATALOG } from "@/data/missionCatalog";
import { MISSION_CONTENT } from "@/data/missionContent";

function buildTopicRecord(mission) {
  const content = MISSION_CONTENT[mission.title_sv];
  if (!content) return null;
  return {
    title_sv: mission.title_sv,
    title_en: mission.title_en,
    level: mission.level,
    category: mission.category,
    emoji: mission.emoji,
    order: mission.order,
    ...content,
  };
}

const LEVELS = ["all", "A1", "A2", "B1", "B2", "C1"];

// Admin-only catalog view: every planned mission as a card,
// each with "Copy Claude prompt" so you can paste into your own Claude
// and drop the returned JSON into the DB (SpeakingTopic entity).
export default function AdminMissions() {
  const { user, isLoadingAuth } = useAuth();
  const queryClient = useQueryClient();
  const [levelFilter, setLevelFilter] = useState("all");
  const [showOnly, setShowOnly] = useState("all"); // 'all' | 'missing' | 'seeded'
  const [q, setQ] = useState("");
  const [seedingAll, setSeedingAll] = useState(false);
  const [seedProgress, setSeedProgress] = useState(null); // "12/38" while running

  const { data: existing = [], isLoading } = useQuery({
    queryKey: ["speaking-topics-all-admin"],
    queryFn: () => base44.entities.SpeakingTopic.list("order", 500),
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
  const missingWithContent = MISSION_CATALOG.filter(
    (m) => !seededTitles.has(m.title_sv) && MISSION_CONTENT[m.title_sv]
  );

  const seedOne = async (mission) => {
    const record = buildTopicRecord(mission);
    if (!record) throw new Error(`No content bank entry for "${mission.title_sv}"`);
    await base44.entities.SpeakingTopic.create(record);
    await queryClient.invalidateQueries({ queryKey: ["speaking-topics-all-admin"] });
  };

  const seedAllMissing = async () => {
    setSeedingAll(true);
    let done = 0;
    const failed = [];
    try {
      for (const m of missingWithContent) {
        setSeedProgress(`${done + 1}/${missingWithContent.length}`);
        try {
          await base44.entities.SpeakingTopic.create(buildTopicRecord(m));
          done++;
        } catch {
          failed.push(m.title_sv);
        }
      }
    } finally {
      setSeedingAll(false);
      setSeedProgress(null);
      await queryClient.invalidateQueries({ queryKey: ["speaking-topics-all-admin"] });
    }
    if (failed.length > 0) {
      alert(`Seeded ${done}, failed ${failed.length}:\n${failed.join("\n")}`);
    }
  };

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
          Every planned speaking mission. Copy a prompt, feed it to your Claude agent, then paste the
          returned JSON into the <code className="text-[11px] bg-muted px-1 py-0.5 rounded">SpeakingTopic</code>{" "}
          entity in the DB. Cards turn green once the topic exists in the database.
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          <span className="font-semibold text-foreground">{seededCount} / {MISSION_CATALOG.length}</span> missions in DB.
          {isLoading && <span className="ml-2 italic">Checking DB…</span>}
        </p>
        {!isLoading && missingWithContent.length > 0 && (
          <Button
            size="sm"
            className="mt-3 gap-1.5"
            onClick={seedAllMissing}
            disabled={seedingAll}
          >
            {seedingAll ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Seeding {seedProgress}…
              </>
            ) : (
              <>
                <DatabaseZap className="w-3.5 h-3.5" />
                Seed all {missingWithContent.length} missing missions
              </>
            )}
          </Button>
        )}
      </div>

      {/* How-to */}
      <Card className="border-dashed">
        <CardContent className="p-4 text-xs text-muted-foreground space-y-1.5 leading-relaxed">
          <p>
            Missions with pre-generated content show a <strong>Seed to DB</strong> button — one click creates the{" "}
            <code className="bg-muted px-1 rounded">SpeakingTopic</code> record. Use <strong>Seed all missing</strong>{" "}
            above to load everything at once.
          </p>
          <p className="pt-1">
            For missions without banked content: <strong>Copy Claude prompt</strong>, run it in Claude, then add the
            returned JSON to <code className="bg-muted px-1 rounded">src/data/missionContent/</code> or create the
            record manually with the card's metadata.
          </p>
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
              hasContent={!!MISSION_CONTENT[m.title_sv]}
              onSeed={seedOne}
            />
          ))}
        </div>
      )}
    </div>
  );
}