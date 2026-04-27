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
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://pleco-console.vercel.app"),
  title: "Pleco Console",
  description:
    "Auth infrastructure admin workspace for Pleco — JWT, RBAC, audit trail, AI investigation.",
  openGraph: {
    title: "Pleco Console",
    description: "Auth infrastructure admin workspace for Pleco — JWT, RBAC, audit trail, AI investigation.",
    url: "https://pleco-console.vercel.app",
    siteName: "Pleco Console",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Pleco Console - Auth Infrastructure Admin Workspace",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pleco Console",
    description: "Auth infrastructure admin workspace for Pleco — JWT, RBAC, audit trail, AI investigation.",
    images: ["/og.png"],
  },
};

// Inline script injected synchronously into <head> — runs before first paint
// so the dark class is applied before React hydrates, preventing the white flash.
const themeScript = `
(function() {
  try {
    var theme = localStorage.getItem('pleco_theme');
    var accent = localStorage.getItem('pleco_accent');

    // Handle Light/Dark Mode
    if (!theme || theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Handle Accent Mode (Monochrome vs Blue)
    if (!accent || accent === 'monochrome') {
      document.documentElement.classList.add('theme-monochrome');
    } else {
      document.documentElement.classList.remove('theme-monochrome');
    }
  } catch (e) {
    document.documentElement.classList.add('dark');
    document.documentElement.classList.add('theme-monochrome');
  }
})();
`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <head>
        {/* eslint-disable-next-line react/no-danger */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full font-sans">
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
