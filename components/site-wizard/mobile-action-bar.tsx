"use client";

import React from "react";
import { Plus, Pencil, Palette } from "lucide-react";
import { useWizardPreview } from "./use-wizard-preview";
import { useWizardDevice } from "./use-wizard-device";
import { useI18n } from "@/lib/i18n/context";

interface MobileActionBarProps {
  preview: ReturnType<typeof useWizardPreview>;
  device: ReturnType<typeof useWizardDevice>;
  onOpenSheet: () => void;
  onGoToEditor: () => void;
  onOpenTheme?: () => void;
  showLengkapiHint?: boolean;
  showEditPublishHint?: boolean;
}

export function MobileActionBar({
  preview,
  device,
  onOpenSheet,
  onGoToEditor,
  onOpenTheme,
  showLengkapiHint = false,
  showEditPublishHint = false,
}: MobileActionBarProps) {
  const { t } = useI18n();

  if (!device.isMobile || device.mobileScreen !== "preview" || preview.previewState !== "result") {
    return null;
  }

  return (
    <div
      className="absolute bottom-0 left-0 right-0 z-50 px-4 pb-7 pt-2"
      style={{ background: "linear-gradient(transparent, #0d0f14 28%)" }}
    >
      {/* Tooltips — rendered above the bar */}
      {(showLengkapiHint || showEditPublishHint) && (
        <div className="relative flex items-end justify-around mb-2 px-2 pointer-events-none">
          <div className="flex-1" />
          <div className="flex-[2] flex justify-center">
            {showEditPublishHint && (
              <div className="animate-in fade-in slide-in-from-bottom-1 duration-300">
                <div className="relative bg-[#1a2236] border border-white/20 rounded-xl px-3 py-2 shadow-lg whitespace-nowrap text-center">
                  <p className="text-[11px] font-semibold text-white leading-snug">
                    {t("dashboard.wizard.mobileEditPublishHintTitle", "✏️ Bebas atur & sesuaikan!")}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">
                    {t("dashboard.wizard.mobileEditPublishHintDesc", "Full edit, ubah, atau hapus section")}
                  </p>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0"
                    style={{ borderLeft: "6px solid transparent", borderRight: "6px solid transparent", borderTop: "6px solid rgba(255,255,255,0.2)" }}
                  />
                </div>
              </div>
            )}
          </div>
          <div className="flex-1 flex justify-end">
            {showLengkapiHint && (
              <div className="animate-in fade-in slide-in-from-bottom-1 duration-300">
                <div className="relative bg-[#1a2236] border border-white/20 rounded-xl px-3 py-2 shadow-lg whitespace-nowrap text-center">
                  <p className="text-[11px] font-semibold text-white leading-snug">
                    {t("dashboard.wizard.mobileHintTitle", "📋 Tambah nomor WA & area")}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">
                    {t("dashboard.wizard.mobileHintDesc", "Supaya tombol kontak aktif")}
                  </p>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0"
                    style={{ borderLeft: "6px solid transparent", borderRight: "6px solid transparent", borderTop: "6px solid rgba(255,255,255,0.2)" }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bar */}
      <div
        className="grid rounded-2xl overflow-hidden"
        style={{
          background: "#1c1c1e",
          height: "3.75rem",
          gridTemplateColumns: onOpenTheme ? "72px 1px 1fr 1px 72px" : "1fr",
        }}
      >
        {/* Tema */}
        {onOpenTheme && (
          <>
            <button
              type="button"
              onClick={onOpenTheme}
              className="flex h-full flex-col items-center justify-center gap-0.5 text-slate-300 active:bg-white/10 transition-colors cursor-pointer"
            >
              <Palette className="h-5 w-5" />
              <span className="text-[10px] font-medium">
                {t("dashboard.wizard.theme.openPanel", "Tema")}
              </span>
            </button>
            {/* Divider */}
            <div className="self-stretch my-3" style={{ background: "rgba(255,255,255,0.12)" }} />
          </>
        )}

        {/* Edit & Publish — center, dominant */}
        <button
          type="button"
          onClick={onGoToEditor}
          className="flex items-center justify-center gap-2 mx-2.5 my-2 rounded-full text-sm font-bold text-black active:scale-95 transition-all cursor-pointer"
          style={{ background: "#ffffff" }}
        >
          <Pencil className="h-4 w-4 shrink-0" />
          <span className="whitespace-nowrap">
            {t("dashboard.wizard.btnEditPublish", "Edit & Publish")}
          </span>
        </button>

        {/* Divider */}
        <div className="self-stretch my-3" style={{ background: "rgba(255,255,255,0.12)" }} />

        {/* Lengkapi Data */}
        <button
          type="button"
          onClick={onOpenSheet}
          className="flex h-full flex-col items-center justify-center gap-0.5 text-slate-300 active:bg-white/10 transition-colors cursor-pointer"
        >
          <Plus className="h-5 w-5" />
          <span className="text-[10px] font-medium">
            {t("dashboard.wizard.btnCompleteData", "Lengkapi")}
          </span>
        </button>
      </div>
    </div>
  );
}
