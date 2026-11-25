"use client";
import React from "react";
import { ArrowUpRight } from "lucide-react";
import { InlineText, InlineImage } from "../../templates/shared";
import PhotoCredit from "../PhotoCredit";
import type { AboutVariantProps } from "./classic";

export default function AboutEditorialMagazine({
  about: a,
  onUpdateField,
  isEditorMode,
  isSelected,
  collapseSheetForInlineEdit,
  onEditingStateChange,
}: AboutVariantProps) {
  const py = { paddingTop: "var(--dt-spacing)", paddingBottom: "var(--dt-spacing)" } as any;

  return (
    <section
      id="about"
      className="group relative overflow-hidden"
      style={{
        ...py,
        padding: `var(--dt-spacing) 1.5rem`,
        background: "var(--dt-bg)",
      }}
    >
      <div style={{ maxWidth: "76rem", margin: "0 auto" }}>
      {/* Background Watermark Number "01" */}
      <div
        aria-hidden="true"
        className="pointer-events-none select-none absolute right-4 lg:right-16 top-1/2 -translate-y-1/2 font-serif text-[18rem] lg:text-[24rem] font-bold leading-none tracking-tighter opacity-[0.04]"
        style={{ color: "var(--dt-text)" }}
      >
        01
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
        {/* Left Column: Editorial Headline & Narrative */}
        <div className="lg:col-span-7 flex flex-col gap-6 relative z-10">
          <div className="inline-block">
            <span
              style={{
                fontSize: "0.75rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.2em",
                color: "var(--dt-primary)",
              }}
            >
              <InlineText
                section="about"
                fieldKey="eyebrow"
                value={a.eyebrow || "Tentang Kami"}
                onUpdateField={onUpdateField}
                isEditorMode={isEditorMode}
                isSelected={isSelected}
                as="span"
                collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                onEditingStateChange={onEditingStateChange}
              />
            </span>
          </div>

          <div className="w-full">
            <InlineText
              section="about"
              fieldKey="title"
              value={a.title}
              onUpdateField={onUpdateField}
              isEditorMode={isEditorMode}
              isSelected={isSelected}
              as="h2"
              multiline={true}
              style={{
                fontFamily: "var(--dt-heading-font)",
                fontWeight: "var(--dt-heading-weight)" as any,
                fontSize: "clamp(2rem, 4.5cqw, 3.25rem)",
                color: "var(--dt-text)",
                lineHeight: 1.18,
                letterSpacing: "-0.02em",
                margin: 0,
                display: "block",
              }}
              collapseSheetForInlineEdit={collapseSheetForInlineEdit}
              onEditingStateChange={onEditingStateChange}
            />
          </div>

          <div
            className="w-16 h-[2px]"
            style={{ background: "var(--dt-primary)" }}
          />

          <InlineText
            section="about"
            fieldKey="body"
            value={a.body}
            onUpdateField={onUpdateField}
            isEditorMode={isEditorMode}
            isSelected={isSelected}
            multiline={true}
            as="p"
            style={{
              color: "var(--dt-text-muted)",
              lineHeight: 1.8,
              margin: 0,
              fontSize: "1.05rem",
              whiteSpace: "pre-line",
            }}
            collapseSheetForInlineEdit={collapseSheetForInlineEdit}
            onEditingStateChange={onEditingStateChange}
          />

          <div className="pt-2">
            <a
              href={a.cv_url || "#contact"}
              target={a.cv_url ? "_blank" : undefined}
              rel={a.cv_url ? "noopener noreferrer" : undefined}
              className="inline-flex items-center gap-2 group/link text-sm font-semibold tracking-wide uppercase transition-colors"
              style={{ color: "var(--dt-primary)" }}
            >
              <span className="border-b border-current pb-0.5">
                <InlineText
                  section="about"
                  fieldKey="cv_label"
                  value={a.cv_label?.trim() || "Pelajari Lebih Lanjut"}
                  placeholder="Pelajari Lebih Lanjut"
                  onUpdateField={onUpdateField}
                  isEditorMode={isEditorMode}
                  isSelected={isSelected}
                  as="span"
                  collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                  onEditingStateChange={onEditingStateChange}
                />
              </span>
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
            </a>
          </div>
        </div>

        {/* Right Column: Architectural / Magazine Cutout Image */}
        <div className="lg:col-span-5 relative z-10 flex justify-center">
          <div
            className="relative w-full max-w-[420px] aspect-[3/4] overflow-hidden"
            style={{
              borderRadius: "var(--dt-radius-lg, 1rem)",
              boxShadow: "var(--dt-card-shadow, 0 20px 40px -10px rgba(0,0,0,0.12))",
              border: "1px solid var(--dt-card-border, rgba(0,0,0,0.08))",
            }}
          >
            {(a.image_url || isEditorMode) ? (
              <>
                <InlineImage
                  section="about"
                  fieldKey="image_url"
                  src={a.image_url}
                  alt={a.title || "Tentang Kami"}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  style={{ width: "100%", height: "100%", position: "absolute", inset: 0, objectFit: "cover" }}
                  onUpdateField={onUpdateField}
                  isEditorMode={isEditorMode}
                  isSelected={isSelected}
                  collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                />
                {a.image_credit && (
                  <div style={{ position: "absolute", bottom: 6, right: 8, zIndex: 20 }}>
                    <PhotoCredit
                      credit={a.image_credit}
                      section="about"
                      fieldKey="image_credit.name"
                      onUpdateField={onUpdateField}
                      isEditorMode={isEditorMode}
                    />
                  </div>
                )}
              </>
            ) : (
              <div
                className="w-full h-full p-8 flex flex-col justify-end"
                style={{
                  background:
                    "linear-gradient(145deg, color-mix(in srgb, var(--dt-primary) 15%, transparent), color-mix(in srgb, var(--dt-surface, #ffffff) 90%, transparent))",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--dt-heading-font)",
                    fontWeight: 700,
                    fontSize: "1.35rem",
                    color: "var(--dt-text)",
                  }}
                >
                  Estetika & Cerita
                </span>
                <span style={{ fontSize: "0.85rem", color: "var(--dt-text-muted)", marginTop: "0.5rem" }}>
                  Setiap karya dirancang dengan makna dan filosofi mendalam.
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}
