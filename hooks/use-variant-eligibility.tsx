"use client";

import React, { useEffect, useState } from "react";
import { fetchVariantEligibility } from "@/lib/api/variant-eligibility";
import { indexRows, type EligibilityRow } from "@/lib/variant-eligibility";

/**
 * Business context for the variant picker. Provided once by whichever screen
 * hosts the canvas (dashboard editor today, public preview later). Without a
 * provider — or without archetype/industry — the picker behaves as before.
 */
export interface VariantEligibilityContextValue {
  archetype?: string;
  industryId?: string;
  entity?: string;
  /** Distinct hero images on the site; used for the "needs N photos" badge. */
  heroImageCount?: number;
}

const VariantEligibilityContext = React.createContext<VariantEligibilityContextValue | null>(null);
export const VariantEligibilityProvider = VariantEligibilityContext.Provider;

type Rows = Map<string, EligibilityRow> | null;

// One in-flight/settled request per query for the whole session.
const cache = new Map<string, Promise<Rows>>();

function load(section: string, ctx: VariantEligibilityContextValue): Promise<Rows> {
  const key = [section, ctx.industryId ?? "", ctx.archetype ?? "", ctx.entity ?? ""].join("|");
  let p = cache.get(key);
  if (!p) {
    p = fetchVariantEligibility({
      section,
      archetype: ctx.archetype,
      industryId: ctx.industryId,
      entity: ctx.entity,
    }).then(indexRows);
    cache.set(key, p);
    // Do not cache failures: allow a retry next time the picker opens.
    p.then((rows) => {
      if (rows === null) cache.delete(key);
    });
  }
  return p;
}

/**
 * Eligibility rows for one section, or null (unknown business, request not
 * finished, or request failed) — callers then show every variant unchanged.
 * Pass `enabled=false` to defer the request until the picker is opened.
 */
export function useVariantEligibility(
  section: string,
  enabled = true,
): { rows: Rows; heroImageCount?: number } {
  const ctx = React.useContext(VariantEligibilityContext);
  const [rows, setRows] = useState<Rows>(null);

  const archetype = ctx?.archetype;
  const industryId = ctx?.industryId;
  const entity = ctx?.entity;
  const inactive = !enabled || (!archetype && !industryId);

  useEffect(() => {
    if (inactive) return;
    let alive = true;
    load(section, { archetype, industryId, entity }).then((r) => {
      if (alive) setRows(r);
    });
    return () => {
      alive = false;
    };
  }, [section, inactive, archetype, industryId, entity]);

  // Tanpa konteks bisnis (atau sebelum picker dibuka) panggil tetap melihat
  // daftar varian apa adanya — tanpa perlu setState sinkron di dalam effect.
  return { rows: inactive ? null : rows, heroImageCount: ctx?.heroImageCount };
}
