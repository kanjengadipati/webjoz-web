"use client";

import React from "react";
import { Loader2, Square, Mic, ArrowRight } from "lucide-react";
import { AudioWaveform } from "../audio-waveform";
import { MicOnboardingHint } from "../mic-onboarding-hint";
import { getDynamicDescriptionPlaceholder } from "../helpers";

interface WizardChatInputProps {
  chat: {
    isRecording: boolean;
    isMicConnecting: boolean;
    isSpeaking: boolean;
    audioLevel: number;
    recordingDuration: number;
    sttLang: string;
    interimTranscript: string;
    toggleSttLang: () => void;
    stopRecording: () => void;
    cancelRecording: () => void;
    startRecording: () => void;
    inputRef: React.RefObject<HTMLInputElement | null>;
    inputValue: string;
    setInputValue: (val: string) => void;
    chatEndRef: React.RefObject<HTMLDivElement | null>;
    isAiTyping: boolean;
    isAnalyzingDescription: boolean;
    isProcessingAudio: boolean;
    awaitingNameConfirm: boolean;
    chatStage: string;
  };
  isKeyboardOpen: boolean;
  transcriptScrollRef: React.RefObject<HTMLDivElement | null>;
  handleSendText: (e: React.FormEvent) => void;
  locale?: string;
  t: (key: string, fallback?: string) => string;
}

export function WizardChatInput({
  chat,
  isKeyboardOpen,
  transcriptScrollRef,
  handleSendText,
  locale,
  t,
}: WizardChatInputProps) {
  if (
    chat.chatStage === "type" ||
    chat.chatStage === "language" ||
    chat.chatStage === "mood" ||
    chat.chatStage === "done"
  ) {
    return null;
  }

  return (
    <div
      className={`shrink-0 px-4 pt-2 md:py-3 relative transition-all duration-150 ${
        isKeyboardOpen ? "pb-2" : "pb-6"
      }`}
      style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
    >
      {chat.isRecording || chat.isMicConnecting ? (
        <div className="flex flex-col gap-2.5 p-3 rounded-2xl bg-white/[0.04] border border-white/10 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between gap-3">
            {/* Status & Timer */}
            <div className="flex items-center gap-2 shrink-0">
              {chat.isMicConnecting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 text-slate-300 animate-spin shrink-0" />
                  <span className="text-xs font-semibold text-slate-200">
                    {t("dashboard.wizard.sttConnecting", "Menyiapkan mic...")}
                  </span>
                </>
              ) : (
                <>
                  <span className="flex h-2.5 w-2.5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                  </span>
                  <span className="text-xs font-semibold text-slate-200 hidden sm:inline">
                    {t("dashboard.wizard.sttListening", "Mendengarkan...")}
                  </span>
                  <span className="text-xs font-mono font-bold text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded border border-red-500/20">
                    {Math.floor(chat.recordingDuration / 60)
                      .toString()
                      .padStart(2, "0")}
                    :{(chat.recordingDuration % 60).toString().padStart(2, "0")}
                  </span>
                </>
              )}
            </div>

            {/* Waveform Visualizer */}
            <div className="flex-1 flex justify-center min-w-0">
              <AudioWaveform
                isRecording={chat.isRecording}
                isConnecting={chat.isMicConnecting}
                isSpeaking={chat.isSpeaking}
                audioLevel={chat.audioLevel}
              />
            </div>

            {/* Language Toggle & Round Stop Button */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={chat.toggleSttLang}
                className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold border border-white/10 bg-white/5 hover:bg-white/10 text-slate-200 transition-all active:scale-95 cursor-pointer shadow-xs"
                title={
                  chat.sttLang === "id-ID"
                    ? "Bahasa: Indonesia (Klik untuk ganti ke English)"
                    : "Language: English (Click to switch to Bahasa Indonesia)"
                }
              >
                {chat.sttLang === "id-ID" ? "🇮🇩 ID" : "🇬🇧 EN"}
              </button>

              <button
                type="button"
                onClick={chat.stopRecording}
                className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-900 shadow-md hover:scale-105 active:scale-95 transition-all shrink-0 cursor-pointer"
                title={t("dashboard.wizard.sttBtnDone", "Selesai")}
              >
                <Square className="w-3.5 h-3.5 fill-slate-900" />
              </button>
            </div>
          </div>

          {/* Bottom Action Row: Live Transcript + Selesai & Batal */}
          <div className="flex items-center justify-between pt-1 border-t border-white/10 gap-2">
            <div
              ref={transcriptScrollRef}
              className="text-[11px] text-slate-300 flex-1 font-medium overflow-x-auto whitespace-nowrap scroll-smooth flex items-center min-w-0 pr-1"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {chat.interimTranscript ? (
                <span className="text-slate-200 italic flex items-center gap-1">
                  &ldquo;{chat.interimTranscript}&rdquo;
                  {chat.isRecording && (
                    <span className="inline-block w-1.5 h-3 bg-slate-300 rounded-xs animate-pulse shrink-0 align-middle" />
                  )}
                </span>
              ) : (
                <span className="text-slate-400 shrink-0">
                  {t("dashboard.wizard.sttPromptGuide", "Ceritakan bisnis Anda...")}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={chat.cancelRecording}
                className="text-[11px] font-semibold text-slate-400 hover:text-slate-200 px-2 py-1 transition-colors cursor-pointer"
              >
                {t("dashboard.wizard.sttBtnCancel", "Batal")}
              </button>
              <button
                type="button"
                onClick={chat.stopRecording}
                className="text-[11px] font-bold text-slate-900 bg-white hover:bg-slate-100 px-3 py-1 rounded-lg shadow transition-all active:scale-95 cursor-pointer"
              >
                {t("dashboard.wizard.sttBtnDone", "Selesai")}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleSendText}
          className="flex items-center rounded-2xl px-4 py-1 gap-2 transition-all"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          <input
            ref={chat.inputRef}
            type="text"
            onFocus={() => {
              setTimeout(() => {
                window.scrollTo(0, 0);
                chat.chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
              }, 120);
            }}
            value={chat.inputValue}
            onChange={(e) => chat.setInputValue(e.target.value)}
            placeholder={
              chat.isRecording
                ? t("dashboard.wizard.sttListening", "Mendengarkan...")
                : chat.awaitingNameConfirm
                ? t("dashboard.wizard.nameConfirmPlaceholder", "Ketik 'ya' untuk lanjut, atau nama yang benar...")
                : chat.chatStage === "description"
                ? getDynamicDescriptionPlaceholder(locale)
                : t("dashboard.wizard.inputPlaceholderName", "Masukkan nama bisnis Anda...")
            }
            autoFocus
            disabled={chat.isAiTyping || chat.isAnalyzingDescription || chat.isProcessingAudio}
            className="flex-1 bg-transparent border-none py-2.5 text-base md:text-sm text-slate-200 placeholder-slate-500 focus:outline-none disabled:opacity-50"
          />
          {chat.chatStage === "description" && (
            <div className="relative shrink-0 flex items-center">
              <MicOnboardingHint
                visible={!chat.isRecording && !chat.isProcessingAudio && !chat.isAnalyzingDescription}
              />
              <button
                type="button"
                onClick={chat.startRecording}
                disabled={chat.isAiTyping || chat.isAnalyzingDescription || chat.isProcessingAudio}
                className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/[0.06] border border-border text-slate-400 hover:text-white hover:bg-white/[0.12] transition-all disabled:opacity-30 shrink-0 active:scale-95 animate-mic-pulse cursor-pointer"
                title={t("dashboard.wizard.sttStartRecording", "Bicara dengan mic")}
              >
                <Mic className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
          <button
            type="submit"
            disabled={
              chat.isAiTyping ||
              chat.isAnalyzingDescription ||
              chat.isProcessingAudio ||
              (chat.chatStage === "name" && !chat.inputValue.trim())
            }
            className="w-8 h-8 flex items-center justify-center rounded-xl bg-white text-slate-900 hover:bg-slate-100 transition-all disabled:opacity-30 shrink-0 cursor-pointer shadow-xs"
          >
            {chat.isAnalyzingDescription ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <ArrowRight className="w-3.5 h-3.5" />
            )}
          </button>
        </form>
      )}
    </div>
  );
}

