"use client";
import React from "react";
import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import type { HeaderVariantProps } from "./types";

const LeftLogoInlineNav = dynamic(() => import("./left-logo-inline-nav"));
const CenteredLogo = dynamic(() => import("./centered-logo"));
const TransparentOverlay = dynamic(() => import("./transparent-overlay"));
const LogoWithCtaButton = dynamic(() => import("./logo-with-cta-button"));
const StackedLogoTagline = dynamic(() => import("./stacked-logo-tagline"));

const variants: Record<string, ComponentType<HeaderVariantProps>> = {
  "left-logo-inline-nav": LeftLogoInlineNav,
  "centered-logo": CenteredLogo,
  "transparent-overlay": TransparentOverlay,
  "logo-with-cta-button": LogoWithCtaButton,
  "stacked-logo-tagline": StackedLogoTagline,
};

export default function HeaderSection(props: HeaderVariantProps) {
  const variant = props.design_token?.layout?.section_variants?.header ?? "left-logo-inline-nav";
  const Renderer = variants[variant] ?? LeftLogoInlineNav;
  const navHidden = props.design_token?.layout?.nav_hidden_sections ?? [];
  const autoHidden = props.sectionOrder?.includes("works") ? ["catalog"] : [];
  const mergedHiddenSections = [...new Set([...(props.hiddenSections ?? []), ...navHidden, ...autoHidden])];
  return <Renderer {...props} hiddenSections={mergedHiddenSections} language={props.language} />;
}
