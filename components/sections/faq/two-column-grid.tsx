"use client";
import React from "react";
import { MessageCircleQuestion, HelpCircle } from "lucide-react";
import type { TemplateProps, DesignToken } from "../../templates/types";
import { InlineText } from "../../templates/shared";
import { InlineAddTile, InlineDeleteButton } from "../inline-add";
import { faqStrings } from "./faq-strings";

interface FaqVariantProps {
  faq: TemplateProps["content"]["faq"];
  design_token?: DesignToken | null;
  language?: "id" | "en";
  onUpdateField?: (section: string, key: string, value: any) => void;
  isEditorMode?: boolean;
  isSelected?: boolean;
  collapseSheetForInlineEdit?: () => void;
  onEditingStateChange?: (isEditing: boolean) => void;
  onAddItem?: () => void;
  onDeleteItem?: (index: number) => void;
}

export default function FaqTwoColumnGrid({
  faq,
  language = "id",
  onUpdateField,
  isEditorMode = false,
  isSelected = false,
  collapseSheetForInlineEdit,
  onEditingStateChange,
  onAddItem,
  onDeleteItem,
}: FaqVariantProps) {
  const py = { paddingTop: "var(--dt-spacing)", paddingBottom: "var(--dt-spacing)" } as any;
  const isEN = language === "en";
  const L = faqStrings(language);

  const handleUpdateItem = (index: number, field: string, value: string) => {
    const nextItems = [...(faq.items || [])];
    nextItems[index] = { ...nextItems[index], [field]: value };
    onUpdateField?.("faq", "items", nextItems);
  };

  return (
    <section id="faq" style={{ ...py, padding: `var(--dt-spacing) 1.5rem`, background: "var(--dt-bg)" }}>
      <div style={{ maxWidth: "60rem", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <span style={{ fontSize: "0.7rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--dt-primary)" }}>{L.eyebrow}</span>
          <h2 style={{ fontFamily: "var(--dt-heading-font)", fontWeight: "var(--dt-heading-weight)" as any, fontSize: "clamp(1.35rem, 4.5cqw, 2.25rem)", color: "var(--dt-text)", marginTop: "0.5rem" }}>
            {isEditorMode ? (
              <InlineText
                section="faq"
                fieldKey="title"
                value={faq.title || L.defaultTitle}
                onUpdateField={onUpdateField}
                isEditorMode={isEditorMode}
                isSelected={isSelected}
                collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                onEditingStateChange={onEditingStateChange}
                as="span"
              />
            ) : (faq.title || L.defaultTitle)}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
          {faq.items?.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col h-full transition-all duration-200"
              style={{
                padding: "1.25rem 1.5rem",
                paddingRight: isEditorMode && onDeleteItem ? "3rem" : undefined,
                borderRadius: "var(--dt-radius)",
                background: "color-mix(in srgb, var(--dt-primary) 5%, var(--dt-surface))",
                border: "1px solid color-mix(in srgb, var(--dt-primary) 10%, transparent)",
                position: "relative",
              }}
            >
              {isEditorMode && onDeleteItem && (
                <InlineDeleteButton onDelete={() => onDeleteItem!(idx)} compact className="absolute top-2.5 right-2.5" />
              )}
              <div className="flex items-start gap-2 mb-2">
                <HelpCircle className="w-4 h-4 text-[var(--dt-primary)] shrink-0 mt-0.5 opacity-80" />
                <h3 style={{ fontFamily: "var(--dt-body-font)", color: "var(--dt-text)", fontWeight: 600, fontSize: "0.95rem", margin: 0 }}>
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
              </div>
              <p className="flex-1" style={{ color: "var(--dt-text-muted)", fontSize: "0.85rem", lineHeight: 1.7, margin: 0, paddingLeft: "1.5rem" }}>
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
          {isEditorMode && onAddItem && (
            <InlineAddTile
              label={L.addQuestion}
              variant="card"
              className="w-full h-full min-h-[160px] rounded-2xl"
              style={{ borderRadius: "var(--dt-radius)", color: "var(--dt-text)" }}
              onClick={onAddItem}
            />
          )}
        </div>

        {/* Secondary Support CTA */}
        <div
          className="mt-10 pt-6 text-center flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm"
          style={{
            borderTop: "1px dashed color-mix(in srgb, var(--dt-text) 15%, transparent)",
            color: "var(--dt-text-muted)",
          }}
        >
          <span className="flex items-center gap-1.5 font-medium">
            <MessageCircleQuestion className="w-4 h-4 text-[var(--dt-primary)] shrink-0" />
            {L.supportHelpText}
          </span>
          <a
            href="#contact"
            className="font-semibold underline underline-offset-4 transition-colors hover:opacity-80"
            style={{ color: "var(--dt-primary)" }}
          >
            {L.supportActionText} &rarr;
          </a>
        </div>
      </div>
    </section>
  );
}
