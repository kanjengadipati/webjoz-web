"use client";

import React from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { LOADING_CHECKLIST, LOADING_STEPS_PERCENT } from "./constants";

interface LoadingCardProps {
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

export function LoadingCard({ loadingStep, businessType }: LoadingCardProps) {
  return (
    <div className="flex gap-2.5 justify-start animate-in fade-in slide-in-from-bottom-2 duration-400">
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#7c3aed] to-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
        <Sparkles className="w-3 h-3 text-white" />
      </div>
      <div
        className="flex-1 min-w-0 rounded-2xl rounded-tl-sm px-3.5 py-3 space-y-3"
        style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.07)" }}
      >
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
            <div
              className="h-full rounded-full transition-all duration-1000 ease-out"
              style={{
                width: `${LOADING_STEPS_PERCENT[loadingStep] ?? 15}%`,
                background: "linear-gradient(90deg, #7c3aed, #38bdf8)",
              }}
            />
          </div>
          <span className="text-[10px] font-bold shrink-0" style={{ color: "#a78bfa" }}>
            {LOADING_STEPS_PERCENT[loadingStep] ?? 15}%
          </span>
        </div>

        <div className="space-y-2">
          {[
            { label: "Analisis bisnis & target pasar", icon: "🔍" },
            { label: "Menyusun struktur halaman", icon: "📐" },
            { label: "Menulis headline & copywriting", icon: "✍️" },
            { label: "Optimasi SEO on-page", icon: "🔎" },
            { label: "Memilih palet warna & tipografi", icon: "🎨" },
            { label: "Website siap dipublish!", icon: "🚀" },
          ].map(({ label, icon }, idx) => {
            const done = loadingStep > idx;
            const active = loadingStep === idx;
            return (
              <div
                key={idx}
                className="flex items-center gap-2.5 transition-all duration-300"
                style={{ opacity: done ? 1 : active ? 1 : 0.3 }}
              >
                <div
                  className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-all duration-300"
                  style={
                    done
                      ? { background: "rgba(52,211,153,0.2)", border: "1px solid rgba(52,211,153,0.4)" }
                      : active
                        ? { background: "rgba(124,58,237,0.2)", border: "1px solid rgba(124,58,237,0.5)" }
                        : { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }
                  }
                >
                  {done ? (
                    <span className="text-[8px] text-emerald-400 font-bold">✓</span>
                  ) : active ? (
                    <Loader2 className="w-2.5 h-2.5 text-[#7c3aed] animate-spin" />
                  ) : null}
                </div>
                <span
                  className="text-[11px] font-medium leading-tight"
                  style={{ color: done ? "#86efac" : active ? "#a78bfa" : "rgba(148,163,184,1)" }}
                >
                  {label}
                </span>
                {active && (
                  <span className="ml-auto text-[9px] font-mono shrink-0" style={{ color: "#7c3aed" }}>
                    {String(idx + 2).padStart(2, "0")}s
                  </span>
                )}
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
