"use client";
import React from "react";
import { Star } from "lucide-react";
import { DynamicIcon, InlineText } from "../../templates/shared";
import { InlineAddTile, InlineDeleteButton } from "../inline-add";
import { benefitsStrings, type BenefitsStaticStrings } from "./benefits-strings";
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

function BentoCard({
  item,
  itemIndex,
  className,
  highlight,
  onUpdateField,
  isEditorMode,
  isSelected,
  collapseSheetForInlineEdit,
  onEditingStateChange,
  L,
  onDeleteItem,
}: {
  item: NonNullable<TemplateProps["content"]["benefits"]>["items"][number];
  itemIndex: number;
  className?: string;
  highlight?: boolean;
  onUpdateField?: BenefitsVariantProps["onUpdateField"];
  isEditorMode?: boolean;
  isSelected?: boolean;
  collapseSheetForInlineEdit?: () => void;
  onEditingStateChange?: (isEditing: boolean) => void;
  L: BenefitsStaticStrings;
  onDeleteItem?: (idx: number) => void;
}) {
  return (
    <div
      className={`group relative flex flex-col justify-between overflow-hidden transition-all duration-200 ${className ?? ""}`}
      style={{
        background: highlight
          ? `linear-gradient(135deg, color-mix(in srgb, var(--dt-primary) 14%, var(--dt-surface)) 0%, var(--dt-surface) 100%)`
          : `var(--dt-surface)`,
        border: `1px solid color-mix(in srgb, var(--dt-primary) ${highlight ? 26 : 14}%, transparent)`,
        borderRadius: "var(--dt-radius-lg)",
        padding: highlight ? "2rem 2.25rem" : "1.6rem",
        gap: highlight ? "1.25rem" : "0.85rem",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        el.style.boxShadow = `0 14px 36px color-mix(in srgb, var(--dt-primary) 16%, transparent)`;
        el.style.transform = "translateY(-3px)";
        el.style.borderColor = `color-mix(in srgb, var(--dt-primary) 34%, transparent)`;
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.boxShadow = "none";
        el.style.transform = "none";
        el.style.borderColor = `color-mix(in srgb, var(--dt-primary) ${highlight ? 26 : 14}%, transparent)`;
      }}
    >
      {/* Accent line top for highlight card */}
      {highlight && (
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
      )}

      <div className="flex flex-col gap-3">
        {item.stat || isEditorMode ? (
          <div>
            <p
              style={{
                fontFamily: "var(--dt-heading-font)",
                fontWeight: 800,
                fontSize: highlight ? "2.35rem" : "1.65rem",
                color: "var(--dt-primary)",
                margin: 0,
                lineHeight: 1,
              }}
            >
              <InlineText
                section="benefits"
                fieldKey={"items." + itemIndex + ".stat"}
                value={item.stat ?? ""}
                placeholder={L.statPlaceholder}
                onUpdateField={onUpdateField}
                isEditorMode={isEditorMode}
                isSelected={isSelected}
                as="span"
                collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                onEditingStateChange={onEditingStateChange}
              />
              {(item.stat_label || isEditorMode) && (
                <span
                  style={{
                    fontSize: highlight ? "0.72rem" : "0.65rem",
                    fontWeight: 700,
                    color: "var(--dt-text-muted)",
                    marginLeft: "0.4rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  }}
                >
                  <InlineText
                    section="benefits"
                    fieldKey={"items." + itemIndex + ".stat_label"}
                    value={item.stat_label ?? ""}
                    placeholder={L.statLabelPlaceholder}
                    onUpdateField={onUpdateField}
                    isEditorMode={isEditorMode}
                    isSelected={isSelected}
                    as="span"
                    collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                    onEditingStateChange={onEditingStateChange}
                  />
                </span>
              )}
            </p>
          </div>
        ) : (
          <div
            style={{
              width: highlight ? 50 : 42,
              height: highlight ? 50 : 42,
              background: `linear-gradient(135deg, color-mix(in srgb, var(--dt-primary) 18%, transparent), color-mix(in srgb, var(--dt-primary) 6%, transparent))`,
              border: `1px solid color-mix(in srgb, var(--dt-primary) 20%, transparent)`,
              borderRadius: "var(--dt-radius)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ color: "var(--dt-primary)", display: "contents" }}>
              <DynamicIcon name={item.icon} defaultIcon={Star} className={highlight ? "w-6 h-6" : "w-5 h-5"} />
            </span>
          </div>
        )}

        <InlineText
          section="benefits"
          fieldKey={"items." + itemIndex + ".title"}
          value={item.title ?? ""}
          placeholder={L.itemTitlePlaceholder}
          onUpdateField={onUpdateField}
          isEditorMode={isEditorMode}
          isSelected={isSelected}
          as="h3"
          style={{
            fontFamily: "var(--dt-heading-font)",
            fontWeight: highlight ? 800 : 700,
            fontSize: highlight ? "clamp(1.15rem, 2.5cqw, 1.45rem)" : "1rem",
            color: "var(--dt-text)",
            margin: 0,
            lineHeight: 1.3,
          }}
          collapseSheetForInlineEdit={collapseSheetForInlineEdit}
          onEditingStateChange={onEditingStateChange}
        />

        <InlineText
          section="benefits"
          fieldKey={"items." + itemIndex + ".description"}
          value={item.description ?? ""}
          placeholder={L.itemDescriptionPlaceholder}
          onUpdateField={onUpdateField}
          isEditorMode={isEditorMode}
          isSelected={isSelected}
          as="p"
          style={{
            color: "var(--dt-text-muted)",
            fontSize: highlight ? "0.875rem" : "0.825rem",
            lineHeight: 1.65,
            margin: 0,
          }}
          multiline
          collapseSheetForInlineEdit={collapseSheetForInlineEdit}
          onEditingStateChange={onEditingStateChange}
        />
      </div>

      {/* Inline Delete Button for Editor Mode */}
      {isEditorMode && onDeleteItem && (
        <div className="absolute top-3 right-3">
          <InlineDeleteButton
            compact
            onDelete={() => onDeleteItem(itemIndex)}
            title={L.deleteItemTitle}
          />
        </div>
      )}
    </div>
  );
}

function getBentoSpanClass(idx: number, total: number): string {
  if (total === 1 || total === 2) {
    return "col-span-1";
  }
  if (total === 3) {
    if (idx === 0) return "sm:col-span-2 lg:col-span-2";
    return "sm:col-span-1 lg:col-span-1";
  }
  if (total === 4) {
    if (idx === 0 || idx === 3) return "sm:col-span-2 lg:col-span-2";
    return "sm:col-span-1 lg:col-span-1";
  }
  if (total === 5) {
    if (idx === 0) return "sm:col-span-2 lg:col-span-2";
    return "sm:col-span-1 lg:col-span-1";
  }
  // 6 or more
  if (idx === 0) return "sm:col-span-2 lg:col-span-2";
  if (idx === 5) return "sm:col-span-2 lg:col-span-3";
  return "sm:col-span-1 lg:col-span-1";
}

export default function BenefitsBentoGrid({
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
  const count = items.length;

  const handleDeleteItem = (indexToDelete: number) => {
    if (!onUpdateField) return;
    const newItems = items.filter((_, i) => i !== indexToDelete);
    onUpdateField("benefits", "items", newItems);
  };

  const gridColsClass =
    count <= 2
      ? "grid-cols-1 sm:grid-cols-2"
      : count === 3
      ? "grid-cols-1 sm:grid-cols-2"
      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

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

        {/* Bento grid */}
        <div className={`grid ${gridColsClass} gap-4`}>
          {items.map((item, idx) => (
            <BentoCard
              key={idx}
              item={item}
              itemIndex={idx}
              className={getBentoSpanClass(idx, count)}
              highlight={idx === 0}
              onUpdateField={onUpdateField}
              isEditorMode={isEditorMode}
              isSelected={isSelected}
              collapseSheetForInlineEdit={collapseSheetForInlineEdit}
              onEditingStateChange={onEditingStateChange}
              L={L}
              onDeleteItem={handleDeleteItem}
            />
          ))}
          {isEditorMode && onAddItem && (
            <div className="col-span-1 sm:col-span-2 lg:col-span-1">
              <InlineAddTile
                label={L.addBenefit}
                onClick={onAddItem}
                style={{ borderRadius: "var(--dt-radius-lg)", minHeight: "8rem" }}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
