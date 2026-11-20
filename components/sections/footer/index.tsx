"use client";
import React from "react";
import type { FooterVariantProps } from "./types";

import { resolveVariant } from "../variant-meta";
import { FOOTER_VARIANTS } from "./variants";

export default function FooterSection(props: FooterVariantProps) {
  const variant = props.design_token?.layout?.section_variants?.footer ?? "minimal-band";
  const Renderer = resolveVariant<FooterVariantProps>(FOOTER_VARIANTS, variant, "minimal-band");
  return <Renderer {...props} />;
}
