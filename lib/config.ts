export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ||
  "http://localhost:8080";

export const API_DOCS_URL = `${API_BASE_URL}/docs`;

export const DEFAULT_DEVICE_ID = "nextjs-dashboard";
export const TOKEN_STORAGE_KEY = "pleco_access_token";
export const REFRESH_STORAGE_KEY = "pleco_refresh_token";
export const EMAIL_STORAGE_KEY = "pleco_email";
export const THEME_STORAGE_KEY = "pleco_theme";
export const ACCENT_STORAGE_KEY = "pleco_accent";
export const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";
export const FACEBOOK_APP_ID = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || "";

export const IS_LOCAL =
  API_BASE_URL.includes("localhost") || API_BASE_URL.includes("127.0.0.1");
export const ENV_NAME = IS_LOCAL ? "Local" : "Production";
