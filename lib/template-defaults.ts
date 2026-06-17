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
        },
        layout: {
            hero_style: "centered",
            corner_radius: "rounded",
            section_spacing: "normal",
            section_order: ["hero", "about", "menu", "benefits", "testimonials", "cta", "faq", "contact"],
        },
        mood: "warm-earthy",
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
        },
        layout: {
            hero_style: "centered",
            corner_radius: "soft",
            section_spacing: "normal",
            section_order: ["hero", "benefits", "about", "testimonials", "cta", "faq", "contact"],
        },
        mood: "professional",
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
        },
        layout: {
            hero_style: "centered",
            corner_radius: "rounded",
            section_spacing: "normal",
            section_order: ["hero", "benefits", "catalog", "testimonials", "cta", "about", "faq", "contact"],
        },
        mood: "clean-modern",
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
        },
        layout: {
            hero_style: "full-bleed",
            corner_radius: "soft",
            section_spacing: "relaxed",
            section_order: ["hero", "about", "benefits", "testimonials", "cta", "faq", "contact"],
        },
        mood: "dark-premium",
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
        },
        layout: {
            hero_style: "split",
            corner_radius: "rounded",
            section_spacing: "relaxed",
            section_order: ["hero", "about", "benefits", "testimonials", "cta", "faq", "contact"],
        },
        mood: "warm-earthy",
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
        },
        layout: {
            hero_style: "centered",
            corner_radius: "rounded",
            section_spacing: "normal",
            section_order: ["hero", "benefits", "testimonials", "about", "cta", "faq", "contact"],
        },
        mood: "bold-vibrant",
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
        },
        layout: {
            hero_style: "minimal",
            corner_radius: "sharp",
            section_spacing: "relaxed",
            section_order: ["hero", "about", "benefits", "cta", "testimonials", "faq", "contact"],
        },
        mood: "clean-modern",
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
