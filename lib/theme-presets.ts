/**
 * Theme Presets — static palette & font data per mood.
 *
 * Rules:
 * - Each mood has up to 6 named palettes and 3 font pairings.
 * - warm-earthy palette data is sourced from the design mockup.
 * - Other moods use coherent values derived from MOOD_OPTIONS palette seeds
 *   and existing TypographyPairing entries in builtin_assets.go.
 * - All palettes carry the full 5 keys: primary, accent, background, surface, text,
 *   plus theme_mode so they can be passed directly to applyNow().
 * - surface is explicitly included but will be overridden at runtime by deriveSurface()
 *   if only background is set without surface.
 *
 * TODO(design): Review and finalize palettes for moods other than warm-earthy.
 */

import type { ThemeOverrides } from "@/lib/theme-overrides";

export interface PalettePreset {
  id: string;
  name: string;
  nameEn: string;
  /** Array of 4 swatches for display: [bg, primary, accent, text] */
  swatches: [string, string, string, string];
  override: ThemeOverrides;
}

export interface FontPreset {
  id: string;
  name: string;
  nameEn: string;
  /** Heading font name shown in preview */
  heading: string;
  /** Body font name shown in preview */
  body: string;
  override: ThemeOverrides;
}

export interface MoodPresetData {
  palettes: PalettePreset[];
  fonts: FontPreset[];
}

// ─── Warm & Earthy (from design mockup) ─────────────────────────────────────

const WARM_EARTHY_PALETTES: PalettePreset[] = [
  {
    id: "daun-segar",
    name: "Daun Segar",
    nameEn: "Fresh Leaf",
    swatches: ["#F3EBDD", "#2F5D3A", "#D98E3F", "#1F2E23"],
    override: {
      palette: {
        primary: "#2F5D3A",
        accent: "#D98E3F",
        background: "#F3EBDD",
        surface: "#FFFFFF",
        text: "#1F2E23",
      },
      theme_mode: "light",
    },
  },
  {
    id: "tanah-hangat",
    name: "Tanah Hangat",
    nameEn: "Warm Earth",
    swatches: ["#F5E9D8", "#7A4B2A", "#4E6B3A", "#2E1E12"],
    override: {
      palette: {
        primary: "#7A4B2A",
        accent: "#4E6B3A",
        background: "#F5E9D8",
        surface: "#FFFFFF",
        text: "#2E1E12",
      },
      theme_mode: "light",
    },
  },
  {
    id: "madu-sage",
    name: "Madu & Sage",
    nameEn: "Honey & Sage",
    swatches: ["#FAF3E3", "#E0A23B", "#3F4A35", "#2A2010"],
    override: {
      palette: {
        primary: "#E0A23B",
        accent: "#3F4A35",
        background: "#FAF3E3",
        surface: "#FFFFFF",
        text: "#2A2010",
      },
      theme_mode: "light",
    },
  },
  {
    id: "terakota",
    name: "Terakota",
    nameEn: "Terracotta",
    swatches: ["#FBF1E4", "#B5532F", "#5B6B4A", "#2E1710"],
    override: {
      palette: {
        primary: "#B5532F",
        accent: "#5B6B4A",
        background: "#FBF1E4",
        surface: "#FFFFFF",
        text: "#2E1710",
      },
      theme_mode: "light",
    },
  },
  {
    id: "hutan-pagi",
    name: "Hutan Pagi",
    nameEn: "Morning Forest",
    swatches: ["#EEF3E8", "#1F4D45", "#E3B04B", "#102622"],
    override: {
      palette: {
        primary: "#1F4D45",
        accent: "#E3B04B",
        background: "#EEF3E8",
        surface: "#FFFFFF",
        text: "#102622",
      },
      theme_mode: "light",
    },
  },
  {
    id: "padi-emas",
    name: "Padi Emas",
    nameEn: "Golden Rice",
    swatches: ["#FFF8E7", "#C79A3A", "#6B3F22", "#2E2208"],
    override: {
      palette: {
        primary: "#C79A3A",
        accent: "#6B3F22",
        background: "#FFF8E7",
        surface: "#FFFFFF",
        text: "#2E2208",
      },
      theme_mode: "light",
    },
  },
];

const WARM_EARTHY_FONTS: FontPreset[] = [
  {
    id: "fraunces-organic",
    name: "Bawaan",
    nameEn: "Default",
    heading: "Fraunces",
    body: "Inter",
    override: {
      typography: {
        heading_font: "Fraunces",
        body_font: "Inter",
        heading_font_url: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,700&display=swap",
        body_font_url: "",
        heading_weight: "700",
        heading_size_hero: "3.5rem",
        heading_style: "normal",
        heading_transform: "none",
        heading_tracking: "-0.02em",
      },
    },
  },
  {
    id: "friendly-round",
    name: "Bersih",
    nameEn: "Clean",
    heading: "Poppins",
    body: "Poppins",
    override: {
      typography: {
        heading_font: "Poppins",
        body_font: "Poppins",
        heading_font_url: "https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap",
        body_font_url: "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500&display=swap",
        heading_weight: "700",
        heading_size_hero: "3.25rem",
        heading_style: "normal",
        heading_transform: "none",
        heading_tracking: "-0.01em",
      },
    },
  },
  {
    id: "editorial-elegance",
    name: "Klasik",
    nameEn: "Classic",
    heading: "Playfair Display",
    body: "Lato",
    override: {
      typography: {
        heading_font: "Playfair Display",
        body_font: "Lato",
        heading_font_url: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap",
        body_font_url: "https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap",
        heading_weight: "700",
        heading_size_hero: "3.5rem",
        heading_style: "normal",
        heading_transform: "none",
        heading_tracking: "0em",
      },
    },
  },
];

// ─── Clean Modern ─────────────────────────────────────────────────────────────

const CLEAN_MODERN_PALETTES: PalettePreset[] = [
  // TODO(design): finalize exact colors with design team
  {
    id: "cm-cloud",
    name: "Cloud",
    nameEn: "Cloud",
    swatches: ["#FFFFFF", "#2563EB", "#0EA5E9", "#0F172A"],
    override: {
      palette: { primary: "#2563EB", accent: "#0EA5E9", background: "#FFFFFF", surface: "#F8FAFC", text: "#0F172A" },
      theme_mode: "light",
    },
  },
  {
    id: "cm-slate",
    name: "Slate",
    nameEn: "Slate",
    swatches: ["#F8FAFC", "#334155", "#3B82F6", "#0F172A"],
    override: {
      palette: { primary: "#334155", accent: "#3B82F6", background: "#F8FAFC", surface: "#FFFFFF", text: "#0F172A" },
      theme_mode: "light",
    },
  },
  {
    id: "cm-indigo",
    name: "Indigo",
    nameEn: "Indigo",
    swatches: ["#EEF2FF", "#4F46E5", "#10B981", "#1E1B4B"],
    override: {
      palette: { primary: "#4F46E5", accent: "#10B981", background: "#EEF2FF", surface: "#FFFFFF", text: "#1E1B4B" },
      theme_mode: "light",
    },
  },
  {
    id: "cm-pearl",
    name: "Pearl",
    nameEn: "Pearl",
    swatches: ["#FAFAFA", "#1D4ED8", "#F59E0B", "#111827"],
    override: {
      palette: { primary: "#1D4ED8", accent: "#F59E0B", background: "#FAFAFA", surface: "#FFFFFF", text: "#111827" },
      theme_mode: "light",
    },
  },
  {
    id: "cm-teal",
    name: "Teal",
    nameEn: "Teal",
    swatches: ["#F0FDFA", "#0D9488", "#6366F1", "#134E4A"],
    override: {
      palette: { primary: "#0D9488", accent: "#6366F1", background: "#F0FDFA", surface: "#FFFFFF", text: "#134E4A" },
      theme_mode: "light",
    },
  },
  {
    id: "cm-sky",
    name: "Sky",
    nameEn: "Sky",
    swatches: ["#F0F9FF", "#0284C7", "#F97316", "#0C4A6E"],
    override: {
      palette: { primary: "#0284C7", accent: "#F97316", background: "#F0F9FF", surface: "#FFFFFF", text: "#0C4A6E" },
      theme_mode: "light",
    },
  },
];

const CLEAN_MODERN_FONTS: FontPreset[] = [
  {
    id: "tech-precision",
    name: "Modern",
    nameEn: "Modern",
    heading: "Space Grotesk",
    body: "Inter",
    override: {
      typography: {
        heading_font: "Space Grotesk",
        body_font: "Inter",
        heading_font_url: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700&display=swap",
        body_font_url: "",
        heading_weight: "700",
        heading_size_hero: "3.25rem",
        heading_style: "normal",
        heading_transform: "none",
        heading_tracking: "-0.02em",
      },
    },
  },
  {
    id: "minimal-dm",
    name: "Minimal",
    nameEn: "Minimal",
    heading: "DM Sans",
    body: "DM Sans",
    override: {
      typography: {
        heading_font: "DM Sans",
        body_font: "DM Sans",
        heading_font_url: "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700&display=swap",
        body_font_url: "",
        heading_weight: "600",
        heading_size_hero: "3rem",
        heading_style: "normal",
        heading_transform: "none",
        heading_tracking: "-0.015em",
      },
    },
  },
  {
    id: "pro-manrope",
    name: "Professional",
    nameEn: "Professional",
    heading: "Manrope",
    body: "Manrope",
    override: {
      typography: {
        heading_font: "Manrope",
        body_font: "Manrope",
        heading_font_url: "https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;800&display=swap",
        body_font_url: "",
        heading_weight: "800",
        heading_size_hero: "3.5rem",
        heading_style: "normal",
        heading_transform: "none",
        heading_tracking: "-0.025em",
      },
    },
  },
];

// ─── Bold Vibrant ─────────────────────────────────────────────────────────────

const BOLD_VIBRANT_PALETTES: PalettePreset[] = [
  {
    id: "bv-citrus",
    name: "Citrus",
    nameEn: "Citrus",
    swatches: ["#FFFBEB", "#F97316", "#8B5CF6", "#1C1917"],
    override: {
      palette: { primary: "#F97316", accent: "#8B5CF6", background: "#FFFBEB", surface: "#FFFFFF", text: "#1C1917" },
      theme_mode: "light",
    },
  },
  {
    id: "bv-pop",
    name: "Pop Art",
    nameEn: "Pop Art",
    swatches: ["#FFF7F7", "#EF4444", "#FBBF24", "#1F2937"],
    override: {
      palette: { primary: "#EF4444", accent: "#FBBF24", background: "#FFF7F7", surface: "#FFFFFF", text: "#1F2937" },
      theme_mode: "light",
    },
  },
  {
    id: "bv-candy",
    name: "Candy",
    nameEn: "Candy",
    swatches: ["#FDF4FF", "#C026D3", "#F97316", "#2D1B3D"],
    override: {
      palette: { primary: "#C026D3", accent: "#F97316", background: "#FDF4FF", surface: "#FFFFFF", text: "#2D1B3D" },
      theme_mode: "light",
    },
  },
  {
    id: "bv-lime",
    name: "Lime",
    nameEn: "Lime",
    swatches: ["#F7FEE7", "#65A30D", "#EA580C", "#1A2E05"],
    override: {
      palette: { primary: "#65A30D", accent: "#EA580C", background: "#F7FEE7", surface: "#FFFFFF", text: "#1A2E05" },
      theme_mode: "light",
    },
  },
  {
    id: "bv-aqua",
    name: "Aqua",
    nameEn: "Aqua",
    swatches: ["#ECFEFF", "#0891B2", "#F43F5E", "#083344"],
    override: {
      palette: { primary: "#0891B2", accent: "#F43F5E", background: "#ECFEFF", surface: "#FFFFFF", text: "#083344" },
      theme_mode: "light",
    },
  },
  {
    id: "bv-sunshine",
    name: "Sunshine",
    nameEn: "Sunshine",
    swatches: ["#FEFCE8", "#CA8A04", "#7C3AED", "#1C1507"],
    override: {
      palette: { primary: "#CA8A04", accent: "#7C3AED", background: "#FEFCE8", surface: "#FFFFFF", text: "#1C1507" },
      theme_mode: "light",
    },
  },
];

const BOLD_VIBRANT_FONTS: FontPreset[] = [
  {
    id: "fun-outfit",
    name: "Fun",
    nameEn: "Fun",
    heading: "Outfit",
    body: "Nunito",
    override: {
      typography: {
        heading_font: "Outfit",
        body_font: "Nunito",
        heading_font_url: "https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&display=swap",
        body_font_url: "https://fonts.googleapis.com/css2?family=Nunito:wght@400;600&display=swap",
        heading_weight: "900",
        heading_size_hero: "3.5rem",
        heading_style: "normal",
        heading_transform: "none",
        heading_tracking: "-0.015em",
      },
    },
  },
  {
    id: "round-nunito",
    name: "Ramah",
    nameEn: "Friendly",
    heading: "Nunito",
    body: "Nunito",
    override: {
      typography: {
        heading_font: "Nunito",
        body_font: "Nunito",
        heading_font_url: "https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&display=swap",
        body_font_url: "",
        heading_weight: "800",
        heading_size_hero: "3.25rem",
        heading_style: "normal",
        heading_transform: "none",
        heading_tracking: "0em",
      },
    },
  },
  {
    id: "bold-rubik",
    name: "Tegas",
    nameEn: "Bold",
    heading: "Rubik",
    body: "Rubik",
    override: {
      typography: {
        heading_font: "Rubik",
        body_font: "Rubik",
        heading_font_url: "https://fonts.googleapis.com/css2?family=Rubik:wght@400;700;900&display=swap",
        body_font_url: "",
        heading_weight: "900",
        heading_size_hero: "3.5rem",
        heading_style: "normal",
        heading_transform: "uppercase",
        heading_tracking: "-0.01em",
      },
    },
  },
];

// ─── Dark Premium ─────────────────────────────────────────────────────────────

const DARK_PREMIUM_PALETTES: PalettePreset[] = [
  {
    id: "dp-gold",
    name: "Gold Noir",
    nameEn: "Gold Noir",
    swatches: ["#0D0D0B", "#D4AF37", "#8B7536", "#F5F0E8"],
    override: {
      palette: { primary: "#D4AF37", accent: "#8B7536", background: "#0D0D0B", surface: "#18180f", text: "#F5F0E8" },
      theme_mode: "dark",
    },
  },
  {
    id: "dp-platinum",
    name: "Platinum",
    nameEn: "Platinum",
    swatches: ["#111111", "#E8E8E8", "#9CA3AF", "#F9FAFB"],
    override: {
      palette: { primary: "#E8E8E8", accent: "#9CA3AF", background: "#111111", surface: "#1C1C1C", text: "#F9FAFB" },
      theme_mode: "dark",
    },
  },
  {
    id: "dp-rose-noir",
    name: "Rose Noir",
    nameEn: "Rose Noir",
    swatches: ["#120808", "#C2185B", "#E91E63", "#FFF0F3"],
    override: {
      palette: { primary: "#C2185B", accent: "#E91E63", background: "#120808", surface: "#1E0E12", text: "#FFF0F3" },
      theme_mode: "dark",
    },
  },
  {
    id: "dp-navy-gold",
    name: "Navy Gold",
    nameEn: "Navy Gold",
    swatches: ["#060B18", "#C9A227", "#1A3A5C", "#F0F4FF"],
    override: {
      palette: { primary: "#C9A227", accent: "#1A3A5C", background: "#060B18", surface: "#0E1826", text: "#F0F4FF" },
      theme_mode: "dark",
    },
  },
  {
    id: "dp-emerald",
    name: "Emerald",
    nameEn: "Emerald",
    swatches: ["#060E0B", "#10B981", "#6EE7B7", "#ECFDF5"],
    override: {
      palette: { primary: "#10B981", accent: "#6EE7B7", background: "#060E0B", surface: "#0E1A14", text: "#ECFDF5" },
      theme_mode: "dark",
    },
  },
  {
    id: "dp-copper",
    name: "Copper",
    nameEn: "Copper",
    swatches: ["#120C07", "#B87333", "#7C4F1E", "#FFF8F0"],
    override: {
      palette: { primary: "#B87333", accent: "#7C4F1E", background: "#120C07", surface: "#1E130A", text: "#FFF8F0" },
      theme_mode: "dark",
    },
  },
];

const DARK_PREMIUM_FONTS: FontPreset[] = [
  {
    id: "luxury-cormorant",
    name: "Luxury",
    nameEn: "Luxury",
    heading: "Cormorant Garamond",
    body: "Jost",
    override: {
      typography: {
        heading_font: "Cormorant Garamond",
        body_font: "Jost",
        heading_font_url: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&display=swap",
        body_font_url: "https://fonts.googleapis.com/css2?family=Jost:wght@300;400&display=swap",
        heading_weight: "600",
        heading_size_hero: "4rem",
        heading_style: "italic",
        heading_transform: "none",
        heading_tracking: "0.01em",
      },
    },
  },
  {
    id: "editorial-playfair",
    name: "Editorial",
    nameEn: "Editorial",
    heading: "Playfair Display",
    body: "Lato",
    override: {
      typography: {
        heading_font: "Playfair Display",
        body_font: "Lato",
        heading_font_url: "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&display=swap",
        body_font_url: "https://fonts.googleapis.com/css2?family=Lato:wght@300;400&display=swap",
        heading_weight: "700",
        heading_size_hero: "3.75rem",
        heading_style: "normal",
        heading_transform: "none",
        heading_tracking: "0em",
      },
    },
  },
  {
    id: "minimal-dm-dark",
    name: "Minimal",
    nameEn: "Minimal",
    heading: "DM Serif Display",
    body: "DM Sans",
    override: {
      typography: {
        heading_font: "DM Serif Display",
        body_font: "DM Sans",
        heading_font_url: "https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&display=swap",
        body_font_url: "https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400&display=swap",
        heading_weight: "400",
        heading_size_hero: "3.75rem",
        heading_style: "normal",
        heading_transform: "none",
        heading_tracking: "-0.01em",
      },
    },
  },
];

// ─── Bold Dark ────────────────────────────────────────────────────────────────

const BOLD_DARK_PALETTES: PalettePreset[] = [
  {
    id: "bd-fire",
    name: "Fire",
    nameEn: "Fire",
    swatches: ["#0A0A0A", "#E63946", "#F4A261", "#F8F9FA"],
    override: {
      palette: { primary: "#E63946", accent: "#F4A261", background: "#0A0A0A", surface: "#141414", text: "#F8F9FA" },
      theme_mode: "dark",
    },
  },
  {
    id: "bd-thunder",
    name: "Thunder",
    nameEn: "Thunder",
    swatches: ["#060606", "#FFEB3B", "#FF9800", "#FAFAFA"],
    override: {
      palette: { primary: "#FFEB3B", accent: "#FF9800", background: "#060606", surface: "#111111", text: "#FAFAFA" },
      theme_mode: "dark",
    },
  },
  {
    id: "bd-neon-green",
    name: "Neon",
    nameEn: "Neon",
    swatches: ["#0A0F0A", "#22C55E", "#15803D", "#F0FFF4"],
    override: {
      palette: { primary: "#22C55E", accent: "#15803D", background: "#0A0F0A", surface: "#121A12", text: "#F0FFF4" },
      theme_mode: "dark",
    },
  },
  {
    id: "bd-chrome",
    name: "Chrome",
    nameEn: "Chrome",
    swatches: ["#080808", "#D1D5DB", "#6B7280", "#F9FAFB"],
    override: {
      palette: { primary: "#D1D5DB", accent: "#6B7280", background: "#080808", surface: "#131313", text: "#F9FAFB" },
      theme_mode: "dark",
    },
  },
  {
    id: "bd-cobalt",
    name: "Cobalt",
    nameEn: "Cobalt",
    swatches: ["#060A14", "#3B82F6", "#93C5FD", "#EFF6FF"],
    override: {
      palette: { primary: "#3B82F6", accent: "#93C5FD", background: "#060A14", surface: "#0F1727", text: "#EFF6FF" },
      theme_mode: "dark",
    },
  },
  {
    id: "bd-scarlet",
    name: "Scarlet",
    nameEn: "Scarlet",
    swatches: ["#0C0000", "#DC2626", "#7F1D1D", "#FEF2F2"],
    override: {
      palette: { primary: "#DC2626", accent: "#7F1D1D", background: "#0C0000", surface: "#180808", text: "#FEF2F2" },
      theme_mode: "dark",
    },
  },
];

const BOLD_DARK_FONTS: FontPreset[] = [
  {
    id: "power-oswald",
    name: "Power",
    nameEn: "Power",
    heading: "Oswald",
    body: "Barlow",
    override: {
      typography: {
        heading_font: "Oswald",
        body_font: "Barlow",
        heading_font_url: "https://fonts.googleapis.com/css2?family=Oswald:wght@400;700&display=swap",
        body_font_url: "https://fonts.googleapis.com/css2?family=Barlow:wght@400;600&display=swap",
        heading_weight: "700",
        heading_size_hero: "3.75rem",
        heading_style: "normal",
        heading_transform: "uppercase",
        heading_tracking: "0.05em",
      },
    },
  },
  {
    id: "impact-barlow",
    name: "Impact",
    nameEn: "Impact",
    heading: "Barlow Condensed",
    body: "Barlow",
    override: {
      typography: {
        heading_font: "Barlow Condensed",
        body_font: "Barlow",
        heading_font_url: "https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;700;900&display=swap",
        body_font_url: "https://fonts.googleapis.com/css2?family=Barlow:wght@400;500&display=swap",
        heading_weight: "900",
        heading_size_hero: "4rem",
        heading_style: "normal",
        heading_transform: "uppercase",
        heading_tracking: "0.02em",
      },
    },
  },
  {
    id: "urban-rajdhani",
    name: "Urban",
    nameEn: "Urban",
    heading: "Rajdhani",
    body: "Exo 2",
    override: {
      typography: {
        heading_font: "Rajdhani",
        body_font: "Exo 2",
        heading_font_url: "https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;700&display=swap",
        body_font_url: "https://fonts.googleapis.com/css2?family=Exo+2:wght@400;500&display=swap",
        heading_weight: "700",
        heading_size_hero: "3.5rem",
        heading_style: "normal",
        heading_transform: "uppercase",
        heading_tracking: "0.04em",
      },
    },
  },
];

// ─── Retro ────────────────────────────────────────────────────────────────────

const RETRO_PALETTES: PalettePreset[] = [
  {
    id: "rt-cream",
    name: "Cream",
    nameEn: "Cream",
    swatches: ["#EFE6D5", "#8B4513", "#D97706", "#2C1810"],
    override: {
      palette: { primary: "#8B4513", accent: "#D97706", background: "#EFE6D5", surface: "#F5EFE0", text: "#2C1810" },
      theme_mode: "light",
    },
  },
  {
    id: "rt-mustard",
    name: "Mustard",
    nameEn: "Mustard",
    swatches: ["#FEF3C7", "#B45309", "#6B2D0E", "#1C0F05"],
    override: {
      palette: { primary: "#B45309", accent: "#6B2D0E", background: "#FEF3C7", surface: "#FFFFFF", text: "#1C0F05" },
      theme_mode: "light",
    },
  },
  {
    id: "rt-sage",
    name: "Sage Green",
    nameEn: "Sage Green",
    swatches: ["#F0EDE0", "#4A5E4A", "#8B4513", "#1A2A1A"],
    override: {
      palette: { primary: "#4A5E4A", accent: "#8B4513", background: "#F0EDE0", surface: "#F8F5EC", text: "#1A2A1A" },
      theme_mode: "light",
    },
  },
  {
    id: "rt-navy",
    name: "Navy Rust",
    nameEn: "Navy Rust",
    swatches: ["#EDE8E0", "#1B2A4A", "#C0392B", "#0D1520"],
    override: {
      palette: { primary: "#1B2A4A", accent: "#C0392B", background: "#EDE8E0", surface: "#F5F1E8", text: "#0D1520" },
      theme_mode: "light",
    },
  },
  {
    id: "rt-terracotta-dark",
    name: "Terra Vintage",
    nameEn: "Terra Vintage",
    swatches: ["#F2E8D9", "#7B3F20", "#5B6B4A", "#1C0C06"],
    override: {
      palette: { primary: "#7B3F20", accent: "#5B6B4A", background: "#F2E8D9", surface: "#FFFFFF", text: "#1C0C06" },
      theme_mode: "light",
    },
  },
  {
    id: "rt-teal-copper",
    name: "Teal Copper",
    nameEn: "Teal Copper",
    swatches: ["#EAF0ED", "#2D6A5A", "#B87333", "#0A1F1A"],
    override: {
      palette: { primary: "#2D6A5A", accent: "#B87333", background: "#EAF0ED", surface: "#FFFFFF", text: "#0A1F1A" },
      theme_mode: "light",
    },
  },
];

const RETRO_FONTS: FontPreset[] = [
  {
    id: "serif-merriweather",
    name: "Klasik",
    nameEn: "Classic",
    heading: "Merriweather",
    body: "Source Serif 4",
    override: {
      typography: {
        heading_font: "Merriweather",
        body_font: "Source Serif 4",
        heading_font_url: "https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700;900&display=swap",
        body_font_url: "https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@400;600&display=swap",
        heading_weight: "900",
        heading_size_hero: "3.5rem",
        heading_style: "normal",
        heading_transform: "none",
        heading_tracking: "-0.01em",
      },
    },
  },
  {
    id: "retro-lora",
    name: "Vintage",
    nameEn: "Vintage",
    heading: "Lora",
    body: "PT Serif",
    override: {
      typography: {
        heading_font: "Lora",
        body_font: "PT Serif",
        heading_font_url: "https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,700;1,400&display=swap",
        body_font_url: "https://fonts.googleapis.com/css2?family=PT+Serif:wght@400;700&display=swap",
        heading_weight: "700",
        heading_size_hero: "3.5rem",
        heading_style: "italic",
        heading_transform: "none",
        heading_tracking: "0.01em",
      },
    },
  },
  {
    id: "artisan-libre",
    name: "Artisan",
    nameEn: "Artisan",
    heading: "Libre Baskerville",
    body: "Crimson Text",
    override: {
      typography: {
        heading_font: "Libre Baskerville",
        body_font: "Crimson Text",
        heading_font_url: "https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&display=swap",
        body_font_url: "https://fonts.googleapis.com/css2?family=Crimson+Text:wght@400;600&display=swap",
        heading_weight: "700",
        heading_size_hero: "3.5rem",
        heading_style: "normal",
        heading_transform: "none",
        heading_tracking: "0.015em",
      },
    },
  },
];

// ─── Futuristic ───────────────────────────────────────────────────────────────

const FUTURISTIC_PALETTES: PalettePreset[] = [
  {
    id: "ft-cyber",
    name: "Cyber",
    nameEn: "Cyber",
    swatches: ["#0B0F19", "#06B6D4", "#A855F7", "#E0F2FE"],
    override: {
      palette: { primary: "#06B6D4", accent: "#A855F7", background: "#0B0F19", surface: "#111827", text: "#E0F2FE" },
      theme_mode: "dark",
    },
  },
  {
    id: "ft-matrix",
    name: "Matrix",
    nameEn: "Matrix",
    swatches: ["#030D0E", "#00FF41", "#007F21", "#E8FFE8"],
    override: {
      palette: { primary: "#00FF41", accent: "#007F21", background: "#030D0E", surface: "#071210", text: "#E8FFE8" },
      theme_mode: "dark",
    },
  },
  {
    id: "ft-aurora",
    name: "Aurora",
    nameEn: "Aurora",
    swatches: ["#060815", "#7C3AED", "#06B6D4", "#F0E6FF"],
    override: {
      palette: { primary: "#7C3AED", accent: "#06B6D4", background: "#060815", surface: "#0E1230", text: "#F0E6FF" },
      theme_mode: "dark",
    },
  },
  {
    id: "ft-titanium",
    name: "Titanium",
    nameEn: "Titanium",
    swatches: ["#0A0A0E", "#6366F1", "#A5B4FC", "#EEF2FF"],
    override: {
      palette: { primary: "#6366F1", accent: "#A5B4FC", background: "#0A0A0E", surface: "#141420", text: "#EEF2FF" },
      theme_mode: "dark",
    },
  },
  {
    id: "ft-neon-orange",
    name: "Neon Orange",
    nameEn: "Neon Orange",
    swatches: ["#080808", "#F97316", "#0EA5E9", "#FFF7ED"],
    override: {
      palette: { primary: "#F97316", accent: "#0EA5E9", background: "#080808", surface: "#131313", text: "#FFF7ED" },
      theme_mode: "dark",
    },
  },
  {
    id: "ft-ice",
    name: "Ice",
    nameEn: "Ice",
    swatches: ["#060A12", "#38BDF8", "#F0F9FF", "#E0F2FE"],
    override: {
      palette: { primary: "#38BDF8", accent: "#F0F9FF", background: "#060A12", surface: "#0C1627", text: "#E0F2FE" },
      theme_mode: "dark",
    },
  },
];

const FUTURISTIC_FONTS: FontPreset[] = [
  {
    id: "tech-jakarta",
    name: "Tech",
    nameEn: "Tech",
    heading: "Plus Jakarta Sans",
    body: "Inter",
    override: {
      typography: {
        heading_font: "Plus Jakarta Sans",
        body_font: "Inter",
        heading_font_url: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;700;800&display=swap",
        body_font_url: "",
        heading_weight: "800",
        heading_size_hero: "3.5rem",
        heading_style: "normal",
        heading_transform: "none",
        heading_tracking: "-0.02em",
      },
    },
  },
  {
    id: "mono-code",
    name: "Code",
    nameEn: "Code",
    heading: "Space Grotesk",
    body: "JetBrains Mono",
    override: {
      typography: {
        heading_font: "Space Grotesk",
        body_font: "JetBrains Mono",
        heading_font_url: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700&display=swap",
        body_font_url: "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap",
        heading_weight: "700",
        heading_size_hero: "3.25rem",
        heading_style: "normal",
        heading_transform: "none",
        heading_tracking: "-0.015em",
      },
    },
  },
  {
    id: "futurist-exo",
    name: "Futurist",
    nameEn: "Futurist",
    heading: "Exo 2",
    body: "Exo 2",
    override: {
      typography: {
        heading_font: "Exo 2",
        body_font: "Exo 2",
        heading_font_url: "https://fonts.googleapis.com/css2?family=Exo+2:wght@400;700;900&display=swap",
        body_font_url: "",
        heading_weight: "900",
        heading_size_hero: "3.75rem",
        heading_style: "italic",
        heading_transform: "uppercase",
        heading_tracking: "0.05em",
      },
    },
  },
];

// ─── THEME_PRESETS export ─────────────────────────────────────────────────────

export const THEME_PRESETS: Record<string, MoodPresetData> = {
  "clean-modern": { palettes: CLEAN_MODERN_PALETTES, fonts: CLEAN_MODERN_FONTS },
  "warm-earthy": { palettes: WARM_EARTHY_PALETTES, fonts: WARM_EARTHY_FONTS },
  "bold-vibrant": { palettes: BOLD_VIBRANT_PALETTES, fonts: BOLD_VIBRANT_FONTS },
  "dark-premium": { palettes: DARK_PREMIUM_PALETTES, fonts: DARK_PREMIUM_FONTS },
  "bold-dark": { palettes: BOLD_DARK_PALETTES, fonts: BOLD_DARK_FONTS },
  retro: { palettes: RETRO_PALETTES, fonts: RETRO_FONTS },
  futuristic: { palettes: FUTURISTIC_PALETTES, fonts: FUTURISTIC_FONTS },
};

/**
 * Returns true if the applied ThemeOverrides matches the given PalettePreset exactly
 * (all 5 palette keys + theme_mode match).
 */
export function isPaletteApplied(
  preset: PalettePreset,
  applied: ThemeOverrides
): boolean {
  const p = preset.override.palette;
  const a = applied.palette;
  if (!p || !a) return false;
  const eq = (x?: string, y?: string) =>
    (x || "").trim().toLowerCase() === (y || "").trim().toLowerCase();
  const paletteMatches =
    eq(a.primary, p.primary) &&
    eq(a.accent, p.accent) &&
    eq(a.background, p.background) &&
    eq(a.text, p.text);
  if (!paletteMatches) return false;
  if (applied.theme_mode && preset.override.theme_mode) {
    return applied.theme_mode === preset.override.theme_mode;
  }
  return true;
}

/**
 * Returns true if the applied ThemeOverrides matches the given FontPreset
 * (heading_font + body_font match).
 */
export function isFontApplied(
  preset: FontPreset,
  applied: ThemeOverrides
): boolean {
  const p = preset.override.typography;
  const a = applied.typography;
  if (!p || !a) return false;
  return a.heading_font === p.heading_font && a.body_font === p.body_font;
}

/**
 * Returns the preset data for the current mood, falling back to clean-modern.
 */
export function getPresets(mood: string): MoodPresetData {
  return THEME_PRESETS[mood] ?? THEME_PRESETS["clean-modern"];
}

