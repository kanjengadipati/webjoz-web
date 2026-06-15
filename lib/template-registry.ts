import type React from "react";
import {
  type TemplateProps,
  type DesignToken,
  TemplateJasa,
  TemplateKuliner,
  TemplateProduk,
  TemplateDynamic,
  TemplateDynamicWithCart,
} from "@/components/templates";

export type { DesignToken };

export interface TemplateDefinition {
  id: string;
  name: string;
  category: string;
  description: string;
  accent: string;
  component: React.ComponentType<TemplateProps>;
  previewType: "brand" | "service" | "catalog" | "dynamic";
  tags: string[];
  isDynamic?: boolean;
}

export const TEMPLATE_REGISTRY: TemplateDefinition[] = [
  {
    id: "TEMPLATE_KULINER01",
    name: "Vista Prime",
    category: "Kuliner & Brand",
    description: "Hangat, storytelling premium. Ideal untuk kafe, restoran, dan brand kuliner lokal.",
    accent: "#D85A30",
    component: TemplateKuliner,
    previewType: "brand",
    tags: ["kuliner", "cafe", "kafe", "restoran", "makanan", "minuman", "warung"],
  },
  {
    id: "TEMPLATE_JASA02",
    name: "Elevate One",
    category: "Jasa & Konsultan",
    description: "Profesional dan trust-first. Cocok untuk jasa, konsultan, dan agency.",
    accent: "#4F46E5",
    component: TemplateJasa,
    previewType: "service",
    tags: ["jasa", "konsultan", "agency", "service", "profesional", "hukum", "akuntan"],
  },
  {
    id: "TEMPLATE_PRODUK03",
    name: "Forge Flow",
    category: "Produk & Katalog",
    description: "Bold dan modern. Cocok untuk produk fisik, UMKM, dan retail.",
    accent: "#0891B2",
    component: TemplateProduk,
    previewType: "catalog",
    tags: ["produk", "retail", "toko", "fashion", "elektronik", "umkm", "online"],
  },
  {
    id: "TEMPLATE_DYNAMIC",
    name: "AI Design Engine",
    category: "AI-Generated",
    description: "Tampilan unik yang dibuat khusus oleh AI untuk bisnis Anda. Warna, font, dan layout disesuaikan otomatis.",
    accent: "#7C3AED",
    component: TemplateDynamicWithCart,
    previewType: "dynamic",
    tags: [],
    isDynamic: true,
  },
];

export function getTemplate(id: string): TemplateDefinition | undefined {
  return TEMPLATE_REGISTRY.find((template) => template.id === id);
}

export function suggestTemplate(businessType: string): TemplateDefinition {
  const lower = businessType.toLowerCase();
  const match = TEMPLATE_REGISTRY.find((template) =>
    template.tags.some((tag) => lower.includes(tag))
  );

  return match ?? TEMPLATE_REGISTRY[0];
}
