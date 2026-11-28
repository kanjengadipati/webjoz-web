// Variant eligibility — pure helpers for the section variant picker.
//
// The API (GET /ai/public/variant-eligibility) says which variants suit the
// site's business. This module turns that into presentation: ordering, group
// chips and badges. It NEVER removes a variant — "less suited" ones stay
// selectable and keep their original group. The only dependency is the pure
// ID/EN translations module, so this stays testable with `node --test`.

import { translations, type Locale } from "./i18n/translations.ts";

export type EligibilityStatus = "fit" | "neutral" | "discouraged";

export interface EligibilityRow {
  variant: string;
  status: EligibilityStatus;
  reason?: string;
  min_images?: number;
  content_ready: boolean;
  manual_only?: boolean;
}

export interface EligibilityPayload {
  section: string;
  archetype?: string;
  resolved: boolean;
  tags_known: boolean;
  variants: EligibilityRow[];
}

export interface EligibilityView {
  status: EligibilityStatus;
  /** Images the variant needs when the site has fewer; 0 when fine or unknown. */
  needsImages: number;
  manualOnly: boolean;
}

const NEUTRAL_VIEW: EligibilityView = { status: "neutral", needsImages: 0, manualOnly: false };

/**
 * View model for one variant. `imageCount` < 0 or undefined means unknown.
 * The variant that is currently in use is never reported as "discouraged":
 * the AI (or the user) chose it, and the carve-outs the generator applies
 * (e.g. solo professionals keeping profile-cutout) are not all derivable here.
 */
export function viewFor(
  rows: ReadonlyMap<string, EligibilityRow> | null | undefined,
  variant: string,
  imageCount?: number,
  activeVariant?: string,
): EligibilityView {
  const row = rows?.get(variant);
  if (!row) return NEUTRAL_VIEW;
  const min = row.min_images ?? 0;
  const known = typeof imageCount === "number" && imageCount >= 0;
  let status = row.status;
  if (status === "discouraged" && variant === activeVariant) status = "neutral";
  return {
    status,
    needsImages: known && min > 0 && (imageCount as number) < min ? min : 0,
    manualOnly: Boolean(row.manual_only),
  };
}

const RANK: Record<EligibilityStatus, number> = { fit: 0, neutral: 1, discouraged: 2 };

/** Stable sort: suited first, less suited last. Neutral keeps catalog order. */
export function orderByEligibility<T extends { value: string }>(
  options: readonly T[],
  rows: ReadonlyMap<string, EligibilityRow> | null | undefined,
  imageCount?: number,
  activeVariant?: string,
): T[] {
  if (!rows || rows.size === 0) return [...options];
  return options
    .map((opt, index) => ({ opt, index, rank: RANK[viewFor(rows, opt.value, imageCount, activeVariant).status] }))
    .sort((a, b) => a.rank - b.rank || a.index - b.index)
    .map((x) => x.opt);
}

/**
 * Short badge texts for a card, most important first. Groups are never touched
 * (the panel's own chips like "Basic" / "Photo Visual" stay intact); fit is
 * conveyed by a badge plus sort order.
 */
export function eligibilityBadges(view: EligibilityView, locale?: Locale): string[] {
  const strings = translations[locale?.toLowerCase() === "en" ? "en" : "id"].dashboard.sitesEditor;
  const out: string[] = [];
  if (view.status === "fit") out.push(strings.variantFitBadge);
  if (view.status === "discouraged") out.push(strings.variantLessSuitedBadge);
  if (view.needsImages > 0) {
    out.push(strings.variantNeedsPhotosBadge.replace("{count}", String(view.needsImages)));
  }
  return out;
}

export function indexRows(payload: EligibilityPayload | null | undefined): Map<string, EligibilityRow> | null {
  if (!payload || !payload.resolved || !Array.isArray(payload.variants)) return null;
  return new Map(payload.variants.map((r) => [r.variant, r]));
}
