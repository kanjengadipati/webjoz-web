"use client";

import React, { useEffect, useState } from "react";
import { Zap, X } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

interface MicOnboardingHintProps {
  onDismiss?: () => void;
  visible: boolean;
}

const STORAGE_KEY = "webjoz_wizard_mic_hint_seen";

export function MicOnboardingHint({ onDismiss, visible }: MicOnboardingHintProps) {
  const { t } = useI18n();
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    if (!visible) {
      setShouldShow(false);
      return;
    }
    const hasSeen = localStorage.getItem(STORAGE_KEY);
    if (!hasSeen) {
      setShouldShow(true);
    }
  }, [visible]);

  const handleDismiss = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setShouldShow(false);
    onDismiss?.();
  };

  if (!shouldShow) return null;

  return (
    <div className="absolute bottom-16 right-4 sm:right-6 z-30 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="relative bg-[#1b2b25] border border-emerald-500/40 text-emerald-100 rounded-2xl p-3.5 shadow-[0_10px_30px_rgba(0,0,0,0.5)] max-w-[240px]">
        {/* Close button */}
        <button
          type="button"
          onClick={handleDismiss}
          className="absolute top-2 right-2 text-emerald-400/60 hover:text-emerald-200 transition-colors p-0.5 rounded"
          aria-label="Tutup hint"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        <div className="flex items-start gap-2.5">
          <div className="w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0 mt-0.5">
            <Zap className="w-3.5 h-3.5 text-emerald-300 fill-emerald-300" />
          </div>
          <div className="space-y-1 pr-3">
            <p className="text-xs font-bold text-emerald-300 leading-tight">
              {t("dashboard.wizard.micHintTitle", "Bicara lebih cepat dengan AI")}
            </p>
            <p className="text-[11px] text-emerald-200/80 leading-snug">
              {t("dashboard.wizard.micHintDesc", "Tekan tombol mic untuk menjelaskan bisnis Anda.")}
            </p>
          </div>
        </div>

        {/* Pointer Arrow pointing to the Mic Button */}
        <div className="absolute -bottom-2 right-8 w-4 h-4 bg-[#1b2b25] border-r border-b border-emerald-500/40 transform rotate-45" />
      </div>
    </div>
  );
}

export function markMicHintAsSeen() {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, "true");
  }
}
