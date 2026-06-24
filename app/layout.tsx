import type { Metadata } from "next";
import Script from "next/script";
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

// Inline script injected synchronously before first paint — applies dark/accent
// class before React hydrates to prevent the white flash on page load.
const themeScript = `
(function() {
  try {
    var theme = localStorage.getItem('webjoz_theme');
    var accent = localStorage.getItem('webjoz_accent');
    var html = document.documentElement;

    // Handle Light/Dark Mode
    if (!theme || theme === 'dark') {
      html.classList.add('dark');
      // Prevent white flash: force dark background before CSS is parsed
      html.style.backgroundColor = '#0f0f17';
      html.style.color = '#f5f5f7';
    } else {
      html.classList.remove('dark');
      html.style.backgroundColor = '#f9f9fb';
      html.style.color = '#1a1a2e';
    }

    // Handle Accent Mode (Blue vs Monochrome)
    if (accent && accent !== 'monochrome') {
      html.classList.add('theme-blue');
    }

    // Clean up inline style after CSS loads
    // Remove the forced background/color after a small delay
    // so the CSS variable values take over seamlessly
    setTimeout(function() {
      html.style.backgroundColor = '';
      html.style.color = '';
    }, 1);
  } catch (e) {
    document.documentElement.classList.add('dark');
    document.documentElement.style.backgroundColor = '#0f0f17';
    setTimeout(function() { document.documentElement.style.backgroundColor = ''; }, 1);
  }
})();
`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <head>
        {/*
          next/script with strategy="beforeInteractive" injects the script into the
          HTML before hydration — required in Next.js 16 (React 19) because React 19
          no longer executes plain <script dangerouslySetInnerHTML> tags inside components.
        */}
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeScript }}
        />
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
