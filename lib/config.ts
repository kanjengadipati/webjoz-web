const DEFAULT_API_BASE_URL = "http://localhost:8080";
const rawApiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || DEFAULT_API_BASE_URL;

function requiredProductionEnv(name: string, value: string | undefined) {
  if (process.env.NODE_ENV === "production" && !value) {
    throw new Error(`${name} is required in production`);
  }
}

function validateUrl(name: string, value: string) {
  try {
    new URL(value);
  } catch {
    throw new Error(`Invalid ${name}: ${value}`);
  }
}

function parsePositiveInteger(name: string, value: string | undefined, fallback: number) {
  if (!value) return fallback;
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error(`${name} must be a positive integer`);
  }
  return parsed;
}

requiredProductionEnv("NEXT_PUBLIC_API_BASE_URL", process.env.NEXT_PUBLIC_API_BASE_URL);
validateUrl("NEXT_PUBLIC_API_BASE_URL", rawApiBaseUrl);

export const API_BASE_URL = rawApiBaseUrl.replace(/\/$/, "");
export const API_TIMEOUT_MS = parsePositiveInteger(
  "NEXT_PUBLIC_API_TIMEOUT_MS",
  process.env.NEXT_PUBLIC_API_TIMEOUT_MS,
  30_000,
);
export const API_DEBUG = process.env.NEXT_PUBLIC_API_DEBUG === "true";

/** When false, skips the dashboard GET /health probe on the landing page (useful when the API is not running locally). */
export const HEALTH_CHECK_ENABLED =
  process.env.NEXT_PUBLIC_ENABLE_HEALTH_CHECK !== "false";

export const API_DOCS_URL = `${API_BASE_URL}/docs`;

/**
 * WARNING: The access token is stored in localStorage and is readable by JavaScript.
 * Keep access tokens short-lived; long-lived refresh tokens must stay in HttpOnly cookies.
 */
export const TOKEN_STORAGE_KEY = "pleco_access_token";
export const REFRESH_STORAGE_KEY = "pleco_refresh_token";
export const EMAIL_STORAGE_KEY = "pleco_email";
export const THEME_STORAGE_KEY = "pleco_theme";
export const ACCENT_STORAGE_KEY = "pleco_accent";
export const SOCIAL_ACTIVE_PROVIDERS = (process.env.NEXT_PUBLIC_SOCIAL_ACTIVE_PROVIDERS || "")
  .split(",")
  .map((provider) => provider.trim().toLowerCase())
  .filter(Boolean);
export const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_SOCIAL_GOOGLE_CLIENT_ID || "";
export const FACEBOOK_CLIENT_ID = process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK_CLIENT_ID || "";

export const STORAGE_KEYS = {
  TOKEN: TOKEN_STORAGE_KEY,
  REFRESH: REFRESH_STORAGE_KEY,
  EMAIL: EMAIL_STORAGE_KEY,
  THEME: THEME_STORAGE_KEY,
  ACCENT: ACCENT_STORAGE_KEY,
} as const;

export const config = {
  API_BASE_URL,
  API_TIMEOUT_MS,
  API_DEBUG,
  IS_PRODUCTION: process.env.NODE_ENV === "production",
} as const;

export const IS_LOCAL =
  API_BASE_URL.includes("localhost") || API_BASE_URL.includes("127.0.0.1");
export const ENV_NAME = IS_LOCAL ? "Local" : "Production";
