"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export function AIPreview() {
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsProcessing(false);
    }, 2800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative flex min-h-[400px] overflow-hidden border-l border-border/30 bg-[radial-gradient(circle_at_top,_rgba(120,119,198,0.12),_transparent_45%),linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0))] p-6 sm:p-8 lg:min-h-full lg:p-10">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[grid-white/5] [mask-image:linear-gradient(to_bottom,transparent,black,transparent)] z-0 pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-background/20 to-transparent pointer-events-none" />

      {/* Processing State */}
      {isProcessing ? (
        <div className="z-20 flex w-full flex-col items-center justify-center space-y-6 self-center animate-in fade-in duration-700">
          <div className="relative size-20">
            <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-[ping_3s_infinite]" />
            <div className="absolute inset-2 rounded-full border-2 border-primary/40 animate-pulse" />
            <div className="absolute inset-4 rounded-full border-t-2 border-primary animate-spin" />
          </div>
          <div className="text-center">
            <div className="text-xl font-bold tracking-tighter text-primary animate-pulse">
              AI Summary Processing...
            </div>
            <div className="mt-2 flex items-center justify-center gap-2">
              <span className="size-1 rounded-full bg-emerald-500 animate-pulse" />
              <div className="text-[10px] font-bold tracking-[0.3em] uppercase text-emerald-400/70">
                Scanning Audit Logs
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="z-10 flex w-full animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="flex w-full flex-col rounded-[28px] border border-border/50 bg-background/55 p-5 shadow-2xl shadow-black/20 backdrop-blur-sm sm:p-6">
            <div className="flex items-center justify-between border-b border-border/40 pb-4">
              <div className="text-[10px] font-bold tracking-[0.32em] uppercase text-primary">Investigation Result</div>
              <div className="rounded-full border border-rose-500/20 bg-rose-500/10 px-3 py-1 text-[10px] font-bold text-rose-500">High Risk</div>
            </div>

            <div className="mt-5 space-y-5">
              <div className="space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/60">Summary</div>
                <p className="max-w-lg text-sm font-medium leading-7 animate-in fade-in slide-in-from-left-4 duration-700 delay-300 fill-mode-both">
                  Detected a cluster of <span className="font-bold text-primary">18 failed login attempts</span> originating from a suspicious IP
                  (Singapore) targeting the admin endpoint within 2 minutes.
                </p>
              </div>

              <div className="space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/60">Signals</div>
                <div className="flex flex-wrap gap-2 animate-in fade-in slide-in-from-left-4 duration-700 delay-500 fill-mode-both">
                  <span className="rounded-full border border-border/40 bg-background/60 px-3 py-1 text-[11px] font-medium">Brute-force Pattern</span>
                  <span className="rounded-full border border-border/40 bg-background/60 px-3 py-1 text-[11px] font-medium">Unknown Actor</span>
                  <span className="rounded-full border border-border/40 bg-background/60 px-3 py-1 text-[11px] font-medium">Resource Spike</span>
                </div>
              </div>

              <div className="grid gap-3 rounded-2xl border border-border/40 bg-background/40 p-4 sm:grid-cols-3 animate-in fade-in slide-in-from-left-4 duration-700 delay-700 fill-mode-both">
                <SignalStat label="Attempts" value="18" tone="text-rose-400" />
                <SignalStat label="Window" value="2 min" tone="text-amber-300" />
                <SignalStat label="Target" value="/auth/admin" tone="text-sky-300" />
              </div>

              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 animate-in fade-in slide-in-from-left-4 duration-700 delay-700 fill-mode-both">
                <div className="text-[11px] font-bold uppercase tracking-wider text-primary">AI Recommendation</div>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  Immediate IP blocking enforced. Consider enabling multi-factor authentication for the targeted service account to mitigate
                  further risks.
                </p>
              </div>

              <div className="rounded-2xl border border-border/40 bg-background/40 p-4 animate-in fade-in slide-in-from-left-4 duration-700 delay-[900ms] fill-mode-both">
                <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/60">Event Trail</div>
                <div className="mt-4 space-y-3">
                  <TimelineRow time="14:02:11" text="Failed login burst begins from 203.0.113.84." />
                  <TimelineRow time="14:03:02" text="Admin endpoint hit across 4 service accounts." />
                  <TimelineRow time="14:03:39" text="Rate limiter triggered and session review opened." />
                </div>
              </div>
            </div>

            <div className="mt-auto flex items-center gap-2 pt-5 animate-in fade-in duration-1000 delay-1000 fill-mode-both">
              <div className="size-2 rounded-full bg-emerald-500" />
              <div className="text-[10px] font-bold tracking-[0.28em] uppercase text-muted-foreground">Investigation Saved</div>
            </div>
          </div>
        </div>
      )}

      {/* Background Decorative Gradient */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent transition-opacity duration-1000",
        isProcessing ? "opacity-0" : "opacity-100"
      )} />
    </div>
  );
}

function SignalStat({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div className="rounded-xl border border-border/30 bg-background/35 px-3 py-3">
      <div className="text-[10px] font-bold uppercase tracking-[0.24em] text-muted-foreground/60">{label}</div>
      <div className={cn("mt-2 text-lg font-semibold tracking-tight", tone)}>{value}</div>
    </div>
  );
}

function TimelineRow({ time, text }: { time: string; text: string }) {
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <div className="mt-1 size-2 rounded-full bg-primary" />
        <div className="mt-1 h-full w-px bg-border/50" />
      </div>
      <div className="pb-1">
        <div className="text-[10px] font-bold tracking-[0.24em] uppercase text-muted-foreground/55">{time}</div>
        <p className="mt-1 text-sm leading-6 text-foreground/85">{text}</p>
      </div>
    </div>
  );
}
