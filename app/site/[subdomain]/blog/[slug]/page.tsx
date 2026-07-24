import type { Metadata } from "next";
import PublicBlogDetail from "@/components/public-blog-detail";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://api.webjoz.com";
const BASE_DOMAIN = process.env.NEXT_PUBLIC_BASE_DOMAIN ?? "webjoz.com";

type Props = {
  params: Promise<{ subdomain: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { subdomain, slug } = await params;
  const host = `${subdomain}.${BASE_DOMAIN}`;

  try {
    const siteRes = await fetch(
      `${API_BASE_URL}/public/sites?host=${host}`,
      { next: { revalidate: 300 } },
    );
    if (!siteRes.ok) return {};
    const siteEnvelope = await siteRes.json();
    const siteId = siteEnvelope.data?.site?.id;
    if (!siteId) return {};

    const postRes = await fetch(
      `${API_BASE_URL}/public/sites/${siteId}/blog-posts/${slug}`,
      { next: { revalidate: 300 } },
    );
    if (!postRes.ok) return {};
    const postEnvelope = await postRes.json();
    const post = postEnvelope.data;
    if (!post) return {};

    const seo = siteEnvelope.data?.content?.seo ?? {};
    const siteName = siteEnvelope.data?.content?.header?.brand_name || siteEnvelope.data?.site?.name || "";
    const siteUrl = `https://${subdomain}.${BASE_DOMAIN}`;
    const images = post.cover_image_url ? [{ url: post.cover_image_url }] : [];

    return {
      title: post.seo_title || post.title,
      description: post.seo_description || post.excerpt,
      robots: { index: !post.noindex, follow: true },
      alternates: { canonical: `${siteUrl}/blog/${slug}` },
      openGraph: {
        title: post.seo_title || post.title,
        description: post.seo_description || post.excerpt,
        type: "article",
        url: `${siteUrl}/blog/${slug}`,
        siteName: seo.og_site_name || siteName,
        locale: seo.og_locale || "id_ID",
        ...(images.length > 0 ? { images } : {}),
        ...(post.published_at ? { publishedTime: post.published_at } : {}),
        ...(post.created_at ? { modifiedTime: post.created_at } : {}),
      },
      twitter: {
        card: "summary_large_image",
        title: post.seo_title || post.title,
        description: post.seo_description || post.excerpt,
        ...(post.cover_image_url ? { images: [post.cover_image_url] } : {}),
      },
    };
  } catch {
    return {};
  }
}

export default async function BlogDetailPage({ params }: Props) {
  const { subdomain, slug } = await params;
  return (
    <PublicBlogDetail subdomain={subdomain} slug={slug} routePrefix="/site" />
  );
}
