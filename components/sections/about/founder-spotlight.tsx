"use client";
import React from "react";
import { Quote, ArrowRight, Award } from "lucide-react";
import { InlineText, InlineImage } from "../../templates/shared";
import PhotoCredit from "../PhotoCredit";
import type { AboutVariantProps } from "./classic";

export default function AboutFounderSpotlight({
  about: a,
  onUpdateField,
  isEditorMode,
  isSelected,
  collapseSheetForInlineEdit,
  onEditingStateChange,
}: AboutVariantProps) {
  const py = { paddingTop: "var(--dt-spacing)", paddingBottom: "var(--dt-spacing)" } as any;

  // Nama & posisi founder (fallback ke team_members[0] jika ada, atau default nama pemilik)
  const firstMember = a.team_members?.[0];
  const founderName = firstMember?.name || a.eyebrow || "Founder & Pemilik";
  const founderRole = firstMember?.role || "Founder & CEO";

  return (
    <section
      id="about"
      className="group"
      style={{
        ...py,
        padding: `var(--dt-spacing) 1.5rem`,
        maxWidth: "72rem",
        margin: "0 auto",
      }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
        {/* Left Column: Portrait Photo */}
        <div className="lg:col-span-5 flex justify-center">
          <div
            className="relative w-full max-w-[340px] sm:max-w-[380px] aspect-[4/5] overflow-hidden"
            style={{
              borderRadius: "calc(var(--dt-radius-lg, 1rem) * 1.5)",
              background: "var(--dt-surface, #f8fafc)",
              border: "1px solid var(--dt-card-border, rgba(0,0,0,0.08))",
              boxShadow: "var(--dt-card-shadow, 0 10px 25px -5px rgba(0,0,0,0.06))",
            }}
          >
            {a.image_url ? (
              <>
                <InlineImage
                  section="about"
                  fieldKey="image_url"
                  src={a.image_url}
                  alt={founderName}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
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
                className="w-full h-full flex flex-col items-center justify-center p-6 text-center"
                style={{
                  background:
                    "linear-gradient(135deg, color-mix(in srgb, var(--dt-primary) 12%, transparent), color-mix(in srgb, var(--dt-primary) 30%, transparent))",
                }}
              >
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
                  style={{
                    background: "var(--dt-primary)",
                    color: "var(--dt-primary-fg, #ffffff)",
                  }}
                >
                  <Award className="w-10 h-10" />
                </div>
                <span
                  style={{
                    fontFamily: "var(--dt-heading-font)",
                    fontWeight: 700,
                    color: "var(--dt-text)",
                    fontSize: "1.2rem",
                  }}
                >
                  {founderName}
                </span>
                <span style={{ fontSize: "0.85rem", color: "var(--dt-text-muted)", marginTop: "0.25rem" }}>
                  {founderRole}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Statement, Bio & Signature */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Quote Icon */}
          <div
            className="w-12 h-12 flex items-center justify-center rounded-2xl"
            style={{
              background: "color-mix(in srgb, var(--dt-primary) 14%, transparent)",
              color: "var(--dt-primary)",
            }}
          >
            <Quote className="w-6 h-6 rotate-180" />
          </div>

          {/* Statement Quote (Title) */}
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
                fontSize: "clamp(1.5rem, 3.5cqw, 2.25rem)",
                color: "var(--dt-text)",
                lineHeight: 1.3,
                margin: 0,
                display: "block",
              }}
              collapseSheetForInlineEdit={collapseSheetForInlineEdit}
              onEditingStateChange={onEditingStateChange}
            />
          </div>

          {/* Founder Identity & Role */}
          <div className="flex flex-col gap-1 border-l-2 pl-4" style={{ borderColor: "var(--dt-primary)" }}>
            <span
              style={{
                fontFamily: "var(--dt-heading-font)",
                fontWeight: 700,
                fontSize: "1.1rem",
                color: "var(--dt-text)",
              }}
            >
              <InlineText
                section="about"
                fieldKey="eyebrow"
                value={founderName}
                onUpdateField={onUpdateField}
                isEditorMode={isEditorMode}
                isSelected={isSelected}
                as="span"
                collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                onEditingStateChange={onEditingStateChange}
              />
            </span>
            <span style={{ fontSize: "0.85rem", color: "var(--dt-text-muted)" }}>{founderRole}</span>
          </div>

          {/* Body Narrative */}
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
              fontSize: "0.95rem",
              whiteSpace: "pre-line",
            }}
            collapseSheetForInlineEdit={collapseSheetForInlineEdit}
            onEditingStateChange={onEditingStateChange}
          />

          {/* Digital Signature Accent & Action Link */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            {Boolean(a.cv_url?.trim()) ? (
              <a
                href={a.cv_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.45rem",
                  padding: "0.65rem 1.25rem",
                  borderRadius: "var(--dt-radius, 0.5rem)",
                  background: "var(--dt-primary)",
                  color: "var(--dt-primary-fg, #ffffff)",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  transition: "opacity 0.2s ease",
                }}
              >
                <span>{a.cv_label?.trim() || "Profil Lengkap"}</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            ) : (
              <a
                href="#contact"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.45rem",
                  padding: "0.65rem 1.25rem",
                  borderRadius: "var(--dt-radius, 0.5rem)",
                  background: "var(--dt-primary)",
                  color: "var(--dt-primary-fg, #ffffff)",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  transition: "opacity 0.2s ease",
                }}
              >
                <span>Terhubung Langsung</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            )}

            {/* Stylized Signature Mock Accent */}
            <div
              className="select-none opacity-60 italic text-xl tracking-wider"
              style={{
                fontFamily: "cursive, 'Brush Script MT', 'Dancing Script', sans-serif",
                color: "var(--dt-text)",
              }}
            >
              ~ {founderName.split(" ")[0]}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
