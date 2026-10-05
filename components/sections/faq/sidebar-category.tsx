"use client";
import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { FaqItem, TemplateProps, DesignToken } from "../../templates/types";
import { InlineText } from "../../templates/shared";
import { InlineAddTile, InlineDeleteButton } from "../inline-add";

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

function DynamicFaqItem({
  item,
  index,
  onUpdateItem,
  onDelete,
  section = "faq",
  isEditorMode,
  isSelected,
  collapseSheetForInlineEdit,
  onEditingStateChange,
}: {
  item: FaqItem;
  index: number;
  onUpdateItem?: (index: number, field: string, value: string) => void;
  onDelete?: () => void;
  section?: string;
  isEditorMode?: boolean;
  isSelected?: boolean;
  collapseSheetForInlineEdit?: () => void;
  onEditingStateChange?: (isEditing: boolean) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const Header = isEditorMode ? "div" : "button";
  return (
    <div style={{ border: `1px solid color-mix(in srgb, var(--dt-primary) 20%, transparent)`, borderRadius: "var(--dt-radius)", overflow: "hidden", position: "relative" }}>
      <Header
        {...(isEditorMode
          ? { role: "button", tabIndex: 0, onKeyDown: (e: React.KeyboardEvent) => { if (e.key === "Enter" || e.key === " ") setIsOpen(!isOpen); } }
          : { type: "button" as const }
        )}
        onClick={() => setIsOpen(!isOpen)}
        style={{ width: "100%", padding: isEditorMode && onDelete ? "0.85rem 3rem 0.85rem 1rem" : "0.85rem 1rem", display: "flex", justifyContent: "space-between", alignItems: "center", background: "transparent", cursor: "pointer", color: "var(--dt-text)", fontWeight: 600, textAlign: "left" as const, gap: "1rem" }}>
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
        <ChevronDown style={{ width: 14, height: 14, flexShrink: 0, color: "var(--dt-text-muted)", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.28s ease" }} />
      </Header>

      {isEditorMode && onDelete && (
        <InlineDeleteButton onDelete={onDelete} compact className="absolute top-2.5 right-2.5" />
      )}
      <div style={{ display: "grid", gridTemplateRows: isOpen ? "1fr" : "0fr", transition: "grid-template-rows 0.28s ease" }}>
        <div style={{ overflow: "hidden" }}>
          <div style={{ padding: "0 1rem 1rem", fontSize: "0.85rem", lineHeight: 1.7, color: "var(--dt-text-muted)", borderTop: `1px solid color-mix(in srgb, var(--dt-primary) 12%, transparent)` }}>
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
}

export default function FaqSidebarCategory({
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
  const isEN = language === "en";
  const rawItems = faq.items || [];
  // Never invent category names on the public site — only categories the user
  // actually authored. Items without a category simply have no pill.
  const items = rawItems.map((it) => ({ ...it, category: it.category || "" }));
  const categories = [...new Set(items.map(i => i.category).filter(Boolean))] as string[];
  const [activeCat, setActiveCat] = useState(categories[0] || "");

  const handleUpdateItem = (index: number, field: string, value: string) => {
    const nextItems = [...items];
    nextItems[index] = { ...nextItems[index], [field]: value };
    onUpdateField?.("faq", "items", nextItems);
  };

  const handleAddItem = () => {
    if (!onUpdateField) return;
    const nextItems = [...items];
    nextItems.push({
      question: isEN ? "New Question" : "Pertanyaan Baru",
      answer: isEN ? "Answer to the question goes here." : "Jawaban pertanyaan Anda di sini.",
      category: activeCat,
    });
    onUpdateField("faq", "items", nextItems);
  };
  return (
    <section id="faq" style={{ padding: `var(--dt-spacing) 1.5rem`, maxWidth: "72rem", margin: "0 auto" }}>
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
      {categories.length > 0 && (
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "2rem", flexWrap: "wrap", justifyContent: "center" }}>
          {categories.map(cat => {
            const catIdx = items.findIndex(i => i.category === cat);
            return (
              <button key={cat} onClick={() => setActiveCat(cat)}
                style={{ padding: "0.4rem 1rem", borderRadius: "2rem", fontSize: "0.8rem", fontWeight: 600, border: `1px solid ${activeCat === cat ? "var(--dt-primary)" : "color-mix(in srgb, var(--dt-primary) 20%, transparent)"}`, background: activeCat === cat ? "var(--dt-primary)" : "transparent", color: activeCat === cat ? "var(--dt-cta-text, #fff)" : "var(--dt-text)", cursor: "pointer", transition: "all 0.2s" }}>
                {isEditorMode ? (
                  <InlineText
                    section="faq"
                    fieldKey={`items.${catIdx}.category`}
                    value={cat}
                    onUpdateField={(_, __, val) => {
                      handleUpdateItem(catIdx, "category", val);
                      if (activeCat === cat) setActiveCat(val);
                    }}
                    isEditorMode={isEditorMode}
                    isSelected={isSelected}
                    as="span"
                    collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                    onEditingStateChange={onEditingStateChange}
                  />
                ) : cat}
              </button>
            );
          })}
        </div>
      )}
      <div style={{ maxWidth: "48rem", margin: "0 auto", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {items.map((item, idx) => {
          if (activeCat && item.category && item.category !== activeCat) return null;
          return (
            <DynamicFaqItem
              key={idx}
              item={item}
              index={idx}
              onUpdateItem={handleUpdateItem}
              onDelete={onDeleteItem ? () => onDeleteItem(idx) : undefined}
              section="faq"
              isEditorMode={isEditorMode}
              isSelected={isSelected}
              collapseSheetForInlineEdit={collapseSheetForInlineEdit}
              onEditingStateChange={onEditingStateChange}
            />
          );
        })}
        {isEditorMode && onAddItem && (
          <InlineAddTile
            label={isEN ? "Add question" : "Tambah Pertanyaan"}
            onClick={handleAddItem}
            className="w-full"
            style={{ borderRadius: "var(--dt-radius)", color: "var(--dt-text)" }}
          />
        )}
      </div>
    </section>
  );
}
