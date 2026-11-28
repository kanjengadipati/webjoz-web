"use client";

import React from "react";
import type { FooterVariantProps } from "./types";
import InlineSocialEditor from "./inline-social-editor";
import { InlineText, navCtaHref } from "../../templates/shared";
import { footerStrings } from "./footer-strings";
import { ArrowRight, Sparkles } from "lucide-react";

/**
 * Brand Gradient CTA Footer
 *
 * Footer visual berenergi tinggi dengan latar belakang gradien brand, slogan utama
 * di tengah, dan tombol aksi kontras. Bertindak sebagai penutup halaman yang berdampak
 * tinggi untuk mendorong konversi akhir.
 * Cocok untuk: agensi kreatif, startup inovatif, konsultan, dan studio desain.
 */
export default function BrandGradientCta({
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
  const defaultSlogan = isEn
    ? "Together, let's turn your digital ideas into high-impact reality."
    : "Bersama kami, wujudkan ide digital menjadi solusi nyata.";
  const defaultCta = isEn ? "Contact Us" : "Hubungi Kami";
  const links = footer?.social_links ?? [];

  return (
    <footer
      className="py-12 px-6 sm:px-8 text-white relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, var(--dt-primary) 0%, color-mix(in srgb, var(--dt-accent, var(--dt-primary)) 65%, #050b14) 100%)",
      }}
    >
      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        {/* Main Banner Row: Brand - Slogan - CTA */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 py-4">
          {/* Kiri: Brand info */}
          <div className="space-y-1 text-center lg:text-left min-w-[200px]">
            <div className="flex items-center justify-center lg:justify-start gap-2">
              <span className="p-1 rounded-md bg-white/15 backdrop-blur-xs">
                <Sparkles className="w-4 h-4 text-white" />
              </span>
              <p className="text-lg font-bold tracking-tight text-white">
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
            </div>
            <p className="text-xs text-white/75">
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

          {/* Tengah: Slogan inspiratif */}
          <div className="max-w-md text-center lg:text-left">
            <InlineText
              section="footer"
              fieldKey="slogan"
              value={footer?.slogan || defaultSlogan}
              placeholder={defaultSlogan}
              onUpdateField={onUpdateField}
              isEditorMode={isEditorMode}
              isSelected={isSelected}
              collapseSheetForInlineEdit={collapseSheetForInlineEdit}
              onEditingStateChange={onEditingStateChange}
              as="p"
              className="text-sm sm:text-base font-medium text-white/95 leading-snug"
            />
          </div>

          {/* Kanan: CTA Kontras */}
          <div className="shrink-0">
            <a
              href={navCtaHref(footer?.cta_text || defaultCta, "#contact")}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-slate-950 font-bold text-xs sm:text-sm shadow-md hover:bg-slate-100 transition-all hover:scale-105 active:scale-95"
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

        {/* Bottom Strip: Copyright - Privacy - Social */}
        <div className="pt-6 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-white/70">
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

          <div className="flex items-center gap-4 text-white/80">
            <a href="#privacy" className="hover:text-white transition-colors">
              {isEn ? "Privacy Policy" : "Kebijakan Privasi"}
            </a>
            <span>|</span>
            <a href="#terms" className="hover:text-white transition-colors">
              {isEn ? "Terms of Service" : "Syarat & Ketentuan"}
            </a>
          </div>

          <div className="flex items-center">
            <InlineSocialEditor
              links={links}
              onUpdateField={onUpdateField}
              isEditorMode={isEditorMode}
              collapseSheetForInlineEdit={collapseSheetForInlineEdit}
              onEditingStateChange={onEditingStateChange}
              defaultColor="rgba(255, 255, 255, 0.75)"
              hoverColor="#ffffff"
              pill={true}
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
