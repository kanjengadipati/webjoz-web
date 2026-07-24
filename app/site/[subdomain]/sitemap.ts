import type { MetadataRoute } from "next";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://api.webjoz.com";
const BASE_DOMAIN = process.env.NEXT_PUBLIC_BASE_DOMAIN ?? "webjoz.com";

type Params = { params: Promise<{ subdomain: string }> };

export default async function sitemap({ params }: Params): Promise<MetadataRoute.Sitemap> {
  const { subdomain } = await params;
  const siteUrl = `https://${subdomain}.${BASE_DOMAIN}`;

  try {
    const host = `${subdomain}.${BASE_DOMAIN}`;
    const siteRes = await fetch(
      `${API_BASE_URL}/public/sites?host=${host}`,
      { next: { revalidate: 300 } },
    );
    if (!siteRes.ok) return [{ url: siteUrl, lastModified: new Date() }];
    const siteEnvelope = await siteRes.json();
    const siteId = siteEnvelope.data?.site?.id;
    if (!siteId) return [{ url: siteUrl, lastModified: new Date() }];

    const blogRes = await fetch(
      `${API_BASE_URL}/public/sites/${siteId}/blog-posts`,
      { next: { revalidate: 300 } },
    );

    const entries: MetadataRoute.Sitemap = [
      {
        url: siteUrl,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 1,
      },
      {
        url: `${siteUrl}/blog`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      },
    ];

    if (blogRes.ok) {
      const blogEnvelope = await blogRes.json();
      const posts: Array<{ slug: string; published_at?: string; updated_at?: string }> =
        blogEnvelope.data ?? [];

      for (const post of posts) {
        entries.push({
          url: `${siteUrl}/blog/${post.slug}`,
          lastModified: new Date(post.updated_at || post.published_at || Date.now()),
          changeFrequency: "monthly",
          priority: 0.6,
        });
      }
    }

    return entries;
  } catch {
    return [{ url: siteUrl, lastModified: new Date() }];
  }
}
