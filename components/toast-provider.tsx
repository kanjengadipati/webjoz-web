"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useMemo,
  useState,
} from "react";

type ToastTone = "success" | "error" | "info";

type Toast = {
  id: number;
  title: string;
  tone: ToastTone;
};

type ToastContextValue = {
  pushToast: (title: string, tone?: ToastTone) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timersRef = useRef<Map<number, number>>(new Map());
  const recentRef = useRef<Map<string, number>>(new Map());

  const pushToast = useCallback((title: string, tone: ToastTone = "info") => {
    const now = Date.now();
    const key = `${tone}:${title}`;
    const lastShownAt = recentRef.current.get(key);

    if (lastShownAt && now - lastShownAt < 1800) {
      return;
    }

    recentRef.current.set(key, now);
    const id = Date.now() + Math.floor(Math.random() * 1000);
    setToasts((current) => [...current.slice(-2), { id, title, tone }]);

    const timer = window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
      timersRef.current.delete(id);
    }, 2800);
    timersRef.current.set(id, timer);
  }, []);

  const value = useMemo(() => ({ pushToast }), [pushToast]);

  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
      timers.clear();
    };
  }, []);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-50 flex w-[min(100%,24rem)] flex-col gap-2 px-4 sm:right-6 sm:top-6 sm:px-0">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex w-full items-start gap-3 rounded-2xl border px-4 py-3 text-sm shadow-2xl backdrop-blur-xl ${toastClass(
              toast.tone,
            )}`}
          >
            <div className="mt-0.5">{toastIcon(toast.tone)}</div>
            <div className="min-w-0 flex-1">
              <div className="font-medium leading-6 text-white/95">{toast.title}</div>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function toastClass(tone: ToastTone) {
  switch (tone) {
    case "success":
      return "border-emerald-400/25 bg-emerald-500/15 text-white";
    case "error":
      return "border-rose-400/25 bg-rose-500/15 text-white";
    default:
      return "border-white/10 bg-slate-900/80 text-white";
  }
}

function toastIcon(tone: ToastTone) {
  if (tone === "success") {
    return (
      <div className="flex size-6 items-center justify-center rounded-full bg-emerald-400/20 text-emerald-200">
        <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m5 13 4 4L19 7" />
        </svg>
      </div>
    );
  }

  if (tone === "error") {
    return (
      <div className="flex size-6 items-center justify-center rounded-full bg-rose-400/20 text-rose-200">
        <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 8v5" />
          <path d="M12 16h.01" />
          <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
        </svg>
      </div>
    );
  }

  return (
    <div className="flex size-6 items-center justify-center rounded-full bg-white/10 text-white/80">
      <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4" />
        <path d="M12 8h.01" />
      </svg>
    </div>
  );
}

export function useToast() {
  const value = useContext(ToastContext);
  if (!value) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return value;
}
