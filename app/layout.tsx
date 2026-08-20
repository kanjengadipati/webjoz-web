import type { Metadata, Viewport } from "next";
import { cookies, headers } from "next/headers";
import { Analytics } from "@vercel/analytics/next";
import { Geist, Geist_Mono } from "next/font/google";
import type { Locale } from "@/lib/i18n/translations";
import { LOCALE_STORAGE_KEY } from "@/lib/i18n/context";
import { Providers } from "@/components/providers";
import { SITE_URL, siteUrl } from "@/lib/site-config";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Webjoz — AI Website Builder untuk Bisnis",
  description:
    "Buat website bisnis profesional dalam 5 menit dengan AI. Isi profil bisnis, pilih template, dan website Anda langsung aktif — tanpa coding, tanpa tunggu tim.",
  keywords: [
    "ai website builder",
    "buat website bisnis",
    "website UMKM",
    "webjoz",
    "website otomatis AI",
    "website tanpa coding",
    "landing page AI",
    "website Indonesia",
  ],
  authors: [{ name: "Webjoz", url: SITE_URL }],
  openGraph: {
    title: "Webjoz — AI Website Builder untuk Bisnis",
    description: "Buat website bisnis profesional dalam 5 menit dengan AI.",
    url: SITE_URL,
    siteName: "Webjoz",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Webjoz — AI Website Builder untuk Bisnis",
    description: "Buat website bisnis profesional dalam 5 menit dengan AI.",
    site: "@webjoz",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: siteUrl(),
    languages: {
      id: siteUrl(),
      en: siteUrl("/en"),
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const cookieLocale = (await cookies()).get(LOCALE_STORAGE_KEY)?.value;
  const requestHeaders = await headers();
  const path = requestHeaders.get("x-webjoz-path") || "";
  const pathIsEn = path === "/en" || path.startsWith("/en/");
  const pathIsId = path === "/id" || path.startsWith("/id/");
  const defaultLocale: Locale =
    pathIsEn ? "en" : pathIsId ? "id" : cookieLocale === "en" ? "en" : "id";
  return (
    <html lang={defaultLocale === "en" ? "en-US" : "id-ID"} suppressHydrationWarning data-scroll-behavior="smooth" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}>
      <head />
      <body className="min-h-full font-sans">
        <Providers defaultLocale={defaultLocale}>
          <div className="flex min-h-screen flex-col">
            <div className="flex-1">{children}</div>
          </div>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
