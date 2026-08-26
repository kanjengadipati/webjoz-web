"use client";

import React from "react";
import { Plus, Pencil } from "lucide-react";
import { useWizardPreview } from "./use-wizard-preview";
import { useWizardDevice } from "./use-wizard-device";
import { useI18n } from "@/lib/i18n/context";

interface MobileActionBarProps {
  preview: ReturnType<typeof useWizardPreview>;
  device: ReturnType<typeof useWizardDevice>;
  onOpenSheet: () => void;
  onGoToEditor: () => void;
  showLengkapiHint?: boolean;
}

export function MobileActionBar({
  preview,
  device,
  onOpenSheet,
  onGoToEditor,
  showLengkapiHint = false,
}: MobileActionBarProps) {
  const { t } = useI18n();

  if (!device.isMobile || device.mobileScreen !== "preview" || preview.previewState !== "result") {
    return null;
  }

  return (
    <div className="absolute bottom-0 left-0 right-0 z-50 flex gap-2 px-4 pb-6 pt-3" style={{ background: "linear-gradient(transparent, #0d0f14 30%)" }}>

      {/* Lengkapi Data */}
      <div className="relative flex-1">
        {showLengkapiHint && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 z-50 pointer-events-none animate-in fade-in slide-in-from-bottom-1 duration-300">
            <div className="relative bg-[#1a2236] border border-white/20 rounded-xl px-3 py-2 shadow-lg whitespace-nowrap text-center">
              <p className="text-[11px] font-semibold text-white leading-snug">📋 Tambah nomor WA & area</p>
              <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">Supaya tombol kontak aktif</p>
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0"
                style={{ borderLeft: "6px solid transparent", borderRight: "6px solid transparent", borderTop: "6px solid rgba(255,255,255,0.2)" }}
              />
            </div>
          </div>
        )}
        <button
          type="button"
          onClick={onOpenSheet}
          className="flex h-11 w-full items-center justify-center gap-1.5 rounded-full bg-white/10 border border-border px-5 text-xs font-extrabold text-slate-200 transition-all active:scale-95 backdrop-blur-sm"
        >
          <Plus className="h-3.5 w-3.5 text-slate-400" />
          {t("dashboard.wizard.btnCompleteData", "Lengkapi Data")}
        </button>
      </div>

      {/* Edit & Publikasikan */}
      <div className="relative flex-1">
        <button
          type="button"
          onClick={onGoToEditor}
          className="btn-primary flex h-11 w-full items-center justify-center gap-1.5 rounded-full px-5 text-xs font-extrabold shadow-[0_14px_30px_rgba(0,0,0,0.32)] transition-all active:scale-95"
        >
          <Pencil className="h-3.5 w-3.5" />
          {t("dashboard.wizard.btnEditPublish", "Edit & Publikasikan")}
        </button>
      </div>

    </div>
  );
}
