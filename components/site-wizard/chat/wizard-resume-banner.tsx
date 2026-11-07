"use client";

import React from "react";
import { Clock, ArrowRight, X } from "lucide-react";
import type { WizardResumeSnapshot } from "../wizard-persistence";

interface WizardResumeBannerProps {
  resumeDraft: WizardResumeSnapshot | null;
  resumeSavedText: string;
  handleResume: () => void;
  handleStartFresh: () => void;
  t: (key: string, fallback?: string) => string;
}

export function WizardResumeBanner({
  resumeDraft,
  resumeSavedText,
  handleResume,
  handleStartFresh,
  t,
}: WizardResumeBannerProps) {
  if (!resumeDraft) return null;

  return (
    <div className="mx-3.5 sm:mx-4 mt-2.5 sm:mt-3 shrink-0 rounded-2xl border border-white/[0.09] bg-[#16191F]/95 p-3 sm:p-3.5 shadow-xl backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="w-8 h-8 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center shrink-0 text-primary">
            <Clock className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 leading-tight">
              <span className="text-[10px] font-semibold text-primary uppercase tracking-wider">
                {t("dashboard.wizard.resumeLastSession", "Draft Tersimpan")}
              </span>
              <span className="text-[10px] text-slate-500">· {resumeSavedText}</span>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5 min-w-0">
              <p className="text-xs sm:text-[13px] font-bold text-white truncate leading-snug">
                {resumeDraft.businessName || t("dashboard.wizard.untitledDraft", "Draft Tanpa Nama")}
              </p>
              {(resumeDraft.chat.businessSubType || resumeDraft.chat.industryCustom || resumeDraft.chat.businessType) && (
                <span className="text-[11px] font-medium text-slate-400 truncate">
                  · {resumeDraft.chat.businessSubType || resumeDraft.chat.industryCustom || resumeDraft.chat.businessType}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={handleResume}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white text-slate-900 hover:bg-slate-100 active:scale-95 transition-all shadow-xs cursor-pointer"
          >
            <span>{t("dashboard.wizard.resumeContinue", "Lanjutkan")}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handleStartFresh}
            title={t("dashboard.wizard.resumeStartFresh", "Mulai baru")}
            className="w-7 h-7 flex items-center justify-center rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

