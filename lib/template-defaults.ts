import type { DesignToken } from "@/components/templates";

/**
 * Single source of truth for each static template's default design token.
 *
 * Used by:
 * - app/dashboard/sites/[id]/page.tsx → getTemplateDefaultDesignToken()
 *   (baseline merged with manual edits, and applied when a preset is picked)
 * - TemplateThumbnail previews in the template picker
 *
 * These values are kept in sync with the Go backend's
 * generateMockDesignToken() template-specific overrides in
 * internal/modules/aisite/service.go — if you change one, change both.
 */
export const TEMPLATE_DEFAULT_DESIGN_TOKENS: Record<string, DesignToken> = {
    TEMPLATE_KULINER01: {
        palette: {
            primary: "#78350F",
            accent: "#B45309",
            background: "#FAF7F2",
            surface: "#FFFFFF",
            text: "#2C2620",
        },
        typography: {
            heading_font: "Playfair Display",
            body_font: "Inter",
            heading_weight: "700",
            heading_size_hero: "3.5rem",
            heading_style: "normal",
            heading_transform: "none",
            heading_tracking: "normal",
        },
        layout: {
            hero_style: "centered",
            corner_radius: "rounded",
            section_spacing: "normal",
            section_order: ["hero", "about", "menu", "benefits", "testimonials", "gallery", "cta", "faq", "contact"],
        },
        mood: "warm-earthy",
        theme_mode: "light",
    },
    TEMPLATE_JASA02: {
        palette: {
            primary: "#4F46E5",
            accent: "#7C3AED",
            background: "#F8FAFC",
            surface: "#FFFFFF",
            text: "#0F172A",
        },
        typography: {
            heading_font: "Inter",
            body_font: "Inter",
            heading_weight: "700",
            heading_size_hero: "3rem",
            heading_style: "normal",
            heading_transform: "none",
            heading_tracking: "normal",
        },
        layout: {
            hero_style: "centered",
            corner_radius: "soft",
            section_spacing: "normal",
            section_order: ["hero", "benefits", "about", "testimonials", "gallery", "cta", "faq", "contact"],
        },
        mood: "professional",
        theme_mode: "light",
    },
    TEMPLATE_PRODUK03: {
        palette: {
            primary: "#0891B2",
            accent: "#14B8A6",
            background: "#F0FDFA",
            surface: "#FFFFFF",
            text: "#0D2623",
        },
        typography: {
            heading_font: "Outfit",
            body_font: "DM Sans",
            heading_weight: "700",
            heading_size_hero: "3.5rem",
            heading_style: "normal",
            heading_transform: "none",
            heading_tracking: "normal",
        },
        layout: {
            hero_style: "centered",
            corner_radius: "rounded",
            section_spacing: "normal",
            section_order: ["hero", "benefits", "catalog", "testimonials", "gallery", "cta", "about", "faq", "contact"],
        },
        mood: "clean-modern",
        theme_mode: "light",
    },
    TEMPLATE_ELEGANT: {
        palette: {
            primary: "#C9A84C",
            accent: "#A07830",
            background: "#0D0D0B",
            surface: "#1A1A17",
            text: "#F5F0E8",
        },
        typography: {
            heading_font: "Cormorant Garamond",
            body_font: "Lato",
            heading_weight: "700",
            heading_size_hero: "3.5rem",
            heading_style: "italic",
            heading_transform: "none",
            heading_tracking: "0.04em",
        },
        layout: {
            hero_style: "full-bleed",
            corner_radius: "soft",
            section_spacing: "relaxed",
            section_order: ["hero", "about", "benefits", "testimonials", "cta", "faq", "contact"],
        },
        mood: "dark-premium",
        theme_mode: "dark",
    },
    TEMPLATE_NATURAL: {
        palette: {
            primary: "#3D5A45",
            accent: "#A67C52",
            background: "#F5F0E8",
            surface: "#FDFAF4",
            text: "#2E251B",
        },
        typography: {
            heading_font: "Playfair Display",
            body_font: "Lato",
            heading_weight: "700",
            heading_size_hero: "3.5rem",
            heading_style: "normal",
            heading_transform: "none",
            heading_tracking: "normal",
        },
        layout: {
            hero_style: "split",
            corner_radius: "rounded",
            section_spacing: "relaxed",
            section_order: ["hero", "about", "benefits", "testimonials", "cta", "faq", "contact"],
        },
        mood: "warm-earthy",
        theme_mode: "light",
    },
    TEMPLATE_COLORFUL: {
        palette: {
            primary: "#FF3CAC",
            accent: "#FFE135",
            background: "#FFFBEB",
            surface: "#FFFFFF",
            text: "#0D0D0D",
        },
        typography: {
            heading_font: "Outfit",
            body_font: "Outfit",
            heading_weight: "900",
            heading_size_hero: "3.5rem",
            heading_style: "normal",
            heading_transform: "none",
            heading_tracking: "normal",
        },
        layout: {
            hero_style: "centered",
            corner_radius: "rounded",
            section_spacing: "normal",
            section_order: ["hero", "benefits", "testimonials", "about", "cta", "faq", "contact"],
        },
        mood: "bold-vibrant",
        theme_mode: "light",
    },
    TEMPLATE_MINIMALIST: {
        palette: {
            primary: "#18181B",
            accent: "#71717A",
            background: "#FAFAFA",
            surface: "#FFFFFF",
            text: "#18181B",
        },
        typography: {
            heading_font: "Inter",
            body_font: "Inter",
            heading_weight: "300",
            heading_size_hero: "3rem",
            heading_style: "normal",
            heading_transform: "none",
            heading_tracking: "normal",
        },
        layout: {
            hero_style: "minimal",
            corner_radius: "sharp",
            section_spacing: "relaxed",
            section_order: ["hero", "about", "benefits", "cta", "testimonials", "faq", "contact"],
        },
        mood: "clean-modern",
        theme_mode: "light",
    },
    TEMPLATE_BOLD: {
        palette: {
            primary: "#DC2626",
            accent: "#B91C1C",
            background: "#070504",
            surface: "#0D0907",
            text: "#F5F5F5",
        },
        typography: {
            heading_font: "Outfit",
            body_font: "Outfit",
            heading_weight: "900",
            heading_size_hero: "3.5rem",
            heading_style: "normal",
            heading_transform: "uppercase",
            heading_tracking: "normal",
        },
        layout: {
            hero_style: "full-bleed",
            corner_radius: "sharp",
            section_spacing: "normal",
            section_order: ["hero", "benefits", "testimonials", "cta", "about", "faq", "contact"],
        },
        mood: "bold-dark",
        theme_mode: "dark",
    },
    TEMPLATE_RETRO: {
        // Mirrors the hardcoded synthwave palette in components/templates/retro.tsx.
        // Note: retro.tsx does not currently consume `palette`/`typography` for
        // rendering (only layout.hidden_sections) — these values exist so the
        // template picker's preview swatch and "reset to default" look right.
        palette: {
            primary: "#FF2A6D",
            accent: "#05D9E8",
            background: "#120826",
            surface: "#1A0A30",
            text: "#F4EEFF",
        },
        typography: {
            heading_font: "Space Grotesk",
            body_font: "Inter",
            heading_weight: "800",
            heading_size_hero: "3.5rem",
            heading_style: "normal",
            heading_transform: "uppercase",
            heading_tracking: "0.05em",
        },
        layout: {
            hero_style: "full-bleed",
            corner_radius: "rounded",
            section_spacing: "normal",
            section_order: ["hero", "about", "testimonials", "benefits", "faq", "cta", "contact"],
        },
        mood: "retro",
        theme_mode: "dark",
    },
    TEMPLATE_FUTURISTIC: {
        // Mirrors the hardcoded cyber palette in components/templates/futuristic.tsx.
        // Same caveat as TEMPLATE_RETRO above re: palette/typography not being live-applied.
        palette: {
            primary: "#00D4FF",
            accent: "#0066FF",
            background: "#060D1A",
            surface: "#0A1530",
            text: "#E8F4FF",
        },
        typography: {
            heading_font: "Space Grotesk",
            body_font: "Inter",
            heading_weight: "700",
            heading_size_hero: "3.5rem",
            heading_style: "normal",
            heading_transform: "none",
            heading_tracking: "-0.03em",
        },
        layout: {
            hero_style: "centered",
            corner_radius: "soft",
            section_spacing: "normal",
            section_order: ["hero", "catalog", "benefits", "about", "testimonials", "faq", "cta", "contact"],
        },
        mood: "futuristic",
        theme_mode: "dark",
    },
};

/**
 * Returns the default design token for a given template id.
 * Falls back to TEMPLATE_JASA02's defaults for unknown/dynamic ids,
 * since that was the pre-existing generic fallback behavior.
 */
export function getTemplateDefaultDesignToken(templateId: string): DesignToken {
    return (
        TEMPLATE_DEFAULT_DESIGN_TOKENS[templateId] ??
        TEMPLATE_DEFAULT_DESIGN_TOKENS.TEMPLATE_JASA02
    );
}
