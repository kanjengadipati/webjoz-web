"use client";
import React from "react";
import type { FooterVariantProps } from "./types";

const DARK_BG = "color-mix(in srgb, var(--dt-text) 92%, black)";

export default function NewsletterCta({ footer, brand_name }: FooterVariantProps) {
  const displayBrand = brand_name || "Bisnis Kami";
  const displayTagline = footer?.tagline || "";

  return (
    <footer
      className="py-12 px-6 text-center text-xs"
      style={{ background: DARK_BG, color: "rgba(255,255,255,0.65)" }}
    >
      <div className="max-w-lg mx-auto space-y-4">
        <p className="text-lg font-bold text-white/90">{displayBrand}</p>
        {displayTagline && <p className="text-white/50 text-sm">{displayTagline}</p>}

        <div className="pt-2">
          <a
            href="#contact"
            className="inline-block px-6 py-2.5 bg-[var(--dt-primary)] rounded-[var(--dt-radius)] text-sm font-semibold hover:opacity-85 transition-all"
            style={{ color: "var(--dt-primary-foreground)" }}
          >
            Hubungi Kami
          </a>
        </div>

        <p className="text-white/40 pt-4">
          {footer?.copyright_text || `© ${new Date().getFullYear()} ${displayBrand}. All rights reserved.`}
        </p>
      </div>
    </footer>
  );
}
