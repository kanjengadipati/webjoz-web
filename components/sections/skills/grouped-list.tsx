"use client";

import React from "react";
import { CheckCircle2, Wrench } from "lucide-react";
import { InlineText, DynamicIcon } from "@/components/templates/shared";
import { getLevelLabel, type SkillsVariantProps } from "./shared";

export default function SkillsGroupedList({
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
      <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
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

        {/* Groups Grid */}
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
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "1.75rem",
            }}
          >
            {groups.map((group, gIdx) => (
              <div
                key={gIdx}
                style={{
                  padding: "1.75rem",
                  borderRadius: radius,
                  background: brandSurface,
                  border: `1px solid color-mix(in srgb, ${brandPrimary} 15%, transparent)`,
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid color-mix(in srgb, ${brandPrimary} 10%, transparent)`, paddingBottom: "0.75rem" }}>
                  <h3
                    style={{
                      fontFamily: "var(--dt-heading-font)",
                      fontWeight: 600,
                      fontSize: "1.05rem",
                      color: brandText,
                      margin: 0,
                    }}
                  >
                    {group.name}
                  </h3>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      color: brandPrimary,
                      background: `color-mix(in srgb, ${brandPrimary} 10%, transparent)`,
                      padding: "0.2rem 0.55rem",
                      borderRadius: "9999px",
                    }}
                  >
                    {group.items?.length || 0}
                  </span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {(group.items || []).map((item, iIdx) => {
                    const levelLabel = getLevelLabel(item.level, language);
                    return (
                      <div
                        key={iIdx}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "0.6rem 0.75rem",
                          borderRadius: "calc(var(--dt-radius, 0.5rem) * 0.75)",
                          background: `color-mix(in srgb, ${brandPrimary} 4%, transparent)`,
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                          {item.icon ? (
                            <DynamicIcon name={item.icon} defaultIcon={Wrench} className="w-4 h-4" style={{ color: brandPrimary }} />
                          ) : (
                            <CheckCircle2 className="w-3.5 h-3.5" style={{ color: brandPrimary }} />
                          )}
                          <span style={{ fontSize: "0.875rem", fontWeight: 500, color: brandText }}>
                            {item.label}
                          </span>
                        </div>

                        {levelLabel && (
                          <span
                            style={{
                              fontSize: "0.7rem",
                              fontWeight: 600,
                              textTransform: "capitalize",
                              color: brandMuted,
                              background: `color-mix(in srgb, ${brandText} 6%, transparent)`,
                              padding: "0.15rem 0.5rem",
                              borderRadius: "4px",
                            }}
                          >
                            {levelLabel}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
