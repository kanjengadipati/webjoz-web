import type { DesignToken, TemplateProps } from "../../templates/types";

export interface HeroVariantProps {
  hero: TemplateProps["content"]["hero"];
  design_token?: DesignToken | null;
}
