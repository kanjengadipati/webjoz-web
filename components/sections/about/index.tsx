"use client";
import React from "react";
import type { ComponentType } from "react";
import type { DesignToken, TemplateProps } from "../../templates/types";
import AboutClassic from "./classic";
import AboutSplitImage from "./split-image";
import AboutStatHeavy from "./stat-heavy";
import AboutTimeline from "./timeline";
import AboutTeamGrid from "./team-grid";

const variants: Record<string, ComponentType<{ about: TemplateProps["content"]["about"]; design_token?: DesignToken | null }>> = {
  classic: AboutClassic,
  "split-image": AboutSplitImage,
  "stat-heavy": AboutStatHeavy,
  timeline: AboutTimeline,
  "team-grid": AboutTeamGrid,
};

export default function AboutSection({ about, design_token }: { about: TemplateProps["content"]["about"]; design_token?: DesignToken | null }) {
  const variant = design_token?.layout?.section_variants?.about ?? "classic";
  const Renderer = variants[variant] ?? AboutClassic;
  return <Renderer about={about} design_token={design_token} />;
}
