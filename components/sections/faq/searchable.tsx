"use client";
import React, { useId, useState, useMemo } from "react";
import { ChevronDown, MessageCircleQuestion, Search, X } from "lucide-react";
import type { FaqItem, TemplateProps, DesignToken } from "../../templates/types";
import { InlineText } from "../../templates/shared";
import { InlineAddTile, InlineDeleteButton } from "../inline-add";
import { faqStrings } from "./faq-strings";

const DynamicFaqAccordionItem: React.FC<{
  item: FaqItem;
  index: number;
  defaultOpen?: boolean;
  onUpdateItem?: (index: number, field: string, value: string) => void;
  onDelete?: () => void;
  section?: string;
  isEditorMode?: boolean;
  isSelected?: boolean;
  collapseSheetForInlineEdit?: () => void;
  onEditingStateChange?: (isEditing: boolean) => void;
  deleteQuestionTitle?: string;
}> = ({
  item,
  index,
  defaultOpen = false,
  onUpdateItem,
  onDelete,
  section = "faq",
  isEditorMode,
  isSelected,
  collapseSheetForInlineEdit,
  onEditingStateChange,
  deleteQuestionTitle,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const effectiveOpen = isEditorMode ? true : isOpen;
  const reactId = useId();
  const answerId = `dtfaq-searchable-answer-${reactId}`;
  const Header = isEditorMode ? "div" : "button";

  return (
    <div
      className="dt-faq-item"
      style={{
        border: "1px solid color-mix(in srgb, var(--dt-primary) 18%, transparent)",
        borderRadius: "var(--dt-radius-lg)",
        background: "color-mix(in srgb, var(--dt-primary) 2.5%, var(--dt-bg))",
        overflow: "hidden",
        position: "relative",
        transition: "all 0.2s ease",
        boxShadow: effectiveOpen
          ? "0 4px 16px color-mix(in srgb, var(--dt-primary) 8%, transparent)"
          : "none",
      }}
    >
      <Header
        {...(isEditorMode
          ? {
              role: "button",
              tabIndex: 0,
              onKeyDown: (e: React.KeyboardEvent) => {
                if (e.key === "Enter" || e.key === " ") setIsOpen(!isOpen);
              },
            }
          : {
              type: "button" as const,
              "aria-expanded": effectiveOpen,
              "aria-controls": answerId,
            })}
        onClick={() => {
          if (!isEditorMode) setIsOpen(!isOpen);
        }}
        style={{
          width: "100%",
          padding: isEditorMode && onDelete ? "1.1rem 3.25rem 1.1rem 1.25rem" : "1.1rem 1.25rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: effectiveOpen
            ? "color-mix(in srgb, var(--dt-primary) 5%, transparent)"
            : "transparent",
          cursor: isEditorMode ? "default" : "pointer",
          fontFamily: "var(--dt-body-font)",
          color: "var(--dt-text)",
          fontWeight: 600,
          textAlign: "left" as const,
          gap: "1rem",
          transition: "background 0.2s ease",
        }}
      >
        <span style={{ fontSize: "0.925rem", flex: 1, lineHeight: 1.45 }}>
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
          ) : (
            item.question
          )}
        </span>
        <ChevronDown
          style={{
            width: 18,
            height: 18,
            flexShrink: 0,
            color: effectiveOpen ? "var(--dt-primary)" : "var(--dt-text-muted)",
            transform: effectiveOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.28s ease, color 0.2s ease",
          }}
        />
      </Header>

      {effectiveOpen && (
        <div
          id={answerId}
          style={{
            padding: "0 1.25rem 1.25rem 1.25rem",
            color: "var(--dt-text-muted)",
            fontFamily: "var(--dt-body-font)",
            fontSize: "0.875rem",
            lineHeight: 1.7,
            borderTop: "1px solid color-mix(in srgb, var(--dt-primary) 10%, transparent)",
            paddingTop: "0.875rem",
          }}
        >
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
              as="p"
              style={{ margin: 0, whiteSpace: "pre-line" }}
            />
          ) : (
            <p style={{ margin: 0, whiteSpace: "pre-line" }}>{item.answer}</p>
          )}
        </div>
      )}

      {isEditorMode && onDelete && (
        <div style={{ position: "absolute", top: "0.85rem", right: "0.85rem", zIndex: 10 }}>
          <InlineDeleteButton compact onDelete={onDelete} title={deleteQuestionTitle} />
        </div>
      )}
    </div>
  );
};

export interface FaqVariantProps {
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

export default function FaqSearchable({
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
  const L = faqStrings(language);
  const [searchTerm, setSearchTerm] = useState("");

  const handleUpdateItem = (index: number, field: string, value: string) => {
    const nextItems = [...(faq.items || [])];
    nextItems[index] = { ...nextItems[index], [field]: value };
    onUpdateField?.("faq", "items", nextItems);
  };

  const allItems = faq?.items || [];

  const filteredItemsWithOriginalIndex = useMemo(() => {
    if (isEditorMode || !searchTerm.trim()) {
      return allItems.map((item, idx) => ({ item, originalIndex: idx }));
    }
    const q = searchTerm.toLowerCase();
    return allItems
      .map((item, idx) => ({ item, originalIndex: idx }))
      .filter(
        ({ item }) =>
          (item.question && item.question.toLowerCase().includes(q)) ||
          (item.answer && item.answer.toLowerCase().includes(q))
      );
  }, [allItems, searchTerm, isEditorMode]);

  return (
    <section id="faq" style={{ ...py, padding: `var(--dt-spacing) 1.5rem`, background: "var(--dt-bg)" }}>
      <div style={{ maxWidth: "52rem", margin: "0 auto" }}>
        {/* Section Header */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
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
              {L.eyebrow}
            </span>
          </div>
          <InlineText
            section="faq"
            fieldKey="title"
            value={faq.title || L.defaultTitle}
            onUpdateField={onUpdateField}
            isEditorMode={isEditorMode}
            isSelected={isSelected}
            as="h2"
            style={{
              fontFamily: "var(--dt-heading-font)",
              fontWeight: "var(--dt-heading-weight)" as any,
              fontSize: "clamp(1.35rem, 4.5cqw, 2.25rem)",
              color: "var(--dt-text)",
              margin: 0,
            }}
            collapseSheetForInlineEdit={collapseSheetForInlineEdit}
            onEditingStateChange={onEditingStateChange}
          />

          {/* Real-time Search Input */}
          <div className="mt-8 max-w-lg mx-auto relative">
            <div
              className="flex items-center gap-3 px-4 py-3 rounded-full border transition-all duration-200"
              style={{
                background: "var(--dt-surface)",
                borderColor: searchTerm
                  ? "var(--dt-primary)"
                  : "color-mix(in srgb, var(--dt-primary) 22%, transparent)",
                boxShadow: "0 4px 16px color-mix(in srgb, var(--dt-primary) 6%, transparent)",
              }}
            >
              <Search className="w-5 h-5 text-muted-foreground shrink-0" style={{ color: "var(--dt-primary)" }} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={L.searchPlaceholder}
                className="w-full bg-transparent text-sm focus:outline-hidden"
                style={{ color: "var(--dt-text)" }}
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="p-1 rounded-full hover:bg-muted text-muted-foreground transition-colors cursor-pointer"
                  aria-label={L.clearSearch}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Q&A List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {filteredItemsWithOriginalIndex.map(({ item, originalIndex }) => (
            <DynamicFaqAccordionItem
              key={originalIndex}
              item={item}
              index={originalIndex}
              defaultOpen={searchTerm.trim().length > 0}
              onUpdateItem={handleUpdateItem}
              onDelete={onDeleteItem ? () => onDeleteItem(originalIndex) : undefined}
              section="faq"
              isEditorMode={isEditorMode}
              isSelected={isSelected}
              collapseSheetForInlineEdit={collapseSheetForInlineEdit}
              onEditingStateChange={onEditingStateChange}
              deleteQuestionTitle={L.deleteQuestionTitle}
            />
          ))}

          {filteredItemsWithOriginalIndex.length === 0 && (
            <div
              className="text-center py-12 px-4 rounded-xl border border-dashed"
              style={{
                borderColor: "color-mix(in srgb, var(--dt-primary) 20%, transparent)",
                background: "color-mix(in srgb, var(--dt-primary) 2%, transparent)",
              }}
            >
              <p style={{ color: "var(--dt-text-muted)", fontSize: "0.9rem", margin: 0 }}>
                {L.noQuestionsFound}
              </p>
            </div>
          )}

          {isEditorMode && onAddItem && (
            <div style={{ marginTop: "0.5rem" }}>
              <InlineAddTile
                label={L.addQuestion}
                onClick={onAddItem}
                style={{ borderRadius: "var(--dt-radius-lg)" }}
              />
            </div>
          )}
        </div>

        {/* Support Help Footer */}
        <div style={{ marginTop: "3.5rem", textAlign: "center" }}>
          <p
            style={{
              fontSize: "0.875rem",
              color: "var(--dt-text-muted)",
              marginBottom: "0.75rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.4rem",
            }}
          >
            <MessageCircleQuestion style={{ width: 16, height: 16, color: "var(--dt-primary)" }} />
            {L.supportHelpText}
          </p>
          <a
            href="#contact"
            style={{
              fontSize: "0.875rem",
              fontWeight: 700,
              color: "var(--dt-primary)",
              textDecoration: "underline",
              textUnderlineOffset: "4px",
            }}
          >
            {L.supportActionText} &rarr;
          </a>
        </div>
      </div>
    </section>
  );
}
