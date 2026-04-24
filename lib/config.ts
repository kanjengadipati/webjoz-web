export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ||
  "http://localhost:8080";

export const DEFAULT_DEVICE_ID = "nextjs-dashboard";
export const TOKEN_STORAGE_KEY = "go_api_starterkit_access_token";
export const REFRESH_STORAGE_KEY = "go_api_starterkit_refresh_token";
export const EMAIL_STORAGE_KEY = "go_api_starterkit_email";
export const THEME_STORAGE_KEY = "go_api_starterkit_theme";
