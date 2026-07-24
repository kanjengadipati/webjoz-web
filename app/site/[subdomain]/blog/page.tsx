import type { Metadata } from "next";
import PublicBlogIndex from "@/components/public-blog-index";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://api.webjoz.com";
const BASE_DOMAIN = process.env.NEXT_PUBLIC_BASE_DOMAIN ?? "webjoz.com";

type Props = {
  params: Promise<{ subdomain: string }>;
};

async function fetchSiteData(subdomain: string) {
  const host = `${subdomain}.${BASE_DOMAIN}`;
  const res = await fetch(
    `${API_BASE_URL}/public/sites?host=${host}`,
    { next: { revalidate: 300 } },
  );
  if (!res.ok) return null;
  const envelope = await res.json();
  if (envelope.status !== "success" || !envelope.data) return null;
  return envelope.data;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { subdomain } = await params;
  const site = await fetchSiteData(subdomain);
  if (!site) return {};

  const seo = site.content?.seo ?? {};
  const header = site.content?.header ?? {};
  const siteName = header.brand_name || site.site?.name || "";
  const siteUrl = `https://${subdomain}.${BASE_DOMAIN}`;

  return {
    title: `${seo.title || siteName} — Blog`,
    description: seo.description || `Artikel dan berita terbaru dari ${siteName}.`,
    robots: { index: true, follow: true },
    alternates: { canonical: `${siteUrl}/blog` },
    openGraph: {
      title: `${seo.title || siteName} — Blog`,
      description: seo.description || `Artikel dan berita terbaru dari ${siteName}.`,
      url: `${siteUrl}/blog`,
      siteName: seo.og_site_name || siteName,
      locale: seo.og_locale || "id_ID",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${seo.title || siteName} — Blog`,
      description: seo.description || `Artikel dan berita terbaru dari ${siteName}.`,
    },
  };
}

export default async function BlogIndexPage({ params }: Props) {
  const { subdomain } = await params;
  return (
    <PublicBlogIndex subdomain={subdomain} routePrefix="/site" />
  );
}
