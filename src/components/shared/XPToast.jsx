import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap } from "lucide-react";

let toastId = 0;

export default function XPToast() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handler = (e) => {
      const { amount, label } = e.detail;
      if (!amount || amount <= 0) return;
      const id = ++toastId;
      setToasts((prev) => [...prev, { id, amount, label }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 2000);
    };
    window.addEventListener("xp-awarded", handler);
    return () => window.removeEventListener("xp-awarded", handler);
  }, []);

  return (
    <div className="fixed bottom-24 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 10, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ duration: 0.25 }}
            className="flex items-center gap-1.5 bg-primary text-primary-foreground px-3 py-1.5 rounded-full shadow-lg text-sm font-bold"
          >
            <Zap className="w-3.5 h-3.5" />
            +{t.amount} XP
            {t.label && <span className="font-normal opacity-80 text-xs">{t.label}</span>}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
