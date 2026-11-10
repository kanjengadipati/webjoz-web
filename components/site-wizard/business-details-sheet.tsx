"use client";

import React, { useState } from "react";
import { Phone, MapPin } from "lucide-react";
import { normalizeWhatsapp } from "./helpers";
import { useI18n } from "@/lib/i18n/context";
import { WizardSheet } from "./wizard-sheet";

interface BusinessDetailsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  chat: {
    whatsapp: string;
    serviceArea: string;
    businessName: string;
    businessType: string;
  };
  onSave: (whatsapp: string, serviceArea: string) => void;
  variant?: "popover" | "sheet";
}

export function BusinessDetailsSheet({
  isOpen,
  onClose,
  chat,
  onSave,
  variant = "sheet",
}: BusinessDetailsSheetProps) {
  const { t } = useI18n();
  const [waDraft, setWaDraft] = useState(chat.whatsapp || "");
  const [areaDraft, setAreaDraft] = useState(chat.serviceArea || "");

  React.useEffect(() => {
    if (isOpen) {
      setWaDraft(chat.whatsapp || "");
      setAreaDraft(chat.serviceArea || "");
    }
  }, [isOpen, chat.whatsapp, chat.serviceArea]);

  if (!isOpen) return null;

  const isUnchanged = waDraft === (chat.whatsapp || "") && areaDraft === (chat.serviceArea || "");

  const handleSave = () => {
    const finalWa = waDraft ? normalizeWhatsapp(waDraft) : "";
    onSave(finalWa, areaDraft);
  };

  const renderContent = () => (
    <>
      <p className="text-xs text-sidebar-muted-foreground mb-4 leading-relaxed px-4">{t("dashboard.wizard.businessDetailsSubtitle", "Dua data ini langsung dipakai AI untuk isi tombol kontak dan bikin copy yang lebih relevan.")}</p>
      <div className="flex gap-2 mb-3 flex-wrap px-4">
        <span className="inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-full border bg-sidebar-muted/40 text-sidebar-muted-foreground border-border">
          <Phone className="w-3 h-3" />
          {waDraft ? t("dashboard.wizard.waSaved", "WA tersimpan") : t("dashboard.wizard.waEmpty", "WA belum diisi")}
        </span>
        <span className="inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-full border bg-sidebar-muted/40 text-sidebar-muted-foreground border-border">
          <MapPin className="w-3 h-3" />
          {areaDraft ? areaDraft : t("dashboard.wizard.areaEmpty", "Area belum diisi")}
        </span>
      </div>
      <div className="space-y-3 mb-4 px-4">
        <div>
          <label className="text-[10px] font-semibold uppercase tracking-wider text-sidebar-subtle-foreground mb-1 block">{t("dashboard.wizard.labelWhatsapp", "Nomor WhatsApp")}</label>
          <input
            type="tel"
            value={waDraft}
            onChange={(e) => setWaDraft(e.target.value)}
            placeholder={t("dashboard.wizard.placeholderPhone", "cth. +6281234567890 atau 081234567890")}
            className="w-full bg-sidebar-input border border-border rounded-xl px-3 py-2.5 text-base md:text-xs text-sidebar-foreground placeholder:text-sidebar-muted-foreground outline-none focus:border-primary/50 transition-colors"
          />
          <p className="text-[10px] text-sidebar-muted-foreground mt-1">{t("dashboard.wizard.waHint", "Langsung jadi tombol chat di hero & footer")}</p>
        </div>
        <div>
          <label className="text-[10px] font-semibold uppercase tracking-wider text-sidebar-subtle-foreground mb-1 block">{t("dashboard.wizard.labelServiceArea", "Wilayah Layanan")}</label>
          <input
            type="text"
            value={areaDraft}
            onChange={(e) => setAreaDraft(e.target.value)}
            placeholder={t("dashboard.wizard.placeholderArea", "cth. Jogja, Jabodetabek, seluruh Indonesia")}
            className="w-full bg-sidebar-input border border-border rounded-xl px-3 py-2.5 text-base md:text-xs text-sidebar-foreground placeholder:text-sidebar-muted-foreground outline-none focus:border-primary/50 transition-colors"
          />
          <p className="text-[10px] text-sidebar-muted-foreground mt-1">{t("dashboard.wizard.serviceAreaHint", "AI pakai ini untuk nulis copy yang lebih relevan")}</p>
        </div>
      </div>
      <div className="flex gap-2 px-4 pb-2">
        <button
          type="button"
          onClick={onClose}
          className="h-10 px-5 rounded-xl bg-sidebar-muted text-xs font-semibold text-sidebar-foreground transition-all active:scale-95 hover:bg-sidebar-muted/70 cursor-pointer"
        >
          {t("dashboard.wizard.btnLater", "Nanti saja")}
        </button>
        <button
          type="button"
          disabled={isUnchanged}
          onClick={handleSave}
          className="flex-1 h-10 rounded-xl flex items-center justify-center gap-1.5 text-xs font-bold bg-primary text-primary-foreground transition-all active:scale-95 disabled:opacity-40 hover:brightness-110 cursor-pointer"
        >
          {t("dashboard.wizard.btnSave", "Simpan")}
        </button>
      </div>
    </>
  );

  if (variant === "popover") {
    return (
      <>
        {/* Backdrop to dismiss on click outside */}
        <div className="fixed inset-0 z-40" onClick={onClose} />
        <div
          className="absolute bottom-full left-0 mb-3 z-50 w-[360px] md:w-[380px] max-w-[calc(100vw-32px)] rounded-2xl bg-sidebar p-5 border border-border shadow-xl text-sidebar-foreground animate-in fade-in slide-in-from-bottom-2 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {renderContent()}
        </div>
      </>
    );
  }

  // Mobile Bottom Sheet variant
  return (
    <WizardSheet
      open={isOpen}
      title={t("dashboard.wizard.businessDetailsTitle", "Detail Bisnis")}
      onClose={onClose}
      maxHeight="85dvh"
    >
      <div className="flex-1 overflow-y-auto">
        {renderContent()}
      </div>
    </WizardSheet>
  );
}
