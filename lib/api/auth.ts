import { request } from "@/lib/api/client";
import type { LoginResponse, Profile } from "@/lib/types";

export async function login(email: string, password: string) {
  return request<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
    }),
  });
}

export async function requestOtp(channel: "whatsapp" | "email", target: string) {
  return request<null>("/auth/request-otp", {
    method: "POST",
    body: JSON.stringify({ channel, target }),
  });
}

export async function checkPasswordlessIdentity(channel: "whatsapp" | "email", target: string) {
  return request<null>("/auth/passwordless/check", {
    method: "POST",
    body: JSON.stringify({ channel, target }),
  });
}

export async function startPasswordless(channel: "whatsapp" | "email", target: string) {
  return request<{ next_step: "magic_link" | "otp" }>("/auth/passwordless/start", {
    method: "POST",
    body: JSON.stringify({ channel, target }),
  });
}

export async function verifyMagicLink(input: {
  token: string;
  deviceName?: string;
  trustedDevice?: boolean;
}) {
  return request<LoginResponse>("/auth/magic-link/verify", {
    method: "POST",
    body: JSON.stringify({
      token: input.token,
      device_name: input.deviceName,
      trusted_device: input.trustedDevice,
    }),
  });
}

export async function verifyOtp(input: {
  channel: "whatsapp" | "email";
  target: string;
  otp: string;
  deviceName?: string;
  trustedDevice?: boolean;
}) {
  return request<LoginResponse>("/auth/verify-otp", {
    method: "POST",
    body: JSON.stringify({
      channel: input.channel,
      target: input.target,
      otp: input.otp,
      device_name: input.deviceName,
      trusted_device: input.trustedDevice,
    }),
  });
}

export async function register(name: string, email: string, phoneNumber: string, password: string) {
  const payload = {
    name,
    email,
    password,
    ...(phoneNumber ? { phone_number: phoneNumber } : {}),
  };

  return request<null>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
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

export async function updateProfile(token: string, name: string, phoneNumber: string) {
  return request<Profile>("/auth/profile", {
    method: "PATCH",
    body: JSON.stringify({ name, phone_number: phoneNumber }),
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
    body: JSON.stringify({ provider, token }),
  });
}
