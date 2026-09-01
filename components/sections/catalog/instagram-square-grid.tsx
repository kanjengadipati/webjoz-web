"use client";
import React from "react";
import { Plus, Image as ImageIcon } from "lucide-react";
import { InlineText } from "../../templates/shared";
import type { TemplateProps, DesignToken } from "../../templates/types";

interface CatalogVariantProps {
  catalog: TemplateProps["content"]["catalog"];
  design_token?: DesignToken | null;
  onUpdateField?: (section: string, key: string, value: any) => void;
  isEditorMode?: boolean;
  isSelected?: boolean;
  collapseSheetForInlineEdit?: () => void;
  onEditingStateChange?: (isEditing: boolean) => void;
}

export default function CatalogInstagramSquareGrid({ catalog, onUpdateField, isEditorMode, isSelected, collapseSheetForInlineEdit, onEditingStateChange }: CatalogVariantProps) {
  if (!catalog) return null;
  const { eyebrow, title, subtitle, categories } = catalog;

  return (
    <section
      id="catalog"
      className="py-16 px-4 md:px-8 max-w-7xl mx-auto"
      style={{
        backgroundColor: "var(--dt-bg)",
        color: "var(--dt-text)",
        fontFamily: "var(--dt-body-font, sans-serif)",
      }}
    >
      {/* Header */}
      <div className="mb-16 border-b-2 pb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4" style={{ borderColor: "var(--dt-border)" }}>
        <div>
          {eyebrow && (
            <InlineText
              section="catalog"
              fieldKey="eyebrow"
              value={eyebrow}
              onUpdateField={onUpdateField}
              isEditorMode={isEditorMode}
              isSelected={isSelected}
              collapseSheetForInlineEdit={collapseSheetForInlineEdit}
              onEditingStateChange={onEditingStateChange}
              as="span"
              className="text-xs uppercase tracking-wider font-extrabold block mb-2"
              style={{ color: "var(--dt-accent)", fontFamily: "var(--dt-heading-font)" }}
            />
          )}
          <InlineText
            section="catalog"
            fieldKey="title"
            value={title}
            onUpdateField={onUpdateField}
            isEditorMode={isEditorMode}
            isSelected={isSelected}
            collapseSheetForInlineEdit={collapseSheetForInlineEdit}
            onEditingStateChange={onEditingStateChange}
            as="h2"
            className="text-4xl font-black tracking-tight"
            style={{
              color: "var(--dt-text)",
              fontFamily: "var(--dt-heading-font, sans-serif)"
            }}
          />
        </div>
        {subtitle && (
          <InlineText
            section="catalog"
            fieldKey="subtitle"
            value={subtitle}
            onUpdateField={onUpdateField}
            isEditorMode={isEditorMode}
            isSelected={isSelected}
            collapseSheetForInlineEdit={collapseSheetForInlineEdit}
            onEditingStateChange={onEditingStateChange}
            as="p"
            className="text-sm font-medium max-w-md md:text-right"
            style={{ color: "var(--dt-text-muted)" }}
          />
        )}
      </div>

      {/* Categories */}
      <div className="space-y-20">
        {categories?.map((category, catIdx) => (
          <div key={catIdx} className="space-y-6">
            <div
              className="text-xl font-extrabold uppercase tracking-tight flex items-center gap-2"
              style={{ fontFamily: "var(--dt-heading-font)" }}
            >
              <span className="w-3 h-3 bg-current inline-block"></span>
              <InlineText
                section="catalog"
                fieldKey={"categories." + catIdx + ".name"}
                value={category.name ?? ""}
                onUpdateField={onUpdateField}
                isEditorMode={isEditorMode}
                isSelected={isSelected}
                collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                onEditingStateChange={onEditingStateChange}
                as="h3"
              />
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {category.items?.map((item, index) => {
                const itemNum = (index + 1).toString().padStart(2, "0");

                return (
                  <div
                    key={index}
                    className="flex flex-col border-2 md:border-3 overflow-hidden group bg-surface h-full"
                    style={{
                      borderColor: "var(--dt-border)",
                      backgroundColor: "var(--dt-surface)",
                      borderRadius: "var(--dt-radius)",
                    }}
                  >
                    {/* Image Area - 1:1 Square Crop */}
                    <div className="relative w-full aspect-square overflow-hidden border-b-2" style={{ borderColor: "var(--dt-border)" }}>
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center p-6 text-neutral-400 dark:text-neutral-600">
                          <ImageIcon size={32} strokeWidth={2} className="mb-2" />
                          <span className="text-xs uppercase tracking-wider font-bold">No Image</span>
                        </div>
                      )}

                      {/* Bold Sequential Numbering */}
                      <div
                        className="absolute top-3 left-3 text-sm font-black px-2 py-1 select-none pointer-events-none"
                        style={{
                          backgroundColor: "var(--dt-primary)",
                          color: "var(--dt-primary-foreground)",
                        }}
                      >
                        #{itemNum}
                      </div>

                      {/* Badge */}
                      {item.badge && (
                        <div
                          className="absolute bottom-3 left-3 text-[10px] uppercase tracking-wider font-extrabold px-2 py-1"
                          style={{
                            backgroundColor: "var(--dt-accent)",
                            color: "var(--dt-primary-foreground)",
                          }}
                        >
                          {item.badge}
                        </div>
                      )}
                    </div>

                    {/* Description & Price Info Area */}
                    <div className="p-4 flex flex-col flex-grow">
                      <div className="flex justify-between items-start gap-4 mb-2">
                        <InlineText
                          section="catalog"
                          fieldKey={"categories." + catIdx + ".items." + index + ".name"}
                          value={item.name ?? ""}
                          onUpdateField={onUpdateField}
                          isEditorMode={isEditorMode}
                          isSelected={isSelected}
                          collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                          onEditingStateChange={onEditingStateChange}
                          as="h4"
                          className="text-base font-bold tracking-tight"
                          style={{ color: "var(--dt-text)" }}
                        />
                        {item.price && (
                          <InlineText
                            section="catalog"
                            fieldKey={"categories." + catIdx + ".items." + index + ".price"}
                            value={item.price ?? ""}
                            onUpdateField={onUpdateField}
                            isEditorMode={isEditorMode}
                            isSelected={isSelected}
                            collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                            onEditingStateChange={onEditingStateChange}
                            as="span"
                            className="text-base font-extrabold tracking-tight shrink-0"
                            style={{ color: "var(--dt-text)" }}
                          />
                        )}
                      </div>

                      {item.description && (
                        <InlineText
                          section="catalog"
                          fieldKey={"categories." + catIdx + ".items." + index + ".description"}
                          value={item.description ?? ""}
                          onUpdateField={onUpdateField}
                          isEditorMode={isEditorMode}
                          isSelected={isSelected}
                          collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                          onEditingStateChange={onEditingStateChange}
                          as="p"
                          multiline
                          className="text-xs font-medium leading-relaxed mt-1"
                          style={{ color: "var(--dt-text-muted)" }}
                        />
                      )}

                      {item.capacity != null && item.capacity > 0 && (
                        <div className="mt-2">
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5" style={{ background: "var(--dt-primary)", color: "var(--dt-primary-foreground)" }}>
                            s/d {item.capacity} tamu
                          </span>
                        </div>
                      )}

                      {item.features && item.features.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {item.features.map((f: string, fi: number) => (
                            <span key={fi} className="text-[10px] font-semibold px-2 py-0.5 border" style={{ borderColor: "var(--dt-border)", color: "var(--dt-text)" }}>
                              {f}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* High-contrast Pinned Button */}
                    <button
                      className="w-full py-3.5 border-t-2 text-xs font-extrabold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors duration-200"
                      style={{
                        borderColor: "var(--dt-border)",
                        backgroundColor: "var(--dt-primary)",
                        color: "var(--dt-primary-foreground)",
                      }}
                      aria-label={`Add ${item.name} to cart`}
                    >
                      <Plus size={14} strokeWidth={3} />
                      Tambah
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
