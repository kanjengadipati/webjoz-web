"use client";
import React from "react";
import { Star } from "lucide-react";
import { DynamicIcon, InlineText } from "../../templates/shared";
import type { TemplateProps, DesignToken } from "../../templates/types";

interface BenefitsVariantProps {
  benefits: TemplateProps["content"]["benefits"];
  design_token?: DesignToken | null;
  onUpdateField?: (section: string, key: string, value: any) => void;
  isEditorMode?: boolean;
  isSelected?: boolean;
  collapseSheetForInlineEdit?: () => void;
  onEditingStateChange?: (isEditing: boolean) => void;
  language?: "id" | "en";
}

function BentoCard({
  item,
  className,
  highlight,
  onUpdateField,
  isEditorMode,
  isSelected,
  collapseSheetForInlineEdit,
  onEditingStateChange,
  language,
}: {
  item: NonNullable<TemplateProps["content"]["benefits"]>["items"][number];
  className?: string;
  highlight?: boolean;
  onUpdateField?: BenefitsVariantProps["onUpdateField"];
  isEditorMode?: boolean;
  isSelected?: boolean;
  collapseSheetForInlineEdit?: () => void;
  onEditingStateChange?: (isEditing: boolean) => void;
  language?: "id" | "en";
}) {
  return (
    <div
      className={className}
      style={{
        position: "relative",
        background: highlight
          ? `linear-gradient(135deg, color-mix(in srgb, var(--dt-primary) 14%, var(--dt-surface)) 0%, var(--dt-surface) 100%)`
          : `var(--dt-surface)`,
        border: `1px solid color-mix(in srgb, var(--dt-primary) ${highlight ? 24 : 12}%, transparent)`,
        borderRadius: "var(--dt-radius-lg)",
        padding: highlight ? "2rem 2.25rem" : "1.5rem",
        display: "flex",
        flexDirection: "column",
        gap: highlight ? "1rem" : "0.75rem",
        overflow: "hidden",
        transition: "box-shadow 0.25s, transform 0.25s, border-color 0.25s",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        el.style.boxShadow = `0 12px 36px color-mix(in srgb, var(--dt-primary) 16%, transparent)`;
        el.style.transform = "translateY(-3px)";
        el.style.borderColor = `color-mix(in srgb, var(--dt-primary) 32%, transparent)`;
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.boxShadow = "none";
        el.style.transform = "none";
        el.style.borderColor = `color-mix(in srgb, var(--dt-primary) ${highlight ? 24 : 12}%, transparent)`;
      }}
    >
      {/* Accent line top */}
      {highlight && (
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: "3px",
          background: `linear-gradient(90deg, var(--dt-primary), color-mix(in srgb, var(--dt-primary) 30%, transparent))`,
        }} />
      )}

      {item.stat ? (
        <div>
          <p style={{
            fontFamily: "var(--dt-heading-font)",
            fontWeight: 800,
            fontSize: highlight ? "2.25rem" : "1.5rem",
            color: "var(--dt-primary)",
            margin: 0,
            lineHeight: 1,
          }}>
            {item.stat}
            {item.stat_label && (
              <span style={{
                fontSize: highlight ? "0.7rem" : "0.6rem",
                fontWeight: 700,
                color: "var(--dt-text-muted)",
                marginLeft: "0.375rem",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}>
                {item.stat_label}
              </span>
            )}
          </p>
        </div>
      ) : (
        <div style={{
          width: highlight ? 48 : 40,
          height: highlight ? 48 : 40,
          background: `linear-gradient(135deg, color-mix(in srgb, var(--dt-primary) 18%, transparent), color-mix(in srgb, var(--dt-primary) 6%, transparent))`,
          border: `1px solid color-mix(in srgb, var(--dt-primary) 20%, transparent)`,
          borderRadius: "var(--dt-radius)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <span style={{ color: "var(--dt-primary)", display: "contents" }}>
            <DynamicIcon name={item.icon} defaultIcon={Star} className={highlight ? "w-6 h-6" : "w-5 h-5"} />
          </span>
        </div>
      )}

      <h3 style={{
        fontFamily: "var(--dt-heading-font)",
        fontWeight: highlight ? 800 : 700,
        fontSize: highlight ? "clamp(1.1rem, 2.5cqw, 1.35rem)" : "0.95rem",
        color: "var(--dt-text)",
        margin: 0,
        lineHeight: 1.3,
      }}>
        {item.title}
      </h3>

      <p style={{
        color: "var(--dt-text-muted)",
        fontSize: highlight ? "0.875rem" : "0.8rem",
        lineHeight: 1.65,
        margin: 0,
      }}>
        {item.description}
      </p>
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
}: BenefitsVariantProps) {
  const isEN = language === "en";
  const items = b.items ?? [];
  const count = items.length;

  const gridColsClass = count <= 2 
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
          <span style={{ fontSize: "0.7rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--dt-primary)" }}>
            {isEN ? "Benefits" : "Keunggulan"}
          </span>
          <InlineText
            section="benefits"
            fieldKey="title"
            value={b.title}
            onUpdateField={onUpdateField}
            isEditorMode={isEditorMode}
            isSelected={isSelected}
            as="h2"
            style={{ fontFamily: "var(--dt-heading-font)", fontWeight: "var(--dt-heading-weight)" as any, fontSize: "clamp(1.35rem, 4.5cqw, 2.25rem)", color: "var(--dt-text)", marginTop: "0.5rem" }}
            collapseSheetForInlineEdit={collapseSheetForInlineEdit}
            onEditingStateChange={onEditingStateChange}
          />
        </div>

        {/* Bento grid */}
        <div className={`grid ${gridColsClass} gap-4`}>
          {items.map((item, idx) => (
            <BentoCard
              key={idx}
              item={item}
              className={getBentoSpanClass(idx, count)}
              highlight={idx === 0}
              onUpdateField={onUpdateField}
              isEditorMode={isEditorMode}
              isSelected={isSelected}
              collapseSheetForInlineEdit={collapseSheetForInlineEdit}
              onEditingStateChange={onEditingStateChange}
              language={language}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
