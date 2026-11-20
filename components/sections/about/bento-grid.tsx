"use client";
import React from "react";
import { Sparkles, TrendingUp, Users, ArrowRight } from "lucide-react";
import { InlineText, InlineImage } from "../../templates/shared";
import PhotoCredit from "../PhotoCredit";
import type { AboutVariantProps } from "./classic";

export default function AboutBentoGrid({
  about: a,
  onUpdateField,
  isEditorMode,
  isSelected,
  collapseSheetForInlineEdit,
  onEditingStateChange,
}: AboutVariantProps) {
  const py = { paddingTop: "var(--dt-spacing)", paddingBottom: "var(--dt-spacing)" } as any;
  const alignStyle = a.textAlign ? { textAlign: a.textAlign as React.CSSProperties["textAlign"] } : {};

  const stat1 = a.highlight_stat_1 || { value: "100+", label: "Klien Puas" };
  const stat2 = a.highlight_stat_2 || { value: "10+", label: "Tahun Pengalaman" };

  return (
    <section
      id="about"
      className="group"
      style={{
        ...py,
        padding: `var(--dt-spacing) 1.5rem`,
        maxWidth: "76rem",
        margin: "0 auto",
      }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Column: Narrative / Story */}
        <div className="lg:col-span-5 flex flex-col gap-5" style={alignStyle}>
          <div className="inline-block">
            <span
              style={{
                fontSize: "0.75rem",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.15em",
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
                fontSize: "clamp(1.75rem, 4cqw, 2.75rem)",
                color: "var(--dt-text)",
                lineHeight: 1.2,
                margin: 0,
                display: "block",
              }}
              collapseSheetForInlineEdit={collapseSheetForInlineEdit}
              onEditingStateChange={onEditingStateChange}
            />
          </div>

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
              lineHeight: 1.7,
              margin: 0,
              fontSize: "1rem",
              whiteSpace: "pre-line",
            }}
            collapseSheetForInlineEdit={collapseSheetForInlineEdit}
            onEditingStateChange={onEditingStateChange}
          />

          {Boolean(a.cv_url?.trim()) ? (
            <div className="pt-2">
              <a
                href={a.cv_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.75rem 1.5rem",
                  borderRadius: "var(--dt-radius, 0.5rem)",
                  background: "var(--dt-primary)",
                  color: "var(--dt-primary-fg, #ffffff)",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  transition: "opacity 0.2s ease",
                }}
              >
                <span>{a.cv_label?.trim() || "Pelajari Lebih Lanjut"}</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          ) : (
            <div className="pt-1">
              <a
                href="#contact"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.75rem 1.5rem",
                  borderRadius: "var(--dt-radius, 0.5rem)",
                  background: "var(--dt-primary)",
                  color: "var(--dt-primary-fg, #ffffff)",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  transition: "opacity 0.2s ease",
                }}
              >
                <span>Hubungi Kami</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          )}
        </div>

        {/* Right Column: 2x2 Bento Matrix */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Card 1: Visual Image (Top Left) */}
          <div
            className="relative overflow-hidden min-h-[220px] sm:min-h-[240px] flex items-center justify-center"
            style={{
              borderRadius: "var(--dt-radius-lg, 1rem)",
              background: "var(--dt-surface, #f8fafc)",
              border: "1px solid var(--dt-card-border, rgba(0,0,0,0.08))",
            }}
          >
            {a.image_url ? (
              <>
                <InlineImage
                  section="about"
                  fieldKey="image_url"
                  src={a.image_url}
                  alt={a.title || "Tentang Kami"}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  style={{ width: "100%", height: "100%", position: "absolute", inset: 0, objectFit: "cover" }}
                  onUpdateField={onUpdateField}
                  isEditorMode={isEditorMode}
                  isSelected={isSelected}
                  collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                />
                {a.image_credit && (
                  <div style={{ position: "absolute", bottom: 4, right: 8, zIndex: 20 }}>
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
                className="w-full h-full p-6 flex flex-col justify-end"
                style={{
                  background:
                    "linear-gradient(135deg, color-mix(in srgb, var(--dt-primary) 15%, transparent), color-mix(in srgb, var(--dt-primary) 40%, transparent))",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--dt-heading-font)",
                    fontWeight: 700,
                    color: "var(--dt-text)",
                    fontSize: "1.25rem",
                  }}
                >
                  Kualitas & Dedikasi
                </span>
                <span style={{ fontSize: "0.85rem", color: "var(--dt-text-muted)", marginTop: "0.25rem" }}>
                  Solusi terpercaya untuk kebutuhan Anda
                </span>
              </div>
            )}
          </div>

          {/* Card 2: Feature / Innovation Card (Top Right) */}
          <div
            className="p-6 flex flex-col justify-between"
            style={{
              borderRadius: "var(--dt-radius-lg, 1rem)",
              background: "var(--dt-surface, #ffffff)",
              border: "1px solid var(--dt-card-border, rgba(0,0,0,0.08))",
              boxShadow: "var(--dt-card-shadow, 0 4px 12px rgba(0,0,0,0.03))",
            }}
          >
            <div
              className="w-11 h-11 flex items-center justify-center rounded-xl"
              style={{
                background: "color-mix(in srgb, var(--dt-primary) 12%, transparent)",
                color: "var(--dt-primary)",
              }}
            >
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="mt-6">
              <h3
                style={{
                  fontFamily: "var(--dt-heading-font)",
                  fontWeight: 700,
                  fontSize: "1.15rem",
                  color: "var(--dt-text)",
                  margin: 0,
                }}
              >
                Inovasi Tanpa Batas
              </h3>
              <p
                style={{
                  fontSize: "0.875rem",
                  color: "var(--dt-text-muted)",
                  margin: "0.5rem 0 0 0",
                  lineHeight: 1.5,
                }}
              >
                Selalu mengadopsi standar terkini untuk memastikan hasil terbaik dan berkelanjutan.
              </p>
            </div>
          </div>

          {/* Card 3: Highlight Stat 1 (Bottom Left) */}
          <div
            className="p-6 flex flex-col justify-between"
            style={{
              borderRadius: "var(--dt-radius-lg, 1rem)",
              background: "var(--dt-surface, #ffffff)",
              border: "1px solid var(--dt-card-border, rgba(0,0,0,0.08))",
              boxShadow: "var(--dt-card-shadow, 0 4px 12px rgba(0,0,0,0.03))",
            }}
          >
            <div
              className="w-11 h-11 flex items-center justify-center rounded-xl"
              style={{
                background: "color-mix(in srgb, var(--dt-primary) 12%, transparent)",
                color: "var(--dt-primary)",
              }}
            >
              <Users className="w-5 h-5" />
            </div>
            <div className="mt-6">
              <p
                style={{
                  fontFamily: "var(--dt-heading-font)",
                  fontWeight: 800,
                  fontSize: "clamp(2rem, 3cqw, 2.5rem)",
                  color: "var(--dt-text)",
                  margin: 0,
                  lineHeight: 1.1,
                }}
              >
                <InlineText
                  section="about"
                  fieldKey="highlight_stat_1.value"
                  value={stat1.value}
                  onUpdateField={onUpdateField}
                  isEditorMode={isEditorMode}
                  isSelected={isSelected}
                  as="span"
                  collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                  onEditingStateChange={onEditingStateChange}
                />
              </p>
              <p
                style={{
                  fontSize: "0.85rem",
                  color: "var(--dt-text-muted)",
                  margin: "0.25rem 0 0 0",
                  fontWeight: 500,
                }}
              >
                <InlineText
                  section="about"
                  fieldKey="highlight_stat_1.label"
                  value={stat1.label}
                  onUpdateField={onUpdateField}
                  isEditorMode={isEditorMode}
                  isSelected={isSelected}
                  as="span"
                  collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                  onEditingStateChange={onEditingStateChange}
                />
              </p>
            </div>
          </div>

          {/* Card 4: Highlight Stat 2 (Bottom Right) */}
          <div
            className="p-6 flex flex-col justify-between"
            style={{
              borderRadius: "var(--dt-radius-lg, 1rem)",
              background: "color-mix(in srgb, var(--dt-primary) 6%, var(--dt-surface, #ffffff))",
              border: "1px solid color-mix(in srgb, var(--dt-primary) 20%, transparent)",
            }}
          >
            <div
              className="w-11 h-11 flex items-center justify-center rounded-xl"
              style={{
                background: "var(--dt-primary)",
                color: "var(--dt-primary-fg, #ffffff)",
              }}
            >
              <TrendingUp className="w-5 h-5" />
            </div>
            <div className="mt-6">
              <p
                style={{
                  fontFamily: "var(--dt-heading-font)",
                  fontWeight: 800,
                  fontSize: "clamp(2rem, 3cqw, 2.5rem)",
                  color: "var(--dt-text)",
                  margin: 0,
                  lineHeight: 1.1,
                }}
              >
                <InlineText
                  section="about"
                  fieldKey="highlight_stat_2.value"
                  value={stat2.value}
                  onUpdateField={onUpdateField}
                  isEditorMode={isEditorMode}
                  isSelected={isSelected}
                  as="span"
                  collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                  onEditingStateChange={onEditingStateChange}
                />
              </p>
              <p
                style={{
                  fontSize: "0.85rem",
                  color: "var(--dt-text-muted)",
                  margin: "0.25rem 0 0 0",
                  fontWeight: 500,
                }}
              >
                <InlineText
                  section="about"
                  fieldKey="highlight_stat_2.label"
                  value={stat2.label}
                  onUpdateField={onUpdateField}
                  isEditorMode={isEditorMode}
                  isSelected={isSelected}
                  as="span"
                  collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                  onEditingStateChange={onEditingStateChange}
                />
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
