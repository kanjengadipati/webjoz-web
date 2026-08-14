import type { MetadataRoute } from "next";
import { BLOG_POSTS } from "@/lib/blog/posts";
import { API_BASE_URL, siteUrl, tenantSiteUrl } from "@/lib/site-config";

interface SitemapSite {
  subdomain: string;
  published_at?: string;
}

async function fetchPublishedSites(): Promise<SitemapSite[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/public/sitemap`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const envelope = await res.json();
    if (envelope.status !== "success" || !envelope.data?.sites) return [];
    return envelope.data.sites;
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const blogEntries: MetadataRoute.Sitemap = BLOG_POSTS.map((post) => ({
    url: siteUrl(`/blog/${post.slug}`),
    lastModified: new Date(post.date),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const entries: MetadataRoute.Sitemap = [
    {
      url: siteUrl(),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
      alternates: {
        languages: {
          id: siteUrl(),
          en: siteUrl("/en"),
        },
      },
    },
    {
      url: siteUrl("/en"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
      alternates: {
        languages: {
          id: siteUrl(),
          en: siteUrl("/en"),
        },
      },
    },
    {
      url: siteUrl("/blog"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...blogEntries,
    {
      url: siteUrl("/contact"),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: siteUrl("/privacy-policy"),
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: siteUrl("/terms"),
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: siteUrl("/refund-policy"),
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  const sites = await fetchPublishedSites();
  for (const site of sites) {
    const url = tenantSiteUrl(site.subdomain);
    entries.push({
      url,
      lastModified: site.published_at ? new Date(site.published_at) : new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    });
  }

  return entries;
}
