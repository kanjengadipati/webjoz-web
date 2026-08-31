"use client";

import React from "react";

export type BillingCycle = "monthly" | "yearly";

interface BillingCycleSwitcherProps {
  billingCycle: BillingCycle;
  onCycleChange: (cycle: BillingCycle) => void;
  monthlyLabel?: string;
  yearlyLabel?: string;
  saveBadgeLabel?: string;
  showSaveText?: boolean;
  saveText?: string;
}

export function BillingCycleSwitcher({
  billingCycle,
  onCycleChange,
  monthlyLabel = "Bulanan",
  yearlyLabel = "Tahunan",
  saveBadgeLabel = "Hemat ~16%",
  showSaveText = false,
  saveText,
}: BillingCycleSwitcherProps) {
  return (
    <div className="pt-2 flex flex-col items-center justify-center gap-2">
      <div className="inline-flex items-center p-1 bg-muted/80 dark:bg-muted/40 border border-border/50 rounded-2xl">
        <button
          type="button"
          onClick={() => onCycleChange("monthly")}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
            billingCycle === "monthly"
              ? "bg-card text-foreground shadow-sm font-bold dark:bg-white dark:text-slate-900"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {monthlyLabel}
        </button>
        <button
          type="button"
          onClick={() => onCycleChange("yearly")}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
            billingCycle === "yearly"
              ? "bg-card text-foreground shadow-sm font-bold dark:bg-white dark:text-slate-900"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <span>{yearlyLabel}</span>
          <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-full bg-emerald-400 text-slate-950 uppercase tracking-wider">
            {saveBadgeLabel}
          </span>
        </button>
      </div>
      {showSaveText && billingCycle === "yearly" && saveText && (
        <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
          {saveText}
        </p>
      )}
    </div>
  );
}
