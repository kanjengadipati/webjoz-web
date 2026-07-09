"use client";
import React from "react";
import type { ComponentType } from "react";
import type { DesignToken, TemplateProps } from "../../templates/types";
import BenefitsClassic from "./classic";
import BenefitsStatGrid from "./stat-grid";
import BenefitsChecklist from "./checklist";
import BenefitsComparisonTable from "./comparison-table";

const variants: Record<string, ComponentType<{ benefits: TemplateProps["content"]["benefits"]; design_token?: DesignToken | null }>> = {
  grid: BenefitsClassic,
  "stat-grid": BenefitsStatGrid,
  checklist: BenefitsChecklist,
  "comparison-table": BenefitsComparisonTable,
};

export default function BenefitsSection({ benefits, design_token }: { benefits: TemplateProps["content"]["benefits"]; design_token?: DesignToken | null }) {
  const variant = design_token?.layout?.section_variants?.benefits ?? "grid";
  const Renderer = variants[variant] ?? BenefitsClassic;
  return <Renderer benefits={benefits} design_token={design_token} />;
}
