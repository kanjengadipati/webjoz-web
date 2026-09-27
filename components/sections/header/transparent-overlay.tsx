"use client";
import React, { useState, useEffect } from "react";
import { NavMenu, LogoImage, navCtaHref, InlineText } from "../../templates/shared";
import { Globe } from "lucide-react";
import type { HeaderVariantProps } from "./types";

export default function TransparentOverlay({
  header,
  sectionOrder,
  hiddenSections,
  navLinkClass = "",
  drawerStyle,
  extraLinks,
  language,
  onUpdateField, isEditorMode, isSelected, collapseSheetForInlineEdit, onEditingStateChange,
}: HeaderVariantProps) {
  const [scrolled, setScrolled] = useState(false);
  const defaultCta = language === "en" ? "Get in Touch" : "Hubungi Kami";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="sticky top-0 z-50 px-4 sm:px-6 py-4 flex items-center justify-between gap-4 relative transition-all duration-300"
      style={{
        background: scrolled
          ? "color-mix(in srgb, var(--dt-bg) 92%, transparent)"
          : "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.28) 55%, transparent 100%)",
        backdropFilter: scrolled ? "blur(12px)" : "blur(6px)",
        borderBottom: scrolled
          ? "1px solid var(--dt-border)"
          : "1px solid rgba(255,255,255,0.12)",
      }}
    >
      <div
        className="min-w-0 text-base sm:text-lg font-bold tracking-wide flex items-center gap-2.5"
        style={{ color: scrolled ? "var(--dt-text)" : "#fff" }}
      >
        <LogoImage
          url={header?.logo_url}
          icon={header?.icon}
          defaultIcon={Globe}
          iconClass="w-5 h-5 shrink-0 text-[var(--dt-primary)]"
          imgClass="h-8 w-auto shrink-0 object-contain"
          section="header"
          onUpdateField={onUpdateField}
          isEditorMode={isEditorMode}
          isSelected={isSelected}
          collapseSheetForInlineEdit={collapseSheetForInlineEdit}
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
            className="truncate block leading-tight"
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
              className="block text-[11px] font-normal tracking-wide truncate leading-tight mt-0.5"
              style={{
                color: scrolled
                  ? "var(--dt-text-muted)"
                  : "color-mix(in srgb, #fff 92%, transparent)",
              }}
            />
          )}
        </div>
      </div>
      <NavMenu
        sectionOrder={sectionOrder}
        hiddenSections={hiddenSections}
        extraLinks={extraLinks}
        language={language}
        linkClass={navLinkClass || (scrolled ? "text-[var(--dt-text)]" : "text-white/90")}
        drawerStyle={
          drawerStyle || {
            background: scrolled ? "var(--dt-bg)" : "rgba(17,18,24,0.96)",
            color: scrolled ? "var(--dt-text)" : "#fff",
            borderTop: scrolled ? "1px solid var(--dt-border)" : "1px solid rgba(255,255,255,0.12)",
          }
        }
        nav_labels={header?.nav_labels}
        onUpdateField={onUpdateField}
        isEditorMode={isEditorMode}
        isSelected={isSelected}
        collapseSheetForInlineEdit={collapseSheetForInlineEdit}
        onEditingStateChange={onEditingStateChange}
      />
      {!header?.nav_cta_hidden && (
        <a
          href={navCtaHref(header?.nav_cta_text, header?.nav_cta_href)}
          aria-label={`Hubungi ${header?.brand_name || "brand ini"}`}
          className="min-h-11 shrink-0 px-4 py-2 rounded-[var(--dt-radius)] text-sm font-medium hover:opacity-85 transition-all shadow-sm inline-flex items-center focus:outline-none focus:ring-2 focus:ring-[var(--dt-primary)] focus:ring-offset-2"
          style={{
            background: scrolled
              ? "var(--dt-primary)"
              : "color-mix(in srgb, var(--dt-primary) 80%, white)",
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
          />
        </a>
      )}
    </header>
  );
}
