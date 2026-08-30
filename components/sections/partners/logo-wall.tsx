"use client";
import React from "react";
import { Handshake, ExternalLink } from "lucide-react";
import { InlineText } from "../../templates/shared";
import type { DesignToken, TemplateProps } from "../../templates/types";
import type { PartnersVariantProps } from "./index";

export default function PartnersLogoWall({
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

  return (
    <section
      id="partners"
      style={{
        padding: "var(--dt-spacing) 1.5rem",
        background: brandBg,
        borderTop: `1px solid color-mix(in srgb, ${brandPrimary} 10%, transparent)`,
      }}
    >
      <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          {(partners.eyebrow || isEditorMode) && (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                fontSize: "0.75rem",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.18em",
                color: brandPrimary,
                background: `color-mix(in srgb, ${brandPrimary} 10%, transparent)`,
                padding: "0.35rem 0.85rem",
                borderRadius: "9999px",
                marginBottom: "0.5rem",
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
                fontSize: "clamp(1.5rem, 4cqw, 2.25rem)",
                color: brandText,
                marginTop: "0.5rem",
                lineHeight: 1.2,
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
          {(partners.subtitle || isEditorMode) && (
            <p
              style={{
                color: `color-mix(in srgb, ${brandText} 70%, transparent)`,
                fontSize: "0.95rem",
                maxWidth: "36rem",
                margin: "0.5rem auto 0",
              }}
            >
              {isEditorMode ? (
                <InlineText
                  section="partners"
                  fieldKey="subtitle"
                  value={partners.subtitle || ""}
                  placeholder="Subjudul..."
                  onUpdateField={onUpdateField}
                  isEditorMode={isEditorMode}
                  isSelected={isSelected}
                  collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                  onEditingStateChange={onEditingStateChange}
                  as="span"
                />
              ) : (
                partners.subtitle
              )}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-5">
          {partners.items.map((partner, idx) => {
            const ItemTag = (!isEditorMode && partner.url) ? "a" : "div";
            return (
              <ItemTag
                key={idx}
                {...((!isEditorMode && partner.url) ? { href: partner.url, target: "_blank", rel: "noopener noreferrer" } : {})}
                className="group flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md text-center"
                style={{
                  background: "var(--dt-surface)",
                  border: `1px solid color-mix(in srgb, ${brandPrimary} 12%, transparent)`,
                  minHeight: "80px",
                }}
              >
                {partner.logo_url ? (
                  <img
                    src={partner.logo_url}
                    alt={partner.name}
                    className="max-h-8 max-w-[100px] object-contain opacity-70 group-hover:opacity-100 transition-opacity filter grayscale group-hover:grayscale-0"
                  />
                ) : (
                  <div className="flex items-center gap-1.5">
                    <span
                      style={{
                        fontFamily: headingFont,
                        fontWeight: 700,
                        fontSize: "0.95rem",
                        color: brandText,
                        opacity: 0.85,
                      }}
                      className="group-hover:opacity-100 transition-opacity"
                    >
                      {isEditorMode ? (
                        <InlineText
                          section="partners"
                          fieldKey={`items.${idx}.name`}
                          value={partner.name}
                          onUpdateField={(_, __, val) => handleUpdateItem(idx, "name", val)}
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
                    {partner.url && !isEditorMode && <ExternalLink className="w-3 h-3 opacity-40 group-hover:opacity-80" />}
                  </div>
                )}
                {(partner.category || isEditorMode) && (
                  <span
                    style={{
                      fontSize: "0.65rem",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      color: `color-mix(in srgb, ${brandText} 50%, transparent)`,
                      marginTop: "0.25rem",
                    }}
                  >
                    {isEditorMode ? (
                      <InlineText
                        section="partners"
                        fieldKey={`items.${idx}.category`}
                        value={partner.category || ""}
                        placeholder="Kategori..."
                        onUpdateField={(_, __, val) => handleUpdateItem(idx, "category", val)}
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
              </ItemTag>
            );
          })}
        </div>
      </div>
    </section>
  );
}
