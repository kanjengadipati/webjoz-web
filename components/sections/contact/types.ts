"use client";
import type { DesignToken, TemplateProps } from "../../templates/types";

export interface ContactVariantProps {
  contact: TemplateProps["content"]["contact"];
  design_token?: DesignToken | null;
  onSubmitLead?: TemplateProps["onSubmitLead"];
  leadSubmitting?: boolean;
  leadSuccess?: boolean;
  leadError?: string | null;
  footer?: TemplateProps["content"]["footer"];
  onUpdateField?: (section: string, key: string, value: any) => void;
  isEditorMode?: boolean;
  isSelected?: boolean;
  collapseSheetForInlineEdit?: () => void;
  onEditingStateChange?: (isEditing: boolean) => void;
}
