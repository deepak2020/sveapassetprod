import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Loader2, CalendarDays, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";

const SKILLS = [
  { value: "grammar", label: "🔤 Grammar" },
  { value: "vocabulary", label: "📝 Vocabulary" },
  { value: "reading", label: "📖 Reading" },
  { value: "listening", label: "👂 Listening" },
  { value: "speaking", label: "🗣️ Speaking" },
  { value: "writing", label: "✍️ Writing" },
];

const COURSES = ["A", "B", "C", "D"];
const DURATIONS = [15, 30, 60, 90];

export default function CreateStudyPlanModal({ open, onClose, onCreated, userId, primaryCourse }) {
  const [course, setCourse] = useState(primaryCourse || "A");
  const [includeCourses, setIncludeCourses] = useState([]);
  const [focusSkills, setFocusSkills] = useState([]);
  const [targetDays, setTargetDays] = useState(30);
  const [step, setStep] = useState("config"); // config | generating | done
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const toggleSkill = (skill) => {
    setFocusSkills(prev => prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]);
  };

  const toggleCourse = (c) => {
    if (c === course) return;
    setIncludeCourses(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);
  };

  const handlePreview = async () => {
    setLoading(true);
    const allCourses = [course, ...includeCourses];
    let totalLessons = [];

    for (const c of allCourses) {
      const lessons = await base44.entities.Lesson.filter({ sfi_course: c }, "order", 500);
      const filtered = focusSkills.length > 0
        ? lessons.filter(l => focusSkills.includes(l.skill))
        : lessons;
      totalLessons = [...totalLessons, ...filtered];
    }

    const perDay = Math.ceil(totalLessons.length / targetDays);
    setPreview({ total: totalLessons.length, perDay, lessons: totalLessons });
    setLoading(false);
  };

  const handleGenerate = async () => {
    if (!preview) return;
    setStep("generating");

    const startDate = new Date();
    const schedule = [];

    for (let i = 0; i < targetDays; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      const dayLessons = preview.lessons.slice(i * preview.perDay, (i + 1) * preview.perDay);
      if (dayLessons.length > 0) {
        schedule.push({ date: dateStr, lesson_ids: dayLessons.map(l => l.id) });
      }
    }

    const planData = {
      course,
      include_courses: includeCourses,
      focus_skills: focusSkills,
      start_date: startDate.toISOString().split('T')[0],
      target_days: targetDays,
      daily_schedule: schedule,
      completed_lesson_ids: [],
    };

    await onCreated(planData);
    setStep("done");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-primary" />
            Create Study Plan
          </DialogTitle>
          <DialogDescription>
            Set your goal and we'll build a day-by-day plan for you.
          </DialogDescription>
        </DialogHeader>

        {step === "config" && (
          <div className="space-y-5">
            {/* Primary Course */}
            <div className="space-y-2">
              <p className="text-sm font-semibold">Your current level</p>
              <div className="flex gap-2">
                {COURSES.map(c => (
                  <button
                    key={c}
                    onClick={() => setCourse(c)}
                    className={`flex-1 py-2 rounded-lg text-sm font-bold border-2 transition-all ${course === c ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary/50"}`}
                  >
                    Kurs {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Include earlier courses */}
            <div className="space-y-2">
              <p className="text-sm font-semibold">Include lessons from earlier courses?</p>
              <div className="flex gap-2 flex-wrap">
                {COURSES.filter(c2 => c2 < course).map(c2 => (
                  <button
                    key={c2}
                    onClick={() => toggleCourse(c2)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium border-2 transition-all ${includeCourses.includes(c2) ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/50"}`}
                  >
                    Kurs {c2}
                  </button>
                ))}
                {COURSES.filter(c2 => c2 < course).length === 0 && (
                  <p className="text-sm text-muted-foreground italic">No earlier courses for Kurs A</p>
                )}
              </div>
            </div>

            {/* Focus Skills */}
            <div className="space-y-2">
              <p className="text-sm font-semibold">Focus on specific skills? <span className="font-normal text-muted-foreground">(optional — leave empty for all)</span></p>
              <div className="grid grid-cols-2 gap-2">
                {SKILLS.map(s => (
                  <button
                    key={s.value}
                    onClick={() => toggleSkill(s.value)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm border-2 transition-all text-left ${focusSkills.includes(s.value) ? "border-primary bg-primary/10 text-primary font-medium" : "border-border hover:border-primary/50"}`}
                  >
                    {focusSkills.includes(s.value) && <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />}
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <p className="text-sm font-semibold">Complete in how many days?</p>
              <div className="flex gap-2">
                {DURATIONS.map(d => (
                  <button
                    key={d}
                    onClick={() => setTargetDays(d)}
                    className={`flex-1 py-2 rounded-lg text-sm font-bold border-2 transition-all ${targetDays === d ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary/50"}`}
                  >
                    {d}d
                  </button>
                ))}
              </div>
            </div>

            {/* Preview */}
            {preview && (
              <div className="rounded-xl bg-muted p-4 text-sm space-y-1">
                <p><strong>{preview.total}</strong> lessons matched</p>
                <p><strong>{preview.perDay}</strong> lessons per day</p>
                <p><strong>{targetDays}</strong> days to complete</p>
              </div>
            )}

            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
              {!preview ? (
                <Button onClick={handlePreview} disabled={loading} className="flex-1">
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Calculating...</> : "Preview Plan"}
                </Button>
              ) : (
                <Button onClick={handleGenerate} className="flex-1">Generate Plan</Button>
              )}
            </div>
          </div>
        )}

        {step === "generating" && (
          <div className="flex items-center gap-3 py-6 text-sm text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin" />
            Building your study plan...
          </div>
        )}

        {step === "done" && (
          <div className="space-y-4 py-2">
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
              <CheckCircle2 className="w-5 h-5" />
              <span className="font-semibold">Study plan created!</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Your {targetDays}-day plan is ready. Check your Dashboard to see today's lessons.
            </p>
            <Button onClick={onClose} className="w-full">View Dashboard</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
