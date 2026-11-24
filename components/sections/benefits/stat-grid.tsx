"use client";
import React from "react";
import { Star } from "lucide-react";
import { DynamicIcon, InlineText } from "../../templates/shared";
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
  language?: "id" | "en";
}

export default function BenefitsStatGrid({
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
        background: `color-mix(in srgb, var(--dt-primary) 4%, var(--dt-bg))`,
        borderTop: `1px solid color-mix(in srgb, var(--dt-primary) 12%, transparent)`,
        borderBottom: `1px solid color-mix(in srgb, var(--dt-primary) 12%, transparent)`,
      }}
    >
      <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
        {/* Header */}
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
                  value={b.eyebrow || L.eyebrowNumbers}
                  placeholder={L.eyebrowNumbers}
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
              value={b.title || L.titleBigStats}
              placeholder={L.titleBigStats}
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
                placeholder={L.subtitleBigStats}
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

        {/* Equal-Height Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="group relative flex flex-col justify-between overflow-hidden transition-all duration-200"
              style={{
                background: "var(--dt-surface)",
                border: `1px solid color-mix(in srgb, var(--dt-primary) 15%, transparent)`,
                borderTop: `4px solid var(--dt-primary)`,
                borderRadius: "var(--dt-radius-lg)",
                padding: "2rem",
                boxShadow: `0 4px 14px color-mix(in srgb, var(--dt-primary) 6%, transparent)`,
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.boxShadow = `0 12px 30px color-mix(in srgb, var(--dt-primary) 18%, transparent)`;
                el.style.transform = "translateY(-4px)";
                el.style.borderColor = `color-mix(in srgb, var(--dt-primary) 35%, transparent)`;
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.boxShadow = `0 4px 14px color-mix(in srgb, var(--dt-primary) 6%, transparent)`;
                el.style.transform = "none";
                el.style.borderColor = `color-mix(in srgb, var(--dt-primary) 15%, transparent)`;
              }}
            >
              <div className="flex flex-col gap-3">
                {item.stat || isEditorMode ? (
                  <p
                    style={{
                      fontFamily: "var(--dt-heading-font)",
                      fontWeight: 800,
                      fontSize: "2.6rem",
                      color: "var(--dt-primary)",
                      margin: 0,
                      lineHeight: 1,
                    }}
                  >
                    <InlineText
                      section="benefits"
                      fieldKey={"items." + idx + ".stat"}
                      value={item.stat ?? ""}
                      placeholder={L.statPlaceholder}
                      onUpdateField={onUpdateField}
                      isEditorMode={isEditorMode}
                      isSelected={isSelected}
                      as="span"
                      collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                      onEditingStateChange={onEditingStateChange}
                    />
                  </p>
                ) : (
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      background: `color-mix(in srgb, var(--dt-primary) 12%, transparent)`,
                      border: `1px solid color-mix(in srgb, var(--dt-primary) 20%, transparent)`,
                      borderRadius: "var(--dt-radius)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span style={{ color: "var(--dt-primary)", display: "contents" }}>
                      <DynamicIcon name={item.icon} defaultIcon={Star} className="w-5 h-5" />
                    </span>
                  </div>
                )}

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
                    color: "var(--dt-text)",
                    fontSize: "1.1rem",
                    margin: 0,
                    lineHeight: 1.35,
                  }}
                  collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                  onEditingStateChange={onEditingStateChange}
                />

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
              </div>

              {/* Inline Delete Button for Editor Mode */}
              {isEditorMode && (
                <div className="absolute top-3 right-3">
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
