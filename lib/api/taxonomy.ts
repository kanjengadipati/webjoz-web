import { request } from "@/lib/api/client";
import type { ApiSuccessResponse } from "@/lib/types";

export interface TaxonomySubType {
  id: string;
  value: string;
  label: string;
  label_id: string;
  label_en: string;
  region?: string;
}

export interface TaxonomyType {
  id: string;
  value: string;
  label: string;
  label_id: string;
  label_en: string;
  desc: string;
  desc_id: string;
  desc_en: string;
  sub_types: TaxonomySubType[];
}

export interface TaxonomyResponse {
  lang: string;
  region: string;
  types: TaxonomyType[];
}

export interface ResolvedTaxonomy {
  type: string;
  sub_type: string;
  type_id: string;
  sub_type_id: string;
  type_label_id: string;
  type_label_en: string;
  sub_type_label_id: string;
  sub_type_label_en: string;
  region: string;
  type_known: boolean;
  sub_type_known: boolean;
  prompt_type_label: string;
  prompt_sub_type_label: string;
  prompt_label: string;
}

export async function fetchTaxonomy(
  lang: "id" | "en" = "id",
  region?: string
): Promise<TaxonomyResponse> {
  const params = new URLSearchParams({ lang });
  if (region) params.set("region", region);
  const resp = await request<TaxonomyResponse>(`/ai/public/taxonomy?${params.toString()}`);
  return resp.data;
}

export async function resolveTaxonomy(
  businessType: string,
  businessSubType: string,
  lang: "id" | "en" = "id"
): Promise<ResolvedTaxonomy> {
  const payload = {
    business_type: businessType,
    business_sub_type: businessSubType,
    language: lang,
  };
  const resp = await request<ResolvedTaxonomy>("/ai/public/resolve-taxonomy", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return resp.data;
}