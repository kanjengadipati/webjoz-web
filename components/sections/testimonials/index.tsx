"use client";
import React from "react";
import { TestimonialsSection } from "../../templates/shared";
import type { TemplateProps } from "../../templates/types";

export default function TestimonialsSectionInner({ testimonials }: { testimonials: TemplateProps["content"]["testimonials"] }) {
  return (
    <TestimonialsSection
      testimonials={testimonials}
      headingClass=""
      eyebrowClass=""
      cardClass=""
      quoteClass=""
      nameClass=""
      roleClass=""
      bgClass="py-20 px-5 sm:px-6"
      sectionStyle={{ background: `color-mix(in srgb, var(--dt-primary) 4%, var(--dt-bg))`, borderTop: `1px solid color-mix(in srgb, var(--dt-primary) 10%, transparent)` }}
      cardStyle={{ background: "var(--dt-surface)", border: "1px solid color-mix(in srgb, var(--dt-primary) 12%, transparent)", borderRadius: "var(--dt-radius-lg)" }}
    />
  );
}
