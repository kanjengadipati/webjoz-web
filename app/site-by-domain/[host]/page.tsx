import type { Metadata } from "next";
import PublicSite from "@/components/public-site";
import { API_BASE_URL } from "@/lib/site-config";

interface PageProps {
  params: Promise<{
    host: string;
  }>;
}

async function fetchSiteData(host: string) {
  const res = await fetch(
    `${API_BASE_URL}/public/sites?host=${encodeURIComponent(host)}`,
    { next: { revalidate: 300 } },
  );
  if (!res.ok) return null;
  const envelope = await res.json();
  if (envelope.status !== "success" || !envelope.data) return null;
  return envelope.data;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { host } = await params;
  const site = await fetchSiteData(host);
  if (!site) return {};

  const seo = site.content?.seo ?? {};
  const header = site.content?.header ?? {};
  const hero = site.content?.hero ?? {};
  const siteName = header.brand_name || site.site?.name || "";
  const title = seo.title || siteName;
  const description = seo.description || hero.subheadline || "";
  const canonicalPath = seo.canonical_path || "/";
  const siteUrl = `https://${host}`;
  const canonical = `${siteUrl}${canonicalPath}`;

  return {
    title,
    description,
    authors: siteName ? [{ name: siteName }] : [],
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates: {
      canonical,
    },
    openGraph: {
      title: seo.title || siteName,
      description,
      url: siteUrl,
      siteName: seo.og_site_name || siteName,
      locale: seo.og_locale || "id_ID",
      type: seo.og_type || "website",
      ...(seo.og_image_url ? { images: [{ url: seo.og_image_url }] } : {}),
    },
    twitter: {
      card: seo.twitter_card || "summary_large_image",
      title: seo.title || siteName,
      description,
      ...(seo.og_image_url ? { images: [seo.og_image_url] } : {}),
    },
    ...(seo.favicon_url ? { icons: { icon: seo.favicon_url } } : {}),
  };
}

export default async function CustomDomainPage({ params }: PageProps) {
  const { host } = await params;
  const site = await fetchSiteData(host);

  // JSON-LD is a premium feature (SEO Booster); API only returns it for
  // Pro/Enterprise plans — never generate it for free sites.
  const jsonLd = site?.json_ld ?? null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <PublicSite host={host} />
    </>
  );
}
