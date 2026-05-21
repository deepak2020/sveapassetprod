import { useAuth } from "@/lib/AuthContext";
import { Button } from "@/components/ui/button";

const FEATURES = [
  { emoji: "🃏", title: "Flashcards & Quizzes", desc: "Learn vocabulary with spaced repetition" },
  { emoji: "🗣️", title: "Speaking Practice", desc: "Record yourself and get instant feedback" },
  { emoji: "👂", title: "Listening Exercises", desc: "Train your ear with real Swedish phrases" },
  { emoji: "🏋️", title: "Daily Gym", desc: "Keep your Swedish sharp with daily drills" },
  { emoji: "📈", title: "Track Progress", desc: "See your improvement across all SFI courses" },
  { emoji: "🏅", title: "XP & Streaks", desc: "Stay motivated with rewards and milestones" },
];

export default function Welcome() {
  const { navigateToLogin } = useAuth();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-16 pb-8 text-center">
        <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mb-6 text-4xl">
          🇸🇪
        </div>
        <h1 className="font-display text-4xl font-bold text-foreground mb-3 leading-tight">
          Learn Swedish,<br />the smart way
        </h1>
        <p className="text-muted-foreground text-lg max-w-sm mb-8">
          Sveapasset helps you pass your SFI exam with interactive lessons, speaking practice, and daily challenges.
        </p>

        <div className="flex flex-col gap-3 w-full max-w-xs">
          <Button
            size="lg"
            className="w-full h-12 text-base font-semibold"
            onClick={navigateToLogin}
          >
            Get started — it's free
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="w-full h-12 text-base"
            onClick={navigateToLogin}
          >
            Sign in
          </Button>
        </div>
      </div>

      {/* Feature grid */}
      <div className="px-6 pb-16 max-w-lg mx-auto w-full">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground text-center mb-5">
          Everything you need to learn Swedish
        </p>
        <div className="grid grid-cols-2 gap-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-border/50 bg-card p-4"
            >
              <span className="text-2xl mb-2 block">{f.emoji}</span>
              <p className="font-semibold text-sm text-foreground leading-snug">{f.title}</p>
              <p className="text-xs text-muted-foreground mt-1">{f.desc}</p>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-8">
          By signing up you agree to our{" "}
          <a href="/privacy" className="underline underline-offset-2 hover:text-foreground transition-colors">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
}
