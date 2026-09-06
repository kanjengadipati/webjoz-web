"use client";
import React from "react";
import { Handshake } from "lucide-react";
import { InlineText } from "../../templates/shared";
import type { PartnersVariantProps } from "./index";

export default function PartnersFeaturedCollabGrid({
  partners,
  language,
  onUpdateField,
  isEditorMode = false,
  isSelected = false,
  collapseSheetForInlineEdit,
  onEditingStateChange,
}: PartnersVariantProps) {
  if (!partners?.items?.length) return null;
  const isEN = language === "en";

  const handleUpdateItem = (index: number, field: string, value: string) => {
    const next = [...(partners.items || [])];
    next[index] = { ...next[index], [field]: value };
    onUpdateField?.("partners", "items", next);
  };

  return (
    <section
      id="partners"
      style={{ padding: "var(--dt-spacing) 1.5rem", background: "var(--dt-bg)" }}
    >
      <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
        {(partners.title || partners.eyebrow || isEditorMode) && (
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            {(partners.eyebrow || isEditorMode) && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.16em", color: "var(--dt-primary)", marginBottom: "0.5rem" }}>
                <Handshake className="w-3.5 h-3.5" />
                {isEditorMode ? (
                  <InlineText
                    section="partners" fieldKey="eyebrow" value={partners.eyebrow || ""}
                    onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={isSelected}
                    collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange}
                    as="span"
                  />
                ) : partners.eyebrow}
              </span>
            )}
            <h2 style={{ fontFamily: "var(--dt-heading-font)", fontWeight: "var(--dt-heading-weight)" as any, fontSize: "clamp(1.5rem, 4cqw, 2rem)", color: "var(--dt-text)" }}>
              {isEditorMode ? (
                <InlineText
                  section="partners" fieldKey="title" value={partners.title || ""}
                  placeholder={isEN ? "Brand Collaborations..." : "Kolaborasi Brand..."}
                  onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={isSelected}
                  collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange}
                  as="span"
                />
              ) : (partners.title || (isEN ? "Brands We've Worked With" : "Brand yang Pernah Berkolaborasi"))}
            </h2>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {partners.items.map((item, idx) => (
            <div
              key={idx}
              style={{
                background: "var(--dt-surface)",
                border: "1px solid color-mix(in srgb, var(--dt-primary) 12%, transparent)",
                borderRadius: "var(--dt-radius-lg)",
                padding: "1.5rem 1rem",
                textAlign: "center",
                transition: "transform 0.2s",
              }}
              className="hover:-translate-y-1"
            >
              <div style={{ width: "3.5rem", height: "3.5rem", margin: "0 auto 0.75rem", borderRadius: "9999px", overflow: "hidden", background: "color-mix(in srgb, var(--dt-primary) 8%, transparent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {item.logo_url ? (
                  <img src={item.logo_url} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <span style={{ fontFamily: "var(--dt-heading-font)", fontWeight: 800, fontSize: "1.1rem", color: "var(--dt-primary)" }}>
                    {item.name?.[0]?.toUpperCase() || "?"}
                  </span>
                )}
              </div>
              <div style={{ fontFamily: "var(--dt-heading-font)", fontWeight: 700, fontSize: "0.9rem", color: "var(--dt-text)" }}>
                {isEditorMode ? (
                  <InlineText
                    section="partners" fieldKey={`items.${idx}.name`} value={item.name}
                    onUpdateField={(_, __, val) => handleUpdateItem(idx, "name", val)}
                    isEditorMode={isEditorMode} isSelected={isSelected}
                    collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange}
                    as="span"
                  />
                ) : item.name}
              </div>
              {(item.category || isEditorMode) && (
                <div style={{ color: "color-mix(in srgb, var(--dt-text) 60%, transparent)", fontSize: "0.7rem", marginTop: "0.25rem" }}>
                  {isEditorMode ? (
                    <InlineText
                      section="partners" fieldKey={`items.${idx}.category`} value={item.category || ""}
                      placeholder={isEN ? "Role..." : "Peran..."}
                      onUpdateField={(_, __, val) => handleUpdateItem(idx, "category", val)}
                      isEditorMode={isEditorMode} isSelected={isSelected}
                      collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange}
                      as="span"
                    />
                  ) : item.category}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}