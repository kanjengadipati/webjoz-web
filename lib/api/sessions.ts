import { TOKEN_STORAGE_KEY } from "@/lib/config";
import { request } from "@/lib/api/client";
import { setStoredValue } from "@/lib/storage";
import type { LoginResponse, Session } from "@/lib/types";

export async function fetchSessions(token: string) {
  return request<Session[]>("/auth/sessions", {
    method: "GET",
  }, token);
}

export async function revokeSession(token: string, id: number) {
  return request<null>(`/auth/sessions/${id}`, {
    method: "DELETE",
  }, token);
}

export async function revokeTrustedDevice(token: string, id: string) {
  return request<null>(`/auth/trusted-devices/${id}`, {
    method: "DELETE",
  }, token);
}

export async function revokeOtherSessions(token: string) {
  const response = await request<LoginResponse>("/auth/logout-others", {
    method: "POST",
  }, token);

  if (response.data) {
    setStoredValue(TOKEN_STORAGE_KEY, response.data.access_token);
  }

  return response;
}

export async function logoutCurrentSession(token: string) {
  return request<null>("/auth/logout", {
    method: "POST",
  }, token);
}

export async function logoutAllSessions(token: string) {
  return request<null>("/auth/logout-all", {
    method: "POST",
  }, token);
}
