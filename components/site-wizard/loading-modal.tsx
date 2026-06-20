"use client";

import React from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { LOADING_CHECKLIST, LOADING_STEPS_PERCENT } from "./constants";

interface LoadingModalProps {
  loadingStep: number;
  businessType: string;
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

export function LoadingModal({ loadingStep, businessType }: LoadingModalProps) {
  return (
    <div className="absolute inset-0 z-30 flex items-center justify-end pr-8">
      <div className="backdrop-blur-xl rounded-3xl w-full max-w-sm p-7 shadow-2xl flex flex-col gap-5 animate-in slide-in-from-right-4 zoom-in-95 duration-500" style={{ background: "rgba(17,19,24,0.97)", border: "1px solid rgba(255,255,255,0.1)" }}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#7c3aed] to-indigo-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-white m-0 leading-tight">
              AI sedang membangun website Anda ✨
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Mohon tunggu sebentar...</p>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="h-2.5 rounded-full overflow-hidden flex-1 mr-3" style={{ background: "rgba(255,255,255,0.06)" }}>
              <div
                className="h-full bg-gradient-to-r from-[#7c3aed] to-[#38bdf8] transition-all duration-1000 ease-out rounded-full"
                style={{ width: `${LOADING_STEPS_PERCENT[loadingStep] ?? 15}%` }}
              />
            </div>
            <span className="text-xs font-bold text-[#7c3aed] shrink-0">{LOADING_STEPS_PERCENT[loadingStep] ?? 15}%</span>
          </div>
        </div>

        <div className="space-y-3">
          {LOADING_CHECKLIST.map(({ label, desc }, idx) => {
            const done = loadingStep > idx;
            const active = loadingStep === idx;
            return (
              <div key={idx} className={`flex items-start gap-3 transition-all duration-300 ${done ? "opacity-100" : active ? "opacity-100" : "opacity-40"}`}>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all duration-300 ${done ? "border-[#7c3aed] bg-[#7c3aed]" : active ? "border-[#7c3aed]" : "border-slate-700"
                  }`} style={!done ? { background: "rgba(255,255,255,0.04)" } : {}}>
                  {done ? (
                    <span className="text-white text-[10px] font-bold">✓</span>
                  ) : active ? (
                    <Loader2 className="w-2.5 h-2.5 text-[#7c3aed] animate-spin" />
                  ) : null}
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`text-xs font-semibold leading-tight ${done ? "text-slate-200" : active ? "text-[#7c3aed]" : "text-slate-600"}`}>
                    {label}
                  </div>
                  <div className="text-[10px] text-slate-600 leading-tight mt-0.5">{desc}</div>
                </div>
                <div className={`text-[10px] font-mono shrink-0 mt-0.5 ${active ? "text-[#7c3aed]" : "text-slate-300"}`}>
                  {active ? `00:${String(idx + 3).padStart(2, "0")}` : done ? `00:0${idx + 3}` : "00:00"}
                </div>
              </div>
            );
          })}
        </div>

        {loadingStep >= 3 && (
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
