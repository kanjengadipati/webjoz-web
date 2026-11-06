"use client";
import React from "react";
import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import type { FooterVariantProps } from "./types";

const MinimalBand = dynamic(() => import("./minimal-band"));
const ColumnsWithSocial = dynamic(() => import("./columns-with-social"));
const ColumnsWithNav = dynamic(() => import("./columns-with-nav"));
const DarkContrastBand = dynamic(() => import("./dark-contrast-band"));
const LocationAndHours = dynamic(() => import("./location-and-hours"));

const variants: Record<string, ComponentType<FooterVariantProps>> = {
  "minimal-band": MinimalBand,
  "columns-with-social": ColumnsWithSocial,
  "columns-with-nav": ColumnsWithNav,
  "dark-contrast-band": DarkContrastBand,
  "location-and-hours": LocationAndHours,
};

export default function FooterSection(props: FooterVariantProps) {
  const variant = props.design_token?.layout?.section_variants?.footer ?? "minimal-band";
  const Renderer = variants[variant] ?? MinimalBand;
  return <Renderer {...props} />;
}
