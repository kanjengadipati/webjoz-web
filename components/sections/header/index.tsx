"use client";
import React from "react";
import type { HeaderVariantProps } from "./types";

import { resolveVariant } from "../variant-meta";
import { HEADER_VARIANTS } from "./variants";

export default function HeaderSection(props: HeaderVariantProps) {
  const variant = props.design_token?.layout?.section_variants?.header ?? "left-logo-inline-nav";
  const Renderer = resolveVariant<HeaderVariantProps>(HEADER_VARIANTS, variant, "left-logo-inline-nav");
  const navHidden = props.design_token?.layout?.nav_hidden_sections ?? [];
  const autoHidden = props.sectionOrder?.includes("works") ? ["catalog"] : [];
  const mergedHiddenSections = [...new Set([...(props.hiddenSections ?? []), ...navHidden, ...autoHidden])];
  return <Renderer {...props} hiddenSections={mergedHiddenSections} language={props.language} />;
}
