// System and infrastructure subdomains that must never be routed as customer websites
// or assigned to user sites.
export const SYSTEM_RESERVED_SUBDOMAINS = new Set([
  'api',
  'app',
  'www',
  'admin',
  'mail',
  'smtp',
  'pop',
  'imap',
  'status',
  'docs',
  'cdn',
  'assets',
  'dashboard',
  'billing',
  'auth',
  'login',
  'register',
  'static',
  'dev',
  'stage',
  'stg',
  'test',
  'web',
  'ws',
  'wss',
  'media',
  'image',
  'images',
  'public',
  'help',
  'support',
  'portal',
  'pay',
  'payment',
  'payments',
  'hook',
  'hooks',
  'webhook',
  'webhooks',
  'internal',
  'platform',
]);

/**
 * Checks whether a subdomain string is reserved by the system or configured
 * via NEXT_PUBLIC_RESERVED_SUBDOMAINS / RESERVED_SUBDOMAINS environment variable.
 */
export function isReservedSubdomain(subdomain: string): boolean {
  const clean = (subdomain || '').toLowerCase().trim();
  if (!clean) return false;

  // 1. Core system guard
  if (SYSTEM_RESERVED_SUBDOMAINS.has(clean)) {
    return true;
  }

  // 2. Configurable ENV additions (comma-separated, e.g. "promo,partner,demo")
  const envVal =
    process.env.RESERVED_SUBDOMAINS ||
    process.env.NEXT_PUBLIC_RESERVED_SUBDOMAINS ||
    '';
  if (envVal) {
    for (const part of envVal.split(',')) {
      if (part.trim().toLowerCase() === clean) {
        return true;
      }
    }
  }

  return false;
}
