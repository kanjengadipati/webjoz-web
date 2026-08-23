"use client";
import React from "react";
import type { FooterVariantProps } from "./types";
import { InlineText } from "../../templates/shared";

export default function DarkContrastBand({
  footer, brand_name, hasBlog,
  onUpdateField, isEditorMode = false, isSelected = false,
  collapseSheetForInlineEdit, onEditingStateChange,
}: FooterVariantProps) {
  const displayBrand = brand_name || "Bisnis Kami";
  const displayTagline = footer?.tagline || "";
  const displayCopyright = footer?.copyright_text || `\u00A9 ${new Date().getFullYear()} ${displayBrand}. All rights reserved.`;
  return (
    <footer
      className="text-center py-10 text-xs space-y-1"
      style={{ background: "var(--dt-bg)", color: "color-mix(in srgb, var(--dt-text) 65%, transparent)", borderTop: "1px solid color-mix(in srgb, var(--dt-primary) 20%, transparent)" }}
    >
      <p className="text-sm font-bold" style={{ color: "var(--dt-primary)" }}>{displayBrand}</p>
      {(displayTagline || isEditorMode) && (
        <p style={{ color: "color-mix(in srgb, var(--dt-text) 50%, transparent)" }}>
          {isEditorMode ? (
            <InlineText
              section="footer"
              fieldKey="tagline"
              value={displayTagline}
              placeholder="Tambah tagline..."
              onUpdateField={onUpdateField}
              isEditorMode={isEditorMode}
              isSelected={isSelected}
              collapseSheetForInlineEdit={collapseSheetForInlineEdit}
              onEditingStateChange={onEditingStateChange}
              as="span"
            />
          ) : displayTagline}
        </p>
      )}
      {hasBlog && (
        <a href="#blog" className="inline-block text-xs transition-colors hover:opacity-80" style={{ color: "var(--dt-primary)" }}>
          Blog
        </a>
      )}
      <p style={{ color: "color-mix(in srgb, var(--dt-text) 40%, transparent)" }}>
        {isEditorMode ? (
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
        ) : displayCopyright}
      </p>
    </footer>
  );
}
