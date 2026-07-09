"use client";
import React from "react";
import type { ComponentType } from "react";
import type { HeaderVariantProps } from "./types";
import LeftLogoInlineNav from "./left-logo-inline-nav";
import CenteredLogo from "./centered-logo";
import TransparentOverlay from "./transparent-overlay";

const variants: Record<string, ComponentType<HeaderVariantProps>> = {
  "left-logo-inline-nav": LeftLogoInlineNav,
  "centered-logo": CenteredLogo,
  "transparent-overlay": TransparentOverlay,
};

export default function HeaderSection(props: HeaderVariantProps) {
  const variant = props.design_token?.layout?.section_variants?.header ?? "left-logo-inline-nav";
  const Renderer = variants[variant] ?? LeftLogoInlineNav;
  return <Renderer {...props} />;
}
