"use client";
import React from "react";
import ProductCards from "../product/cards";
import type { MenuVariantProps } from "../product/types";

export default function MenuCards({ menu, ...rest }: MenuVariantProps) {
  return <ProductCards kind="menu" data={menu} {...rest} />;
}
