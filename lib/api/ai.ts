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
  confidence?: string;
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

export const classifyBusiness = (businessName: string, description: string) =>
  processBusinessDescription(description, businessName);



