"use client";
import React from "react";
import { ShoppingBag, Image as ImageIcon } from "lucide-react";
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

export default function CatalogEditorialGrid({ catalog, onUpdateField, isEditorMode, isSelected, collapseSheetForInlineEdit, onEditingStateChange }: CatalogVariantProps) {
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
      <div className="mb-16 max-w-2xl">
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
            className="text-xs uppercase tracking-widest font-medium block mb-3"
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
          className="text-4xl md:text-5xl font-light tracking-tight mb-4"
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
            className="text-lg font-light leading-relaxed"
            style={{ color: "var(--dt-text-muted)" }}
          />
        )}
      </div>

      {/* Categories */}
      <div className="space-y-24">
        {categories?.map((category, catIdx) => (
          <div key={catIdx} className="space-y-10">
            <div className="border-b pb-4" style={{ borderColor: "var(--dt-border)" }}>
              <h3
                className="text-lg uppercase tracking-wider font-medium"
                style={{ fontFamily: "var(--dt-heading-font)" }}
              >
                {category.name}
              </h3>
            </div>

            {/* Asymmetric Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-x-8 gap-y-16">
              {category.items?.map((item, index) => {
                let colSpanClass = "md:col-span-6";
                let aspectClass = "aspect-[4/5]";

                if (index % 6 === 0) {
                  colSpanClass = "md:col-span-8";
                  aspectClass = "aspect-[16/10]";
                } else if (index % 6 === 1) {
                  colSpanClass = "md:col-span-4";
                  aspectClass = "aspect-[3/4]";
                } else if (index % 6 === 2) {
                  colSpanClass = "md:col-span-5";
                  aspectClass = "aspect-[1/1]";
                } else if (index % 6 === 3) {
                  colSpanClass = "md:col-span-7";
                  aspectClass = "aspect-[16/9]";
                } else if (index % 6 === 4) {
                  colSpanClass = "md:col-span-6";
                  aspectClass = "aspect-[4/3]";
                } else {
                  colSpanClass = "md:col-span-6";
                  aspectClass = "aspect-[3/2]";
                }

                return (
                  <div
                    key={index}
                    className={`${colSpanClass} flex flex-col group relative`}
                  >
                    {/* Image Area with Hover Pill */}
                    <div
                      className={`relative w-full ${aspectClass} overflow-hidden bg-neutral-100 dark:bg-neutral-900 mb-4 transition-all duration-500`}
                      style={{ borderRadius: "var(--dt-radius)" }}
                    >
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center p-6 text-neutral-400 dark:text-neutral-600">
                          <ImageIcon size={36} strokeWidth={1} className="mb-2" />
                          <span className="text-xs uppercase tracking-wider">Image Coming Soon</span>
                        </div>
                      )}

                      {/* Floating Badge */}
                      {item.badge && (
                        <div
                          className="absolute top-4 left-4 text-[10px] uppercase tracking-widest font-semibold px-2.5 py-1 z-10 backdrop-blur-md"
                          style={{
                            backgroundColor: "var(--dt-accent)",
                            color: "var(--dt-primary-foreground)",
                            borderRadius: "var(--dt-radius)",
                          }}
                        >
                          {item.badge}
                        </div>
                      )}

                      {/* Floating Hover Add to Cart */}
                      <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none md:pointer-events-auto">
                        <button
                          className="pointer-events-auto transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 px-6 py-3 rounded-full text-xs font-medium uppercase tracking-wider flex items-center gap-2 shadow-lg"
                          style={{
                            backgroundColor: "var(--dt-primary)",
                            color: "var(--dt-primary-foreground)",
                          }}
                          aria-label={`Add ${item.name} to cart`}
                        >
                          <ShoppingBag size={14} />
                          Tambah
                        </button>
                      </div>
                    </div>

                    {/* Metadata Area */}
                    <div className="flex flex-col flex-grow">
                      <div className="flex justify-between items-start gap-4 mb-2">
                        <h4
                          className="text-lg font-light tracking-tight"
                          style={{ color: "var(--dt-text)" }}
                        >
                          {item.name}
                        </h4>
                        {item.price && (
                          <span
                            className="text-sm font-medium tracking-tight"
                            style={{ color: "var(--dt-text)" }}
                          >
                            {item.price}
                          </span>
                        )}
                      </div>

                      {item.description && (
                        <p
                          className="text-sm font-light leading-relaxed mt-1"
                          style={{ color: "var(--dt-text-muted)" }}
                        >
                          {item.description}
                        </p>
                      )}

                      {item.capacity != null && item.capacity > 0 && (
                        <div className="mt-2">
                          <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: "color-mix(in srgb, var(--dt-primary) 10%, transparent)", color: "var(--dt-primary)" }}>
                            s/d {item.capacity} tamu
                          </span>
                        </div>
                      )}

                      {item.features && item.features.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {item.features.map((f: string, fi: number) => (
                            <span key={fi} className="text-[11px] px-2 py-0.5 rounded-full" style={{ background: "color-mix(in srgb, var(--dt-primary) 8%, transparent)", color: "var(--dt-primary)" }}>
                              {f}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Mobile button */}
                      <div className="mt-4 md:hidden">
                        <button
                          className="w-full py-2.5 border text-xs font-medium uppercase tracking-wider flex items-center justify-center gap-2"
                          style={{
                            borderColor: "var(--dt-border)",
                            color: "var(--dt-text)",
                            borderRadius: "var(--dt-radius)",
                          }}
                        >
                          <ShoppingBag size={14} />
                          Tambah
                        </button>
                      </div>
                    </div>
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
