import { forwardRef } from "react";
import { Flame, Zap, Award } from "lucide-react";

const BragCard = forwardRef(function BragCard({ course, xp, streak }, ref) {
  return (
    <div ref={ref} className="relative w-full aspect-square rounded-2xl overflow-hidden bg-primary text-primary-foreground p-6 flex flex-col justify-between">
      {/* Swedish flag cross */}
      <div className="absolute inset-y-0 left-[30%] w-[14%] bg-secondary/90" />
      <div className="absolute inset-x-0 top-[43%] h-[14%] bg-secondary/90" />

      <div className="relative">
        <p className="text-xs font-bold uppercase tracking-widest opacity-90">Sveapasset</p>
        <p className="text-sm opacity-90 mt-1">Jag har klarat · I finished</p>
      </div>

      <div className="relative flex items-center gap-4">
        <div className="w-20 h-20 rounded-full bg-secondary text-secondary-foreground flex flex-col items-center justify-center shadow-lg border-4 border-primary-foreground">
          <Award className="w-5 h-5" />
          <span className="text-2xl font-black leading-none">{course.id}</span>
        </div>
        <div className="bg-primary/90 rounded-xl px-3 py-2">
          <p className="font-display text-2xl font-bold leading-tight">{course.name}</p>
          <p className="text-xs italic opacity-90">{course.name_en}</p>
        </div>
      </div>

      <div className="relative flex items-end justify-between gap-2">
        <div className="flex gap-2">
          <span className="flex items-center gap-1 bg-primary/90 rounded-lg px-2 py-1 text-sm font-bold"><Zap className="w-4 h-4" />{xp.toLocaleString()} XP</span>
          <span className="flex items-center gap-1 bg-primary/90 rounded-lg px-2 py-1 text-sm font-bold"><Flame className="w-4 h-4" />{streak} dagar</span>
        </div>
        <span className="bg-primary/90 rounded-lg px-2 py-1 text-xs font-semibold">sveapasset.se</span>
      </div>
    </div>
  );
});

export default BragCard;