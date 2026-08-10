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
}

export function BusinessDetailsSheet({
  isOpen,
  onClose,
  chat,
  onSave,
}: BusinessDetailsSheetProps) {
  const { t } = useI18n();
  const [waDraft, setWaDraft] = useState(chat.whatsapp || "");
  const [areaDraft, setAreaDraft] = useState(chat.serviceArea || "");

  if (!isOpen) return null;

  const isUnchanged = waDraft === (chat.whatsapp || "") && areaDraft === (chat.serviceArea || "");

  const handleSave = () => {
    const finalWa = waDraft ? normalizeWhatsapp(waDraft) : "";
    onSave(finalWa, areaDraft);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center md:items-end md:justify-center bg-black/60" onClick={onClose}>
      <div className="rounded-t-2xl md:rounded-2xl bg-[#111318] px-5 pb-8 pt-3 md:pt-5 border-t md:border border-white/10 md:max-w-sm md:w-full md:mx-4 md:mb-6" onClick={(e) => e.stopPropagation()} style={{ boxShadow: "0 -8px 30px rgba(0,0,0,0.5)" }}>
        <div className="w-8 h-1 rounded-full bg-slate-700 mx-auto mb-4 md:hidden" />
        <p className="text-sm font-semibold text-slate-100 mb-1">{t("dashboard.wizard.businessDetailsTitle", "Lengkapi data bisnis")}</p>
        <p className="text-xs text-slate-500 mb-4 leading-relaxed">{t("dashboard.wizard.businessDetailsSubtitle", "Dua data ini langsung dipakai AI untuk isi tombol kontak dan bikin copy yang lebih relevan.")}</p>
        <div className="flex gap-2 mb-3 flex-wrap">
          <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-full border ${waDraft ? "bg-emerald-900/20 text-emerald-400 border-emerald-700/30" : "bg-amber-900/20 text-amber-400 border-amber-700/30"}`}>
            <Phone className="w-3 h-3" />
            {waDraft ? t("dashboard.wizard.waSaved", "WA tersimpan") : t("dashboard.wizard.waEmpty", "WA belum diisi")}
          </span>
          <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-full border ${areaDraft ? "bg-emerald-900/20 text-emerald-400 border-emerald-700/30" : "bg-amber-900/20 text-amber-400 border-amber-700/30"}`}>
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
              placeholder={t("dashboard.wizard.placeholderPhone", "cth. 081234567890")}
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
            className="h-9 px-4 rounded-lg bg-slate-800 text-xs font-semibold text-slate-300 transition-all active:scale-95"
          >
            {t("dashboard.wizard.btnLater", "Nanti saja")}
          </button>
          <button
            type="button"
            disabled={isUnchanged}
            onClick={handleSave}
            className="flex-1 h-9 rounded-lg flex items-center justify-center gap-1.5 text-xs font-bold bg-primary text-primary-foreground transition-all active:scale-95 disabled:opacity-40"
          >
            {t("dashboard.wizard.btnSave", "Simpan")}
          </button>
        </div>
      </div>
    </div>
  );
}
