"use client";
import React from "react";
import type { ComponentType } from "react";
import type { DesignToken, TemplateProps } from "../../templates/types";
import MenuClassic from "./classic";
import MenuCompact from "./compact";
import MenuCards from "./cards";
import MenuTextList from "./text-list";
import MenuCompactList from "./compact-list";
import MenuTabsByCategory from "./tabs-by-category";
import MenuAccordionByCategory from "./accordion-by-category";

const variants: Record<string, ComponentType<{ menu: TemplateProps["content"]["menu"]; design_token?: DesignToken | null }>> = {
  // existing
  grid: MenuClassic,
  compact: MenuCompact,
  cards: MenuCards,
  // new
  "text-list": MenuTextList,
  "compact-list": MenuCompactList,
  "tabs-by-category": MenuTabsByCategory,
  "accordion-by-category": MenuAccordionByCategory,
};

export default function MenuSection({ menu, design_token }: { menu: TemplateProps["content"]["menu"]; design_token?: DesignToken | null }) {
  const variant = design_token?.layout?.section_variants?.menu ?? "grid";
  const Renderer = variants[variant] ?? MenuClassic;
  return <Renderer menu={menu} design_token={design_token} />;
}
