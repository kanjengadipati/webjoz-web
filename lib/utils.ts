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
 * Renders `amount` using the currency style of a template label, replacing the
 * numeric portion with the formatted amount.
 *
 * Unlike a regex replace, this tolerates prefixes and shorthand units (e.g.
 * `"Mulai Rp 25rb"` → `"Mulai Rp 25.000"`) by keeping only the text before the
 * first digit, so the numeric value always comes from `amount` (the price
 * amount), never from parsing the display string.
 */
export function formatPriceWithAmount(amount: number, template?: string | null): string {
  const formatted = formatIdNumber(amount);
  if (!template) return formatted;
  const match = template.match(/\d/);
  const prefix = match ? template.slice(0, match.index) : `${template.trim()} `;
  return `${prefix}${formatted}`;
}
