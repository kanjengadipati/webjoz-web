"use client";

import React from "react";
import { SparkleGenAI } from "@/components/sparkle-icon";
import { useI18n } from "@/lib/i18n/context";

interface AudioProcessingCardProps {
  businessName?: string;
}

export function AudioProcessingCard({ businessName }: AudioProcessingCardProps) {
  const { t } = useI18n();

  return (
    <div className="rounded-2xl border border-white/10 bg-[#1a1d24]/90 p-5 shadow-2xl animate-in fade-in zoom-in-95 duration-400 max-w-sm mx-auto my-3 text-center backdrop-blur-md">
      <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center mx-auto mb-3 shadow-[0_0_20px_rgba(0,0,0,0.35)] animate-pulse">
        <SparkleGenAI className="w-6 h-6 text-slate-200" />
      </div>

      <h4 className="text-sm font-bold text-white mb-1">
        {t("dashboard.wizard.sttProcessingTitle", "Memproses suara Anda...")}
      </h4>

      <p className="text-xs text-slate-400 mb-4">
        {t("dashboard.wizard.sttProcessingSubtitle", "Membuat draft informasi bisnis...")}
      </p>

      {/* 3 Step Dot Progress Bar */}
      <div className="flex items-center justify-center gap-2 max-w-[140px] mx-auto">
        <div className="w-2.5 h-2.5 rounded-full bg-slate-300 animate-ping" style={{ animationDuration: "1s" }} />
        <div className="h-0.5 flex-1 bg-slate-500/50 rounded-full" />
        <div className="w-2.5 h-2.5 rounded-full bg-slate-300/80 animate-pulse" style={{ animationDuration: "1.2s", animationDelay: "200ms" }} />
        <div className="h-0.5 flex-1 bg-slate-500/50 rounded-full" />
        <div className="w-2.5 h-2.5 rounded-full bg-slate-500/50" />
      </div>
    </div>
  );
}
