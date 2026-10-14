"use client";
import React from "react";
import ProductClassic from "../product/classic";
import type { MenuVariantProps } from "../product/types";

export default function MenuClassic({ menu, ...rest }: MenuVariantProps) {
  return <ProductClassic kind="menu" data={menu} {...rest} />;
}
