"use client";
import React from "react";
import type { DesignToken, TemplateProps } from "../../templates/types";

import { resolveVariant } from "../variant-meta";
import { STATS_VARIANTS } from "./variants";
import { ExampleBadgeWrap } from "../example-badge";

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
  const Renderer = resolveVariant<StatsVariantProps>(STATS_VARIANTS, variant, "counter-row");
  const isExample = props.stats._is_example === true;
  if (isExample && !props.isEditorMode) return null; // sample numbers never show publicly
  return (
    <ExampleBadgeWrap show={isExample} language={props.language}>
      <Renderer {...props} stats={props.stats} />
    </ExampleBadgeWrap>
  );
}
