"use client";
import React from "react";
import { NavMenu, LogoImage, navCtaHref, InlineText } from "../../templates/shared";
import { Globe, MapPin, Mail } from "lucide-react";
import type { HeaderVariantProps } from "./types";

/**
 * Split Utility Header
 *
 * Dua lapisan: top bar tipis dengan info utilitas (lokasi, email, sosial media)
 * dan nav bar utama di bawahnya yang sticky. Navigasi tetap terfokus, terlihat
 * profesional dan informatif.
 * Cocok untuk: bisnis lokal, agensi profesional, klinik, properti, perusahaan.
 */
export default function SplitUtility({
  header, sectionOrder, hiddenSections,
  navLinkClass = "", drawerStyle, extraLinks, language, design_token,
  onUpdateField, isEditorMode, editorChrome, isSelected, collapseSheetForInlineEdit, onEditingStateChange,
}: HeaderVariantProps) {
  const defaultCta = language === "en" ? "Get in Touch" : "Hubungi Kami";
  const isDark = design_token?.theme_mode === "dark";

  // Derive contact info from header data with sensible fallbacks
  const contactEmail = (header as any)?.email || (header as any)?.contact_email;
  const contactAddress = (header as any)?.address || (header as any)?.location;

  return (
    <div className="sticky top-0 z-50 w-full">
      {/* Top Bar — info utilitas */}
      <div
        className="hidden md:flex items-center justify-between px-4 sm:px-6 h-10 text-[11px] font-medium border-b"
        style={{
          background: isDark
            ? "var(--dt-surface)"
            : "color-mix(in srgb, var(--dt-primary) 8%, var(--dt-bg))",
          color: "var(--dt-text-muted)",
          borderColor: "var(--dt-border)",
        }}
      >
        {/* Left: lokasi & email */}
        <div className="flex items-center gap-4">
          {contactAddress && (
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3 h-3 shrink-0 text-[var(--dt-primary)]" />
              <span className="truncate max-w-[200px]">{contactAddress}</span>
            </span>
          )}
          {contactEmail && (
            <a
              href={`mailto:${contactEmail}`}
              className="flex items-center gap-1.5 hover:text-[var(--dt-primary)] transition-colors"
            >
              <Mail className="w-3 h-3 shrink-0 text-[var(--dt-primary)]" />
              <span>{contactEmail}</span>
            </a>
          )}
          {!contactAddress && !contactEmail && (
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3 h-3 shrink-0 text-[var(--dt-primary)]" />
              <span>{language === "en" ? "Your City, Province" : "Kota Anda, Provinsi"}</span>
            </span>
          )}
        </div>

        {/* Right: tagline atau teks singkat */}
        {header?.tagline && (
          <span className="italic opacity-80 truncate max-w-[300px]">{header.tagline}</span>
        )}
      </div>

      {/* Main Nav Bar */}
      <header
        className="flex items-center justify-between gap-4 px-4 sm:px-6"
        style={{
          height: "72px",
          background: isDark
            ? "color-mix(in srgb, var(--dt-bg) 90%, transparent)"
            : "color-mix(in srgb, var(--dt-bg) 94%, transparent)",
          backdropFilter: "blur(16px) saturate(1.4)",
          WebkitBackdropFilter: "blur(16px) saturate(1.4)",
          borderBottom: "1px solid var(--dt-border)",
          boxShadow: isDark
            ? "0 4px 20px rgba(0,0,0,0.3)"
            : "0 4px 20px rgba(0,0,0,0.05)",
        }}
      >
        {/* Logo + Brand name */}
        <div className="min-w-0 flex items-center gap-2.5 font-bold text-base sm:text-lg text-[var(--dt-text)] tracking-wide">
          <LogoImage
            url={header?.logo_url}
            icon={header?.icon}
            defaultIcon={Globe}
            iconClass={`w-7 h-7 shrink-0 ${isDark ? "text-white" : "text-[var(--dt-primary)]"}`}
            imgClass="h-9 w-auto max-w-[120px] shrink-0 object-contain"
            section="header"
            onUpdateField={onUpdateField}
            isEditorMode={isEditorMode && editorChrome !== false}
            isSelected={isSelected}
            collapseSheetForInlineEdit={collapseSheetForInlineEdit}
            lightOnHero={isDark}
          />
          <div className="min-w-0 flex flex-col justify-center">
            <InlineText
              section="header"
              fieldKey="brand_name"
              value={header?.brand_name || "Brand Kami"}
              onUpdateField={onUpdateField}
              isEditorMode={isEditorMode && editorChrome !== false}
              isSelected={isSelected}
              collapseSheetForInlineEdit={collapseSheetForInlineEdit}
              onEditingStateChange={onEditingStateChange}
              as="span"
              className="truncate block leading-tight text-[var(--dt-text)]"
            />
            {header?.tagline && (
              <span className="text-[11px] font-normal text-[var(--dt-text-muted)] truncate leading-tight mt-0.5 hidden sm:block">
                {header.tagline}
              </span>
            )}
          </div>
        </div>

        {/* Nav + CTA */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {!header?.nav_cta_hidden && (
            <a
              href={navCtaHref(header?.nav_cta_text, header?.nav_cta_href)}
              aria-label={`Hubungi ${header?.brand_name || "brand ini"}`}
              className="order-1 md:order-2 shrink-0 px-3 py-1.5 sm:px-4 sm:py-2 bg-[var(--dt-primary)] rounded-[var(--dt-radius)] text-xs sm:text-sm font-semibold hover:opacity-85 transition-all shadow-sm inline-flex items-center justify-center max-w-[120px] sm:max-w-none truncate focus:outline-none focus:ring-2 focus:ring-[var(--dt-primary)] focus:ring-offset-2 focus:ring-offset-[var(--dt-bg)]"
              style={{ color: "var(--dt-primary-foreground)" }}
            >
              <InlineText
                section="header"
                fieldKey="nav_cta_text"
                value={header?.nav_cta_text || defaultCta}
                onUpdateField={onUpdateField}
                isEditorMode={isEditorMode}
                isSelected={isSelected}
                collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                onEditingStateChange={onEditingStateChange}
                as="span"
                className="truncate"
              />
            </a>
          )}
          <NavMenu
            sectionOrder={sectionOrder}
            hiddenSections={hiddenSections}
            extraLinks={extraLinks}
            language={language}
            linkClass={navLinkClass || "text-[var(--dt-text-muted)] text-sm hover:text-[var(--dt-text)]"}
            drawerStyle={drawerStyle || { background: "var(--dt-bg)", borderTop: "1px solid var(--dt-border)" }}
            nav_labels={header?.nav_labels}
            onUpdateField={onUpdateField}
            isEditorMode={isEditorMode && editorChrome !== false}
            isSelected={isSelected}
            collapseSheetForInlineEdit={collapseSheetForInlineEdit}
            onEditingStateChange={onEditingStateChange}
            ctaButton={
              !header?.nav_cta_hidden ? (
                <a
                  href={navCtaHref(header?.nav_cta_text, header?.nav_cta_href)}
                  className="w-full py-2.5 px-4 bg-[var(--dt-primary)] rounded-[var(--dt-radius)] text-sm font-semibold text-center flex items-center justify-center hover:opacity-90 transition-all shadow-sm"
                  style={{ color: "var(--dt-primary-foreground)" }}
                >
                  {header?.nav_cta_text || defaultCta}
                </a>
              ) : undefined
            }
          />
        </div>
      </header>
    </div>
  );
}
