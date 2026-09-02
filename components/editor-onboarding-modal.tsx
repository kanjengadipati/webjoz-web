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

const STORAGE_KEY = "webjoz_editor_onboarding_v4";

// ─── Config ──────────────────────────────────────────────────────────────────

const TIPS = [
  {
    icon: MousePointerClick,
    color: "text-cyan-400",
    iconBg: "bg-cyan-500/15 border-cyan-500/30",
    cardBorder: "border-cyan-500/30",
    arrowColor: "bg-[#0e1420] border-cyan-500/30",
    badge: "Klik & Ketik",
    title: "Klik teks langsung untuk mengedit",
    desc: "Cukup klik teks apa saja (judul, harga, deskripsi) dan langsung mengetik seperti dokumen biasa.",
  },
  {
    icon: ImageIcon,
    color: "text-pink-400",
    iconBg: "bg-pink-500/15 border-pink-500/30",
    cardBorder: "border-pink-500/30",
    arrowColor: "bg-[#0e1420] border-pink-500/30",
    badge: "Ganti Foto",
    title: "Hover gambar → klik Ganti Foto",
    desc: "Arahkan kursor ke gambar mana saja, lalu klik tombol 'Ganti Foto' di pojok kanan atas untuk unggah foto baru.",
  },
  {
    icon: SlidersHorizontal,
    color: "text-amber-400",
    iconBg: "bg-amber-500/15 border-amber-500/30",
    cardBorder: "border-amber-500/30",
    arrowColor: "bg-[#0e1420] border-amber-500/30",
    badge: "Variasi Layout",
    title: "Pilih tampilan section di sini",
    desc: "Ganti variasi tampilan (Grid, Masonry, Bento, dll) serta tema dan warna dari panel desain.",
  },
  {
    icon: CheckCircle2,
    color: "text-emerald-400",
    iconBg: "bg-emerald-500/15 border-emerald-500/30",
    cardBorder: "border-emerald-500/30",
    arrowColor: "bg-[#0e1420] border-emerald-500/30",
    badge: "Autosave",
    title: "Setiap perubahan tersimpan otomatis",
    desc: "Anda tidak perlu repot klik simpan. Setiap ketikan otomatis tersimpan dan siap dipublikasikan.",
  },
] as const;

interface TooltipPos {
  top: number;
  left: number;
  arrowSide: "top" | "bottom" | "left" | "right" | "none";
  arrowOffset: number; // px from edge
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

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onStepChange?: (step: number) => void;
}

export default function EditorOnboardingModal({ isOpen, onClose, onStepChange }: Props) {
  const [step, setStep] = useState(0);
  const [pos, setPos] = useState<TooltipPos | null>(null);
  const [visible, setVisible] = useState(false);

  const tip = TIPS[step];
  const TipIcon = tip.icon;
  const isLast = step === TIPS.length - 1;

  // Calculate accurate tooltip position and arrow direction based on target element
  const calcPos = useCallback((tipIdx: number): TooltipPos | null => {
    if (typeof document === "undefined") return null;

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const W = 280;
    const H = 145; // estimated tooltip height
    const GAP = 12;

    let el: HTMLElement | null = null;

    if (tipIdx === 0) {
      // 1. Text edit: find visible editable text element in canvas preview
      const preview = document.getElementById("preview-scroll-container");
      if (preview) {
        const texts = Array.from(
          preview.querySelectorAll<HTMLElement>('[contenteditable="true"], h1, h2, h3')
        );
        el = texts.find((item) => {
          const r = item.getBoundingClientRect();
          return r.width > 20 && r.height > 10 && r.top >= 50 && r.bottom <= vh - 50;
        }) || texts[0] || null;
      }
    } else if (tipIdx === 1) {
      // 2. Image edit: find visible image in canvas preview
      const preview = document.getElementById("preview-scroll-container");
      if (preview) {
        const imgs = Array.from(
          preview.querySelectorAll<HTMLElement>('.group\\/inline-img, [data-inline-image], img')
        );
        el = imgs.find((item) => {
          const r = item.getBoundingClientRect();
          return r.width > 40 && r.height > 40 && r.top >= 50 && r.bottom <= vh - 50;
        }) || imgs[0] || null;
      }
    } else if (tipIdx === 2) {
      // 3. Variant picker in drawer
      const vp = document.querySelector<HTMLElement>('[data-edu="variant-picker"]');
      if (vp) {
        const r = vp.getBoundingClientRect();
        if (r.width > 0 && r.left >= 0 && r.right <= vw) {
          el = vp;
        }
      }
      if (!el) {
        el = document.querySelector<HTMLElement>('[data-desktop-drawer]') || null;
      }
    } else if (tipIdx === 3) {
      // 4. Autosave indicator
      el = document.querySelector<HTMLElement>('[data-edu="autosave"]');
    }

    if (!el) {
      // Fallback
      return {
        top: vh - H - 32,
        left: vw - W - 32,
        arrowSide: "none",
        arrowOffset: 0,
        maxWidth: W,
      };
    }

    const rect = el.getBoundingClientRect();
    let top = 0;
    let left = 0;
    let arrowSide: TooltipPos["arrowSide"] = "bottom";
    let arrowOffset = 24;

    if (tipIdx === 0) {
      // Tip 0: Text editing
      // If text is in top half of screen: place BELOW text, arrow on TOP pointing UP at the text!
      // If text is in lower half: place ABOVE text, arrow on BOTTOM pointing DOWN at the text!
      const canPlaceBelow = rect.bottom + H + GAP <= vh - 20;
      const canPlaceAbove = rect.top - H - GAP >= 50;

      if (canPlaceAbove && rect.top > vh * 0.45) {
        top = rect.top - H - GAP;
        arrowSide = "bottom"; // Arrow at bottom pointing DOWN at text
      } else if (canPlaceBelow) {
        top = rect.bottom + GAP;
        arrowSide = "top"; // Arrow at top pointing UP at text
      } else {
        top = Math.max(50, rect.top - H - GAP);
        arrowSide = "bottom";
      }

      left = rect.left + rect.width / 2 - W / 2;
      left = Math.max(16, Math.min(left, vw - W - 16));
      arrowOffset = Math.min(Math.max(rect.left + rect.width / 2 - left - 6, 20), W - 32);

    } else if (tipIdx === 1) {
      // Tip 1: Ganti foto
      // Point directly at the "Ganti Foto" button area at top-right of image (rect.right - 24, rect.top + 24)
      const targetX = rect.right - 24;
      const canPlaceAbove = rect.top - H - GAP >= 50;
      const canPlaceBelow = rect.bottom + H + GAP <= vh - 20;

      if (canPlaceAbove) {
        // Place ABOVE image: arrow at BOTTOM pointing DOWN directly at the Ganti Foto button
        top = rect.top - H - GAP;
        left = targetX - W + 40;
        left = Math.max(16, Math.min(left, vw - W - 16));
        arrowSide = "bottom"; // Arrow on bottom pointing DOWN at Ganti Foto button
        arrowOffset = Math.min(Math.max(targetX - left - 6, 20), W - 32);
      } else if (canPlaceBelow) {
        // Place BELOW image: arrow at TOP pointing UP directly at the image
        top = rect.bottom + GAP;
        left = targetX - W + 40;
        left = Math.max(16, Math.min(left, vw - W - 16));
        arrowSide = "top"; // Arrow on top pointing UP at image
        arrowOffset = Math.min(Math.max(targetX - left - 6, 20), W - 32);
      } else {
        // Fallback beside image
        top = Math.max(50, rect.top);
        left = Math.max(16, rect.left - W - GAP);
        arrowSide = "right"; // Arrow on right pointing RIGHT at image
        arrowOffset = 24;
      }

    } else if (tipIdx === 2) {
      // Tip 2: Variant picker
      // If variant picker is open in drawer: place to the RIGHT of drawer, arrow on LEFT pointing LEFT at picker
      if (rect.left >= 0 && rect.width > 0) {
        left = rect.right + GAP;
        top = rect.top + rect.height / 2 - H / 2;
        top = Math.max(50, Math.min(top, vh - H - 20));
        arrowSide = "left"; // Arrow on left of tooltip points LEFT at the variant picker
        arrowOffset = Math.min(Math.max(rect.top + rect.height / 2 - top - 6, 16), H - 28);
      } else {
        // Drawer handle on left edge
        left = 48;
        top = vh / 2 - H / 2;
        arrowSide = "left";
        arrowOffset = H / 2 - 6;
      }

    } else if (tipIdx === 3) {
      // Tip 3: Autosave indicator in topbar
      top = rect.bottom + GAP;
      left = rect.left + rect.width / 2 - W / 2;
      left = Math.max(16, Math.min(left, vw - W - 16));
      arrowSide = "top"; // Arrow on top pointing UP at autosave icon
      arrowOffset = Math.min(Math.max(rect.left + rect.width / 2 - left - 6, 20), W - 32);
    }

    return { top, left, arrowSide, arrowOffset, maxWidth: W };
  }, []);

  // Fade out → advance → recalc → fade in
  const goTo = useCallback((idx: number) => {
    setVisible(false);
    onStepChange?.(idx);
    setTimeout(() => {
      setStep(idx);
      const newPos = calcPos(idx);
      setPos(newPos);
      setTimeout(() => setVisible(true), 30);
    }, 180);
  }, [calcPos, onStepChange]);

  const dismiss = useCallback(() => {
    setVisible(false);
    setTimeout(onClose, 200);
  }, [onClose]);

  const next = () => isLast ? dismiss() : goTo(step + 1);

  // Init on open
  useEffect(() => {
    if (!isOpen) { setVisible(false); return; }
    setStep(0);
    onStepChange?.(0);
    const newPos = calcPos(0);
    setPos(newPos);
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, [isOpen, calcPos, onStepChange]);

  // Recalc on resize
  useEffect(() => {
    if (!isOpen) return;
    const handler = () => setPos(calcPos(step));
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, [isOpen, step, calcPos]);

  if (!isOpen || !pos) return null;

  const arrowBase = "absolute w-3.5 h-3.5 border rotate-45 pointer-events-none";

  return (
    <div
      className="fixed inset-0 z-[300] pointer-events-none"
      aria-hidden="true"
    >
      {/* Tooltip card */}
      <div
        className={`absolute pointer-events-auto transition-all duration-200 ${visible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
        style={{ top: pos.top, left: pos.left, width: pos.maxWidth }}
      >
        <div className={`relative bg-[#0e1420] border ${tip.cardBorder} rounded-2xl p-4 shadow-[0_16px_40px_rgba(0,0,0,0.7)]`}>

          {/* Arrow pointing UP (when tooltip is below target) */}
          {pos.arrowSide === "top" && (
            <div
              className={`${arrowBase} ${tip.arrowColor} border-r-0 border-b-0 -top-[8px]`}
              style={{ left: pos.arrowOffset }}
            />
          )}

          {/* Arrow pointing DOWN (when tooltip is above target) */}
          {pos.arrowSide === "bottom" && (
            <div
              className={`${arrowBase} ${tip.arrowColor} border-l-0 border-t-0 -bottom-[8px]`}
              style={{ left: pos.arrowOffset }}
            />
          )}

          {/* Arrow pointing LEFT (when tooltip is to the right of target) */}
          {pos.arrowSide === "left" && (
            <div
              className={`${arrowBase} ${tip.arrowColor} border-t-0 border-r-0 -left-[8px]`}
              style={{ top: pos.arrowOffset }}
            />
          )}

          {/* Arrow pointing RIGHT (when tooltip is to the left of target) */}
          {pos.arrowSide === "right" && (
            <div
              className={`${arrowBase} ${tip.arrowColor} border-b-0 border-l-0 -right-[8px]`}
              style={{ top: pos.arrowOffset }}
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
