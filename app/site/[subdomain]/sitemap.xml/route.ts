import { NextResponse } from "next/server";
import { API_BASE_URL, tenantSiteUrl } from "@/lib/site-config";

const xmlEscape = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

async function fetchSite(subdomain: string) {
  const host = `${subdomain}.${process.env.NEXT_PUBLIC_BASE_DOMAIN ?? "webjoz.com"}`;
  const res = await fetch(`${API_BASE_URL}/public/sites?host=${host}`, {
    next: { revalidate: 300 },
  });
  if (!res.ok) return null;
  const envelope = await res.json();
  if (envelope.status !== "success" || !envelope.data) return null;
  return envelope.data;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ subdomain: string }> },
) {
  const { subdomain } = await params;
  const siteUrl = tenantSiteUrl(subdomain);

  const entries: Array<{ loc: string; lastmod: string; priority: string }> = [
    { loc: siteUrl, lastmod: new Date().toISOString().split("T")[0], priority: "1.0" },
    { loc: `${siteUrl}/blog`, lastmod: new Date().toISOString().split("T")[0], priority: "0.8" },
  ];

  try {
    const site = await fetchSite(subdomain);
    const siteId = site?.site?.id;
    if (siteId) {
      const blogRes = await fetch(`${API_BASE_URL}/public/sites/${siteId}/blog-posts`, {
        next: { revalidate: 300 },
      });
      if (blogRes.ok) {
        const blogEnvelope = await blogRes.json();
        const posts: Array<{ slug?: string; updated_at?: string; published_at?: string }> =
          blogEnvelope.data ?? [];
        for (const post of posts) {
          if (!post.slug) continue;
          const lastmod = (post.updated_at || post.published_at || "")
            .slice(0, 10);
          entries.push({
            loc: `${siteUrl}/blog/${post.slug}`,
            lastmod: lastmod || new Date().toISOString().split("T")[0],
            priority: "0.6",
          });
        }
      }
    }
  } catch {
    // fall back to the minimal entry set
  }

  const urlset = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries
    .map(
      (e) =>
        `  <url>\n    <loc>${xmlEscape(e.loc)}</loc>\n    <lastmod>${e.lastmod}</lastmod>\n    <priority>${e.priority}</priority>\n  </url>`,
    )
    .join("\n")}\n</urlset>\n`;

  return new NextResponse(urlset, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
