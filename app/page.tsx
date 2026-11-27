import type { Metadata } from "next";
import LandingPageClient from "./LandingPageClient";
import { siteUrl } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Webjoz | AI Website Builder untuk Bisnis Indonesia",
  description: "Buat website bisnis profesional hanya dalam 5 menit dengan AI. Tanpa coding, tanpa form panjang. Cocok untuk UMKM dan perusahaan Indonesia.",
  keywords: ["ai website builder", "buat website", "website bisnis", "umkm indonesia", "webjoz", "ai website generator"],
  alternates: {
    canonical: siteUrl(),
    languages: {
      id: siteUrl(),
      en: siteUrl("/en"),
    },
  },
  openGraph: {
    title: "Webjoz | AI Website Builder untuk Bisnis Indonesia",
    description: "Buat website bisnis profesional hanya dalam 5 menit dengan AI. Tanpa coding.",
    url: siteUrl(),
    siteName: "Webjoz",
    images: [
      {
        url: siteUrl("/og-id.jpg"),
        width: 1024,
        height: 576,
        alt: "Webjoz | AI Website Builder untuk Bisnis Indonesia",
      },
    ],
    locale: "id_ID",
    alternateLocale: ["en_US"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Webjoz | AI Website Builder untuk Bisnis Indonesia",
    description: "Buat website bisnis profesional hanya dalam 5 menit dengan AI.",
    images: [
      {
        url: siteUrl("/og-id.jpg"),
        alt: "Webjoz | AI Website Builder untuk Bisnis Indonesia",
      },
    ],
  },
};

export default function LandingPage() {
  return <LandingPageClient />;
}
