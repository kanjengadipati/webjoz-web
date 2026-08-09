import { request } from "@/lib/api/client";

export type CommissionStatus = "pending" | "voided";

export interface Commission {
  id: number;
  created_at: string;
  sales_user_id: number;
  tenant_id: number;
  payment_transaction_id: number;
  order_id: string;
  gross_amount: number;
  rate: number;
  tier: number;
  amount: number;
  status: CommissionStatus;
}

export interface CommissionSummary {
  total_earned: number;
  total_pending: number;
  total_voided: number;
}

export async function fetchMyCommissions(token: string, query?: URLSearchParams) {
  const queryString = query ? `?${query.toString()}` : "";
  return request<{ commissions: Commission[]; summary: CommissionSummary }>(
    `/commissions/me${queryString}`,
    { method: "GET" },
    token,
  );
}

export async function fetchAllCommissions(token: string, query?: URLSearchParams) {
  const queryString = query ? `?${query.toString()}` : "";
  return request<Commission[]>(`/commissions${queryString}`, { method: "GET" }, token);
}

export interface CommissionConfig {
  tier1_rate: number;
  tier1_rate_percent: number;
  tier2_rate: number;
  tier2_rate_percent: number;
  tier_threshold_months: number;
}

export async function getCommissionConfig(token: string) {
  return request<CommissionConfig>("/commissions/config", { method: "GET" }, token);
}

export async function updateCommissionConfig(
  token: string,
  tier1RatePercent: number,
  tier2RatePercent: number,
  tierThresholdMonths?: number,
) {
  const body: Record<string, number> = {
    tier1_rate_percent: tier1RatePercent,
    tier2_rate_percent: tier2RatePercent,
  };
  if (tierThresholdMonths != null) {
    body.tier_threshold_months = tierThresholdMonths;
  }
  return request<CommissionConfig>(
    "/commissions/config",
    { method: "PUT", body: JSON.stringify(body) },
    token,
  );
}
