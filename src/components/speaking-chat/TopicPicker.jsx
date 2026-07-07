import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle } from "lucide-react";

const LEVEL_COLOR = {
  A1: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  A2: "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
  B1: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
  B2: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
  C1: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
};

// Grid of topic cards — tapping one starts a Svea conversation on that theme.
export default function TopicPicker({ topics, onSelect }) {
  if (!topics?.length) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <MessageCircle className="w-10 h-10 mx-auto mb-3 opacity-50" />
        <p className="text-sm">No conversation topics yet.</p>
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 gap-3">
      {topics.map((t) => (
        <Card
          key={t.id}
          onClick={() => onSelect(t)}
          className="cursor-pointer hover:shadow-md hover:border-primary/40 transition-all"
        >
          <CardContent className="p-4 flex gap-3">
            <div className="w-11 h-11 rounded-xl bg-muted flex items-center justify-center text-2xl shrink-0">
              {t.emoji || "💬"}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-0.5">
                <p className="font-semibold text-sm truncate">{t.title_sv}</p>
                {t.level && (
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${LEVEL_COLOR[t.level] || ""}`}>
                    {t.level}
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground italic truncate">{t.title_en}</p>
              {t.description_en && (
                <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">{t.description_en}</p>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}