"use client";
import React, { useCallback } from "react";
import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import type { DesignToken, TemplateProps } from "../../templates/types";

const FaqClassic = dynamic(() => import("./classic"));
const FaqSimple = dynamic(() => import("./simple"));
const FaqColumns = dynamic(() => import("./columns"));
const FaqSidebarCategory = dynamic(() => import("./sidebar-category"));
const FaqTwoColumnGrid = dynamic(() => import("./two-column-grid"));
const FaqChatBubbleStyle = dynamic(() => import("./chat-bubble-style"));

const variants: Record<string, ComponentType<any>> = {
  accordion: FaqClassic,
  simple: FaqSimple,
  columns: FaqColumns,
  "sidebar-category": FaqSidebarCategory,
  "two-column-grid": FaqTwoColumnGrid,
  "chat-bubble-style": FaqChatBubbleStyle,
};

export default function FaqSection({
  faq,
  design_token,
  language,
  onUpdateField,
  isEditorMode = false,
  isSelected = false,
  collapseSheetForInlineEdit,
  onEditingStateChange,
}: {
  faq: TemplateProps["content"]["faq"];
  design_token?: DesignToken | null;
  language?: "id" | "en";
  onUpdateField?: (section: string, key: string, value: any) => void;
  isEditorMode?: boolean;
  isSelected?: boolean;
  collapseSheetForInlineEdit?: () => void;
  onEditingStateChange?: (isEditing: boolean) => void;
}) {
  const variant = design_token?.layout?.section_variants?.faq ?? "accordion";
  const Renderer = variants[variant] ?? FaqClassic;
  const isEditor = !!isEditorMode;

  const onAddItem = useCallback(() => {
    if (!onUpdateField) return;
    const items = [...(faq?.items ?? [])];
    items.push({ question: "Pertanyaan yang sering ditanya?", answer: "Jawaban pertanyaan di sini", category: null });
    onUpdateField("faq", "items", items);
  }, [faq?.items, onUpdateField]);

  const onDeleteItem = useCallback(
    (index: number) => {
      if (!onUpdateField) return;
      const items = (faq?.items ?? []).filter((_, i) => i !== index);
      onUpdateField("faq", "items", items);
    },
    [faq?.items, onUpdateField]
  );

  return (
    <Renderer
      faq={faq}
      design_token={design_token}
      language={language}
      onUpdateField={onUpdateField}
      isEditorMode={isEditorMode}
      isSelected={isSelected}
      collapseSheetForInlineEdit={collapseSheetForInlineEdit}
      onEditingStateChange={onEditingStateChange}
      onAddItem={isEditor ? onAddItem : undefined}
      onDeleteItem={isEditor ? onDeleteItem : undefined}
    />
  );
}
