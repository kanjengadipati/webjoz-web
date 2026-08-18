"use client";
import React from "react";
import type { ComponentType } from "react";
import type { FooterVariantProps } from "./types";
import MinimalBand from "./minimal-band";
import ColumnsWithSocial from "./columns-with-social";
import ColumnsWithNav from "./columns-with-nav";
import NewsletterCta from "./newsletter-cta";

const variants: Record<string, ComponentType<FooterVariantProps>> = {
  "minimal-band": MinimalBand,
  "columns-with-social": ColumnsWithSocial,
  "columns-with-nav": ColumnsWithNav,
  "newsletter-cta": ColumnsWithNav,
};

export default function FooterSection(props: FooterVariantProps) {
  const variant = props.design_token?.layout?.section_variants?.footer ?? "minimal-band";
  const Renderer = variants[variant] ?? MinimalBand;
  return <Renderer {...props} />;
}
