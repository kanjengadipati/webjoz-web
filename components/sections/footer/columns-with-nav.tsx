"use client";
import React from "react";
import { ArrowUp } from "lucide-react";
import type { FooterVariantProps } from "./types";
import { SocialIcon, SOCIAL_PLATFORMS } from "../social-platforms";
import { InlineText } from "../../templates/shared";

const FOOTER_BG = "var(--dt-surface)";
const TXT_HIGH = "color-mix(in srgb, var(--dt-text) 95%, transparent)";
const TXT_MED = "color-mix(in srgb, var(--dt-text) 60%, transparent)";
const TXT_LOW = "color-mix(in srgb, var(--dt-text) 40%, transparent)";
const TXT_LINK = "color-mix(in srgb, var(--dt-text) 70%, transparent)";
const BORDER_LIGHT = "color-mix(in srgb, var(--dt-primary) 12%, transparent)";

export default function ColumnsWithNav({
  footer,
  brand_name,
  hasBlog,
  onUpdateField,
  isEditorMode = false,
  isSelected = false,
  collapseSheetForInlineEdit,
  onEditingStateChange,
}: FooterVariantProps) {
  const displayBrand = brand_name || "Bisnis Kami";
  const displayTagline = footer?.tagline || "";
  const displayCopyright = footer?.copyright_text || `© ${new Date().getFullYear()} ${displayBrand}. All rights reserved.`;
  const links = footer?.social_links ?? [];

  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer
      className="py-12 px-6 text-xs"
      style={{
        background: `linear-gradient(180deg, color-mix(in srgb, var(--dt-surface) 95%, var(--dt-bg)) 0%, var(--dt-surface) 100%)`,
        borderTop: `1px solid ${BORDER_LIGHT}`,
      }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Kolom 1: Brand & Tagline */}
          <div className="md:col-span-2 space-y-3">
            <p className="text-base font-bold tracking-tight" style={{ color: TXT_HIGH, fontFamily: "var(--dt-heading-font)" }}>
              {displayBrand}
            </p>
            {(displayTagline || isEditorMode) && (
              <p className="text-xs leading-relaxed max-w-sm" style={{ color: TXT_MED }}>
                {isEditorMode ? (
                  <InlineText
                    section="footer"
                    fieldKey="tagline"
                    value={displayTagline}
                    placeholder="Tambah tagline..."
                    onUpdateField={onUpdateField}
                    isEditorMode={isEditorMode}
                    isSelected={isSelected}
                    collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                    onEditingStateChange={onEditingStateChange}
                    as="span"
                  />
                ) : (
                  displayTagline
                )}
              </p>
            )}
          </div>

          {/* Kolom 2: Navigasi Cepat (Quick Links) */}
          <div className="space-y-3">
            <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--dt-primary)" }}>
              Navigasi
            </p>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#hero" className="transition-colors hover:text-[var(--dt-text)]" style={{ color: TXT_LINK }}>
                  Beranda
                </a>
              </li>
              <li>
                <a href="#about" className="transition-colors hover:text-[var(--dt-text)]" style={{ color: TXT_LINK }}>
                  Tentang Kami
                </a>
              </li>
              <li>
                <a href="#benefits" className="transition-colors hover:text-[var(--dt-text)]" style={{ color: TXT_LINK }}>
                  Keunggulan
                </a>
              </li>
              <li>
                <a href="#faq" className="transition-colors hover:text-[var(--dt-text)]" style={{ color: TXT_LINK }}>
                  Tanya Jawab (FAQ)
                </a>
              </li>
              {hasBlog && (
                <li>
                  <a href="#blog" className="transition-colors hover:text-[var(--dt-text)]" style={{ color: TXT_LINK }}>
                    Blog & Berita
                  </a>
                </li>
              )}
            </ul>
          </div>

          {/* Kolom 3: Media Sosial & Back to Top */}
          <div className="space-y-4">
            {links.length > 0 && (
              <div className="space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--dt-primary)" }}>
                  Media Sosial
                </p>
                <div className="flex flex-wrap gap-2.5">
                  {links.map((link, i) => {
                    const def = SOCIAL_PLATFORMS[link.platform];
                    const label = def?.label || link.platform;
                    return (
                      <a
                        key={i}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[var(--dt-radius)] border border-white/10 bg-white/[0.03] transition-all hover:bg-white/[0.08] hover:border-border"
                        style={{ color: TXT_HIGH }}
                        title={label}
                      >
                        <SocialIcon platform={link.platform} size={13} />
                        <span className="text-[11px]">{label}</span>
                      </a>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Back to top button */}
            <div>
              <button
                type="button"
                onClick={scrollToTop}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/15 bg-white/[0.04] text-[11px] font-medium transition-all hover:bg-white/[0.1] hover:border-border cursor-pointer"
                style={{ color: TXT_HIGH }}
              >
                <ArrowUp className="w-3.5 h-3.5" />
                <span>Kembali ke Atas</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom copyright row */}
        <div
          className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left text-[11px]"
          style={{ borderTop: `1px solid ${BORDER_LIGHT}`, color: TXT_LOW }}
        >
          <p>
            {isEditorMode ? (
              <InlineText
                section="footer"
                fieldKey="copyright_text"
                value={displayCopyright}
                onUpdateField={onUpdateField}
                isEditorMode={isEditorMode}
                isSelected={isSelected}
                collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                onEditingStateChange={onEditingStateChange}
                as="span"
              />
            ) : (
              displayCopyright
            )}
          </p>
        </div>
      </div>
    </footer>
  );
}
