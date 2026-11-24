"use client";
import React from "react";
import { Star } from "lucide-react";
import { DynamicIcon, InlineText } from "../../templates/shared";
import { InlineAddTile, InlineDeleteButton } from "../inline-add";
import { benefitsStrings } from "./benefits-strings";
import type { TemplateProps, DesignToken } from "../../templates/types";

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

export default function BenefitsIconRow({
  benefits: b,
  onUpdateField,
  isEditorMode,
  isSelected,
  collapseSheetForInlineEdit,
  onEditingStateChange,
  language = "id",
  onAddItem,
}: BenefitsVariantProps) {
  const L = benefitsStrings(language);
  const items = b?.items ?? [];

  const handleDeleteItem = (indexToDelete: number) => {
    if (!onUpdateField) return;
    const newItems = items.filter((_, i) => i !== indexToDelete);
    onUpdateField("benefits", "items", newItems);
  };

  return (
    <section
      id="benefits"
      style={{
        padding: `var(--dt-spacing) 1.5rem`,
        background: `color-mix(in srgb, var(--dt-primary) 3%, var(--dt-bg))`,
        borderTop: `1px solid color-mix(in srgb, var(--dt-primary) 10%, transparent)`,
        borderBottom: `1px solid color-mix(in srgb, var(--dt-primary) 10%, transparent)`,
      }}
    >
      <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
        {/* Section header */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
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
                }}
              >
                <InlineText
                  section="benefits"
                  fieldKey="eyebrow"
                  value={b.eyebrow || L.eyebrowBenefits}
                  placeholder={L.eyebrowBenefits}
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
              fontSize: "clamp(1.35rem, 4.5cqw, 2.25rem)",
              color: "var(--dt-text)",
              margin: 0,
            }}
          >
            <InlineText
              section="benefits"
              fieldKey="title"
              value={b.title || L.titlePlaceholder}
              placeholder={L.titlePlaceholder}
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
                maxWidth: "36rem",
                margin: "0.75rem auto 0",
                lineHeight: 1.6,
                fontSize: "0.95rem",
              }}
            >
              <InlineText
                section="benefits"
                fieldKey="subtitle"
                value={b.subtitle}
                placeholder={L.subtitlePlaceholder}
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

        {/* Clean Responsive Grid (1 col mobile, 2 col tablet, 4 col desktop) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 items-stretch">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="group relative flex flex-col items-center text-center p-6 rounded-[var(--dt-radius-lg)] border transition-all duration-200"
              style={{
                background: "var(--dt-surface)",
                borderColor: "color-mix(in srgb, var(--dt-primary) 14%, transparent)",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = `color-mix(in srgb, var(--dt-primary) 5%, var(--dt-surface))`;
                el.style.transform = "translateY(-3px)";
                el.style.borderColor = `color-mix(in srgb, var(--dt-primary) 28%, transparent)`;
                el.style.boxShadow = `0 8px 24px color-mix(in srgb, var(--dt-primary) 12%, transparent)`;
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = "var(--dt-surface)";
                el.style.transform = "none";
                el.style.borderColor = `color-mix(in srgb, var(--dt-primary) 14%, transparent)`;
                el.style.boxShadow = "none";
              }}
            >
              {/* Icon Circle */}
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "var(--dt-radius-lg)",
                  background: `color-mix(in srgb, var(--dt-primary) 12%, transparent)`,
                  border: `1px solid color-mix(in srgb, var(--dt-primary) 22%, transparent)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "1rem",
                  flexShrink: 0,
                }}
              >
                <span style={{ color: "var(--dt-primary)", display: "contents" }}>
                  <DynamicIcon name={item.icon} defaultIcon={Star} className="w-6 h-6" />
                </span>
              </div>

              {/* Title */}
              <InlineText
                section="benefits"
                fieldKey={"items." + idx + ".title"}
                value={item.title ?? ""}
                placeholder={L.itemTitlePlaceholder}
                onUpdateField={onUpdateField}
                isEditorMode={isEditorMode}
                isSelected={isSelected}
                as="h3"
                style={{
                  fontFamily: "var(--dt-heading-font)",
                  fontWeight: 700,
                  fontSize: "1.05rem",
                  color: "var(--dt-text)",
                  margin: "0 0 0.5rem 0",
                  lineHeight: 1.35,
                }}
                collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                onEditingStateChange={onEditingStateChange}
              />

              {/* Description */}
              <InlineText
                section="benefits"
                fieldKey={"items." + idx + ".description"}
                value={item.description ?? ""}
                placeholder={L.itemDescriptionPlaceholder}
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

              {/* Inline Delete Button for Editor Mode */}
              {isEditorMode && (
                <div className="absolute top-2.5 right-2.5">
                  <InlineDeleteButton
                    compact
                    onDelete={() => handleDeleteItem(idx)}
                    title={L.deleteItemTitle}
                  />
                </div>
              )}
            </div>
          ))}

          {isEditorMode && onAddItem && (
            <div className="h-full">
              <InlineAddTile
                label={L.addBenefit}
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
