import { Mic, MicOff, Loader2 } from "lucide-react";

// Big circular mic button used across Tala stations.
export default function MicButton({ listening, onToggle, disabled, size = "lg" }) {
  const dim = size === "sm" ? "w-12 h-12" : "w-16 h-16";
  const iconDim = size === "sm" ? "w-5 h-5" : "w-7 h-7";
  return (
    <button
      onClick={onToggle}
      disabled={disabled}
      aria-label={listening ? "Stop recording" : "Start recording"}
      className={`${dim} rounded-full flex items-center justify-center transition-all shadow-lg disabled:opacity-50 ${
        listening
          ? "bg-red-500 hover:bg-red-600 scale-110 animate-pulse"
          : "bg-primary hover:bg-primary/90"
      }`}
    >
      {disabled ? (
        <Loader2 className={`${iconDim} text-white animate-spin`} />
      ) : listening ? (
        <MicOff className={`${iconDim} text-white`} />
      ) : (
        <Mic className={`${iconDim} text-white`} />
      )}
    </button>
  );
}