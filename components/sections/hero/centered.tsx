"use client";
import React from "react";
import type { HeroVariantProps } from "./types";
import { HeroCenteredLayout } from "./shared";

export default function HeroCentered(props: HeroVariantProps) {
  return <HeroCenteredLayout {...props} minHeight="85vh" />;
}
