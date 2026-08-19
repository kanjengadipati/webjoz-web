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
}

export function MobileActionBar({
  preview,
  device,
  onOpenSheet,
  onGoToEditor,
}: MobileActionBarProps) {
  const { t } = useI18n();

  if (!device.isMobile || device.mobileScreen !== "preview" || preview.previewState !== "result") {
    return null;
  }

  return (
    <div className="absolute bottom-0 left-0 right-0 z-50 flex gap-2 px-4 pb-6 pt-3" style={{ background: "linear-gradient(transparent, #0d0f14 30%)" }}>
      <button
        type="button"
        onClick={onOpenSheet}
        className="flex h-11 flex-1 items-center justify-center gap-1.5 rounded-full bg-white/10 border border-border px-5 text-xs font-extrabold text-slate-200 transition-all active:scale-95 backdrop-blur-sm"
      >
        <Plus className="h-3.5 w-3.5 text-slate-400" />
        {t("dashboard.wizard.btnCompleteData", "Lengkapi Data")}
      </button>
      <button
        type="button"
        onClick={onGoToEditor}
        className="btn-primary flex h-11 flex-1 items-center justify-center gap-1.5 rounded-full px-5 text-xs font-extrabold shadow-[0_14px_30px_rgba(0,0,0,0.32)] transition-all active:scale-95"
      >
        <Pencil className="h-3.5 w-3.5" />
        {t("dashboard.wizard.btnEditPublish", "Edit & Publikasikan")}
      </button>
    </div>
  );
}
