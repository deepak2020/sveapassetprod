import { useState } from "react";
import { X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

const DISMISSED_KEY = "svenska:nudge_dismissed";

export default function SignupNudge() {
  const { isAuthenticated, authChecked, navigateToLogin } = useAuth();
  const isReturning = !!localStorage.getItem("svenska:last_lesson");
  const [dismissed, setDismissed] = useState(
    () => !!localStorage.getItem(DISMISSED_KEY)
  );

  const dismiss = () => {
    localStorage.setItem(DISMISSED_KEY, "1");
    setDismissed(true);
  };

  const show = authChecked && !isAuthenticated && isReturning && !dismissed;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
          className="mx-4 mt-4 rounded-2xl border border-primary/20 bg-primary/5 p-4 flex items-start gap-3"
        >
          <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground">Welcome back! 👋</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Enjoying the app? Create a free account to save your progress across all devices.
            </p>
            <Button
              size="sm"
              className="mt-3 h-8 text-xs px-3"
              onClick={navigateToLogin}
            >
              Create free account
            </Button>
          </div>
          <button
            onClick={dismiss}
            aria-label="Dismiss"
            className="relative shrink-0 text-muted-foreground hover:text-foreground transition-colors before:absolute before:inset-[-8px] before:content-['']"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
