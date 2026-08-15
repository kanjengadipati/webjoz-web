"use client";
import React, { useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import type { FaqItem, TemplateProps, DesignToken } from "../../templates/types";
import { InlineText } from "../../templates/shared";

const DynamicFaqAccordion: React.FC<{
  item: FaqItem;
  index: number;
  onUpdateItem?: (index: number, field: string, value: string) => void;
  section?: string;
  isEditorMode?: boolean;
  isSelected?: boolean;
  collapseSheetForInlineEdit?: () => void;
  onEditingStateChange?: (isEditing: boolean) => void;
}> = ({ item, index, onUpdateItem, section = "faq", isEditorMode, isSelected, collapseSheetForInlineEdit, onEditingStateChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const reactId = useId();
  const answerId = `dtfaq-answer-${reactId}`;
  return (
    <div
      className="dt-faq-item"
      style={{
        border: "1px solid color-mix(in srgb, var(--dt-primary) 20%, transparent)",
        borderRadius: "var(--dt-radius)",
        overflow: "hidden",
        transition: "box-shadow 0.2s ease",
        boxShadow: isOpen ? "0 2px 12px color-mix(in srgb, var(--dt-primary) 8%, transparent)" : "none",
      }}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={answerId}
        style={{
          width: "100%", padding: "1rem 1.25rem",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          background: isOpen ? "color-mix(in srgb, var(--dt-primary) 5%, transparent)" : "transparent",
          cursor: "pointer",
          fontFamily: "var(--dt-body-font)",
          color: "var(--dt-text)",
          fontWeight: 600,
          textAlign: "left",
          gap: "1rem",
          transition: "background 0.2s ease",
        }}
      >
        <span style={{ fontSize: "0.875rem", flex: 1 }}>
          {isEditorMode ? (
            <InlineText
              section={section}
              fieldKey={`items.${index}.question`}
              value={item.question}
              onUpdateField={(_, __, val) => onUpdateItem?.(index, "question", val)}
              isEditorMode={isEditorMode}
              isSelected={isSelected}
              collapseSheetForInlineEdit={collapseSheetForInlineEdit}
              onEditingStateChange={onEditingStateChange}
              as="span"
            />
          ) : item.question}
        </span>
        <ChevronDown
          style={{
            width: 16, height: 16, flexShrink: 0,
            color: isOpen ? "var(--dt-primary)" : "var(--dt-text-muted)",
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.28s ease, color 0.2s ease",
          }}
        />
      </button>

      {/* Grid trick: smooth height animation without knowing exact height */}
      <div
        id={answerId}
        style={{
          display: "grid",
          gridTemplateRows: isOpen ? "1fr" : "0fr",
          transition: "grid-template-rows 0.28s ease",
        }}
      >
        <div style={{ overflow: "hidden" }}>
          <div style={{
            padding: "0 1.25rem 1.25rem",
            fontSize: "0.875rem",
            lineHeight: 1.7,
            color: "var(--dt-text-muted)",
            borderTop: "1px solid color-mix(in srgb, var(--dt-primary) 12%, transparent)",
            background: "color-mix(in srgb, var(--dt-primary) 3%, transparent)",
          }}>
            {isEditorMode ? (
              <InlineText
                section={section}
                fieldKey={`items.${index}.answer`}
                value={item.answer}
                onUpdateField={(_, __, val) => onUpdateItem?.(index, "answer", val)}
                isEditorMode={isEditorMode}
                isSelected={isSelected}
                collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                onEditingStateChange={onEditingStateChange}
                multiline
                as="div"
              />
            ) : item.answer}
          </div>
        </div>
      </div>
    </div>
  );
};

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

export default function FaqClassic({
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
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {faq.items?.map((item, idx) => (
          <DynamicFaqAccordion
            key={idx}
            item={item}
            index={idx}
            onUpdateItem={handleUpdateItem}
            section="faq"
            isEditorMode={isEditorMode}
            isSelected={isSelected}
            collapseSheetForInlineEdit={collapseSheetForInlineEdit}
            onEditingStateChange={onEditingStateChange}
          />
        ))}
      </div>
    </section>
  );
}
