import {
  API_BASE_URL,
  API_DEBUG,
  API_TIMEOUT_MS,
  DEFAULT_DEVICE_ID,
  TOKEN_STORAGE_KEY,
} from "@/lib/config";
import { setStoredValue } from "@/lib/storage";
import type { ApiEnvelope, ApiSuccessResponse, LoginResponse } from "@/lib/types";

const MAX_AUTH_RETRIES = 1;

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

function isApiSuccess<T>(body: ApiEnvelope<T>): body is ApiSuccessResponse<T> {
  return body.status === "success";
}

async function parseApiEnvelope<T>(response: Response): Promise<ApiEnvelope<T>> {
  try {
    return (await response.json()) as ApiEnvelope<T>;
  } catch {
    return {
      status: "error",
      message: response.statusText || "Invalid API response",
    };
  }
}

function toApiError<T>(response: Response, body: ApiEnvelope<T>) {
  if (response.status === 429) {
    return new ApiError(429, "Too many requests. Please try again later.", {
      retryAfter: response.headers.get("Retry-After"),
      ...(isApiSuccess(body) ? {} : { errors: body.errors }),
    });
  }

  if (isApiSuccess(body)) {
    return new ApiError(response.status, body.message || `HTTP ${response.status}`);
  }

  return new ApiError(response.status, body.message || `HTTP ${response.status}`, body.errors);
}

async function fetchWithTimeout(path: string, init: RequestInit) {
  const controller = new AbortController();
  const timeoutId = globalThis.setTimeout(() => controller.abort(), API_TIMEOUT_MS);

  try {
    return await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      signal: controller.signal,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new ApiError(0, "Request timeout");
    }
    throw error;
  } finally {
    globalThis.clearTimeout(timeoutId);
  }
}

export async function request<T>(
  path: string,
  init?: RequestInit,
  token?: string,
  canRetry = true,
  retryCount = 0,
): Promise<ApiSuccessResponse<T>> {
  const headers = new Headers(init?.headers || {});
  if (!(init?.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const method = init?.method || "GET";
  if (API_DEBUG) {
    console.warn(`[API] ${method} ${path}`);
  }

  const response = await fetchWithTimeout(path, {
    ...init,
    headers,
    cache: "no-store",
    credentials: "include",
  });

  if (API_DEBUG) {
    console.warn(`[API] ${method} ${path} -> ${response.status}`);
  }

  if (response.status === 401 && canRetry && token && retryCount < MAX_AUTH_RETRIES) {
    try {
      const body = await refreshAccessToken();
      if (body.data.access_token) {
        return request<T>(path, init, body.data.access_token, false, retryCount + 1);
      }
    } catch (err) {
      console.error("Token refresh failed:", err);
    }

    setStoredValue(TOKEN_STORAGE_KEY, "");
    if (typeof window !== "undefined") {
      window.location.href = "/login?expired=true";
    }
  }

  const body = await parseApiEnvelope<T>(response);
  if (!response.ok || !isApiSuccess(body)) {
    throw toApiError(response, body);
  }
  return body;
}

export async function refreshAccessToken() {
  const refreshResponse = await fetchWithTimeout("/auth/refresh", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Device-ID": DEFAULT_DEVICE_ID,
    },
    credentials: "include",
    cache: "no-store",
  });

  const body = await parseApiEnvelope<LoginResponse>(refreshResponse);
  if (!refreshResponse.ok || !isApiSuccess(body)) {
    throw toApiError(refreshResponse, body);
  }

  if (body.data.access_token) {
    setStoredValue(TOKEN_STORAGE_KEY, body.data.access_token);
  }

  return body;
}
