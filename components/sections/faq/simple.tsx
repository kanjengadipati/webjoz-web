"use client";
import React from "react";
import type { TemplateProps, DesignToken } from "../../templates/types";
import { InlineText } from "../../templates/shared";

interface FaqVariantProps {
  faq: TemplateProps["content"]["faq"];
  design_token?: DesignToken | null;
  language?: "id" | "en";
  onUpdateField?: (section: string, key: string, value: any) => void;
  isEditorMode?: boolean;
  isSelected?: boolean;
  collapseSheetForInlineEdit?: () => void;
  onEditingStateChange?: (isEditing: boolean) => void;
}

export default function FaqSimple({
  faq,
  language = "id",
  onUpdateField,
  isEditorMode = false,
  isSelected = false,
  collapseSheetForInlineEdit,
  onEditingStateChange,
}: FaqVariantProps) {
  const py = { paddingTop: "var(--dt-spacing)", paddingBottom: "var(--dt-spacing)" } as any;
  const isEN = language === "en";

  const handleUpdateItem = (index: number, field: string, value: string) => {
    const nextItems = [...(faq.items || [])];
    nextItems[index] = { ...nextItems[index], [field]: value };
    onUpdateField?.("faq", "items", nextItems);
  };

  return (
    <section id="faq" style={{ ...py, padding: `var(--dt-spacing) 1.5rem`, maxWidth: "52rem", margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <span style={{ fontSize: "0.7rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--dt-primary)" }}>{isEN ? "Questions" : "Pertanyaan"}</span>
        <h2 style={{ fontFamily: "var(--dt-heading-font)", fontWeight: "var(--dt-heading-weight)" as any, fontSize: "clamp(1.35rem, 4.5cqw, 2.25rem)", color: "var(--dt-text)", marginTop: "0.5rem" }}>
          {isEditorMode ? (
            <InlineText
              section="faq"
              fieldKey="title"
              value={faq.title}
              onUpdateField={onUpdateField}
              isEditorMode={isEditorMode}
              isSelected={isSelected}
              collapseSheetForInlineEdit={collapseSheetForInlineEdit}
              onEditingStateChange={onEditingStateChange}
              as="span"
            />
          ) : faq.title}
        </h2>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {faq.items?.map((item, idx) => (
          <div key={idx} style={{ padding: "1.25rem 0", borderBottom: idx < (faq.items?.length ?? 0) - 1 ? "1px solid color-mix(in srgb, var(--dt-primary) 12%, transparent)" : "none" }}>
            <h3 style={{ fontFamily: "var(--dt-body-font)", color: "var(--dt-text)", fontWeight: 600, fontSize: "0.95rem", margin: 0, marginBottom: "0.4rem" }}>
              {isEditorMode ? (
                <InlineText
                  section="faq"
                  fieldKey={`items.${idx}.question`}
                  value={item.question}
                  onUpdateField={(_, __, val) => handleUpdateItem(idx, "question", val)}
                  isEditorMode={isEditorMode}
                  isSelected={isSelected}
                  collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                  onEditingStateChange={onEditingStateChange}
                  as="span"
                />
              ) : item.question}
            </h3>
            <p style={{ color: "var(--dt-text-muted)", fontSize: "0.875rem", lineHeight: 1.7, margin: 0 }}>
              {isEditorMode ? (
                <InlineText
                  section="faq"
                  fieldKey={`items.${idx}.answer`}
                  value={item.answer}
                  onUpdateField={(_, __, val) => handleUpdateItem(idx, "answer", val)}
                  isEditorMode={isEditorMode}
                  isSelected={isSelected}
                  collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                  onEditingStateChange={onEditingStateChange}
                  multiline
                  as="span"
                />
              ) : item.answer}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
