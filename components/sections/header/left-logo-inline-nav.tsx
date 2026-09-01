"use client";
import React from "react";
import { NavMenu, LogoImage, navCtaHref, InlineText } from "../../templates/shared";
import { Globe } from "lucide-react";
import type { HeaderVariantProps } from "./types";

export default function LeftLogoInlineNav({
  header, sectionOrder, hiddenSections,
  navLinkClass = "", drawerStyle, extraLinks, language,
  onUpdateField, isEditorMode, isSelected, collapseSheetForInlineEdit, onEditingStateChange,
}: HeaderVariantProps) {
  const defaultCta = language === "en" ? "Get in Touch" : "Hubungi Kami";
  return (
    <header
      className="sticky top-0 z-50 backdrop-blur-md px-4 sm:px-6 py-4 flex items-center justify-between gap-4 relative"
      style={{
        background: "color-mix(in srgb, var(--dt-bg) 85%, transparent)",
        borderBottom: "1px solid var(--dt-border)",
      }}
    >
      <span className="min-w-0 text-base sm:text-lg font-bold text-[var(--dt-text)] tracking-wide flex items-center gap-2">
        <LogoImage
          url={header?.logo_url}
          icon={header?.icon}
          defaultIcon={Globe}
          iconClass="w-5 h-5 shrink-0 text-[var(--dt-primary)]"
          imgClass="h-8 w-auto shrink-0 object-contain"
        />
        <span className="min-w-0">
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
            className="truncate block"
          />
          {header?.tagline && (
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
              className="block text-[10px] font-normal text-[var(--dt-text-muted)] tracking-wide truncate"
            />
          )}
        </span>
      </span>
      <NavMenu
        sectionOrder={sectionOrder}
        hiddenSections={hiddenSections}
        extraLinks={extraLinks}
        language={language}
        linkClass={navLinkClass || "text-[var(--dt-text)]"}
        drawerStyle={drawerStyle || { background: "var(--dt-bg)", borderTop: "1px solid var(--dt-border)" }}
      />
      {!header?.nav_cta_hidden && (
        <a
          href={navCtaHref(header?.nav_cta_text, header?.nav_cta_href)}
          aria-label={`Hubungi ${header?.brand_name || "brand ini"}`}
          className="min-h-11 shrink-0 px-4 py-2 bg-[var(--dt-primary)] rounded-[var(--dt-radius)] text-sm font-medium hover:opacity-85 transition-all shadow-sm inline-flex items-center focus:outline-none focus:ring-2 focus:ring-[var(--dt-primary)] focus:ring-offset-2 focus:ring-offset-[var(--dt-bg)]"
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
          />
        </a>
      )}
    </header>
  );
}
