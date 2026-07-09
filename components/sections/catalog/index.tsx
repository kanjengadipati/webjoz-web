"use client";
import React from "react";
import type { ComponentType } from "react";
import type { DesignToken, TemplateProps } from "../../templates/types";
import CatalogClassic from "./classic";
import CatalogCompact from "./compact";
import CatalogCards from "./cards";
import CatalogGridDense from "./grid-dense";
import CatalogShowcaseFeatured from "./showcase-featured";
import CatalogTabsByCategory from "./tabs-by-category";
import CatalogEditorialGrid from "./editorial-grid";
import CatalogMasonryFlow from "./masonry-flow";
import CatalogInstagramSquareGrid from "./instagram-square-grid";
import CatalogSplitHeroCatalog from "./split-hero-catalog";
import CatalogNeoBrutalistMatrix from "./neo-brutalist-matrix";
import CatalogHorizontalSwipeCarousel from "./horizontal-swipe-carousel";

const variants: Record<string, ComponentType<{ catalog: TemplateProps["content"]["catalog"]; design_token?: DesignToken | null }>> = {
  // existing
  grid: CatalogClassic,
  compact: CatalogCompact,
  cards: CatalogCards,
  // new
  "grid-dense": CatalogGridDense,
  "showcase-featured": CatalogShowcaseFeatured,
  "tabs-by-category": CatalogTabsByCategory,
  "editorial-grid": CatalogEditorialGrid,
  "masonry-flow": CatalogMasonryFlow,
  "instagram-square-grid": CatalogInstagramSquareGrid,
  "split-hero-catalog": CatalogSplitHeroCatalog,
  "neo-brutalist-matrix": CatalogNeoBrutalistMatrix,
  "horizontal-swipe-carousel": CatalogHorizontalSwipeCarousel,
};

export default function CatalogSection({ catalog, design_token }: { catalog: TemplateProps["content"]["catalog"]; design_token?: DesignToken | null }) {
  const variant = design_token?.layout?.section_variants?.catalog ?? "grid";
  const Renderer = variants[variant] ?? CatalogClassic;
  return <Renderer catalog={catalog} design_token={design_token} />;
}
