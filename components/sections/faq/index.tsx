"use client";
import React from "react";
import type { ComponentType } from "react";
import type { DesignToken, TemplateProps } from "../../templates/types";
import FaqClassic from "./classic";
import FaqSimple from "./simple";
import FaqColumns from "./columns";

const variants: Record<string, ComponentType<{ faq: TemplateProps["content"]["faq"]; design_token?: DesignToken | null }>> = {
  accordion: FaqClassic,
  simple: FaqSimple,
  columns: FaqColumns,
};

export default function FaqSection({ faq, design_token }: { faq: TemplateProps["content"]["faq"]; design_token?: DesignToken | null }) {
  const variant = design_token?.layout?.section_variants?.faq ?? "accordion";
  const Renderer = variants[variant] ?? FaqClassic;
  return <Renderer faq={faq} design_token={design_token} />;
}
