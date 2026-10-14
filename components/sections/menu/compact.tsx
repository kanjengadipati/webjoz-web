"use client";
import React from "react";
import ProductCompact from "../product/compact";
import type { MenuVariantProps } from "../product/types";

export default function MenuCompact({ menu, ...rest }: MenuVariantProps) {
  return <ProductCompact kind="menu" data={menu} {...rest} />;
}
