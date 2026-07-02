"use client";

import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Depth = 25 | 50 | 75 | 100;
type Toast = { id: number; depth: Depth };

const MESSAGES: Record<Depth, string> = {
  25: "Tiếp tục khám phá AuraRing ↓",
  50: "Đã xem một nửa — thông số kỹ thuật ở phía dưới",
  75: "Gần hết rồi — đừng bỏ lỡ ưu đãi đặt trước",
  100: "Bạn đã xem hết trang. Đặt trước ngay?",
};

const ToastCtx = createContext<{ pushToast: (depth: Depth) => void } | null>(null);

const MAX_VISIBLE = 2; // cap concurrent toasts — this is a milestone nudge, not a notification center

export function ScrollToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idRef = useRef(0);

  const pushToast = useCallback((depth: Depth) => {
    const id = ++idRef.current;
    setToasts((prev) => [...prev.slice(-(MAX_VISIBLE - 1)), { id, depth }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  }, []);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastCtx.Provider value={{ pushToast }}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-5 z-[80] flex flex-col items-center gap-2 px-4"
      >
        <AnimatePresence mode="popLayout">
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96, transition: { duration: 0.15 } }}
              transition={{ type: "spring", damping: 24, stiffness: 320 }}
              onClick={() => dismiss(t.id)}
              className="pointer-events-auto max-w-[calc(100vw-2rem)] sm:max-w-sm flex items-center gap-3 rounded-full bg-midnight/95 dark:bg-bone/95 text-bone dark:text-midnight text-sm px-5 py-3 shadow-lg backdrop-blur-sm cursor-pointer"
            >
              <span className="num text-aqua dark:text-midnight shrink-0 font-semibold">{t.depth}%</span>
              <span className="truncate">{MESSAGES[t.depth]}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastCtx.Provider>
  );
}

export function useScrollToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error("useScrollToast must be inside ScrollToastProvider");
  return ctx;
}
