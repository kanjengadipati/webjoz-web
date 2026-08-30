"use client";
import React from "react";
import { Sparkles, TrendingUp, Users, Award, Shield, CheckCircle2 } from "lucide-react";
import { DynamicIcon, InlineText } from "../../templates/shared";
import type { DesignToken, TemplateProps } from "../../templates/types";
import type { StatsVariantProps } from "./index";

export default function StatsCounterRow({
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
        background: `color-mix(in srgb, ${brandPrimary} 4%, ${brandBg})`,
        borderTop: `1px solid color-mix(in srgb, ${brandPrimary} 12%, transparent)`,
        borderBottom: `1px solid color-mix(in srgb, ${brandPrimary} 12%, transparent)`,
      }}
    >
      <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
        {(stats.title || stats.eyebrow || isEditorMode) && (
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
                  letterSpacing: "0.15em",
                  color: brandPrimary,
                  background: `color-mix(in srgb, ${brandPrimary} 10%, transparent)`,
                  padding: "0.35rem 0.85rem",
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
                  fontSize: "clamp(1.5rem, 4cqw, 2.25rem)",
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
        )}

        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 divide-y md:divide-y-0 md:divide-x divide-white/10"
          style={{
            background: "var(--dt-surface)",
            borderRadius: "var(--dt-radius-lg, 16px)",
            padding: "2rem 1.5rem",
            border: `1px solid color-mix(in srgb, ${brandPrimary} 15%, transparent)`,
            boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
          }}
        >
          {stats.items.map((item, idx) => (
            <div
              key={idx}
              className={`flex flex-col items-center text-center p-4 ${idx > 0 ? "pt-6 md:pt-4" : ""}`}
            >
              {item.icon && (
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                  style={{
                    background: `color-mix(in srgb, ${brandPrimary} 12%, transparent)`,
                    color: brandPrimary,
                  }}
                >
                  <DynamicIcon name={item.icon} defaultIcon={TrendingUp} className="w-5 h-5" />
                </div>
              )}
              <span
                style={{
                  fontFamily: headingFont,
                  fontWeight: 900,
                  fontSize: "clamp(2rem, 5cqw, 3rem)",
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
              </span>
              <span
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
              </span>
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
    </section>
  );
}
