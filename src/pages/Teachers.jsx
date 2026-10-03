import { GraduationCap, BookOpen, Mic, Landmark, Repeat } from "lucide-react";
import PageSEO from "@/components/shared/PageSEO";
import ClassLinkBox from "@/components/teachers/ClassLinkBox";

const FEATURES = [
  { icon: BookOpen, sv: "SFI kurs A–D", en: "Lessons, vocabulary and grammar for every level" },
  { icon: Repeat, sv: "Gym med repetition", en: "Spaced repetition so words stick between classes" },
  { icon: Mic, sv: "Tala", en: "Speaking practice with AI feedback, without the fear" },
  { icon: Landmark, sv: "Samhällskunskap", en: "Sverige i Fokus topics and citizenship test prep" },
];

export default function Teachers() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 pb-24 space-y-10">
      <PageSEO
        title="För SFI-lärare - Gratis övning för dina elever | Sveapasset"
        description="Free Swedish practice for SFI students. Get a class link and printable flyer to share Sveapasset with your students. No cost, no setup."
        canonical="https://sveapasset.se/larare"
      />
      <header className="space-y-3">
        <span className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full bg-secondary text-secondary-foreground"><GraduationCap className="w-3.5 h-3.5" /> För lärare</span>
        <h1 className="font-display text-4xl font-bold">För SFI-lärare</h1>
        <p className="text-lg text-muted-foreground">Ge dina elever gratis övning mellan lektionerna.</p>
        <p className="text-sm italic text-muted-foreground">Give your students free practice between classes. No accounts to manage, no cost.</p>
      </header>

      <div className="grid sm:grid-cols-2 gap-4">
        {FEATURES.map(({ icon: Icon, sv, en }) => (
          <div key={sv} className="rounded-2xl border border-border/50 bg-card p-5 space-y-2">
            <Icon className="w-5 h-5 text-primary" />
            <p className="font-semibold">{sv}</p>
            <p className="text-sm text-muted-foreground">{en}</p>
          </div>
        ))}
      </div>

      <ClassLinkBox />

      <p className="text-sm text-muted-foreground text-center">Frågor? Kontakta oss via <a href="/contact" className="text-primary underline">kontaktsidan</a>.</p>
    </div>
  );
}