import { ApiError } from "@/lib/api/client";

export type FieldErrors<T extends string> = Partial<Record<T, string>>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function firstErrorMessage(value: unknown) {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.find((item): item is string => typeof item === "string");
  return undefined;
}

export function getApiFieldErrors<T extends string>(error: unknown, fields: readonly T[]): FieldErrors<T> {
  if (!(error instanceof ApiError)) return {};

  const details = isRecord(error.details) && isRecord(error.details.errors) ? error.details.errors : error.details;
  if (!isRecord(details)) return {};

  return fields.reduce<FieldErrors<T>>((result, field) => {
    const message = firstErrorMessage(details[field]);
    if (message) result[field] = message;
    return result;
  }, {});
}

export function hasFieldErrors<T extends string>(errors: FieldErrors<T>) {
  return Object.values(errors).some(Boolean);
}

export function getFormErrorMessage(error: unknown, fallback: string, fieldErrors: FieldErrors<string>) {
  if (hasFieldErrors(fieldErrors)) return "Please fix the highlighted fields.";
  return error instanceof Error ? error.message : fallback;
}
