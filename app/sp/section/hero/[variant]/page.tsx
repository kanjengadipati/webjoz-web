"use client";

import { useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import { buildCssVars, loadGoogleFont } from "@/components/templates/helpers";
import type { DesignToken } from "@/components/templates/types";
import HeroSection from "@/components/sections/hero";
import { MOCK_SHOWCASE_DATA } from "@/app/dashboard/admin/section-showcase/mock-data";
import { SHOWCASE_PRESETS } from "@/app/dashboard/admin/section-showcase/mock-data";

const PRESET_ID = "modern-tech";

export default function SectionVariantPreviewPage() {
  const params = useParams();
  const variant = (params?.variant as string) || "centered";
  const section = "hero";

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
        hero_style: variant as any,
        section_variants: {
          ...((base.layout?.section_variants ?? {}) as any),
          [section]: variant,
        },
      },
    };
    return token;
  }, [preset, variant]);

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
        <HeroSection
          hero={MOCK_SHOWCASE_DATA.hero as any}
          contact={MOCK_SHOWCASE_DATA.contact as any}
          onSubmitLead={() => Promise.resolve()}
          design_token={designToken}
          language="id"
          isEditorMode={false}
        />
      </div>
    </main>
  );
}
