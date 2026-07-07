"use client";
import React from "react";
import type { ComponentType } from "react";
import type { DesignToken } from "@/components/templates/types";
import type { GalleryItem, GalleryLayout } from "@/components/templates/types";
import GalleryClassic from "./classic";

interface GalleryVariantProps {
  gallery?: {
    title: string;
    eyebrow?: string;
    items: GalleryItem[];
    layout?: GalleryLayout;
    autoplay_speed?: number;
    show_dots?: boolean;
    show_arrows?: boolean;
  };
  design_token?: DesignToken | null;
  sectionStyle?: React.CSSProperties;
}

const variants: Record<string, ComponentType<GalleryVariantProps>> = {
  grid: GalleryClassic,
};

export default function GallerySection(props: GalleryVariantProps) {
  const variant = props.design_token?.layout?.section_variants?.gallery ?? "grid";
  const Renderer = variants[variant] ?? GalleryClassic;
  return <Renderer {...props} />;
}
