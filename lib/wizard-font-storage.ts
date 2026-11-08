/**
 * Helpers for local custom font handling in the creation wizard (/create).
 * - Enforces strict file size limit (default 500 KB) so base64 data URLs don't exhaust storage.
 * - Forces correct MIME types (browsers often return application/octet-stream for .ttf/.otf).
 * - Isolates font data URLs from main wizard resume payload to prevent QuotaExceededError.
 */

export const WIZARD_FONT_MAX_BYTES = 500 * 1024; // 500 KB limit for wizard preview
export const WIZARD_FONT_EXTS = [".woff2", ".woff", ".ttf", ".otf"];
export const WIZARD_CUSTOM_FONT_KEY = "wiz_custom_font_data";

export interface StoredCustomFontData {
  heading?: { name: string; dataUrl: string };
  body?: { name: string; dataUrl: string };
}

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
      // Replace whatever MIME browser gave with the normalized font MIME
      // e.g. "data:application/octet-stream;base64,..." -> "data:font/woff2;base64,..."
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
 * Persists custom font data URL in a dedicated local storage key
 * safely isolated from main wizard state.
 */
export function saveCustomFontStorage(slot: "heading" | "body", name: string, dataUrl: string): void {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(WIZARD_CUSTOM_FONT_KEY);
    const data: StoredCustomFontData = raw ? JSON.parse(raw) : {};
    data[slot] = { name, dataUrl };
    localStorage.setItem(WIZARD_CUSTOM_FONT_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn("[theme] Failed to save custom font to isolated storage (quota full)", e);
  }
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
 * Clears custom font data from storage.
 */
export function clearCustomFontStorage(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(WIZARD_CUSTOM_FONT_KEY);
  } catch {
    // noop
  }
}

