"use client";

import React, { useState } from "react";
import type { FooterVariantProps } from "./types";
import InlineSocialEditor from "./inline-social-editor";
import { InlineText } from "../../templates/shared";
import { Send, CheckCircle2 } from "lucide-react";

const FOOTER_BG = "var(--dt-surface)";
const TXT_HIGH = "color-mix(in srgb, var(--dt-text) 90%, transparent)";
const TXT_MED = "color-mix(in srgb, var(--dt-text) 60%, transparent)";
const TXT_LOW = "color-mix(in srgb, var(--dt-text) 45%, transparent)";
const BORDER_LIGHT = "var(--dt-border)";

/**
 * Multi-Column Newsletter Footer
 *
 * Footer profesional multi-kolom lengkap dengan formulir berlangganan newsletter,
 * tautan navigasi, daftar media sosial, serta tautan privasi dan hak cipta.
 * Cocok untuk: SaaS, e-commerce, agensi digital, korporat, dan blog.
 */
export default function MultiColumnNewsletter({
  footer,
  brand_name,
  hasBlog,
  language = "id",
  onUpdateField,
  isEditorMode = false,
  editorChrome,
  isSelected = false,
  collapseSheetForInlineEdit,
  onEditingStateChange,
}: FooterVariantProps) {
  const isEn = language === "en";
  const displayBrand = brand_name || (isEn ? "Our Brand" : "Brand Kami");
  const displayTagline = footer?.tagline || (isEn ? "Digital Works & Creative Solutions" : "Karya Digital & Solusi Bisnis Kreatif");
  const displayCopyright =
    footer?.copyright_text || `© ${new Date().getFullYear()} ${displayBrand}. All rights reserved.`;
  const links = footer?.social_links ?? [];

  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    setTimeout(() => {
      setEmail("");
    }, 2500);
  };

  return (
    <footer
      className="py-12 px-6 sm:px-8 text-xs relative overflow-hidden"
      style={{
        background: FOOTER_BG,
        color: TXT_MED,
        borderTop: `1px solid ${BORDER_LIGHT}`,
      }}
    >
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {/* Kolom 1: Brand & Tagline */}
          <div className="space-y-3">
            <p className="text-base font-bold tracking-tight" style={{ color: TXT_HIGH }}>
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
            <p className="text-xs leading-relaxed max-w-xs" style={{ color: TXT_LOW }}>
              {isEditorMode ? (
                <InlineText
                  section="footer"
                  fieldKey="tagline"
                  value={displayTagline}
                  placeholder={isEn ? "Add tagline..." : "Tambah tagline..."}
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

          {/* Kolom 2: Navigasi Cepat */}
          <div className="space-y-3">
            <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: TXT_HIGH }}>
              {isEn ? "Navigation" : "Navigasi"}
            </p>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#hero" className="hover:text-[var(--dt-primary)] transition-colors">
                  {isEn ? "Home" : "Beranda"}
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-[var(--dt-primary)] transition-colors">
                  {isEn ? "About Us" : "Tentang Kami"}
                </a>
              </li>
              <li>
                <a href="#benefits" className="hover:text-[var(--dt-primary)] transition-colors">
                  {isEn ? "Features" : "Keunggulan"}
                </a>
              </li>
              {hasBlog && (
                <li>
                  <a href="#blog" className="hover:text-[var(--dt-primary)] transition-colors">
                    Blog
                  </a>
                </li>
              )}
              <li>
                <a href="#contact" className="hover:text-[var(--dt-primary)] transition-colors">
                  {isEn ? "Contact" : "Kontak"}
                </a>
              </li>
            </ul>
          </div>

          {/* Kolom 3: Media Sosial */}
          <div className="space-y-3">
            <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: TXT_HIGH }}>
              {isEn ? "Social Media" : "Media Sosial"}
            </p>
            <InlineSocialEditor
              links={links}
              onUpdateField={onUpdateField}
              isEditorMode={isEditorMode}
              collapseSheetForInlineEdit={collapseSheetForInlineEdit}
              onEditingStateChange={onEditingStateChange}
              defaultColor={TXT_LOW}
              hoverColor={TXT_HIGH}
            />
          </div>

          {/* Kolom 4: Newsletter Form */}
          <div className="space-y-3">
            <InlineText
              section="footer"
              fieldKey="newsletter_title"
              value={footer?.newsletter_title || (isEn ? "Get Latest Updates" : "Dapatkan update terbaru")}
              placeholder={isEn ? "Get Latest Updates" : "Dapatkan update terbaru"}
              onUpdateField={onUpdateField}
              isEditorMode={isEditorMode}
              isSelected={isSelected}
              collapseSheetForInlineEdit={collapseSheetForInlineEdit}
              onEditingStateChange={onEditingStateChange}
              as="p"
              className="text-[11px] font-bold uppercase tracking-wider"
              style={{ color: TXT_HIGH }}
            />
            <InlineText
              section="footer"
              fieldKey="newsletter_description"
              value={footer?.newsletter_description || (isEn ? "Subscribe to our newsletter for exclusive insights and updates." : "Berlangganan newsletter kami untuk penawaran dan info eksklusif.")}
              placeholder={isEn ? "Subscribe to our newsletter..." : "Berlangganan newsletter..."}
              onUpdateField={onUpdateField}
              isEditorMode={isEditorMode}
              isSelected={isSelected}
              collapseSheetForInlineEdit={collapseSheetForInlineEdit}
              onEditingStateChange={onEditingStateChange}
              as="p"
              className="text-xs leading-relaxed"
              style={{ color: TXT_LOW }}
            />

            {submitted ? (
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{isEn ? "Thank you for subscribing!" : "Terima kasih telah berlangganan!"}</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex items-center gap-1.5">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={isEn ? "Email address..." : "Alamat email..."}
                  required
                  className="w-full px-3 py-2 rounded-lg text-xs bg-background border border-[var(--dt-border)] text-[var(--dt-text)] placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-[var(--dt-primary)] transition"
                />
                <button
                  type="submit"
                  aria-label={isEn ? "Subscribe" : "Langganan"}
                  className="px-3.5 py-2 rounded-lg bg-[var(--dt-primary)] text-[var(--dt-primary-foreground)] hover:opacity-90 transition font-medium cursor-pointer shrink-0 shadow-xs flex items-center justify-center"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar: Copyright & Legal */}
        <div
          className="pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]"
          style={{ borderColor: BORDER_LIGHT, color: TXT_LOW }}
        >
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
          <div className="flex items-center gap-4">
            <a href="#privacy" className="hover:text-[var(--dt-text)] transition-colors">
              {isEn ? "Privacy Policy" : "Kebijakan Privasi"}
            </a>
            <span>•</span>
            <a href="#terms" className="hover:text-[var(--dt-text)] transition-colors">
              {isEn ? "Terms of Service" : "Syarat & Ketentuan"}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
