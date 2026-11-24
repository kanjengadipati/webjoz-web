"use client";
import React from "react";
import { ArrowRight, CheckCircle, Sparkles } from "lucide-react";
import { DynamicIcon, InlineImage, InlineText } from "../../templates/shared";
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

export default function BenefitsSplitFeature({
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
  const primaryItem = items[0];
  const supportingItems = items.slice(1);

  const handleDeleteItem = (indexToDelete: number) => {
    if (!onUpdateField) return;
    const newItems = items.filter((_, i) => i !== indexToDelete);
    onUpdateField("benefits", "items", newItems);
  };

  const visualImage = b?.image_url || primaryItem?.image_url;

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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          {/* Visual Column (5 cols on lg) */}
          <div className="lg:col-span-5 relative">
            <div
              className="relative w-full aspect-[4/3] sm:aspect-square rounded-[var(--dt-radius-lg)] border overflow-hidden flex items-center justify-center transition-all duration-300"
              style={{
                background: `linear-gradient(135deg, color-mix(in srgb, var(--dt-primary) 16%, var(--dt-surface)) 0%, var(--dt-surface) 100%)`,
                borderColor: `color-mix(in srgb, var(--dt-primary) 22%, transparent)`,
                boxShadow: `0 16px 40px color-mix(in srgb, var(--dt-primary) 10%, transparent)`,
              }}
            >
              {/* Background Glow */}
              <div
                style={{
                  position: "absolute",
                  top: "-20%",
                  right: "-20%",
                  width: "240px",
                  height: "240px",
                  background: `radial-gradient(circle, color-mix(in srgb, var(--dt-primary) 30%, transparent) 0%, transparent 70%)`,
                  pointerEvents: "none",
                }}
              />

              {/* Image slot or Fallback Decorative Art */}
              {(visualImage || isEditorMode) ? (
                <InlineImage
                  section="benefits"
                  fieldKey="image_url"
                  src={visualImage ?? ""}
                  alt={primaryItem?.title || b?.title || L.itemTitlePlaceholder}
                  onUpdateField={onUpdateField}
                  isEditorMode={isEditorMode}
                  isSelected={isSelected}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                  collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                />
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center gap-3">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
                    style={{
                      background: "var(--dt-primary)",
                      color: "#fff",
                    }}
                  >
                    <DynamicIcon
                      name={primaryItem?.icon}
                      defaultIcon={Sparkles}
                      className="w-8 h-8"
                    />
                  </div>
                  {primaryItem?.stat && (
                    <span
                      style={{
                        fontFamily: "var(--dt-heading-font)",
                        fontWeight: 800,
                        fontSize: "2rem",
                        color: "var(--dt-primary)",
                      }}
                    >
                      {primaryItem.stat}
                    </span>
                  )}
                  <span
                    style={{
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      color: "var(--dt-text-muted)",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                    }}
                  >
                    {primaryItem?.title || L.primaryFeatureBadge}
                  </span>
                </div>
              )}

              {/* Floating Stat Badge */}
              {(primaryItem?.stat || isEditorMode) && (
                <div
                  className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-[200px] p-3 rounded-xl border backdrop-blur-md shadow-lg"
                  style={{
                    background: `color-mix(in srgb, var(--dt-surface) 85%, transparent)`,
                    borderColor: `color-mix(in srgb, var(--dt-primary) 20%, transparent)`,
                  }}
                >
                  <p
                    style={{
                      fontFamily: "var(--dt-heading-font)",
                      fontWeight: 800,
                      fontSize: "1.4rem",
                      color: "var(--dt-primary)",
                      margin: 0,
                      lineHeight: 1,
                    }}
                  >
                    <InlineText
                      section="benefits"
                      fieldKey="items.0.stat"
                      value={primaryItem?.stat ?? ""}
                      placeholder={L.statPlaceholder}
                      onUpdateField={onUpdateField}
                      isEditorMode={isEditorMode}
                      isSelected={isSelected}
                      as="span"
                      collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                      onEditingStateChange={onEditingStateChange}
                    />
                  </p>
                  {(primaryItem?.stat_label || isEditorMode) && (
                    <p
                      style={{
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        color: "var(--dt-text-muted)",
                        marginTop: "0.25rem",
                        margin: 0,
                      }}
                    >
                      <InlineText
                        section="benefits"
                        fieldKey="items.0.stat_label"
                        value={primaryItem?.stat_label ?? ""}
                        placeholder={L.statLabelPlaceholder}
                        onUpdateField={onUpdateField}
                        isEditorMode={isEditorMode}
                        isSelected={isSelected}
                        as="span"
                        collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                        onEditingStateChange={onEditingStateChange}
                      />
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Text Content Column (7 cols on lg) */}
          <div className="lg:col-span-7 flex flex-col items-start gap-4">
            {(b?.eyebrow || isEditorMode) && (
              <span
                style={{
                  display: "inline-block",
                  fontSize: "0.75rem",
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "0.15em",
                  color: "var(--dt-primary)",
                  background: `color-mix(in srgb, var(--dt-primary) 10%, transparent)`,
                  border: `1px solid color-mix(in srgb, var(--dt-primary) 20%, transparent)`,
                  padding: "0.25rem 0.75rem",
                  borderRadius: "999px",
                }}
              >
                <InlineText
                  section="benefits"
                  fieldKey="eyebrow"
                  value={b.eyebrow || L.eyebrowSignature}
                  placeholder={L.eyebrowSignature}
                  onUpdateField={onUpdateField}
                  isEditorMode={isEditorMode}
                  isSelected={isSelected}
                  as="span"
                  collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                  onEditingStateChange={onEditingStateChange}
                />
              </span>
            )}

            <h2
              style={{
                fontFamily: "var(--dt-heading-font)",
                fontWeight: "var(--dt-heading-weight)" as any,
                fontSize: "clamp(1.6rem, 4.5cqw, 2.5rem)",
                color: "var(--dt-text)",
                margin: 0,
                lineHeight: 1.25,
              }}
            >
              <InlineText
                section="benefits"
                fieldKey="title"
                value={b.title || L.titleSplitFeature}
                placeholder={L.titleSplitFeature}
                onUpdateField={onUpdateField}
                isEditorMode={isEditorMode}
                isSelected={isSelected}
                as="span"
                collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                onEditingStateChange={onEditingStateChange}
              />
            </h2>

            {/* Narrative / Subtitle */}
            <p
              style={{
                color: "var(--dt-text-muted)",
                fontSize: "1rem",
                lineHeight: 1.65,
                margin: 0,
                maxWidth: "38rem",
              }}
            >
              <InlineText
                section="benefits"
                fieldKey="subtitle"
                value={b?.subtitle || primaryItem?.description || ""}
                placeholder={L.subtitleSplitFeature}
                onUpdateField={onUpdateField}
                isEditorMode={isEditorMode}
                isSelected={isSelected}
                as="span"
                multiline
                collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                onEditingStateChange={onEditingStateChange}
              />
            </p>

            {/* Supporting checklist points */}
            {supportingItems.length > 0 && (
              <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {supportingItems.map((item, idx) => {
                  const realIdx = idx + 1;
                  return (
                    <div
                      key={realIdx}
                      className="group relative flex items-start gap-2.5 p-3 rounded-lg border"
                      style={{
                        background: "var(--dt-surface)",
                        borderColor: `color-mix(in srgb, var(--dt-primary) 12%, transparent)`,
                      }}
                    >
                      <CheckCircle
                        className="w-4 h-4 mt-0.5 flex-shrink-0"
                        style={{ color: "var(--dt-primary)" }}
                      />
                      <div className="flex-1 min-w-0 pr-4">
                        <InlineText
                          section="benefits"
                          fieldKey={`items.${realIdx}.title`}
                          value={item.title ?? ""}
                          placeholder={L.pointPlaceholder}
                          onUpdateField={onUpdateField}
                          isEditorMode={isEditorMode}
                          isSelected={isSelected}
                          as="h4"
                          style={{
                            fontFamily: "var(--dt-heading-font)",
                            fontWeight: 700,
                            fontSize: "0.9rem",
                            color: "var(--dt-text)",
                            margin: 0,
                            lineHeight: 1.3,
                          }}
                          collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                          onEditingStateChange={onEditingStateChange}
                        />
                        {(item.description || isEditorMode) && (
                          <InlineText
                            section="benefits"
                            fieldKey={`items.${realIdx}.description`}
                            value={item.description ?? ""}
                            placeholder={L.notePlaceholder}
                            onUpdateField={onUpdateField}
                            isEditorMode={isEditorMode}
                            isSelected={isSelected}
                            as="p"
                            style={{
                              color: "var(--dt-text-muted)",
                              fontSize: "0.78rem",
                              margin: "0.15rem 0 0 0",
                              lineHeight: 1.4,
                            }}
                            collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                            onEditingStateChange={onEditingStateChange}
                          />
                        )}
                      </div>

                      {/* Inline Delete Button for Editor Mode */}
                      {isEditorMode && (
                        <div className="absolute top-2 right-2">
                          <InlineDeleteButton
                            compact
                            onDelete={() => handleDeleteItem(realIdx)}
                            title={L.deletePointTitle}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* CTA Button / Action */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <a
                href={b?.cta_url || "#contact"}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-[var(--dt-radius)] font-bold text-sm text-white transition-transform active:scale-95 shadow-md"
                style={{
                  background: "var(--dt-primary)",
                }}
              >
                <InlineText
                  section="benefits"
                  fieldKey="cta_text"
                  value={b?.cta_text || L.learnMoreCta}
                  placeholder={L.learnMoreCta}
                  onUpdateField={onUpdateField}
                  isEditorMode={isEditorMode}
                  isSelected={isSelected}
                  as="span"
                  collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                  onEditingStateChange={onEditingStateChange}
                />
                <ArrowRight className="w-4 h-4" />
              </a>

              {isEditorMode && onAddItem && (
                <InlineAddTile
                  compact
                  label={L.addSupportingPoint}
                  onClick={onAddItem}
                  style={{ borderRadius: "var(--dt-radius)" }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
