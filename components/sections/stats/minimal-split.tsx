"use client";
import React from "react";
import { Sparkles, TrendingUp, Users, Award, Shield, CheckCircle2, Flame } from "lucide-react";
import { DynamicIcon, InlineText } from "../../templates/shared";
import type { DesignToken, TemplateProps } from "../../templates/types";
import type { StatsVariantProps } from "./index";

export default function StatsMinimalSplit({
  stats,
  design_token,
  language,
  onUpdateField,
  isEditorMode = false,
  isSelected = false,
  collapseSheetForInlineEdit,
  onEditingStateChange,
}: StatsVariantProps) {
  if (!stats?.items?.length) return null;
  const brandPrimary = "var(--dt-primary)";
  const brandBg = "var(--dt-bg)";
  const brandText = "var(--dt-text)";
  const headingFont = "var(--dt-heading-font)";
  const headingWeight = "var(--dt-heading-weight)";

  const handleUpdateItem = (index: number, field: string, value: string) => {
    const next = [...(stats.items || [])];
    next[index] = { ...next[index], [field]: value };
    onUpdateField?.("stats", "items", next);
  };

  return (
    <section
      id="stats"
      style={{
        padding: "var(--dt-spacing) 1.5rem",
        background: `color-mix(in srgb, ${brandPrimary} 3%, ${brandBg})`,
        borderTop: `1px solid color-mix(in srgb, ${brandPrimary} 10%, transparent)`,
      }}
    >
      <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Heading & Narrative */}
          <div className="lg:col-span-5 space-y-4">
            {(stats.eyebrow || isEditorMode) && (
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
                }}
              >
                <Flame className="w-4 h-4" />
                {isEditorMode ? (
                  <InlineText
                    section="stats"
                    fieldKey="eyebrow"
                    value={stats.eyebrow || ""}
                    placeholder="Eyebrow..."
                    onUpdateField={onUpdateField}
                    isEditorMode={isEditorMode}
                    isSelected={isSelected}
                    collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                    onEditingStateChange={onEditingStateChange}
                    as="span"
                  />
                ) : (
                  stats.eyebrow
                )}
              </span>
            )}
            <h2
              style={{
                fontFamily: headingFont,
                fontWeight: headingWeight as any,
                fontSize: "clamp(1.75rem, 4.5cqw, 2.75rem)",
                color: brandText,
                lineHeight: 1.15,
              }}
            >
              {isEditorMode ? (
                <InlineText
                  section="stats"
                  fieldKey="title"
                  value={stats.title || ""}
                  placeholder="Judul Statistik..."
                  onUpdateField={onUpdateField}
                  isEditorMode={isEditorMode}
                  isSelected={isSelected}
                  collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                  onEditingStateChange={onEditingStateChange}
                  as="span"
                />
              ) : (
                stats.title || "Pencapaian Terbaik Kami"
              )}
            </h2>
            {(stats.subtitle || isEditorMode) && (
              <p
                style={{
                  color: `color-mix(in srgb, ${brandText} 70%, transparent)`,
                  fontSize: "1rem",
                  lineHeight: 1.6,
                }}
              >
                {isEditorMode ? (
                  <InlineText
                    section="stats"
                    fieldKey="subtitle"
                    value={stats.subtitle || ""}
                    placeholder="Subjudul..."
                    onUpdateField={onUpdateField}
                    isEditorMode={isEditorMode}
                    isSelected={isSelected}
                    collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                    onEditingStateChange={onEditingStateChange}
                    as="span"
                  />
                ) : (
                  stats.subtitle
                )}
              </p>
            )}
          </div>

          {/* Right Column: 2x2 Metric Matrix */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            {stats.items.map((item, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl transition-all duration-300 hover:border-primary/40"
                style={{
                  background: "var(--dt-surface)",
                  border: `1px solid color-mix(in srgb, ${brandPrimary} 15%, transparent)`,
                  boxShadow: "0 4px 16px rgba(0,0,0,0.03)",
                }}
              >
                {item.icon && (
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                    style={{
                      background: `color-mix(in srgb, ${brandPrimary} 12%, transparent)`,
                      color: brandPrimary,
                    }}
                  >
                    <DynamicIcon name={item.icon} defaultIcon={Award} className="w-5 h-5" />
                  </div>
                )}
                <div
                  style={{
                    fontFamily: headingFont,
                    fontWeight: 900,
                    fontSize: "clamp(2rem, 4.5cqw, 2.75rem)",
                    color: brandPrimary,
                    lineHeight: 1.1,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {isEditorMode ? (
                    <InlineText
                      section="stats"
                      fieldKey={`items.${idx}.value`}
                      value={item.value}
                      onUpdateField={(_, __, val) => handleUpdateItem(idx, "value", val)}
                      isEditorMode={isEditorMode}
                      isSelected={isSelected}
                      collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                      onEditingStateChange={onEditingStateChange}
                      as="span"
                    />
                  ) : (
                    item.value
                  )}
                </div>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    color: brandText,
                    marginTop: "0.35rem",
                  }}
                >
                  {isEditorMode ? (
                    <InlineText
                      section="stats"
                      fieldKey={`items.${idx}.label`}
                      value={item.label}
                      onUpdateField={(_, __, val) => handleUpdateItem(idx, "label", val)}
                      isEditorMode={isEditorMode}
                      isSelected={isSelected}
                      collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                      onEditingStateChange={onEditingStateChange}
                      as="span"
                    />
                  ) : (
                    item.label
                  )}
                </div>
                {(item.description || isEditorMode) && (
                  <p
                    style={{
                      fontSize: "0.8rem",
                      color: `color-mix(in srgb, ${brandText} 60%, transparent)`,
                      marginTop: "0.25rem",
                      lineHeight: 1.4,
                    }}
                  >
                    {isEditorMode ? (
                      <InlineText
                        section="stats"
                        fieldKey={`items.${idx}.description`}
                        value={item.description || ""}
                        placeholder="Keterangan..."
                        onUpdateField={(_, __, val) => handleUpdateItem(idx, "description", val)}
                        isEditorMode={isEditorMode}
                        isSelected={isSelected}
                        collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                        onEditingStateChange={onEditingStateChange}
                        as="span"
                      />
                    ) : (
                      item.description
                    )}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
