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
    <div className="bg-primary/5 border-l border-border/30 relative group overflow-hidden min-h-[400px] lg:min-h-full flex items-center justify-center p-8">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[grid-white/5] [mask-image:linear-gradient(to_bottom,transparent,black,transparent)] z-0 pointer-events-none" />

      {/* Processing State */}
      {isProcessing ? (
        <div className="z-20 flex flex-col items-center justify-center space-y-6 animate-in fade-in duration-700">
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
        /* Result State (Text Animation) */
        <div className="z-10 w-full max-w-md space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="flex items-center justify-between border-b border-border/40 pb-4">
            <div className="text-[10px] font-bold tracking-[0.3em] uppercase text-primary">Investigation Result</div>
            <div className="rounded-full bg-rose-500/10 px-3 py-1 text-[10px] font-bold text-rose-500 border border-rose-500/20">High Risk</div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="text-[11px] font-bold uppercase text-muted-foreground/60 tracking-wider">Summary</div>
              <p className="text-sm leading-relaxed font-medium animate-in fade-in slide-in-from-left-4 duration-700 delay-300 fill-mode-both">
                Detected a cluster of <span className="text-primary font-bold">18 failed login attempts</span> originating from a suspicious IP (Singapore) targeting the admin endpoint within 2 minutes.
              </p>
            </div>

            <div className="space-y-2">
              <div className="text-[11px] font-bold uppercase text-muted-foreground/60 tracking-wider">Signals</div>
              <div className="flex flex-wrap gap-2 animate-in fade-in slide-in-from-left-4 duration-700 delay-500 fill-mode-both">
                <span className="rounded-lg bg-background/50 border border-border/40 px-2.5 py-1 text-[11px] font-medium">Brute-force Pattern</span>
                <span className="rounded-lg bg-background/50 border border-border/40 px-2.5 py-1 text-[11px] font-medium">Unknown Actor</span>
                <span className="rounded-lg bg-background/50 border border-border/40 px-2.5 py-1 text-[11px] font-medium">Resource Spike</span>
              </div>
            </div>

            <div className="space-y-2 rounded-2xl bg-primary/5 border border-primary/20 p-4 animate-in fade-in slide-in-from-left-4 duration-700 delay-700 fill-mode-both">
              <div className="text-[11px] font-bold uppercase text-primary tracking-wider">AI Recommendation</div>
              <p className="text-xs leading-relaxed text-muted-foreground italic">
                Immediate IP blocking enforced. Consider enabling multi-factor authentication for the targeted service account to mitigate further risks.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2 animate-in fade-in duration-1000 delay-1000 fill-mode-both">
            <div className="size-2 rounded-full bg-emerald-500" />
            <div className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase">Investigation Saved</div>
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

