import { request } from "@/lib/api/client";

export async function suggestSubdomains(businessName: string) {
  return request<{ suggestions: string[] }>("/ai/public/suggest-subdomains", {
    method: "POST",
    body: JSON.stringify({ business_name: businessName }),
  });
}
