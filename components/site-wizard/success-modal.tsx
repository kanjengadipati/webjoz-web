"use client";

import React from "react";
import { CheckCircle2, Eye, ArrowRight } from "lucide-react";
import { SparkleIcon } from "@/components/sparkle-icon";
import { useI18n } from "@/lib/i18n/context";

interface WizardSuccessModalProps {
  open: boolean;
  onClose: () => void;
  onGoToEditor: () => void;
}

export function WizardSuccessModal({
  open,
  onClose,
  onGoToEditor,
}: WizardSuccessModalProps) {
  const { t } = useI18n();

  if (!open) return null;

  return (
    <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 animate-in fade-in duration-300">
      <div
        className="w-full max-w-md rounded-3xl p-7 shadow-[0_20px_50px_rgba(0,0,0,0.4)] animate-in zoom-in-95 duration-400"
        style={{
          background: "linear-gradient(135deg, rgba(20,24,33,0.98) 0%, rgba(13,15,20,0.98) 100%)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
        }}
      >
        <div className="flex flex-col items-center text-center">
          {/* Decorative Icon */}
          <div className="relative mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
            <CheckCircle2 className="h-8 w-8" />
            <SparkleIcon className="absolute -top-1.5 -right-1.5 h-6 w-6 animate-pulse" />
          </div>

          {/* Title & Description */}
          <h3 className="mb-3 text-lg font-extrabold text-white tracking-tight">
            {t("dashboard.wizard.successModalTitle", "Selamat! Website Anda Telah Siap 🎉")}
          </h3>
          <p className="mb-6 text-xs leading-relaxed text-slate-300">
            {t(
              "dashboard.wizard.successModalDesc",
              "Website telah berhasil dibuat oleh AI. Silakan periksa hasil tampilannya terlebih dahulu. Jika ada bagian konten, gambar, warna, atau tata letak yang kurang pas, Anda bisa dengan mudah menyesuaikan semuanya di halaman Editor."
            )}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row w-full gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-white/[0.06] text-xs font-semibold text-slate-200 border border-white/10 transition-all hover:bg-white/10 active:scale-98"
            >
              <Eye className="h-4 w-4" />
              {t("dashboard.wizard.successModalBtnPreview", "Lihat Preview")}
            </button>
            <button
              type="button"
              onClick={onGoToEditor}
              className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl text-xs font-bold bg-primary text-primary-foreground transition-all hover:brightness-110 active:scale-98 shadow-lg shadow-primary/25"
            >
              {t("dashboard.wizard.successModalBtnEdit", "Edit & Publikasikan")}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
