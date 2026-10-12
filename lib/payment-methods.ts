/**
 * Per-type guidance shown in the "Detail" field of a payment method.
 * - transfer / cod → a supporting note
 * - ewallet → phone number placeholder
 * - qris → no text detail at all; the QR image is the info (caller hides the field)
 */
export function paymentMethodDetailPlaceholder(
  t: (key: string, fallback?: string) => string,
  type?: string | null
): string {
  switch (type) {
    case "ewallet":
      return t(
        "dashboard.sitesKatalog.methodDetailPlaceholderEwallet",
        "Nomor HP / ID e-wallet (cth. 081234567890)"
      );
    case "cod":
      return t(
        "dashboard.sitesKatalog.methodDetailPlaceholderCod",
        "Catatan (cth. Bayar tunai saat pesanan tiba)"
      );
    default:
      return t(
        "dashboard.sitesKatalog.methodDetailPlaceholder",
        "No. rekening (cth. 1234567890 a.n. Nama)"
      );
  }
}