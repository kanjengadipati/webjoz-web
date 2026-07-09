"use client";
import React from "react";
import { Utensils } from "lucide-react";
import type { TemplateProps, DesignToken } from "../../templates/types";

interface MenuVariantProps {
  menu: TemplateProps["content"]["menu"];
  design_token?: DesignToken | null;
}

export default function VisualShowcaseHero({ menu }: MenuVariantProps) {
  if (!menu) return null;
  const { eyebrow, title, subtitle, categories } = menu;

  return (
    <section
      id="showcase-hero-section"
      className="w-full py-16 px-4 md:px-8 bg-dt-bg text-dt-text font-dt-body"
    >
      <div className="max-w-7xl mx-auto">
        <div id="hero-header" className="text-center mb-20 max-w-3xl mx-auto">
          {eyebrow && (
            <span
              id="hero-eyebrow"
              className="text-xs font-medium tracking-widest uppercase text-dt-text-muted block mb-4 font-dt-heading"
            >
              {eyebrow}
            </span>
          )}
          <h2
            id="hero-title"
            className="text-4xl md:text-6xl font-light tracking-tight mb-6 text-dt-text font-dt-heading"
          >
            {title}
          </h2>
          <div className="w-16 h-[2px] bg-dt-primary mx-auto mb-6"></div>
          {subtitle && (
            <p
              id="hero-subtitle"
              className="text-sm md:text-base text-dt-text-muted max-w-xl mx-auto italic font-light"
            >
              {subtitle}
            </p>
          )}
        </div>

        {categories.map((category, catIndex) => (
          <div
            key={category.name}
            id={`hero-category-${catIndex}`}
            className="mb-24 last:mb-0"
          >
            <div className="text-center mb-12">
              <h3
                id={`hero-cat-title-${catIndex}`}
                className="text-2xl md:text-3xl font-normal tracking-wide text-dt-text font-dt-heading inline-block relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-1/4 after:right-1/4 after:h-[1px] after:bg-dt-border"
              >
                {category.name}
              </h3>
            </div>

            <div
              id={`hero-grid-${catIndex}`}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
            >
              {category.items.map((item, itemIndex) => {
                const badge = (item as { badge?: string }).badge;
                const hasBadge = !!badge;

                return (
                  <div
                    key={item.name}
                    id={`hero-item-${catIndex}-${itemIndex}`}
                    className="group flex flex-col bg-dt-surface rounded-dt overflow-hidden border border-dt-border/50 hover:shadow-xl hover:border-dt-border transition-all duration-300 h-[560px]"
                  >
                    <div className="relative h-[390px] w-full overflow-hidden bg-dt-accent/5">
                      {item.image_url ? (
                        <img
                          id={`hero-img-${catIndex}-${itemIndex}`}
                          src={item.image_url}
                          alt={item.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                      ) : (
                        <div
                          id={`hero-fallback-${catIndex}-${itemIndex}`}
                          className="w-full h-full bg-dt-accent/15 flex flex-col items-center justify-center text-dt-primary/40"
                        >
                          <Utensils className="w-12 h-12 stroke-[1] mb-2" />
                          <span className="text-[10px] uppercase tracking-widest font-dt-heading font-medium text-dt-text-muted">
                            Menu Selection
                          </span>
                        </div>
                      )}

                      {hasBadge && (
                        <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-black/40 to-transparent"></div>
                      )}

                      {badge && (
                        <div
                          id={`hero-badge-${catIndex}-${itemIndex}`}
                          className="absolute top-4 left-4 bg-white/90 dark:bg-black/80 backdrop-blur-xs text-dt-text text-[10px] font-semibold tracking-widest uppercase px-3 py-1.5 border border-dt-border rounded-none shadow-xs font-dt-heading"
                        >
                          {badge}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 p-6 flex flex-col justify-between bg-dt-surface">
                      <div className="flex items-start justify-between gap-4">
                        <h4 className="text-lg font-medium tracking-tight font-dt-heading text-dt-text leading-snug group-hover:text-dt-primary transition-colors duration-300">
                          {item.name}
                        </h4>
                        {item.price && (
                          <span className="text-base font-semibold font-dt-heading text-dt-primary">
                            {item.price}
                          </span>
                        )}
                      </div>

                      {item.description && (
                        <p className="text-xs md:text-sm text-dt-text-muted font-light leading-relaxed line-clamp-2 mt-2">
                          {item.description}
                        </p>
                      )}

                      <div className="w-full h-[1px] bg-dt-border/40 mt-4"></div>
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
