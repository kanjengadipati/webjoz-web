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
}
