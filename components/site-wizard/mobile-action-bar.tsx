"use client";

import React, { useEffect, useState } from "react";
import { Plus, Palette, Pencil } from "lucide-react";
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

  // Show "Tema" tooltip only on first visit — dismiss after 5s or on tap
  const [showTemaHint, setShowTemaHint] = useState(false);
  useEffect(() => {
    if (!device.isMobile || device.mobileScreen !== "preview" || preview.previewState !== "result") return;
    try {
      if (!localStorage.getItem("wiz_tema_hint_seen")) {
        const timer = setTimeout(() => {
          setShowTemaHint(true);
          const dismiss = setTimeout(() => {
            setShowTemaHint(false);
            try { localStorage.setItem("wiz_tema_hint_seen", "1"); } catch { /* noop */ }
          }, 5000);
          return () => clearTimeout(dismiss);
        }, 1000);
        return () => clearTimeout(timer);
      }
    } catch { /* localStorage unavailable */ }
  }, [device.isMobile, device.mobileScreen, preview.previewState]);

  if (!device.isMobile || device.mobileScreen !== "preview" || preview.previewState !== "result") {
    return null;
  }

  const temaLabel = t("dashboard.wizard.theme.openPanel", "Tema");
  const editLabel = t("dashboard.wizard.btnEditPublish", "Edit & Publish");
  const lengkapiLabel = t("dashboard.wizard.btnCompleteData", "Lengkapi");

  return (
    <div className="absolute bottom-0 left-0 right-0 z-50">
      {/* Tooltips */}
      {(showLengkapiHint || showEditPublishHint) && (
        <div className="flex items-end justify-around mb-2 pointer-events-none px-2">
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
                    style={{ borderLeft: "6px solid transparent", borderRight: "6px solid transparent", borderTop: "6px solid rgba(255,255,255,0.2)" }} />
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
                    style={{ borderLeft: "6px solid transparent", borderRight: "6px solid transparent", borderTop: "6px solid rgba(255,255,255,0.2)" }} />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bar — dark pill, same as BottomNavBar */}
      <div className="px-3" style={{ paddingBottom: "max(env(safe-area-inset-bottom), 12px)", paddingTop: "8px", background: "#0d0f14" }}>
        <div
          className="flex items-center rounded-2xl overflow-visible relative"
          style={{ background: "#1c1c1e", height: "3.75rem" }}
        >
          {/* Tema */}
          {onOpenTheme && (
            <div className="relative flex flex-col items-center justify-center h-full flex-1">
              {/* Educational tooltip — first visit only */}
              {showTemaHint && (
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 pointer-events-none animate-in fade-in slide-in-from-bottom-1 duration-300 z-10">
                  <div className="relative bg-[#1a2236] border border-white/20 rounded-xl px-3 py-2 shadow-lg whitespace-nowrap text-center">
                    <p className="text-[11px] font-semibold text-white leading-snug">
                      {t("dashboard.wizard.temaHintTitle", "🎨 Ganti warna & font")}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">
                      {t("dashboard.wizard.temaHintDesc", "Sesuaikan tampilan website kamu")}
                    </p>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0"
                      style={{ borderLeft: "6px solid transparent", borderRight: "6px solid transparent", borderTop: "6px solid rgba(255,255,255,0.2)" }} />
                  </div>
                </div>
              )}
              <button
                type="button"
                onClick={() => {
                  setShowTemaHint(false);
                  try { localStorage.setItem("wiz_tema_hint_seen", "1"); } catch { /* noop */ }
                  onOpenTheme();
                }}
                className="flex flex-col items-center justify-center gap-0.5 h-full w-full !text-white/60 hover:!text-white transition-colors cursor-pointer active:scale-95"
              >
                <Palette className="size-5 stroke-[1.75]" />
                <span className="text-[10px] font-medium leading-none">{temaLabel}</span>
              </button>
            </div>
          )}

          {/* Edit & Publish — elevated center FAB */}
          <div className="flex flex-col items-center justify-center flex-[2] relative -mt-7">
            <button
              type="button"
              onClick={onGoToEditor}
              className="flex flex-col items-center group cursor-pointer active:scale-95 transition-transform"
            >
              <div className="h-12 px-5 rounded-full bg-white text-black flex items-center justify-center gap-2 shadow-lg ring-4 ring-[#1c1c1e] group-hover:scale-105 transition-all whitespace-nowrap">
                <Pencil className="size-4 stroke-[2] shrink-0" />
                <span className="text-[13px] font-bold">{editLabel}</span>
              </div>
              <span className="text-[10px] font-bold text-white mt-0.5 leading-none opacity-0 select-none">·</span>
            </button>
          </div>

          {/* Lengkapi Data */}
          <button
            type="button"
            onClick={onOpenSheet}
            className="flex flex-col items-center justify-center gap-0.5 h-full flex-1 text-white/60 hover:text-white transition-colors cursor-pointer active:scale-95"
          >
            <Plus className="size-5 stroke-[1.75]" />
            <span className="text-[10px] font-medium leading-none">{lengkapiLabel}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
