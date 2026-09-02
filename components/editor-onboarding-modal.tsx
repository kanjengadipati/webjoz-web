"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, MousePointerClick, Image as ImageIcon, SlidersHorizontal, CheckCircle2, X, HelpCircle, ArrowRight } from "lucide-react";
import { SparkleGenAI } from "./sparkle-icon";

interface EditorOnboardingModalProps {
  isOpen: boolean;
  onClose: (dontShowAgain?: boolean) => void;
}

const STORAGE_KEY = "webjoz_editor_onboarding_v1";

export function useEditorOnboarding() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      const seen = localStorage.getItem(STORAGE_KEY);
      if (!seen) {
        // Small delay so the page loads first before welcoming the user
        const timer = setTimeout(() => {
          setIsOpen(true);
        }, 700);
        return () => clearTimeout(timer);
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  const openGuide = () => setIsOpen(true);

  const handleClose = (dontShowAgain: boolean = true) => {
    setIsOpen(false);
    if (dontShowAgain) {
      try {
        localStorage.setItem(STORAGE_KEY, "true");
      } catch {
        // ignore
      }
    }
  };

  return { isOpen, openGuide, handleClose };
}

export default function EditorOnboardingModal({ isOpen, onClose }: EditorOnboardingModalProps) {
  const [dontShowAgain, setDontShowAgain] = useState(true);

  if (!isOpen) return null;

  const steps = [
    {
      icon: MousePointerClick,
      color: "from-blue-500/20 to-cyan-500/20 text-cyan-400 border-cyan-500/30",
      badge: "Klik & Ketik",
      title: "Edit Teks Langsung di Website",
      desc: "Cukup klik teks apa saja (judul, harga, deskripsi, kontak) di tampilan website untuk mulai mengetik langsung.",
    },
    {
      icon: ImageIcon,
      color: "from-purple-500/20 to-pink-500/20 text-pink-400 border-pink-500/30",
      badge: "Ganti Foto",
      title: "Upload & Ubah Gambar",
      desc: "Arahkan kursor atau klik tombol 'Ganti Foto' di pojok kanan atas gambar untuk langsung mengunggah foto baru.",
    },
    {
      icon: SlidersHorizontal,
      color: "from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30",
      badge: "Drawer Desain",
      title: "Variasi Layout & Tema",
      desc: "Buka panel drawer di samping untuk mengganti variasi tampilan section (Grid, Masonry, Bento), palet warna, dan font.",
    },
    {
      icon: CheckCircle2,
      color: "from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30",
      badge: "Autosave",
      title: "Semua Tersimpan Otomatis",
      desc: "Setiap ketikan dan perubahan tersimpan secara instan dan aman. Website siap dipublikasikan kapan saja.",
    },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div 
        className="relative w-full max-w-2xl rounded-3xl border border-white/15 bg-gradient-to-b from-[#121620] to-[#0a0d14] p-6 sm:p-8 shadow-2xl text-slate-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow ambient background */}
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-cyan-500/15 rounded-full blur-[100px] pointer-events-none" />

        {/* Close Button */}
        <button
          type="button"
          onClick={() => onClose(dontShowAgain)}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          aria-label="Tutup panduan"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center max-w-lg mx-auto mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/15 border border-primary/30 text-primary text-xs font-bold uppercase tracking-widest mb-3">
            <SparkleGenAI className="w-4 h-4" />
            <span>Selamat Datang di Editor Webjoz</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            Cara Mudah Mengedit Website Anda
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1.5 leading-relaxed">
            Kini Anda bisa mengedit tampilan dan teks website secara instan layaknya dokumen biasa.
          </p>
        </div>

        {/* 4 Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-6 sm:mb-8">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="relative rounded-2xl border border-white/10 bg-white/[0.03] p-4 hover:border-white/20 hover:bg-white/[0.05] transition-all flex flex-col justify-between"
              >
                <div className="flex items-start gap-3 mb-2">
                  <div className={`p-2.5 rounded-xl border bg-gradient-to-br ${step.color} shrink-0`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block mb-0.5">
                      {step.badge}
                    </span>
                    <h3 className="text-sm font-bold text-slate-100 leading-snug">
                      {step.title}
                    </h3>
                  </div>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed pl-1">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Footer actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
          <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              className="w-4 h-4 rounded border-white/20 bg-white/10 text-primary focus:ring-primary/40 cursor-pointer"
            />
            <span>Jangan tampilkan panduan ini lagi</span>
          </label>

          <button
            type="button"
            onClick={() => onClose(dontShowAgain)}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs sm:text-sm shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Mulai Mengedit Sekarang</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
