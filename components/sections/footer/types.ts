"use client";
import type { DesignToken } from "../../templates/types";

export interface FooterVariantProps {
  footer: {
    copyright_text?: string;
    tagline?: string;
    social_links?: Array<{ platform: string; url: string }>;
    slogan?: string;
    cta_text?: string;
    newsletter_title?: string;
    newsletter_description?: string;
    social_title?: string;
    [key: string]: unknown;
  };
  design_token?: DesignToken | null;
  brand_name?: string;
  language?: "id" | "en";
  hasBlog?: boolean;
  contactAddress?: string;
  contactMapsUrl?: string;
  contactOpeningHours?: string;
  onUpdateField?: (section: string, key: string, value: any) => void;
  isEditorMode?: boolean;
  editorChrome?: boolean;
  isSelected?: boolean;
  collapseSheetForInlineEdit?: () => void;
  onEditingStateChange?: (isEditing: boolean) => void;
}
