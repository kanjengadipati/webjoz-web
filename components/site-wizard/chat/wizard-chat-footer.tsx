"use client";

import React from "react";
import { RotateCcw } from "lucide-react";

interface WizardChatFooterProps {
  previewState: string;
  chatStage: string;
  isAnalyzingDescription: boolean;
  isAiTyping: boolean;
  messagesCount: number;
  inputValue: string;
  clock: Date;
  handleResetChat: () => void;
  t: (key: string, fallback?: string) => string;
}

export function WizardChatFooter({
  previewState,
  chatStage,
  isAnalyzingDescription,
  isAiTyping,
  messagesCount,
  inputValue,
  clock,
  handleResetChat,
  t,
}: WizardChatFooterProps) {
  return (
    <div
      className="px-5 py-3 shrink-0 flex items-center justify-between"
      style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
    >
      <span className="text-[11px] text-slate-500 flex items-center gap-1.5">
        <div
          className={`w-2 h-2 rounded-full shrink-0 transition-all duration-500 ${
            previewState === "loading" || isAnalyzingDescription
              ? "bg-primary animate-pulse"
              : "bg-slate-300"
          }`}
        />
        <span className="transition-all duration-300">
          {previewState === "wireframe" &&
            (chatStage === "name" ||
              chatStage === "description" ||
              chatStage === "type" ||
              chatStage === "mood" ||
              chatStage === "brand-logo") &&
            (isAnalyzingDescription
              ? t("dashboard.wizard.statusAnalyzingName", "AI menganalisis nama...")
              : t("dashboard.wizard.statusWaitingInput", "Menunggu input..."))}
          {previewState === "loading" &&
            t("dashboard.wizard.statusAiGenerating", "AI sedang generate...")}
          {previewState === "result" &&
            t("dashboard.wizard.statusPreviewReady", "Preview siap ✓")}
          {previewState === "wireframe" &&
            chatStage === "done" &&
            t("dashboard.wizard.statusPreparingAi", "Menyiapkan AI...")}
        </span>
      </span>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleResetChat}
          disabled={
            previewState === "loading" ||
            isAiTyping ||
            (chatStage === "name" && messagesCount <= 1 && !inputValue.trim())
          }
          className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-200 transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer py-0.5 px-1 rounded-md active:scale-95"
          title={t("dashboard.wizard.resetChatTooltip", "Mulai ulang chat dari awal")}
        >
          <RotateCcw className="w-3 h-3" />
          <span>{t("dashboard.wizard.resetChatBtn", "Reset Chat")}</span>
        </button>
        <span className="text-[11px] text-slate-500 hidden sm:inline" suppressHydrationWarning>
          {clock.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} WIB
        </span>
      </div>
    </div>
  );
}

