"use client";
import React from "react";
import { Star } from "lucide-react";
import { DynamicIcon, InlineImage, InlineText } from "../../templates/shared";
import { InlineAddTile, InlineDeleteButton } from "../inline-add";
import type { DesignToken, TemplateProps } from "../../templates/types";

interface BenefitsVariantProps {
  benefits: TemplateProps["content"]["benefits"];
  design_token?: DesignToken | null;
  onUpdateField?: (section: string, key: string, value: any) => void;
  isEditorMode?: boolean;
  isSelected?: boolean;
  collapseSheetForInlineEdit?: () => void;
  onEditingStateChange?: (isEditing: boolean) => void;
  onAddItem?: () => void;
  language?: "id" | "en";
}

export default function BenefitsAlternatingFeature({
  benefits: b,
  onUpdateField,
  isEditorMode,
  isSelected,
  collapseSheetForInlineEdit,
  onEditingStateChange,
  language = "id",
  onAddItem,
}: BenefitsVariantProps) {
  const isEN = language === "en";
  const items = b?.items ?? [];

  const handleDeleteItem = (indexToDelete: number) => {
    if (!onUpdateField) return;
    const newItems = items.filter((_, i) => i !== indexToDelete);
    onUpdateField("benefits", "items", newItems);
  };

  return (
    <section
      id="benefits"
      style={{
        padding: `var(--dt-spacing) 1.5rem`,
        background: `color-mix(in srgb, var(--dt-primary) 3%, var(--dt-bg))`,
        borderTop: `1px solid color-mix(in srgb, var(--dt-primary) 10%, transparent)`,
        borderBottom: `1px solid color-mix(in srgb, var(--dt-primary) 10%, transparent)`,
      }}
    >
      <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          {(b?.eyebrow || isEditorMode) && (
            <div className="mb-2">
              <span
                style={{
                  display: "inline-block",
                  fontSize: "0.75rem",
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "0.15em",
                  color: "var(--dt-primary)",
                  background: `color-mix(in srgb, var(--dt-primary) 10%, transparent)`,
                  border: `1px solid color-mix(in srgb, var(--dt-primary) 18%, transparent)`,
                  padding: "0.25rem 0.75rem",
                  borderRadius: "999px",
                }}
              >
                <InlineText
                  section="benefits"
                  fieldKey="eyebrow"
                  value={b.eyebrow || (isEN ? "Key Solutions" : "Solusi Lengkap")}
                  placeholder={isEN ? "Key Solutions" : "Solusi Lengkap"}
                  onUpdateField={onUpdateField}
                  isEditorMode={isEditorMode}
                  isSelected={isSelected}
                  as="span"
                  collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                  onEditingStateChange={onEditingStateChange}
                />
              </span>
            </div>
          )}
          <h2
            style={{
              fontFamily: "var(--dt-heading-font)",
              fontWeight: "var(--dt-heading-weight)" as any,
              fontSize: "clamp(1.5rem, 4.5cqw, 2.5rem)",
              color: "var(--dt-text)",
              margin: 0,
            }}
          >
            <InlineText
              section="benefits"
              fieldKey="title"
              value={b.title}
              placeholder={isEN ? "Designed for Your Growth" : "Dirancang untuk Pertumbuhan Anda"}
              onUpdateField={onUpdateField}
              isEditorMode={isEditorMode}
              isSelected={isSelected}
              as="span"
              collapseSheetForInlineEdit={collapseSheetForInlineEdit}
              onEditingStateChange={onEditingStateChange}
            />
          </h2>
          {(b?.subtitle || isEditorMode) && (
            <p
              style={{
                color: "var(--dt-text-muted)",
                maxWidth: "38rem",
                margin: "0.75rem auto 0",
                lineHeight: 1.6,
                fontSize: "0.95rem",
              }}
            >
              <InlineText
                section="benefits"
                fieldKey="subtitle"
                value={b.subtitle}
                placeholder={isEN ? "Everything you need to scale with confidence and ease" : "Semua yang Anda butuhkan untuk berkembang dengan mudah dan terpercaya"}
                onUpdateField={onUpdateField}
                isEditorMode={isEditorMode}
                isSelected={isSelected}
                as="span"
                multiline
                collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                onEditingStateChange={onEditingStateChange}
              />
            </p>
          )}
        </div>

        {/* Alternating Zigzag Feature Rows */}
        <div className="flex flex-col gap-12 sm:gap-16">
          {items.map((item, idx) => {
            const isReversed = idx % 2 === 1;
            const stepNum = String(idx + 1).padStart(2, "0");

            return (
              <div
                key={idx}
                className={`group relative flex flex-col lg:flex-row items-center gap-8 lg:gap-14 ${
                  isReversed ? "lg:flex-row-reverse" : ""
                }`}
              >
                {/* Visual Art / Image Column */}
                <div className="w-full lg:w-1/2">
                  <div
                    className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-[var(--dt-radius-lg)] border overflow-hidden flex items-center justify-center transition-all duration-300"
                    style={{
                      background: `linear-gradient(135deg, color-mix(in srgb, var(--dt-primary) 12%, var(--dt-surface)) 0%, var(--dt-surface) 100%)`,
                      borderColor: `color-mix(in srgb, var(--dt-primary) 18%, transparent)`,
                      boxShadow: `0 12px 32px color-mix(in srgb, var(--dt-primary) 8%, transparent)`,
                    }}
                  >
                    {(item.image_url || isEditorMode) ? (
                      <InlineImage
                        section="benefits"
                        fieldKey={`items.${idx}.image_url`}
                        src={item.image_url ?? ""}
                        alt={item.title || "Benefit Visual"}
                        onUpdateField={onUpdateField}
                        isEditorMode={isEditorMode}
                        isSelected={isSelected}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                        collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center p-6 text-center gap-3">
                        <div
                          className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-md"
                          style={{
                            background: `color-mix(in srgb, var(--dt-primary) 15%, transparent)`,
                            border: `1px solid color-mix(in srgb, var(--dt-primary) 25%, transparent)`,
                            color: "var(--dt-primary)",
                          }}
                        >
                          <DynamicIcon
                            name={item.icon}
                            defaultIcon={Star}
                            className="w-7 h-7"
                          />
                        </div>
                        <span
                          style={{
                            fontFamily: "var(--dt-heading-font)",
                            fontWeight: 800,
                            fontSize: "1.5rem",
                            color: "var(--dt-primary)",
                            opacity: 0.85,
                          }}
                        >
                          {stepNum}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Text Content Column */}
                <div className="w-full lg:w-1/2 flex flex-col items-start gap-3">
                  {/* Step Pill */}
                  <div className="flex items-center gap-3">
                    <span
                      className="px-2.5 py-1 rounded-md text-xs font-mono font-black"
                      style={{
                        background: "var(--dt-primary)",
                        color: "#fff",
                      }}
                    >
                      {stepNum}
                    </span>
                    {(item.stat || isEditorMode) && (
                      <span
                        className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md"
                        style={{
                          background: `color-mix(in srgb, var(--dt-primary) 12%, transparent)`,
                          color: "var(--dt-primary)",
                        }}
                      >
                        <InlineText
                          section="benefits"
                          fieldKey={`items.${idx}.stat`}
                          value={item.stat ?? ""}
                          placeholder="Stat..."
                          onUpdateField={onUpdateField}
                          isEditorMode={isEditorMode}
                          isSelected={isSelected}
                          as="span"
                          collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                          onEditingStateChange={onEditingStateChange}
                        />
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <InlineText
                    section="benefits"
                    fieldKey={`items.${idx}.title`}
                    value={item.title ?? ""}
                    placeholder={isEN ? "Benefit title..." : "Judul keunggulan..."}
                    onUpdateField={onUpdateField}
                    isEditorMode={isEditorMode}
                    isSelected={isSelected}
                    as="h3"
                    style={{
                      fontFamily: "var(--dt-heading-font)",
                      fontWeight: 700,
                      fontSize: "clamp(1.25rem, 3cqw, 1.65rem)",
                      color: "var(--dt-text)",
                      margin: 0,
                      lineHeight: 1.3,
                    }}
                    collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                    onEditingStateChange={onEditingStateChange}
                  />

                  {/* Description */}
                  <InlineText
                    section="benefits"
                    fieldKey={`items.${idx}.description`}
                    value={item.description ?? ""}
                    placeholder={isEN ? "Detailed description of this benefit..." : "Penjelasan rinci mengenai keunggulan ini..."}
                    onUpdateField={onUpdateField}
                    isEditorMode={isEditorMode}
                    isSelected={isSelected}
                    as="p"
                    style={{
                      color: "var(--dt-text-muted)",
                      fontSize: "0.95rem",
                      lineHeight: 1.65,
                      margin: 0,
                      maxWidth: "34rem",
                    }}
                    multiline
                    collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                    onEditingStateChange={onEditingStateChange}
                  />

                  {/* Inline Delete Button for Editor Mode */}
                  {isEditorMode && (
                    <div className="absolute top-2 right-2">
                      <InlineDeleteButton
                        compact
                        onDelete={() => handleDeleteItem(idx)}
                        title={isEN ? "Delete step" : "Hapus langkah"}
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isEditorMode && onAddItem && (
            <div className="pt-4">
              <InlineAddTile
                label={isEN ? "Add alternating feature" : "Tambah Fitur Bergantian"}
                onClick={onAddItem}
                style={{ borderRadius: "var(--dt-radius-lg)" }}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
