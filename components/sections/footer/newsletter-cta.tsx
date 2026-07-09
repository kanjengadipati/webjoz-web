"use client";
import React from "react";
import type { FooterVariantProps } from "./types";

const FOOTER_BG = "color-mix(in srgb, var(--dt-bg) 92%, black)";
const TXT_HIGH = "color-mix(in srgb, var(--dt-text) 90%, transparent)";
const TXT_MED = "color-mix(in srgb, var(--dt-text) 50%, transparent)";
const TXT_LOW = "color-mix(in srgb, var(--dt-text) 40%, transparent)";
const TXT_BASE = "color-mix(in srgb, var(--dt-text) 65%, transparent)";

export default function NewsletterCta({ footer, brand_name }: FooterVariantProps) {
  const displayBrand = brand_name || "Bisnis Kami";
  const displayTagline = footer?.tagline || "";

  return (
    <footer
      className="py-12 px-6 text-center text-xs"
      style={{ background: FOOTER_BG, color: TXT_BASE }}
    >
      <div className="max-w-lg mx-auto space-y-4">
        <p className="text-lg font-bold" style={{ color: TXT_HIGH }}>{displayBrand}</p>
        {displayTagline && <p className="text-sm" style={{ color: TXT_MED }}>{displayTagline}</p>}

        <div className="pt-2">
          <a
            href="#contact"
            className="inline-block px-6 py-2.5 bg-[var(--dt-primary)] rounded-[var(--dt-radius)] text-sm font-semibold hover:opacity-85 transition-all"
            style={{ color: "var(--dt-primary-foreground)" }}
          >
            Hubungi Kami
          </a>
        </div>

        <p className="pt-4" style={{ color: TXT_LOW }}>
          {footer?.copyright_text || `© ${new Date().getFullYear()} ${displayBrand}. All rights reserved.`}
        </p>
      </div>
    </footer>
  );
}
