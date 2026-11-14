"use client";
import React from "react";
import { NavMenu, LogoImage, navCtaHref, InlineText } from "../../templates/shared";
import { Globe } from "lucide-react";
import type { HeaderVariantProps } from "./types";

export default function LogoWithCtaButton({
  header, sectionOrder, hiddenSections,
  navLinkClass = "", drawerStyle, extraLinks, language, design_token,
  onUpdateField, isEditorMode, isSelected, collapseSheetForInlineEdit, onEditingStateChange,
}: HeaderVariantProps) {
  const defaultCta = language === "en" ? "Get in Touch" : "Hubungi Kami";
  return (
    <header
      className="sticky top-0 z-50 backdrop-blur-md px-4 sm:px-6 py-3 flex items-center justify-between gap-4 relative"
      style={{
        background: "color-mix(in srgb, var(--dt-bg) 85%, transparent)",
        borderBottom: "1px solid var(--dt-border)",
      }}
    >
      <div className="min-w-0 text-base sm:text-lg font-bold text-[var(--dt-text)] tracking-wide flex items-center gap-2.5">
        <LogoImage
          url={header?.logo_url}
          icon={header?.icon}
          defaultIcon={Globe}
          iconClass={`w-5 h-5 shrink-0 ${design_token?.theme_mode === "dark" ? "text-white" : "text-[var(--dt-primary)]"}`}
          imgClass="h-8 w-auto shrink-0 object-contain"
          section="header"
          onUpdateField={onUpdateField}
          isEditorMode={isEditorMode}
          isSelected={isSelected}
          collapseSheetForInlineEdit={collapseSheetForInlineEdit}
          lightOnHero={design_token?.theme_mode === "dark"}
        />
        <div className="min-w-0 flex flex-col justify-center">
          <InlineText
            section="header"
            fieldKey="brand_name"
            value={header?.brand_name || "Brand Kami"}
            onUpdateField={onUpdateField}
            isEditorMode={isEditorMode}
            isSelected={isSelected}
            collapseSheetForInlineEdit={collapseSheetForInlineEdit}
            onEditingStateChange={onEditingStateChange}
            as="span"
            className="truncate block leading-tight text-[var(--dt-text)]"
          />
          {(header?.tagline || isEditorMode) && (
            <InlineText
              section="header"
              fieldKey="tagline"
              value={header.tagline}
              onUpdateField={onUpdateField}
              isEditorMode={isEditorMode}
              isSelected={isSelected}
              collapseSheetForInlineEdit={collapseSheetForInlineEdit}
              onEditingStateChange={onEditingStateChange}
              as="span"
              className="block text-[11px] font-normal text-[var(--dt-text-muted)] tracking-wide truncate leading-tight mt-0.5"
            />
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {!header?.nav_cta_hidden && (
          <a
            href={navCtaHref(header?.nav_cta_text, header?.nav_cta_href)}
            aria-label={`Hubungi ${header?.brand_name || "brand ini"}`}
            className="order-1 md:order-2 shrink-0 px-2.5 py-1.5 sm:px-4 sm:py-2 md:px-5 md:py-2.5 bg-[var(--dt-primary)] rounded-[var(--dt-radius)] text-xs sm:text-sm font-semibold hover:opacity-85 transition-all shadow-sm inline-flex items-center justify-center max-w-[125px] sm:max-w-none truncate focus:outline-none focus:ring-2 focus:ring-[var(--dt-primary)] focus:ring-offset-2 focus:ring-offset-[var(--dt-bg)]"
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
          linkClass={navLinkClass || "text-[var(--dt-text-muted)] text-sm"}
          drawerStyle={drawerStyle || { background: "var(--dt-bg)", borderTop: "1px solid var(--dt-border)" }}
          nav_labels={header?.nav_labels}
          onUpdateField={onUpdateField}
          isEditorMode={isEditorMode}
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
  );
}
