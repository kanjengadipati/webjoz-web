import { request } from "@/lib/api/client";

export interface PaymentResponse {
  id: number;
  order_id: string;
  tenant_id: number;
  plan_id?: number;
  reference_type: string;
  reference_id: string;
  gross_amount: number;
  amount: number;
  currency: string;
  billing_cycle: string;
  status: string;
  payment_method: string;
  gateway: string;
  transaction_time: string;
  discount_amount: number;
  created_at: string;
}

export interface InvoiceResponse {
  id: number;
  payment_id: number;
  invoice_id: string;
  amount: number;
  currency: string;
  status: string;
  description: string;
  email: string;
  pdf_url: string;
  email_sent: boolean;
  due_date: string;
  paid_at: string;
  created_at: string;
}

export interface PaginationMeta {
  total: number;
  limit: number;
  page: number;
  total_pages: number;
}

export interface ListPaymentsQuery {
  limit?: number;
  offset?: number;
  status?: string;
  gateway?: string;
  search?: string;
}

export async function listMyTransactions(query: ListPaymentsQuery = {}, token: string) {
  const params = new URLSearchParams();
  if (query.limit) params.append("limit", String(query.limit));
  if (query.offset) params.append("offset", String(query.offset));
  return request<PaymentResponse[]>(`/payments?${params.toString()}`, {}, token);
}

export async function listMyInvoices(query: { limit?: number; offset?: number } = {}, token: string) {
  const params = new URLSearchParams();
  if (query.limit) params.append("limit", String(query.limit));
  if (query.offset) params.append("offset", String(query.offset));
  return request<InvoiceResponse[]>(`/payments/invoices?${params.toString()}`, {}, token);
}

export async function requestRefund(paymentId: number, reason: string, token: string) {
  return request(`/payments/${paymentId}/refund`, {
    method: "POST",
    body: JSON.stringify({ reason }),
  }, token);
}

export async function sendInvoiceEmail(paymentId: number, token: string) {
  return request(`/payments/${paymentId}/send-invoice`, { method: "POST" }, token);
}

export async function listPayments(query: ListPaymentsQuery = {}) {
  const params = new URLSearchParams();
  if (query.limit) params.append("limit", String(query.limit));
  if (query.offset) params.append("offset", String(query.offset));
  if (query.status) params.append("status", query.status);
  if (query.gateway) params.append("gateway", query.gateway);
  if (query.search) params.append("search", query.search);

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

export async function processRefund(paymentId: number, reason: string) {
  return request(`/payments/${paymentId}/refund/process`, {
    method: "POST",
    body: JSON.stringify({ reason }),
  });
}