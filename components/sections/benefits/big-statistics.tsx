"use client";
import React from "react";
import { TrendingUp } from "lucide-react";
import { DynamicIcon, InlineText } from "../../templates/shared";
import { InlineAddTile, InlineDeleteButton } from "../inline-add";
import type { DesignToken, TemplateProps } from "../../templates/types";

interface BenefitsVariantProps {
  benefits: TemplateProps["content"]["benefits"];
  design_token?: DesignToken | null;
  onUpdateField?: (section: string, key: string, value: any) => void;
  isEditorMode?: boolean;
  isSelected?: boolean;
  collapseSheetForInlineEdit?: () => void;
  onEditingStateChange?: (isEditing: boolean) => void;
  onAddItem?: () => void;
  language?: "id" | "en";
}

export default function BenefitsBigStatistics({
  benefits: b,
  onUpdateField,
  isEditorMode,
  isSelected,
  collapseSheetForInlineEdit,
  onEditingStateChange,
  language = "id",
  onAddItem,
}: BenefitsVariantProps) {
  const isEN = language === "en";
  const items = b?.items ?? [];

  const handleDeleteItem = (indexToDelete: number) => {
    if (!onUpdateField) return;
    const newItems = items.filter((_, i) => i !== indexToDelete);
    onUpdateField("benefits", "items", newItems);
  };

  const gridColsClass =
    items.length <= 2
      ? "grid-cols-1 sm:grid-cols-2"
      : items.length === 3
      ? "grid-cols-1 sm:grid-cols-3"
      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";

  return (
    <section
      id="benefits"
      style={{
        padding: `var(--dt-spacing) 1.5rem`,
        background: `color-mix(in srgb, var(--dt-primary) 3.5%, var(--dt-bg))`,
        borderTop: `1px solid color-mix(in srgb, var(--dt-primary) 10%, transparent)`,
        borderBottom: `1px solid color-mix(in srgb, var(--dt-primary) 10%, transparent)`,
      }}
    >
      <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          {(b?.eyebrow || isEditorMode) && (
            <div className="mb-2">
              <span
                style={{
                  display: "inline-block",
                  fontSize: "0.75rem",
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "0.15em",
                  color: "var(--dt-primary)",
                  background: `color-mix(in srgb, var(--dt-primary) 10%, transparent)`,
                  border: `1px solid color-mix(in srgb, var(--dt-primary) 18%, transparent)`,
                  padding: "0.25rem 0.75rem",
                  borderRadius: "999px",
                }}
              >
                <InlineText
                  section="benefits"
                  fieldKey="eyebrow"
                  value={b.eyebrow || (isEN ? "Proven Results" : "Hasil Terbukti")}
                  placeholder={isEN ? "Proven Results" : "Hasil Terbukti"}
                  onUpdateField={onUpdateField}
                  isEditorMode={isEditorMode}
                  isSelected={isSelected}
                  as="span"
                  collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                  onEditingStateChange={onEditingStateChange}
                />
              </span>
            </div>
          )}
          <h2
            style={{
              fontFamily: "var(--dt-heading-font)",
              fontWeight: "var(--dt-heading-weight)" as any,
              fontSize: "clamp(1.5rem, 4.5cqw, 2.5rem)",
              color: "var(--dt-text)",
              margin: 0,
            }}
          >
            <InlineText
              section="benefits"
              fieldKey="title"
              value={b.title || (isEN ? "Impact That Speaks for Itself" : "Dampak Nyata yang Terukur")}
              placeholder={isEN ? "Impact That Speaks for Itself" : "Dampak Nyata yang Terukur"}
              onUpdateField={onUpdateField}
              isEditorMode={isEditorMode}
              isSelected={isSelected}
              as="span"
              collapseSheetForInlineEdit={collapseSheetForInlineEdit}
              onEditingStateChange={onEditingStateChange}
            />
          </h2>
          {(b?.subtitle || isEditorMode) && (
            <p
              style={{
                color: "var(--dt-text-muted)",
                maxWidth: "38rem",
                margin: "0.75rem auto 0",
                lineHeight: 1.6,
                fontSize: "0.95rem",
              }}
            >
              <InlineText
                section="benefits"
                fieldKey="subtitle"
                value={b.subtitle}
                placeholder={isEN ? "Real, verifiable metrics from our trusted partnerships and clients" : "Metrik dan data nyata dari kepuasan serta keberhasilan mitra kami"}
                onUpdateField={onUpdateField}
                isEditorMode={isEditorMode}
                isSelected={isSelected}
                as="span"
                multiline
                collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                onEditingStateChange={onEditingStateChange}
              />
            </p>
          )}
        </div>

        {/* Big Statistics Grid */}
        <div className={`grid ${gridColsClass} gap-6 items-stretch`}>
          {items.map((item, idx) => (
            <div
              key={idx}
              className="group relative flex flex-col justify-between p-6 sm:p-7 rounded-[var(--dt-radius-lg)] border transition-all duration-200 overflow-hidden"
              style={{
                background: "var(--dt-surface)",
                borderColor: `color-mix(in srgb, var(--dt-primary) 16%, transparent)`,
                boxShadow: `0 4px 16px color-mix(in srgb, var(--dt-primary) 6%, transparent)`,
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = "translateY(-4px)";
                el.style.borderColor = `color-mix(in srgb, var(--dt-primary) 34%, transparent)`;
                el.style.boxShadow = `0 14px 36px color-mix(in srgb, var(--dt-primary) 16%, transparent)`;
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = "none";
                el.style.borderColor = `color-mix(in srgb, var(--dt-primary) 16%, transparent)`;
                el.style.boxShadow = `0 4px 16px color-mix(in srgb, var(--dt-primary) 6%, transparent)`;
              }}
            >
              {/* Top Accent Line */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "3px",
                  background: `linear-gradient(90deg, var(--dt-primary), color-mix(in srgb, var(--dt-primary) 30%, transparent))`,
                }}
              />

              <div className="flex flex-col gap-2">
                {/* Gigantic Metric */}
                <p
                  style={{
                    fontFamily: "var(--dt-heading-font)",
                    fontWeight: 900,
                    fontSize: "clamp(2.5rem, 6cqw, 3.5rem)",
                    color: "var(--dt-primary)",
                    margin: 0,
                    lineHeight: 1,
                    letterSpacing: "-0.04em",
                  }}
                >
                  <InlineText
                    section="benefits"
                    fieldKey={`items.${idx}.stat`}
                    value={item.stat || (idx === 0 ? "99%" : idx === 1 ? "1.2k+" : "24/7")}
                    placeholder="99%"
                    onUpdateField={onUpdateField}
                    isEditorMode={isEditorMode}
                    isSelected={isSelected}
                    as="span"
                    collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                    onEditingStateChange={onEditingStateChange}
                  />
                </p>

                {/* Metric Label / Tracker */}
                {(item.stat_label || isEditorMode) && (
                  <p
                    style={{
                      fontSize: "0.72rem",
                      fontWeight: 800,
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      color: "var(--dt-text-muted)",
                      margin: "0.15rem 0 0.5rem 0",
                    }}
                  >
                    <InlineText
                      section="benefits"
                      fieldKey={`items.${idx}.stat_label`}
                      value={item.stat_label ?? ""}
                      placeholder={isEN ? "Metric Label" : "Label Metrik"}
                      onUpdateField={onUpdateField}
                      isEditorMode={isEditorMode}
                      isSelected={isSelected}
                      as="span"
                      collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                      onEditingStateChange={onEditingStateChange}
                    />
                  </p>
                )}

                {/* Title */}
                <InlineText
                  section="benefits"
                  fieldKey={`items.${idx}.title`}
                  value={item.title ?? ""}
                  placeholder={isEN ? "Outcome or milestone..." : "Dampak atau pencapaian..."}
                  onUpdateField={onUpdateField}
                  isEditorMode={isEditorMode}
                  isSelected={isSelected}
                  as="h3"
                  style={{
                    fontFamily: "var(--dt-heading-font)",
                    fontWeight: 700,
                    fontSize: "1.08rem",
                    color: "var(--dt-text)",
                    margin: 0,
                    lineHeight: 1.35,
                  }}
                  collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                  onEditingStateChange={onEditingStateChange}
                />

                {/* Description / Proof */}
                <InlineText
                  section="benefits"
                  fieldKey={`items.${idx}.description`}
                  value={item.description ?? ""}
                  placeholder={isEN ? "Explanation of how this figure is achieved..." : "Penjelasan bagaimana angka ini dicapai dan dampaknya..."}
                  onUpdateField={onUpdateField}
                  isEditorMode={isEditorMode}
                  isSelected={isSelected}
                  as="p"
                  style={{
                    color: "var(--dt-text-muted)",
                    fontSize: "0.85rem",
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                  multiline
                  collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                  onEditingStateChange={onEditingStateChange}
                />
              </div>

              {/* Inline Delete Button for Editor Mode */}
              {isEditorMode && (
                <div className="absolute top-3 right-3">
                  <InlineDeleteButton
                    compact
                    onDelete={() => handleDeleteItem(idx)}
                    title={isEN ? "Delete metric" : "Hapus metrik"}
                  />
                </div>
              )}
            </div>
          ))}

          {isEditorMode && onAddItem && (
            <div className="h-full">
              <InlineAddTile
                label={isEN ? "Add statistic" : "Tambah Statistik"}
                onClick={onAddItem}
                style={{ height: "100%", minHeight: "10rem", borderRadius: "var(--dt-radius-lg)" }}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
