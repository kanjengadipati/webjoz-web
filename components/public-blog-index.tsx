"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { API_BASE_URL } from "@/lib/config";
import { Loader2 } from "lucide-react";
import { buildCssVars, loadGoogleFont } from "@/components/templates/helpers";
import type { DesignToken } from "@/components/templates/types";
import HeaderSection from "@/components/sections/header";
import FooterSection from "@/components/sections/footer";

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  cover_image_url?: string;
  published_at: string;
}

export type BlogIndexVariant = "grid" | "list" | "featured" | "minimal";

/** Strip HTML tags and collapse whitespace — guards against corrupted excerpts in DB */
function stripHtml(s: string): string {
  if (!s) return "";
  return s.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

// ---------------------------------------------------------------------------
// Card / row components — all use CSS vars from design token
// ---------------------------------------------------------------------------

function BlogCardGrid({ post, detailHref, compact = false, locale = "id-ID" }: { post: BlogPost; detailHref: string; compact?: boolean; locale?: string }) {
  const excerpt = stripHtml(post.excerpt);
  return (
    <Link href={detailHref} className="block group">
      {post.cover_image_url && (
        <img
          src={post.cover_image_url}
          alt={post.title}
          className={`w-full ${compact ? "h-32" : "h-48"} object-cover mb-3`}
          style={{ borderRadius: "var(--dt-radius, 8px)" }}
          onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
        />
      )}
      <h2
        className={`font-bold group-hover:opacity-80 transition-opacity ${compact ? "text-base" : "text-xl"}`}
        style={{ color: "var(--dt-text)", fontFamily: "var(--dt-heading-font)", fontWeight: "var(--dt-heading-weight)" }}
      >
        {post.title}
      </h2>
      {!compact && excerpt && (
        <p className="text-sm mt-1 line-clamp-2" style={{ color: "var(--dt-text-muted, color-mix(in srgb, var(--dt-text) 70%, var(--dt-bg)))" }}>
          {excerpt}
        </p>
      )}
      {post.published_at && (
        <p className="text-xs mt-2 opacity-50">
          {new Date(post.published_at).toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" })}
        </p>
      )}
    </Link>
  );
}

function BlogRowList({ post, detailHref, locale = "id-ID" }: { post: BlogPost; detailHref: string; locale?: string }) {
  const excerpt = stripHtml(post.excerpt);
  return (
    <Link href={detailHref} className="flex gap-4 py-5 group" style={{ borderBottom: "1px solid var(--dt-border)" }}>
      {post.cover_image_url && (
        <img
          src={post.cover_image_url}
          alt={post.title}
          className="w-24 h-24 object-cover shrink-0"
          style={{ borderRadius: "var(--dt-radius, 8px)" }}
          onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
        />
      )}
      <div className="min-w-0">
        <h2
          className="font-bold group-hover:opacity-80 transition-opacity"
          style={{ color: "var(--dt-text)", fontFamily: "var(--dt-heading-font)" }}
        >
          {post.title}
        </h2>
        {excerpt && (
          <p className="text-sm mt-1 line-clamp-2" style={{ color: "var(--dt-text-muted, color-mix(in srgb, var(--dt-text) 70%, var(--dt-bg)))" }}>
            {excerpt}
          </p>
        )}
        {post.published_at && (
          <p className="text-xs mt-2 opacity-50">
            {new Date(post.published_at).toLocaleDateString(locale, { year: "numeric", month: "long", day: "numeric" })}
          </p>
        )}
      </div>
    </Link>
  );
}

function BlogCardFeatured({ post, detailHref, locale = "id-ID" }: { post: BlogPost; detailHref: string; locale?: string }) {
  const excerpt = stripHtml(post.excerpt);
  return (
    <Link href={detailHref} className="block group">
      {post.cover_image_url && (
        <img
          src={post.cover_image_url}
          alt={post.title}
          className="w-full h-80 object-cover mb-4"
          style={{ borderRadius: "var(--dt-radius-lg, 16px)" }}
          onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
        />
      )}
      <h2
        className="text-3xl font-bold group-hover:opacity-80 transition-opacity"
        style={{ color: "var(--dt-text)", fontFamily: "var(--dt-heading-font)", fontWeight: "var(--dt-heading-weight)" }}
      >
        {post.title}
      </h2>
      {excerpt && (
        <p className="mt-2" style={{ color: "var(--dt-text-muted, color-mix(in srgb, var(--dt-text) 70%, var(--dt-bg)))" }}>
          {excerpt}
        </p>
      )}
      {post.published_at && (
        <p className="text-xs mt-2 opacity-50">
          {new Date(post.published_at).toLocaleDateString(locale, { year: "numeric", month: "long", day: "numeric" })}
        </p>
      )}
    </Link>
  );
}

// Minimal: no image — intentional for warm-earthy / retro moods (text-first).
function BlogRowMinimal({ post, detailHref, locale = "id-ID" }: { post: BlogPost; detailHref: string; locale?: string }) {
  return (
    <Link href={detailHref} className="block group py-3" style={{ borderBottom: "1px solid var(--dt-border)" }}>
      <h2
        className="font-semibold group-hover:opacity-70 transition-opacity"
        style={{ color: "var(--dt-text)", fontFamily: "var(--dt-heading-font)" }}
      >
        {post.title}
      </h2>
      <p className="text-xs mt-0.5" style={{ color: "var(--dt-text-muted, color-mix(in srgb, var(--dt-text) 70%, var(--dt-bg)))" }}>
        {new Date(post.published_at).toLocaleDateString(locale, {
          year: "numeric", month: "long", day: "numeric",
        })}
      </p>
    </Link>
  );
}

// ---------------------------------------------------------------------------
// Layout switch (exported for reuse in preview/[id]/blog page)
// ---------------------------------------------------------------------------

export function BlogIndexContent({
  posts,
  variant,
  buildDetailHref,
  language = "id",
}: {
  posts: BlogPost[];
  variant: BlogIndexVariant;
  buildDetailHref: (slug: string) => string;
  language?: "id" | "en";
}) {
  const locale = language === "en" ? "en-US" : "id-ID";
  if (variant === "list") {
    return (
      <div>
        {posts.map(p => <BlogRowList key={p.slug} post={p} detailHref={buildDetailHref(p.slug)} locale={locale} />)}
      </div>
    );
  }
  if (variant === "featured") {
    const [first, ...rest] = posts;
    return (
      <div className="space-y-10">
        {first && <BlogCardFeatured post={first} detailHref={buildDetailHref(first.slug)} locale={locale} />}
        {rest.length > 0 && (
          <div>
            <div
              className="text-xs font-semibold uppercase tracking-widest mb-4"
              style={{ color: "var(--dt-text-muted)" }}
            >
              {language === "en" ? "More Articles" : "Artikel Lainnya"}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {rest.map(p => <BlogCardGrid key={p.slug} post={p} compact detailHref={buildDetailHref(p.slug)} locale={locale} />)}
            </div>
          </div>
        )}
      </div>
    );
  }
  if (variant === "minimal") {
    return (
      <div>
        {posts.map(p => <BlogRowMinimal key={p.slug} post={p} detailHref={buildDetailHref(p.slug)} locale={locale} />)}
      </div>
    );
  }
  // default: grid
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {posts.map(p => <BlogCardGrid key={p.slug} post={p} detailHref={buildDetailHref(p.slug)} locale={locale} />)}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main exported component
// ---------------------------------------------------------------------------

interface PublicBlogIndexProps {
  subdomain: string;
  routePrefix?: "/s" | "/site";
}

export default function PublicBlogIndex({ subdomain, routePrefix = "/s" }: PublicBlogIndexProps) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [variant, setVariant] = useState<BlogIndexVariant>("grid");
  const [dt, setDt] = useState<DesignToken | null>(null);
  const [siteContent, setSiteContent] = useState<any>(null);
  const [language, setLanguage] = useState<"id" | "en">("id");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const buildDetailHref = (slug: string) => `${routePrefix}/${subdomain}/blog/${slug}`;
  const homeHref = `${routePrefix}/${subdomain}`;

  useEffect(() => {
    if (!subdomain) return;
    const fetchData = async () => {
      try {
        const host = `${subdomain}.${process.env.NEXT_PUBLIC_BASE_DOMAIN ?? "webjoz.com"}`;
        const siteRes = await fetch(`${API_BASE_URL}/public/sites?host=${host}`);
        if (!siteRes.ok) throw new Error("Situs tidak ditemukan");
        const siteData = (await siteRes.json()).data;
        const siteId = siteData?.site?.id;
        if (!siteId) throw new Error("Situs tidak ditemukan");

        setLanguage(siteData?.site?.language === "en" ? "en" : "id");
        const designToken = siteData?.design_token as DesignToken | null;
        setDt(designToken);
        setSiteContent(siteData?.content ?? {});
        loadGoogleFont(designToken?.typography?.heading_font, designToken?.typography?.body_font);
        setVariant((designToken?.layout as any)?.blog_index_variant ?? "grid");

        const postsRes = await fetch(`${API_BASE_URL}/public/sites/${siteId}/blog-posts`);
        if (!postsRes.ok) throw new Error("Gagal memuat postingan");
        setPosts((await postsRes.json()).data ?? []);
      } catch (err: any) {
        setError(err.message ?? "Terjadi kesalahan");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [subdomain]);

  const cssVars = buildCssVars(dt);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={cssVars}>
        <Loader2 className="w-6 h-6 animate-spin opacity-50" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-sm opacity-60">{error}</p>
        <Link href={homeHref} className="text-sm underline opacity-70 hover:opacity-100">{language === "en" ? "Back to home" : "Kembali ke beranda"}</Link>
      </div>
    );
  }

  const header = siteContent?.header ?? {};
  const footer = siteContent?.footer ?? {};
  const sectionOrder = (dt?.layout as any)?.section_order ?? ["hero", "about", "benefits", "testimonials", "faq", "cta", "contact"];

  return (
    <div
      style={{
        ...cssVars,
        background: "var(--dt-bg)",
        color: "var(--dt-text)",
        fontFamily: "var(--dt-body-font)",
        minHeight: "100vh",
      }}
    >
      {/* Site header — same as main page */}
      <HeaderSection
        header={header}
        design_token={dt}
        sectionOrder={sectionOrder}
        hiddenSections={dt?.layout?.hidden_sections}
        language={language}
        extraLinks={[{ label: "Blog", href: `${routePrefix}/${subdomain}/blog` }]}
      />

      {/* Blog content */}
      <main className="max-w-3xl mx-auto px-4 py-12">
        {/* Page title */}
        <div className="mb-10">
          <h1
            className="text-3xl font-black tracking-tight"
            style={{ color: "var(--dt-text)", fontFamily: "var(--dt-heading-font)", fontWeight: "var(--dt-heading-weight)" }}
          >
            Blog
          </h1>
          {posts.length > 0 && (
            <p className="mt-1 text-sm" style={{ color: "var(--dt-text-muted)" }}>
              {language === "en"
                ? `${posts.length} ${posts.length === 1 ? "article published" : "articles published"}`
                : `${posts.length} artikel diterbitkan`}
            </p>
          )}
        </div>

        {posts.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-sm opacity-50">{language === "en" ? "No posts published yet." : "Belum ada postingan yang diterbitkan."}</p>
            <Link
              href={homeHref}
              className="mt-4 inline-block text-sm font-medium underline underline-offset-4 opacity-70 hover:opacity-100 transition-opacity"
            >
              ← {language === "en" ? "Back to home" : "Kembali ke beranda"}
            </Link>
          </div>
        ) : (
          <BlogIndexContent posts={posts} variant={variant} buildDetailHref={buildDetailHref} language={language} />
        )}
      </main>

      {/* Site footer — same as main page */}
      <FooterSection
        footer={footer}
        design_token={dt}
        brand_name={header?.brand_name}
        hasBlog
      />
    </div>
  );
}
