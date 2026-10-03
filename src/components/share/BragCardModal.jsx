import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import { Share2, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import BragCard from "./BragCard";

const APP_URL = "https://sveapasset.se";

export default function BragCardModal({ course, xp, streak, onClose }) {
  const cardRef = useRef(null);
  const [sharing, setSharing] = useState(false);
  const { toast } = useToast();
  const text = `Jag har klarat ${course.name} på Sveapasset! 🇸🇪 Lär dig svenska gratis: ${APP_URL}`;

  const handleShare = async () => {
    setSharing(true);
    try {
      const canvas = await html2canvas(cardRef.current, { scale: 2, backgroundColor: null });
      const blob = await new Promise((r) => canvas.toBlob(r, "image/png"));
      const file = new File([blob], `sveapasset-${course.id}.png`, { type: "image/png" });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], text, title: "Sveapasset" });
      } else if (navigator.share) {
        await navigator.share({ text, url: APP_URL, title: "Sveapasset" });
      } else {
        await navigator.clipboard.writeText(text);
        toast({ title: "Länk kopierad · Link copied" });
      }
    } catch (e) {
      if (e?.name !== "AbortError") {
        await navigator.clipboard?.writeText(text);
        toast({ title: "Länk kopierad · Link copied" });
      }
    }
    setSharing(false);
  };

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Grattis! 🎉 · Congratulations!</DialogTitle>
        </DialogHeader>
        <BragCard ref={cardRef} course={course} xp={xp} streak={streak} />
        <Button onClick={handleShare} disabled={sharing} className="w-full gap-2">
          {sharing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Share2 className="w-4 h-4" />}
          Dela · Share this
        </Button>
      </DialogContent>
    </Dialog>
  );
}