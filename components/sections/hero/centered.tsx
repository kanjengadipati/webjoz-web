"use client";
import React from "react";
import type { HeroVariantProps } from "./types";
import { HeroContent, HeroDecorations } from "./shared";

export default function HeroCentered({ hero, design_token }: HeroVariantProps) {
  return (
    <section style={{ position: "relative", minHeight: "85vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "5rem 1.5rem", background: "var(--dt-bg)", overflow: "hidden" }}>
      <HeroDecorations hero={hero} />
      <div style={{ maxWidth: "800px", textAlign: "center", position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: "1.25rem", alignItems: "center" }}>
        <HeroContent hero={hero} />
      </div>
    </section>
  );
}
