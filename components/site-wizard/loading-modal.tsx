"use client";

import React, { useState, useEffect } from "react";
import { Loader2, Clock, Sparkles } from "lucide-react";
import { SparkleIcon } from "@/components/sparkle-icon";
import { LOADING_CHECKLIST, LOADING_STEPS_PERCENT } from "./constants";
import { getInsight } from "./helpers";
import { useI18n } from "@/lib/i18n/context";

interface LoadingModalProps {
  loadingStep: number;
  progressPercent?: number;
  businessType: string;
  businessName?: string;
  charCount?: number;
  sectionSnippet?: string;
  center?: boolean;
  stepElapsed?: number[];
  streamDone?: boolean;
}

const ESTIMATED_TOTAL_SECS = 22;

export function LoadingModal({ loadingStep, progressPercent, businessType, businessName, charCount, sectionSnippet, center, stepElapsed, streamDone }: LoadingModalProps) {
  const { t, locale } = useI18n();
  const [elapsedSecs, setElapsedSecs] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      setElapsedSecs(Math.round((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const displayPercent = progressPercent !== undefined ? Math.round(progressPercent) : (LOADING_STEPS_PERCENT[loadingStep] ?? 15);
  const remainingSecs = Math.max(0, ESTIMATED_TOTAL_SECS - elapsedSecs);

  return (
    <div className={`absolute inset-0 z-30 flex ${center ? "items-end pb-6 px-4 justify-center" : "items-center justify-center px-4"}`}>
      <div 
        className={`backdrop-blur-xl rounded-3xl w-full shadow-2xl flex flex-col animate-in ${center ? "max-w-full p-4 gap-2.5 slide-in-from-bottom-4 max-h-[55vh] overflow-y-auto" : "max-w-sm p-7 gap-5 slide-in-from-bottom-4 zoom-in-95"} duration-500`} 
        style={{ background: "rgba(17,19,24,0.96)", border: "1px solid rgba(255,255,255,0.12)" }}
      >
        {/* Header row: icon + title + percentage */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className={`rounded-xl bg-primary flex items-center justify-center shrink-0 ${center ? "w-7 h-7" : "w-8 h-8"} text-primary-foreground shadow-sm`}>
              <SparkleIcon className={`${center ? "w-5 h-5" : "w-6 h-6"}`} />
            </div>
            <div className="min-w-0">
              <h3 className={`font-extrabold text-white m-0 leading-tight ${center ? "text-xs sm:text-sm" : "text-sm"}`}>
                {center
                  ? t("dashboard.wizard.loadingBuildingTitle", "Membangun website...")
                  : businessName
                  ? t("dashboard.wizard.loadingBuildingTitleWithName", undefined, { name: businessName })
                  : t("dashboard.wizard.loadingBuildingTitleGeneral", "AI sedang membangun website Anda ✨")}
              </h3>
              {!center && (
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {t("dashboard.wizard.loadingEstDeepNote", "AI merancang seluruh halaman (~20-25 dtk)")}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-black text-primary">{displayPercent}%</span>
          </div>
        </div>

        {/* Progress bar + Dynamic Countdown & Timer Info */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className={`rounded-full overflow-hidden flex-1 ${center ? "h-2" : "h-2.5"}`} style={{ background: "rgba(255,255,255,0.06)" }}>
              <div
                className="h-full bg-primary transition-all duration-1000 ease-out rounded-full shadow-sm"
                style={{ width: `${displayPercent}%` }}
              />
            </div>
          </div>

          {/* Dynamic Countdown & Elapsed Time Row */}
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
            <div className="flex items-center gap-1.5 min-w-0">
              {remainingSecs > 0 && !streamDone ? (
                <span className="inline-flex items-center gap-1 text-amber-300 font-semibold truncate">
                  <Clock className="w-3 h-3 shrink-0" />
                  <span>{t("dashboard.wizard.loadingEstCountdown", undefined, { secs: String(remainingSecs) })}</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold truncate">
                  <Sparkles className="w-3 h-3 shrink-0" />
                  <span>{t("dashboard.wizard.loadingEstFinalizing", "Sedang merapikan copywriting...")}</span>
                </span>
              )}
            </div>

            <div className="font-mono text-slate-400 shrink-0 ml-2">
              {formatTime(elapsedSecs)} / ~{formatTime(ESTIMATED_TOTAL_SECS)}
            </div>
          </div>

          {!center && charCount !== undefined && charCount > 0 && (
            <p className="text-[10px] text-slate-500 text-right pt-0.5">
              {t("dashboard.wizard.loadingCharsWritten", undefined, { count: charCount.toLocaleString(locale === "id" ? "id-ID" : "en-US") })}
            </p>
          )}
        </div>

        {/* Checklist — only current + next 2 on mobile */}
        <div className={center ? "flex flex-wrap gap-x-3 gap-y-1 pt-1" : "space-y-1"}>
          {LOADING_CHECKLIST.map(({ label }, idx) => {
            const done = streamDone ? true : loadingStep > idx;
            const active = streamDone ? false : loadingStep === idx;
            const translatedLabel = t(`dashboard.wizard.loadingChecklist${idx}`, label);
            // On mobile, hide completed older than current+1 and pending beyond next 2
            if (center && !active && !done && idx > loadingStep + 1) return null;
            if (center && done && idx < loadingStep - 2) return null;
            return (
              <div key={idx} className={`flex items-center gap-1.5 transition-all duration-300 ${active || done ? "opacity-100" : center ? "opacity-50" : "opacity-40"}`}>
                <div className={`rounded-full border flex items-center justify-center shrink-0 transition-all duration-300 ${done ? "border-primary bg-primary" : active ? "border-primary" : "border-slate-600"} ${center ? "w-3.5 h-3.5" : "w-5 h-5"}`} style={!done ? { background: "rgba(255,255,255,0.04)" } : {}}>
                  {done ? <span className={`text-primary-foreground font-bold ${center ? "text-[7px]" : "text-[10px]"}`}>✓</span>
                  : active ? <Loader2 className={`text-primary animate-spin ${center ? "w-2 h-2" : "w-2.5 h-2.5"}`} />
                  : null}
                </div>
                <span className={`font-semibold leading-tight truncate ${done ? "text-slate-300" : active ? "text-primary font-bold" : "text-slate-500"} ${center ? "text-[10px]" : "text-xs"}`}>
                  {translatedLabel}
                </span>
                {!center && (
                  <span className={`font-mono shrink-0 ml-auto ${active ? "text-primary font-bold" : "text-slate-400"} text-[10px]`}>
                    {active || done ? formatTime(stepElapsed?.[idx] ?? 0) : "00:00"}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Live section snippet */}
        {!center && sectionSnippet && loadingStep >= 1 && (
          <div className="rounded-2xl p-3 animate-in fade-in slide-in-from-bottom-2 duration-500 bg-white/5 border border-border">
            <p className="text-[11px] text-slate-400 leading-relaxed italic">
              &ldquo;{sectionSnippet}&rdquo;
            </p>
          </div>
        )}

        {/* AI Insight — only on desktop */}
        {!center && loadingStep >= 3 && (
          <div className="rounded-2xl p-3.5 animate-in fade-in duration-500 bg-primary/10 border border-primary/20">
            <div className="flex items-center gap-1.5 mb-1.5 text-primary">
              <SparkleIcon className="w-[18px] h-[18px]" />
              <span className="text-[11px] font-bold text-primary">{t("dashboard.wizard.loadingAiInsight", "AI Insight")}</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">{getInsight(businessType, locale)}</p>
          </div>
        )}
      </div>
    </div>
  );
}
