"use client";
import React from "react";
import { TrendingUp } from "lucide-react";
import { DynamicIcon, InlineText } from "../../templates/shared";
import type { StatsVariantProps } from "./index";

export default function StatsBigNumberSpotlight({
  stats,
  language,
  onUpdateField,
  isEditorMode = false,
  isSelected = false,
  collapseSheetForInlineEdit,
  onEditingStateChange,
}: StatsVariantProps) {
  if (!stats?.items?.length) return null;
  const isEN = language === "en";
  const [hero, ...rest] = stats.items;

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
        background: "color-mix(in srgb, var(--dt-primary) 5%, var(--dt-bg))",
      }}
    >
      <div style={{ maxWidth: "56rem", margin: "0 auto", textAlign: "center" }}>
        {(stats.eyebrow || isEditorMode) && (
          <span
            style={{
              display: "inline-block", fontSize: "0.75rem", fontWeight: 800,
              textTransform: "uppercase", letterSpacing: "0.16em", color: "var(--dt-primary)", marginBottom: "1rem",
            }}
          >
            {isEditorMode ? (
              <InlineText
                section="stats" fieldKey="eyebrow" value={stats.eyebrow || ""}
                onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={isSelected}
                collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange}
                as="span"
              />
            ) : stats.eyebrow}
          </span>
        )}

        <div style={{ marginBottom: "2.5rem" }}>
          {hero.icon && (
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
              <DynamicIcon name={hero.icon} defaultIcon={TrendingUp} className="w-8 h-8" style={{ color: "var(--dt-primary)" }} />
            </div>
          )}
          <div style={{ fontFamily: "var(--dt-heading-font)", fontWeight: 900, fontSize: "clamp(3rem, 10cqw, 6rem)", color: "var(--dt-primary)", lineHeight: 1 }}>
            {isEditorMode ? (
              <InlineText
                section="stats" fieldKey="items.0.value" value={hero.value}
                onUpdateField={(_, __, val) => handleUpdateItem(0, "value", val)}
                isEditorMode={isEditorMode} isSelected={isSelected}
                collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange}
                as="span"
              />
            ) : hero.value}
          </div>
          <div style={{ fontFamily: "var(--dt-heading-font)", fontWeight: 700, fontSize: "1.25rem", color: "var(--dt-text)", marginTop: "0.5rem" }}>
            {isEditorMode ? (
              <InlineText
                section="stats" fieldKey="items.0.label" value={hero.label}
                onUpdateField={(_, __, val) => handleUpdateItem(0, "label", val)}
                isEditorMode={isEditorMode} isSelected={isSelected}
                collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange}
                as="span"
              />
            ) : hero.label}
          </div>
          {(hero.description || isEditorMode) && (
            <p style={{ color: "color-mix(in srgb, var(--dt-text) 65%, transparent)", fontSize: "0.9rem", marginTop: "0.5rem", maxWidth: "32rem", marginInline: "auto" }}>
              {isEditorMode ? (
                <InlineText
                  section="stats" fieldKey="items.0.description" value={hero.description || ""}
                  onUpdateField={(_, __, val) => handleUpdateItem(0, "description", val)}
                  isEditorMode={isEditorMode} isSelected={isSelected} multiline
                  collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange}
                  as="span"
                />
              ) : hero.description}
            </p>
          )}
        </div>

        {rest.length > 0 && (
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4" style={{ borderTop: "1px solid color-mix(in srgb, var(--dt-primary) 15%, transparent)", paddingTop: "1.5rem" }}>
            {rest.map((item, i) => {
              const idx = i + 1;
              return (
                <div key={idx} style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: "var(--dt-heading-font)", fontWeight: 800, fontSize: "1.5rem", color: "var(--dt-text)" }}>
                    {isEditorMode ? (
                      <InlineText
                        section="stats" fieldKey={`items.${idx}.value`} value={item.value}
                        onUpdateField={(_, __, val) => handleUpdateItem(idx, "value", val)}
                        isEditorMode={isEditorMode} isSelected={isSelected}
                        collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange}
                        as="span"
                      />
                    ) : item.value}
                  </div>
                  <div style={{ color: "color-mix(in srgb, var(--dt-text) 65%, transparent)", fontSize: "0.8rem" }}>
                    {isEditorMode ? (
                      <InlineText
                        section="stats" fieldKey={`items.${idx}.label`} value={item.label}
                        onUpdateField={(_, __, val) => handleUpdateItem(idx, "label", val)}
                        isEditorMode={isEditorMode} isSelected={isSelected}
                        collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange}
                        as="span"
                      />
                    ) : item.label}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}