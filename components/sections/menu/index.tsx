"use client";
import React from "react";
import type { ComponentType } from "react";
import type { DesignToken, TemplateProps } from "../../templates/types";
import MenuClassic from "./classic";
import MenuCompact from "./compact";
import MenuCards from "./cards";

const variants: Record<string, ComponentType<{ menu: TemplateProps["content"]["menu"]; design_token?: DesignToken | null }>> = {
  grid: MenuClassic,
  compact: MenuCompact,
  cards: MenuCards,
};

export default function MenuSection({ menu, design_token }: { menu: TemplateProps["content"]["menu"]; design_token?: DesignToken | null }) {
  const variant = design_token?.layout?.section_variants?.menu ?? "grid";
  const Renderer = variants[variant] ?? MenuClassic;
  return <Renderer menu={menu} design_token={design_token} />;
}
