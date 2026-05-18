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
import Link from "next/link";

type ToastTone = "success" | "error" | "info";
type ToastPosition = "top-right" | "top-center";

type ToastOptions = {
  message?: string;
  actionLabel?: string;
  actionHref?: string;
  autoClose?: boolean;
  position?: ToastPosition;
  aiDetails?: string;
  suggestions?: import("@/lib/types").Suggestion[];
};

type Toast = {
  id: number;
  title: string;
  message?: string;
  tone: ToastTone;
  actionLabel?: string;
  actionHref?: string;
  autoClose: boolean;
  position: ToastPosition;
  aiDetails?: string;
  suggestions?: import("@/lib/types").Suggestion[];
};

type ToastContextValue = {
  pushToast: (title: string, tone?: ToastTone, options?: ToastOptions) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const TOAST_STYLES: Record<ToastTone, string> = {
  success: "border-emerald-200 bg-emerald-50/95 text-emerald-950 shadow-emerald-900/10 dark:border-emerald-300/15 dark:bg-emerald-500/8 dark:text-white dark:shadow-black/10",
  error: "border-red-200 bg-red-50/95 text-red-950 shadow-red-900/10 dark:border-red-200/45 dark:bg-red-950/95 dark:text-white dark:shadow-red-950/35",
  info: "border-slate-200 bg-white/95 text-slate-950 shadow-slate-900/10 dark:border-white/8 dark:bg-slate-900/60 dark:text-white dark:shadow-black/10",
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
        actionHref: options.actionHref,
        autoClose,
        position: options.position ?? "top-right",
        aiDetails: options.aiDetails,
        suggestions: options.suggestions,
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
        <div className="font-semibold leading-6 text-current">{toast.title}</div>
        {toast.message ? <div className="mt-0.5 leading-5 text-current opacity-80">{toast.message}</div> : null}
        {toast.aiDetails ? <div className="mt-1.5 rounded bg-current/5 px-2 py-1 text-xs leading-4 text-current opacity-70">{toast.aiDetails}</div> : null}
        
        {toast.suggestions && toast.suggestions.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {toast.suggestions.map((suggestion, idx) => {
              const isPrimary = suggestion.priority === "primary";
              const btnClass = cn(
                "h-8 border px-3 text-current transition-colors text-xs font-medium rounded-md flex items-center",
                isPrimary 
                  ? "border-current/30 bg-current/10 hover:bg-current/15" 
                  : "border-transparent bg-transparent hover:bg-current/5"
              );
              
              if (suggestion.url) {
                return (
                  <Link key={idx} href={suggestion.url} className={btnClass} onClick={() => dismissToast(toast.id)}>
                    {suggestion.title}
                  </Link>
                );
              }
              
              return (
                <button key={idx} type="button" className={btnClass} onClick={() => dismissToast(toast.id)}>
                  {suggestion.title}
                </button>
              );
            })}
          </div>
        ) : toast.actionLabel ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="mt-3 h-8 border border-current/20 bg-current/8 px-3 text-current hover:bg-current/12 hover:text-current"
            onClick={() => {
              if (toast.actionHref) window.location.href = toast.actionHref;
              dismissToast(toast.id);
            }}
          >
            {toast.actionLabel}
          </Button>
        ) : null}
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-8 shrink-0 rounded-full text-current opacity-65 hover:bg-current/12 hover:text-current hover:opacity-100"
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
      <div className="flex size-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-300/10 dark:text-emerald-200/80">
        <CheckIcon className="size-3.5" />
      </div>
    );
  }

  if (tone === "error") {
    return (
      <div className="flex size-7 items-center justify-center rounded-full bg-red-100 text-red-800 dark:bg-red-100/95 dark:text-red-800">
        <AlertIcon className="size-4" />
      </div>
    );
  }

  return (
    <div className="flex size-6 items-center justify-center rounded-full bg-slate-100 text-slate-700 dark:bg-white/8 dark:text-white/65">
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
