import { API_BASE_URL, BASE_DOMAIN } from "@/lib/site-config";

export interface PublicSiteSuspendedPayload {
  site_name?: string;
  subdomain?: string;
  language?: string;
  expired_at?: string | null;
}

export interface PublicSiteLockedPayload {
  site_name?: string;
  subdomain?: string;
  language?: string;
}

/**
 * Server-side result for a published site lookup. Passing this to `PublicSite`
 * lets the first HTML response contain the real page instead of a loading
 * screen, so visitors and crawlers never see an empty shell.
 */
export type PublicSiteInitial =
  | { kind: "ok"; data: any }
  | { kind: "suspended"; payload: PublicSiteSuspendedPayload }
  | { kind: "locked"; payload: PublicSiteLockedPayload }
  | { kind: "error"; message: string };

export function publicSiteHost(hostOrSubdomain: string): string {
  return hostOrSubdomain.includes(".")
    ? hostOrSubdomain
    : `${hostOrSubdomain}.${BASE_DOMAIN}`;
}

export async function fetchPublicSiteInitial(
  hostOrSubdomain: string
): Promise<PublicSiteInitial> {
  const host = publicSiteHost(hostOrSubdomain);

  try {
    const res = await fetch(
      `${API_BASE_URL}/public/sites?host=${encodeURIComponent(host)}`,
      { next: { revalidate: 60 } }
    );

    if (!res.ok) {
      let failure:
        | {
            code?: string;
            message?: string;
            data?: PublicSiteSuspendedPayload & PublicSiteLockedPayload;
          }
        | null = null;
      try {
        failure = await res.json();
      } catch {
        failure = null;
      }

      if (failure?.code === "ERR_PLAN_EXPIRED") {
        return { kind: "suspended", payload: failure.data || {} };
      }
      if (failure?.code === "ERR_SITE_LOCKED") {
        return { kind: "locked", payload: failure.data || {} };
      }
      return {
        kind: "error",
        message:
          failure?.message || "Situs tidak ditemukan atau belum dipublikasi.",
      };
    }

    const envelope = await res.json();
    if (envelope.status !== "success" || !envelope.data) {
      return {
        kind: "error",
        message: envelope.message || "Gagal memuat situs.",
      };
    }

    let blogPosts: any[] = [];
    const siteId = envelope.data?.site?.id;
    if (siteId) {
      try {
        const blogRes = await fetch(
          `${API_BASE_URL}/public/sites/${siteId}/blog-posts`,
          { next: { revalidate: 60 } }
        );
        if (blogRes.ok) {
          const blogEnvelope = await blogRes.json();
          if (
            blogEnvelope.status === "success" &&
            Array.isArray(blogEnvelope.data)
          ) {
            blogPosts = blogEnvelope.data;
          }
        }
      } catch {}
    }

    return {
      kind: "ok",
      data: {
        ...envelope.data,
        content: {
          ...envelope.data.content,
          blog: blogPosts.length > 0 ? { posts: blogPosts } : undefined,
        },
      },
    };
  } catch {
    return { kind: "error", message: "Terjadi kesalahan koneksi." };
  }
}
