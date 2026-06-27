import type React from "react";
import {
  type TemplateProps,
  type DesignToken,
  TemplateJasa,
  TemplateKuliner,
  TemplateProduk,
  TemplateDynamic,
  TemplateDynamicWithCart,
  TemplateElegant,
  TemplateNatural,
  TemplateColorful,
  TemplateMinimalist,
  TemplateBold,
  TemplateRetro,
  TemplateFuturistic,
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
  {
    id: "TEMPLATE_ELEGANT",
    name: "Noir Prestige",
    category: "Premium & Eksklusif",
    description: "Dark gold premium. Elegan, mewah, dan berkesan. Cocok untuk bisnis high-end, spa, fine dining, dan brand premium.",
    accent: "#C9A84C",
    component: TemplateElegant,
    previewType: "brand",
    tags: ["elegant", "mewah", "premium", "spa", "salon", "fine dining", "eksklusif", "luxury", "perhiasan", "butik"],
  },
  {
    id: "TEMPLATE_NATURAL",
    name: "Bumi Lestari",
    category: "Organik & Natural",
    description: "Earthy, hangat, dan organik. Ideal untuk produk lokal, pertanian, skincare alami, dan bisnis berbasis alam.",
    accent: "#3d5a45",
    component: TemplateNatural,
    previewType: "brand",
    tags: ["natural", "organik", "pertanian", "skincare", "herbal", "eco", "hijau", "tani", "kebun", "produk lokal"],
  },
  {
    id: "TEMPLATE_COLORFUL",
    name: "Pop Riot",
    category: "Bold & Playful",
    description: "Neo-brutalist, penuh warna, dan berenergi tinggi. Cocok untuk brand anak muda, toko online, bubble tea, dan bisnis yang ingin tampil beda.",
    accent: "#FF3CAC",
    component: TemplateColorful,
    previewType: "catalog",
    tags: ["colorful", "fun", "playful", "anak muda", "bubble tea", "jajanan", "streetfood", "tren", "viral", "fashion"],
  },
  {
    id: "TEMPLATE_MINIMALIST",
    name: "White Space",
    category: "Minimalis & Editorial",
    description: "Editorial, bersih, dan typografi besar. Cocok untuk portofolio, konsultan, fotografer, brand premium subtle, dan bisnis yang mengutamakan kesan profesional.",
    accent: "#18181B",
    component: TemplateMinimalist,
    previewType: "service",
    tags: ["minimalist", "editorial", "portfolio", "fotografer", "arsitektur", "konsultan", "desainer", "clean", "modern"],
  },
  {
    id: "TEMPLATE_BOLD",
    name: "Fire Force",
    category: "Bold & Tegas",
    description: "Agresif, high-contrast, penuh energi. Dark background dengan aksen merah menyala. Cocok untuk bengkel, gym, otomotif, dan brand yang ingin tampil kuat dan bertenaga.",
    accent: "#dc2626",
    component: TemplateBold,
    previewType: "service",
    tags: ["bold", "tegas", "bengkel", "otomotif", "gym", "olahraga", "kuat", "agresif", "hitam", "merah"],
  },
  {
    id: "TEMPLATE_RETRO",
    name: "Neon Wave",
    category: "Retro & Synthwave",
    description: "Synthwave neon, penuh karakter dan sedikit nakal. Cocok untuk brand kreatif, musik, kafe vintage, clothing, dan bisnis dengan jiwa nostalgia 80-90an.",
    accent: "#ff2a6d",
    component: TemplateRetro,
    previewType: "brand",
    tags: ["retro", "vintage", "synthwave", "musik", "kreatif", "nostalgia", "unik", "clothing", "seni", "nightlife"],
  },
  {
    id: "TEMPLATE_FUTURISTIC",
    name: "Cyber Core",
    category: "Futuristik & Teknologi",
    description: "Tech-forward, presisi, dan visioner. Dark UI bernuansa cyber. Cocok untuk startup teknologi, SaaS, AI, dan perusahaan inovasi digital.",
    accent: "#00d4ff",
    component: TemplateFuturistic,
    previewType: "service",
    tags: ["futuristic", "futuristik", "teknologi", "startup", "saas", "ai", "inovasi", "tech", "digital", "aplikasi", "gadget"],
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
