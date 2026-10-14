"use client";
import React from "react";
import ProductCompact from "../product/compact";
import type { CatalogVariantProps } from "../product/types";

export default function CatalogCompact({ catalog, ...rest }: CatalogVariantProps) {
  return <ProductCompact kind="catalog" data={catalog} {...rest} />;
}
