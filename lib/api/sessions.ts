import { DEFAULT_DEVICE_ID, TOKEN_STORAGE_KEY } from "@/lib/config";
import { request } from "@/lib/api/client";
import { setStoredValue } from "@/lib/storage";
import type { LoginResponse, Session } from "@/lib/types";

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
  const response = await request<LoginResponse>("/auth/logout-others", {
    method: "POST",
    headers: { "X-Device-ID": DEFAULT_DEVICE_ID },
  }, token);

  if (response.data) {
    setStoredValue(TOKEN_STORAGE_KEY, response.data.access_token);
  }

  return response;
}

export async function logoutCurrentSession(token: string) {
  return request<null>("/auth/logout", {
    method: "POST",
    headers: { "X-Device-ID": DEFAULT_DEVICE_ID },
  }, token);
}
