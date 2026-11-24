"use client";
import React from "react";
import { Star } from "lucide-react";
import { DynamicIcon, InlineText } from "../../templates/shared";
import { InlineAddTile, InlineDeleteButton } from "../inline-add";
import type { TemplateProps, DesignToken } from "../../templates/types";

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

export default function BenefitsClassic({
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
        background: `color-mix(in srgb, var(--dt-primary) 3.5%, var(--dt-bg))`,
        borderTop: `1px solid color-mix(in srgb, var(--dt-primary) 10%, transparent)`,
        borderBottom: `1px solid color-mix(in srgb, var(--dt-primary) 10%, transparent)`,
      }}
    >
      <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
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
                }}
              >
                <InlineText
                  section="benefits"
                  fieldKey="eyebrow"
                  value={b.eyebrow || (isEN ? "Benefits" : "Keunggulan")}
                  placeholder={isEN ? "Benefits" : "Keunggulan"}
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
              fontSize: "clamp(1.35rem, 4.5cqw, 2.25rem)",
              color: "var(--dt-text)",
              margin: 0,
            }}
          >
            <InlineText
              section="benefits"
              fieldKey="title"
              value={b.title}
              placeholder={isEN ? "Our Benefits" : "Keunggulan Kami"}
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
                maxWidth: "36rem",
                margin: "0.75rem auto 0",
                lineHeight: 1.6,
                fontSize: "0.95rem",
              }}
            >
              <InlineText
                section="benefits"
                fieldKey="subtitle"
                value={b.subtitle}
                placeholder={isEN ? "What sets us apart" : "Alasan utama mengapa Anda akan menyukai kami"}
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

        {/* Equal-Height Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 items-stretch">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="group relative flex flex-col justify-between overflow-hidden transition-all duration-200"
              style={{
                background: `linear-gradient(145deg, color-mix(in srgb, var(--dt-surface) 92%, var(--dt-primary) 8%) 0%, var(--dt-surface) 100%)`,
                border: `1px solid color-mix(in srgb, var(--dt-primary) 18%, transparent)`,
                borderRadius: "var(--dt-radius-lg)",
                padding: "1.75rem",
                boxShadow: "0 2px 8px color-mix(in srgb, var(--dt-primary) 4%, transparent)",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.boxShadow = `0 12px 32px color-mix(in srgb, var(--dt-primary) 18%, transparent)`;
                el.style.transform = "translateY(-4px)";
                el.style.borderColor = `color-mix(in srgb, var(--dt-primary) 36%, transparent)`;
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.boxShadow = "0 2px 8px color-mix(in srgb, var(--dt-primary) 4%, transparent)";
                el.style.transform = "none";
                el.style.borderColor = `color-mix(in srgb, var(--dt-primary) 18%, transparent)`;
              }}
            >
              {/* Top accent line */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "3px",
                  background: `linear-gradient(90deg, var(--dt-primary), color-mix(in srgb, var(--dt-primary) 30%, transparent))`,
                  opacity: 0.8,
                }}
              />

              {/* Top part: Icon/Stat + Title + Description */}
              <div className="flex flex-col gap-3.5">
                {/* Icon or Stat */}
                {item.stat || isEditorMode ? (
                  <div>
                    <p style={{ fontFamily: "var(--dt-heading-font)", fontWeight: 800, fontSize: "2.15rem", color: "var(--dt-primary)", margin: 0, lineHeight: 1.1 }}>
                      <InlineText
                        section="benefits"
                        fieldKey={"items." + idx + ".stat"}
                        value={item.stat ?? ""}
                        placeholder="99%"
                        onUpdateField={onUpdateField}
                        isEditorMode={isEditorMode}
                        isSelected={isSelected}
                        as="span"
                        collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                        onEditingStateChange={onEditingStateChange}
                      />
                    </p>
                    {(item.stat_label || isEditorMode) && (
                      <p style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--dt-text-muted)", marginTop: "0.25rem" }}>
                        <InlineText
                          section="benefits"
                          fieldKey={"items." + idx + ".stat_label"}
                          value={item.stat_label ?? ""}
                          placeholder={isEN ? "Metric" : "Metrik"}
                          onUpdateField={onUpdateField}
                          isEditorMode={isEditorMode}
                          isSelected={isSelected}
                          as="span"
                          collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                          onEditingStateChange={onEditingStateChange}
                        />
                      </p>
                    )}
                  </div>
                ) : (
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      background: `linear-gradient(135deg, color-mix(in srgb, var(--dt-primary) 18%, transparent), color-mix(in srgb, var(--dt-primary) 8%, transparent))`,
                      border: `1px solid color-mix(in srgb, var(--dt-primary) 22%, transparent)`,
                      borderRadius: "var(--dt-radius)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <span style={{ color: "var(--dt-primary)", display: "contents" }}>
                      <DynamicIcon name={item.icon} defaultIcon={Star} className="w-5 h-5" />
                    </span>
                  </div>
                )}

                <InlineText
                  section="benefits"
                  fieldKey={"items." + idx + ".title"}
                  value={item.title ?? ""}
                  placeholder={isEN ? "Benefit title..." : "Judul keunggulan..."}
                  onUpdateField={onUpdateField}
                  isEditorMode={isEditorMode}
                  isSelected={isSelected}
                  as="h3"
                  style={{
                    fontFamily: "var(--dt-heading-font)",
                    fontWeight: 700,
                    color: "var(--dt-text)",
                    fontSize: "1.08rem",
                    margin: 0,
                    lineHeight: 1.35,
                  }}
                  collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                  onEditingStateChange={onEditingStateChange}
                />

                <InlineText
                  section="benefits"
                  fieldKey={"items." + idx + ".description"}
                  value={item.description ?? ""}
                  placeholder={isEN ? "Benefit description..." : "Deskripsi keunggulan..."}
                  onUpdateField={onUpdateField}
                  isEditorMode={isEditorMode}
                  isSelected={isSelected}
                  as="p"
                  style={{ color: "var(--dt-text-muted)", fontSize: "0.875rem", lineHeight: 1.65, margin: 0 }}
                  multiline
                  collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                  onEditingStateChange={onEditingStateChange}
                />
              </div>

              {/* Inline Delete Button for Editor Mode */}
              {isEditorMode && (
                <div className="absolute top-3 right-3">
                  <InlineDeleteButton
                    compact
                    onDelete={() => handleDeleteItem(idx)}
                    title={isEN ? "Delete benefit" : "Hapus keunggulan"}
                  />
                </div>
              )}
            </div>
          ))}

          {isEditorMode && onAddItem && (
            <div className="h-full">
              <InlineAddTile
                label={isEN ? "Add benefit" : "Tambah Keunggulan"}
                onClick={onAddItem}
                style={{ height: "100%", minHeight: "12rem", borderRadius: "var(--dt-radius-lg)" }}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
