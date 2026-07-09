"use client";
import React from "react";
import type { FooterVariantProps } from "./types";
import { SocialIcon, SOCIAL_PLATFORMS } from "../social-platforms";

const DARK_BG = "color-mix(in srgb, var(--dt-text) 92%, black)";

export default function ColumnsWithSocial({ footer, brand_name }: FooterVariantProps) {
  const displayBrand = brand_name || "Bisnis Kami";
  const displayTagline = footer?.tagline || "";
  const links = footer?.social_links ?? [];

  return (
    <footer
      className="py-10 px-6 text-xs"
      style={{ background: DARK_BG, color: "rgba(255,255,255,0.65)" }}
    >
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-2">
          <p className="text-sm font-bold text-white/90">{displayBrand}</p>
          {displayTagline && <p className="text-white/50">{displayTagline}</p>}
        </div>

        {links.length > 0 && (
          <div className="space-y-2">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-white/40">
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
                    className="flex items-center gap-1.5 text-white/60 hover:text-white/90 transition-colors"
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

      <div className="mt-8 pt-4 text-center text-white/40 border-t border-white/10">
        {footer?.copyright_text || `© ${new Date().getFullYear()} ${displayBrand}. All rights reserved.`}
      </div>
    </footer>
  );
}
