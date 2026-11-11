"use client";

import React, { useEffect, useState } from "react";
import { Plus, Palette, Pencil } from "lucide-react";
import { useWizardPreview } from "./use-wizard-preview";
import { useWizardDevice } from "./use-wizard-device";
import { useI18n } from "@/lib/i18n/context";
import { BottomNavBar } from "webjoz-ui";

interface MobileActionBarProps {
  preview: ReturnType<typeof useWizardPreview>;
  device: ReturnType<typeof useWizardDevice>;
  onOpenSheet: () => void;
  onGoToEditor: () => void;
  onOpenTheme?: () => void;
  showLengkapiHint?: boolean;
  showEditPublishHint?: boolean;
}

/** Tooltip bubble — reused for both edu tooltip and hints */
function TooltipBubble({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-1 duration-300">
      <div className="relative bg-[#1a2236] border border-white/20 rounded-xl px-3 py-2 shadow-lg whitespace-nowrap text-center">
        <p className="text-[11px] font-semibold text-white leading-snug">{title}</p>
        <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">{desc}</p>
        <div
          className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0"
          style={{ borderLeft: "6px solid transparent", borderRight: "6px solid transparent", borderTop: "6px solid rgba(255,255,255,0.2)" }}
        />
      </div>
    </div>
  );
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

  // Show "Tema" edu tooltip only on first visit
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

  // Hint tooltips above center and right items
  const editPublishHintNode = showEditPublishHint ? (
    <TooltipBubble
      title={t("dashboard.wizard.mobileEditPublishHintTitle", "✏️ Bebas atur & sesuaikan!")}
      desc={t("dashboard.wizard.mobileEditPublishHintDesc", "Full edit, ubah, atau hapus section")}
    />
  ) : undefined;

  const lengkapiHintNode = showLengkapiHint ? (
    <TooltipBubble
      title={t("dashboard.wizard.mobileHintTitle", "📋 Tambah nomor WA & area")}
      desc={t("dashboard.wizard.mobileHintDesc", "Supaya tombol kontak aktif")}
    />
  ) : undefined;

  // Edu tooltip for Tema (first visit)
  const temaTooltipNode = showTemaHint ? (
    <TooltipBubble
      title={t("dashboard.wizard.temaHintTitle", "🎨 Ganti warna & font")}
      desc={t("dashboard.wizard.temaHintDesc", "Sesuaikan tampilan website kamu")}
    />
  ) : undefined;

  // Center: pill-shaped "Edit & Publish" button (not the standard Plus FAB)
  const centerContent = (
    <button
      type="button"
      onClick={onGoToEditor}
      className="flex flex-col items-center group cursor-pointer active:scale-95 transition-transform"
    >
      <div className="h-12 px-5 rounded-full bg-white text-black flex items-center justify-center gap-2 shadow-lg ring-4 ring-[#1c1c1e] group-hover:scale-105 transition-all whitespace-nowrap">
        <Pencil className="size-4 stroke-[2] shrink-0" />
        <span className="text-[13px] font-bold">{editLabel}</span>
      </div>
      {editPublishHintNode && (
        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 pointer-events-none z-10">
          {editPublishHintNode}
        </div>
      )}
    </button>
  );

  return (
    <div className="absolute bottom-0 left-0 right-0 z-50">
      <BottomNavBar
        className="relative inset-auto"
        ariaLabel="Wizard actions"
        centerLabel={editLabel}
        onCenterPress={onGoToEditor}
        centerContent={centerContent}
        items={[
          {
            id: "tema",
            icon: Palette,
            label: temaLabel,
            onClick: () => {
              setShowTemaHint(false);
              try { localStorage.setItem("wiz_tema_hint_seen", "1"); } catch { /* noop */ }
              onOpenTheme?.();
            },
            tooltip: temaTooltipNode,
          },
          {
            id: "lengkapi",
            icon: Plus,
            label: lengkapiLabel,
            onClick: onOpenSheet,
            tooltip: lengkapiHintNode,
          },
        ]}
      />
    </div>
  );
}
