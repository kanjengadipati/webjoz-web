"use client";
import React from "react";
import ProductTabsByCategory from "../product/tabs-by-category";
import type { CatalogVariantProps } from "../product/types";

export default function CatalogTabsByCategory({ catalog, ...rest }: CatalogVariantProps) {
  return <ProductTabsByCategory kind="catalog" data={catalog} {...rest} />;
}
