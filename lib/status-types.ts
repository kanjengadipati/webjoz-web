import type { ToneKey } from "@/lib/ui-tones";

export enum StatusType {
  SUCCESS = "success",
  ACTIVE = "active",
  CURRENT = "current",
  VERIFIED = "verified",
  FAILED = "failed",
  ERROR = "error",
  REVOKED = "revoked",
  DENIED = "denied",
  WARNING = "warning",
  HIGH = "high",
  CRITICAL = "critical",
  MEDIUM = "medium",
  UNKNOWN = "unknown",
}

export const STATUS_TO_TONE: Record<StatusType, ToneKey> = {
  [StatusType.SUCCESS]: "good",
  [StatusType.ACTIVE]: "good",
  [StatusType.CURRENT]: "good",
  [StatusType.VERIFIED]: "good",
  [StatusType.FAILED]: "danger",
  [StatusType.ERROR]: "danger",
  [StatusType.REVOKED]: "danger",
  [StatusType.DENIED]: "warning",
  [StatusType.WARNING]: "warning",
  [StatusType.HIGH]: "danger",
  [StatusType.CRITICAL]: "danger",
  [StatusType.MEDIUM]: "warning",
  [StatusType.UNKNOWN]: "neutral",
};

export function statusTone(status?: string): ToneKey {
  const normalized = (status || StatusType.UNKNOWN).toLowerCase() as StatusType;
  return STATUS_TO_TONE[normalized] || "neutral";
}
