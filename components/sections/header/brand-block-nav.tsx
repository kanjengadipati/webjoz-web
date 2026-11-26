"use client";
import React from "react";
import { NavMenu, LogoImage, navCtaHref, InlineText } from "../../templates/shared";
import { Globe } from "lucide-react";
import type { HeaderVariantProps } from "./types";

/**
 * Brand Block + Navigation Rail Header
 *
 * Blok warna solid di sisi kiri (lebar tetap ~240px) menampung logo + nama brand
 * dengan background primary. Nav dan CTA berada di rail kanan yang bersih.
 * Identitas brand sangat kuat, tampilan tegas dan modern.
 * Cocok untuk: agensi, firma hukum, institusi, korporat, perusahaan besar.
 */
export default function BrandBlockNav({
  header, sectionOrder, hiddenSections,
  navLinkClass = "", drawerStyle, extraLinks, language, design_token,
  onUpdateField, isEditorMode, editorChrome, isSelected, collapseSheetForInlineEdit, onEditingStateChange,
}: HeaderVariantProps) {
  const defaultCta = language === "en" ? "Get in Touch" : "Hubungi Kami";
  const isDark = design_token?.theme_mode === "dark";

  return (
    <header
      className="sticky top-0 z-50 w-full flex items-stretch"
      style={{
        height: "72px",
        background: isDark ? "var(--dt-bg)" : "var(--dt-bg)",
        borderBottom: "1px solid var(--dt-border)",
        boxShadow: isDark
          ? "0 4px 20px rgba(0,0,0,0.3)"
          : "0 2px 12px rgba(0,0,0,0.06)",
      }}
    >
      {/* Brand Block — warna solid primary */}
      <div
        className="hidden md:flex items-center gap-3 px-5 shrink-0"
        style={{
          width: "240px",
          background: "var(--dt-primary)",
          // Sudut kanan bawah membulat sedikit untuk sentuhan modern
          borderRadius: "0 0 12px 0",
        }}
      >
        <LogoImage
          url={header?.logo_url_light || header?.logo_url}
          icon={header?.icon}
          defaultIcon={Globe}
          iconClass="w-7 h-7 shrink-0 text-white"
          imgClass="h-9 w-auto max-w-[90px] shrink-0 object-contain"
          section="header"
          onUpdateField={onUpdateField}
          isEditorMode={isEditorMode && editorChrome !== false}
          isSelected={isSelected}
          collapseSheetForInlineEdit={collapseSheetForInlineEdit}
          lightOnHero={true}
        />
        <div className="min-w-0 flex flex-col justify-center">
          <InlineText
            section="header"
            fieldKey="brand_name"
            value={header?.brand_name || (language === "en" ? "Our Brand" : "Brand Kami")}
            onUpdateField={onUpdateField}
            isEditorMode={isEditorMode && editorChrome !== false}
            isSelected={isSelected}
            collapseSheetForInlineEdit={collapseSheetForInlineEdit}
            onEditingStateChange={onEditingStateChange}
            as="span"
            className="truncate block leading-tight font-bold text-sm text-white"
          />
          {(header?.tagline || isEditorMode) && (
            <InlineText
              section="header"
              fieldKey="tagline"
              value={header?.tagline ?? ""}
              placeholder="Tagline..."
              onUpdateField={onUpdateField}
              isEditorMode={isEditorMode && editorChrome !== false}
              isSelected={isSelected}
              collapseSheetForInlineEdit={collapseSheetForInlineEdit}
              onEditingStateChange={onEditingStateChange}
              as="span"
              className="text-[10px] font-normal text-white/75 truncate leading-tight mt-0.5 block"
            />
          )}
        </div>
      </div>

      {/* Mobile logo (hanya tampil di mobile, brand block hidden di mobile) */}
      <div className="md:hidden flex items-center gap-2.5 pl-4 font-bold text-base text-[var(--dt-text)] tracking-wide">
        <LogoImage
          url={header?.logo_url}
          icon={header?.icon}
          defaultIcon={Globe}
          iconClass={`w-6 h-6 shrink-0 ${isDark ? "text-white" : "text-[var(--dt-primary)]"}`}
          imgClass="h-8 w-auto max-w-[100px] shrink-0 object-contain"
          section="header"
          onUpdateField={onUpdateField}
          isEditorMode={false}
          isSelected={false}
          collapseSheetForInlineEdit={collapseSheetForInlineEdit}
          lightOnHero={isDark}
        />
        <span className="truncate text-[var(--dt-text)]">{header?.brand_name || "Brand"}</span>
      </div>

      {/* Navigation Rail — kanan */}
      <div className="flex-1 flex items-center justify-end gap-2 sm:gap-3 px-4 sm:px-6">
        {!header?.nav_cta_hidden && (
          <a
            href={navCtaHref(header?.nav_cta_text, header?.nav_cta_href)}
            aria-label={language === "en" ? `Contact ${header?.brand_name || "this brand"}` : `Hubungi ${header?.brand_name || "brand ini"}`}
            className="order-1 md:order-2 shrink-0 px-3 py-1.5 sm:px-4 sm:py-2 rounded-[var(--dt-radius)] text-xs sm:text-sm font-semibold hover:opacity-85 transition-all shadow-sm inline-flex items-center justify-center max-w-[120px] sm:max-w-none truncate focus:outline-none focus:ring-2 focus:ring-[var(--dt-primary)] focus:ring-offset-2 focus:ring-offset-[var(--dt-bg)]"
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
