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
type ToastPosition = "top-right" | "top-center";

type ToastOptions = {
  message?: string;
  actionLabel?: string;
  autoClose?: boolean;
  position?: ToastPosition;
};

type Toast = {
  id: number;
  title: string;
  message?: string;
  tone: ToastTone;
  actionLabel?: string;
  autoClose: boolean;
  position: ToastPosition;
};

type ToastContextValue = {
  pushToast: (title: string, tone?: ToastTone, options?: ToastOptions) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const TOAST_STYLES: Record<ToastTone, string> = {
  success: "border-emerald-300/15 bg-emerald-500/8 text-white",
  error: "border-red-200/45 bg-red-950/95 text-white shadow-red-950/35",
  info: "border-white/8 bg-slate-900/60 text-white",
};

let toastCounter = 0;

function generateToastId() {
  toastCounter = toastCounter > 1_000_000 ? 1 : toastCounter + 1;
  return Date.now() * 1000 + toastCounter;
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

  const pushToast = useCallback((title: string, tone: ToastTone = "info", options: ToastOptions = {}) => {
    const now = Date.now();
    const key = `${tone}:${title}:${options.message ?? ""}`;
    const lastShownAt = recentRef.current.get(key);

    if (lastShownAt && now - lastShownAt < 1800) {
      return;
    }

    recentRef.current.set(key, now);
    const id = generateToastId();
    const autoClose = options.autoClose ?? true;
    setToasts((current) => {
      const nextToast = {
        id,
        title,
        message: options.message,
        tone,
        actionLabel: options.actionLabel,
        autoClose,
        position: options.position ?? "top-right",
      };

      if (current.some((toast) => toast.tone === nextToast.tone && toast.title === nextToast.title && toast.message === nextToast.message)) {
        return current;
      }

      return [...current.slice(-2), nextToast];
    });

    if (autoClose) {
      const timer = window.setTimeout(() => {
        setToasts((current) => current.filter((toast) => toast.id !== id));
        timersRef.current.delete(id);
      }, 2800);
      timersRef.current.set(id, timer);
    }
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
      <div className="pointer-events-none fixed left-1/2 top-4 z-50 flex w-[min(calc(100%_-_2rem),30rem)] -translate-x-1/2 flex-col gap-2 sm:top-6">
        {toasts.filter((toast) => toast.position === "top-center").map((toast) => (
          <ToastNotice key={toast.id} toast={toast} dismissToast={dismissToast} />
        ))}
      </div>
      <div className="pointer-events-none fixed right-4 top-4 z-50 flex w-[min(calc(100%_-_2rem),24rem)] flex-col gap-2 sm:right-6 sm:top-6">
        {toasts.filter((toast) => toast.position === "top-right").map((toast) => (
          <ToastNotice key={toast.id} toast={toast} dismissToast={dismissToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastNotice({ toast, dismissToast }: { toast: Toast; dismissToast: (id: number) => void }) {
  return (
    <div
      className={cn(
        "pointer-events-auto flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-sm shadow-lg backdrop-blur-xl",
        TOAST_STYLES[toast.tone],
      )}
      role={toast.tone === "error" ? "alert" : "status"}
      aria-live={toast.tone === "error" ? "assertive" : "polite"}
    >
      <div className="mt-0.5">{toastIcon(toast.tone)}</div>
      <div className="min-w-0 flex-1">
        <div className="font-semibold leading-6 text-white">{toast.title}</div>
        {toast.message ? <div className="mt-0.5 leading-5 text-white/85">{toast.message}</div> : null}
        {toast.actionLabel ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="mt-3 h-8 border border-white/20 bg-white/10 px-3 text-white hover:bg-white/18 hover:text-white"
            onClick={() => dismissToast(toast.id)}
          >
            {toast.actionLabel}
          </Button>
        ) : null}
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-8 shrink-0 rounded-full text-white/70 hover:bg-white/14 hover:text-white"
        onClick={() => dismissToast(toast.id)}
        aria-label="Dismiss notification"
      >
        <CloseIcon size="sm" />
      </Button>
    </div>
  );
}

function toastIcon(tone: ToastTone) {
  if (tone === "success") {
    return (
      <div className="flex size-6 items-center justify-center rounded-full bg-emerald-300/10 text-emerald-200/80">
        <CheckIcon className="size-3.5" />
      </div>
    );
  }

  if (tone === "error") {
    return (
      <div className="flex size-7 items-center justify-center rounded-full bg-red-100/95 text-red-800">
        <AlertIcon className="size-4" />
      </div>
    );
  }

  return (
    <div className="flex size-6 items-center justify-center rounded-full bg-white/8 text-white/65">
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
