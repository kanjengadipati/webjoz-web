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
