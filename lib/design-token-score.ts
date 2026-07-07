/**
 * Shared design token scoring utilities.
 * Single source of truth — used by:
 *   - app/dashboard/admin/templates/page.tsx
 *   - app/template-gallery/preview/[id]/page.tsx
 *   - app/dashboard/admin/design-assets/page.tsx
 *
 * Mirrors the Go backend scoring logic in internal/modules/aisite/service.go.
 * Max score: 100 pts (Accessibility 40 + Completeness 30 + Palette 20 + Typography 10)
 */

export interface ScorePart {
  label: string;
  score: number;
  max: number;
}

export interface DesignTokenScore {
  total: number;
  parts: ScorePart[];
}

function luminance(hex: string): number {
  const c = hex.replace("#", "");
  if (c.length < 6) return 0;
  const r = parseInt(c.substring(0, 2), 16) / 255;
  const g = parseInt(c.substring(2, 4), 16) / 255;
  const b = parseInt(c.substring(4, 6), 16) / 255;
  const a = [r, g, b].map((v) =>
    v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
  );
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}

export function contrastRatio(c1: string, c2: string): number {
  const l1 = luminance(c1);
  const l2 = luminance(c2);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

export function isGrayish(hex: string): boolean {
  const h = hex.replace("#", "");
  if (h.length < 6) return true;
  const r = parseInt(h[0] + h[1], 16);
  const g = parseInt(h[2] + h[3], 16);
  const b = parseInt(h[4] + h[5], 16);
  return Math.max(Math.abs(r - g), Math.abs(r - b), Math.abs(g - b)) < 30;
}

export function scoreDesignToken(dt: any): DesignTokenScore {
  const parts: ScorePart[] = [];
  const pal = dt?.palette || {};
  const typo = dt?.typography || {};
  const layout = dt?.layout || {};

  const bg = pal.background || "";
  const text = pal.text || "";
  const primary = pal.primary || "";
  const accent = pal.accent || "";
  const surface = pal.surface || "";

  const cr = bg && text ? contrastRatio(text, bg) : 0;

  // ── Accessibility (40 pts) ──
  let acc = 0;
  if (text && bg) {
    if (cr >= 12) acc = 40;
    else if (cr >= 7) acc = 30 + Math.round(((cr - 7) / 5) * 10);
    else if (cr >= 4.5) acc = 20 + Math.round(((cr - 4.5) / 2.5) * 10);
    else acc = Math.round((cr / 4.5) * 20);
  }
  if (primary && text && contrastRatio(primary, text) >= 4.5) acc += 5;
  if (text && surface && contrastRatio(text, surface) >= 4.5) acc += 5;
  if (primary && bg && contrastRatio(primary, bg) >= 3) acc += 5;
  if (acc > 40) acc = 40;
  parts.push({ label: "Aksesibilitas", score: acc, max: 40 });

  // ── Completeness (30 pts) ──
  let complete = 0;
  const paletteKeys = ["primary", "accent", "background", "surface", "text"];
  const typoKeys = ["heading_font", "body_font", "heading_weight", "heading_size_hero"];
  const layoutKeys = ["section_spacing", "corner_radius"];
  for (const k of paletteKeys) if (pal[k]) complete++;
  for (const k of typoKeys) if (typo[k]) complete++;
  for (const k of layoutKeys) if (layout[k]) complete++;
  if (["compact", "normal", "relaxed"].includes(layout.section_spacing)) complete++;
  if (["sharp", "soft", "rounded"].includes(layout.corner_radius)) complete++;
  const totalFields = paletteKeys.length + typoKeys.length + layoutKeys.length + 2;
  parts.push({
    label: "Kelengkapan",
    score: Math.min(30, Math.round((complete / totalFields) * 30)),
    max: 30,
  });

  // ── Palette quality (20 pts) ──
  let pq = 0;
  if (primary && accent && primary !== accent) pq += 5;
  if (primary && bg && primary !== bg) pq += 3;
  if (surface && bg && surface !== bg) pq += 4;
  if (accent && bg && accent !== bg) pq += 3;
  if (primary && accent && (!isGrayish(primary) || !isGrayish(accent))) pq += 3;
  if (text && bg) {
    const bgLum = luminance(bg);
    const textLum = luminance(text);
    if ((bgLum > 0.5 && textLum < 0.5) || (bgLum < 0.5 && textLum > 0.5)) pq += 2;
  }
  parts.push({ label: "Palet", score: Math.min(20, pq), max: 20 });

  // ── Typography (10 pts) ──
  let rd = 0;
  const hf = typo.heading_font || "";
  const bf = typo.body_font || "";
  const hw = typo.heading_weight || "";
  const hs = typo.heading_size_hero || "";
  if (hf && !["inherit", "sans-serif"].includes(hf.toLowerCase())) rd += 3;
  if (bf && !["inherit", "serif"].includes(bf.toLowerCase())) rd += 2;
  if (["300", "400", "500", "600", "700", "800", "900"].includes(hw)) {
    const w = parseInt(hw, 10);
    rd += w >= 700 ? 3 : w >= 600 ? 2 : 1;
  }
  if (hs && !hs.startsWith("xs") && !hs.startsWith("sm")) rd += 2;
  if (hf && bf && hf.toLowerCase() !== bf.toLowerCase()) rd += 1;
  parts.push({ label: "Tipografi", score: Math.min(10, rd), max: 10 });

  return { total: parts.reduce((s, p) => s + p.score, 0), parts };
}

/** Returns a Tailwind color class string based on score thresholds */
export function scoreColorClass(score: number): string {
  if (score >= 80) return "text-green-500";
  if (score >= 60) return "text-yellow-500";
  if (score >= 40) return "text-orange-500";
  return "text-red-500";
}

/** Returns a Tailwind badge class string (bg + text + border) based on score */
export function scoreBadgeClass(score: number): string {
  if (score >= 80) return "bg-green-500/10 text-green-500 border-green-500/20";
  if (score >= 60) return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
  if (score >= 40) return "bg-orange-500/10 text-orange-500 border-orange-500/20";
  return "bg-red-500/10 text-red-500 border-red-500/20";
}
