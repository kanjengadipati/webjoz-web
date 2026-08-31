export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.webjoz.com";

export const BASE_DOMAIN =
  process.env.NEXT_PUBLIC_BASE_DOMAIN ?? "webjoz.com";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://api.webjoz.com";

export const WHATSAPP_CS_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_CS_NUMBER ?? "6285111221044";

export const SUPPORT_EMAIL =
  process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "cs@webjoz.com";

export const siteUrl = (path = "/") => `${SITE_URL}${path}`;

export const tenantSiteUrl = (subdomain: string) =>
  `https://${subdomain}.${BASE_DOMAIN}`;

export const formatPhoneNumber = (phone = WHATSAPP_CS_NUMBER) => {
  const digits = phone.replace(/\D/g, "");
  const countryCodes: Record<string, string> = {
    "+62": "Indonesia",
    "+60": "Malaysia",
    "+65": "Singapura",
    "+66": "Thailand",
    "+63": "Filipina",
    "+84": "Vietnam",
    "+91": "India",
    "+86": "China",
    "+81": "Jepang",
    "+82": "Korea Selatan",
  };
  const countryCode = Object.keys(countryCodes).find((code) => digits.startsWith(code));
  if (countryCode) {
    const countryName = countryCodes[countryCode];
    const rest = digits.slice(countryCode.length);
    if (rest.length <= 3) return `+${countryCode} ${rest} (${countryName})`;
    if (rest.length <= 7) return `+${countryCode} ${rest.slice(0, 3)}-${rest.slice(3)} (${countryName})`;
    return `+${countryCode} ${rest.slice(0, 3)}-${rest.slice(3, 7)}-${rest.slice(7)} (${countryName})`;
  }
  return phone;
};

export const getWhatsAppUrl = (message?: string) => {
  const clean = WHATSAPP_CS_NUMBER.replace(/\D/g, "");
  if (!message) return `https://wa.me/${clean}`;
  return `https://wa.me/${clean}?text=${encodeURIComponent(message)}`;
};
