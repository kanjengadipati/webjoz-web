"use client";
import React from "react";
import { Plus, Image as ImageIcon } from "lucide-react";
import type { TemplateProps, DesignToken } from "../../templates/types";

interface CatalogVariantProps {
  catalog: TemplateProps["content"]["catalog"];
  design_token?: DesignToken | null;
}

export default function CatalogInstagramSquareGrid({ catalog }: CatalogVariantProps) {
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
            <span
              className="text-xs uppercase tracking-wider font-extrabold block mb-2"
              style={{ color: "var(--dt-accent)", fontFamily: "var(--dt-heading-font)" }}
            >
              {eyebrow}
            </span>
          )}
          <h2
            className="text-4xl font-black tracking-tight"
            style={{
              color: "var(--dt-text)",
              fontFamily: "var(--dt-heading-font, sans-serif)"
            }}
          >
            {title}
          </h2>
        </div>
        {subtitle && (
          <p
            className="text-sm font-medium max-w-md md:text-right"
            style={{ color: "var(--dt-text-muted)" }}
          >
            {subtitle}
          </p>
        )}
      </div>

      {/* Categories */}
      <div className="space-y-20">
        {categories?.map((category, catIdx) => (
          <div key={catIdx} className="space-y-6">
            <h3
              className="text-xl font-extrabold uppercase tracking-tight flex items-center gap-2"
              style={{ fontFamily: "var(--dt-heading-font)" }}
            >
              <span className="w-3 h-3 bg-current inline-block"></span>
              {category.name}
            </h3>

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
                        <h4
                          className="text-base font-bold tracking-tight"
                          style={{ color: "var(--dt-text)" }}
                        >
                          {item.name}
                        </h4>
                        {item.price && (
                          <span
                            className="text-base font-extrabold tracking-tight shrink-0"
                            style={{ color: "var(--dt-text)" }}
                          >
                            {item.price}
                          </span>
                        )}
                      </div>

                      {item.description && (
                        <p
                          className="text-xs font-medium leading-relaxed mt-1"
                          style={{ color: "var(--dt-text-muted)" }}
                        >
                          {item.description}
                        </p>
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
