import type { Metadata } from "next";
import PublicBlogDetail from "@/components/public-blog-detail";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://api.webjoz.com";

type Props = {
  params: Promise<{ subdomain: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { subdomain, slug } = await params;
  const host = `${subdomain}.${process.env.NEXT_PUBLIC_BASE_DOMAIN ?? "webjoz.com"}`;

  try {
    const siteRes = await fetch(`${API_BASE_URL}/public/sites?host=${host}`);
    if (!siteRes.ok) return {};
    const siteEnvelope = await siteRes.json();
    const siteId = siteEnvelope.data?.site?.id;
    if (!siteId) return {};

    const postRes = await fetch(`${API_BASE_URL}/public/sites/${siteId}/blog-posts/${slug}`);
    if (!postRes.ok) return {};
    const postEnvelope = await postRes.json();
    const post = postEnvelope.data;
    if (!post) return {};

    const images = post.cover_image_url ? [post.cover_image_url] : [];

    return {
      title: post.seo_title || post.title,
      description: post.seo_description || post.excerpt,
      openGraph: {
        title: post.seo_title || post.title,
        description: post.seo_description || post.excerpt,
        type: "article",
        ...(images.length > 0 ? { images } : {}),
      },
    };
  } catch {
    return {};
  }
}

export default async function BlogDetailPage({ params }: Props) {
  const { subdomain, slug } = await params;
  return <PublicBlogDetail subdomain={subdomain} slug={slug} routePrefix="/site" />;
}
