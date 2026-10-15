export function cn(...inputs: Array<string | false | null | undefined>) {
  return inputs.filter(Boolean).join(" ");
}

/**
 * Formats a number using Indonesian grouping (id-ID), independent of the
 * viewer's browser/OS locale. Use this instead of bare `toLocaleString()` so
 * price/quantity output is deterministic (e.g. `25000` → `"25.000"`).
 */
export function formatIdNumber(value: number): string {
  return new Intl.NumberFormat("id-ID").format(value);
}

/**
 * Renders `amount` using the currency style and format of a template label,
 * replacing only the price numeric portion (and its shorthand multiplier if present)
 * while preserving any leading text (e.g. "Mulai", "2 for") and trailing units (e.g. "/malam", "/ porsi").
 *
 * Examples:
 *   formatPriceWithAmount(30000, "Rp 450.000/malam")   → "Rp 30.000/malam"
 *   formatPriceWithAmount(30000, "Rp 25.000 / porsi")   → "Rp 30.000 / porsi"
 *   formatPriceWithAmount(30000, "Mulai Rp 25rb")       → "Mulai Rp 30.000"
 *   formatPriceWithAmount(30000, "2 for Rp 50.000")     → "2 for Rp 30.000"
 */
export function formatPriceWithAmount(amount: number, template?: string | null): string {
  const formatted = formatIdNumber(amount);
  if (!template) return formatted;
  const trimmed = template.trim();

  // 1. If template is "Gratis" / "Free" (or "Mulai dari Gratis"), replace with currency amount
  if (/^(?:mulai\s+(?:dari\s+)?|from\s+)?(?:gratis|free)$/i.test(trimmed)) {
    return template.replace(/(?:gratis|free)/i, `Rp ${formatted}`);
  }

  // 2. Price range: e.g. "Rp 20.000 - Rp 35.000" or "Rp 20.000 - 35.000 / porsi"
  // Replace the entire range with the single formatted price.
  const rangeMatch = template.match(/(rp\.?|idr)(\s*)(\d+(?:[.,]\d+)*(?:\s*(?:rb|k|ribu|jt|juta)\b)?)\s*[-–—]\s*(?:(?:rp\.?|idr)\s*)?(\d+(?:[.,]\d+)*(?:\s*(?:rb|k|ribu|jt|juta)\b)?)/i);
  if (rangeMatch && rangeMatch.index !== undefined) {
    const [full, cur, space] = rangeMatch;
    return template.replace(full, `${cur}${space}${formatted}`);
  }

  // 3. Anchor on currency prefix (Rp / IDR) if present so leading bare numbers
  // (e.g. "2 for Rp 50.000") are ignored and trailing units (e.g. "/malam", "/ porsi", ",-", ".") are preserved.
  const currencyMatch = template.match(/(rp\.?|idr)(\s*)(\d+(?:[.,]\d+)*(?:\s*(?:rb|k|ribu|jt|juta)\b)?)/i);
  if (currencyMatch && currencyMatch.index !== undefined) {
    const [full, cur, space] = currencyMatch;
    return template.replace(full, `${cur}${space}${formatted}`);
  }

  // 4. Otherwise replace the first standalone number and its optional suffix.
  const numMatch = template.match(/(\d+(?:[.,]\d+)*(?:\s*(?:rb|k|ribu|jt|juta)\b)?)/i);
  if (numMatch) {
    return template.replace(numMatch[0], formatted);
  }

  return `${trimmed} ${formatted}`;
}
