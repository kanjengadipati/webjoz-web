export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.webjoz.com";

export const BASE_DOMAIN =
  process.env.NEXT_PUBLIC_BASE_DOMAIN ?? "webjoz.com";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://api.webjoz.com";

export const siteUrl = (path = "/") => `${SITE_URL}${path}`;

export const tenantSiteUrl = (subdomain: string) =>
  `https://${subdomain}.${BASE_DOMAIN}`;
