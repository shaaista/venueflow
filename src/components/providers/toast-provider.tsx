"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Info, AlertTriangle, X } from "lucide-react";

type ToastKind = "success" | "info" | "warning";
type Toast = { id: number; kind: ToastKind; title: string; description?: string };

const ToastContext = createContext<{ toast: (t: Omit<Toast, "id">) => void } | null>(null);

const ICON = { success: CheckCircle2, info: Info, warning: AlertTriangle };
const TINT = {
  success: "text-success",
  info: "text-espresso-600",
  warning: "text-amber-500",
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((t: Omit<Toast, "id">) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { ...t, id }]);
    setTimeout(() => setToasts((prev) => prev.filter((x) => x.id !== id)), 4000);
  }, []);

  const dismiss = (id: number) => setToasts((prev) => prev.filter((x) => x.id !== id));

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="pointer-events-none fixed bottom-5 right-5 z-[200] flex w-full max-w-sm flex-col gap-2.5">
        <AnimatePresence>
          {toasts.map((t) => {
            const Icon = ICON[t.kind];
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 16, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: 24 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="pointer-events-auto flex items-start gap-3 rounded-xl border border-line bg-surface p-3.5 shadow-float"
              >
                <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${TINT[t.kind]}`} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-cocoa">{t.title}</p>
                  {t.description && <p className="mt-0.5 text-xs text-cocoa-muted">{t.description}</p>}
                </div>
                <button onClick={() => dismiss(t.id)} className="text-cocoa-faint hover:text-cocoa"><X className="h-4 w-4" /></button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) return { toast: () => {} };
  return ctx;
}
