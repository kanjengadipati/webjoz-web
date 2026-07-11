"use client";
import React from "react";
import type { FooterVariantProps } from "./types";
import { SocialIcon, SOCIAL_PLATFORMS } from "../social-platforms";

const FOOTER_BG = "var(--dt-surface)";
const TXT_HIGH = "color-mix(in srgb, var(--dt-text) 90%, transparent)";
const TXT_MED = "color-mix(in srgb, var(--dt-text) 50%, transparent)";
const TXT_LOW = "color-mix(in srgb, var(--dt-text) 40%, transparent)";
const TXT_BASE = "color-mix(in srgb, var(--dt-text) 65%, transparent)";
const TXT_SOCIAL = "color-mix(in srgb, var(--dt-text) 60%, transparent)";
const TXT_SOCIAL_HOVER = "color-mix(in srgb, var(--dt-text) 90%, transparent)";
const BORDER_LIGHT = "var(--dt-border)";

export default function ColumnsWithSocial({ footer, brand_name, hasBlog }: FooterVariantProps) {
  const displayBrand = brand_name || "Bisnis Kami";
  const displayTagline = footer?.tagline || "";
  const links = footer?.social_links ?? [];

  return (
    <footer
      className="py-10 px-6 text-xs"
      style={{ background: FOOTER_BG, color: TXT_BASE, borderTop: `1px solid ${BORDER_LIGHT}` }}
    >
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-2">
          <p className="text-sm font-bold" style={{ color: TXT_HIGH }}>{displayBrand}</p>
          {displayTagline && <p style={{ color: TXT_MED }}>{displayTagline}</p>}
          {hasBlog && (
            <a href="#blog" className="block text-xs transition-colors hover:opacity-80" style={{ color: TXT_HIGH }}>
              Blog
            </a>
          )}
        </div>

        {links.length > 0 && (
          <div className="space-y-2">
            <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: TXT_LOW }}>
              Media Sosial
            </p>
            <div className="flex flex-wrap gap-3">
              {links.map((link, i) => {
                const def = SOCIAL_PLATFORMS[link.platform];
                const label = def?.label || link.platform;
                return (
                  <a
                    key={i}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 transition-colors"
                    style={{ color: TXT_SOCIAL }}
                    onMouseEnter={(e) => e.currentTarget.style.color = TXT_SOCIAL_HOVER}
                    onMouseLeave={(e) => e.currentTarget.style.color = TXT_SOCIAL}
                    title={label}
                  >
                    <SocialIcon platform={link.platform} size={14} />
                    <span>{label}</span>
                  </a>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 pt-4 text-center" style={{ color: TXT_LOW, borderTop: `1px solid ${BORDER_LIGHT}` }}>
        {footer?.copyright_text || `© ${new Date().getFullYear()} ${displayBrand}. All rights reserved.`}
      </div>
    </footer>
  );
}
