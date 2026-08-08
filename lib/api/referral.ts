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
