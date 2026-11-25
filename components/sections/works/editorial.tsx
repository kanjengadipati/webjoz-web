"use client";
import React from "react";
import { ArrowUpRight, Image as ImageIcon, Trash2 } from "lucide-react";
import { InlineText, InlineImage } from "../../templates/shared";
import { safeHref, isExternalHref } from "@/lib/safe-url";
import { WorksAddTile } from "./shared";
import type { WorksRackProps } from "./shared";
import { worksStrings } from "./works-strings";

export default function WorksEditorial({
  items,
  radius,
  isEditorMode,
  isSelected,
  isEN,
  onUpdateItem,
  onRemoveItem,
  onAddItem,
  collapseSheetForInlineEdit,
  onEditingStateChange,
}: WorksRackProps) {
  const L = worksStrings(isEN ? "en" : "id");

  return (
    <div style={{ borderTop: "1px solid var(--dt-border)" }}>
      {items.map((item, idx) => {
        const href = safeHref(item.project_url, "");
        const external = isExternalHref(href);

        return (
          <article
            key={idx}
            className="group relative grid grid-cols-1 md:grid-cols-[72px_1fr_220px] gap-4 md:gap-6 items-center py-6 md:py-7 px-2 transition-colors"
            style={{
              borderBottom: "1px solid var(--dt-border)",
            }}
          >
            {/* Column 1: Editorial Index */}
            <div
              className="text-2xl md:text-3xl font-extrabold tracking-tight tabular-nums select-none"
              style={{
                color: "color-mix(in srgb, var(--dt-primary) 42%, transparent)",
                fontFamily: "var(--dt-heading-font)",
              }}
            >
              {String(idx + 1).padStart(2, "0")}
            </div>

            {/* Column 2: Meta + Title + Description + Link */}
            <div className="min-w-0 space-y-1.5">
              {(item.category || item.year || isEditorMode) && (
                <div
                  className="flex flex-wrap items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest"
                  style={{ color: "var(--dt-primary)" }}
                >
                  {(item.category || isEditorMode) && (
                    <InlineText
                      section="works"
                      fieldKey={`items.${idx}.category`}
                      value={item.category || ""}
                      placeholder={L.categoryPlaceholder}
                      onUpdateField={(_, __, val) => onUpdateItem(idx, "category", val)}
                      isEditorMode={isEditorMode}
                      isSelected={isSelected}
                      collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                      onEditingStateChange={onEditingStateChange}
                      as="span"
                    />
                  )}
                  {(item.category || isEditorMode) && (item.year || isEditorMode) && (
                    <span className="opacity-40">&middot;</span>
                  )}
                  {(item.year || isEditorMode) && (
                    <InlineText
                      section="works"
                      fieldKey={`items.${idx}.year`}
                      value={item.year || ""}
                      placeholder={L.yearPlaceholder}
                      onUpdateField={(_, __, val) => onUpdateItem(idx, "year", val)}
                      isEditorMode={isEditorMode}
                      isSelected={isSelected}
                      collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                      onEditingStateChange={onEditingStateChange}
                      as="span"
                    />
                  )}
                </div>
              )}

              <h3
                className="text-lg md:text-xl font-bold leading-snug"
                style={{ fontFamily: "var(--dt-heading-font)", color: "var(--dt-text)" }}
              >
                <InlineText
                  section="works"
                  fieldKey={`items.${idx}.title`}
                  value={item.title || ""}
                  placeholder={L.titlePlaceholder}
                  onUpdateField={(_, __, val) => onUpdateItem(idx, "title", val)}
                  isEditorMode={isEditorMode}
                  isSelected={isSelected}
                  collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                  onEditingStateChange={onEditingStateChange}
                  as="span"
                />
              </h3>

              {(item.description || isEditorMode) && (
                <p
                  className="text-sm leading-relaxed max-w-2xl"
                  style={{ color: "var(--dt-text-muted)" }}
                >
                  <InlineText
                    section="works"
                    fieldKey={`items.${idx}.description`}
                    value={item.description || ""}
                    placeholder={L.descriptionPlaceholder}
                    onUpdateField={(_, __, val) => onUpdateItem(idx, "description", val)}
                    isEditorMode={isEditorMode}
                    isSelected={isSelected}
                    collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                    onEditingStateChange={onEditingStateChange}
                    multiline
                    as="span"
                  />
                </p>
              )}

              {href && !isEditorMode && (
                <div className="pt-1">
                  <a
                    href={href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                    className="inline-flex items-center gap-1 text-xs font-bold hover:underline"
                    style={{ color: "var(--dt-primary)" }}
                  >
                    <span>{L.viewProject}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>

            {/* Column 3: Thumbnail */}
            <div
              className="relative w-full h-36 md:h-28 overflow-hidden shrink-0"
              style={{
                borderRadius: radius,
                background: "color-mix(in srgb, var(--dt-primary) 6%, var(--dt-surface))",
                border: "1px solid var(--dt-border)",
              }}
            >
              {(item.image_url || isEditorMode) ? (
                <InlineImage
                  section="works"
                  fieldKey={`items.${idx}.image_url`}
                  src={item.image_url}
                  alt={item.alt_text || item.title}
                  onUpdateField={(_, __, val) => onUpdateItem(idx, "image_url", val)}
                  isEditorMode={isEditorMode}
                  isSelected={isSelected}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="w-6 h-6 opacity-30" style={{ color: "var(--dt-text-muted)" }} />
                </div>
              )}
            </div>

            {isEditorMode && onRemoveItem && items.length > 1 && (
              <button
                type="button"
                onClick={() => onRemoveItem(idx)}
                className="absolute top-3 right-2 w-7 h-7 rounded-full flex items-center justify-center bg-rose-500/90 text-white hover:bg-rose-600 transition-colors cursor-pointer z-10"
                aria-label={L.deleteProject}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </article>
        );
      })}

      {isEditorMode && onAddItem && items.length > 0 && (
        <div className="pt-6">
          <WorksAddTile
            onAdd={onAddItem}
            collapseSheetForInlineEdit={collapseSheetForInlineEdit}
            isEN={isEN}
            style={{ borderRadius: radius, minHeight: "120px" }}
          />
        </div>
      )}
    </div>
  );
}
