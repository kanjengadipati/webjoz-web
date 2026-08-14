import type { Metadata } from "next";
import { siteUrl } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Daftar Gratis — Webjoz | Buat Website Bisnis dengan AI",
  description:
    "Daftar gratis di Webjoz dan buat website bisnis profesional dalam 5 menit dengan AI. Tanpa coding, tanpa kartu kredit. Cocok untuk UMKM Indonesia.",
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: siteUrl("/register"),
  },
  openGraph: {
    title: "Daftar Gratis — Webjoz",
    description: "Daftar gratis dan buat website bisnis profesional dalam 5 menit dengan AI.",
    url: siteUrl("/register"),
    siteName: "Webjoz",
    images: [{ url: "/opengraph-image.png", width: 1200, height: 630 }],
    locale: "id_ID",
    type: "website",
  },
};

export default function RegisterLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
