import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
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
  metadataBase: new URL("https://app.webjoz.com"),
  title: "Webjoz — AI Website Builder untuk Bisnis",
  description:
    "Buat website bisnis profesional dalam 5 menit dengan AI. Isi profil bisnis, pilih template, dan website Anda langsung aktif — tanpa coding, tanpa tunggu tim.",
  openGraph: {
    title: "Webjoz — AI Website Builder untuk Bisnis",
    description: "Buat website bisnis profesional dalam 5 menit dengan AI.",
    url: "https://app.webjoz.com",
    siteName: "Webjoz",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Webjoz — AI Website Builder untuk Bisnis",
    description: "Buat website bisnis profesional dalam 5 menit dengan AI.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}>
      <head>
        <meta name="robots" content="index, follow" />
      </head>
      <body className="min-h-full font-sans">
        <Providers>
          <div className="flex min-h-screen flex-col">
            <div className="flex-1">{children}</div>
          </div>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
