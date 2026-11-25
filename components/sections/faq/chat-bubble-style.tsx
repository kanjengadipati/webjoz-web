"use client";
import React from "react";
import { MessageCircleQuestion, User, Bot } from "lucide-react";
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

export default function FaqChatBubbleStyle({
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
    <section id="faq" style={{ ...py, padding: "var(--dt-spacing) 1.5rem", background: "var(--dt-bg)" }}>
      <div style={{ maxWidth: "48rem", margin: "0 auto" }}>
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
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {faq.items?.map((item, idx) => {
            return (
              <div key={idx} className="flex flex-col gap-2">
                {/* Question bubble — right-aligned with User Avatar */}
                <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "flex-end", gap: "0.5rem" }}>
                  {isEditorMode && onDeleteItem && (
                    <InlineDeleteButton onDelete={() => onDeleteItem(idx)} compact className="mb-1 flex-shrink-0" />
                  )}
                  <div
                    style={{
                      maxWidth: "80%",
                      padding: "0.65rem 1rem",
                      borderRadius: "1rem 1rem 0.2rem 1rem",
                      background: "color-mix(in srgb, var(--dt-primary) 8%, var(--dt-surface))",
                      border: "1px solid color-mix(in srgb, var(--dt-primary) 16%, transparent)",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
                    }}
                  >
                    <p style={{ fontFamily: "var(--dt-body-font)", color: "var(--dt-text)", fontWeight: 600, fontSize: "0.875rem", margin: 0, lineHeight: 1.45 }}>
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
                    </p>
                  </div>
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mb-0.5 text-xs font-semibold"
                    style={{
                      background: "color-mix(in srgb, var(--dt-text) 10%, transparent)",
                      color: "var(--dt-text)",
                    }}
                    title={L.userLabel}
                  >
                    <User className="w-3 h-3 opacity-80" />
                  </div>
                </div>

                {/* Answer bubble — left-aligned with Brand/Bot Avatar */}
                <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "flex-end", gap: "0.5rem" }}>
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mb-0.5 shadow-xs"
                    style={{
                      background: "var(--dt-primary)",
                      color: "var(--dt-primary-foreground, #fff)",
                    }}
                    title={L.supportLabel}
                  >
                    <Bot className="w-3 h-3" />
                  </div>
                  <div
                    style={{
                      maxWidth: "80%",
                      padding: "0.65rem 1rem",
                      borderRadius: "1rem 1rem 1rem 0.2rem",
                      background: "var(--dt-primary)",
                      color: "var(--dt-primary-foreground, #fff)",
                      boxShadow: "0 2px 6px color-mix(in srgb, var(--dt-primary) 20%, transparent)",
                    }}
                  >
                    <p style={{ fontSize: "0.85rem", lineHeight: 1.6, margin: 0 }}>
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
                </div>
              </div>
            );
          })}
          {isEditorMode && onAddItem && (
            <InlineAddTile
              label={L.addQuestion}
              variant="bar"
              onClick={onAddItem}
              className="w-full"
              style={{ borderRadius: "1rem", color: "var(--dt-text)" }}
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
