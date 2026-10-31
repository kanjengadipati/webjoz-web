import type { DesignToken, TemplateProps } from "../../templates/types";

export interface HeroVariantProps {
  hero: TemplateProps["content"]["hero"];
  /** Contact data — used by map/location hero variants (address, maps_url, tile style). */
  contact?: TemplateProps["content"]["contact"];
  /** Lead submission — used by booking-form hero variant. */
  onSubmitLead?: TemplateProps["onSubmitLead"];
  leadSubmitting?: boolean;
  leadSuccess?: boolean;
  leadError?: string | null;
  design_token?: DesignToken | null;
  language?: string;
  onUpdateField?: TemplateProps["onUpdateField"];
  isEditorMode?: boolean;
  isSelected?: boolean;
  collapseSheetForInlineEdit?: () => void;
  onEditingStateChange?: (isEditing: boolean) => void;
}
