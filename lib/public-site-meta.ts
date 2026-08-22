import type { Metadata } from "next";
import { API_BASE_URL, BASE_DOMAIN } from "@/lib/site-config";

interface PublicSiteLookupData {
  site: {
    id: number;
    name: string;
    subdomain: string;
    template_id: string;
    status: string;
  };
  content: {
    seo?: {
      meta_title?: string;
      title?: string;
      meta_description?: string;
      description?: string;
      og_image?: string;
      favicon?: string;
      keywords?: string[];
      canonical_path?: string;
      gsc_verification?: string;
      og_site_name?: string;
      og_locale?: string;
    };
    header?: {
      brand_name?: string;
    };
    hero?: {
      headline?: string;
      subheadline?: string;
      image_url?: string;
    };
    about?: {
      description?: string;
    };
    contact?: {
      whatsapp?: string;
      phone?: string;
    };
  };
}

export async function fetchPublicSiteMetadata(hostOrSubdomain: string): Promise<Metadata> {
  const cleanHost = hostOrSubdomain.includes(".")
    ? hostOrSubdomain
    : `${hostOrSubdomain}.${BASE_DOMAIN}`;

  const apiUrl = `${API_BASE_URL}/public/sites/lookup?host=${encodeURIComponent(cleanHost)}`;

  try {
    const res = await fetch(apiUrl, {
      next: { revalidate: 60 }, // Revalidate cache every 60s
    });

    if (!res.ok) {
      return {
        title: "Website Tidak Ditemukan | Webjoz",
        description: "Website ini belum dipublikasikan atau sedang dalam perbaikan.",
      };
    }

    const json = await res.json();
    const data: PublicSiteLookupData = json.data;

    if (!data || !data.site) {
      return {
        title: "Webjoz — AI Website Builder",
      };
    }

    const { site, content } = data;
    const seo = content?.seo || {};
    const hero = content?.hero || {};
    const header = content?.header || {};
    const siteName = header.brand_name || site.name || "Webjoz";

    // Priority 1: SEO Booster user input -> Priority 2: AI Hero content -> Fallback: Site Name
    const title =
      seo.meta_title?.trim() ||
      seo.title?.trim() ||
      (hero.headline?.trim()
        ? `${hero.headline} — ${siteName}`
        : `${siteName} — Website Resmi`);

    const description =
      seo.meta_description?.trim() ||
      seo.description?.trim() ||
      hero.subheadline?.trim() ||
      content?.about?.description?.trim() ||
      `Website resmi ${siteName} dibuat menggunakan Webjoz AI.`;

    const ogImage =
      seo.og_image?.trim() ||
      hero.image_url?.trim() ||
      "https://www.webjoz.com/opengraph-image.png";

    const canonicalUrl = `https://${cleanHost}${seo.canonical_path || ""}`;

    return {
      title,
      description,
      authors: [{ name: siteName }],
      keywords:
        seo.keywords && seo.keywords.length > 0
          ? seo.keywords
          : [siteName, "website", "webjoz"],
      alternates: {
        canonical: canonicalUrl,
      },
      icons: seo.favicon ? { icon: seo.favicon } : undefined,
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
      openGraph: {
        title,
        description,
        url: canonicalUrl,
        siteName: seo.og_site_name || siteName,
        locale: seo.og_locale || "id_ID",
        type: "website",
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [ogImage],
      },
      other: seo.gsc_verification
        ? { "google-site-verification": seo.gsc_verification }
        : {},
    };
  } catch {
    return {
      title: "Webjoz — AI Website Builder",
      description: "Platform pembuat website instan untuk bisnis Anda.",
    };
  }
}
