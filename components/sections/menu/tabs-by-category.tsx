"use client";
import React from "react";
import ProductTabsByCategory from "../product/tabs-by-category";
import type { MenuVariantProps } from "../product/types";

export default function MenuTabsByCategory({ menu, ...rest }: MenuVariantProps) {
  return <ProductTabsByCategory kind="menu" data={menu} {...rest} />;
}
