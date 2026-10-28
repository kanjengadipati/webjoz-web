"use client";
import React from "react";
import { ArrowRight, Clock, Star } from "lucide-react";
import PhotoCredit from "../PhotoCredit";
import type { TemplateProps } from "../../templates/types";
import type { HeroVariantProps } from "./types";

import { InlineText, InlineImage, HeroAccessory } from "../../templates/shared";
import { safeHref, isExternalHref } from "@/lib/safe-url";

export { safeHref, isExternalHref };

export function HeroContent({
  hero: h,
  onUpdateField,
  isEditorMode,
  isSelected,
  collapseSheetForInlineEdit,
  onEditingStateChange,
}: {
  hero: TemplateProps["content"]["hero"];
  onUpdateField?: (section: string, key: string, value: any) => void;
  isEditorMode?: boolean;
  isSelected?: boolean;
  collapseSheetForInlineEdit?: () => void;
  onEditingStateChange?: (isEditing: boolean) => void;
}) {
  return (
    <>
      <InlineText
        section="hero"
        fieldKey="headline"
        value={h.headline}
        onUpdateField={onUpdateField}
        isEditorMode={isEditorMode}
        isSelected={isSelected}
        as="h1"
        style={{ fontFamily: "var(--dt-heading-font)", fontWeight: "var(--dt-heading-weight)" as any, fontStyle: "var(--dt-heading-style)" as any, fontSize: "clamp(2.25rem, 6vw, var(--dt-hero-size, 3.75rem))", lineHeight: 1.15, color: "var(--dt-text)", margin: 0 }}
        collapseSheetForInlineEdit={collapseSheetForInlineEdit}
        onEditingStateChange={onEditingStateChange}
      />
      <InlineText
        section="hero"
        fieldKey="subheadline"
        value={h.subheadline}
        onUpdateField={onUpdateField}
        isEditorMode={isEditorMode}
        isSelected={isSelected}
        as="p"
        style={{ fontSize: "clamp(1rem, 2vw, 1.25rem)", color: "var(--dt-text-muted)", maxWidth: "38rem", lineHeight: 1.6, margin: 0 }}
        collapseSheetForInlineEdit={collapseSheetForInlineEdit}
        onEditingStateChange={onEditingStateChange}
      />
      {Boolean(h.opening_hours?.trim()) && (
        <span className="px-3 py-1 md:px-4 md:py-1.5 text-xs md:text-sm font-semibold" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "var(--dt-surface)", borderRadius: "9999px", color: "var(--dt-text)", border: "1px solid color-mix(in srgb, var(--dt-primary) 20%, transparent)", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          <Clock style={{ width: 14, height: 14, color: "var(--dt-text-muted)" }} />
          <InlineText section="hero" fieldKey="opening_hours" value={h.opening_hours ?? ""} placeholder="Atur jam operasional..." onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={isSelected} as="span" collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} />
        </span>
      )}
      <a
        href={safeHref(h.cta_url, "#contact")}
        target={isExternalHref(h.cta_url) ? "_blank" : undefined}
        rel={isExternalHref(h.cta_url) ? "noopener noreferrer" : undefined}
        className="px-4 py-2.5 md:px-8 md:py-3.5 text-xs md:text-base font-bold"
        style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "var(--dt-primary)", color: "var(--dt-primary-foreground)", borderRadius: "var(--dt-radius)", textDecoration: "none", transition: "opacity 0.2s" }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
      >
        <InlineText
          section="hero"
          fieldKey="cta_text"
          value={h.cta_text}
          onUpdateField={onUpdateField}
          isEditorMode={isEditorMode}
          isSelected={isSelected}
          as="span"
          collapseSheetForInlineEdit={collapseSheetForInlineEdit}
          onEditingStateChange={onEditingStateChange}
        /> <ArrowRight style={{ width: 18, height: 18 }} />
      </a>
      <HeroAccessory
        accessory={h.accessory}
        onUpdateField={onUpdateField}
        isEditorMode={isEditorMode}
        isSelected={isSelected}
        collapseSheetForInlineEdit={collapseSheetForInlineEdit}
        onEditingStateChange={onEditingStateChange}
      />
    </>
  );
}

export function HeroDecorations({
  hero: h,
  language,
  onUpdateField,
  isEditorMode,
  isSelected,
  collapseSheetForInlineEdit,
}: {
  hero: TemplateProps["content"]["hero"];
  language?: string;
  onUpdateField?: (section: string, key: string, value: any) => void;
  isEditorMode?: boolean;
  isSelected?: boolean;
  collapseSheetForInlineEdit?: () => void;
}) {
  return (
    <>
      <div style={{ position: "absolute", top: "-10%", right: "-5%", width: "45%", height: "80%", background: `radial-gradient(circle, color-mix(in srgb, var(--dt-primary) 20%, transparent), transparent 70%)`, borderRadius: "50%", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "-15%", left: "-5%", width: "35%", height: "60%", background: `radial-gradient(circle, color-mix(in srgb, var(--dt-accent) 12%, transparent), transparent 70%)`, borderRadius: "50%", pointerEvents: "none" }} />
      {(h.image_url || isEditorMode) && (
        <div style={{ position: "absolute", inset: 0, zIndex: 1 }}>
          <InlineImage
            section="hero"
            fieldKey="image_url"
            src={h.image_url}
            alt="Hero"
            onUpdateField={onUpdateField}
            isEditorMode={isEditorMode}
            isSelected={isSelected}
            isBackground={true}
            className="w-full h-full"
            style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.12 }}
            collapseSheetForInlineEdit={collapseSheetForInlineEdit}
          />
          <div style={{ position: "absolute", bottom: 4, right: 8, zIndex: 20 }}>
            <PhotoCredit
              credit={h.image_credit}
              language={language}
              section="hero"
              fieldKey="image_credit.name"
              onUpdateField={onUpdateField}
              isEditorMode={isEditorMode}
              isSelected={isSelected}
              collapseSheetForInlineEdit={collapseSheetForInlineEdit}
            />
          </div>
        </div>
      )}
    </>
  );
}

export function HeroCenteredLayout({
  hero,
  language,
  onUpdateField,
  isEditorMode,
  isSelected,
  collapseSheetForInlineEdit,
  onEditingStateChange,
  minHeight = "85vh",
}: HeroVariantProps & { minHeight?: string }) {
  return (
    <section style={{ position: "relative", minHeight, display: "flex", alignItems: "center", justifyContent: "center", padding: "5rem 1.5rem", background: hero.background_color || "var(--dt-bg)", overflow: "hidden" }}>
      <HeroDecorations hero={hero} language={language} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={isSelected} collapseSheetForInlineEdit={collapseSheetForInlineEdit} />
      <div style={{ maxWidth: "800px", textAlign: "center", position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: "1.25rem", alignItems: "center" }}>
        <HeroContent hero={hero} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={isSelected} collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} />
      </div>
    </section>
  );
}
