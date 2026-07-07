"use client";
import React from "react";
import type { ComponentType } from "react";
import type { DesignToken, TemplateProps } from "../../templates/types";
import CtaClassic from "./classic";
import CtaCard from "./card";
import CtaCentered from "./centered";

const variants: Record<string, ComponentType<{ cta: TemplateProps["content"]["cta"]; design_token?: DesignToken | null }>> = {
  banner: CtaClassic,
  card: CtaCard,
  centered: CtaCentered,
};

export default function CtaSection({ cta, design_token }: { cta: TemplateProps["content"]["cta"]; design_token?: DesignToken | null }) {
  const variant = design_token?.layout?.section_variants?.cta ?? "banner";
  const Renderer = variants[variant] ?? CtaClassic;
  return <Renderer cta={cta} design_token={design_token} />;
}
