/**
 * Helpers for local custom font handling in the creation wizard (/create).
 * - Enforces strict file size limit (default 500 KB) so base64 data URLs don't exhaust storage.
 * - Forces correct MIME types (browsers often return application/octet-stream for .ttf/.otf).
 * - Isolates font data URLs from main wizard resume payload to prevent QuotaExceededError.
 * - Storage strictly mirrors applied custom fonts; never precedes them.
 */

export const WIZARD_FONT_MAX_BYTES = 500 * 1024; // 500 KB limit for wizard preview
export const WIZARD_FONT_EXTS = [".woff2", ".woff", ".ttf", ".otf"];
export const WIZARD_CUSTOM_FONT_KEY = "wiz_custom_font_data";
export const LEGACY_TYPOGRAPHY_KEY = "webjoz_wizard_custom_typography";

export interface StoredCustomFontData {
  heading?: { name: string; dataUrl: string };
  body?: { name: string; dataUrl: string };
}

export type TypoLike = {
  heading_font?: string;
  heading_font_url?: string;
  body_font?: string;
  body_font_url?: string;
};

/**
 * Returns clean font MIME type based on file extension.
 * Crucial because browsers often return application/octet-stream for .ttf/.otf,
 * which causes @font-face and loadCustomFont() format detection to fail.
 */
export function getFontMime(fileName: string): string {
  const lower = fileName.toLowerCase();
  if (lower.endsWith(".woff2")) return "font/woff2";
  if (lower.endsWith(".woff")) return "font/woff";
  if (lower.endsWith(".ttf")) return "font/ttf";
  if (lower.endsWith(".otf")) return "font/otf";
  return "font/woff2";
}

/**
 * Derives font extension from MIME type.
 */
export function fontExtFromMime(mime: string): "woff2" | "woff" | "ttf" | "otf" {
  const m = mime.toLowerCase();
  if (m.includes("woff2")) return "woff2";
  if (m.includes("woff")) return "woff";
  if (m.includes("otf") || m.includes("opentype")) return "otf";
  if (m.includes("ttf") || m.includes("truetype")) return "ttf";
  return "woff2";
}

/**
 * Converts a data URL to a Blob synchronously without network fetch (immune to connect-src CSP).
 */
export function dataUrlToBlob(dataUrl: string): Blob {
  const comma = dataUrl.indexOf(",");
  if (comma === -1) {
    throw new Error("Invalid data URL");
  }
  const meta = dataUrl.slice(0, comma);
  const mime = /^data:([^;,]+)/.exec(meta)?.[1] ?? "application/octet-stream";
  const bin = atob(dataUrl.slice(comma + 1));
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) {
    bytes[i] = bin.charCodeAt(i);
  }
  return new Blob([bytes], { type: mime });
}

/**
 * Reads a File into a Data URL with enforced font MIME type.
 * Validates maximum file size.
 */
export async function readFontFileDataUrl(file: File): Promise<{ dataUrl: string; name: string }> {
  if (file.size > WIZARD_FONT_MAX_BYTES) {
    const sizeKb = Math.round(file.size / 1024);
    throw new Error(`Ukuran font terlalu besar (${sizeKb} KB). Maksimal 500 KB (disarankan format .woff2).`);
  }

  const ext = "." + (file.name.split(".").pop() || "").toLowerCase();
  if (!WIZARD_FONT_EXTS.includes(ext)) {
    throw new Error(`Format font ${ext} tidak didukung. Gunakan .woff2, .woff, .ttf, atau .otf.`);
  }

  const baseName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ").trim();
  const mime = getFontMime(file.name);

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const rawResult = reader.result as string;
      const commaIdx = rawResult.indexOf(",");
      if (commaIdx === -1) {
        return reject(new Error("Gagal membaca data file font."));
      }
      const base64Data = rawResult.substring(commaIdx + 1);
      const dataUrl = `data:${mime};base64,${base64Data}`;
      resolve({ dataUrl, name: baseName });
    };
    reader.onerror = () => reject(new Error("Gagal membaca file font."));
    reader.readAsDataURL(file);
  });
}

/**
 * Cerminkan HANYA font data: URL yang sudah diterapkan. Dipanggil tiap `applied` berubah.
 */
export function syncCustomFontStorage(typography?: TypoLike): void {
  if (typeof window === "undefined") return;
  const data: StoredCustomFontData = {};
  if (typography?.heading_font && typography.heading_font_url?.startsWith("data:")) {
    data.heading = { name: typography.heading_font, dataUrl: typography.heading_font_url };
  }
  if (typography?.body_font && typography.body_font_url?.startsWith("data:")) {
    data.body = { name: typography.body_font, dataUrl: typography.body_font_url };
  }
  try {
    if (!data.heading && !data.body) {
      localStorage.removeItem(WIZARD_CUSTOM_FONT_KEY);
    } else {
      localStorage.setItem(WIZARD_CUSTOM_FONT_KEY, JSON.stringify(data));
    }
  } catch (e) {
    console.warn("[theme] custom font storage failed (quota)", e);
  }
}

/**
 * Isi kembali data URL hanya bila `applied` masih merujuk font dengan nama yang sama.
 */
export function restoreCustomFontUrls<T extends { typography?: TypoLike }>(
  applied: T,
  stored: StoredCustomFontData
): T {
  const typo = { ...(applied.typography ?? {}) };
  let changed = false;
  if (stored.heading && typo.heading_font === stored.heading.name && !typo.heading_font_url) {
    typo.heading_font_url = stored.heading.dataUrl;
    changed = true;
  }
  if (stored.body && typo.body_font === stored.body.name && !typo.body_font_url) {
    typo.body_font_url = stored.body.dataUrl;
    changed = true;
  }
  return changed ? { ...applied, typography: typo } : applied;
}

/**
 * Loads custom font data URL from storage.
 */
export function loadCustomFontStorage(): StoredCustomFontData {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(WIZARD_CUSTOM_FONT_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/**
 * Clears custom font data from storage, including any legacy keys.
 */
export function clearCustomFontStorage(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(WIZARD_CUSTOM_FONT_KEY);
    localStorage.removeItem(LEGACY_TYPOGRAPHY_KEY);
  } catch {
    // noop
  }
}
