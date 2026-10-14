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
