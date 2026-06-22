"use client";
import React from "react";
import type { ComponentType } from "react";
import type { HeroVariantProps } from "./types";
import { DesignToken, TemplateProps } from "../../templates/types";
import HeroCentered from "./centered";
import HeroSplit from "./split";
import HeroMinimal from "./minimal";
import HeroFullBleed from "./full-bleed";

const variants: Record<string, ComponentType<HeroVariantProps>> = {
  centered: HeroCentered,
  split: HeroSplit,
  minimal: HeroMinimal,
  "full-bleed": HeroFullBleed,
};

export default function HeroSection({ hero, design_token }: { hero: TemplateProps["content"]["hero"]; design_token?: DesignToken | null }) {
  const heroStyle = design_token?.layout?.hero_style ?? "centered";
  const Renderer = variants[heroStyle] ?? HeroCentered;
  return <Renderer hero={hero} design_token={design_token} />;
}
