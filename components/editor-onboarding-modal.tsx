"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  MousePointerClick,
  Image as ImageIcon,
  SlidersHorizontal,
  CheckCircle2,
  X,
  ChevronRight,
} from "lucide-react";
import { SparkleGenAI } from "./sparkle-icon";

const STORAGE_KEY = "webjoz_editor_onboarding_v3";

// ─── Config ──────────────────────────────────────────────────────────────────

const TIPS = [
  {
    // data-edu="canvas": the preview canvas on the right
    target: "canvas",
    // Preferred placement: tooltip appears inside the canvas at the top-left,
    // with an arrow that points DOWN toward the text content below.
    placement: "inside-top-left" as const,
    icon: MousePointerClick,
    color: "text-cyan-400",
    iconBg: "bg-cyan-500/15 border-cyan-500/30",
    cardBorder: "border-cyan-500/30",
    arrowColor: "bg-[#0e1420] border-cyan-500/30",
    badge: "Klik & Ketik",
    title: "Klik teks langsung untuk mengedit",
    desc: "Cukup klik teks apa saja — judul, harga, deskripsi — dan langsung mengetik.",
  },
  {
    // data-edu="canvas": still the canvas but pointing toward upper-center (where hero images are)
    target: "canvas",
    placement: "inside-top-center" as const,
    icon: ImageIcon,
    color: "text-pink-400",
    iconBg: "bg-pink-500/15 border-pink-500/30",
    cardBorder: "border-pink-500/30",
    arrowColor: "bg-[#0e1420] border-pink-500/30",
    badge: "Ganti Foto",
    title: "Hover gambar → klik Ganti Foto",
    desc: "Arahkan kursor ke gambar mana saja, lalu klik tombol 'Ganti Foto' yang muncul di pojok kanan atas.",
  },
  {
    // data-edu="variant-picker": the variant dropdown in the sidebar
    target: "variant-picker",
    placement: "below" as const,
    icon: SlidersHorizontal,
    color: "text-amber-400",
    iconBg: "bg-amber-500/15 border-amber-500/30",
    cardBorder: "border-amber-500/30",
    arrowColor: "bg-[#0e1420] border-amber-500/30",
    badge: "Variasi Layout",
    title: "Pilih tampilan section di sini",
    desc: "Ganti antara varian Grid, Masonry, Bento, dll sesuai selera.",
  },
  {
    // data-edu="publish-btn" or "autosave": the autosave/publish area
    target: "autosave",
    placement: "below" as const,
    icon: CheckCircle2,
    color: "text-emerald-400",
    iconBg: "bg-emerald-500/15 border-emerald-500/30",
    cardBorder: "border-emerald-500/30",
    arrowColor: "bg-[#0e1420] border-emerald-500/30",
    badge: "Autosave",
    title: "Setiap perubahan tersimpan otomatis",
    desc: "Anda tidak perlu klik simpan. Publish kapan saja saat sudah siap.",
  },
] as const;

type Placement = "inside-top-left" | "inside-top-center" | "below";

interface TooltipPos {
  top: number;
  left: number;
  arrowSide: "top" | "bottom" | "left" | "right";
  arrowOffset: number; // px from the near edge of the tooltip box
  maxWidth: number;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useEditorOnboarding() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) {
        const t = setTimeout(() => setIsOpen(true), 900);
        return () => clearTimeout(t);
      }
    } catch { /* ignore */ }
  }, []);

  const openGuide = () => setIsOpen(true);

  const handleClose = () => {
    setIsOpen(false);
    try { localStorage.setItem(STORAGE_KEY, "1"); } catch { /* ignore */ }
  };

  return { isOpen, openGuide, handleClose };
}

// ─── Main component ────────────────────────────────────────────────────────────

interface Props { isOpen: boolean; onClose: () => void; }

export default function EditorOnboardingModal({ isOpen, onClose }: Props) {
  const [step, setStep] = useState(0);
  const [pos, setPos] = useState<TooltipPos | null>(null);
  const [visible, setVisible] = useState(false);

  const tip = TIPS[step];
  const TipIcon = tip.icon;
  const isLast = step === TIPS.length - 1;

  // Calculate tooltip position from target element
  const calcPos = useCallback((tipIdx: number): TooltipPos | null => {
    if (typeof document === "undefined") return null;
    const t = TIPS[tipIdx];
    const el = document.querySelector<HTMLElement>(`[data-edu="${t.target}"]`);
    if (!el) return null;

    const rect = el.getBoundingClientRect();
    const GAP = 10; // px between element and tooltip
    const W = 256; // tooltip width
    const vw = window.innerWidth;

    let top = 0, left = 0;
    let arrowSide: TooltipPos["arrowSide"] = "top";
    let arrowOffset = 28;

    const placement = t.placement as Placement;

    if (placement === "inside-top-left") {
      // Place inside canvas, top-left area with padding
      top = rect.top + 16;
      left = rect.left + 16;
      arrowSide = "top";
      arrowOffset = 24;
    } else if (placement === "inside-top-center") {
      // Center of canvas, slightly offset
      top = rect.top + 16;
      left = rect.left + rect.width / 2 - W / 2;
      arrowSide = "top";
      arrowOffset = W / 2 - 12;
    } else if (placement === "below") {
      // Below the target element, centered horizontally over it
      top = rect.bottom + GAP;
      left = rect.left + rect.width / 2 - W / 2;
      arrowSide = "top"; // arrow points UP from tooltip (back to element above)
      arrowOffset = Math.min(Math.max(rect.left + rect.width / 2 - left, 16), W - 32);
    }

    // Clamp to viewport
    left = Math.max(8, Math.min(left, vw - W - 8));

    return { top, left, arrowSide, arrowOffset, maxWidth: W };
  }, []);

  // Fade out → advance → recalc → fade in
  const goTo = useCallback((idx: number) => {
    setVisible(false);
    setTimeout(() => {
      setStep(idx);
      const newPos = calcPos(idx);
      setPos(newPos);
      setTimeout(() => setVisible(true), 30);
    }, 180);
  }, [calcPos]);

  const dismiss = useCallback(() => {
    setVisible(false);
    setTimeout(onClose, 200);
  }, [onClose]);

  const next = () => isLast ? dismiss() : goTo(step + 1);

  // Init on open
  useEffect(() => {
    if (!isOpen) { setVisible(false); return; }
    setStep(0);
    const newPos = calcPos(0);
    setPos(newPos);
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, [isOpen, calcPos]);

  // Recalc on resize
  useEffect(() => {
    if (!isOpen) return;
    const handler = () => setPos(calcPos(step));
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, [isOpen, step, calcPos]);

  if (!isOpen || !pos) return null;

  const arrowBase = "absolute w-3 h-3 border rotate-45";

  return (
    <div
      className="fixed inset-0 z-[300] pointer-events-none"
      aria-hidden="true"
    >
      {/* Subtle canvas highlight for inside-canvas tips */}
      {(tip.placement === "inside-top-left" || tip.placement === "inside-top-center") && (() => {
        const el = typeof document !== "undefined"
          ? document.querySelector<HTMLElement>(`[data-edu="${tip.target}"]`)
          : null;
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse 60% 50% at ${r.left + r.width / 2}px ${r.top + 120}px, rgba(14,200,240,0.05) 0%, transparent 70%)`,
            }}
          />
        );
      })()}

      {/* Tooltip card */}
      <div
        className={`absolute pointer-events-auto transition-all duration-200 ${visible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
        style={{ top: pos.top, left: pos.left, width: pos.maxWidth }}
      >
        <div className={`relative bg-[#0e1420] border ${tip.cardBorder} rounded-2xl p-4 shadow-[0_16px_40px_rgba(0,0,0,0.7)]`}>

          {/* Arrow — points BACK toward the target element */}
          {pos.arrowSide === "top" && (
            <div
              className={`${arrowBase} ${tip.arrowColor} border-r-0 border-b-0 -top-[7px]`}
              style={{ left: pos.arrowOffset }}
            />
          )}
          {pos.arrowSide === "bottom" && (
            <div
              className={`${arrowBase} ${tip.arrowColor} border-l-0 border-t-0 -bottom-[7px]`}
              style={{ left: pos.arrowOffset }}
            />
          )}

          {/* Close */}
          <button
            type="button"
            onClick={dismiss}
            className="absolute top-2.5 right-2.5 p-0.5 rounded text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>

          {/* Content */}
          <div className="flex items-start gap-3 pr-5">
            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border ${tip.iconBg}`}>
              <TipIcon className={`w-4 h-4 ${tip.color}`} />
            </div>
            <div className="min-w-0">
              <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-500 block">
                {tip.badge} · {step + 1}/{TIPS.length}
              </span>
              <p className="text-[13px] font-bold text-slate-100 leading-snug mt-0.5">{tip.title}</p>
              <p className="text-[11px] text-slate-400 leading-snug mt-1">{tip.desc}</p>
            </div>
          </div>

          {/* Progress + Next */}
          <div className="flex items-center justify-between mt-3.5 pt-3 border-t border-white/[0.07]">
            <div className="flex items-center gap-1.5">
              {TIPS.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => goTo(i)}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    i === step
                      ? `w-4 ${tip.color.replace("text-", "bg-")}`
                      : "w-1.5 bg-white/20 hover:bg-white/40"
                  }`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={next}
              className={`flex items-center gap-1 text-[11px] font-bold px-3 py-1.5 rounded-xl cursor-pointer transition-all active:scale-95 ${
                isLast
                  ? "bg-primary text-primary-foreground shadow-[0_4px_12px_color-mix(in_srgb,var(--primary)_35%,transparent)] hover:brightness-110"
                  : "border border-white/15 text-slate-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              {isLast ? (
                <><SparkleGenAI className="w-3.5 h-3.5" /> Mulai Edit</>
              ) : (
                <>Selanjutnya <ChevronRight className="w-3.5 h-3.5" /></>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
