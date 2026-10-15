"use client";
import React from "react";
import ProductMasonryFlow from "../product/masonry-flow";
import type { MenuVariantProps } from "../product/types";

export default function MenuMasonryFlow({ menu, ...rest }: MenuVariantProps) {
  return <ProductMasonryFlow kind="menu" data={menu} {...rest} />;
}
