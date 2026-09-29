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
  design_token,
  onUpdateField, isEditorMode, isSelected, collapseSheetForInlineEdit, onEditingStateChange,
}: HeaderVariantProps) {
  const [scrolled, setScrolled] = useState(false);
  const isDark = design_token?.theme_mode === "dark";
  const defaultCta = language === "en" ? "Get in Touch" : "Hubungi Kami";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const bgUnscrolled = isDark
    ? "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.28) 55%, transparent 100%)"
    : "linear-gradient(to bottom, color-mix(in srgb, var(--dt-bg) 94%, transparent) 0%, color-mix(in srgb, var(--dt-bg) 72%, transparent) 60%, transparent 100%)";
  const borderUnscrolled = isDark
    ? "1px solid rgba(255,255,255,0.12)"
    : "1px solid color-mix(in srgb, var(--dt-border) 70%, transparent)";

  return (
    <header
      className="sticky top-0 z-50 px-4 sm:px-6 py-4 flex items-center justify-between gap-4 relative transition-all duration-300"
      style={{
        background: scrolled
          ? "color-mix(in srgb, var(--dt-bg) 92%, transparent)"
          : bgUnscrolled,
        backdropFilter: scrolled ? "blur(12px)" : "blur(6px)",
        borderBottom: scrolled
          ? "1px solid var(--dt-border)"
          : borderUnscrolled,
      }}
    >
      <div
        className="min-w-0 text-base sm:text-lg font-bold tracking-wide flex items-center gap-2.5"
        style={{ color: scrolled || !isDark ? "var(--dt-text)" : "#fff" }}
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
              className="block text-[11px] font-normal tracking-wide truncate leading-tight mt-0.5"
              style={{
                color: scrolled
                  ? "var(--dt-text-muted)"
                  : isDark
                    ? "color-mix(in srgb, #fff 92%, transparent)"
                    : "var(--dt-text-muted)",
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
        linkClass={navLinkClass || (scrolled || !isDark ? "text-[var(--dt-text)]" : "text-white/90")}
        drawerStyle={
          drawerStyle || {
            background: scrolled || !isDark ? "var(--dt-bg)" : "rgba(17,18,24,0.96)",
            color: scrolled || !isDark ? "var(--dt-text)" : "#fff",
            borderTop: scrolled || !isDark ? "1px solid var(--dt-border)" : "1px solid rgba(255,255,255,0.12)",
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
