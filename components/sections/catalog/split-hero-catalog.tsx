"use client";
import React from "react";
import { ShoppingBag, ArrowRight, Image as ImageIcon } from "lucide-react";
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

export default function CatalogSplitHeroCatalog({ catalog, onUpdateField, isEditorMode, isSelected, collapseSheetForInlineEdit, onEditingStateChange }: CatalogVariantProps) {
  if (!catalog) return null;
  const { eyebrow, title, subtitle, categories } = catalog;

  // Extract first image for sticky brand panel
  const brandImage = categories?.[0]?.items?.[0]?.image_url || null;

  return (
    <section
      id="catalog"
      className="py-12 md:py-20 px-4 md:px-8 max-w-7xl mx-auto"
      style={{
        backgroundColor: "var(--dt-bg)",
        color: "var(--dt-text)",
        fontFamily: "var(--dt-body-font, sans-serif)",
      }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

        {/* Left Pane: Sticky Brand Visual & Header */}
        <div className="lg:col-span-5 lg:sticky lg:top-8 space-y-8 flex flex-col justify-between h-auto">
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
                className="text-xs uppercase tracking-widest font-semibold block mb-3"
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
              className="text-4xl md:text-5xl font-light tracking-tight leading-tight mb-4"
              style={{
                color: "var(--dt-text)",
                fontFamily: "var(--dt-heading-font, serif)"
              }}
            />
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
                className="text-base md:text-lg font-light leading-relaxed mb-6"
                style={{ color: "var(--dt-text-muted)" }}
              />
            )}
          </div>

          {/* Large Sticky Brand Image */}
          <div
            className="relative w-full aspect-[4/3] lg:aspect-[3/4] overflow-hidden bg-neutral-100 dark:bg-neutral-900 border"
            style={{
              borderRadius: "var(--dt-radius)",
              borderColor: "var(--dt-border)"
            }}
          >
            {brandImage ? (
              <img
                src={brandImage}
                alt="Catalog visual"
                className="w-full h-full object-cover transition-transform duration-1000 ease-out hover:scale-102"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-neutral-400">
                <ImageIcon size={48} strokeWidth={1} />
              </div>
            )}

            {/* Visual overlay indicator */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/40 to-transparent p-6 flex items-end">
              <span className="text-white text-xs uppercase tracking-widest font-semibold flex items-center gap-2">
                Curated Collection <ArrowRight size={14} />
              </span>
            </div>
          </div>
        </div>

        {/* Right Pane: Scrollable Products List */}
        <div className="lg:col-span-7 space-y-20">
          {categories?.map((category, catIdx) => (
            <div key={catIdx} className="space-y-8">
              <div className="border-b pb-4 flex justify-between items-end" style={{ borderColor: "var(--dt-border)" }}>
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
                  className="text-xl font-light tracking-wide uppercase"
                  style={{ fontFamily: "var(--dt-heading-font)" }}
                />
                <span className="text-xs text-neutral-400 font-mono">
                  {category.items?.length} items
                </span>
              </div>

              {/* Stacked Product Cards */}
              <div className="space-y-12">
                {category.items?.map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start pb-12 border-b last:border-b-0 last:pb-0 group"
                    style={{ borderColor: "var(--dt-border)" }}
                  >
                    {/* Image Column */}
                    <div
                      className="md:col-span-5 relative aspect-[4/3] w-full overflow-hidden bg-neutral-100 dark:bg-neutral-900"
                      style={{ borderRadius: "var(--dt-radius)" }}
                    >
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center p-6 text-neutral-400 dark:text-neutral-600">
                          <ImageIcon size={32} strokeWidth={1} className="mb-2" />
                          <span className="text-xs uppercase tracking-wider">No Image</span>
                        </div>
                      )}

                      {/* Badge */}
                      {item.badge && (
                        <div
                          className="absolute top-3 left-3 text-[10px] uppercase tracking-widest font-semibold px-2 py-0.5 z-10"
                          style={{
                            backgroundColor: "var(--dt-accent)",
                            color: "var(--dt-primary-foreground)",
                            borderRadius: "var(--dt-radius)",
                          }}
                        >
                          {item.badge}
                        </div>
                      )}
                    </div>

                    {/* Content Column */}
                    <div className="md:col-span-7 flex flex-col justify-between h-full min-h-[160px]">
                      <div>
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
                            className="text-lg font-normal tracking-tight"
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
                              className="text-base font-semibold tracking-tight shrink-0"
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
                            className="text-sm font-light leading-relaxed mb-4"
                            style={{ color: "var(--dt-text-muted)" }}
                          />
                        )}

                        {item.capacity != null && item.capacity > 0 && (
                          <div className="mb-2">
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full" style={{ background: "color-mix(in srgb, var(--dt-primary) 10%, transparent)", color: "var(--dt-primary)" }}>
                              s/d {item.capacity} tamu
                            </span>
                          </div>
                        )}

                        {item.features && item.features.length > 0 && (
                          <div className="mb-4 flex flex-wrap gap-1">
                            {item.features.map((f: string, fi: number) => (
                              <span key={fi} className="text-[11px] px-2 py-0.5 rounded-full" style={{ background: "color-mix(in srgb, var(--dt-primary) 8%, transparent)", color: "var(--dt-primary)" }}>
                                {f}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Pinned Add to Cart */}
                      <div>
                        <button
                          className="px-6 py-2.5 border text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-200"
                          style={{
                            borderColor: "var(--dt-border)",
                            color: "var(--dt-text)",
                            borderRadius: "var(--dt-radius)",
                          }}
                          aria-label={`Add ${item.name} to cart`}
                        >
                          <ShoppingBag size={14} />
                          Tambah
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
