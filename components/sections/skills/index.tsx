"use client";

import React from "react";
import type { DesignToken, TemplateProps } from "../../templates/types";
import type { SkillsVariantProps } from "./shared";

import { resolveVariant } from "../variant-meta";
import { SKILLS_VARIANTS } from "./variants";

export default function SkillsSection(props: {
  skills?: TemplateProps["content"]["skills"];
  design_token?: DesignToken | null;
  language?: "id" | "en";
  onUpdateField?: (section: string, key: string, value: any) => void;
  isEditorMode?: boolean;
  isSelected?: boolean;
  collapseSheetForInlineEdit?: () => void;
  onEditingStateChange?: (isEditing: boolean) => void;
}) {
  if (!props.skills?.groups?.length && !props.isEditorMode) return null;
  const variant = props.design_token?.layout?.section_variants?.skills ?? "chips";
  const Renderer = resolveVariant<SkillsVariantProps>(SKILLS_VARIANTS, variant, "chips");
  return <Renderer {...props} skills={props.skills ?? { groups: [] }} />;
}
