"use client";
import React from "react";
import ProductHorizontalSwipeCarousel from "../product/horizontal-swipe-carousel";
import type { CatalogVariantProps } from "../product/types";

export default function CatalogHorizontalSwipeCarousel({ catalog, ...rest }: CatalogVariantProps) {
  return <ProductHorizontalSwipeCarousel kind="catalog" data={catalog} {...rest} />;
}
