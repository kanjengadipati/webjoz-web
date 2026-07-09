"use client";
import React, { useState, useEffect, useRef } from "react";
import { Utensils, ChevronRight } from "lucide-react";
import type { TemplateProps, DesignToken } from "../../templates/types";

interface MenuVariantProps {
  menu: TemplateProps["content"]["menu"];
  design_token?: DesignToken | null;
}

export default function SidebarScrollspyPhoto({ menu }: MenuVariantProps) {
  if (!menu) return null;
  const { eyebrow, title, subtitle, categories } = menu;

  const [activeCategory, setActiveCategory] = useState<string>("");
  const isScrollingRef = useRef(false);

  useEffect(() => {
    if (categories.length > 0) {
      setActiveCategory(categories[0].name);
    }

    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -60% 0px",
      threshold: 0,
    };

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      if (isScrollingRef.current) return;

      const intersecting = entries.find((entry) => entry.isIntersecting);
      if (intersecting) {
        const catName = intersecting.target.getAttribute("data-category");
        if (catName) {
          setActiveCategory(catName);
        }
      }
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);

    categories.forEach((_, index) => {
      const el = document.getElementById(`scrollspy-category-section-${index}`);
      if (el) {
        observer.observe(el);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [categories]);

  const handleNavClick = (categoryName: string, index: number) => {
    setActiveCategory(categoryName);
    const el = document.getElementById(`scrollspy-category-section-${index}`);
    if (el) {
      isScrollingRef.current = true;
      const offset = 120;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      setTimeout(() => {
        isScrollingRef.current = false;
      }, 800);

      const navItem = document.getElementById(`mobile-nav-pill-${index}`);
      if (navItem) {
        navItem.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
      }
    }
  };

  return (
    <section
      id="scrollspy-menu-section"
      className="w-full py-16 bg-dt-bg text-dt-text font-dt-body"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div id="scrollspy-header" className="mb-16">
          {eyebrow && (
            <span className="text-xs font-medium tracking-wider uppercase text-dt-text-muted block mb-1 font-dt-heading">
              {eyebrow}
            </span>
          )}
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-dt-text font-dt-heading">
            {title}
          </h2>
          {subtitle && (
            <p className="text-sm md:text-base text-dt-text-muted mt-2 max-w-xl">
              {subtitle}
            </p>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-10 items-start">

          <aside
            id="scrollspy-desktop-sidebar"
            className="hidden lg:block sticky top-24 w-64 shrink-0 border-l border-dt-border pl-6"
          >
            <h3 className="text-xs font-bold uppercase tracking-wider text-dt-text-muted mb-6 font-dt-heading">
              Menu Categories
            </h3>
            <nav className="flex flex-col gap-4">
              {categories.map((category, index) => {
                const isActive = activeCategory === category.name;
                return (
                  <button
                    key={category.name}
                    id={`desktop-nav-pill-${index}`}
                    onClick={() => handleNavClick(category.name, index)}
                    className={`flex items-center justify-between text-left py-1 text-sm font-medium transition-all duration-200 group border-l-2 pl-3 -ml-[26px] ${
                      isActive
                        ? "text-dt-primary border-dt-primary font-bold pl-4"
                        : "text-dt-text-muted border-transparent hover:text-dt-text hover:border-dt-border"
                    }`}
                  >
                    <span>{category.name}</span>
                    <ChevronRight
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isActive ? "translate-x-0 opacity-100 text-dt-primary" : "translate-x-[-4px] opacity-0 group-hover:opacity-55"
                      }`}
                    />
                  </button>
                );
              })}
            </nav>
          </aside>

          <div
            id="scrollspy-mobile-nav-container"
            className="lg:hidden sticky top-0 z-20 w-full bg-dt-surface/95 backdrop-blur-md border-b border-dt-border py-3 px-4 -mx-4 md:-mx-8 mb-6 overflow-x-auto scrollbar-none flex gap-2"
          >
            {categories.map((category, index) => {
              const isActive = activeCategory === category.name;
              return (
                <button
                  key={category.name}
                  id={`mobile-nav-pill-${index}`}
                  onClick={() => handleNavClick(category.name, index)}
                  className={`shrink-0 px-4 py-2 text-xs font-semibold tracking-wider uppercase rounded-full border transition-all duration-200 ${
                    isActive
                      ? "bg-dt-primary text-dt-primary-foreground border-dt-primary shadow-xs"
                      : "bg-dt-surface text-dt-text-muted border-dt-border hover:text-dt-text hover:border-dt-border"
                  }`}
                >
                  {category.name}
                </button>
              );
            })}
          </div>

          <div id="scrollspy-items-container" className="flex-1 w-full space-y-16">
            {categories.map((category, index) => (
              <div
                key={category.name}
                id={`scrollspy-category-section-${index}`}
                data-category={category.name}
                className="scroll-mt-24"
              >
                <div className="flex items-center gap-4 mb-8">
                  <h3 className="text-xl md:text-2xl font-bold tracking-tight font-dt-heading text-dt-text">
                    {category.name}
                  </h3>
                  <div className="h-[1px] flex-1 bg-dt-border"></div>
                </div>

                <div className="space-y-6">
                  {category.items.map((item, itemIndex) => {
                    const badge = (item as { badge?: string }).badge;

                    return (
                      <div
                        key={item.name}
                        id={`scrollspy-item-${index}-${itemIndex}`}
                        className="group flex flex-col md:flex-row bg-dt-surface rounded-dt overflow-hidden border border-dt-border hover:shadow-md hover:border-dt-primary/30 transition-all duration-300 min-h-[160px]"
                      >
                        <div className="relative w-full md:w-[260px] h-[200px] md:h-auto overflow-hidden bg-dt-accent/5 shrink-0">
                          {item.image_url ? (
                            <img
                              id={`scrollspy-img-${index}-${itemIndex}`}
                              src={item.image_url}
                              alt={item.name}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                            />
                          ) : (
                            <div
                              id={`scrollspy-fallback-${index}-${itemIndex}`}
                              className="w-full h-full bg-dt-accent/20 flex flex-col items-center justify-center text-dt-primary/40"
                            >
                              <Utensils className="w-10 h-10 stroke-[1.5] mb-1" />
                              <span className="text-[10px] font-semibold uppercase tracking-widest font-dt-heading text-dt-text-muted">
                                Our Selection
                              </span>
                            </div>
                          )}

                          {badge && (
                            <div
                              id={`scrollspy-badge-${index}-${itemIndex}`}
                              className="absolute top-3 left-3 bg-dt-primary text-dt-primary-foreground text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full shadow-xs font-dt-heading"
                            >
                              {badge}
                            </div>
                          )}
                        </div>

                        <div className="flex-1 p-6 flex flex-col justify-between">
                          <div>
                            <div className="flex items-baseline justify-between gap-4 mb-2">
                              <h4 className="text-lg font-bold tracking-tight text-dt-text font-dt-heading group-hover:text-dt-primary transition-colors duration-200">
                                {item.name}
                              </h4>
                              {item.price && (
                                <span className="text-base font-bold text-dt-primary font-dt-heading">
                                  {item.price}
                                </span>
                              )}
                            </div>

                            {item.description && (
                              <p className="text-xs md:text-sm text-dt-text-muted leading-relaxed line-clamp-3 md:line-clamp-2">
                                {item.description}
                              </p>
                            )}
                          </div>

                          {badge && (
                            <div className="mt-4 pt-3 border-t border-dt-border/50">
                              <span className="text-[10px] font-semibold text-dt-primary uppercase tracking-widest font-dt-heading">
                                Featured Culinary Highlight
                              </span>
                            </div>
                          )}
                        </div>

                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
