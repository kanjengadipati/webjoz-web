"use client";
import React from "react";
import type { ComponentType } from "react";
import type { DesignToken, TemplateProps } from "../../templates/types";
import TestimonialsClassic from "./classic";
import TestimonialsCompact from "./compact";
import TestimonialsGrid from "./grid";

const variants: Record<string, ComponentType<{ testimonials: TemplateProps["content"]["testimonials"]; design_token?: DesignToken | null }>> = {
  carousel: TestimonialsClassic,
  compact: TestimonialsCompact,
  grid: TestimonialsGrid,
};

export default function TestimonialsSection({ testimonials, design_token }: { testimonials: TemplateProps["content"]["testimonials"]; design_token?: DesignToken | null }) {
  const variant = design_token?.layout?.section_variants?.testimonials ?? "carousel";
  const Renderer = variants[variant] ?? TestimonialsClassic;
  return <Renderer testimonials={testimonials} design_token={design_token} />;
}
