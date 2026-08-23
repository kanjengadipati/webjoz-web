"use client";
import React from "react";
import type { ComponentType } from "react";
import type { DesignToken, TemplateProps } from "../../templates/types";
import FaqClassic from "./classic";
import FaqSimple from "./simple";
import FaqColumns from "./columns";
import FaqSidebarCategory from "./sidebar-category";
import FaqTwoColumnGrid from "./two-column-grid";
import FaqChatBubbleStyle from "./chat-bubble-style";

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
    />
  );
}
