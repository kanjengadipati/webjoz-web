import type { DesignToken, TemplateProps } from "../../templates/types";

export interface HeroVariantProps {
  hero: TemplateProps["content"]["hero"];
  design_token?: DesignToken | null;
  onUpdateField?: (section: string, key: string, value: any) => void;
  isEditorMode?: boolean;
  isSelected?: boolean;
  collapseSheetForInlineEdit?: () => void;
  onEditingStateChange?: (isEditing: boolean) => void;
}
