"use client";
import React from "react";
import { MapPin, Clock, ExternalLink } from "lucide-react";
import type { FooterVariantProps } from "./types";
import { InlineText } from "../../templates/shared";

export default function LocationAndHours({
  footer, brand_name, hasBlog,
  contactAddress, contactMapsUrl, contactOpeningHours,
  onUpdateField, isEditorMode = false, isSelected = false,
  collapseSheetForInlineEdit, onEditingStateChange,
}: FooterVariantProps) {
  const displayBrand = brand_name || "Bisnis Kami";
  const displayTagline = footer?.tagline || "";
  const displayCopyright = footer?.copyright_text || `\u00A9 ${new Date().getFullYear()} ${displayBrand}. All rights reserved.`;
  const hasLocation = Boolean(contactAddress);
  const hasHours = Boolean(contactOpeningHours);

  return (
    <footer style={{
      background: "var(--dt-bg)",
      color: "var(--dt-text-muted)",
      borderTop: "1px solid color-mix(in srgb, var(--dt-primary) 12%, transparent)",
    }}>
      <div style={{ maxWidth: "72rem", margin: "0 auto", padding: "2rem 1.5rem" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: hasLocation || hasHours ? "repeat(auto-fit, minmax(220px, 1fr))" : "1fr",
          gap: "2rem",
          alignItems: "start",
        }}>
          {/* Brand + tagline */}
          <div>
            <p style={{ fontFamily: "var(--dt-heading-font)", fontWeight: 700, fontSize: "0.95rem", color: "var(--dt-text)", margin: "0 0 0.5rem" }}>
              <InlineText section="header" fieldKey="brand_name" value={displayBrand ?? ""} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={isSelected} collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} as="span" />
            </p>
            {(displayTagline || isEditorMode) && (
              <p style={{ fontSize: "0.8rem", lineHeight: 1.5, margin: 0 }}>
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
              <a href="#blog" style={{ display: "inline-block", fontSize: "0.75rem", color: "var(--dt-primary)", marginTop: "0.5rem", textDecoration: "none" }}>
                Blog
              </a>
            )}
          </div>

          {/* Address */}
          {hasLocation && (
            <div style={{ display: "flex", alignItems: "flex-start", gap: "0.625rem" }}>
              <div style={{
                width: 32, height: 32, flexShrink: 0,
                background: "color-mix(in srgb, var(--dt-primary) 10%, transparent)",
                borderRadius: "var(--dt-radius)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <MapPin style={{ width: 14, height: 14, color: "var(--dt-primary)" }} />
              </div>
              <div>
                <p style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--dt-text-muted)", margin: "0 0 0.25rem" }}>Alamat</p>
                <p style={{ fontSize: "0.8rem", lineHeight: 1.5, margin: 0, color: "var(--dt-text)" }}>{contactAddress}</p>
                {contactMapsUrl && (
                  <a href={contactMapsUrl} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem", fontSize: "0.7rem", color: "var(--dt-primary)", marginTop: "0.375rem", textDecoration: "none" }}>
                    Lihat peta <ExternalLink style={{ width: 10, height: 10 }} />
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Opening hours */}
          {hasHours && (
            <div style={{ display: "flex", alignItems: "flex-start", gap: "0.625rem" }}>
              <div style={{
                width: 32, height: 32, flexShrink: 0,
                background: "color-mix(in srgb, var(--dt-primary) 10%, transparent)",
                borderRadius: "var(--dt-radius)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Clock style={{ width: 14, height: 14, color: "var(--dt-primary)" }} />
              </div>
              <div>
                <p style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--dt-text-muted)", margin: "0 0 0.25rem" }}>Jam Operasional</p>
                <p style={{ fontSize: "0.8rem", lineHeight: 1.5, margin: 0, color: "var(--dt-text)", whiteSpace: "pre-line" }}>{contactOpeningHours}</p>
              </div>
            </div>
          )}
        </div>

        {/* Copyright */}
        <div style={{ marginTop: "1.5rem", paddingTop: "1rem", borderTop: "1px solid color-mix(in srgb, var(--dt-primary) 8%, transparent)", textAlign: "center", fontSize: "0.7rem", color: "color-mix(in srgb, var(--dt-text) 40%, transparent)" }}>
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
        </div>
      </div>
    </footer>
  );
}
