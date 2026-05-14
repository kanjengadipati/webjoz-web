import { DEFAULT_DEVICE_ID } from "@/lib/config";
import { request } from "@/lib/api/client";
import type { LoginResponse, Profile } from "@/lib/types";

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
