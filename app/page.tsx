import type { Metadata } from "next";
import LandingPageClient from "./LandingPageClient";

export const metadata: Metadata = {
  title: "Webjoz | AI Website Builder untuk Bisnis Indonesia",
  description: "Buat website bisnis profesional hanya dalam 5 menit dengan AI. Tanpa coding, tanpa form panjang. Cocok untuk UMKM dan perusahaan Indonesia.",
  keywords: ["ai website builder", "buat website", "website bisnis", "umkm indonesia", "webjoz", "ai website generator"],
  alternates: {
    canonical: "https://webjoz.com",
  },
  openGraph: {
    title: "Webjoz | AI Website Builder untuk Bisnis Indonesia",
    description: "Buat website bisnis profesional hanya dalam 5 menit dengan AI. Tanpa coding.",
    url: "https://webjoz.com",
    siteName: "Webjoz",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Webjoz | AI Website Builder untuk Bisnis Indonesia",
    description: "Buat website bisnis profesional hanya dalam 5 menit dengan AI.",
    images: ["/og-image.png"],
  },
};

export default function LandingPage() {
  return <LandingPageClient />;
}
