"use client";

import React, { useState, useRef, useEffect } from "react";
import { TEMPLATE_REGISTRY } from "@/lib/template-registry";
import { TEMPLATE_DEFAULT_DESIGN_TOKENS } from "@/lib/template-defaults";
import { SHOWCASE_ITEMS } from "@/lib/landing-showcase-data";
import type { DesignToken } from "@/lib/template-registry";

// Design token for TEMPLATE_DYNAMIC showcase (Klinik Gigi — violet)
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
  return TEMPLATE_DEFAULT_DESIGN_TOKENS[templateId] ?? TEMPLATE_DEFAULT_DESIGN_TOKENS["TEMPLATE_JASA02"];
}

export function LandingTemplateShowcase({ onStart }: { onStart: () => void }) {
  const [active, setActive] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.38);

  const item = SHOWCASE_ITEMS[active];
  const templateDef = TEMPLATE_REGISTRY.find((t) => t.id === item.templateId);
  const designToken = getDesignToken(item.templateId);
  const TemplateComponent = templateDef?.component;

  // Compute scale to fit container width
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new ResizeObserver(() => {
      setScale(el.offsetWidth / 1280);
    });
    obs.observe(el);
    setScale(el.offsetWidth / 1280);
    return () => obs.disconnect();
  }, []);

  return (
    <div className="space-y-6">
      {/* Tab switcher — scrollable on mobile */}
      <div className="flex gap-2 overflow-x-auto pb-1 justify-start md:justify-center scrollbar-none">
        {SHOWCASE_ITEMS.map((s, i) => (
          <button
            key={s.templateId}
            onClick={() => setActive(i)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
              active === i
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/25"
                : "border border-border bg-card/60 text-muted-foreground hover:text-foreground hover:bg-card"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Template preview */}
      <div className="relative rounded-[2rem] border border-border/60 bg-card/40 shadow-[0_40px_120px_rgba(0,0,0,0.2)] ring-1 ring-white/5 overflow-hidden">
        {/* Browser chrome */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border/40 bg-card/60 backdrop-blur">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-red-400/60" />
            <div className="h-3 w-3 rounded-full bg-yellow-400/60" />
            <div className="h-3 w-3 rounded-full bg-green-400/60" />
          </div>
          <div className="flex-1 rounded-full bg-muted/60 px-4 py-1.5 text-center text-xs text-muted-foreground truncate">
            {item.businessName.toLowerCase().replace(/\s+/g, "")}.webjoz.com
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 text-[10px] font-semibold text-emerald-400 shrink-0">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live
          </div>
        </div>

        {/* Template render area */}
        <div
          ref={containerRef}
          className="relative overflow-hidden bg-white"
          style={{ height: `${Math.round(scale * 900)}px` }}
        >
          {TemplateComponent && (
            <div
              style={{
                width: 1280,
                transformOrigin: "top left",
                transform: `scale(${scale})`,
                pointerEvents: "none",
                userSelect: "none",
              }}
            >
              <TemplateComponent
                content={item.content as any}
                design_token={designToken as any}
                isEditorMode={false}
              />
            </div>
          )}

          {/* Gradient fade at bottom */}
          <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-card/90 to-transparent pointer-events-none" />

          {/* CTA overlay at bottom */}
          <div className="absolute bottom-4 inset-x-0 flex justify-center pointer-events-none">
            <button
              onClick={onStart}
              className="pointer-events-auto inline-flex items-center gap-2 rounded-full bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-xl shadow-indigo-600/30 transition hover:bg-indigo-500 active:scale-95"
            >
              Buat website seperti ini ⚡
            </button>
          </div>
        </div>
      </div>

      {/* Template info */}
      <div className="text-center">
        <p className="text-xs text-muted-foreground">
          Contoh hasil generate AI untuk bisnis{" "}
          <strong className="text-foreground">{item.businessName}</strong>
          {" · "}
          <span className="text-primary">{templateDef?.name}</span>
        </p>
      </div>
    </div>
  );
}
