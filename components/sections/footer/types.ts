"use client";
import type { DesignToken } from "../../templates/types";

export interface FooterVariantProps {
  footer: {
    copyright_text?: string;
    tagline?: string;
    social_links?: Array<{ platform: string; url: string }>;
  };
  design_token?: DesignToken | null;
  brand_name?: string;
}
