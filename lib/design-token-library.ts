import type { DesignToken } from "@/lib/template-registry";
import { request } from "@/lib/api/client";

// Item yang dikembalikan oleh GET /ai/public/design-tokens (top design tokens
// dari Template Library, diurutkan berdasarkan skor).
export interface DesignTokenLibraryItem {
  id: number;
  source_template_id?: string | null;
  business_type: string;
  mood: string;
  design_token: DesignToken;
  score?: number;
  score_breakdown?: { label: string; score: number; max: number }[] | null;
  aesthetic_score?: number | null;
  created_at: string;
}

/**
 * Fetch top design tokens dari Template Library. Return [] (bukan throw) saat
 * API gagal — caller fallback ke showcase statis.
 */
export async function fetchDesignTokenLibrary(limit = 30): Promise<DesignTokenLibraryItem[]> {
  try {
    const res = await request<{ items: DesignTokenLibraryItem[] }>(
      `/ai/public/design-tokens?limit=${limit}`
    );
    return res?.data?.items ?? [];
  } catch (err) {
    console.warn("[design-token-library] fetch failed:", err);
    return [];
  }
}

/** Encode design token ke query param `dt` (base64, unicode-safe). */
export function encodeDesignTokenParam(token: DesignToken): string {
  try {
    return encodeURIComponent(btoa(encodeURIComponent(JSON.stringify(token))));
  } catch {
    return "";
  }
}

/** Decode query param `dt` kembali ke design token. Returns null bila invalid. */
export function decodeDesignTokenParam(param: string): DesignToken | null {
  try {
    const json = decodeURIComponent(atob(decodeURIComponent(param)));
    return JSON.parse(json) as DesignToken;
  } catch {
    return null;
  }
}

/**
 * Map business_type dari Template Library (mis. "Kafe", "Konsultan") ke pasangan
 * kategori + sub-type yang dipakai wizard. businessSubType kosong → wizard
 * tetap menanyakan jenis bisnis seperti biasa.
 */
export function prefillForLibraryBusinessType(
  businessType: string
): { businessType: string; businessSubType: string } {
  const bt = (businessType || "").trim();
  const lower = bt.toLowerCase();
  if (bt === "Kuliner" || bt === "Toko & UMKM" || bt === "Jasa" || bt === "Company") {
    return { businessType: bt, businessSubType: "" };
  }
  if (
    /kafe|kopi|coffee|cafe|kuliner|restoran|makanan|minuman|boba|bubble|bakery|kue|pastry|warung|snack|roti|teh|jus/.test(
      lower
    )
  ) {
    return { businessType: "Kuliner", businessSubType: bt };
  }
  if (
    /produk|umkm|handmade|toko|retail|kerajinan|fashion|frozen|olahan|grosir|store|shop/.test(
      lower
    )
  ) {
    return { businessType: "Toko & UMKM", businessSubType: bt };
  }
  return { businessType: "Jasa", businessSubType: bt };
}
