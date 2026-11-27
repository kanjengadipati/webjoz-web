import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Buat Website Gratis dengan AI — Webjoz | Cepat & Mudah",
  description:
    "Chat singkat dengan AI, website bisnis langsung jadi. Gratis, cepat, dan mudah tanpa coding. Cocok untuk UMKM dan perusahaan Indonesia.",
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
    description: "Chat dengan AI, website bisnis langsung jadi. Gratis, cepat & tanpa coding.",
    url: "https://www.webjoz.com/create",
    siteName: "Webjoz",
    images: [
      {
        url: "https://www.webjoz.com/og-id.jpg",
        width: 1024,
        height: 576,
        alt: "Webjoz AI — Buat Website Bisnis Gratis dengan AI",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Buat Website Gratis dengan AI — Webjoz",
    description: "Chat dengan AI, website bisnis langsung jadi. Gratis, cepat & tanpa coding.",
    images: [
      {
        url: "https://www.webjoz.com/og-id.jpg",
        alt: "Webjoz AI — Buat Website Bisnis Gratis dengan AI",
      },
    ],
  },
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: "https://www.webjoz.com/create",
  },
};

export default function CreateLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
