"use client";
import React from "react";
import type { FooterVariantProps } from "./types";

const DARK_BG = "color-mix(in srgb, var(--dt-text) 92%, black)";

export default function MinimalBand({ footer, brand_name }: FooterVariantProps) {
  const displayBrand = brand_name || "Bisnis Kami";
  const displayTagline = footer?.tagline || "";
  return (
    <footer
      className="text-center py-10 text-xs space-y-1"
      style={{ background: DARK_BG, color: "rgba(255,255,255,0.65)" }}
    >
      <p className="text-sm font-bold text-white/90">{displayBrand}</p>
      {displayTagline && <p className="text-white/50">{displayTagline}</p>}
      <p className="text-white/40">
        {footer?.copyright_text || `© ${new Date().getFullYear()} ${displayBrand}. All rights reserved.`}
      </p>
    </footer>
  );
}
