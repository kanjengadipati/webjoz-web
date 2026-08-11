import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import type { Locale } from "@/lib/i18n/translations";

export const metadata: Metadata = {
  metadataBase: new URL("https://webjoz.com"),
  title: "Webjoz | AI Website Builder for Indonesian Businesses",
  description:
    "Build a professional business website in just 5 minutes with AI. No coding, no long forms. Perfect for Indonesian UMKM and companies.",
  keywords: [
    "ai website builder",
    "make a website",
    "business website",
    "umkm indonesia",
    "webjoz",
    "ai website generator",
    "indonesia",
  ],
  alternates: {
    canonical: "https://webjoz.com/en",
    languages: {
      id: "https://webjoz.com",
      en: "https://webjoz.com/en",
    },
  },
  openGraph: {
    title: "Webjoz | AI Website Builder for Indonesian Businesses",
    description: "Build a professional business website in just 5 minutes with AI. No coding, no long forms.",
    url: "https://webjoz.com/en",
    siteName: "Webjoz",
    images: [{ url: "/opengraph-image.png", width: 1200, height: 630 }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Webjoz | AI Website Builder for Indonesian Businesses",
    description: "Build a professional business website in just 5 minutes with AI. No coding, no long forms.",
    images: ["/opengraph-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const EN_LOCALE: Locale = "en";

export default function EnLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <Providers defaultLocale={EN_LOCALE} forcedLocale={EN_LOCALE}>{children}</Providers>;
}
