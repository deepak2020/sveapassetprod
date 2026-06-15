import { cn } from "@/lib/utils";

// Svea wordmark — a small text logo used wherever the tutor is named, instead
// of an icon. Gradient from Swedish blue to the brand purple.
export default function SveaLogo({ className }) {
  return (
    <span
      className={cn(
        "font-display font-extrabold tracking-tight bg-gradient-to-r from-[#006AA7] to-primary bg-clip-text text-transparent",
        className
      )}
    >
      Svea
    </span>
  );
}
