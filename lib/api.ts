import { API_BASE_URL, DEFAULT_DEVICE_ID, REFRESH_STORAGE_KEY, TOKEN_STORAGE_KEY } from "@/lib/config";
import { readStorageValue, setStoredValue } from "@/lib/storage";
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

async function request<T>(path: string, init?: RequestInit, token?: string, canRetry = true): Promise<ApiEnvelope<T>> {
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

  // Handle 401 Unauthorized and try to refresh
  if (response.status === 401 && canRetry && token) {
    const refreshTokenValue = readStorageValue(REFRESH_STORAGE_KEY, "");
    if (refreshTokenValue) {
      try {
        const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "X-Device-ID": DEFAULT_DEVICE_ID 
          },
          body: JSON.stringify({ refresh_token: refreshTokenValue }),
        });

        if (refreshResponse.ok) {
          const body = (await refreshResponse.json()) as ApiEnvelope<LoginResponse>;
          if (body.status === "success" && body.data) {
            // Store new tokens
            setStoredValue(TOKEN_STORAGE_KEY, body.data.access_token);
            setStoredValue(REFRESH_STORAGE_KEY, body.data.refresh_token);

            // Retry original request with NEW token
            return request<T>(path, init, body.data.access_token, false);
          }
        }
      } catch (err) {
        console.error("Token refresh failed:", err);
      }
    }
    
    // If refresh failed or no refresh token, clear session and force login
    setStoredValue(TOKEN_STORAGE_KEY, "");
    setStoredValue(REFRESH_STORAGE_KEY, "");
    if (typeof window !== "undefined") {
      window.location.href = "/login?expired=true";
    }
  }

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

export async function register(name: string, email: string, password: string) {
  return request<null>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
}

export async function verifyEmail(token: string) {
  return request<null>(`/auth/verify?token=${encodeURIComponent(token)}`, { method: "GET" });
}

export async function forgotPassword(email: string) {
  return request<null>("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function resetPassword(token: string, newPassword: string) {
  return request<null>("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ token, new_password: newPassword }),
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

export async function socialLogin(provider: string, token: string) {
  return request<LoginResponse>("/auth/social-login", {
    method: "POST",
    headers: { "X-Device-ID": DEFAULT_DEVICE_ID },
    body: JSON.stringify({ provider, token }),
  });
}

export async function updateUser(token: string, id: number, data: { name: string; email: string; role: string; is_verified: boolean }) {
  return request<User>(`/auth/admin/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  }, token);
}

export async function fetchRoles(token: string) {
  return request<{ id: number; name: string }[]>("/auth/admin/roles", { method: "GET" }, token);
}

export async function fetchAllPermissions(token: string) {
  return request<{ id: number; name: string }[]>("/auth/admin/permissions", { method: "GET" }, token);
}

export async function fetchRolePermissions(token: string, roleID: number) {
  return request<{ id: number; name: string; permissions: string[] }>(`/auth/admin/roles/${roleID}/permissions`, { method: "GET" }, token);
}

export async function updateRolePermissions(token: string, roleID: number, permissions: string[]) {
  return request<null>(`/auth/admin/roles/${roleID}/permissions`, {
    method: "PUT",
    body: JSON.stringify({ permissions }),
  }, token);
}
