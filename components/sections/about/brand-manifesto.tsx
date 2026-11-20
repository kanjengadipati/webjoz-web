"use client";
import React from "react";
import { ArrowRight } from "lucide-react";
import { InlineText } from "../../templates/shared";
import type { AboutVariantProps } from "./classic";

export default function AboutBrandManifesto({
  about: a,
  onUpdateField,
  isEditorMode,
  isSelected,
  collapseSheetForInlineEdit,
  onEditingStateChange,
}: AboutVariantProps) {
  const py = { paddingTop: "var(--dt-spacing)", paddingBottom: "var(--dt-spacing)" } as any;

  return (
    <section
      id="about"
      className="group relative"
      style={{
        ...py,
        padding: `var(--dt-spacing) 1.5rem`,
        maxWidth: "76rem",
        margin: "0 auto",
      }}
    >
      <div
        className="p-8 sm:p-12 lg:p-16 relative overflow-hidden"
        style={{
          borderRadius: "calc(var(--dt-radius-lg, 1rem) * 1.25)",
          background: "var(--dt-surface, #ffffff)",
          border: "1px solid var(--dt-card-border, rgba(0,0,0,0.08))",
          boxShadow: "var(--dt-card-shadow, 0 8px 30px rgba(0,0,0,0.04))",
        }}
      >
        {/* Subtle accent border at top */}
        <div
          className="absolute top-0 left-0 right-0 h-1"
          style={{
            background:
              "linear-gradient(90deg, var(--dt-primary) 0%, color-mix(in srgb, var(--dt-primary) 30%, transparent) 100%)",
          }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          {/* Left Column: Bold Headline Manifesto */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="inline-block">
              <span
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "0.2em",
                  color: "var(--dt-primary)",
                }}
              >
                <InlineText
                  section="about"
                  fieldKey="eyebrow"
                  value={a.eyebrow || "Manifesto Kami"}
                  onUpdateField={onUpdateField}
                  isEditorMode={isEditorMode}
                  isSelected={isSelected}
                  as="span"
                  collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                  onEditingStateChange={onEditingStateChange}
                />
              </span>
            </div>

            <div className="w-full">
              <InlineText
                section="about"
                fieldKey="title"
                value={a.title}
                onUpdateField={onUpdateField}
                isEditorMode={isEditorMode}
                isSelected={isSelected}
                as="h2"
                multiline={true}
                style={{
                  fontFamily: "var(--dt-heading-font)",
                  fontWeight: "var(--dt-heading-weight)" as any,
                  fontSize: "clamp(2.25rem, 5.5cqw, 4rem)",
                  color: "var(--dt-text)",
                  lineHeight: 1.1,
                  letterSpacing: "-0.03em",
                  margin: 0,
                  display: "block",
                }}
                collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                onEditingStateChange={onEditingStateChange}
              />
            </div>
          </div>

          {/* Right Column: Statement, Philosophy & Action */}
          <div className="lg:col-span-5 flex flex-col gap-6 lg:border-l lg:pl-10" style={{ borderColor: "var(--dt-card-border, rgba(0,0,0,0.1))" }}>
            <InlineText
              section="about"
              fieldKey="body"
              value={a.body}
              onUpdateField={onUpdateField}
              isEditorMode={isEditorMode}
              isSelected={isSelected}
              multiline={true}
              as="p"
              style={{
                color: "var(--dt-text-muted)",
                lineHeight: 1.8,
                margin: 0,
                fontSize: "1.05rem",
                whiteSpace: "pre-line",
              }}
              collapseSheetForInlineEdit={collapseSheetForInlineEdit}
              onEditingStateChange={onEditingStateChange}
            />

            <div className="pt-2">
              <a
                href={a.cv_url || "#contact"}
                target={a.cv_url ? "_blank" : undefined}
                rel={a.cv_url ? "noopener noreferrer" : undefined}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.8rem 1.75rem",
                  borderRadius: "var(--dt-radius, 0.5rem)",
                  background: "var(--dt-primary)",
                  color: "var(--dt-primary-fg, #ffffff)",
                  fontSize: "0.925rem",
                  fontWeight: 600,
                  transition: "opacity 0.2s ease",
                }}
              >
                <span>{a.cv_label?.trim() || "Tentang Visi Kami"}</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
