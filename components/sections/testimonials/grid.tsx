"use client";
import React from "react";
import { TestimonialsSection } from "../../templates/shared";
import type { TemplateProps, DesignToken } from "../../templates/types";

interface TestimonialsVariantProps {
  testimonials: TemplateProps["content"]["testimonials"];
  design_token?: DesignToken | null;
}

export default function TestimonialsGrid({ testimonials }: TestimonialsVariantProps) {
  return (
    <TestimonialsSection
      testimonials={testimonials}
      variant="grid"
      wrapperClass="py-20 px-5 sm:px-6"
      wrapperStyle={{ background: `color-mix(in srgb, var(--dt-primary) 3%, var(--dt-bg))`, borderTop: `1px solid color-mix(in srgb, var(--dt-primary) 8%, transparent)` }}
      cardStyle={{ background: "var(--dt-surface)", border: "1px solid color-mix(in srgb, var(--dt-primary) 10%, transparent)", borderRadius: "var(--dt-radius-lg)", boxShadow: "0 2px 12px color-mix(in srgb, var(--dt-primary) 6%, transparent)" }}
    />
  );
}
