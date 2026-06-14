import { useEffect } from "react";
import { Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSpeech } from "@/hooks/useSpeech";
import { prefetchTts } from "@/lib/tts";

export default function SpeakButton({ text, lang = "sv-SE", className, ariaLabel = "Play pronunciation" }) {
  const { speak, speaking } = useSpeech();
  const warm = () => { if (lang.startsWith("sv")) prefetchTts(text); };

  // Warm the cache so the first tap plays instantly and within the gesture.
  useEffect(() => { warm(); }, [text, lang]);

  return (
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); speak(text, lang); }}
      onPointerEnter={warm}
      onFocus={warm}
      aria-label={ariaLabel}
      className={cn(
        "relative flex items-center justify-center w-8 h-8 rounded-full transition-colors before:absolute before:inset-[-6px] before:content-['']",
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
