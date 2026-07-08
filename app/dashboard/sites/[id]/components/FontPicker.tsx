"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";

export const GOOGLE_FONTS_WHITELIST = [
  "Inter", "Roboto", "Open Sans", "Montserrat", "Lato",
  "Poppins", "Outfit", "Plus Jakarta Sans", "Work Sans", "DM Sans",
  "Playfair Display", "Merriweather", "Lora", "PT Serif",
  "Cinzel", "Cormorant Garamond", "Arvo",
  "Oswald", "Bebas Neue", "Space Grotesk",
  "Fraunces", "Bricolage Grotesque", "Sora", "Urbanist",
  "Schibsted Grotesk", "JetBrains Mono",
];

interface FontPickerProps {
  value: string;
  onChange: (v: string) => void;
}

export default function FontPicker({ value, onChange }: FontPickerProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-2 px-2.5 py-1.5 border border-white/10 bg-[#05070b] text-slate-100 rounded-md text-[13px] outline-none focus:border-primary/60"
        style={{ fontFamily: value }}
      >
        <span className="flex-1 text-left truncate">{value}</span>
        <ChevronDown className="w-3 h-3 shrink-0 text-slate-500" />
      </button>
      {open && (
        <div className="absolute z-50 top-full mt-1 left-0 right-0 bg-[#1a1d26] border border-white/10 rounded-lg max-h-60 overflow-y-auto shadow-xl">
          {GOOGLE_FONTS_WHITELIST.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => { onChange(f); setOpen(false); }}
              className={`w-full text-left px-3 py-2 text-[13px] transition-colors hover:bg-white/5 ${
                f === value ? "bg-primary/20 text-primary" : "text-slate-300"
              }`}
              style={{ fontFamily: f }}
            >
              {f}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
