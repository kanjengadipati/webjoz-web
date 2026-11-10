"use client";

import React from "react";

interface WizardStepProgressBarProps {
  chatStage: string;
}

const STEP_MAP: Record<string, number> = {
  name: 1,
  description: 2,
  type: 2,
  language: 3,
  mood: 4,
  "brand-logo": 4,
};

const TOTAL_STEPS = 4;

export function WizardStepProgressBar({ chatStage }: WizardStepProgressBarProps) {
  if (chatStage === "done") return null;

  const stepNum = STEP_MAP[chatStage] || 1;
  const progressPct = Math.round((stepNum / TOTAL_STEPS) * 100);

  return (
    <div className="flex items-center gap-3 pb-3">
      <div className="flex-1 h-[3px] rounded-full bg-white/[0.08] overflow-hidden">
        <div
          className="h-full rounded-full bg-white/90 transition-all duration-500 ease-out"
          style={{ width: `${progressPct}%` }}
        />
      </div>
      <span className="text-[10px] font-semibold text-slate-400 tabular-nums shrink-0">
        {String(stepNum).padStart(2, "0")} / {String(TOTAL_STEPS).padStart(2, "0")}
      </span>
    </div>
  );
}

