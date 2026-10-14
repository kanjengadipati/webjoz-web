"use client";
import React from "react";
import ProductClassic from "../product/classic";
import type { CatalogVariantProps } from "../product/types";

export default function CatalogClassic({ catalog, ...rest }: CatalogVariantProps) {
  return <ProductClassic kind="catalog" data={catalog} {...rest} />;
}
