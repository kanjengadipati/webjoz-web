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
import { AlertIcon, CheckIcon, CloseIcon, InfoIcon } from "@/components/icons";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";

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

const TOAST_STYLES: Record<ToastTone, string> = {
  success: "border-emerald-400/30 bg-emerald-950/90 text-white",
  error: "border-rose-400/30 bg-rose-950/90 text-white",
  info: "border-white/10 bg-slate-950/90 text-white",
};

let toastCounter = 0;

function generateToastId() {
  toastCounter = toastCounter > 1_000_000 ? 1 : toastCounter + 1;
  return toastCounter;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timersRef = useRef<Map<number, number>>(new Map());
  const recentRef = useRef<Map<string, number>>(new Map());

  const dismissToast = useCallback((id: number) => {
    const timer = timersRef.current.get(id);
    if (timer) {
      window.clearTimeout(timer);
      timersRef.current.delete(id);
    }
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const pushToast = useCallback((title: string, tone: ToastTone = "info") => {
    const now = Date.now();
    const key = `${tone}:${title}`;
    const lastShownAt = recentRef.current.get(key);

    if (lastShownAt && now - lastShownAt < 1800) {
      return;
    }

    recentRef.current.set(key, now);
    const id = generateToastId();
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
            className={cn("pointer-events-auto flex w-full items-start gap-3 rounded-2xl border px-4 py-3 text-sm shadow-2xl backdrop-blur-xl", TOAST_STYLES[toast.tone])}
            role="status"
            aria-live={toast.tone === "error" ? "assertive" : "polite"}
          >
            <div className="mt-0.5">{toastIcon(toast.tone)}</div>
            <div className="min-w-0 flex-1">
              <div className="font-medium leading-6 text-white/95">{toast.title}</div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-7 shrink-0 rounded-full text-white/50 hover:bg-white/10 hover:text-white"
              onClick={() => dismissToast(toast.id)}
              aria-label="Dismiss notification"
            >
              <CloseIcon size="sm" />
            </Button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function toastIcon(tone: ToastTone) {
  if (tone === "success") {
    return (
      <div className="flex size-6 items-center justify-center rounded-full bg-emerald-400/20 text-emerald-200">
        <CheckIcon className="size-3.5" />
      </div>
    );
  }

  if (tone === "error") {
    return (
      <div className="flex size-6 items-center justify-center rounded-full bg-rose-400/20 text-rose-200">
        <AlertIcon className="size-3.5" />
      </div>
    );
  }

  return (
    <div className="flex size-6 items-center justify-center rounded-full bg-white/10 text-white/80">
      <InfoIcon className="size-3.5" />
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
