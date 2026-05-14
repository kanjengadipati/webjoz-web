import { request } from "@/lib/api/client";
import type { AuditLog, InvestigationHistory, InvestigationResult } from "@/lib/types";

export async function fetchAuditLogs(token: string, query: URLSearchParams) {
  return request<AuditLog[]>(`/auth/admin/audit-logs?${query.toString()}`, { method: "GET" }, token);
}

export async function investigateLogs(token: string, payload: Record<string, unknown>) {
  return request<InvestigationResult>(
    "/auth/admin/audit-logs/investigations",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
    token,
  );
}

export async function fetchInvestigationHistory(token: string, page: number = 1, limit: number = 10) {
  return request<InvestigationHistory[]>(
    `/auth/admin/audit-logs/investigations?page=${page}&limit=${limit}`,
    { method: "GET" },
    token,
  );
}

export async function fetchInvestigationDetail(token: string, id: number) {
  return request<InvestigationHistory>(
    `/auth/admin/audit-logs/investigations/${id}`,
    { method: "GET" },
    token,
  );
}
