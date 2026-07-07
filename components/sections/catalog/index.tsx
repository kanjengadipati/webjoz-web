"use client";
import React from "react";
import type { ComponentType } from "react";
import type { DesignToken, TemplateProps } from "../../templates/types";
import CatalogClassic from "./classic";
import CatalogCompact from "./compact";
import CatalogCards from "./cards";

const variants: Record<string, ComponentType<{ catalog: TemplateProps["content"]["catalog"]; design_token?: DesignToken | null }>> = {
  grid: CatalogClassic,
  compact: CatalogCompact,
  cards: CatalogCards,
};

export default function CatalogSection({ catalog, design_token }: { catalog: TemplateProps["content"]["catalog"]; design_token?: DesignToken | null }) {
  const variant = design_token?.layout?.section_variants?.catalog ?? "grid";
  const Renderer = variants[variant] ?? CatalogClassic;
  return <Renderer catalog={catalog} design_token={design_token} />;
}
