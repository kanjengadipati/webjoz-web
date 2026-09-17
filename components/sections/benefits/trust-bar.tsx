"use client";
import React from "react";
import { ShieldCheck, Trash2 } from "lucide-react";
import { DynamicIcon, InlineText } from "../../templates/shared";
import { InlineAddTile } from "../inline-add";
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

export default function BenefitsTrustBar({
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

  // Determine grid columns dynamically based on item count
  const getGridColsClass = () => {
    if (items.length <= 2) return "sm:grid-cols-2";
    if (items.length === 3) return "sm:grid-cols-2 lg:grid-cols-3";
    return "sm:grid-cols-2 lg:grid-cols-4";
  };

  return (
    <section
      id="benefits"
      className="relative border-y transition-colors"
      style={{
        padding: "2rem 1.5rem",
        background: "color-mix(in srgb, var(--dt-primary) 3.5%, var(--dt-bg))",
        borderColor: "color-mix(in srgb, var(--dt-primary) 12%, var(--dt-border))",
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Optional Section Header: only rendered if title exists or in editor mode */}
        {(b?.title || isEditorMode) && (
          <div className="text-center mb-6 max-w-2xl mx-auto">
            {b?.eyebrow && (
              <span
                className="block text-[11px] font-extrabold uppercase tracking-wider mb-1"
                style={{ color: "var(--dt-primary)" }}
              >
                {b.eyebrow}
              </span>
            )}
            <InlineText
              section="benefits"
              fieldKey="title"
              value={b?.title ?? (isEN ? "Guaranteed Peace of Mind" : "Jaminan Belanja Aman & Nyaman")}
              onUpdateField={onUpdateField}
              isEditorMode={isEditorMode}
              isSelected={isSelected}
              as="h2"
              placeholder={isEN ? "Section Title..." : "Judul Jaminan Belanja..."}
              className="font-bold text-base md:text-lg tracking-tight m-0"
              style={{
                fontFamily: "var(--dt-heading-font)",
                color: "var(--dt-text)",
              }}
              collapseSheetForInlineEdit={collapseSheetForInlineEdit}
              onEditingStateChange={onEditingStateChange}
            />
            {b?.subtitle && (
              <InlineText
                section="benefits"
                fieldKey="subtitle"
                value={b.subtitle}
                onUpdateField={onUpdateField}
                isEditorMode={isEditorMode}
                isSelected={isSelected}
                as="p"
                placeholder={isEN ? "Short subtitle..." : "Subjudul ringkas..."}
                className="text-xs mt-1 max-w-md mx-auto"
                style={{ color: "var(--dt-text-muted)" }}
                collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                onEditingStateChange={onEditingStateChange}
              />
            )}
          </div>
        )}

        {/* Horizontal Trust Bar Grid */}
        <div className={`grid grid-cols-1 ${getGridColsClass()} gap-4 md:gap-5 items-stretch`}>
          {items.map((item, idx) => (
            <div
              key={idx}
              className="group relative flex items-start gap-3.5 p-3.5 md:p-4 rounded-xl transition-all duration-200"
              style={{
                background: "color-mix(in srgb, var(--dt-surface) 60%, transparent)",
                border: "1px solid color-mix(in srgb, var(--dt-primary) 10%, var(--dt-border))",
                borderRadius: "var(--dt-radius-lg)",
              }}
            >
              {/* Delete button (only in editor mode when hovered) */}
              {isEditorMode && onUpdateField && items.length > 1 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteItem(idx);
                  }}
                  title={isEN ? "Remove item" : "Hapus item"}
                  className="absolute top-2 right-2 p-1 rounded-md opacity-0 group-hover:opacity-100 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 transition-opacity z-10 cursor-pointer"
                  aria-label={isEN ? "Delete item" : "Hapus item"}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}

              {/* Icon Badge */}
              <div
                className="shrink-0 flex items-center justify-center w-11 h-11 rounded-xl transition-transform group-hover:scale-105 duration-200"
                style={{
                  background: "color-mix(in srgb, var(--dt-primary) 14%, var(--dt-surface))",
                  border: "1px solid color-mix(in srgb, var(--dt-primary) 22%, transparent)",
                  color: "var(--dt-primary)",
                  boxShadow: "0 2px 8px color-mix(in srgb, var(--dt-primary) 8%, transparent)",
                }}
              >
                <DynamicIcon
                  name={item.icon}
                  defaultIcon={ShieldCheck}
                  className="w-5 h-5"
                />
              </div>

              {/* Content: Title & Short Reassuring Description */}
              <div className="flex-1 min-w-0 pr-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <InlineText
                    section="benefits"
                    fieldKey={`items.${idx}.title`}
                    value={item.title ?? ""}
                    onUpdateField={onUpdateField}
                    isEditorMode={isEditorMode}
                    isSelected={isSelected}
                    as="h3"
                    placeholder={isEN ? "Trust Point..." : "Poin Kepercayaan..."}
                    className="font-bold text-sm tracking-tight m-0"
                    style={{
                      fontFamily: "var(--dt-heading-font)",
                      color: "var(--dt-text)",
                    }}
                    collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                    onEditingStateChange={onEditingStateChange}
                  />

                  {/* Optional stat/badge */}
                  {item.stat && (
                    <span
                      className="text-[10px] font-extrabold uppercase px-1.5 py-0.2 rounded-md tracking-wider shrink-0"
                      style={{
                        background: "color-mix(in srgb, var(--dt-primary) 12%, transparent)",
                        color: "var(--dt-primary)",
                        border: "1px solid color-mix(in srgb, var(--dt-primary) 20%, transparent)",
                      }}
                    >
                      {item.stat}
                    </span>
                  )}
                </div>

                <InlineText
                  section="benefits"
                  fieldKey={`items.${idx}.description`}
                  value={item.description ?? ""}
                  onUpdateField={onUpdateField}
                  isEditorMode={isEditorMode}
                  isSelected={isSelected}
                  as="p"
                  multiline
                  placeholder={isEN ? "Short guarantee detail..." : "Deskripsi jaminan ringkas..."}
                  className="text-xs leading-relaxed mt-0.5 m-0"
                  style={{ color: "var(--dt-text-muted)" }}
                  collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                  onEditingStateChange={onEditingStateChange}
                />
              </div>
            </div>
          ))}

          {/* Add item tile in editor mode */}
          {isEditorMode && onAddItem && items.length < 6 && (
            <div className="min-h-[72px] flex items-center">
              <InlineAddTile
                compact
                label={isEN ? "Add Trust Item" : "Tambah Jaminan"}
                onClick={onAddItem}
                style={{
                  minHeight: "72px",
                  borderRadius: "var(--dt-radius-lg)",
                }}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
