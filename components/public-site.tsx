"use client";

import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "@/lib/config";
import { Loader2, AlertCircle } from "lucide-react";
import { getTemplate } from "@/lib/template-registry";

interface PublicSiteProps {
  subdomain?: string;
  host?: string;
  siteId?: number;
}

const stripRegeneratedMarkers = (value: any): any => {
  if (typeof value === "string") {
    return value.replace(/\s*\(Regenerated\)/gi, "").replace(/\s{2,}/g, " ").trim();
  }
  if (Array.isArray(value)) {
    return value.map(stripRegeneratedMarkers);
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, stripRegeneratedMarkers(item)])
    );
  }
  return value;
};

export default function PublicSite({ subdomain, host, siteId }: PublicSiteProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [siteData, setSiteData] = useState<any>(null);

  // Lead states
  const [leadSubmitting, setLeadSubmitting] = useState(false);
  const [leadSuccess, setLeadSuccess] = useState(false);
  const [leadError, setLeadError] = useState<string | null>(null);

  const resolveHost = () => {
    if (host) return host;
    if (subdomain) {
      if (typeof window !== "undefined") {
        const currentHost = window.location.host;
        // Path-based local dev: localhost:3000/s/[subdomain]
        // Still query API as subdomain.localhost:3000 so the server matches the site record
        if (currentHost === "localhost:3000" || currentHost === "127.0.0.1:3000") {
          return `${subdomain}.localhost:3000`;
        }
        // Subdomain-based local dev (fallback): cafe-jogja.localhost:3000
        if (currentHost.includes("localhost") || currentHost.includes("127.0.0.1")) {
          return currentHost;
        }
      }
      return `${subdomain}.${process.env.NEXT_PUBLIC_BASE_DOMAIN ?? "webjoz.com"}`;
    }
    if (typeof window !== "undefined") {
      return window.location.host;
    }
    return "";
  };

  const targetHost = resolveHost();

  useEffect(() => {
    if (!targetHost && !siteId) return;

    const fetchSite = async () => {
      try {
        setLoading(true);
        const endpoint = siteId 
          ? `${API_BASE_URL}/public/sites?site_id=${siteId}`
          : `${API_BASE_URL}/public/sites?host=${targetHost}`;
          
        const res = await fetch(endpoint);
        if (!res.ok) {
          throw new Error("Situs tidak ditemukan atau belum dipublikasi.");
        }
        const envelope = await res.json();
        if (envelope.status !== "success" || !envelope.data) {
          throw new Error(envelope.message || "Gagal memuat situs.");
        }

        const siteInfo = envelope.data?.site;
        let blogPosts: any[] = [];
        if (siteInfo?.id) {
          try {
            const blogRes = await fetch(`${API_BASE_URL}/public/sites/${siteInfo.id}/blog-posts`);
            if (blogRes.ok) {
              const blogEnvelope = await blogRes.json();
              if (blogEnvelope.status === "success" && Array.isArray(blogEnvelope.data)) {
                blogPosts = blogEnvelope.data;
              }
            }
          } catch {}
        }

        setSiteData({
          ...envelope.data,
          content: {
            ...stripRegeneratedMarkers(envelope.data.content),
            blog: blogPosts.length > 0 ? { posts: blogPosts } : undefined,
          },
        });
        setError(null);

        // Apply dynamic SEO meta from content
        const seo = envelope.data?.content?.seo;
        const siteName = siteInfo?.name || "";
        const subdomain = siteInfo?.subdomain || "";
        const templateId = envelope.data?.template_id || "";

        // Favicon
        if (seo?.favicon_url) {
          let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
          if (!link) {
            link = document.createElement("link");
            link.rel = "icon";
            document.head.appendChild(link);
          }
          link.href = seo.favicon_url;
        }

        // Title
        if (seo?.title) {
          document.title = seo.title;
        } else if (siteName) {
          document.title = siteName;
        }

        // Meta description
        const desc = seo?.description || "";
        let metaDesc = document.querySelector('meta[name="description"]') as HTMLMetaElement;
        if (!metaDesc) {
          metaDesc = document.createElement("meta");
          metaDesc.name = "description";
          document.head.appendChild(metaDesc);
        }
        metaDesc.content = desc;

        // OG tags
        const setMeta = (prop: string, name: string, content: string) => {
          if (!content) return;
          let el = document.querySelector(`meta[${prop}="${name}"]`) as HTMLMetaElement;
          if (!el) {
            el = document.createElement("meta");
            el.setAttribute(prop, name);
            document.head.appendChild(el);
          }
          el.content = content;
        };
        setMeta("property", "og:title", seo?.title || siteName);
        setMeta("property", "og:description", desc);
        setMeta("property", "og:image", seo?.og_image_url || "");
        setMeta("property", "og:type", seo?.og_type || "website");
        setMeta("property", "og:locale", seo?.og_locale || "id_ID");
        setMeta("property", "og:site_name", seo?.og_site_name || siteName);
        setMeta("property", "og:url", window.location.href);

        setMeta("name", "twitter:card", seo?.twitter_card || "summary_large_image");
        setMeta("name", "twitter:title", seo?.title || siteName);
        setMeta("name", "twitter:description", desc);
        setMeta("name", "twitter:image", seo?.og_image_url || "");

        // Robots
        setMeta("name", "robots", seo?.robots || "index, follow");

        // Canonical
        let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
        const canonicalPath = seo?.canonical_path || "/";
        if (canonical) {
          canonical.href = window.location.origin + canonicalPath;
        } else {
          canonical = document.createElement("link");
          canonical.rel = "canonical";
          canonical.href = window.location.origin + canonicalPath;
          document.head.appendChild(canonical);
        }

        // JSON-LD — already server-rendered in page.tsx; skip if present

        // Inject Google Search Console verification meta tag
        const trackingCodes = envelope.data?.tracking_codes;
        if (trackingCodes?.gsc_verification) {
          const gscMeta = 'meta[name="google-site-verification"]';
          let el = document.querySelector(gscMeta) as HTMLMetaElement;
          if (!el) {
            el = document.createElement("meta");
            el.name = "google-site-verification";
            document.head.appendChild(el);
          }
          el.content = trackingCodes.gsc_verification;
        }

        // Inject GA4  script
        if (trackingCodes?.ga4_id) {
          if (!document.querySelector(`script[src*="gtag/js?id=${trackingCodes.ga4_id}"]`)) {
            const gaScript = document.createElement("script");
            gaScript.async = true;
            gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${trackingCodes.ga4_id}`;
            document.head.appendChild(gaScript);
          }
          if (!window.hasOwnProperty("gtag")) {
            const inline = document.createElement("script");
            inline.textContent = `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${trackingCodes.ga4_id}');
            `;
            document.head.appendChild(inline);
          }
        }

        // Inject Meta Pixel script
        if (trackingCodes?.meta_pixel_id) {
          if (!document.querySelector(`script[data-pixel-id="${trackingCodes.meta_pixel_id}"]`)) {
            const pixelScript = document.createElement("script");
            pixelScript.setAttribute("data-pixel-id", trackingCodes.meta_pixel_id);
            pixelScript.textContent = `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${trackingCodes.meta_pixel_id}');
              fbq('track', 'PageView');
            `;
            document.head.appendChild(pixelScript);
          }
        }

        // Track pageview on success
        try {
          await fetch(`${API_BASE_URL}/public/pageview`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              site_id: envelope.data.site.id,
              path: window.location.pathname,
              referrer: document.referrer || "Direct",
            }),
          });
        } catch (pvErr) {
          console.warn("Failed to track pageview:", pvErr);
        }

      } catch (err: any) {
        setError(err.message || "Terjadi kesalahan koneksi.");
      } finally {
        setLoading(false);
      }
    };

    fetchSite();
  }, [targetHost]);

  const handleSubmitLead = async (data: { name: string; email: string; phone: string; message: string }) => {
    if (!siteData) return;
    try {
      setLeadSubmitting(true);
      setLeadError(null);
      
      const res = await fetch(`${API_BASE_URL}/public/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          site_id: siteData.site.id,
          name: data.name,
          email: data.email,
          phone: data.phone,
          message: data.message,
          source_url: window.location.href,
        }),
      });

      const envelope = await res.json();
      if (!res.ok || envelope.status !== "success") {
        throw new Error(envelope.message || "Gagal mengirim formulir.");
      }

      setLeadSuccess(true);
    } catch (err: any) {
      setLeadError(err.message || "Gagal mengirim pesan. Silakan coba beberapa saat lagi.");
    } finally {
      setLeadSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-slate-100 gap-4">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
        <p className="text-sm font-medium tracking-wide text-slate-400">Memuat website Anda...</p>
      </div>
    );
  }

  if (error || !siteData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-slate-100 px-6 text-center gap-4">
        <div className="w-16 h-16 bg-red-500/10 text-red-400 border border-red-500/20 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(248,113,113,0.1)]">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-white">Situs Tidak Aktif</h1>
        <p className="text-slate-400 max-w-md text-sm leading-relaxed">
          {error || "Website yang Anda tuju belum terdaftar atau belum selesai dikonfigurasi di dashboard Webjoz."}
        </p>
      </div>
    );
  }

  const { content, template_id, design_token, is_premium } = siteData;
  const siteInfo = siteData.site;

  const TemplateComponent = getTemplate(template_id)?.component ?? getTemplate("TEMPLATE_JASA02")!.component;

  const showDomainBanner = siteId && siteInfo?.status === "published";
  const domainUrl = siteInfo?.subdomain
    ? `https://${siteInfo.subdomain}.${process.env.NEXT_PUBLIC_BASE_DOMAIN ?? "webjoz.com"}`
    : null;

  useEffect(() => {
    if (siteData?.site?.language && typeof document !== "undefined") {
      document.documentElement.lang = siteData.site.language === "en" ? "en" : "id";
    }
  }, [siteData]);

  return (
    <>
      {showDomainBanner && domainUrl && (
        <div className="w-full bg-emerald-600/10 border-b border-emerald-600/20 px-4 py-2 text-center text-sm text-emerald-400">
          Situs ini sudah live di{" "}
          <a
            href={domainUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold underline hover:text-emerald-300"
          >
            {domainUrl}
          </a>
        </div>
      )}
      <TemplateComponent
        content={content}
        design_token={design_token ?? null}
        onSubmitLead={handleSubmitLead}
        leadSubmitting={leadSubmitting}
        leadSuccess={leadSuccess}
        leadError={leadError}
        isPremium={is_premium === true}
        language={siteInfo?.language === "en" ? "en" : "id"}
      />
    </>
  );
}
