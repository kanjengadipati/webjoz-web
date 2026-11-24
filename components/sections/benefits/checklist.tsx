"use client";
import React from "react";
import { CheckCircle } from "lucide-react";
import { InlineText } from "../../templates/shared";
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

export default function BenefitsChecklist({
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
              value={b.title ?? ""}
              placeholder={isEN ? "Key Benefits" : "Keunggulan Utama"}
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
                placeholder={isEN ? "What makes us different" : "Nilai lebih yang kami berikan"}
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

        {/* 2-Column Responsive Grid Checklist */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="group relative flex items-start gap-4 p-5 rounded-[var(--dt-radius-lg)] border transition-all hover:shadow-sm"
              style={{
                background: "var(--dt-surface)",
                borderColor: "color-mix(in srgb, var(--dt-primary) 14%, transparent)",
              }}
            >
              {/* Checkmark Icon badge */}
              <div
                className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center mt-0.5"
                style={{
                  background: "color-mix(in srgb, var(--dt-primary) 12%, transparent)",
                  color: "var(--dt-primary)",
                }}
              >
                <CheckCircle className="w-5 h-5 stroke-[2.25]" />
              </div>

              {/* Text content */}
              <div className="flex-1 min-w-0 pr-6">
                <div className="flex items-center gap-2 flex-wrap mb-1">
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
                      fontSize: "1.05rem",
                      margin: 0,
                    }}
                    collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                    onEditingStateChange={onEditingStateChange}
                  />
                  {(item.stat || isEditorMode) && (
                    <span
                      style={{
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        color: "var(--dt-primary)",
                        background: `color-mix(in srgb, var(--dt-primary) 10%, transparent)`,
                        padding: "0.15rem 0.55rem",
                        borderRadius: "var(--dt-radius)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <InlineText
                        section="benefits"
                        fieldKey={"items." + idx + ".stat"}
                        value={item.stat ?? ""}
                        placeholder="100%"
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

                <InlineText
                  section="benefits"
                  fieldKey={"items." + idx + ".description"}
                  value={item.description ?? ""}
                  placeholder={isEN ? "Benefit description..." : "Deskripsi keunggulan..."}
                  onUpdateField={onUpdateField}
                  isEditorMode={isEditorMode}
                  isSelected={isSelected}
                  as="p"
                  style={{
                    color: "var(--dt-text-muted)",
                    fontSize: "0.875rem",
                    lineHeight: 1.6,
                    margin: 0,
                  }}
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
            <div className="md:col-span-2">
              <InlineAddTile
                compact
                label={isEN ? "Add benefit" : "Tambah Keunggulan"}
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
