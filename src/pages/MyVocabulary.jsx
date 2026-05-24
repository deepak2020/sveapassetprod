import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { usePageView } from "@/hooks/usePageView";
import { Trash2, BookOpen, Brain, Play } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useVocabSRS, addSavedWordToSRS } from "@/hooks/useVocabSRS";
import VocabReviewSession from "@/components/gym/VocabReviewSession";

export default function MyVocabulary() {
  usePageView("my_vocabulary");
  const [searchTerm, setSearchTerm] = useState("");
  const [reviewing, setReviewing] = useState(false);
  const { dueCards, totalCount, refresh } = useVocabSRS();

  const { data: vocabList = [], refetch } = useQuery({
    queryKey: ["user-vocabulary"],
    queryFn: () => base44.entities.UserVocabulary.list("-created_date", 500),
  });

  const filtered = vocabList.filter(
    word =>
      word.swedish.toLowerCase().includes(searchTerm.toLowerCase()) ||
      word.english.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id) => {
    if (confirm("Delete this word?")) {
      await base44.entities.UserVocabulary.delete(id);
      base44.analytics.track({ eventName: "vocabulary_word_deleted", properties: { source: "my_vocabulary" } });
      refetch();
    }
  };

  if (reviewing) {
    return (
      <VocabReviewSession
        cards={dueCards}
        onFinish={() => { setReviewing(false); refresh(); }}
      />
    );
  }

  const handleAddAllToSRS = () => {
    let added = 0;
    vocabList.forEach((w) => { added += addSavedWordToSRS(w); });
    refresh();
    alert(`Added ${added} new word${added !== 1 ? "s" : ""} to your review deck.`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
      <div className="text-center">
        <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center mx-auto mb-4">
          <BookOpen className="w-7 h-7 text-blue-600" />
        </div>
        <h1 className="font-display text-3xl font-bold">My Vocabulary List</h1>
        <p className="text-muted-foreground mt-1">Words you've saved while learning</p>
      </div>

      {/* SRS review banner */}
      {vocabList.length > 0 && (
        <Card className={`border-2 ${dueCards.length > 0 ? "border-violet-300 bg-violet-50/40" : "border-border/50"}`}>
          <CardContent className="p-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-violet-600 shrink-0" />
              <div>
                <p className="text-sm font-medium">
                  {dueCards.length > 0
                    ? `${dueCards.length} card${dueCards.length !== 1 ? "s" : ""} due for review`
                    : totalCount > 0 ? "All caught up! ✓" : "No cards in review deck yet"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {totalCount > 0 ? `${totalCount} total vocab SRS cards` : "Finish a Vocabulary tab in any lesson, or add words below"}
                </p>
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              {totalCount === 0 && (
                <Button size="sm" variant="outline" onClick={handleAddAllToSRS} className="gap-1.5 text-xs">
                  <Brain className="w-3.5 h-3.5" /> Add all to deck
                </Button>
              )}
              {dueCards.length > 0 && (
                <Button size="sm" onClick={() => setReviewing(true)} className="gap-1.5 bg-violet-600 hover:bg-violet-700">
                  <Play className="w-3.5 h-3.5" /> Review {dueCards.length}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <div>
        <input
          type="text"
          placeholder="Search Swedish or English..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2.5 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {vocabList.length === 0 ? (
        <Card className="border-border/50">
          <CardContent className="p-12 text-center">
            <BookOpen className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <h3 className="font-semibold mb-1">No words yet</h3>
            <p className="text-sm text-muted-foreground">Start adding words from lessons to build your personal vocabulary!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {filtered.map(word => (
            <Card key={word.id} className="border-border/50 hover:border-border transition-colors">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <p className="font-semibold text-lg">{word.swedish}</p>
                    <span className="text-muted-foreground">→</span>
                    <p className="text-muted-foreground">{word.english}</p>
                  </div>
                  {word.lesson_title && (
                    <p className="text-xs text-muted-foreground">From: {word.lesson_title}</p>
                  )}
                  {word.example_sentence && (
                    <p className="text-xs text-muted-foreground italic mt-1">{word.example_sentence}</p>
                  )}
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => handleDelete(word.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}