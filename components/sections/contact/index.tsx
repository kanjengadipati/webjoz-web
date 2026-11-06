"use client";
import React from "react";
import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import type { ContactVariantProps } from "./types";

const ClassicSplit = dynamic(() => import("./classic-split"));
const MinimalCentered = dynamic(() => import("./minimal-centered"));
const OverlayMap = dynamic(() => import("./overlay-map"));
const BentoGrid = dynamic(() => import("./bento-grid"));
const DarkSplit = dynamic(() => import("./dark-split"));
const WhatsAppDirect = dynamic(() => import("./whatsapp-direct"));

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
