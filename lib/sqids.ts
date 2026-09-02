import Sqids from "sqids";

const sqids = new Sqids({
  minLength: 7,
});

/**
 * Encodes a numeric site ID into a Sqids string (e.g. 21 -> "bX8kP2a").
 */
export function encodeSiteId(id: number | string): string {
  const num = typeof id === "string" ? parseInt(id, 10) : id;
  if (isNaN(num) || num <= 0) return String(id);
  try {
    return sqids.encode([num]);
  } catch {
    return String(id);
  }
}

/**
 * Decodes a Sqids string or numeric string back to a numeric ID.
 */
export function decodeSiteId(val: string | number | undefined | null): number {
  if (!val) return 0;
  if (typeof val === "number") return val;

  // Try decoding with Sqids
  try {
    const decoded = sqids.decode(val);
    if (decoded && decoded.length > 0 && decoded[0] > 0) {
      return decoded[0];
    }
  } catch {
    // ignore
  }

  // Fallback to numeric string (for backward compatibility)
  const num = parseInt(val, 10);
  return isNaN(num) ? 0 : num;
}

/**
 * Generates a consistent dashboard site path with Sqids encoding.
 */
export function getSiteDashboardUrl(siteId: number | string, subPath = ""): string {
  const encoded = encodeSiteId(siteId);
  const cleanSub = subPath ? (subPath.startsWith("/") ? subPath : `/${subPath}`) : "";
  return `/dashboard/sites/${encoded}${cleanSub}`;
}
