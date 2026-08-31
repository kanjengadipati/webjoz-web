"use client";
import React, { useState, useRef } from "react";
import { ShoppingBag, ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";
import type { TemplateProps, DesignToken } from "../../templates/types";

interface CatalogVariantProps {
  catalog: TemplateProps["content"]["catalog"];
  design_token?: DesignToken | null;
}

export default function CatalogHorizontalSwipeCarousel({ catalog }: CatalogVariantProps) {
  if (!catalog) return null;
  const { eyebrow, title, subtitle, categories } = catalog;

  const [activeCategoryIdx, setActiveCategoryIdx] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const activeCategory = categories?.[activeCategoryIdx] || categories?.[0];

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      const scrollAmount = clientWidth * 0.75;
      scrollContainerRef.current.scrollTo({
        left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section
      id="catalog"
      className="py-16 px-4 md:px-8 max-w-7xl mx-auto overflow-hidden"
      style={{
        backgroundColor: "var(--dt-bg)",
        color: "var(--dt-text)",
        fontFamily: "var(--dt-body-font, sans-serif)",
      }}
    >
      {/* Header */}
      <div className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div className="max-w-xl">
          {eyebrow && (
            <span
              className="text-xs uppercase tracking-widest font-semibold block mb-2"
              style={{ color: "var(--dt-accent)", fontFamily: "var(--dt-heading-font)" }}
            >
              {eyebrow}
            </span>
          )}
          <h2
            className="text-3xl md:text-4xl font-normal tracking-tight mb-3"
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

        {/* Desktop Slide Controls */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={() => scroll("left")}
            className="w-10 h-10 border flex items-center justify-center transition-colors duration-200"
            style={{
              borderColor: "var(--dt-border)",
              backgroundColor: "var(--dt-surface)",
              borderRadius: "var(--dt-radius)"
            }}
            aria-label="Scroll left"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => scroll("right")}
            className="w-10 h-10 border flex items-center justify-center transition-colors duration-200"
            style={{
              borderColor: "var(--dt-border)",
              backgroundColor: "var(--dt-surface)",
              borderRadius: "var(--dt-radius)"
            }}
            aria-label="Scroll right"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex border-b mb-10 overflow-x-auto scrollbar-none" style={{ borderColor: "var(--dt-border)" }}>
        {categories?.map((category, idx) => {
          const isActive = idx === activeCategoryIdx;
          return (
            <button
              key={idx}
              onClick={() => {
                setActiveCategoryIdx(idx);
                if (scrollContainerRef.current) {
                  scrollContainerRef.current.scrollLeft = 0;
                }
              }}
              className="py-4 px-6 text-sm font-medium uppercase tracking-wider relative whitespace-nowrap transition-colors duration-200"
              style={{
                color: isActive ? "var(--dt-text)" : "var(--dt-text-muted)",
                fontFamily: "var(--dt-heading-font)"
              }}
            >
              {category.name}
              {isActive && (
                <span
                  className="absolute bottom-0 left-0 right-0 h-0.5"
                  style={{ backgroundColor: "var(--dt-accent)" }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Carousel Snap Row Container */}
      {activeCategory && (
        <div className="relative">
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-6 scrollbar-thin scroll-smooth"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {activeCategory.items?.map((item, index) => (
              <div
                key={index}
                className="min-w-[280px] sm:min-w-[320px] md:min-w-[360px] snap-start flex-shrink-0 flex flex-col border group relative bg-surface"
                style={{
                  borderColor: "var(--dt-border)",
                  backgroundColor: "var(--dt-surface)",
                  borderRadius: "var(--dt-radius)",
                }}
              >
                {/* Image Area with 4:3 Aspect Ratio */}
                <div
                  className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-100 dark:bg-neutral-900"
                  style={{
                    borderTopLeftRadius: "calc(var(--dt-radius) - 1px)",
                    borderTopRightRadius: "calc(var(--dt-radius) - 1px)"
                  }}
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
                      <span className="text-xs uppercase tracking-wider font-medium">No Image</span>
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

                {/* Metadata & Description Area */}
                <div className="p-5 flex flex-col flex-grow justify-between min-h-[160px]">
                  <div>
                    <div className="flex justify-between items-start gap-4 mb-2">
                      <h4
                        className="text-base font-normal tracking-tight"
                        style={{ color: "var(--dt-text)" }}
                      >
                        {item.name}
                      </h4>
                      {item.price && (
                        <span
                          className="text-sm font-semibold tracking-tight"
                          style={{ color: "var(--dt-text)" }}
                        >
                          {item.price}
                        </span>
                      )}
                    </div>

                    {item.description && (
                      <p
                        className="text-xs leading-relaxed mt-1"
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
                  </div>

                  {/* Pinned Add to Cart button */}
                  <div className="mt-6 pt-4 border-t" style={{ borderColor: "var(--dt-border)" }}>
                    <button
                      className="w-full py-2.5 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2"
                      style={{
                        backgroundColor: "var(--dt-primary)",
                        color: "var(--dt-primary-foreground)",
                        borderRadius: "var(--dt-radius)",
                      }}
                      aria-label={`Add ${item.name} to cart`}
                    >
                      <ShoppingBag size={12} />
                      Tambah
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Swipe indicator for mobile */}
          <div className="flex justify-center items-center gap-1.5 mt-4 md:hidden">
            {activeCategory.items?.map((_, i) => (
              <span
                key={i}
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  backgroundColor: "var(--dt-border)",
                  opacity: i === 0 ? 1 : 0.4
                }}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
