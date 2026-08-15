"use client";
import React from "react";
import { SharedTestimonialsSection } from "../../templates/shared";
import type { TemplateProps, DesignToken } from "../../templates/types";

interface TestimonialsVariantProps {
  testimonials: TemplateProps["content"]["testimonials"];
  design_token?: DesignToken | null;
}

export default function TestimonialsClassic({ testimonials }: TestimonialsVariantProps) {
  return (
    <SharedTestimonialsSection
      testimonials={testimonials}
      wrapperClass="py-20 px-5 sm:px-6"
      wrapperStyle={{ background: `color-mix(in srgb, var(--dt-primary) 4%, var(--dt-bg))`, borderTop: `1px solid color-mix(in srgb, var(--dt-primary) 10%, transparent)` }}
      cardStyle={{ background: "var(--dt-surface)", border: "1px solid color-mix(in srgb, var(--dt-primary) 12%, transparent)", borderRadius: "var(--dt-radius-lg)" }}
    />
  );
}
