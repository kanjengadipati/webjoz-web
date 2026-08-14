"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { API_BASE_URL } from "@/lib/config";
import { Loader2, ChevronLeft, Calendar } from "lucide-react";
import { buildCssVars, loadGoogleFont } from "@/components/templates/helpers";
import type { DesignToken } from "@/components/templates/types";
import HeaderSection from "@/components/sections/header";
import FooterSection from "@/components/sections/footer";

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content_html: string;
  cover_image_url?: string;
  status: string;
  published_at: string;
  created_at: string;
}

interface PublicBlogDetailProps {
  subdomain: string;
  slug: string;
  routePrefix?: "/s" | "/site";
}

export default function PublicBlogDetail({
  subdomain,
  slug,
  routePrefix = "/s",
}: PublicBlogDetailProps) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [dt, setDt] = useState<DesignToken | null>(null);
  const [siteContent, setSiteContent] = useState<any>(null);
  const [language, setLanguage] = useState<"id" | "en">("id");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const homeHref = `${routePrefix}/${subdomain}`;
  const blogIndexHref = `${routePrefix}/${subdomain}/blog`;

  useEffect(() => {
    if (!subdomain || !slug) return;
    const fetchPost = async () => {
      try {
        const host = `${subdomain}.${process.env.NEXT_PUBLIC_BASE_DOMAIN ?? "webjoz.com"}`;
        const siteRes = await fetch(`${API_BASE_URL}/public/sites?host=${host}`);
        if (!siteRes.ok) throw new Error("Situs tidak ditemukan");
        const siteEnvelope = await siteRes.json();
        const siteId = siteEnvelope.data?.site?.id;
        if (!siteId) throw new Error("Situs tidak ditemukan");

        setLanguage(siteEnvelope.data?.site?.language === "en" ? "en" : "id");
        const designToken = siteEnvelope.data?.design_token as DesignToken | null;
        setDt(designToken);
        setSiteContent(siteEnvelope.data?.content ?? {});
        loadGoogleFont(designToken?.typography?.heading_font, designToken?.typography?.body_font);

        const postRes = await fetch(`${API_BASE_URL}/public/sites/${siteId}/blog-posts/${slug}`);
        if (!postRes.ok) throw new Error("Postingan tidak ditemukan");
        const postEnvelope = await postRes.json();
        if (postEnvelope.status !== "success" || !postEnvelope.data) {
          throw new Error(postEnvelope.message || "Postingan tidak ditemukan");
        }
        setPost(postEnvelope.data);
      } catch (err: any) {
        setError(err.message || "Gagal memuat postingan");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [subdomain, slug]);

  const cssVars = buildCssVars(dt);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={cssVars}>
        <Loader2 className="w-6 h-6 animate-spin opacity-50" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-sm opacity-60">{error || (language === "en" ? "Post not found" : "Postingan tidak ditemukan")}</p>
        <Link href={homeHref} className="text-sm underline opacity-70 hover:opacity-100">
          {language === "en" ? "Back to home" : "Kembali ke beranda"}
        </Link>
      </div>
    );
  }

  const header = siteContent?.header ?? {};
  const footer = siteContent?.footer ?? {};
  const sectionOrder = (dt?.layout as any)?.section_order ?? ["hero", "about", "benefits", "testimonials", "faq", "cta", "contact"];
  const locale = language === "en" ? "en-US" : "id-ID";

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
        extraLinks={[{ label: "Blog", href: blogIndexHref }]}
      />

      <article className="max-w-3xl mx-auto px-4 py-12">
        <div className="mb-6">
          <Link
            href={blogIndexHref}
            className="inline-flex items-center gap-1.5 text-sm transition-opacity hover:opacity-70 font-medium"
            style={{ color: "var(--dt-text-muted)" }}
          >
            <ChevronLeft className="w-4 h-4" />
            {language === "en" ? "Back to blog" : "Kembali ke blog"}
          </Link>
        </div>

        {post.cover_image_url && (
          <img
            src={post.cover_image_url}
            alt={post.title}
            className="w-full h-64 md:h-96 object-cover mb-8 shadow-sm"
            style={{ borderRadius: "var(--dt-radius-lg, 16px)" }}
            onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        )}

        <h1
          className="text-3xl md:text-5xl font-black mb-4 leading-tight tracking-tight"
          style={{
            color: "var(--dt-text)",
            fontFamily: "var(--dt-heading-font)",
            fontWeight: "var(--dt-heading-weight)",
          }}
        >
          {post.title}
        </h1>

        {post.published_at && (
          <div className="flex items-center gap-4 text-xs mb-8" style={{ color: "var(--dt-text-muted)" }}>
            <span className="flex items-center gap-1.5 font-medium uppercase tracking-wider">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(post.published_at).toLocaleDateString(locale, {
                year: "numeric", month: "long", day: "numeric",
              })}
            </span>
          </div>
        )}

        {post.excerpt && (
          <p className="text-lg md:text-xl font-medium leading-relaxed mb-8 border-l-4 pl-4" style={{ color: "var(--dt-text-muted)", borderColor: "var(--dt-primary)" }}>
            {post.excerpt.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()}
          </p>
        )}

        <div
          className="prose prose-base sm:prose-lg max-w-none prose-headings:font-bold prose-headings:tracking-tight"
          style={{
            color: "var(--dt-text)",
            fontFamily: "var(--dt-body-font)",
          }}
          dangerouslySetInnerHTML={{ __html: post.content_html }}
        />
      </article>

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
