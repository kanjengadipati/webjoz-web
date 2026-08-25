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
  span,
  highlight,
  onUpdateField,
  isEditorMode,
  isSelected,
  collapseSheetForInlineEdit,
  onEditingStateChange,
  language,
}: {
  item: NonNullable<TemplateProps["content"]["benefits"]>["items"][number];
  span: string;
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
      style={{
        gridArea: span,
        position: "relative",
        background: highlight
          ? `linear-gradient(135deg, color-mix(in srgb, var(--dt-primary) 14%, var(--dt-surface)) 0%, var(--dt-surface) 100%)`
          : `var(--dt-surface)`,
        border: `1px solid color-mix(in srgb, var(--dt-primary) ${highlight ? 20 : 12}%, transparent)`,
        borderRadius: "var(--dt-radius-lg)",
        padding: highlight ? "2rem 2.5rem" : "1.5rem",
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
        el.style.borderColor = `color-mix(in srgb, var(--dt-primary) 28%, transparent)`;
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.boxShadow = "none";
        el.style.transform = "none";
        el.style.borderColor = `color-mix(in srgb, var(--dt-primary) ${highlight ? 20 : 12}%, transparent)`;
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

  // Bento layout grid-template-areas by item count
  const areaPatterns: Record<number, string> = {
    1: `"a1 a1"`,
    2: `"a1 a1" "a2 a2"`,
    3: `"a1 a1" "b1 b2"`,
    4: `"a1 a1" "b1 b2" "c1 c1"`,
    5: `"a1 a1" "b1 b2" "c1 c2"`,
    6: `"a1 a1" "b1 b2" "c1 c2" "d1 d1"`,
  };
  const areaNames = ["a1", "a2", "b1", "b2", "c1", "c2", "d1", "d2"];
  const count = Math.min(items.length, 6);
  const gridAreas = areaPatterns[count] ?? areaPatterns[6];

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
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gridTemplateAreas: gridAreas,
          gap: "1rem",
        }}>
          {items.map((item, idx) => (
            <BentoCard
              key={idx}
              item={item}
              span={areaNames[idx % areaNames.length]}
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
