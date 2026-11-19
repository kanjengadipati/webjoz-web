"use client";

import React, { useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import { buildCssVars, loadGoogleFont } from "@/components/templates/helpers";
import type { DesignToken } from "@/components/templates/types";
import { SHOWCASE_PRESETS } from "@/app/dashboard/admin/section-showcase/mock-data";
import { SectionRenderer } from "@/app/dashboard/admin/section-showcase/components/SectionRenderer";

const PRESET_ID = "modern-tech";

export default function SectionVariantPreviewClient({
  fixedSection,
}: {
  fixedSection?: string;
}) {
  const params = useParams();
  const section = fixedSection || (params?.section as string) || "hero";
  const variant = (params?.variant as string) || "centered";

  const preset = useMemo(() => {
    return SHOWCASE_PRESETS.find((p) => p.id === PRESET_ID) ?? SHOWCASE_PRESETS[0];
  }, []);

  const designToken = useMemo<DesignToken>(() => {
    const base = preset.token;
    const token: DesignToken = {
      ...base,
      theme_mode: "light",
      layout: {
        ...(base.layout ?? {}),
        hero_style: section === "hero" ? (variant as any) : base.layout?.hero_style,
        section_variants: {
          ...((base.layout?.section_variants ?? {}) as any),
          [section]: variant,
        },
      },
    };
    return token;
  }, [preset, section, variant]);

  useEffect(() => {
    if (designToken.typography?.heading_font) {
      loadGoogleFont(designToken.typography.heading_font);
    }
    if (designToken.typography?.body_font) {
      loadGoogleFont(designToken.typography.body_font);
    }
  }, [designToken]);

  const cssVars = useMemo(() => buildCssVars(designToken), [designToken]);

  return (
    <main style={cssVars as React.CSSProperties} className="min-h-screen bg-[var(--dt-bg)] text-[var(--dt-text)]">
      <div
        style={{
          backgroundColor: "var(--dt-bg, #ffffff)",
          color: "var(--dt-text, #1e293b)",
          fontFamily: "var(--dt-body-font, sans-serif)",
          width: "100%",
          overflow: "hidden",
        }}
      >
        <SectionRenderer
          sectionKey={section}
          variantKey={variant}
          designToken={designToken}
        />
      </div>
    </main>
  );
}
