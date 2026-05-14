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
  metadataBase: new URL("https://pleco-console.vercel.app"),
  title: "Pleco Console",
  description:
    "Auth infrastructure admin workspace for Pleco — JWT, RBAC, audit trail, AI investigation.",
  openGraph: {
    title: "Pleco Console",
    description: "Auth infrastructure admin workspace for Pleco — JWT, RBAC, audit trail, AI investigation.",
    url: "https://pleco-console.vercel.app",
    siteName: "Pleco Console",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pleco Console",
    description: "Auth infrastructure admin workspace for Pleco — JWT, RBAC, audit trail, AI investigation.",
  },
  robots: {
    index: true,
    follow: true,
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
  const currentYear = new Date().getFullYear();

  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <meta name="robots" content="index, follow" />
      </head>
      <body className="min-h-full font-sans">
        <Providers>
          <div className="flex min-h-screen flex-col">
            <div className="flex-1">{children}</div>
            <footer className="border-t border-border/40 px-4 py-4 text-center text-xs text-muted-foreground sm:px-6">
              Copyright {currentYear} Pleco. All rights reserved.
            </footer>
          </div>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
