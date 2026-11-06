"use client";

import React from "react";
import { SparkleIcon } from "@/components/sparkle-icon";
import { Check, X, TrendingUp, EyeOff, Loader2 } from "lucide-react";
import type { VariantCritiqueResult } from "@/lib/design-assets-config";

export interface CritiqueModalProps {
  isOpen: boolean;
  onClose: () => void;
  variant: { value: string; label: string };
  sectionKey: string;
  critiqueData?: VariantCritiqueResult;
  isCritiquing?: boolean;
  isHidden?: boolean;
  onReCritique?: () => void;
  onToggleHide?: () => void;
}

export function CritiqueModal({
  isOpen,
  onClose,
  variant,
  sectionKey,
  critiqueData,
  isCritiquing = false,
  isHidden = false,
  onReCritique,
  onToggleHide,
}: CritiqueModalProps) {
  if (!isOpen || !critiqueData) return null;

  const tierColors = {
    S: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
    A: "bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30",
    B: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30",
    C: "bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30",
  }[critiqueData.tier] || "bg-muted text-muted-foreground border-border";

  return (
    <div className="fixed inset-0 z-[250] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-card text-card-foreground border border-border/80 rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border/80 flex items-center justify-between bg-muted/20">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <SparkleIcon className="size-4 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm sm:text-base">{variant.label}</h3>
                <code className="text-[11px] font-mono bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
                  {variant.value}
                </code>
              </div>
              <p className="text-xs text-muted-foreground">
                Section: <span className="capitalize font-medium text-foreground">{sectionKey}</span> · AI Visual Critique
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="size-8 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-all cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="px-6 py-5 overflow-y-auto space-y-5 flex-1">
          {/* Overall Score */}
          <div className={`p-4 rounded-xl border flex items-center justify-between ${tierColors}`}>
            <div>
              <div className="text-[11px] uppercase font-bold tracking-wider opacity-80">Skor Desain</div>
              <div className="text-3xl font-extrabold flex items-baseline gap-1.5 mt-0.5">
                <span>{critiqueData.score}</span>
                <span className="text-xs font-medium opacity-70">/ 100</span>
              </div>
            </div>
            <div className="text-right">
              <span className="inline-block px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider border border-current/20">
                Tier {critiqueData.tier}
              </span>
              <div className="text-[11px] opacity-80 mt-1">
                {critiqueData.tier === "S"
                  ? "World-Class Quality"
                  : critiqueData.tier === "A"
                  ? "Production Ready"
                  : critiqueData.tier === "B"
                  ? "Needs Polish"
                  : "Needs Rework"}
              </div>
            </div>
          </div>

          {/* 4 Dimension Rubric */}
          <div className="space-y-2.5">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Rubrik Evaluasi (4 Dimensi × 25 Poin)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[
                { label: "Visual Hierarchy", score: critiqueData.hierarchy, desc: "Alur baca, focal point & CTA" },
                { label: "Typography & Contrast", score: critiqueData.typography, desc: "Legibility font & skala heading" },
                { label: "Whitespace & Balance", score: critiqueData.whitespace, desc: "Kerapian padding & ritme visual" },
                { label: "Modern Polish 2026", score: critiqueData.polish, desc: "Estetika modern & micro-details" },
              ].map((dim, i) => (
                <div key={i} className="p-3 rounded-xl bg-muted/30 border border-border/60 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-foreground">{dim.label}</span>
                    <span className="font-mono font-bold">{dim.score} / 25</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (dim.score / 25) * 100)}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground">{dim.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Verdict */}
          {critiqueData.verdict && (
            <div className="space-y-1.5">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Ringkasan Analisis AI
              </h4>
              <div className="p-3.5 rounded-xl bg-muted/30 border border-border/60 text-xs text-foreground leading-relaxed italic">
                "{critiqueData.verdict}"
              </div>
            </div>
          )}

          {/* Strengths & Improvements */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {critiqueData.strengths && critiqueData.strengths.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <Check className="size-3.5" /> Kelebihan Desain
                </h4>
                <ul className="space-y-1 text-xs text-muted-foreground">
                  {critiqueData.strengths.map((str, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="size-1 rounded-full bg-emerald-500 mt-2 shrink-0" />
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {critiqueData.improvements && critiqueData.improvements.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                  <TrendingUp className="size-3.5" /> Saran Peningkatan
                </h4>
                <ul className="space-y-1 text-xs text-muted-foreground">
                  {critiqueData.improvements.map((imp, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="size-1 rounded-full bg-amber-500 mt-2 shrink-0" />
                      <span>{imp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Footer Metadata */}
          {critiqueData.critiqued_at && (
            <div className="flex items-center justify-between pt-2 border-t border-border/60 text-[11px] text-muted-foreground">
              <span>Sumber: {critiqueData.scored_by === "vision_ai" ? "Vision AI Real-time" : "Seed Baseline"}</span>
              <span>{new Date(critiqueData.critiqued_at).toLocaleDateString("id-ID")}</span>
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="px-6 py-3 border-t border-border/80 flex items-center justify-between bg-muted/10">
          <div className="flex items-center gap-2">
            {onReCritique && (
              <button
                type="button"
                onClick={onReCritique}
                disabled={isCritiquing}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-primary/10 hover:bg-primary/20 text-primary border border-primary/25 transition-all cursor-pointer disabled:opacity-50"
              >
                {isCritiquing ? <Loader2 className="size-3.5 animate-spin" /> : <SparkleIcon className="size-3.5 text-primary" />}
                <span>Nilai Ulang</span>
              </button>
            )}

            {onToggleHide && (
              <button
                type="button"
                onClick={onToggleHide}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-all cursor-pointer"
              >
                <EyeOff className="size-3.5" />
                <span>{isHidden ? "Tampilkan Varian" : "Sembunyikan"}</span>
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-all cursor-pointer shadow-xs"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

