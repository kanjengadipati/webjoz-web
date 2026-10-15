"use client";
import React from "react";
import ProductMasonryFlow from "../product/masonry-flow";
import type { CatalogVariantProps } from "../product/types";

export default function CatalogMasonryFlow({ catalog, ...rest }: CatalogVariantProps) {
  return <ProductMasonryFlow kind="catalog" data={catalog} {...rest} />;
}
