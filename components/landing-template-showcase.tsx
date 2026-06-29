"use client";

import React, { useRef, useEffect, useState } from "react";
import { TEMPLATE_REGISTRY } from "@/lib/template-registry";
import { TEMPLATE_DEFAULT_DESIGN_TOKENS } from "@/lib/template-defaults";
import { SHOWCASE_ITEMS } from "@/lib/landing-showcase-data";
import type { DesignToken } from "@/lib/template-registry";

const DYNAMIC_SHOWCASE_TOKEN: DesignToken = {
  palette: {
    primary: "#7C3AED",
    accent: "#A78BFA",
    background: "#0F0A1E",
    surface: "#1A1330",
    text: "#F5F3FF",
  },
  typography: {
    heading_font: "Inter",
    body_font: "Inter",
    heading_weight: "700",
    heading_size_hero: "3rem",
  },
  layout: {
    hero_style: "centered",
    corner_radius: "soft",
    section_spacing: "normal",
    section_order: ["hero", "benefits", "about", "testimonials", "cta", "faq", "contact"],
  },
  mood: "professional",
};

function getDesignToken(templateId: string): DesignToken {
  if (templateId === "TEMPLATE_DYNAMIC") return DYNAMIC_SHOWCASE_TOKEN;
  return (TEMPLATE_DEFAULT_DESIGN_TOKENS[templateId] || TEMPLATE_DEFAULT_DESIGN_TOKENS.TEMPLATE_JASA02)!;
}

function getCategoryLabel(businessType: string): string {
  const map: Record<string, string> = {
    kuliner: "Kuliner",
    jasa: "Jasa",
    produk: "Produk",
  };
  return map[businessType] || businessType;
}

function TemplatePreview({ templateId, content, designToken }: { templateId: string; content: any; designToken: DesignToken }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.2);
  const TemplateComponent = TEMPLATE_REGISTRY.find((t) => t.id === templateId)?.component;

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !TemplateComponent) return;
    const obs = new ResizeObserver(() => {
      setScale(el.offsetWidth / 1280);
    });
    obs.observe(el);
    setScale(el.offsetWidth / 1280);
    return () => obs.disconnect();
  }, [TemplateComponent]);

  if (!TemplateComponent) return null;

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden bg-white rounded-t-2xl">
      <div
        style={{
          width: 1280,
          transformOrigin: "top left",
          transform: `scale(${scale})`,
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        <TemplateComponent content={content} design_token={designToken} isEditorMode={false} />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-card/80 pointer-events-none" />
    </div>
  );
}

export function LandingTemplateShowcase({ onStart }: { onStart: (templateId: string) => void }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {SHOWCASE_ITEMS.map((item) => {
        const templateDef = TEMPLATE_REGISTRY.find((t) => t.id === item.templateId);
        const token = getDesignToken(item.templateId);
        const category = templateDef?.category || getCategoryLabel(item.businessType);
        const tags = templateDef?.tags;

        return (
          <div
            key={item.templateId}
            className="group relative rounded-2xl border border-border/50 bg-card/60 overflow-hidden transition hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5"
          >
            {/* Template preview (scaled down) */}
            <div className="relative h-44 overflow-hidden bg-white">
              <TemplatePreview
                templateId={item.templateId}
                content={item.content}
                designToken={token}
              />
              {/* Gradient overlay at bottom of preview */}
              <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-card/90 to-transparent pointer-events-none" />
            </div>

            {/* Info bar */}
            <div className="p-4 flex items-center justify-between gap-2">
              <div className="min-w-0 space-y-0.5">
                <p className="text-sm font-bold text-foreground truncate leading-tight">
                  {item.businessName}
                </p>
                <p className="text-[11px] text-muted-foreground truncate">
                  {templateDef?.name ?? "Website"}
                </p>
              </div>
              <button
                onClick={() => onStart(item.templateId)}
                className="shrink-0 rounded-full bg-primary px-4 py-1.5 text-[11px] font-bold text-primary-foreground transition hover:brightness-110 active:scale-95"
              >
                Buat
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
