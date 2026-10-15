"use client";
import React from "react";
import ProductHorizontalSwipeCarousel from "../product/horizontal-swipe-carousel";
import type { MenuVariantProps } from "../product/types";

export default function MenuHorizontalSwipeCarousel({ menu, ...rest }: MenuVariantProps) {
  return <ProductHorizontalSwipeCarousel kind="menu" data={menu} {...rest} />;
}
