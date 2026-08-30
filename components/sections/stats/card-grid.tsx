"use client";
import React from "react";
import { Sparkles, TrendingUp, Users, Award, Shield, CheckCircle2, Zap } from "lucide-react";
import { DynamicIcon, InlineText } from "../../templates/shared";
import type { DesignToken, TemplateProps } from "../../templates/types";
import type { StatsVariantProps } from "./index";

export default function StatsCardGrid({
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
        background: brandBg,
      }}
    >
      <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
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
                background: `color-mix(in srgb, ${brandPrimary} 10%, transparent)`,
                padding: "0.4rem 0.9rem",
                borderRadius: "9999px",
                marginBottom: "0.5rem",
              }}
            >
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
          {(stats.title || isEditorMode) && (
            <h2
              style={{
                fontFamily: headingFont,
                fontWeight: headingWeight as any,
                fontSize: "clamp(1.5rem, 4cqw, 2.35rem)",
                color: brandText,
                marginTop: "0.5rem",
                lineHeight: 1.2,
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
                stats.title
              )}
            </h2>
          )}
          {(stats.subtitle || isEditorMode) && (
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.items.map((item, idx) => (
            <div
              key={idx}
              className="group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 p-6 md:p-8 flex flex-col justify-between"
              style={{
                background: "var(--dt-surface)",
                border: `1px solid color-mix(in srgb, ${brandPrimary} 16%, transparent)`,
                borderRadius: "var(--dt-radius-lg, 20px)",
                boxShadow: "0 6px 24px rgba(0,0,0,0.04)",
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                  style={{
                    background: `color-mix(in srgb, ${brandPrimary} 14%, transparent)`,
                    color: brandPrimary,
                  }}
                >
                  <DynamicIcon name={item.icon} defaultIcon={Zap} className="w-6 h-6" />
                </div>
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ background: brandPrimary, opacity: 0.7 }}
                />
              </div>

              <div>
                <div
                  style={{
                    fontFamily: headingFont,
                    fontWeight: 900,
                    fontSize: "clamp(2.25rem, 5cqw, 3.25rem)",
                    color: brandPrimary,
                    lineHeight: 1,
                    letterSpacing: "-0.03em",
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
                <h3
                  style={{
                    fontFamily: headingFont,
                    fontWeight: 700,
                    fontSize: "1.1rem",
                    color: brandText,
                    marginTop: "0.5rem",
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
                </h3>
                {(item.description || isEditorMode) && (
                  <p
                    style={{
                      fontSize: "0.85rem",
                      color: `color-mix(in srgb, ${brandText} 65%, transparent)`,
                      marginTop: "0.35rem",
                      lineHeight: 1.5,
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
