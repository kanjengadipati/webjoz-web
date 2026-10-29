"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { fetchTaxonomy, TaxonomyResponse, TaxonomyType, TaxonomySubType } from "@/lib/api/taxonomy";
import { BUSINESS_TYPES, SUB_TYPES } from "@/components/site-wizard/constants";

export interface BusinessTypeItem {
  value: string;
  label: string;
  emoji?: string;
  desc?: string;
}

export interface SubTypeItem {
  value: string;
  label: string;
  emoji: string;
}

export function useTaxonomy(lang: "id" | "en" = "id", region?: string) {
  const [taxonomy, setTaxonomy] = useState<TaxonomyResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTaxonomy(lang, region);
      setTaxonomy(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load taxonomy");
    } finally {
      setLoading(false);
    }
  }, [lang, region]);

  useEffect(() => {
    load();
  }, [load]);

  const businessTypes = useMemo((): BusinessTypeItem[] => {
    if (!taxonomy || !Array.isArray(taxonomy.types) || taxonomy.types.length === 0) {
      return BUSINESS_TYPES;
    }
    return taxonomy.types.map((t) => {
      const fb = BUSINESS_TYPES.find((b) => b.value === t.value);
      return {
        value: t.value,
        label: t.label || fb?.label || t.value,
        emoji: fb?.emoji || "✨",
        desc: t.desc || fb?.desc || "",
      };
    });
  }, [taxonomy]);

  const subTypes = useMemo((): Record<string, SubTypeItem[]> => {
    if (!taxonomy || !Array.isArray(taxonomy.types) || taxonomy.types.length === 0) {
      return SUB_TYPES;
    }
    const result: Record<string, SubTypeItem[]> = { ...SUB_TYPES };
    for (const t of taxonomy.types) {
      const fbList = SUB_TYPES[t.value] ?? [];
      result[t.value] = t.sub_types.map((s) => {
        const fbSub = fbList.find((sub) => sub.value === s.value);
        return {
          value: s.value,
          label: s.label || fbSub?.label || s.value,
          emoji: fbSub?.emoji || "🏷️",
        };
      });
    }
    // Retain legacy type alias keys for backwards compatibility
    if (result["Toko"]) {
      result["Toko & UMKM"] = result["Toko"];
      result["Toko Online & Retail"] = result["Toko"];
    }
    if (result["Portofolio"]) {
      result["Portofolio & Kreator"] = result["Portofolio"];
    }
    if (result["Layanan & Reservasi"]) {
      result["Jasa & Booking"] = result["Layanan & Reservasi"];
      result["Jasa"] = result["Layanan & Reservasi"];
    }
    return result;
  }, [taxonomy]);

  const getType = useCallback(
    (typeId: string): TaxonomyType | undefined => {
      return taxonomy?.types.find((t) => t.id === typeId || t.value === typeId);
    },
    [taxonomy]
  );

  const getSubType = useCallback(
    (typeId: string, subTypeId: string): TaxonomySubType | undefined => {
      const type = getType(typeId);
      return type?.sub_types.find((s) => s.id === subTypeId || s.value === subTypeId);
    },
    [getType]
  );

  const getTypeLabel = useCallback(
    (typeId: string): string => {
      const type = getType(typeId);
      return type?.label || type?.value || typeId;
    },
    [getType]
  );

  const getSubTypeLabel = useCallback(
    (typeId: string, subTypeId: string): string => {
      const sub = getSubType(typeId, subTypeId);
      return sub?.label || sub?.value || subTypeId;
    },
    [getSubType]
  );

  const getAllSubTypes = useCallback(
    (typeId: string): TaxonomySubType[] => {
      const type = getType(typeId);
      return type?.sub_types || [];
    },
    [getType]
  );

  return {
    taxonomy,
    loading,
    error,
    reload: load,
    businessTypes,
    subTypes,
    getType,
    getSubType,
    getTypeLabel,
    getSubTypeLabel,
    getAllSubTypes,
    types: taxonomy?.types || [],
  };
}

export function useTaxonomyFlat(lang: "id" | "en" = "id", region?: string) {
  const { taxonomy, loading, error, reload } = useTaxonomy(lang, region);

  const flat = useMemo(() => {
    if (!taxonomy) return [];
    const result: Array<{
      typeId: string;
      typeValue: string;
      typeLabel: string;
      subTypeId: string;
      subTypeValue: string;
      subTypeLabel: string;
      region?: string;
    }> = [];
    for (const t of taxonomy.types) {
      for (const s of t.sub_types) {
        result.push({
          typeId: t.id,
          typeValue: t.value,
          typeLabel: t.label,
          subTypeId: s.id,
          subTypeValue: s.value,
          subTypeLabel: s.label,
          region: s.region,
        });
      }
    }
    return result;
  }, [taxonomy]);

  return { flat, loading, error, reload, taxonomy };
}