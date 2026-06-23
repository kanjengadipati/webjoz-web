"use client";

import React from "react";
import { WIREFRAME_STEPS } from "./constants";
import type { ChatStage } from "./types";

interface WireframeProps {
  businessName: string;
  businessType: string;
  businessSubType: string;
  description: string;
  chatStage: ChatStage;
}

const skeletonSubtle = { background: "rgba(255,255,255,0.04)" };
const skeletonSoft = { background: "rgba(255,255,255,0.06)" };
const skeletonStrong = { background: "rgba(255,255,255,0.08)" };
const skeletonPanel = { background: "rgba(255,255,255,0.035)", border: "1px solid rgba(255,255,255,0.055)" };

function isHighlighted(stage: ChatStage): boolean {
  return stage === "done";
}

export function Wireframe({ businessName, businessType, businessSubType, description, chatStage }: WireframeProps) {
  const highlight = isHighlighted(chatStage);

  return (
    <div className="h-full overflow-y-auto p-8" style={{ background: "#0d0f14" }}>
      <div className="max-w-3xl mx-auto">
        <header className="flex justify-between items-center pb-6 mb-10" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="flex items-center gap-3">
            {businessName ? (
              <div
                className="h-7 px-3 flex items-center rounded-md text-sm font-bold text-white animate-in fade-in slide-in-from-left-2 duration-400"
                style={{ background: "color-mix(in srgb, var(--primary) 25%, transparent)", border: "1px solid color-mix(in srgb, var(--primary) 40%, transparent)" }}
              >
                {businessName}
              </div>
            ) : (
              <div className="h-7 w-28 rounded-md animate-pulse" style={skeletonStrong} />
            )}
          </div>
          <div className="flex gap-4 items-center">
            {businessType ? (
              <div className="flex gap-2 items-center animate-in fade-in duration-400">
                {WIREFRAME_STEPS.map(l => (
                  <span key={l} className="text-[11px] text-slate-500">{l}</span>
                ))}
              </div>
            ) : (
              <>
                {WIREFRAME_STEPS.map((_, i) => (
                  <div key={i} className="h-4 w-14 rounded animate-pulse" style={skeletonSoft} />
                ))}
              </>
            )}
            <div className="h-8 w-24 rounded-md animate-pulse" style={skeletonStrong} />
          </div>
        </header>

        <section
          className="relative rounded-2xl overflow-hidden mb-10 transition-all duration-500"
          style={{
            ...skeletonPanel,
            height: 260,
            border: highlight ? "1px solid color-mix(in srgb, var(--primary) 35%, transparent)" : "1px solid rgba(255,255,255,0.055)",
            boxShadow: highlight ? "0 0 30px color-mix(in srgb, var(--primary) 15%, transparent)" : "none",
          }}
        >
          <div className="absolute inset-0 flex flex-col justify-center px-12 gap-4">
            {businessType ? (
              <div
                className="h-5 w-fit px-3 flex items-center rounded-full text-[10px] font-bold uppercase tracking-widest animate-in fade-in duration-400"
                style={{ background: "color-mix(in srgb, var(--primary) 20%, transparent)", color: "var(--primary)", border: "1px solid color-mix(in srgb, var(--primary) 30%, transparent)" }}
              >
                {businessSubType || businessType}
              </div>
            ) : (
              <div className="h-5 w-20 rounded-full animate-pulse" style={skeletonStrong} />
            )}

            <div className="space-y-2">
              {businessName ? (
                <div
                  className="h-10 px-3 flex items-center rounded-lg text-white font-black text-xl animate-in fade-in slide-in-from-bottom-2 duration-500"
                  style={{ background: "rgba(255,255,255,0.06)" }}
                >
                  {businessName}
                </div>
              ) : (
                <div className="h-10 w-3/4 rounded-lg animate-pulse" style={skeletonStrong} />
              )}
              {description ? (
                <div
                  className="h-6 px-3 flex items-center rounded-lg text-slate-300 text-xs animate-in fade-in duration-500"
                  style={{ background: "rgba(255,255,255,0.04)" }}
                >
                  <span className="truncate">{description.slice(0, 60)}{description.length > 60 ? "..." : ""}</span>
                </div>
              ) : (
                <div className="h-10 w-1/2 rounded-lg animate-pulse" style={skeletonStrong} />
              )}
            </div>

            <div className="h-5 w-2/3 rounded-full animate-pulse" style={skeletonSoft} />

            <div
              className="h-11 w-36 rounded-lg flex items-center justify-center text-xs font-bold transition-all duration-500"
              style={highlight
                ? { background: "color-mix(in srgb, var(--primary) 70%, transparent)", color: "var(--primary-foreground)", border: "1px solid color-mix(in srgb, var(--primary) 80%, transparent)" }
                : { ...skeletonStrong }
              }
            >
              {highlight ? "Pesan Sekarang →" : ""}
            </div>
          </div>
          <div className="absolute right-0 inset-y-0 w-2/5" style={skeletonSubtle} />
        </section>

        <section className="grid grid-cols-4 gap-4 mb-10">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`p-4 rounded-xl space-y-3 transition-all duration-300 ${description && i === 0 ? "ring-1 ring-primary/30" : ""}`}
              style={{ ...skeletonPanel, animationDelay: `${i * 80}ms` }}
            >
              <div className="w-8 h-8 rounded-full animate-pulse" style={skeletonStrong} />
              <div className="h-3 w-3/4 rounded animate-pulse" style={skeletonStrong} />
              <div className="h-2 w-full rounded animate-pulse" style={skeletonSoft} />
            </div>
          ))}
        </section>

        <section className="flex gap-8 items-center p-8 rounded-xl" style={skeletonPanel}>
          <div className="flex-1 space-y-4">
            <div className="h-7 w-3/4 rounded-md animate-pulse" style={skeletonStrong} />
            <div className="h-3 w-full rounded animate-pulse" style={skeletonSoft} />
            <div className="h-3 w-5/6 rounded animate-pulse" style={skeletonSoft} />
            <div className="h-3 w-4/6 rounded animate-pulse" style={skeletonSoft} />
          </div>
          <div className="w-40 h-40 rounded-xl shrink-0 animate-pulse" style={skeletonSoft} />
        </section>

        {(chatStage === "done") && (
          <div className="mt-6 flex items-center gap-2 text-[11px] text-muted-foreground/70">
            <div className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse" />
            <span>AI sedang mempersiapkan desain untuk {businessName || "bisnis Anda"}...</span>
          </div>
        )}
      </div>
    </div>
  );
}
