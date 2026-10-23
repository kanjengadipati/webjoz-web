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
  isSelected?: boolean;
  placeholder?: string;
  badgeLabel?: string;
}

export default function FontPicker({
  value,
  onChange,
  isSelected = false,
  placeholder = "Pilih Google Font lainnya...",
  badgeLabel = "Google Font",
}: FontPickerProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const displayLabel = isSelected ? value : placeholder;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center justify-between w-full px-3 py-2 rounded-xl border text-xs cursor-pointer transition-all ${
          isSelected
            ? "border-primary bg-primary/10 text-sidebar-foreground font-semibold ring-1 ring-primary/40"
            : "border-border/70 bg-sidebar hover:bg-sidebar-muted/60 text-sidebar-muted-foreground hover:text-sidebar-foreground"
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <span
            className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
              isSelected ? "border-primary bg-primary text-primary-foreground" : "border-border bg-sidebar"
            }`}
          >
            {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
          </span>
          <span
            className="truncate"
            style={{ fontFamily: isSelected ? value : undefined }}
          >
            {displayLabel}
          </span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0 ml-2">
          {isSelected && (
            <span className="text-[10px] text-primary/80 font-normal">
              {badgeLabel}
            </span>
          )}
          <ChevronDown className={`w-3.5 h-3.5 text-sidebar-subtle-foreground transition-transform ${open ? "rotate-180" : ""}`} />
        </div>
      </button>

      {open && (
        <div className="absolute z-50 top-full mt-1 left-0 right-0 bg-sidebar border border-border rounded-lg max-h-60 overflow-y-auto shadow-xl">
          {GOOGLE_FONTS_WHITELIST.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => {
                onChange(f);
                setOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-[13px] transition-colors hover:bg-sidebar-muted ${
                f === value ? "bg-primary/20 text-primary font-medium" : "text-sidebar-foreground"
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
