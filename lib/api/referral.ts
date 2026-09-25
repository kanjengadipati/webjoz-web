import { request } from "@/lib/api/client";

export async function fetchMyReferralCode(token: string) {
  return request<{ referral_code: string }>("/auth/referral-code", { method: "GET" }, token);
}

export async function regenerateMyReferralCode(token: string) {
  return request<{ referral_code: string }>(
    "/auth/referral-code/regenerate",
    { method: "POST" },
    token,
  );
}

export async function sendReferralEmail(email: string, token: string, language?: string) {
  return request<{ email: string }>(
    "/auth/referral/email",
    { method: "POST", body: JSON.stringify({ email, language }) },
    token,
  );
}
