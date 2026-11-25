"use client";
import React from "react";
import { ArrowUpRight, Image as ImageIcon, Trash2 } from "lucide-react";
import { InlineText, InlineImage } from "../../templates/shared";
import { safeHref, isExternalHref } from "@/lib/safe-url";
import { WorksAddTile } from "./shared";
import type { WorksRackProps } from "./shared";
import { worksStrings } from "./works-strings";

export default function WorksFullWidth({
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
    <div className="space-y-6">
      {items.map((item, idx) => {
        const href = safeHref(item.project_url, "");
        const external = isExternalHref(href);

        return (
          <article
            key={idx}
            className="group relative w-full overflow-hidden flex items-end min-h-[340px] sm:min-h-[400px]"
            style={{
              borderRadius: radius,
              background: "color-mix(in srgb, var(--dt-primary) 10%, var(--dt-surface))",
              border: "1px solid var(--dt-border)",
            }}
          >
            {/* Full-bleed Background Image */}
            <div className="absolute inset-0">
              {(item.image_url || isEditorMode) ? (
                <InlineImage
                  section="works"
                  fieldKey={`items.${idx}.image_url`}
                  src={item.image_url}
                  alt={item.alt_text || item.title}
                  onUpdateField={(_, __, val) => onUpdateItem(idx, "image_url", val)}
                  isEditorMode={isEditorMode}
                  isSelected={isSelected}
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
                  collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="w-12 h-12 opacity-20" style={{ color: "var(--dt-text-muted)" }} />
                </div>
              )}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)",
                }}
              />
            </div>

            {/* Floating Info Card */}
            <div
              className="relative z-10 m-4 sm:m-6 p-5 sm:p-6 max-w-lg w-full shadow-lg"
              style={{
                borderRadius: radius,
                background: "color-mix(in srgb, var(--dt-bg) 94%, transparent)",
                backdropFilter: "blur(12px)",
                border: "1px solid var(--dt-border)",
              }}
            >
              {(item.category || item.year || isEditorMode) && (
                <span
                  className="inline-block text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md mb-2.5"
                  style={{
                    background: "color-mix(in srgb, var(--dt-primary) 12%, transparent)",
                    color: "var(--dt-primary)",
                  }}
                >
                  <InlineText
                    section="works"
                    fieldKey={`items.${idx}.category`}
                    value={item.category || L.defaultCategory}
                    placeholder={L.categoryPlaceholder}
                    onUpdateField={(_, __, val) => onUpdateItem(idx, "category", val)}
                    isEditorMode={isEditorMode}
                    isSelected={isSelected}
                    collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                    onEditingStateChange={onEditingStateChange}
                    as="span"
                  />
                </span>
              )}

              <h3
                className="text-xl sm:text-2xl font-bold leading-snug mb-2"
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
                  className="text-sm leading-relaxed mb-3"
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
              )}
            </div>

            {isEditorMode && onRemoveItem && items.length > 1 && (
              <button
                type="button"
                onClick={() => onRemoveItem(idx)}
                className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center bg-rose-500/90 text-white hover:bg-rose-600 transition-colors cursor-pointer z-20"
                aria-label={L.deleteProject}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </article>
        );
      })}

      {isEditorMode && onAddItem && items.length > 0 && (
        <WorksAddTile
          onAdd={onAddItem}
          collapseSheetForInlineEdit={collapseSheetForInlineEdit}
          isEN={isEN}
          style={{ borderRadius: radius, minHeight: "160px" }}
        />
      )}
    </div>
  );
}
