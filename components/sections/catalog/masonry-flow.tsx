"use client";
import React from "react";
import { ShoppingBag, Image as ImageIcon } from "lucide-react";
import type { TemplateProps, DesignToken } from "../../templates/types";

interface CatalogVariantProps {
  catalog: TemplateProps["content"]["catalog"];
  design_token?: DesignToken | null;
}

export default function CatalogMasonryFlow({ catalog }: CatalogVariantProps) {
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
      <div className="mb-16 text-center max-w-2xl mx-auto">
        {eyebrow && (
          <span
            className="text-xs uppercase tracking-widest font-semibold block mb-2"
            style={{ color: "var(--dt-accent)", fontFamily: "var(--dt-heading-font)" }}
          >
            {eyebrow}
          </span>
        )}
        <h2
          className="text-3xl md:text-4xl font-normal tracking-tight mb-4"
          style={{
            color: "var(--dt-text)",
            fontFamily: "var(--dt-heading-font, serif)"
          }}
        >
          {title}
        </h2>
        {subtitle && (
          <p
            className="text-base font-light leading-relaxed"
            style={{ color: "var(--dt-text-muted)" }}
          >
            {subtitle}
          </p>
        )}
      </div>

      {/* Categories */}
      <div className="space-y-24">
        {categories?.map((category, catIdx) => (
          <div key={catIdx} className="space-y-8">
            <div className="border-b pb-3" style={{ borderColor: "var(--dt-border)" }}>
              <h3
                className="text-sm uppercase tracking-widest font-semibold"
                style={{ fontFamily: "var(--dt-heading-font)", color: "var(--dt-accent)" }}
              >
                {category.name}
              </h3>
            </div>

            {/* Vertical CSS Masonry Columns */}
            <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 [column-fill:_balance]">
              {category.items?.map((item, index) => (
                <div
                  key={index}
                  className="break-inside-avoid mb-6 flex flex-col group relative border overflow-hidden transition-all duration-300"
                  style={{
                    borderColor: "var(--dt-border)",
                    backgroundColor: "var(--dt-surface)",
                    borderRadius: "var(--dt-radius)",
                  }}
                >
                  {/* Image area */}
                  <div className="relative w-full overflow-hidden bg-neutral-100 dark:bg-neutral-900">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-102"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-48 flex flex-col items-center justify-center p-6 text-neutral-400 dark:text-neutral-600">
                        <ImageIcon size={32} strokeWidth={1} className="mb-2" />
                        <span className="text-xs uppercase tracking-wider">No Image</span>
                      </div>
                    )}

                    {/* Badge */}
                    {item.badge && (
                      <div
                        className="absolute top-3 left-3 text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 z-10"
                        style={{
                          backgroundColor: "var(--dt-primary)",
                          color: "var(--dt-primary-foreground)",
                          borderRadius: "var(--dt-radius)",
                        }}
                      >
                        {item.badge}
                      </div>
                    )}

                    {/* Hover Overlay Button */}
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4">
                      <button
                        className="w-full py-2 px-4 rounded text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 shadow transition-transform duration-300 translate-y-2 group-hover:translate-y-0"
                        style={{
                          backgroundColor: "var(--dt-primary)",
                          color: "var(--dt-primary-foreground)",
                        }}
                        aria-label={`Add ${item.name} to cart`}
                      >
                        <ShoppingBag size={12} />
                        Tambah
                      </button>
                    </div>
                  </div>

                  {/* Metadata area */}
                  <div className="p-4 flex flex-col flex-grow">
                    <div className="flex justify-between items-start gap-4 mb-1">
                      <h4
                        className="text-sm font-medium tracking-tight"
                        style={{ color: "var(--dt-text)" }}
                      >
                        {item.name}
                      </h4>
                      {item.price && (
                        <span
                          className="text-sm font-semibold tracking-tight shrink-0"
                          style={{ color: "var(--dt-text)" }}
                        >
                          {item.price}
                        </span>
                      )}
                    </div>

                    {item.description && (
                      <p
                        className="text-xs leading-relaxed mt-2"
                        style={{ color: "var(--dt-text-muted)" }}
                      >
                        {item.description}
                      </p>
                    )}

                    {item.capacity != null && item.capacity > 0 && (
                      <div className="mt-2">
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full" style={{ background: "color-mix(in srgb, var(--dt-primary) 10%, transparent)", color: "var(--dt-primary)" }}>
                          s/d {item.capacity} tamu
                        </span>
                      </div>
                    )}

                    {item.features && item.features.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {item.features.map((f: string, fi: number) => (
                          <span key={fi} className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: "color-mix(in srgb, var(--dt-primary) 8%, transparent)", color: "var(--dt-primary)" }}>
                            {f}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Mobile Add to Cart */}
                    <div className="mt-4 md:hidden">
                      <button
                        className="w-full py-2 border text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2"
                        style={{
                          borderColor: "var(--dt-border)",
                          color: "var(--dt-text)",
                          borderRadius: "var(--dt-radius)",
                        }}
                      >
                        <ShoppingBag size={12} />
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
    </section>
  );
}
