"use client";
import React from "react";
import { InlineText } from "../../templates/shared";
import { InlineAddTile } from "../inline-add";
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

export default function BenefitsHowItWorks({
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
  const items = b.items ?? [];

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
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <span
            style={{
              display: "inline-block",
              fontSize: "0.7rem",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              color: "var(--dt-primary)",
              background: `color-mix(in srgb, var(--dt-primary) 10%, transparent)`,
              border: `1px solid color-mix(in srgb, var(--dt-primary) 18%, transparent)`,
              padding: "0.25rem 0.75rem",
              borderRadius: "999px",
              marginBottom: "1rem",
            }}
          >
            {isEN ? "How it works" : "Cara Kerja"}
          </span>
          <InlineText
            section="benefits"
            fieldKey="title"
            value={b.title}
            onUpdateField={onUpdateField}
            isEditorMode={isEditorMode}
            isSelected={isSelected}
            as="h2"
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
          {b.subtitle && (
            <InlineText
              section="benefits"
              fieldKey="subtitle"
              value={b.subtitle}
              onUpdateField={onUpdateField}
              isEditorMode={isEditorMode}
              isSelected={isSelected}
              as="p"
              style={{
                color: "var(--dt-text-muted)",
                fontSize: "1.05rem",
                maxWidth: "42rem",
                margin: "0.75rem auto 0",
                lineHeight: 1.65,
              }}
              multiline
              collapseSheetForInlineEdit={collapseSheetForInlineEdit}
              onEditingStateChange={onEditingStateChange}
            />
          )}
        </div>

        {/* Steps */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${Math.min(items.length || 3, 4)}, 1fr)`,
            gap: "0",
            position: "relative",
          }}
        >
          {/* Connecting line behind steps */}
          {items.length > 1 && (
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                top: "2.75rem", // vertically center on the number badge
                left: `calc(100% / ${items.length} / 2)`,
                right: `calc(100% / ${items.length} / 2)`,
                height: "2px",
                background: `linear-gradient(90deg, var(--dt-primary) 0%, color-mix(in srgb, var(--dt-primary) 30%, transparent) 100%)`,
                zIndex: 0,
                pointerEvents: "none",
              }}
            />
          )}

          {items.map((item, idx) => (
            <div
              key={idx}
              style={{
                position: "relative",
                zIndex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                padding: "0 1.25rem 2rem",
              }}
            >
              {/* Step number badge */}
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, var(--dt-primary), color-mix(in srgb, var(--dt-primary) 70%, var(--dt-text)))`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "1.5rem",
                  flexShrink: 0,
                  boxShadow: `0 0 0 6px color-mix(in srgb, var(--dt-primary) 12%, var(--dt-bg)), 0 4px 16px color-mix(in srgb, var(--dt-primary) 30%, transparent)`,
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--dt-heading-font)",
                    fontWeight: 800,
                    fontSize: "1.25rem",
                    color: "var(--dt-bg)",
                    lineHeight: 1,
                    userSelect: "none",
                  }}
                >
                  {idx + 1}
                </span>
              </div>

              {/* Step title */}
              <InlineText
                section="benefits"
                fieldKey={`items.${idx}.title`}
                value={item.title ?? ""}
                onUpdateField={onUpdateField}
                isEditorMode={isEditorMode}
                isSelected={isSelected}
                as="h3"
                style={{
                  fontFamily: "var(--dt-heading-font)",
                  fontWeight: 700,
                  color: "var(--dt-text)",
                  fontSize: "1.05rem",
                  margin: "0 0 0.5rem",
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
                onUpdateField={onUpdateField}
                isEditorMode={isEditorMode}
                isSelected={isSelected}
                as="p"
                style={{
                  color: "var(--dt-text-muted)",
                  fontSize: "0.875rem",
                  lineHeight: 1.65,
                  margin: 0,
                }}
                multiline
                collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                onEditingStateChange={onEditingStateChange}
              />

              {/* Optional stat badge */}
              {item.stat && (
                <span
                  style={{
                    display: "inline-block",
                    marginTop: "0.75rem",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    color: "var(--dt-primary)",
                    background: `color-mix(in srgb, var(--dt-primary) 10%, transparent)`,
                    border: `1px solid color-mix(in srgb, var(--dt-primary) 20%, transparent)`,
                    padding: "0.2rem 0.65rem",
                    borderRadius: "999px",
                  }}
                >
                  {item.stat}
                </span>
              )}
            </div>
          ))}
        </div>

        {isEditorMode && onAddItem && (
          <div style={{ display: "flex", justifyContent: "center", marginTop: "1.5rem" }}>
            <InlineAddTile
              compact
              label={isEN ? "Add step" : "Tambah Langkah"}
              onClick={onAddItem}
              style={{ borderRadius: "var(--dt-radius)", maxWidth: "16rem" }}
            />
          </div>
        )}
      </div>
    </section>
  );
}
