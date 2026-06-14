import { usePageView } from "@/hooks/usePageView";
import { useQuery } from "@tanstack/react-query";
import { Headphones, ArrowRight } from "lucide-react";
import { getListeningBank } from "@/data/listeningBankC";
import { supabase } from "@/api/supabaseClient";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const SFI_COURSES = [
  { id: "A", name: "Course A", subtitle: "Absolute Beginner", color: "from-emerald-400 to-teal-500", bg: "bg-emerald-50 dark:bg-emerald-900/20", border: "border-emerald-200 dark:border-emerald-800", badge: "bg-emerald-100 text-emerald-800" },
  { id: "B", name: "Course B", subtitle: "Beginner",          color: "from-blue-400 to-indigo-500",    bg: "bg-blue-50 dark:bg-blue-900/20",    border: "border-blue-200 dark:border-blue-800",    badge: "bg-blue-100 text-blue-800" },
  { id: "C", name: "Course C", subtitle: "Intermediate",      color: "from-violet-400 to-purple-500",  bg: "bg-violet-50 dark:bg-violet-900/20",border: "border-violet-200 dark:border-violet-800", badge: "bg-violet-100 text-violet-800" },
  { id: "D", name: "Course D", subtitle: "Advanced",          color: "from-orange-400 to-red-500",     bg: "bg-orange-50 dark:bg-orange-900/20",border: "border-orange-200 dark:border-orange-800", badge: "bg-orange-100 text-orange-800" },
];

export default function LanguageTest() {
  usePageView("language_test");

  // Courses that have a listening test in Supabase (static data as fallback)
  const { data: listeningCourses = [] } = useQuery({
    queryKey: ["listeningCourses"],
    queryFn: async () => {
      const { data } = await supabase.listening.getCourses();
      return Array.isArray(data) ? data.map((r) => r.course) : [];
    },
  });
  const hasListeningTest = (course) => listeningCourses.includes(course) || !!getListeningBank(course);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Headphones className="w-5 h-5 text-primary" />
        </div>
        <h1 className="font-display text-3xl font-bold text-foreground">Hörförståelse</h1>
      </div>
      <p className="text-muted-foreground mb-10">Öva hörförståelse per SFI-kurs — som på det nationella provet</p>

      {/* Course selector → listening */}
      <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Välj en kurs</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {SFI_COURSES.map((course, i) => {
          const available = hasListeningTest(course.id);
          const inner = (
            <>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${course.badge} mb-2`}>
                    {course.name}
                  </span>
                  <p className="font-semibold text-foreground">{course.subtitle}</p>
                </div>
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${course.color} flex items-center justify-center text-white font-bold text-lg`}>
                  {course.id}
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                {available ? "Hörförståelse – samtal, telefonsamtal, meddelanden m.m." : `Hörförståelse kommer snart för kurs ${course.id}`}
              </p>
              {available && (
                <div className="flex items-center gap-1 mt-3 text-sm font-semibold text-foreground group-hover:gap-2 transition-all">
                  Starta <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </>
          );
          return (
            <motion.div key={course.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
              {available ? (
                <Link
                  to={`/listening/${course.id.toLowerCase()}`}
                  className={`block w-full text-left rounded-2xl border-2 ${course.border} ${course.bg} p-6 hover:shadow-lg transition-all duration-300 group`}
                >
                  {inner}
                </Link>
              ) : (
                <div className={`w-full text-left rounded-2xl border-2 ${course.border} ${course.bg} p-6 opacity-40 cursor-not-allowed`}>
                  {inner}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
