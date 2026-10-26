"use client";

import React, { useState } from "react";
import { Phone, MapPin } from "lucide-react";
import { normalizeWhatsapp } from "./helpers";
import { useI18n } from "@/lib/i18n/context";

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

  const renderContent = (isMobileSheet: boolean) => (
    <>
      {isMobileSheet && (
        <div className="w-8 h-1 rounded-full bg-slate-700 mx-auto mb-4 md:hidden" />
      )}
      <p className="text-sm font-semibold text-slate-100 mb-1">{t("dashboard.wizard.businessDetailsTitle", "Lengkapi data bisnis")}</p>
      <p className="text-xs text-slate-500 mb-4 leading-relaxed">{t("dashboard.wizard.businessDetailsSubtitle", "Dua data ini langsung dipakai AI untuk isi tombol kontak dan bikin copy yang lebih relevan.")}</p>
      <div className="flex gap-2 mb-3 flex-wrap">
        <span className="inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-full border bg-white/5 text-slate-300 border-white/10">
          <Phone className="w-3 h-3" />
          {waDraft ? t("dashboard.wizard.waSaved", "WA tersimpan") : t("dashboard.wizard.waEmpty", "WA belum diisi")}
        </span>
        <span className="inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-full border bg-white/5 text-slate-300 border-white/10">
          <MapPin className="w-3 h-3" />
          {areaDraft ? areaDraft : t("dashboard.wizard.areaEmpty", "Area belum diisi")}
        </span>
      </div>
      <div className="space-y-3 mb-4">
        <div>
          <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1 block">{t("dashboard.wizard.labelWhatsapp", "Nomor WhatsApp")}</label>
          <input
            type="tel"
            value={waDraft}
            onChange={(e) => setWaDraft(e.target.value)}
            placeholder={t("dashboard.wizard.placeholderPhone", "cth. +6281234567890 atau 081234567890")}
            className="w-full bg-[#1e293b] border border-slate-700/50 rounded-lg px-3 py-2.5 text-base md:text-xs text-slate-200 placeholder-slate-500 outline-none focus:border-primary/50"
          />
          <p className="text-[10px] text-slate-600 mt-1">{t("dashboard.wizard.waHint", "Langsung jadi tombol chat di hero & footer")}</p>
        </div>
        <div>
          <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1 block">{t("dashboard.wizard.labelServiceArea", "Wilayah Layanan")}</label>
          <input
            type="text"
            value={areaDraft}
            onChange={(e) => setAreaDraft(e.target.value)}
            placeholder={t("dashboard.wizard.placeholderArea", "cth. Jogja, Jabodetabek, seluruh Indonesia")}
            className="w-full bg-[#1e293b] border border-slate-700/50 rounded-lg px-3 py-2.5 text-base md:text-xs text-slate-200 placeholder-slate-500 outline-none focus:border-primary/50"
          />
          <p className="text-[10px] text-slate-600 mt-1">{t("dashboard.wizard.serviceAreaHint", "AI pakai ini untuk nulis copy yang lebih relevan")}</p>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onClose}
          className="h-9 px-4 rounded-lg bg-slate-800 text-xs font-semibold text-slate-300 transition-all active:scale-95 hover:bg-slate-700 cursor-pointer"
        >
          {t("dashboard.wizard.btnLater", "Nanti saja")}
        </button>
        <button
          type="button"
          disabled={isUnchanged}
          onClick={handleSave}
          className="flex-1 h-9 rounded-lg flex items-center justify-center gap-1.5 text-xs font-bold bg-primary text-primary-foreground transition-all active:scale-95 disabled:opacity-40 hover:brightness-110 cursor-pointer"
        >
          {t("dashboard.wizard.btnSave", "Simpan")}
        </button>
      </div>
    </>
  );

  if (variant === "popover") {
    return (
      <>
        {/* Fullscreen transparent/dim backdrop to dismiss on click outside */}
        <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[1px]" onClick={onClose} />

        {/* Popover modal anchored with left edge directly above the button */}
        <div
          className="absolute bottom-full left-0 mb-3 z-50 w-[360px] md:w-[380px] max-w-[calc(100vw-32px)] rounded-2xl bg-[#111318] p-5 border border-white/10 shadow-[0_16px_40px_rgba(0,0,0,0.7)] text-slate-100 animate-in fade-in slide-in-from-bottom-2 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {renderContent(false)}
        </div>
      </>
    );
  }

  // Mobile Bottom Sheet variant
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 md:hidden" onClick={onClose}>
      <div
        className="w-full rounded-t-2xl bg-[#111318] px-5 pb-8 pt-3 border-t border-white/10 animate-in fade-in slide-in-from-bottom-4 duration-300"
        onClick={(e) => e.stopPropagation()}
        style={{ boxShadow: "0 -8px 30px rgba(0,0,0,0.5)" }}
      >
        {renderContent(true)}
      </div>
    </div>
  );
}
