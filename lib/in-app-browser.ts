/**
 * Deteksi in-app browser (Instagram, Facebook, TikTok, dll).
 *
 * Trafik iklan Meta hampir seluruhnya dibuka di browser dalam aplikasi
 * Instagram/Facebook. Google memblokir OAuth di webview semacam ini
 * (error `disallowed_useragent`), jadi tombol "Login dengan Google" harus
 * ditangani khusus.
 */

export type InAppBrowserName =
  | "instagram"
  | "facebook"
  | "tiktok"
  | "line"
  | "other";

export interface InAppBrowserInfo {
  isInApp: boolean;
  name: InAppBrowserName | null;
  isAndroid: boolean;
  isIOS: boolean;
}

const NOT_IN_APP: InAppBrowserInfo = {
  isInApp: false,
  name: null,
  isAndroid: false,
  isIOS: false,
};

export function detectInAppBrowser(userAgent?: string): InAppBrowserInfo {
  const ua =
    userAgent ?? (typeof navigator !== "undefined" ? navigator.userAgent : "");
  if (!ua) return NOT_IN_APP;

  const isAndroid = /Android/i.test(ua);
  const isIOS = /iPhone|iPad|iPod/i.test(ua);

  let name: InAppBrowserName | null = null;
  if (/Instagram/i.test(ua)) name = "instagram";
  else if (/FBAN|FBAV|FB_IAB|FBIOS/i.test(ua)) name = "facebook";
  else if (/musical_ly|BytedanceWebview|TikTok/i.test(ua)) name = "tiktok";
  else if (/\bLine\//i.test(ua)) name = "line";
  // Android WebView generik: "; wv)" pada UA
  else if (isAndroid && /; wv\)/i.test(ua)) name = "other";

  return { isInApp: name !== null, name, isAndroid, isIOS };
}

/**
 * URL `intent://` yang membuka halaman saat ini di Chrome (Android saja).
 * Di iOS tidak ada cara resmi, jadi gunakan "salin tautan".
 */
export function buildAndroidChromeIntentUrl(href?: string): string | null {
  const current = href ?? (typeof window !== "undefined" ? window.location.href : "");
  try {
    const u = new URL(current);
    return (
      `intent://${u.host}${u.pathname}${u.search}${u.hash}` +
      `#Intent;scheme=${u.protocol.replace(":", "")};package=com.android.chrome;end`
    );
  } catch {
    return null;
  }
}
