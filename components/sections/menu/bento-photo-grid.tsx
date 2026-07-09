"use client";
import React from "react";
import { Utensils } from "lucide-react";
import type { TemplateProps, DesignToken } from "../../templates/types";

interface MenuVariantProps {
  menu: TemplateProps["content"]["menu"];
  design_token?: DesignToken | null;
}

export default function BentoPhotoGrid({ menu }: MenuVariantProps) {
  if (!menu) return null;
  const { eyebrow, title, subtitle, categories } = menu;

  const getBentoClasses = (index: number) => {
    const itemIndex = index % 6;
    switch (itemIndex) {
      case 0:
        return "md:col-span-2 md:row-span-2 h-[350px] md:h-[520px]";
      case 3:
        return "md:col-span-2 md:row-span-1 h-[220px] md:h-[248px]";
      default:
        return "md:col-span-1 md:row-span-1 h-[220px] md:h-[248px]";
    }
  };

  return (
    <section
      id="bento-photo-grid-section"
      className="w-full py-16 px-4 md:px-8 bg-dt-bg text-dt-text font-dt-body"
    >
      <div className="max-w-7xl mx-auto">
        <div id="bento-header" className="text-center mb-16 max-w-2xl mx-auto">
          {eyebrow && (
            <span
              id="bento-eyebrow"
              className="text-xs font-medium tracking-wider uppercase text-dt-text-muted block mb-2 font-dt-heading"
            >
              {eyebrow}
            </span>
          )}
          <h2
            id="bento-title"
            className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-dt-text font-dt-heading"
          >
            {title}
          </h2>
          {subtitle && (
            <p
              id="bento-subtitle"
              className="text-sm md:text-base text-dt-text-muted"
            >
              {subtitle}
            </p>
          )}
        </div>

        {categories.map((category, catIndex) => (
          <div
            key={category.name}
            id={`bento-category-${catIndex}`}
            className="mb-16 last:mb-0"
          >
            <div className="flex items-center gap-4 mb-8">
              <h3
                id={`bento-cat-title-${catIndex}`}
                className="text-xl md:text-2xl font-bold tracking-tight font-dt-heading text-dt-text"
              >
                {category.name}
              </h3>
              <div className="h-[1px] flex-1 bg-dt-border"></div>
            </div>

            <div
              id={`bento-grid-${catIndex}`}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-max"
            >
              {category.items.map((item, itemIndex) => {
                const bentoSizeClass = getBentoClasses(itemIndex);
                const displayNum = String(itemIndex + 1).padStart(2, "0");
                const isLarge = itemIndex % 6 === 0;
                const badge = (item as { badge?: string }).badge;

                return (
                  <div
                    key={item.name}
                    id={`bento-item-${catIndex}-${itemIndex}`}
                    className={`relative group overflow-hidden rounded-dt border border-dt-border bg-dt-surface flex flex-col justify-end transition-all duration-300 hover:shadow-lg hover:border-dt-primary ${bentoSizeClass}`}
                  >
                    {item.image_url ? (
                      <img
                        id={`bento-img-${catIndex}-${itemIndex}`}
                        src={item.image_url}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div
                        id={`bento-fallback-${catIndex}-${itemIndex}`}
                        className="absolute inset-0 w-full h-full bg-dt-accent/20 flex flex-col items-center justify-center text-dt-primary/40"
                      >
                        <Utensils className="w-12 h-12 stroke-[1.5] mb-2" />
                        <span className="text-xs font-medium font-dt-heading text-dt-text-muted uppercase tracking-wider">
                          Our Selection
                        </span>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent transition-opacity duration-300 group-hover:from-black/95"></div>

                    <div
                      id={`bento-num-${catIndex}-${itemIndex}`}
                      className="absolute top-4 left-4 font-dt-heading font-bold text-2xl md:text-3xl text-white/20 select-none group-hover:text-dt-primary/40 transition-colors duration-300"
                    >
                      {displayNum}
                    </div>

                    {badge && (
                      <div
                        id={`bento-badge-${catIndex}-${itemIndex}`}
                        className="absolute top-4 right-4 z-10 bg-dt-primary text-dt-primary-foreground text-[10px] md:text-xs font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full shadow-sm font-dt-heading"
                      >
                        {badge}
                      </div>
                    )}

                    <div className="relative p-6 z-10 text-white select-none">
                      <div className="flex items-baseline justify-between gap-4 mb-2">
                        <h4 className="text-lg md:text-xl font-bold tracking-tight font-dt-heading">
                          {item.name}
                        </h4>
                        {item.price && (
                          <span className="text-base md:text-lg font-bold font-dt-heading text-dt-primary shrink-0">
                            {item.price}
                          </span>
                        )}
                      </div>

                      {item.description && (
                        <p className={`text-xs md:text-sm text-white/80 font-normal leading-relaxed transition-all duration-300 ${
                          isLarge ? "line-clamp-none opacity-100" : "line-clamp-2 md:line-clamp-1 group-hover:line-clamp-none"
                        }`}>
                          {item.description}
                        </p>
                      )}
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
