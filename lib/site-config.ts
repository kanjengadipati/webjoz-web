export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.webjoz.com";

export const BASE_DOMAIN =
  process.env.NEXT_PUBLIC_BASE_DOMAIN ?? "webjoz.com";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://api.webjoz.com";

export const WHATSAPP_CS_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_CS_NUMBER ?? "62895392765355";

export const siteUrl = (path = "/") => `${SITE_URL}${path}`;

export const tenantSiteUrl = (subdomain: string) =>
  `https://${subdomain}.${BASE_DOMAIN}`;

export const formatPhoneNumber = (phone = WHATSAPP_CS_NUMBER) => {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("62")) {
    const rest = digits.slice(2);
    if (rest.length <= 3) return `+62 ${rest}`;
    if (rest.length <= 7) return `+62 ${rest.slice(0, 3)}-${rest.slice(3)}`;
    return `+62 ${rest.slice(0, 3)}-${rest.slice(3, 7)}-${rest.slice(7)}`;
  }
  return phone;
};

export const getWhatsAppUrl = (message?: string) => {
  const clean = WHATSAPP_CS_NUMBER.replace(/\D/g, "");
  if (!message) return `https://wa.me/${clean}`;
  return `https://wa.me/${clean}?text=${encodeURIComponent(message)}`;
};
