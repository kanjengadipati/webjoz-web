"use client";
import React from "react";
import { NavMenu, LogoImage, navCtaHref, InlineText } from "../../templates/shared";
import { Globe } from "lucide-react";
import type { HeaderVariantProps } from "./types";

export default function StackedLogoTagline({
  header, sectionOrder, hiddenSections,
  navLinkClass = "", drawerStyle, extraLinks, language, design_token,
  onUpdateField, isEditorMode, isSelected, collapseSheetForInlineEdit, onEditingStateChange,
}: HeaderVariantProps) {
  const defaultCta = language === "en" ? "Get in Touch" : "Hubungi Kami";
  return (
    <header
      className="sticky top-0 z-50 backdrop-blur-md px-4 sm:px-6 py-3 flex flex-col items-center gap-1 relative"
      style={{
        background: "color-mix(in srgb, var(--dt-bg) 85%, transparent)",
        borderBottom: "1px solid var(--dt-border)",
      }}
    >
      <div className="flex flex-col items-center gap-0.5">
        <LogoImage
          url={header?.logo_url}
          icon={header?.icon}
          defaultIcon={Globe}
          iconClass={`w-7 h-7 shrink-0 ${design_token?.theme_mode === "dark" ? "text-white" : "text-[var(--dt-primary)]"}`}
          imgClass="h-10 w-auto shrink-0 object-contain"
          section="header"
          onUpdateField={onUpdateField}
          isEditorMode={isEditorMode}
          isSelected={isSelected}
          collapseSheetForInlineEdit={collapseSheetForInlineEdit}
          lightOnHero={design_token?.theme_mode === "dark"}
        />
        <span className="text-lg font-bold text-[var(--dt-text)] tracking-wide text-center">
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
          />
        </span>
        {(header?.tagline || isEditorMode) && (
          <span className="text-[11px] text-[var(--dt-text-muted)] text-center italic tracking-wide">
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
            />
          </span>
        )}
      </div>
      <div className="flex items-center gap-2 sm:gap-4 w-full justify-center pt-1">
        {!header?.nav_cta_hidden && (
          <a
            href={navCtaHref(header?.nav_cta_text, header?.nav_cta_href)}
            aria-label={`Hubungi ${header?.brand_name || "brand ini"}`}
            className="order-1 md:order-2 shrink-0 px-2.5 py-1.5 sm:px-4 sm:py-1.5 bg-[var(--dt-primary)] rounded-[var(--dt-radius)] text-xs font-medium hover:opacity-85 transition-all shadow-sm inline-flex items-center justify-center max-w-[125px] sm:max-w-none truncate"
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
          linkClass={navLinkClass || "text-[var(--dt-text-muted)] text-xs"}
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
