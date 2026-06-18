import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/api/supabaseClient";
import { base44 } from "@/api/base44Client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, ArrowLeft, Loader2, Inbox } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function AdminFeedback() {
  const navigate = useNavigate();

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["me"],
    queryFn: () => base44.auth.me(),
  });

  const { data: feedback = [], isLoading } = useQuery({
    queryKey: ["user-feedback"],
    queryFn: async () => {
      const { data } = await supabase.feedback.list();
      return Array.isArray(data) ? data : [];
    },
    enabled: user?.role === "admin",
  });

  if (userLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (user?.role !== "admin") {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground">Admin access required.</p>
      </div>
    );
  }

  const categoryColor = (cat) => {
    if (cat === "Bug report") return "bg-red-50 text-red-700 border-red-200";
    if (cat === "Feature idea") return "bg-blue-50 text-blue-700 border-blue-200";
    if (cat === "Content error") return "bg-amber-50 text-amber-700 border-amber-200";
    return "bg-muted text-muted-foreground border-border";
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")} className="gap-1">
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <MessageSquare className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold">User Feedback</h1>
          <p className="text-sm text-muted-foreground">{feedback.length} submissions</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : feedback.length === 0 ? (
        <Card className="border-border/50">
          <CardContent className="p-12 text-center">
            <Inbox className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <h3 className="font-semibold mb-1">No feedback yet</h3>
            <p className="text-sm text-muted-foreground">Submissions from the floating feedback button will appear here.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {feedback.map((f) => (
            <Card key={f.id} className="border-border/50">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-2 flex-wrap">
                    {f.mood && <span className="text-lg">{f.mood.split(" ")[0]}</span>}
                    <Badge variant="outline" className={`text-xs ${categoryColor(f.category)}`}>
                      {f.category || "General"}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {f.created_at ? formatDistanceToNow(new Date(f.created_at), { addSuffix: true }) : ""}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                    {f.user_email || "anonymous"}
                  </span>
                </div>
                <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">{f.message}</p>
                {f.page_url && (
                  <p className="text-[11px] text-muted-foreground/70 font-mono">{f.page_url}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}