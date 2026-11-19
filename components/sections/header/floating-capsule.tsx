"use client";
import React from "react";
import { NavMenu, LogoImage, navCtaHref, InlineText } from "../../templates/shared";
import { Globe } from "lucide-react";
import type { HeaderVariantProps } from "./types";

/**
 * Floating Capsule Header
 *
 * Seluruh navbar terbungkus dalam satu kapsul melayang (pill) dengan bayangan
 * halus di atas konten. Kesan premium, modern, dan fokus pada CTA.
 * Cocok untuk: SaaS, agency, startup, brand premium.
 */
export default function FloatingCapsule({
  header, sectionOrder, hiddenSections,
  navLinkClass = "", drawerStyle, extraLinks, language, design_token,
  onUpdateField, isEditorMode, editorChrome, isSelected, collapseSheetForInlineEdit, onEditingStateChange,
}: HeaderVariantProps) {
  const defaultCta = language === "en" ? "Get in Touch" : "Hubungi Kami";
  const isDark = design_token?.theme_mode === "dark";

  return (
    <div
      className="sticky top-0 z-50 w-full px-4 sm:px-6 py-3 flex items-center justify-center"
      style={{ background: "transparent", pointerEvents: "none" }}
    >
      <header
        className="pointer-events-auto w-full max-w-5xl flex items-center justify-between gap-4 px-4 sm:px-6 py-3"
        style={{
          background: isDark
            ? "color-mix(in srgb, var(--dt-surface) 90%, transparent)"
            : "color-mix(in srgb, var(--dt-bg) 92%, transparent)",
          backdropFilter: "blur(16px) saturate(1.5)",
          WebkitBackdropFilter: "blur(16px) saturate(1.5)",
          border: "1px solid var(--dt-border)",
          borderRadius: "9999px",
          boxShadow: isDark
            ? "0 8px 32px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.05) inset"
            : "0 8px 24px rgba(0,0,0,0.08), 0 1px 0 rgba(255,255,255,0.8) inset",
        }}
      >
        {/* Logo + Brand */}
        <div className="min-w-0 flex items-center gap-2.5 font-bold text-base text-[var(--dt-text)] tracking-wide">
          <LogoImage
            url={header?.logo_url}
            icon={header?.icon}
            defaultIcon={Globe}
            iconClass={`w-6 h-6 shrink-0 ${isDark ? "text-white" : "text-[var(--dt-primary)]"}`}
            imgClass="h-8 w-auto max-w-[100px] shrink-0 object-contain"
            section="header"
            onUpdateField={onUpdateField}
            isEditorMode={isEditorMode && editorChrome !== false}
            isSelected={isSelected}
            collapseSheetForInlineEdit={collapseSheetForInlineEdit}
            lightOnHero={isDark}
          />
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
        </div>

        {/* Nav + CTA */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {!header?.nav_cta_hidden && (
            <a
              href={navCtaHref(header?.nav_cta_text, header?.nav_cta_href)}
              aria-label={`Hubungi ${header?.brand_name || "brand ini"}`}
              className="order-1 md:order-2 shrink-0 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold hover:opacity-85 transition-all shadow-sm inline-flex items-center justify-center max-w-[120px] sm:max-w-none truncate focus:outline-none focus:ring-2 focus:ring-[var(--dt-primary)] focus:ring-offset-2 focus:ring-offset-[var(--dt-bg)]"
              style={{
                background: "var(--dt-primary)",
                color: "var(--dt-primary-foreground)",
              }}
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
                  className="w-full py-2.5 px-4 rounded-full text-sm font-semibold text-center flex items-center justify-center hover:opacity-90 transition-all shadow-sm"
                  style={{ background: "var(--dt-primary)", color: "var(--dt-primary-foreground)" }}
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
