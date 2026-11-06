import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { base44 } from "@/api/base44Client";
import WritingEditor from "@/components/writing/WritingEditor";

export default function WritingPromptPage() {
  const { promptId } = useParams();

  const { data: prompt, isLoading } = useQuery({
    queryKey: ["writing-prompt", promptId],
    queryFn: () => base44.entities.WritingPrompt.get(promptId),
    enabled: !!promptId,
  });

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 pb-24 md:pb-10 space-y-5">
      <Link
        to="/writing-practice"
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Alla uppgifter
      </Link>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
        </div>
      ) : !prompt ? (
        <p className="text-sm text-muted-foreground text-center py-16">Uppgiften finns inte.</p>
      ) : (
        <WritingEditor prompt={prompt} />
      )}
    </div>
  );
}