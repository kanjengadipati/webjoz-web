"use client";

import React from "react";
import type { DesignToken, TemplateProps } from "@/components/templates/types";

export interface BaseSectionFormProps {
  content: TemplateProps["content"];
  updateField: (section: string, key: string, value: any) => void;
  needsAttention: (fieldKey: string) => boolean;
  fieldClass: (key: string, base: string) => string;
  fieldUndoStacks?: Record<string, string[]>;
  undoField?: (section: string, key: string) => void;
  renderFieldActions?: (section: string, fieldKey: string, aiButton?: React.ReactNode) => React.ReactNode;
  designToken?: DesignToken | null;
  businessType?: string;
  isPremium?: boolean;
  onUpgradeRequired?: () => void;
  handleAiImage?: (section: string, fieldKey: string, url: string) => void;
  handleAiText?: (section: string, fieldKey: string, prompt: string, label: string) => void;
  aiLoadingField?: string | null;
  updateDesignTokenLayout?: (key: string, value: any) => void;
  token?: string | null;
  activeTenantId?: number | string | null;
  siteId?: number | null;
  subdomain?: string;
}

