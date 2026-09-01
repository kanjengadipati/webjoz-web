"use client";
import React from "react";
import type { FooterVariantProps } from "./types";
import { InlineText } from "../../templates/shared";

const FOOTER_BG = "var(--dt-surface)";
const TXT_HIGH = "color-mix(in srgb, var(--dt-text) 90%, transparent)";
const TXT_MED = "color-mix(in srgb, var(--dt-text) 50%, transparent)";
const TXT_LOW = "color-mix(in srgb, var(--dt-text) 40%, transparent)";
const TXT_BASE = "color-mix(in srgb, var(--dt-text) 65%, transparent)";
const BORDER_TOP = "var(--dt-border)";

export default function MinimalBand({
  footer, brand_name, hasBlog,
  onUpdateField, isEditorMode = false, isSelected = false,
  collapseSheetForInlineEdit, onEditingStateChange,
}: FooterVariantProps) {
  const displayBrand = brand_name || "Bisnis Kami";
  const displayTagline = footer?.tagline || "";
  const displayCopyright = footer?.copyright_text || `© ${new Date().getFullYear()} ${displayBrand}. All rights reserved.`;
  return (
    <footer
      className="text-center py-10 text-xs space-y-1"
      style={{ background: FOOTER_BG, color: TXT_BASE, borderTop: `1px solid ${BORDER_TOP}` }}
    >
      <p className="text-sm font-bold" style={{ color: TXT_HIGH }}>
        <InlineText section="header" fieldKey="brand_name" value={displayBrand ?? ""} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={isSelected} collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} as="span" />
      </p>
      {(displayTagline || isEditorMode) && (
        <p style={{ color: TXT_MED }}>
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
        <a href="#blog" className="inline-block text-xs transition-colors hover:opacity-80" style={{ color: TXT_HIGH }}>
          Blog
        </a>
      )}
      <p style={{ color: TXT_LOW }}>
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
