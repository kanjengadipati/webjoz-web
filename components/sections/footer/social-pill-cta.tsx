"use client";

import React from "react";
import type { FooterVariantProps } from "./types";
import InlineSocialEditor from "./inline-social-editor";
import { InlineText, navCtaHref } from "../../templates/shared";
import { footerStrings } from "./footer-strings";
import { ArrowRight, Globe } from "lucide-react";

const FOOTER_BG = "var(--dt-surface)";
const TXT_HIGH = "color-mix(in srgb, var(--dt-text) 90%, transparent)";
const TXT_MED = "color-mix(in srgb, var(--dt-text) 60%, transparent)";
const TXT_LOW = "color-mix(in srgb, var(--dt-text) 45%, transparent)";
const BORDER_LIGHT = "var(--dt-border)";

/**
 * Social Pill CTA Footer
 *
 * Desain horizontal modern yang menyeimbangkan identitas brand di kiri,
 * barisan ikon media sosial interaktif di tengah, dan tombol aksi langsung di kanan.
 * Cocok untuk: kreator konten, bisnis berbasis komunitas, kuliner, fesyen, dan retail.
 */
export default function SocialPillCta({
  footer,
  brand_name,
  language = "id",
  onUpdateField,
  isEditorMode = false,
  editorChrome,
  isSelected = false,
  collapseSheetForInlineEdit,
  onEditingStateChange,
}: FooterVariantProps) {
  const isEn = language === "en";
  const L = footerStrings(language);
  const displayBrand = brand_name || (isEn ? "Our Brand" : "Brand Kami");
  const displayTagline =
    footer?.tagline || (isEn ? "Digital Works & Creative Solutions" : "Karya Digital & Solusi Bisnis Kreatif");
  const displayCopyright =
    footer?.copyright_text || `© ${new Date().getFullYear()} ${displayBrand}. All rights reserved.`;
  const defaultCta = isEn ? "Contact Us" : "Hubungi Kami";
  const links = footer?.social_links ?? [];

  return (
    <footer
      className="py-10 px-6 sm:px-8 text-xs relative overflow-hidden"
      style={{
        background: FOOTER_BG,
        color: TXT_MED,
        borderTop: `1px solid ${BORDER_LIGHT}`,
      }}
    >
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Main Row: Brand (Left) - Social Bar (Center) - CTA (Right) */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Kiri: Brand info */}
          <div className="flex items-center gap-3 text-center md:text-left min-w-[200px]">
            <div className="w-8 h-8 rounded-full bg-[var(--dt-primary)]/10 text-[var(--dt-primary)] flex items-center justify-center shrink-0">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-bold tracking-tight" style={{ color: TXT_HIGH }}>
                <InlineText
                  section="header"
                  fieldKey="brand_name"
                  value={displayBrand}
                  onUpdateField={onUpdateField}
                  isEditorMode={isEditorMode && editorChrome !== false}
                  isSelected={isSelected}
                  collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                  onEditingStateChange={onEditingStateChange}
                  as="span"
                />
              </p>
              <p className="text-[11px]" style={{ color: TXT_LOW }}>
                {isEditorMode ? (
                  <InlineText
                    section="footer"
                    fieldKey="tagline"
                    value={displayTagline}
                    placeholder={L.taglinePlaceholder}
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
            </div>
          </div>

          {/* Tengah: Social Icons Pill Container */}
          <div className="flex flex-col items-center gap-1.5 px-4 py-2 rounded-xl bg-background/60 border border-[var(--dt-border)] shadow-xs">
            <InlineText
              section="footer"
              fieldKey="social_title"
              value={footer?.social_title || (isEn ? "Follow Us on Social Media" : "Ikuti Kami di Media Sosial")}
              placeholder={isEn ? "Follow Us on Social Media" : "Ikuti Kami di Media Sosial"}
              onUpdateField={onUpdateField}
              isEditorMode={isEditorMode}
              isSelected={isSelected}
              collapseSheetForInlineEdit={collapseSheetForInlineEdit}
              onEditingStateChange={onEditingStateChange}
              as="span"
              className="text-[10px] font-semibold uppercase tracking-wider"
              style={{ color: TXT_LOW }}
            />
            <InlineSocialEditor
              links={links}
              onUpdateField={onUpdateField}
              isEditorMode={isEditorMode}
              collapseSheetForInlineEdit={collapseSheetForInlineEdit}
              onEditingStateChange={onEditingStateChange}
              defaultColor={TXT_LOW}
              hoverColor={TXT_HIGH}
              pill={true}
            />
          </div>

          {/* Kanan: CTA Button */}
          <div className="shrink-0">
            <a
              href={navCtaHref(footer?.cta_text || defaultCta, "#contact")}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[var(--dt-radius)] bg-[var(--dt-primary)] text-[var(--dt-primary-foreground)] font-semibold text-xs sm:text-sm shadow-sm hover:opacity-90 transition-all hover:scale-105 active:scale-95"
            >
              <InlineText
                section="footer"
                fieldKey="cta_text"
                value={footer?.cta_text || defaultCta}
                placeholder={defaultCta}
                onUpdateField={onUpdateField}
                isEditorMode={isEditorMode}
                isSelected={isSelected}
                collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                onEditingStateChange={onEditingStateChange}
                as="span"
              />
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Bottom: Centered Copyright */}
        <div className="pt-6 border-t text-center text-[11px]" style={{ borderColor: BORDER_LIGHT, color: TXT_LOW }}>
          <p>
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
          </p>
        </div>
      </div>
    </footer>
  );
}
