"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { API_BASE_URL } from "@/lib/config";
import { Loader2 } from "lucide-react";
import { BlogIndexContent } from "@/components/public-blog-index";
import { buildCssVars, loadGoogleFont } from "@/components/templates/helpers";
import type { BlogPost, BlogIndexVariant } from "@/components/public-blog-index";
import type { DesignToken } from "@/components/templates/types";
import HeaderSection from "@/components/sections/header";
import FooterSection from "@/components/sections/footer";

export default function PreviewBlogIndexPage() {
  const { id } = useParams();
  const siteId = Number(id);

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [variant, setVariant] = useState<BlogIndexVariant>("grid");
  const [siteContent, setSiteContent] = useState<any>(null);
  const [dt, setDt] = useState<DesignToken | null>(null);
  const [language, setLanguage] = useState<"id" | "en">("id");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const buildDetailHref = (slug: string) => `/preview/${siteId}/blog/${slug}`;
  const homeHref = `/preview/${siteId}`;

  useEffect(() => {
    if (!siteId) return;
    const fetchData = async () => {
      try {
        const siteRes = await fetch(`${API_BASE_URL}/public/sites?site_id=${siteId}`);
        if (!siteRes.ok) throw new Error("Situs tidak ditemukan");
        const siteEnvelope = await siteRes.json();
        const siteData = siteEnvelope.data;

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
  }, [siteId]);

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
        <Link href={homeHref} className="text-sm underline opacity-70 hover:opacity-100">
          {language === "en" ? "Back to home" : "Kembali ke beranda"}
        </Link>
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
        extraLinks={[{ label: "Blog", href: `/preview/${siteId}/blog` }]}
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
