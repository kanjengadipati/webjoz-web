"use client";

import React from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { LOADING_CHECKLIST, LOADING_STEPS_PERCENT } from "./constants";

interface LoadingModalProps {
  loadingStep: number;
  businessType: string;
  center?: boolean;
}

function getInsight(businessType: string): string {
  switch (businessType) {
    case "Kuliner":
      return "Website dengan foto makanan berkualitas tinggi meningkatkan konversi 3x lebih besar.";
    case "Toko & UMKM":
      return "Website dengan tone modern memiliki konversi lebih tinggi untuk bisnis toko & UMKM.";
    case "Jasa":
      return "Website dengan portofolio & testimoni nyata meningkatkan kepercayaan calon klien secara signifikan.";
    default:
      return "Website profesional dengan profil perusahaan yang kuat mempercepat kepercayaan klien korporat.";
  }
}

export function LoadingModal({ loadingStep, businessType, center }: LoadingModalProps) {
  return (
    <div className={`absolute inset-0 z-30 flex ${center ? "items-end pb-6 px-4 justify-center" : "items-center justify-end pr-8"}`}>
      <div className={`backdrop-blur-xl rounded-3xl w-full shadow-2xl flex flex-col animate-in ${center ? "max-w-full p-3 gap-2 slide-in-from-bottom-4" : "max-w-sm p-7 gap-5 slide-in-from-right-4 zoom-in-95"} duration-500`} style={{ background: "rgba(17,19,24,0.95)", border: "1px solid rgba(255,255,255,0.1)" }}>
        {/* Header row: icon + title + percentage */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <div className={`rounded-xl bg-gradient-to-br from-[#7c3aed] to-indigo-600 flex items-center justify-center ${center ? "w-6 h-6" : "w-8 h-8"}`}>
              <Sparkles className={`text-white ${center ? "w-3 h-3" : "w-4 h-4"}`} />
            </div>
            <div className="min-w-0">
              <h3 className={`font-extrabold text-white m-0 leading-tight ${center ? "text-[12px]" : "text-sm"}`}>
                {center ? "Membangun website..." : "AI sedang membangun website Anda ✨"}
              </h3>
              {!center && <p className="text-[11px] text-slate-400 mt-0.5">Mohon tunggu sebentar...</p>}
            </div>
          </div>
          {!center && <span className="text-xs font-bold text-[#7c3aed] shrink-0">{LOADING_STEPS_PERCENT[loadingStep] ?? 15}%</span>}
        </div>

        {/* Progress bar */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className={`rounded-full overflow-hidden flex-1 ${center ? "h-2" : "h-2.5"}`} style={{ background: "rgba(255,255,255,0.06)" }}>
              <div
                className="h-full bg-gradient-to-r from-[#7c3aed] to-[#38bdf8] transition-all duration-1000 ease-out rounded-full"
                style={{ width: `${LOADING_STEPS_PERCENT[loadingStep] ?? 15}%` }}
              />
            </div>
            {center && <span className="text-[11px] font-bold text-[#7c3aed] shrink-0">{LOADING_STEPS_PERCENT[loadingStep] ?? 15}%</span>}
          </div>
        </div>

        {/* Checklist — only current + next 2 on mobile */}
        <div className={center ? "flex flex-wrap gap-x-3 gap-y-1" : ""}>
          {LOADING_CHECKLIST.map(({ label }, idx) => {
            const done = loadingStep > idx;
            const active = loadingStep === idx;
            // On mobile, hide completed older than current+1 and pending beyond next 2
            if (center && !active && !done && idx > loadingStep + 1) return null;
            if (center && done && idx < loadingStep - 2) return null;
            return (
              <div key={idx} className={`flex items-center gap-1.5 transition-all duration-300 ${active || done ? "opacity-100" : center ? "opacity-50" : "opacity-40"}`}>
                <div className={`rounded-full border flex items-center justify-center shrink-0 transition-all duration-300 ${done ? "border-[#7c3aed] bg-[#7c3aed]" : active ? "border-[#7c3aed]" : "border-slate-600"} ${center ? "w-3.5 h-3.5" : "w-5 h-5"}`} style={!done ? { background: "rgba(255,255,255,0.04)" } : {}}>
                  {done ? <span className={`text-white font-bold ${center ? "text-[7px]" : "text-[10px]"}`}>✓</span>
                  : active ? <Loader2 className={`text-[#7c3aed] animate-spin ${center ? "w-2 h-2" : "w-2.5 h-2.5"}`} />
                  : null}
                </div>
                <span className={`font-semibold leading-tight truncate ${done ? "text-slate-300" : active ? "text-[#7c3aed]" : "text-slate-500"} ${center ? "text-[10px]" : "text-xs"}`}>
                  {label}
                </span>
                {!center && (
                  <span className={`font-mono shrink-0 ml-auto ${active ? "text-[#7c3aed]" : "text-slate-300"} text-[10px]`}>
                    {active ? `00:${String(idx + 3).padStart(2, "0")}` : done ? `00:0${idx + 3}` : "00:00"}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* AI Insight — only on desktop */}
        {!center && loadingStep >= 3 && (
          <div className="rounded-2xl p-3.5 animate-in fade-in duration-500" style={{ background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.2)" }}>
            <div className="flex items-center gap-1.5 mb-1.5">
              <Sparkles className="w-3 h-3 text-[#7c3aed]" />
              <span className="text-[11px] font-bold text-violet-400">AI Insight</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">{getInsight(businessType)}</p>
          </div>
        )}
      </div>
    </div>
  );
}
