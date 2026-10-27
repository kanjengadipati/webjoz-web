/**
 * Safe URL validation for links, CTAs, and user/AI-provided URLs.
 * Prevents javascript:, data:, vbscript: and malicious scheme execution.
 */

const BLOCKED_SCHEMES = ["javascript:", "data:", "vbscript:"];

const ALLOWED_SCHEMES = [
  "https://",
  "http://",
  "mailto:",
  "tel:",
  "whatsapp:",
  "sms:",
];

/**
 * Validates and normalizes an href value.
 * Allowed:
 * - In-page anchor: `#...`
 * - Relative root path: `/...` (excluding protocol-relative `//`)
 * - Approved protocols: `https://`, `http://`, `mailto:`, `tel:`, `whatsapp:`, `sms:`
 * - Convenience shortcut: `wa.me/...` normalized to `https://wa.me/...`
 *
 * If the URL contains an unsafe scheme or is empty, returns `fallback`.
 */
export function safeHref(url: string | null | undefined, fallback: string = "#contact"): string {
  if (!url || typeof url !== "string") return fallback;
  const trimmed = url.trim();
  if (!trimmed || trimmed === "/") return fallback;

  // In-page anchor (e.g. #contact, #menu, #pricing)
  if (trimmed.startsWith("#")) {
    return trimmed;
  }

  // Relative path (must start with single '/', not '//')
  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) {
    return trimmed;
  }

  const lower = trimmed.toLowerCase();

  // Block dangerous schemes
  for (const blocked of BLOCKED_SCHEMES) {
    if (lower.startsWith(blocked)) {
      return fallback;
    }
  }

  // Normalize wa.me shortcut (e.g. wa.me/628123456789 -> https://wa.me/628123456789)
  if (lower.startsWith("wa.me/")) {
    return `https://${trimmed}`;
  }

  // Allow recognized safe schemes
  for (const allowed of ALLOWED_SCHEMES) {
    if (lower.startsWith(allowed)) {
      return trimmed;
    }
  }

  return fallback;
}

/**
 * Checks whether an href points to an external destination that should open in a new tab
 * with `rel="noopener noreferrer"`.
 */
export function isExternalHref(url: string | null | undefined): boolean {
  if (!url || typeof url !== "string") return false;
  const lower = url.trim().toLowerCase();
  return (
    lower.startsWith("http://") ||
    lower.startsWith("https://") ||
    lower.startsWith("wa.me/") ||
    lower.startsWith("whatsapp:")
  );
}
