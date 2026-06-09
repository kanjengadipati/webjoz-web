"use client";

import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "@/lib/config";
import { TemplateKuliner, TemplateJasa, TemplateProduk } from "./templates";
import { Loader2, AlertCircle } from "lucide-react";

interface PublicSiteProps {
  subdomain?: string;
  host?: string;
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

export default function PublicSite({ subdomain, host }: PublicSiteProps) {
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
      return `${subdomain}.giwanganstudio.com`;
    }
    if (typeof window !== "undefined") {
      return window.location.host;
    }
    return "";
  };

  const targetHost = resolveHost();

  useEffect(() => {
    if (!targetHost) return;

    const fetchSite = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/public/sites?host=${targetHost}`);
        if (!res.ok) {
          throw new Error("Situs tidak ditemukan atau belum dipublikasi.");
        }
        const envelope = await res.json();
        if (envelope.status !== "success" || !envelope.data) {
          throw new Error(envelope.message || "Gagal memuat situs.");
        }

        setSiteData({
          ...envelope.data,
          content: stripRegeneratedMarkers(envelope.data.content),
        });
        setError(null);

        // Apply dynamic SEO meta from content
        const seo = envelope.data?.content?.seo;
        if (seo?.favicon_url) {
          let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
          if (!link) {
            link = document.createElement("link");
            link.rel = "icon";
            document.head.appendChild(link);
          }
          link.href = seo.favicon_url;
        }
        if (seo?.title) {
          document.title = seo.title;
        } else if (envelope.data?.site?.name) {
          document.title = envelope.data.site.name;
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
          {error || "Website yang Anda tuju belum terdaftar atau belum selesai dikonfigurasi di dashboard Giwangan Studio."}
        </p>
      </div>
    );
  }

  const { content, template_id } = siteData;

  // Render correct template component
  switch (template_id) {
    case "TEMPLATE_KULINER01":
      return (
        <TemplateKuliner 
          content={content} 
          onSubmitLead={handleSubmitLead} 
          leadSubmitting={leadSubmitting}
          leadSuccess={leadSuccess}
          leadError={leadError}
        />
      );
    case "TEMPLATE_JASA02":
      return (
        <TemplateJasa 
          content={content} 
          onSubmitLead={handleSubmitLead} 
          leadSubmitting={leadSubmitting}
          leadSuccess={leadSuccess}
          leadError={leadError}
        />
      );
    case "TEMPLATE_PRODUK03":
      return (
        <TemplateProduk 
          content={content} 
          onSubmitLead={handleSubmitLead} 
          leadSubmitting={leadSubmitting}
          leadSuccess={leadSuccess}
          leadError={leadError}
        />
      );
    default:
      return (
        <TemplateJasa 
          content={content} 
          onSubmitLead={handleSubmitLead} 
          leadSubmitting={leadSubmitting}
          leadSuccess={leadSuccess}
          leadError={leadError}
        />
      );
  }
}
