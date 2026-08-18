"use client";
import React from "react";
import type { ComponentType } from "react";
import type { ContactVariantProps } from "./types";
import ClassicSplit from "./classic-split";
import MinimalCentered from "./minimal-centered";
import OverlayMap from "./overlay-map";
import BentoGrid from "./bento-grid";
import DarkSplit from "./dark-split";
import WhatsAppDirect from "./whatsapp-direct";

const variants: Record<string, ComponentType<ContactVariantProps>> = {
  "classic-split": ClassicSplit,
  "whatsapp-direct": WhatsAppDirect,
  "minimal-centered": MinimalCentered,
  "overlay-map": OverlayMap,
  "bento-grid": BentoGrid,
  "dark-split": DarkSplit,
};

export default function ContactSection(props: ContactVariantProps) {
  const variant = props.design_token?.layout?.section_variants?.contact ?? "classic-split";
  const Renderer = variants[variant] ?? ClassicSplit;
  return <Renderer {...props} language={props.language} />;
}
