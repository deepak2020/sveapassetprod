import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle } from "lucide-react";

// Simple picker for a free-conversation topic. `topics` is an array of
// SpeakingTopic-shaped objects; `onSelect(topic)` starts a chat.
export default function TopicPicker({ topics, onSelect }) {
  if (!topics || topics.length === 0) {
    return (
      <div className="text-center text-sm text-muted-foreground py-8">
        Inga ämnen tillgängliga just nu.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {topics.map((t) => (
        <button
          key={t.id}
          onClick={() => onSelect(t)}
          className="text-left"
        >
          <Card className="hover:border-primary/60 hover:shadow-sm transition-all h-full">
            <CardContent className="p-4 flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shrink-0">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-sm leading-tight">
                  {t.title_sv}
                </p>
                {t.title_en && (
                  <p className="text-xs text-muted-foreground italic">{t.title_en}</p>
                )}
                {t.description_en && (
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {t.description_en}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </button>
      ))}
    </div>
  );
}