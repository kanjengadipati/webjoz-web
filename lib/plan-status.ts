// Shared subscription-suspension rule for the dashboard and editor.
//
// The backend parks a tenant as soon as either marker is set: `plan_expired_at`
// (stamped by the hourly cron at downgrade) OR `plan_expires_at` having passed
// (the hard deadline, grace already included). The frontend must apply the same
// rule so the ~1h window before the cron runs does not leave the Publish button
// enabled or the expired banner hidden.
export interface TenantBillingLike {
  plan?: string | null;
  plan_expires_at?: string | null;
  plan_expired_at?: string | null;
}

export function isTenantSuspended(
  tenant: TenantBillingLike | null | undefined,
  nowTs: number | null,
): boolean {
  if (!tenant) return false;
  if (tenant.plan_expired_at) return true;
  if (tenant.plan === "free" || !tenant.plan_expires_at || nowTs === null) {
    return false;
  }
  const expiresMs = new Date(tenant.plan_expires_at).getTime();
  if (!Number.isFinite(expiresMs)) return false;
  return expiresMs <= nowTs;
}