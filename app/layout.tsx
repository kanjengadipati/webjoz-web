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
  title: "GoKit Dashboard",
  description:
    "A polished Next.js live demo for the Go API Starterkit backend, including auth, audit logs, sessions, and AI investigation.",
};

// Inline script injected synchronously into <head> — runs before first paint
// so the dark class is applied before React hydrates, preventing the white flash.
const themeScript = `
(function() {
  try {
    var theme = localStorage.getItem('go_api_starterkit_theme');
    // Default to dark if no preference is stored
    if (!theme || theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.dataset.theme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.dataset.theme = 'light';
    }
  } catch (e) {
    // localStorage unavailable (SSR / private browsing): default to dark
    document.documentElement.classList.add('dark');
  }
})();
`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
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
