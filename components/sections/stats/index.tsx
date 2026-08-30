"use client";
import React from "react";
import type { ComponentType } from "react";
import type { DesignToken, TemplateProps } from "../../templates/types";
import StatsCounterRow from "./counter-row";
import StatsCardGrid from "./card-grid";
import StatsMinimalSplit from "./minimal-split";

export interface StatsVariantProps {
  stats: NonNullable<TemplateProps["content"]["stats"]>;
  design_token?: DesignToken | null;
  language?: "id" | "en";
  onUpdateField?: (section: string, key: string, value: any) => void;
  isEditorMode?: boolean;
  isSelected?: boolean;
  collapseSheetForInlineEdit?: () => void;
  onEditingStateChange?: (isEditing: boolean) => void;
}

const variants: Record<string, ComponentType<StatsVariantProps>> = {
  "counter-row": StatsCounterRow,
  "card-grid": StatsCardGrid,
  "minimal-split": StatsMinimalSplit,
};

export default function StatsSection(props: {
  stats?: TemplateProps["content"]["stats"];
  design_token?: DesignToken | null;
  language?: "id" | "en";
  onUpdateField?: (section: string, key: string, value: any) => void;
  isEditorMode?: boolean;
  isSelected?: boolean;
  collapseSheetForInlineEdit?: () => void;
  onEditingStateChange?: (isEditing: boolean) => void;
}) {
  if (!props.stats?.items?.length) return null;
  const variant = props.design_token?.layout?.section_variants?.stats ?? "counter-row";
  const Renderer = variants[variant] ?? StatsCounterRow;
  return <Renderer {...props} stats={props.stats} />;
}
