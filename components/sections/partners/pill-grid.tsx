"use client";
import React from "react";
import { Handshake, ArrowUpRight, Sparkles } from "lucide-react";
import { InlineText } from "../../templates/shared";
import type { DesignToken, TemplateProps } from "../../templates/types";
import type { PartnersVariantProps } from "./index";

export default function PartnersPillGrid({
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
                marginBottom: "0.5rem",
              }}
            >
              <Sparkles className="w-3.5 h-3.5" />
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

        <div className="flex flex-wrap justify-center gap-3 md:gap-4 max-w-4xl mx-auto">
          {partners.items.map((partner, idx) => {
            const ItemTag = (!isEditorMode && partner.url) ? "a" : "div";
            return (
              <ItemTag
                key={idx}
                {...((!isEditorMode && partner.url) ? { href: partner.url, target: "_blank", rel: "noopener noreferrer" } : {})}
                className="group inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md cursor-default"
                style={{
                  background: "var(--dt-surface)",
                  border: `1px solid color-mix(in srgb, ${brandPrimary} 18%, transparent)`,
                  cursor: (!isEditorMode && partner.url) ? "pointer" : "default",
                }}
              >
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{
                    background: `color-mix(in srgb, ${brandPrimary} 15%, transparent)`,
                    color: brandPrimary,
                  }}
                >
                  {partner.name.charAt(0)}
                </div>
                <span
                  style={{
                    fontFamily: headingFont,
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    color: brandText,
                  }}
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
                {(partner.category || isEditorMode) && (
                  <span
                    className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full"
                    style={{
                      background: `color-mix(in srgb, ${brandPrimary} 8%, transparent)`,
                      color: brandPrimary,
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
                {partner.url && !isEditorMode && (
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                )}
              </ItemTag>
            );
          })}
        </div>
      </div>
    </section>
  );
}
