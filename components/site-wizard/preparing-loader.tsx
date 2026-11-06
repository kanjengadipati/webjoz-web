"use client";

import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

export function PreparingWebsiteLoader({ t }: { t: (key: string, fallback: string) => string }) {
  const [progress, setProgress] = useState(18);
  const [stageIndex, setStageIndex] = useState(0);
  const [fading, setFading] = useState(false);
  const [hidden, setHidden] = useState(false);

  const stages = [
    { key: "dashboard.wizard.preparingTheme", fallback: "Meracik tema & karakter visual..." },
    { key: "dashboard.wizard.preparingComponents", fallback: "Menyusun layout & komponen website..." },
    { key: "dashboard.wizard.preparingOpening", fallback: "Membuka tampilan website..." },
  ];

  useEffect(() => {
    const t1 = setTimeout(() => {
      setProgress(58);
      setStageIndex(1);
    }, 600);

    const t2 = setTimeout(() => {
      setProgress(90);
      setStageIndex(2);
    }, 1200);

    const t3 = setTimeout(() => {
      setProgress(100);
    }, 1600);

    // Fade out 300ms after hitting 100%
    const t4 = setTimeout(() => {
      setFading(true);
    }, 1900);

    // Fully unmount after fade animation
    const t5 = setTimeout(() => {
      setHidden(true);
    }, 2250);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, []);

  if (hidden) return null;

  return (
    <div
      className="mt-3 p-3 rounded-xl bg-black/40 border border-primary/20 shadow-inner space-y-2.5 animate-in fade-in zoom-in-95 duration-300"
      style={{ opacity: fading ? 0 : 1, transition: fading ? "opacity 350ms ease-out" : undefined }}
    >
      <div className="flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 text-primary font-medium truncate">
          <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0 text-primary" />
          <span className="truncate text-slate-200 text-[11px] sm:text-xs">
            {t(stages[stageIndex].key, stages[stageIndex].fallback)}
          </span>
        </div>
        <span className="text-[10px] font-mono text-primary/80 font-bold shrink-0">{progress}%</span>
      </div>
      <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

