"use client";
import React from "react";
import type { ComponentType } from "react";
import type { DesignToken, TemplateProps } from "../../templates/types";
import PartnersLogoWall from "./logo-wall";
import PartnersMarquee from "./marquee";
import PartnersPillGrid from "./pill-grid";

export interface PartnersVariantProps {
  partners: NonNullable<TemplateProps["content"]["partners"]>;
  design_token?: DesignToken | null;
  language?: "id" | "en";
  onUpdateField?: (section: string, key: string, value: any) => void;
  isEditorMode?: boolean;
  isSelected?: boolean;
  collapseSheetForInlineEdit?: () => void;
  onEditingStateChange?: (isEditing: boolean) => void;
}

const variants: Record<string, ComponentType<PartnersVariantProps>> = {
  "logo-wall": PartnersLogoWall,
  marquee: PartnersMarquee,
  "pill-grid": PartnersPillGrid,
};

export default function PartnersSection(props: {
  partners?: TemplateProps["content"]["partners"];
  design_token?: DesignToken | null;
  language?: "id" | "en";
  onUpdateField?: (section: string, key: string, value: any) => void;
  isEditorMode?: boolean;
  isSelected?: boolean;
  collapseSheetForInlineEdit?: () => void;
  onEditingStateChange?: (isEditing: boolean) => void;
}) {
  if (!props.partners?.items?.length) return null;
  const variant = props.design_token?.layout?.section_variants?.partners ?? "logo-wall";
  const Renderer = variants[variant] ?? PartnersLogoWall;
  return <Renderer {...props} partners={props.partners} />;
}
