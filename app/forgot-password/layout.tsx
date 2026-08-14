import type { Metadata } from "next";
import { siteUrl } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Lupa Kata Sandi — Webjoz",
  description:
    "Reset kata sandi akun Webjoz Anda. Masukkan email atau nomor WhatsApp untuk menerima tautan atau kode verifikasi.",
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: siteUrl("/forgot-password"),
  },
  openGraph: {
    title: "Lupa Kata Sandi — Webjoz",
    description: "Reset kata sandi akun Webjoz Anda. Masukkan email atau nomor WhatsApp untuk menerima tautan atau kode verifikasi.",
    url: siteUrl("/forgot-password"),
    siteName: "Webjoz",
    images: [{ url: "/opengraph-image.png", width: 1200, height: 630 }],
    locale: "id_ID",
    type: "website",
  },
};

export default function ForgotPasswordLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
