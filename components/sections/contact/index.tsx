"use client";
import React from "react";
import type { ContactVariantProps } from "./types";

import { resolveVariant } from "../variant-meta";
import { CONTACT_VARIANTS } from "./variants";

export default function ContactSection(props: ContactVariantProps) {
  const variant = props.design_token?.layout?.section_variants?.contact ?? "classic-split";
  const Renderer = resolveVariant<ContactVariantProps>(CONTACT_VARIANTS, variant, "classic-split");
  return <Renderer {...props} language={props.language} />;
}
