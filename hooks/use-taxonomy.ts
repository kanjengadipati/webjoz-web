"use client";

import { useEffect, useState } from "react";
import { getTaxonomy, type TaxonomyResponse } from "@/lib/api/ai";
import { BUSINESS_TYPES, SUB_TYPES } from "@/components/site-wizard/constants";
import type { BusinessTypeItem, SubTypeItem } from "@/components/site-wizard/types";

export interface UseTaxonomyResult {
  businessTypes: BusinessTypeItem[];
  subTypes: Record<string, SubTypeItem[]>;
  loading: boolean;
  error: Error | null;
}

export function useTaxonomy(lang = "id", region?: string): UseTaxonomyResult {
  const [businessTypes, setBusinessTypes] = useState<BusinessTypeItem[]>(BUSINESS_TYPES);
  const [subTypes, setSubTypes] = useState<Record<string, SubTypeItem[]>>(SUB_TYPES);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        const res: TaxonomyResponse = await getTaxonomy(lang, region);
        if (cancelled) return;

        if (res && Array.isArray(res.types) && res.types.length > 0) {
          const mergedTypes: BusinessTypeItem[] = res.types.map((t) => {
            const fallback = BUSINESS_TYPES.find((b) => b.value === t.value);
            return {
              value: t.value,
              emoji: fallback?.emoji ?? "✨",
              label: t.label || fallback?.label || t.value,
              desc: t.description || fallback?.desc || "",
              id: t.id,
            };
          });

          const mergedSubTypes: Record<string, SubTypeItem[]> = { ...SUB_TYPES };
          for (const t of res.types) {
            const fallbackList = SUB_TYPES[t.value] ?? [];
            const subList: SubTypeItem[] = (t.sub_types ?? []).map((st) => {
              const fallbackSub = fallbackList.find((s) => s.value === st.value);
              return {
                value: st.value,
                emoji: fallbackSub?.emoji ?? "🏷️",
                label: st.label || fallbackSub?.label || st.value,
                id: st.id,
                regions: st.regions,
              };
            });
            mergedSubTypes[t.value] = subList;
          }

          // Preserve legacy alias sub-types if any
          if (mergedSubTypes["Toko"]) {
            mergedSubTypes["Toko & UMKM"] = mergedSubTypes["Toko"];
            mergedSubTypes["Toko Online & Retail"] = mergedSubTypes["Toko"];
          }
          if (mergedSubTypes["Portofolio"]) {
            mergedSubTypes["Portofolio & Kreator"] = mergedSubTypes["Portofolio"];
          }
          if (mergedSubTypes["Layanan & Reservasi"]) {
            mergedSubTypes["Jasa & Booking"] = mergedSubTypes["Layanan & Reservasi"];
            mergedSubTypes["Jasa"] = mergedSubTypes["Layanan & Reservasi"];
          }

          setBusinessTypes(mergedTypes);
          setSubTypes(mergedSubTypes);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          // Keep fallback on error
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [lang, region]);

  return {
    businessTypes,
    subTypes,
    loading,
    error,
  };
}

