import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Buat Website Gratis dalam 1 Menit — Webjoz AI | Tanpa Coding",
  description:
    "Chat dengan AI, website bisnis langsung jadi dalam 1 menit. Gratis, tanpa coding, cocok untuk UMKM dan perusahaan Indonesia.",
  keywords: [
    "buat website gratis",
    "website AI",
    "webjoz",
    "website UMKM",
    "landing page otomatis",
    "website tanpa coding",
  ],
  openGraph: {
    title: "Buat Website Gratis dalam 1 Menit — Webjoz AI",
    description: "Chat dengan AI, website bisnis langsung jadi. Gratis & tanpa coding.",
    url: "https://www.webjoz.com/create",
    siteName: "Webjoz",
    images: [
      {
        url: "https://www.webjoz.com/og-id.jpg",
        width: 1024,
        height: 576,
        alt: "Webjoz AI — Buat Website Bisnis Gratis dalam 1 Menit",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Buat Website Gratis dalam 1 Menit — Webjoz AI",
    description: "Chat dengan AI, website bisnis langsung jadi. Gratis & tanpa coding.",
    images: [
      {
        url: "https://www.webjoz.com/og-id.jpg",
        alt: "Webjoz AI — Buat Website Bisnis Gratis dalam 1 Menit",
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
