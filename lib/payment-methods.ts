import type { PaymentMethodType } from "@/components/templates/types";

export interface PaymentFieldImageConfig {
  kind: "image";
  imageLabelKey: string;
  imageLabelFallback: string;
  imagePlaceholderKey: string;
  imagePlaceholderFallback: string;
}

export interface PaymentFieldTextConfig {
  kind: "text";
  placeholderKey: string;
  placeholderFallback: string;
}

export type PaymentFieldConfig = PaymentFieldImageConfig | PaymentFieldTextConfig;

export interface PaymentMethodSchema {
  /** i18n key for the display/dropdown name of the type. */
  labelKey: string;
  /** fallback display name when translation is missing. */
  labelFallback: string;
  /** optional per-type field shown in editors (text detail or image upload). */
  field?: PaymentFieldConfig;
}

/**
 * Single source of truth for every payment method type.
 *
 * Internationalizing == adding one entry here (+ optional locale overrides),
 * no editor/render logic changes required.
 */
export const PAYMENT_METHOD_SCHEMAS: Record<PaymentMethodType, PaymentMethodSchema> = {
  transfer: {
    labelKey: "dashboard.sitesKatalog.methodTypeTransfer",
    labelFallback: "Transfer Bank",
    field: {
      kind: "text",
      placeholderKey: "dashboard.sitesKatalog.methodDetailPlaceholder",
      placeholderFallback: "No. rekening (cth. 1234567890 a.n. Nama)",
    },
  },
  qris: {
    labelKey: "dashboard.sitesKatalog.methodTypeQris",
    labelFallback: "QRIS",
    field: {
      kind: "image",
      imageLabelKey: "dashboard.sitesKatalog.methodQrisImageLabel",
      imageLabelFallback: "Gambar QR",
      imagePlaceholderKey: "dashboard.sitesKatalog.methodQrisImagePlaceholder",
      imagePlaceholderFallback: "https://... atau unggah gambar QRIS",
    },
  },
  ewallet: {
    labelKey: "dashboard.sitesKatalog.methodTypeEwallet",
    labelFallback: "E-Wallet",
    field: {
      kind: "text",
      placeholderKey: "dashboard.sitesKatalog.methodDetailPlaceholderEwallet",
      placeholderFallback: "Nomor HP / ID e-wallet (cth. 081234567890)",
    },
  },
  cod: {
    labelKey: "dashboard.sitesKatalog.methodTypeCod",
    labelFallback: "Bayar di Tempat (COD)",
    field: {
      kind: "text",
      placeholderKey: "dashboard.sitesKatalog.methodDetailPlaceholderCod",
      placeholderFallback: "Catatan (cth. Bayar tunai saat pesanan tiba)",
    },
  },
  card: {
    labelKey: "dashboard.sitesKatalog.methodTypeCard",
    labelFallback: "Kartu Kredit/Debit",
    field: {
      kind: "text",
      placeholderKey: "dashboard.sitesKatalog.methodDetailPlaceholderCard",
      placeholderFallback: "cth. Visa / Mastercard (bayar langsung ke toko)",
    },
  },
  other: {
    labelKey: "dashboard.sitesKatalog.methodTypeOther",
    labelFallback: "Lainnya",
    field: {
      kind: "text",
      placeholderKey: "dashboard.sitesKatalog.methodDetailPlaceholderOther",
      placeholderFallback: "Catatan metode (cth. transfer via platform lain)",
    },
  },
};

/** Order of the type dropdown in editors and generated content. */
export const PAYMENT_METHOD_ORDER: PaymentMethodType[] = [
  "transfer",
  "qris",
  "ewallet",
  "cod",
  "card",
  "other",
];

export function paymentMethodSchema(
  type?: string | null
): PaymentMethodSchema {
  return (
    (type && PAYMENT_METHOD_SCHEMAS[type as PaymentMethodType]) ||
    PAYMENT_METHOD_SCHEMAS.transfer
  );
}

/** Localized display name / dropdown option for a payment method type. */
export function paymentMethodTypeLabel(
  t: (key: string, fallback?: string) => string,
  type?: string | null
): string {
  const schema = paymentMethodSchema(type);
  return t(schema.labelKey, schema.labelFallback);
}

/** Localized placeholder for the method's text field ("" when the type uses an image field). */
export function paymentMethodDetailPlaceholder(
  t: (key: string, fallback?: string) => string,
  type?: string | null
): string {
  const field = paymentMethodSchema(type).field;
  if (!field || field.kind !== "text") return "";
  return t(field.placeholderKey, field.placeholderFallback);
}

/** Localized image upload field config, or null when the type has no image field. */
export function paymentMethodImageField(
  t: (key: string, fallback?: string) => string,
  type?: string | null
): { label: string; placeholder: string } | null {
  const field = paymentMethodSchema(type).field;
  if (!field || field.kind !== "image") return null;
  return {
    label: t(field.imageLabelKey, field.imageLabelFallback),
    placeholder: t(field.imagePlaceholderKey, field.imagePlaceholderFallback),
  };
}

/** Localized default display name for a payment method type (editable by merchant). */
export function paymentMethodDefaultLabel(
  t: (key: string, fallback?: string) => string,
  type?: string | null
): string {
  return paymentMethodTypeLabel(t, type);
}

/** Localized default/fallback title of the payment & shipping block. */
export function paymentBlockTitle(
  t: (key: string, fallback?: string) => string
): string {
  return t(
    "dashboard.sitesKatalog.paymentTitle",
    "Metode Pembayaran & Pengiriman"
  );
}