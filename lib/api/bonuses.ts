import { request } from "@/lib/api/client";

export type BonusType = "onboarding" | "milestone";
export type BonusStatus = "pending" | "voided" | "paid";

export interface SalesBonus {
  id: number;
  created_at: string;
  sales_user_id: number;
  type: BonusType;
  tenant_id?: number;
  period?: string;
  tier?: number;
  amount: number;
  status: BonusStatus;
}

export interface BonusSummary {
  total_earned: number;
  total_pending: number;
  total_voided: number;
  total_paid: number;
  onboarding_count: number;
  milestone_count: number;
}

export interface BonusRule {
  id: number;
  created_at: string;
  type: BonusType;
  tier?: number;
  threshold?: number;
  amount: number;
  is_active: boolean;
  effective_from: string;
  effective_until?: string;
}

export async function fetchMyBonuses(token: string, query?: URLSearchParams) {
  const queryString = query ? `?${query.toString()}` : "";
  return request<{ bonuses: SalesBonus[]; summary: BonusSummary }>(
    `/bonuses/me${queryString}`,
    { method: "GET" },
    token
  );
}

export async function fetchAllBonuses(token: string, query?: URLSearchParams) {
  const queryString = query ? `?${query.toString()}` : "";
  return request<SalesBonus[]>(`/bonuses${queryString}`, { method: "GET" }, token);
}

export async function fetchBonusRules(token: string) {
  return request<BonusRule[]>("/bonuses/rules", { method: "GET" }, token);
}

export async function createBonusRule(
  token: string,
  rule: { type: BonusType; tier?: number; threshold?: number; amount: number }
) {
  return request<BonusRule>(
    "/bonuses/rules",
    { method: "POST", body: JSON.stringify(rule) },
    token
  );
}

export async function updateBonusRule(
  token: string,
  id: number,
  rule: { tier?: number; threshold?: number; amount?: number; is_active?: boolean }
) {
  return request<BonusRule>(
    `/bonuses/rules/${id}`,
    { method: "PUT", body: JSON.stringify(rule) },
    token
  );
}

export async function deleteBonusRule(token: string, id: number) {
  return request<null>(`/bonuses/rules/${id}`, { method: "DELETE" }, token);
}
