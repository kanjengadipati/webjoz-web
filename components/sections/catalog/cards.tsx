"use client";
import React from "react";
import ProductCards from "../product/cards";
import type { CatalogVariantProps } from "../product/types";

export default function CatalogCards({ catalog, ...rest }: CatalogVariantProps) {
  return <ProductCards kind="catalog" data={catalog} {...rest} />;
}
