"use client";
import React from "react";
import { InlineText } from "../../templates/shared";
import { InlineAddTile, InlineDeleteButton } from "../inline-add";
import { benefitsStrings } from "./benefits-strings";
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
  onDeleteItem?: (idx: number) => void;
  language?: "id" | "en";
}

export default function BenefitsHowItWorks({
  benefits: b,
  onUpdateField,
  isEditorMode,
  isSelected,
  collapseSheetForInlineEdit,
  onEditingStateChange,
  language = "id",
  onAddItem,
  onDeleteItem,
}: BenefitsVariantProps) {
  const L = benefitsStrings(language);
  const items = b?.items ?? [];

  if (!b) return null;

  // Responsive column count based on item count
  const colsClass =
    items.length === 2
      ? "grid-cols-1 sm:grid-cols-2"
      : items.length === 3
      ? "grid-cols-1 sm:grid-cols-3"
      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";

  return (
    <section
      id="benefits"
      style={{
        padding: `var(--dt-spacing) 1.5rem`,
        background: `var(--dt-bg)`,
      }}
    >
      <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
        {/* Section header */}
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          {(b.eyebrow || isEditorMode) && (
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
                  value={b.eyebrow || L.eyebrowHowItWorks}
                  placeholder={L.eyebrowHowItWorks}
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
          <div className="w-full">
            <InlineText
              section="benefits"
              fieldKey="title"
              value={b.title || L.titleHowItWorks}
              placeholder={L.titleHowItWorks}
              onUpdateField={onUpdateField}
              isEditorMode={isEditorMode}
              isSelected={isSelected}
              as="h2"
              multiline
              style={{
                fontFamily: "var(--dt-heading-font)",
                fontWeight: "var(--dt-heading-weight)" as any,
                fontSize: "clamp(1.5rem, 4.5cqw, 2.5rem)",
                color: "var(--dt-text)",
                marginTop: "0.5rem",
                lineHeight: 1.2,
              }}
              collapseSheetForInlineEdit={collapseSheetForInlineEdit}
              onEditingStateChange={onEditingStateChange}
            />
          </div>
          {(b.subtitle || isEditorMode) && (
            <InlineText
              section="benefits"
              fieldKey="subtitle"
              value={b.subtitle}
              placeholder={L.subtitleHowItWorks}
              onUpdateField={onUpdateField}
              isEditorMode={isEditorMode}
              isSelected={isSelected}
              as="p"
              style={{
                color: "var(--dt-text-muted)",
                fontSize: "1rem",
                maxWidth: "36rem",
                margin: "0.75rem auto 0",
                lineHeight: 1.6,
              }}
              multiline
              collapseSheetForInlineEdit={collapseSheetForInlineEdit}
              onEditingStateChange={onEditingStateChange}
            />
          )}
        </div>

        {/* Steps container */}
        <div className="relative">
          {/* Connecting line behind step circles — hidden on mobile to avoid overlap */}
          {items.length > 1 && (
            <div
              className="hidden lg:block absolute left-0 right-0 h-0.5"
              style={{
                top: "1.75rem",
                background: `linear-gradient(90deg, transparent 5%, color-mix(in srgb, var(--dt-primary) 35%, transparent) 15%, color-mix(in srgb, var(--dt-primary) 35%, transparent) 85%, transparent 95%)`,
                zIndex: 0,
              }}
            />
          )}

          {/* Steps grid */}
          <div className={`grid ${colsClass} gap-8 relative z-10`}>
            {items.map((item, idx) => (
              <div
                key={idx}
                className="group relative flex flex-col items-center text-center p-4 rounded-xl transition-all"
              >
                {/* Numbered step circle */}
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg mb-4 flex-shrink-0 transition-transform duration-200 group-hover:scale-105"
                  style={{
                    background: "var(--dt-surface)",
                    color: "var(--dt-primary)",
                    border: `2px solid var(--dt-primary)`,
                    boxShadow: `0 0 0 6px color-mix(in srgb, var(--dt-primary) 12%, transparent)`,
                    fontFamily: "var(--dt-heading-font)",
                  }}
                >
                  {idx + 1}
                </div>

                {/* Step title */}
                <InlineText
                  section="benefits"
                  fieldKey={`items.${idx}.title`}
                  value={item.title ?? ""}
                  placeholder={L.stepActionPlaceholder}
                  onUpdateField={onUpdateField}
                  isEditorMode={isEditorMode}
                  isSelected={isSelected}
                  as="h3"
                  style={{
                    fontFamily: "var(--dt-heading-font)",
                    fontWeight: 700,
                    fontSize: "1.1rem",
                    color: "var(--dt-text)",
                    marginBottom: "0.5rem",
                    lineHeight: 1.3,
                  }}
                  collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                  onEditingStateChange={onEditingStateChange}
                />

                {/* Step description */}
                <InlineText
                  section="benefits"
                  fieldKey={`items.${idx}.description`}
                  value={item.description ?? ""}
                  placeholder={L.stepDescriptionPlaceholder}
                  onUpdateField={onUpdateField}
                  isEditorMode={isEditorMode}
                  isSelected={isSelected}
                  as="p"
                  style={{
                    color: "var(--dt-text-muted)",
                    fontSize: "0.875rem",
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                  multiline
                  collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                  onEditingStateChange={onEditingStateChange}
                />

                {/* Delete button (only in editor mode) */}
                {isEditorMode && (
                  <div className="absolute top-0 right-0">
                    <InlineDeleteButton
                      compact
                      onDelete={() => {
                        if (onDeleteItem) {
                          onDeleteItem(idx);
                        } else if (onUpdateField) {
                          const newItems = items.filter((_, i) => i !== idx);
                          onUpdateField("benefits", "items", newItems);
                        }
                      }}
                      title={L.deleteStepTitle}
                    />
                  </div>
                )}
              </div>
            ))}

            {isEditorMode && onAddItem && (
              <div className="flex items-center justify-center min-h-[10rem]">
                <InlineAddTile
                  compact
                  label={L.addStep}
                  onClick={onAddItem}
                  style={{ borderRadius: "var(--dt-radius-lg)", width: "100%", height: "100%" }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
