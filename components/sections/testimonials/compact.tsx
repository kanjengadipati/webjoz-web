"use client";
import React from "react";
import { SharedTestimonialsSection } from "../../templates/shared";
import type { TemplateProps, DesignToken } from "../../templates/types";

interface TestimonialsVariantProps {
  testimonials: TemplateProps["content"]["testimonials"];
  design_token?: DesignToken | null;
}

export default function TestimonialsCompact({ testimonials }: TestimonialsVariantProps) {
  return (
    <SharedTestimonialsSection
      testimonials={testimonials}
      variant="carousel"
      wrapperClass="py-16 px-5 sm:px-6"
      wrapperStyle={{ background: "transparent" }}
      cardStyle={{ background: "var(--dt-surface)", border: "1px solid color-mix(in srgb, var(--dt-primary) 15%, transparent)", borderRadius: "var(--dt-radius-lg)" }}
    />
  );
}
