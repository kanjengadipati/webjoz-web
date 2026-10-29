import { request } from "@/lib/api/client";

export async function suggestSubdomains(businessName: string) {
  return request<{ suggestions: string[] }>("/ai/public/suggest-subdomains", {
    method: "POST",
    body: JSON.stringify({ business_name: businessName }),
  });
}

export type ProcessBusinessDescriptionResult = {
  refined_text: string;
  type?: string;
  sub_type?: string;
  type_id?: string;
  sub_type_id?: string;
  confidence?: "high" | "medium" | "low";
};

export async function processBusinessDescription(rawText: string, businessName?: string, language?: string) {
  // Normalize locale to 2-char ISO code: "id-ID" → "id", "en-US" → "en"
  const lang = (language || "id").split(/[-_]/)[0].toLowerCase();
  return request<ProcessBusinessDescriptionResult>("/ai/public/process-business-description", {
    method: "POST",
    body: JSON.stringify({
      raw_text: rawText,
      business_name: businessName || "",
      language: lang,
    }),
  });
}

// Backwards compatibility alias
export const refineTranscript = (transcript: string, businessName?: string, language?: string) =>
  processBusinessDescription(transcript, businessName, language);

export type TaxonomySubTypeItem = {
  id: string;
  value: string;
  label: string;
  regions?: string[];
};

export type TaxonomyTypeItem = {
  id: string;
  value: string;
  label: string;
  description: string;
  sub_types: TaxonomySubTypeItem[];
};

export type TaxonomyResponse = {
  version: number;
  lang: string;
  types: TaxonomyTypeItem[];
};

export async function getTaxonomy(lang = "id", region?: string): Promise<TaxonomyResponse> {
  const normLang = (lang || "id").split(/[-_]/)[0].toLowerCase();
  const params = new URLSearchParams({ lang: normLang });
  if (region && region.trim()) {
    params.set("region", region.trim());
  }
  const res = await request<TaxonomyResponse>(`/ai/public/taxonomy?${params.toString()}`);
  return res.data;
}
