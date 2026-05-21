import { Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSpeech } from "@/hooks/useSpeech";

export default function SpeakButton({ text, lang = "sv-SE", className, ariaLabel = "Play pronunciation" }) {
  const { speak, speaking } = useSpeech();

  return (
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); speak(text, lang); }}
      aria-label={ariaLabel}
      className={cn(
        "flex items-center justify-center min-w-[44px] min-h-[44px] w-8 h-8 rounded-full transition-colors",
        speaking
          ? "bg-primary/20 text-primary"
          : "text-muted-foreground hover:bg-primary/10 hover:text-primary",
        className
      )}
      title={`Listen: ${text}`}
    >
      <Volume2 className={cn("w-4 h-4", speaking && "animate-pulse")} />
    </button>
  );
}