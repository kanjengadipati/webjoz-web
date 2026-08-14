import type { Metadata } from "next";
import { siteUrl } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Masuk — Webjoz | AI Website Builder untuk Bisnis Indonesia",
  description:
    "Masuk ke akun Webjoz untuk mengelola website bisnis Anda yang dibuat dengan AI. Akses dashboard, edit konten, dan pantau performa situs Anda.",
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: siteUrl("/login"),
  },
  openGraph: {
    title: "Masuk — Webjoz",
    description: "Masuk ke akun Webjoz untuk mengelola website bisnis Anda.",
    url: siteUrl("/login"),
    siteName: "Webjoz",
    images: [{ url: "/opengraph-image.png", width: 1200, height: 630 }],
    locale: "id_ID",
    type: "website",
  },
};

export default function LoginLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
