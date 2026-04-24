import { API_BASE_URL, DEFAULT_DEVICE_ID } from "@/lib/config";
import type {
  ApiEnvelope,
  AuditLog,
  InvestigationHistory,
  InvestigationResult,
  LoginResponse,
  Profile,
  Session,
  User,
} from "@/lib/types";

async function request<T>(path: string, init?: RequestInit, token?: string) {
  const headers = new Headers(init?.headers || {});
  if (!(init?.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
    cache: "no-store",
  });

  const body = (await response.json()) as ApiEnvelope<T>;
  if (!response.ok || body.status !== "success") {
    throw new Error(body.message || "Request failed");
  }
  return body;
}

export async function login(email: string, password: string) {
  return request<LoginResponse>("/auth/login", {
    method: "POST",
    headers: { "X-Device-ID": DEFAULT_DEVICE_ID },
    body: JSON.stringify({ email, password }),
  });
}

export async function fetchProfile(token: string) {
  return request<Profile>("/auth/profile", { method: "GET" }, token);
}

export async function fetchAuditLogs(token: string, query: URLSearchParams) {
  return request<AuditLog[]>(`/auth/admin/audit-logs?${query.toString()}`, { method: "GET" }, token);
}

export async function investigateLogs(token: string, payload: Record<string, unknown>) {
  return request<InvestigationResult>(
    "/auth/admin/audit-logs/investigate",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
    token,
  );
}

export async function fetchInvestigationHistory(token: string) {
  return request<InvestigationHistory[]>(
    "/auth/admin/audit-logs/investigations?page=1&limit=10",
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

export async function fetchSessions(token: string) {
  return request<Session[]>("/auth/sessions", {
    method: "GET",
    headers: { "X-Device-ID": DEFAULT_DEVICE_ID },
  }, token);
}

export async function revokeSession(token: string, id: number) {
  return request<null>(`/auth/sessions/${id}`, {
    method: "DELETE",
    headers: { "X-Device-ID": DEFAULT_DEVICE_ID },
  }, token);
}

export async function revokeOtherSessions(token: string) {
  return request<null>("/auth/logout-others", {
    method: "POST",
    headers: { "X-Device-ID": DEFAULT_DEVICE_ID },
  }, token);
}

export async function fetchUsers(token: string, query: URLSearchParams) {
  return request<User[]>(`/auth/admin/users?${query.toString()}`, { method: "GET" }, token);
}

export async function updateProfile(token: string, name: string) {
  return request<Profile>("/auth/profile", {
    method: "PATCH",
    body: JSON.stringify({ name }),
  }, token);
}

export async function changePassword(token: string, currentPassword: string, newPassword: string) {
  return request<null>("/auth/change-password", {
    method: "PATCH",
    body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
  }, token);
}
