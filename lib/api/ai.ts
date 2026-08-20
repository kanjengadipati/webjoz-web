import { request } from "@/lib/api/client";

export async function suggestSubdomains(businessName: string) {
  return request<{ suggestions: string[] }>("/ai/public/suggest-subdomains", {
    method: "POST",
    body: JSON.stringify({ business_name: businessName }),
  });
}

export async function refineTranscript(transcript: string, businessName?: string, language?: string) {
  return request<{ refined_text: string }>("/ai/public/refine-transcript", {
    method: "POST",
    body: JSON.stringify({
      transcript,
      business_name: businessName || "",
      language: language || "id",
    }),
  });
}

export async function classifyBusiness(businessName: string, description: string) {
  return request<{ type: string; sub_type: string; confidence: string }>("/ai/public/classify-business", {
    method: "POST",
    body: JSON.stringify({
      business_name: businessName || "",
      description: description || "",
    }),
  });
}


