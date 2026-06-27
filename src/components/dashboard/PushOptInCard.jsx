import { Bell, BellOff, X, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { usePushNotifications } from "@/hooks/usePushNotifications";

const DISMISS_KEY = "svenska:push-opt-in-dismissed";

export default function PushOptInCard() {
  const { supported, permission, subscribed, loading, error, subscribe } = usePushNotifications();
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    setDismissed(localStorage.getItem(DISMISS_KEY) === "1");
  }, []);

  // Hide if: not supported, already subscribed, permission blocked, or dismissed
  if (!supported || subscribed || permission === "denied" || dismissed) return null;

  const handleDismiss = () => {
    localStorage.setItem(DISMISS_KEY, "1");
    setDismissed(true);
  };

  return (
    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="border-2 border-violet-300 dark:border-violet-700 bg-gradient-to-r from-violet-50 to-blue-50 dark:from-violet-900/20 dark:to-blue-900/20 relative">
        <button
          onClick={handleDismiss}
          aria-label="Dismiss"
          className="absolute top-2 right-2 p-1.5 rounded-md text-muted-foreground hover:bg-muted"
        >
          <X className="w-4 h-4" />
        </button>
        <CardContent className="p-5">
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-xl bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center shrink-0">
              <Bell className="w-5 h-5 text-violet-600 dark:text-violet-400" />
            </div>
            <div className="flex-1 min-w-0 pr-6">
              <p className="font-semibold text-foreground">
                Get a daily reminder
                <span className="ml-2 text-xs font-normal text-muted-foreground italic">· Daglig påminnelse</span>
              </p>
              <p className="text-sm text-muted-foreground mt-0.5">
                One quick push notification per day — no spam, just a nudge to keep your streak alive.
              </p>
              {error && (
                <p className="text-xs text-destructive mt-2">{error}</p>
              )}
              <div className="flex flex-wrap gap-2 mt-3">
                <Button
                  size="sm"
                  onClick={subscribe}
                  disabled={loading}
                  className="bg-violet-600 hover:bg-violet-700 text-white border-0"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Bell className="w-4 h-4" />}
                  {loading ? "Enabling…" : "Turn on reminders"}
                </Button>
                <Button size="sm" variant="ghost" onClick={handleDismiss}>
                  <BellOff className="w-4 h-4" /> Not now
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}