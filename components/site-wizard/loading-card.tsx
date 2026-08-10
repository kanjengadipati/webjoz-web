"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { SparkleIcon } from "@/components/sparkle-icon";
import { LOADING_STEPS_PERCENT } from "./constants";
import { getInsight } from "./helpers";
import { useI18n } from "@/lib/i18n/context";

interface LoadingCardProps {
  loadingStep: number;
  businessType: string;
}

export function LoadingCard({ loadingStep, businessType }: LoadingCardProps) {
  const { t } = useI18n();

  const loadingCardItems = [
    { label: t("dashboard.wizard.loadingCardChecklist0", "Analisis bisnis & target pasar"), icon: "🔍" },
    { label: t("dashboard.wizard.loadingCardChecklist1", "Menyusun struktur halaman"), icon: "📐" },
    { label: t("dashboard.wizard.loadingCardChecklist2", "Menulis headline & copywriting"), icon: "✍️" },
    { label: t("dashboard.wizard.loadingCardChecklist3", "Optimasi SEO on-page"), icon: "🔎" },
    { label: t("dashboard.wizard.loadingCardChecklist4", "Memilih palet warna & tipografi"), icon: "🎨" },
    { label: t("dashboard.wizard.loadingCardChecklist5", "Website siap dipublish!"), icon: "🚀" },
  ];

  return (
    <div className="flex gap-2.5 justify-start animate-in fade-in slide-in-from-bottom-2 duration-400">
      <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center shrink-0 mt-0.5 text-primary-foreground">
        <SparkleIcon className="w-[18px] h-[18px]" />
      </div>
      <div
        className="flex-1 min-w-0 rounded-2xl rounded-tl-sm px-3.5 py-3 space-y-3"
        style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.07)" }}
      >
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
            <div
              className="h-full rounded-full bg-primary transition-all duration-1000 ease-out"
              style={{ width: `${LOADING_STEPS_PERCENT[loadingStep] ?? 15}%` }}
            />
          </div>
          <span className="text-[10px] font-bold text-primary shrink-0">
            {LOADING_STEPS_PERCENT[loadingStep] ?? 15}%
          </span>
        </div>

        <div className="space-y-2">
          {loadingCardItems.map(({ label, icon }, idx) => {
            const done = loadingStep > idx;
            const active = loadingStep === idx;
            return (
              <div
                key={idx}
                className="flex items-center gap-2.5 transition-all duration-300"
                style={{ opacity: done ? 1 : active ? 1 : 0.3 }}
              >
                <div
                  className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-all duration-300"
                  style={
                    done
                      ? { background: "rgba(52,211,153,0.2)", border: "1px solid rgba(52,211,153,0.4)" }
                      : active
                        ? { background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.2)" }
                        : { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }
                  }
                >
                  {done ? (
                    <span className="text-[8px] text-emerald-400 font-bold">✓</span>
                  ) : active ? (
                    <Loader2 className="w-2.5 h-2.5 text-primary animate-spin" />
                  ) : null}
                </div>
                <span
                  className="text-[11px] font-medium leading-tight"
                  style={{ color: done ? "#86efac" : active ? "var(--primary)" : "rgba(148,163,184,1)" }}
                >
                  {label}
                </span>
                {active && (
                  <span className="ml-auto text-[9px] font-mono text-primary shrink-0">
                    {String(idx + 2).padStart(2, "0")}s
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {loadingStep >= 3 && (
          <div className="rounded-2xl p-3.5 animate-in fade-in duration-500 bg-primary/10 border border-primary/20">
            <div className="flex items-center gap-1.5 mb-1.5 text-primary">
              <SparkleIcon className="w-[18px] h-[18px]" />
              <span className="text-[11px] font-bold text-primary">{t("dashboard.wizard.loadingAiInsight", "AI Insight")}</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">{getInsight(businessType)}</p>
          </div>
        )}
      </div>
    </div>
  );
}
