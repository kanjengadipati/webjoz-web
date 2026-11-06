"use client";

import React from "react";
import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import type { DesignToken, TemplateProps } from "../../templates/types";
import type { SkillsVariantProps } from "./shared";

const SkillsChips = dynamic(() => import("./chips"), { ssr: true });
const SkillsGroupedList = dynamic(() => import("./grouped-list"), { ssr: true });
const SkillsMeter = dynamic(() => import("./meter"), { ssr: true });

const variants: Record<string, ComponentType<SkillsVariantProps>> = {
  chips: SkillsChips,
  "grouped-list": SkillsGroupedList,
  meter: SkillsMeter,
};

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
  const Renderer = variants[variant] ?? SkillsChips;
  return <Renderer {...props} skills={props.skills ?? { groups: [] }} />;
}
