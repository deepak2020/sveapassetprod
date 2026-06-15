import { Link } from "react-router-dom";
import { BookOpen, Sparkles, Headphones, Zap, Users, ArrowRight, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

const features = [
  {
    icon: Sparkles,
    emoji: "🦉",
    title: "Svea — din AI-tutor",
    description: "A personal daily plan that picks lessons by your weakest skills, schedules spaced reviews, and explains your mistakes — like a tutor who knows you.",
    link: "/dashboard",
    gradient: "from-violet-500/10 to-violet-600/5",
    border: "hover:border-violet-300/60",
    iconColor: "bg-violet-100 text-violet-600",
  },
  {
    icon: BookOpen,
    emoji: "📖",
    title: "Structured Swedish Courses",
    description: "Lessons across vocabulary, grammar, reading, writing, speaking and listening — from Kurs A to D.",
    link: "/language",
    gradient: "from-blue-500/10 to-blue-600/5",
    border: "hover:border-blue-300/60",
    iconColor: "bg-blue-100 text-blue-600",
  },
  {
    icon: Headphones,
    emoji: "🎧",
    title: "Hörförståelse — Listening",
    description: "Practise with real audio — phone calls, announcements, news and dialogues — just like the national SFI test.",
    link: "/listening/c",
    gradient: "from-sky-500/10 to-sky-600/5",
    border: "hover:border-sky-300/60",
    iconColor: "bg-sky-100 text-sky-600",
  },
  {
    icon: Zap,
    emoji: "💪",
    title: "Daily Practice & Quizzes",
    description: "Lock in words with spaced repetition and quick daily quizzes that focus on exactly what you keep getting wrong.",
    link: "/gym",
    gradient: "from-amber-500/10 to-amber-600/5",
    border: "hover:border-amber-300/60",
    iconColor: "bg-amber-100 text-amber-600",
  },
  {
    icon: Users,
    emoji: "🏛️",
    title: "Swedish Culture & Society",
    description: "Understand Swedish history, government, values and everyday life — the knowledge that connects people here.",
    link: "/civic",
    gradient: "from-rose-500/10 to-rose-600/5",
    border: "hover:border-rose-300/60",
    iconColor: "bg-rose-100 text-rose-600",
  },
  {
    icon: TrendingUp,
    emoji: "📊",
    title: "Progress & Test Readiness",
    description: "See your mastery per skill, a test-readiness score, streaks and weak areas — so you always know what to do next.",
    link: "/dashboard",
    gradient: "from-emerald-500/10 to-emerald-600/5",
    border: "hover:border-emerald-300/60",
    iconColor: "bg-emerald-100 text-emerald-600",
  },
];

export default function FeatureCards() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-[#FECC02]/20 border border-[#FECC02]/40 rounded-full px-4 py-1.5 text-sm font-medium text-foreground mb-4">
          🇸🇪 Built for your Swedish journey
        </div>
        <h2 className="font-display text-3xl font-bold text-foreground">Everything you need in one place</h2>
        <p className="mt-3 text-muted-foreground text-base max-w-xl mx-auto">
          From your first words to fluent conversation and cultural understanding.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.07 }}
            >
              <Link to={feature.link}>
                <Card className={`group h-full border-border/50 ${feature.border} hover:shadow-lg transition-all duration-300 cursor-pointer bg-gradient-to-br ${feature.gradient} overflow-hidden`}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-11 h-11 rounded-xl ${feature.iconColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-2xl">{feature.emoji}</span>
                    </div>
                    <h3 className="font-semibold text-foreground mb-2 text-base">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                    <div className="mt-4 flex items-center gap-1 text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      Get started <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}