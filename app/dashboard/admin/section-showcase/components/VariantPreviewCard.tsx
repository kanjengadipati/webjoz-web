"use client";

import React, { useState, useMemo, useRef } from "react";
import { SparkleIcon } from "@/components/sparkle-icon";
import {
  Copy,
  Check,
  Eye,
  EyeOff,
  Expand,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { buildCssVars } from "@/components/templates/helpers";
import type { DesignToken } from "@/components/templates/types";
import type { VariantCritiqueResult } from "@/lib/design-assets-config";
import { SectionRenderer } from "./SectionRenderer";
import { CritiqueModal } from "./CritiqueModal";

export interface VariantPreviewCardProps {
  index: number;
  sectionKey: string;
  variant: { value: string; label: string; group?: string; description?: string };
  designToken: DesignToken;
  cardStyle: "standard" | "horizontal" | "minimal" | "overlay" | "magazine";
  viewportClass: string;
  copiedVariant: string | null;
  isHidden: boolean;
  zeroState: boolean;
  onCopyVariant: (val: string) => void;
  onToggleHide: () => void;
  onFocusSingle?: () => void;
  onFullScreen?: () => void;
  isSingleFocus?: boolean;
  critiqueData?: VariantCritiqueResult;
  isCritiquing?: boolean;
  critiqueMethod?: "dom" | "server" | null;
  onCritique?: (el: HTMLElement) => void;
  onCritiqueServer?: () => void;
}

export function VariantPreviewCard({
  index,
  sectionKey,
  variant,
  designToken,
  cardStyle,
  viewportClass,
  copiedVariant,
  isHidden,
  zeroState,
  onCopyVariant,
  onToggleHide,
  onFullScreen,
  critiqueData,
  isCritiquing = false,
  critiqueMethod = null,
  onCritique,
  onCritiqueServer,
}: VariantPreviewCardProps) {
  const previewCardRef = useRef<HTMLDivElement>(null);
  const [showCritiqueModal, setShowCritiqueModal] = useState<boolean>(false);

  const sectionDesignToken = useMemo<DesignToken>(() => {
    return {
      ...designToken,
      layout: {
        ...(designToken.layout ?? {}),
        hero_style: (sectionKey === "hero" ? variant.value : designToken.layout?.hero_style) as any,
        card_style: (sectionKey === "catalog" || sectionKey === "menu" ? cardStyle : designToken.layout?.card_style) as any,
        section_variants: {
          ...((designToken.layout?.section_variants ?? {}) as any),
          [sectionKey]: variant.value,
        },
      },
    };
  }, [designToken, sectionKey, variant.value, cardStyle]);

  const cssVars = useMemo(() => buildCssVars(sectionDesignToken), [sectionDesignToken]);

  const tierBadgeStyle = (critiqueData?.tier && {
    S: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    A: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    B: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    C: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
  }[critiqueData.tier]) || "bg-muted text-muted-foreground border-border";

  return (
    <div
      className={`group bg-card rounded-xl overflow-hidden transition-all duration-200 border ${
        isHidden
          ? "opacity-60 border-destructive/30 bg-card/40"
          : "border-border/70 hover:border-border hover:shadow-sm"
      }`}
    >
      {/* Clean, Streamlined Header */}
      <div className="px-4 py-3 flex items-center justify-between gap-3 border-b border-border/60 bg-muted/20">
        {/* Left: Index + Name + Meta */}
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="text-xs font-mono font-semibold text-muted-foreground/70 w-5 shrink-0">
            {String(index).padStart(2, "0")}
          </span>

          <div className="flex items-center gap-2 min-w-0 flex-wrap">
            <h3 className={`text-sm font-semibold truncate ${isHidden ? "line-through text-muted-foreground" : "text-foreground"}`}>
              {variant.label}
            </h3>

            <code className="text-[11px] font-mono text-muted-foreground/80 bg-background/80 px-1.5 py-0.5 rounded border border-border/50">
              {variant.value}
            </code>

            {/* Subtitle / Description hint if available */}
            {variant.description && (
              <span className="hidden xl:inline text-xs text-muted-foreground/70 truncate max-w-xs">
                — {variant.description}
              </span>
            )}
          </div>
        </div>

        {/* Right: Status, Score & Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Aesthetic Critique Score Pill */}
          {critiqueData ? (
            <button
              type="button"
              onClick={() => setShowCritiqueModal(true)}
              className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border transition-transform hover:scale-105 cursor-pointer ${tierBadgeStyle}`}
              title="Lihat detail evaluasi AI Vision"
            >
              <SparkleIcon className="size-3 text-current" />
              <span>{critiqueData.score}</span>
              <span className="opacity-70 text-[10px]">({critiqueData.tier})</span>
            </button>
          ) : (
            onCritique && (
              <button
                type="button"
                disabled={isCritiquing}
                onClick={() => previewCardRef.current && onCritique(previewCardRef.current)}
                className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] text-muted-foreground hover:text-foreground hover:bg-muted border border-border/50 transition-all cursor-pointer disabled:opacity-50"
                title="Evaluasi estetika dengan AI Vision"
              >
                {isCritiquing && critiqueMethod === "dom" ? (
                  <Loader2 className="size-3 animate-spin text-primary" />
                ) : (
                  <SparkleIcon className="size-3 text-muted-foreground" />
                )}
                <span className="hidden md:inline">Nilai AI</span>
              </button>
            )
          )}

          {/* Zero-state indicator */}
          {zeroState && (
            <span className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 font-medium border border-amber-500/20">
              <AlertTriangle className="size-3" />
              <span className="hidden sm:inline">Zero-state</span>
            </span>
          )}

          {/* Action: Copy Variant ID */}
          <button
            type="button"
            onClick={() => onCopyVariant(variant.value)}
            className="size-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all cursor-pointer"
            title="Salin ID Varian"
          >
            {copiedVariant === variant.value ? (
              <Check className="size-3.5 text-emerald-500" />
            ) : (
              <Copy className="size-3.5" />
            )}
          </button>

          {/* Action: Fullscreen */}
          {onFullScreen && (
            <button
              type="button"
              onClick={onFullScreen}
              className="size-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all cursor-pointer"
              title="Full Screen Preview"
            >
              <Expand className="size-3.5" />
            </button>
          )}

          {/* Action: Toggle Visibility */}
          <button
            type="button"
            onClick={onToggleHide}
            className={`size-8 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
              isHidden
                ? "text-destructive bg-destructive/10 hover:bg-destructive/20"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
            title={isHidden ? "Tampilkan kembali varian" : "Sembunyikan varian dari AI & Editor"}
          >
            {isHidden ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
          </button>
        </div>
      </div>

      {/* Preview Canvas Area */}
      <div className="p-3 sm:p-5 bg-muted/15 flex justify-center items-start overflow-hidden">
        <div
          ref={previewCardRef}
          className={`${viewportClass} transition-all duration-300 overflow-hidden bg-background border border-border/40 shadow-xs rounded-lg`}
          style={cssVars as React.CSSProperties}
        >
          <SectionRenderer
            sectionKey={sectionKey}
            variantKey={variant.value}
            designToken={sectionDesignToken}
            zeroState={zeroState}
          />
        </div>
      </div>

      {/* Critique Modal Detail */}
      <CritiqueModal
        isOpen={showCritiqueModal}
        onClose={() => setShowCritiqueModal(false)}
        variant={variant}
        sectionKey={sectionKey}
        critiqueData={critiqueData}
        isCritiquing={isCritiquing}
        isHidden={isHidden}
        onReCritique={
          onCritique && previewCardRef.current
            ? () => {
                setShowCritiqueModal(false);
                onCritique(previewCardRef.current!);
              }
            : undefined
        }
        onToggleHide={() => {
          setShowCritiqueModal(false);
          onToggleHide();
        }}
      />
    </div>
  );
}
