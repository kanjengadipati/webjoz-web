import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Buat Website Gratis dengan AI — Webjoz | 5 Menit Tanpa Coding",
  description:
    "Website bisnis profesional hanya dalam 5 menit. Chat dengan AI, pilih gaya visual, publikasikan gratis. Cocok untuk UMKM dan perusahaan Indonesia.",
  keywords: [
    "buat website gratis",
    "website AI",
    "webjoz",
    "website UMKM",
    "landing page otomatis",
    "website tanpa coding",
  ],
  openGraph: {
    title: "Buat Website Gratis dengan AI — Webjoz",
    description: "Website bisnis profesional dalam 5 menit dengan AI. Tanpa coding, tanpa form panjang.",
    url: "https://webjoz.com/create",
    siteName: "Webjoz",
    images: [{ url: "/opengraph-image.png", width: 1200, height: 630 }],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Buat Website Gratis dengan AI — Webjoz",
    description: "Website bisnis profesional dalam 5 menit dengan AI. Tanpa coding.",
    images: ["/opengraph-image.png"],
  },
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: "https://webjoz.com/create",
  },
};

export default function CreateLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
