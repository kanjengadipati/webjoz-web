"use client";

import React from "react";
import { Dialog, Button } from "webjoz-ui";
import { CheckCircle2, Eye, ArrowRight } from "lucide-react";
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

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
      title={
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <span className="font-bold text-base text-foreground">
            {t("dashboard.wizard.successModalTitle", "Selamat! Website Anda Telah Siap")}
          </span>
        </div>
      }
      footer={
        <div className="flex w-full flex-col-reverse sm:flex-row sm:justify-end gap-2.5">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1 sm:flex-none"
          >
            <Eye className="h-4 w-4 mr-1.5" />
            {t("dashboard.wizard.successModalBtnPreview", "Lihat Preview")}
          </Button>
          <Button
            type="button"
            onClick={onGoToEditor}
            className="flex-1 sm:flex-none font-bold"
          >
            {t("dashboard.wizard.successModalBtnEdit", "Edit & Publikasikan")}
            <ArrowRight className="h-4 w-4 ml-1.5" />
          </Button>
        </div>
      }
    >
      <div className="space-y-3 py-1 text-sm text-muted-foreground leading-relaxed">
        <p>
          {t(
            "dashboard.wizard.successModalDesc",
            "Website telah berhasil dibuat oleh AI. Silakan periksa hasil tampilannya terlebih dahulu. Jika ada bagian konten, gambar, warna, atau tata letak yang kurang pas, Anda bisa dengan mudah menyesuaikan semuanya di halaman Editor."
          )}
        </p>
      </div>
    </Dialog>
  );
}
