"use client";
import React from "react";
import type { HeroVariantProps } from "./types";
import { HeroContent, HeroDecorations } from "./shared";

export default function HeroSplit({ hero, design_token }: HeroVariantProps) {
  return (
    <section style={{ position: "relative", minHeight: "85vh", display: "flex", alignItems: "center", justifyContent: "flex-start", padding: "5rem 1.5rem", background: hero.background_color || "var(--dt-bg)", overflow: "hidden" }}>
      <HeroDecorations hero={hero} />
      <div style={{ maxWidth: "560px", textAlign: "left", position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: "1.25rem", alignItems: "flex-start" }}>
        <HeroContent hero={hero} />
      </div>
    </section>
  );
}
