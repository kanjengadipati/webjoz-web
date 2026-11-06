"use client";

import React from "react";
import { Wrench } from "lucide-react";
import { InlineText, DynamicIcon } from "@/components/templates/shared";
import type { SkillsVariantProps } from "./shared";

export default function SkillsChips({
  skills,
  design_token,
  language = "id",
  onUpdateField,
  isEditorMode = false,
  isSelected = false,
  collapseSheetForInlineEdit,
  onEditingStateChange,
}: SkillsVariantProps) {
  const groups = skills.groups || [];
  if (!groups.length && !isEditorMode) return null;

  const brandPrimary = "var(--dt-primary)";
  const brandBg = "var(--dt-bg)";
  const brandText = "var(--dt-text)";
  const brandMuted = "var(--dt-text-muted)";
  const brandSurface = "var(--dt-surface)";
  const radius = "var(--dt-radius, 0.5rem)";

  return (
    <section
      id="skills"
      style={{
        padding: "var(--dt-spacing, 5rem) 1.5rem",
        background: brandBg,
        position: "relative",
      }}
    >
      <div style={{ maxWidth: "68rem", margin: "0 auto" }}>
        {/* Section Header */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          {(Boolean(skills.eyebrow?.trim()) || isEditorMode) && (
            <span
              style={{
                display: "inline-block",
                fontSize: "0.75rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                color: brandPrimary,
                background: `color-mix(in srgb, ${brandPrimary} 10%, transparent)`,
                padding: "0.3rem 0.8rem",
                borderRadius: "9999px",
                marginBottom: "0.75rem",
              }}
            >
              <InlineText
                section="skills"
                fieldKey="eyebrow"
                value={skills.eyebrow || "Keahlian"}
                onUpdateField={onUpdateField}
                isEditorMode={isEditorMode}
                isSelected={isSelected}
                as="span"
                collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                onEditingStateChange={onEditingStateChange}
              />
            </span>
          )}

          <InlineText
            section="skills"
            fieldKey="title"
            value={skills.title || "Toolkit & Keahlian"}
            onUpdateField={onUpdateField}
            isEditorMode={isEditorMode}
            isSelected={isSelected}
            as="h2"
            style={{
              fontFamily: "var(--dt-heading-font)",
              fontWeight: "var(--dt-heading-weight)" as any,
              fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
              color: brandText,
              lineHeight: 1.2,
              margin: "0 0 0.75rem",
            }}
            collapseSheetForInlineEdit={collapseSheetForInlineEdit}
            onEditingStateChange={onEditingStateChange}
          />

          {(Boolean(skills.subtitle?.trim()) || isEditorMode) && (
            <InlineText
              section="skills"
              fieldKey="subtitle"
              value={skills.subtitle || ""}
              onUpdateField={onUpdateField}
              isEditorMode={isEditorMode}
              isSelected={isSelected}
              as="p"
              style={{
                fontSize: "1rem",
                color: brandMuted,
                maxWidth: "36rem",
                margin: "0 auto",
                lineHeight: 1.6,
              }}
              collapseSheetForInlineEdit={collapseSheetForInlineEdit}
              onEditingStateChange={onEditingStateChange}
            />
          )}
        </div>

        {/* Groups & Chips */}
        {groups.length === 0 && isEditorMode ? (
          <div
            style={{
              padding: "2.5rem",
              textAlign: "center",
              borderRadius: radius,
              border: `1px dashed color-mix(in srgb, ${brandPrimary} 30%, transparent)`,
              color: brandMuted,
              fontSize: "0.875rem",
            }}
          >
            Belum ada keahlian yang ditambahkan. Buka editor sidebar untuk menambah kategori &amp; skill.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
            {groups.map((group, gIdx) => (
              <div
                key={gIdx}
                style={{
                  padding: "1.75rem 2rem",
                  borderRadius: radius,
                  background: `color-mix(in srgb, ${brandSurface} 70%, transparent)`,
                  border: `1px solid color-mix(in srgb, ${brandPrimary} 12%, transparent)`,
                }}
              >
                {Boolean(group.name?.trim()) && (
                  <h3
                    style={{
                      fontFamily: "var(--dt-heading-font)",
                      fontWeight: 600,
                      fontSize: "0.95rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      color: brandPrimary,
                      margin: "0 0 1.25rem 0",
                    }}
                  >
                    {group.name}
                  </h3>
                )}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.65rem" }}>
                  {(group.items || []).map((item, iIdx) => (
                    <span
                      key={iIdx}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.45rem",
                        padding: "0.45rem 1rem",
                        borderRadius: "9999px",
                        fontSize: "0.875rem",
                        fontWeight: 500,
                        color: brandText,
                        background: `color-mix(in srgb, ${brandPrimary} 8%, var(--dt-surface))`,
                        border: `1px solid color-mix(in srgb, ${brandPrimary} 18%, transparent)`,
                        transition: "all 0.15s ease",
                      }}
                    >
                      {item.icon ? (
                        <DynamicIcon name={item.icon} defaultIcon={Wrench} className="w-3.5 h-3.5" style={{ color: brandPrimary }} />
                      ) : (
                        <span
                          style={{
                            width: "6px",
                            height: "6px",
                            borderRadius: "50%",
                            background: brandPrimary,
                            display: "inline-block",
                          }}
                        />
                      )}
                      <span>{item.label}</span>
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
