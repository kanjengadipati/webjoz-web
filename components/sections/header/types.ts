"use client";
import type { DesignToken } from "../../templates/types";

export interface HeaderVariantProps {
  header: {
    brand_name?: string;
    tagline?: string;
    logo_url?: string;
    icon?: string;
    nav_cta_text?: string;
    nav_cta_hidden?: boolean;
    nav_cta_href?: string;
  };
  design_token?: DesignToken | null;
  sectionOrder: string[];
  hiddenSections?: string[];
  navLinkClass?: string;
  drawerStyle?: React.CSSProperties;
  extraLinks?: { label: string; href: string }[];
  language?: "id" | "en";
}
