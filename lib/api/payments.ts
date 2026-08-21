import { request } from "@/lib/api/client";

export interface PaymentResponse {
  id: number;
  order_id: string;
  tenant_id: number;
  reference_type: string;
  reference_id: string;
  amount: number;
  currency: string;
  status: string;
  gateway: string;
  transaction_time: string;
  created_at: string;
}

export interface ListPaymentsQuery {
  limit?: number;
  offset?: number;
}

export async function listPayments(query: ListPaymentsQuery = {}) {
  const params = new URLSearchParams();
  if (query.limit) params.append("limit", String(query.limit));
  if (query.offset) params.append("offset", String(query.offset));

  return request<PaymentResponse[]>(`/payments/admin?${params.toString()}`);
}

export async function forceUpdateStatus(
  paymentId: number,
  status: "paid" | "pending" | "failed",
  reason: string
) {
  return request<PaymentResponse>(
    `/payments/${paymentId}/force-status`,
    {
      method: "POST",
      body: JSON.stringify({ status, reason }),
    }
  );
}