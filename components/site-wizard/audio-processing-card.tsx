"use client";

import React from "react";
import { SparkleGenAI } from "@/components/sparkle-icon";
import { useI18n } from "@/lib/i18n/context";

interface AudioProcessingCardProps {
  businessName?: string;
  variant?: "audio" | "text";
}

export function AudioProcessingCard({ businessName, variant = "audio" }: AudioProcessingCardProps) {
  const { t } = useI18n();

  const title = variant === "text"
    ? t("dashboard.wizard.descProcessingTitle", "Menganalisis deskripsi Anda...")
    : t("dashboard.wizard.sttProcessingTitle", "Memproses suara Anda...");

  const subtitle = variant === "text"
    ? t("dashboard.wizard.descProcessingSubtitle", "Memoles teks dan mendeteksi jenis bisnis...")
    : t("dashboard.wizard.sttProcessingSubtitle", "Membuat draft informasi bisnis...");

  return (
    <div className="rounded-2xl border border-emerald-500/30 bg-[#121b17]/90 p-5 shadow-2xl animate-in fade-in zoom-in-95 duration-400 max-w-sm mx-auto my-3 text-center backdrop-blur-md">
      <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto mb-3 shadow-[0_0_20px_rgba(16,185,129,0.25)] animate-pulse">
        <SparkleGenAI className="w-6 h-6 text-emerald-300" />
      </div>

      <h4 className="text-sm font-bold text-white mb-1">
        {title}
      </h4>

      <p className="text-xs text-slate-400 mb-4">
        {subtitle}
      </p>

      {/* 3 Step Dot Progress Bar */}
      <div className="flex items-center justify-center gap-2 max-w-[140px] mx-auto">
        <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" style={{ animationDuration: "1s" }} />
        <div className="h-0.5 flex-1 bg-emerald-500/40 rounded-full" />
        <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/80 animate-pulse" style={{ animationDuration: "1.2s", animationDelay: "200ms" }} />
        <div className="h-0.5 flex-1 bg-emerald-500/40 rounded-full" />
        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/40" />
      </div>
    </div>
  );
}
