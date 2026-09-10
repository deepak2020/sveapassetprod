import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { ArrowLeft, Send, Loader2, Facebook, ExternalLink, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

export default function AdminFacebook() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedPage, setSelectedPage] = useState(null);
  const [message, setMessage] = useState("");
  const [link, setLink] = useState("");
  const [posting, setPosting] = useState(false);
  const [lastPostUrl, setLastPostUrl] = useState(null);

  // Fetch the builder's Facebook Pages
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["fb-pages"],
    queryFn: () => base44.functions.invoke("postToFacebookPage", { action: "list" }),
  });

  const pages = data?.data?.pages || [];

  useEffect(() => {
    if (pages.length === 1 && !selectedPage) setSelectedPage(pages[0]);
  }, [pages, selectedPage]);

  const handlePost = useCallback(async () => {
    if (!selectedPage || !message.trim()) return;
    setPosting(true);
    setLastPostUrl(null);
    try {
      const res = await base44.functions.invoke("postToFacebookPage", {
        action: "post",
        pageId: selectedPage.id,
        message: message.trim(),
        link: link.trim() || undefined,
      });
      if (res.data?.error) throw new Error(res.data.error);
      const postId = res.data?.postId?.split("_")[0] || selectedPage.id;
      setLastPostUrl(`https://www.facebook.com/${postId}`);
      toast({ title: "Posted!", description: `Your post is live on ${selectedPage.name}.` });
      setMessage("");
      setLink("");
      refetch();
    } catch (err) {
      toast({ variant: "destructive", title: "Post failed", description: err.message });
    } finally {
      setPosting(false);
    }
  }, [selectedPage, message, link, toast, refetch]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 pb-24 md:pb-10 space-y-6">
      <button
        onClick={() => navigate("/dashboard")}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Dashboard
      </button>

      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
          <Facebook className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold">Facebook Page Poster</h1>
          <p className="text-sm text-muted-foreground">Publish posts to your Facebook Page</p>
        </div>
      </div>

      {/* Page selector */}
      <Card className="border-border/50">
        <CardContent className="p-5 space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Select Page</h2>
          {isLoading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" /> Loading your pages…
            </div>
          ) : error ? (
            <p className="text-sm text-destructive">Failed to load pages: {error.message}</p>
          ) : pages.length === 0 ? (
            <p className="text-sm text-muted-foreground">No Facebook Pages found. Make sure your Facebook account manages a Page.</p>
          ) : (
            <div className="space-y-2">
              {pages.map((page) => (
                <button
                  key={page.id}
                  onClick={() => setSelectedPage(page)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all ${
                    selectedPage?.id === page.id
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30"
                      : "border-border/50 hover:border-blue-300"
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center shrink-0">
                    <Facebook className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="font-medium text-sm">{page.name}</span>
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Composer */}
      <Card className="border-border/50">
        <CardContent className="p-5 space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Compose Post</h2>
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your post…"
            rows={5}
            className="resize-none"
          />
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Link (optional)</label>
            <input
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://sveapasset.se"
              className="w-full px-3 py-2 rounded-lg border border-input bg-transparent text-sm"
            />
          </div>
          {lastPostUrl && (
            <a
              href={lastPostUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 hover:underline"
            >
              <CheckCircle2 className="w-4 h-4" /> View post on Facebook <ExternalLink className="w-3 h-3" />
            </a>
          )}
          <Button
            onClick={handlePost}
            disabled={!selectedPage || !message.trim() || posting}
            className="w-full gap-2"
          >
            {posting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            {posting ? "Posting…" : `Post to ${selectedPage?.name || "Page"}`}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}