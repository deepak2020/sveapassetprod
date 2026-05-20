import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarCheck, CheckCircle2, ChevronRight, Trophy } from "lucide-react";

const QUESTION_POOL = [
  { q: "Vilket år antog Sverige sin nuvarande grundlag?", a: "1974", choices: ["1809", "1974", "1921", "1953"], en: "What year did Sweden adopt its current constitution?" },
  { q: "Vad heter Sveriges riksdag på engelska?", a: "The Riksdag", choices: ["The Parliament", "The Riksdag", "The Senate", "The Stortinget"], en: "What is Sweden's parliament called in English?" },
  { q: "Vilken stad är Sveriges huvudstad?", a: "Stockholm", choices: ["Göteborg", "Malmö", "Stockholm", "Uppsala"], en: "Which city is Sweden's capital?" },
  { q: "Vilket språk talas i Sverige?", a: "Svenska", choices: ["Norska", "Danska", "Finska", "Svenska"], en: "Which language is spoken in Sweden?" },
  { q: "Vad kallas den svenska polisen?", a: "Polisen", choices: ["Ordningsvakterna", "Polisen", "Gendarmerie", "Säpo"], en: "What is the Swedish police called?" },
  { q: "Hur många månader har ett år?", a: "12", choices: ["10", "11", "12", "13"], en: "How many months does a year have?" },
  { q: "Vad är Systembolaget?", a: "Statligt alkoholmonopol", choices: ["En mataffär", "En bank", "Statligt alkoholmonopol", "En resebyrå"], en: "What is Systembolaget?" },
  { q: "Vilket av dessa är ett nordiskt land?", a: "Norge", choices: ["Polen", "Nederländerna", "Norge", "Belgien"], en: "Which of these is a Nordic country?" },
  { q: "Vad heter midsommar på engelska?", a: "Midsummer", choices: ["Midsummer", "Midwinter", "Harvest", "Easter"], en: "What is 'midsommar' called in English?" },
  { q: "Hur skriver man 'thank you' på svenska?", a: "Tack", choices: ["Tack", "Hej", "Förlåt", "Varsågod"], en: "How do you write 'thank you' in Swedish?" },
  { q: "Vad innebär 'allemansrätten'?", a: "Rätt att vistas i naturen", choices: ["Rösträtt för alla", "Rätt att vistas i naturen", "Rätt till gratis utbildning", "Rätt till sjukvård"], en: "What does 'allemansrätten' mean?" },
  { q: "Vilken valuta används i Sverige?", a: "Svenska kronor", choices: ["Euro", "Svenska kronor", "Danska kronor", "Norska kronor"], en: "What currency is used in Sweden?" },
  { q: "Vad är Försäkringskassan?", a: "Socialförsäkringsmyndigheten", choices: ["Skattemyndigheten", "Polismyndigheten", "Socialförsäkringsmyndigheten", "Migrationsverket"], en: "What is Försäkringskassan?" },
  { q: "Hur säger man 'good morning' på svenska?", a: "God morgon", choices: ["God kväll", "God natt", "God morgon", "God eftermiddag"], en: "How do you say 'good morning' in Swedish?" },
  { q: "Vad är SFI?", a: "Svenska för invandrare", choices: ["Statens finansinspektionen", "Svenska för invandrare", "Stockholms fria idrottssällskap", "Statens fastighetsinstitut"], en: "What is SFI?" },
  { q: "Vilket organ stiftar lagar i Sverige?", a: "Riksdagen", choices: ["Regeringen", "Riksdagen", "Domstolarna", "Kommunerna"], en: "Which body enacts laws in Sweden?" },
  { q: "Vad heter 'house' på svenska?", a: "Hus", choices: ["Hus", "Hem", "Bostad", "Villa"], en: "What is 'house' in Swedish?" },
  { q: "Hur många veckor har ett år?", a: "52", choices: ["48", "50", "52", "54"], en: "How many weeks does a year have?" },
  { q: "Vad är en personnummer?", a: "Identifikationsnummer för personer", choices: ["Telefonnummer", "Kontonummer", "Identifikationsnummer för personer", "Postnummer"], en: "What is a 'personnummer'?" },
  { q: "Vilket av dessa är ett verb?", a: "Springa", choices: ["Snabb", "Springa", "Röd", "Bok"], en: "Which of these is a verb?" },
  { q: "Vad heter 'water' på svenska?", a: "Vatten", choices: ["Mjölk", "Juice", "Vatten", "Saft"], en: "What is 'water' in Swedish?" },
  { q: "I vilket land uppfanns IKEA?", a: "Sverige", choices: ["Danmark", "Norge", "Finland", "Sverige"], en: "In which country was IKEA founded?" },
  { q: "Vad är ett substantiv?", a: "Ett ord som betecknar sak eller person", choices: ["Ett ord som betecknar handling", "Ett ord som betecknar egenskap", "Ett ord som betecknar sak eller person", "Ett bindeord"], en: "What is a noun?" },
  { q: "Hur säger man 'please' på svenska?", a: "Snälla / Varsågod", choices: ["Tack", "Förlåt", "Snälla / Varsågod", "Ursäkta"], en: "How do you say 'please' in Swedish?" },
  { q: "Vad är Migrationsverket?", a: "Myndigheten för migration och asyl", choices: ["Sjukvårdsmyndigheten", "Myndigheten för migration och asyl", "Utbildningsmyndigheten", "Trafikverket"], en: "What is Migrationsverket?" },
  { q: "Vad heter 'school' på svenska?", a: "Skola", choices: ["Kontor", "Skola", "Butik", "Sjukhus"], en: "What is 'school' in Swedish?" },
  { q: "Hur skriver man siffran 5 som text på svenska?", a: "Fem", choices: ["Fyra", "Sex", "Fem", "Sju"], en: "How do you write the number 5 as text in Swedish?" },
  { q: "Vad innebär 'lagom'?", a: "Inte för mycket, inte för lite", choices: ["Väldigt bra", "Inte för mycket, inte för lite", "Alldeles för litet", "Extremt stort"], en: "What does 'lagom' mean?" },
  { q: "Vilket pronomen är tredje person singular i svenska?", a: "Han/Hon/Den/Det", choices: ["Jag", "Du", "Vi", "Han/Hon/Den/Det"], en: "Which pronoun is third person singular in Swedish?" },
  { q: "Hur säger man 'I don't understand' på svenska?", a: "Jag förstår inte", choices: ["Jag vet inte", "Jag förstår inte", "Jag pratar inte svenska", "Kan du hjälpa mig?"], en: "How do you say 'I don't understand' in Swedish?" },
];

const STORAGE_KEY_PREFIX = "svenska:daily_challenge:";
const QUESTIONS_PER_DAY = 5;

function getTodayKey() {
  return new Date().toISOString().split("T")[0];
}

function getDailyQuestions() {
  const today = getTodayKey();
  // Seed selection by numeric date string
  const seed = parseInt(today.replace(/-/g, ""), 10);
  const indices = [];
  let n = seed;
  while (indices.length < QUESTIONS_PER_DAY) {
    n = (n * 1664525 + 1013904223) & 0xffffffff;
    const idx = Math.abs(n) % QUESTION_POOL.length;
    if (!indices.includes(idx)) indices.push(idx);
  }
  return indices.map((i) => QUESTION_POOL[i]);
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PREFIX + getTodayKey());
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY_PREFIX + getTodayKey(), JSON.stringify(state));
}

export default function DailyChallenge() {
  const questions = useMemo(() => getDailyQuestions(), []);
  const savedState = useMemo(() => loadState(), []);

  const [started, setStarted] = useState(!!savedState);
  const [current, setCurrent] = useState(savedState?.current ?? 0);
  const [answers, setAnswers] = useState(savedState?.answers ?? []);
  const [selected, setSelected] = useState(null);
  const [finished, setFinished] = useState(savedState?.finished ?? false);

  const isCompleted = finished;
  const correctCount = answers.filter((a, i) => a === questions[i]?.a).length;

  const handleAnswer = (choice) => {
    if (selected !== null) return;
    setSelected(choice);
    const newAnswers = [...answers, choice];
    setAnswers(newAnswers);

    setTimeout(() => {
      const next = current + 1;
      if (next >= questions.length) {
        const state = { current: next, answers: newAnswers, finished: true };
        saveState(state);
        setFinished(true);
        const correct = newAnswers.filter((a, i) => a === questions[i]?.a).length;
        window.dispatchEvent(new CustomEvent("xp-awarded", { detail: { amount: correct * 5, label: "Daily Challenge" } }));
      } else {
        const state = { current: next, answers: newAnswers, finished: false };
        saveState(state);
        setCurrent(next);
        setSelected(null);
      }
    }, 800);
  };

  if (!started) {
    return (
      <Card className="border-sky-300/50 dark:border-sky-700/40 bg-sky-50/40 dark:bg-sky-950/20">
        <CardContent className="p-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <CalendarCheck className="w-5 h-5 text-sky-600 dark:text-sky-400 shrink-0" />
            <div>
              <p className="text-sm font-medium">Dagens utmaning</p>
              <p className="text-xs text-muted-foreground italic">Daily challenge · {QUESTIONS_PER_DAY} questions · resets at midnight</p>
            </div>
          </div>
          <Button size="sm" className="shrink-0 gap-1 bg-sky-600 hover:bg-sky-700" onClick={() => setStarted(true)}>
            Börja <ChevronRight className="w-3.5 h-3.5" />
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (isCompleted) {
    const pct = Math.round((correctCount / questions.length) * 100);
    return (
      <Card className="border-sky-300/50 dark:border-sky-700/40 bg-sky-50/40 dark:bg-sky-950/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
            <p className="text-sm font-semibold">Dagens utmaning klar! · Daily challenge done!</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${pct >= 80 ? "bg-emerald-500" : pct >= 60 ? "bg-amber-400" : "bg-destructive"}`} style={{ width: `${pct}%` }} />
            </div>
            <span className="text-sm font-bold text-foreground shrink-0">{correctCount}/{questions.length}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1 italic">Kommer tillbaka imorgon · Come back tomorrow</p>
        </CardContent>
      </Card>
    );
  }

  const q = questions[current];

  return (
    <Card className="border-sky-300/50 dark:border-sky-700/40 bg-sky-50/40 dark:bg-sky-950/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center justify-between">
          <span className="flex items-center gap-2">
            <CalendarCheck className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            Dagens utmaning
            <span className="text-xs font-normal text-muted-foreground/60 italic">· Daily challenge</span>
          </span>
          <span className="text-xs font-normal text-muted-foreground">{current + 1} / {questions.length}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <p className="text-sm font-medium mb-0.5">{q.q}</p>
            <p className="text-xs text-muted-foreground italic mb-3">{q.en}</p>
            <div className="grid grid-cols-2 gap-2">
              {q.choices.map((c) => {
                const isSelected = selected === c;
                const isCorrect = c === q.a;
                const showResult = selected !== null;
                let cls = "text-left p-2.5 rounded-lg border text-sm transition-all ";
                if (showResult && isCorrect) cls += "border-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 font-semibold text-emerald-700 dark:text-emerald-400";
                else if (showResult && isSelected && !isCorrect) cls += "border-destructive bg-destructive/10 text-destructive";
                else if (!showResult) cls += "border-border/60 bg-card hover:border-sky-400 hover:bg-sky-50/50 dark:hover:bg-sky-950/20 cursor-pointer";
                else cls += "border-border/40 bg-muted/30 text-muted-foreground";
                return (
                  <button key={c} className={cls} onClick={() => handleAnswer(c)} disabled={selected !== null}>
                    {c}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
