"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/** Centered modal dialog. */
export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg";
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const width = size === "sm" ? "max-w-md" : size === "lg" ? "max-w-2xl" : "max-w-lg";

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[120] flex items-start justify-center overflow-y-auto p-4 pt-[8vh]">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-espresso-900/30 backdrop-blur-sm" />
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -8 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className={cn("relative z-10 w-full overflow-hidden rounded-2xl border border-line bg-surface shadow-float", width)}
          >
            <div className="flex items-start justify-between border-b border-line p-5">
              <div>
                <h2 className="font-display text-xl text-cocoa">{title}</h2>
                {description && <p className="mt-0.5 text-sm text-cocoa-muted">{description}</p>}
              </div>
              <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-lg text-cocoa-faint hover:bg-panel hover:text-cocoa"><X className="h-4 w-4" /></button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto p-5">{children}</div>
            {footer && <div className="flex justify-end gap-2 border-t border-line bg-panel/40 px-5 py-3.5">{footer}</div>}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

/** Right-side slide-over drawer. */
export function Drawer({
  open,
  onClose,
  title,
  description,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 z-[120] bg-espresso-900/30 backdrop-blur-sm" />
          <motion.aside
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 32, stiffness: 340 }}
            className="fixed inset-y-0 right-0 z-[130] flex w-full max-w-md flex-col border-l border-line bg-surface shadow-float"
          >
            <div className="flex items-start justify-between border-b border-line p-5">
              <div>
                <h2 className="font-display text-xl text-cocoa">{title}</h2>
                {description && <p className="mt-0.5 text-sm text-cocoa-muted">{description}</p>}
              </div>
              <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-lg text-cocoa-faint hover:bg-panel hover:text-cocoa"><X className="h-4 w-4" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">{children}</div>
            {footer && <div className="flex justify-end gap-2 border-t border-line bg-panel/40 px-5 py-3.5">{footer}</div>}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
