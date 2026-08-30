"use client";
import React from "react";
import { Handshake } from "lucide-react";
import { InlineText } from "../../templates/shared";
import type { DesignToken, TemplateProps } from "../../templates/types";
import type { PartnersVariantProps } from "./index";

export default function PartnersMarquee({
  partners,
  design_token,
  language,
  onUpdateField,
  isEditorMode = false,
  isSelected = false,
  collapseSheetForInlineEdit,
  onEditingStateChange,
}: PartnersVariantProps) {
  if (!partners?.items?.length) return null;
  const brandPrimary = "var(--dt-primary)";
  const brandBg = "var(--dt-bg)";
  const brandText = "var(--dt-text)";
  const headingFont = "var(--dt-heading-font)";
  const headingWeight = "var(--dt-heading-weight)";

  const handleUpdateItem = (index: number, field: string, value: string) => {
    const next = [...(partners.items || [])];
    next[index] = { ...next[index], [field]: value };
    onUpdateField?.("partners", "items", next);
  };

  // In editor mode, avoid duplicate keys and infinite animation jumps during editing
  const displayItems = isEditorMode ? partners.items : [...partners.items, ...partners.items, ...partners.items];

  return (
    <section
      id="partners"
      className="overflow-hidden py-10 relative"
      style={{
        background: `color-mix(in srgb, ${brandPrimary} 4%, ${brandBg})`,
        borderTop: `1px solid color-mix(in srgb, ${brandPrimary} 12%, transparent)`,
        borderBottom: `1px solid color-mix(in srgb, ${brandPrimary} 12%, transparent)`,
      }}
    >
      <div style={{ maxWidth: "72rem", margin: "0 auto", padding: "0 1.5rem" }}>
        {(partners.title || partners.eyebrow || isEditorMode) && (
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            {(partners.eyebrow || isEditorMode) && (
              <span
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "0.18em",
                  color: brandPrimary,
                  display: "block",
                  marginBottom: "0.35rem",
                }}
              >
                {isEditorMode ? (
                  <InlineText
                    section="partners"
                    fieldKey="eyebrow"
                    value={partners.eyebrow || ""}
                    placeholder="Eyebrow..."
                    onUpdateField={onUpdateField}
                    isEditorMode={isEditorMode}
                    isSelected={isSelected}
                    collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                    onEditingStateChange={onEditingStateChange}
                    as="span"
                  />
                ) : (
                  partners.eyebrow
                )}
              </span>
            )}
            {(partners.title || isEditorMode) && (
              <h2
                style={{
                  fontFamily: headingFont,
                  fontWeight: headingWeight as any,
                  fontSize: "clamp(1.35rem, 3.5cqw, 1.85rem)",
                  color: brandText,
                }}
              >
                {isEditorMode ? (
                  <InlineText
                    section="partners"
                    fieldKey="title"
                    value={partners.title || ""}
                    placeholder="Judul Mitra..."
                    onUpdateField={onUpdateField}
                    isEditorMode={isEditorMode}
                    isSelected={isSelected}
                    collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                    onEditingStateChange={onEditingStateChange}
                    as="span"
                  />
                ) : (
                  partners.title
                )}
              </h2>
            )}
          </div>
        )}
      </div>

      {/* Marquee Wrapper with side fade gradients */}
      <div className="relative w-full overflow-hidden">
        {!isEditorMode && (
          <>
            <div
              className="absolute left-0 inset-y-0 w-24 z-10 pointer-events-none"
              style={{
                background: `linear-gradient(to right, color-mix(in srgb, ${brandPrimary} 4%, ${brandBg}), transparent)`,
              }}
            />
            <div
              className="absolute right-0 inset-y-0 w-24 z-10 pointer-events-none"
              style={{
                background: `linear-gradient(to left, color-mix(in srgb, ${brandPrimary} 4%, ${brandBg}), transparent)`,
              }}
            />
          </>
        )}

        {/* Moving track */}
        <div className={`flex gap-4 md:gap-6 ${isEditorMode ? "flex-wrap justify-center px-4" : "animate-[marquee_25s_linear_infinite] hover:[animation-play-state:paused] w-max py-2"}`}>
          {displayItems.map((partner, idx) => {
            const realIdx = idx % partners.items.length;
            return (
              <div
                key={idx}
                className="flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-200 hover:scale-105 select-none"
                style={{
                  background: "var(--dt-surface)",
                  border: `1px solid color-mix(in srgb, ${brandPrimary} 15%, transparent)`,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                }}
              >
                <div
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ background: brandPrimary }}
                />
                <span
                  style={{
                    fontFamily: headingFont,
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    color: brandText,
                    whiteSpace: "nowrap",
                  }}
                >
                  {isEditorMode ? (
                    <InlineText
                      section="partners"
                      fieldKey={`items.${realIdx}.name`}
                      value={partner.name}
                      onUpdateField={(_, __, val) => handleUpdateItem(realIdx, "name", val)}
                      isEditorMode={isEditorMode}
                      isSelected={isSelected}
                      collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                      onEditingStateChange={onEditingStateChange}
                      as="span"
                    />
                  ) : (
                    partner.name
                  )}
                </span>
                {(partner.category || isEditorMode) && (
                  <span
                    style={{
                      fontSize: "0.7rem",
                      fontWeight: 600,
                      color: `color-mix(in srgb, ${brandText} 50%, transparent)`,
                      marginLeft: "0.25rem",
                    }}
                  >
                    • {isEditorMode ? (
                      <InlineText
                        section="partners"
                        fieldKey={`items.${realIdx}.category`}
                        value={partner.category || ""}
                        placeholder="Kategori..."
                        onUpdateField={(_, __, val) => handleUpdateItem(realIdx, "category", val)}
                        isEditorMode={isEditorMode}
                        isSelected={isSelected}
                        collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                        onEditingStateChange={onEditingStateChange}
                        as="span"
                      />
                    ) : (
                      partner.category
                    )}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
