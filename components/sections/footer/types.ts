"use client";
import type { DesignToken } from "../../templates/types";

export interface FooterVariantProps {
  footer: {
    copyright_text?: string;
    tagline?: string;
    social_links?: Array<{ platform: string; url: string }>;
  };
  design_token?: DesignToken | null;
  brand_name?: string;
  hasBlog?: boolean;
  onUpdateField?: (section: string, key: string, value: any) => void;
  isEditorMode?: boolean;
  isSelected?: boolean;
  collapseSheetForInlineEdit?: () => void;
  onEditingStateChange?: (isEditing: boolean) => void;
}
