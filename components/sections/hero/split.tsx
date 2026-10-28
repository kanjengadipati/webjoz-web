"use client";
import React from "react";
import type { HeroVariantProps } from "./types";
import { HeroContent } from "./shared";
import PhotoCredit from "../PhotoCredit";
import { InlineImage } from "../../templates/shared";

export default function HeroSplit({ hero, language, onUpdateField, isEditorMode, isSelected, collapseSheetForInlineEdit, onEditingStateChange }: HeroVariantProps) {
  const hasImage = Boolean(hero.image_url) || Boolean(isEditorMode);
  return (
    <section
      className="flex flex-col lg:grid lg:grid-cols-2"
      style={{ position: "relative", minHeight: "85vh", background: hero.background_color || "var(--dt-bg)", overflow: "hidden" }}
    >
      {/* Left: text column */}
      <div
        className="relative z-10 flex flex-col justify-center"
        style={{ padding: "max(6rem, clamp(3rem, 6vw, 5rem)) clamp(1.5rem, 5vw, 4rem)", gap: "1.25rem", alignItems: "flex-start" }}
      >
        <HeroContent
          hero={hero}
          onUpdateField={onUpdateField}
          isEditorMode={isEditorMode}
          isSelected={isSelected}
          collapseSheetForInlineEdit={collapseSheetForInlineEdit}
          onEditingStateChange={onEditingStateChange}
        />
      </div>

      {/* Right: image column */}
      <div className="relative p-0 lg:p-6 flex items-center justify-center" style={{ minHeight: "45vh", height: "100%" }}>
        <div
          className="relative w-full h-full overflow-hidden rounded-none lg:rounded-[var(--dt-radius-lg)]"
          style={{ minHeight: "45vh", border: "1px solid color-mix(in srgb, var(--dt-primary) 12%, transparent)" }}
        >
          {hasImage ? (
            <>
              <InlineImage
                section="hero"
                fieldKey="image_url"
                src={hero.image_url}
                alt={hero.headline}
                onUpdateField={onUpdateField}
                isEditorMode={isEditorMode}
                isSelected={isSelected}
                className="w-full h-full"
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                collapseSheetForInlineEdit={collapseSheetForInlineEdit}
              />
              <div style={{ position: "absolute", bottom: 12, right: 12, zIndex: 20 }}>
                <PhotoCredit
                  credit={hero.image_credit}
                  language={language}
                  section="hero"
                  fieldKey="image_credit.name"
                  onUpdateField={onUpdateField}
                  isEditorMode={isEditorMode}
                  isSelected={isSelected}
                  collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                />
              </div>
            </>
          ) : (
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: `linear-gradient(160deg, color-mix(in srgb, var(--dt-primary) 25%, var(--dt-bg)), color-mix(in srgb, var(--dt-primary) 10%, var(--dt-bg)))`,
              }}
            />
          )}
        </div>
      </div>
    </section>
  );
}