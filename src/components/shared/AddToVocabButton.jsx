import { useState } from "react";
import { BookmarkPlus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";

export default function AddToVocabButton({ swedish, english, lessonId, lessonTitle, exampleSentence }) {
  const [added, setAdded] = useState(false);
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) return null;

  const handleAddToVocab = () => {
    if (added) return;
    // Optimistic: show success immediately, server call runs in background
    setAdded(true);
    base44.entities.UserVocabulary.create({
      swedish,
      english,
      lesson_id: lessonId,
      lesson_title: lessonTitle,
      example_sentence: exampleSentence,
    }).catch(() => {
      setAdded(false); // revert on failure
    });
  };

  return (
    <Button
      size="lg"
      variant={added ? "default" : "outline"}
      onClick={handleAddToVocab}
      disabled={added}
      className="gap-1.5 w-full"
    >
      {added ? (
        <>
          <Check className="w-4 h-4" /> Added
        </>
      ) : (
        <>
          <BookmarkPlus className="w-4 h-4" /> Add to Vocab
        </>
      )}
    </Button>
  );
}
