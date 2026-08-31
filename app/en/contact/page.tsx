import type { Metadata } from "next";
import Link from "next/link";
import { getWhatsAppUrl, formatPhoneNumber, WHATSAPP_CS_NUMBER, SUPPORT_EMAIL, siteUrl } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Contact Us | Webjoz",
  description: "Contact the Webjoz team. We are here to assist you with any questions regarding our AI website builder platform.",
  keywords: ["contact webjoz", "support webjoz", "customer support", "website help"],
  alternates: {
    canonical: siteUrl("/en/contact"),
    languages: {
      id: siteUrl("/contact"),
      en: siteUrl("/en/contact"),
    },
  },
  openGraph: {
    title: "Contact Us | Webjoz",
    description: "Contact the Webjoz team for assistance and inquiries about the AI website builder platform.",
    url: siteUrl("/en/contact"),
    siteName: "Webjoz",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Contact Us | Webjoz",
    description: "Contact the Webjoz team for support and questions.",
  },
};

export default function EnContactPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <Link href="/en" className="text-xs text-muted-foreground hover:text-foreground transition mb-8 inline-block">← Back to Home</Link>

        <h1 className="text-3xl font-bold mb-2">Contact Us</h1>
        <p className="text-sm text-muted-foreground mb-10">Our team is ready to assist you — Monday to Friday, 09:00 – 17:00 WIB (UTC+7).</p>

        <div className="grid gap-6 sm:grid-cols-2 mb-12">
          {/* Email */}
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="flex flex-col gap-2 rounded-2xl border border-border/60 bg-card/40 p-6 hover:border-border transition-colors group"
          >
            <div className="text-2xl">✉️</div>
            <h2 className="font-semibold text-foreground">Email</h2>
            <p className="text-sm text-muted-foreground">{SUPPORT_EMAIL}</p>
            <span className="text-xs text-primary group-hover:underline mt-1">Send an email →</span>
          </a>

          {/* WhatsApp */}
          <a
            href={getWhatsAppUrl("Hello Webjoz, I have a question about the platform.")}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col gap-2 rounded-2xl border border-border/60 bg-card/40 p-6 hover:border-border transition-colors group"
          >
            <div className="text-2xl">💬</div>
            <h2 className="font-semibold text-foreground">WhatsApp</h2>
            <p className="text-sm text-muted-foreground">{formatPhoneNumber(WHATSAPP_CS_NUMBER)}</p>
            <span className="text-xs text-primary group-hover:underline mt-1">Chat now →</span>
          </a>

          {/* Address */}
          <div className="flex flex-col gap-2 rounded-2xl border border-border/60 bg-card/40 p-6">
            <div className="text-2xl">📍</div>
            <h2 className="font-semibold text-foreground">Office Address</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Jl. Malang Wijoyo, Malangan,<br />
              Giwangan, Umbulharjo, Yogyakarta,<br />
              Indonesia
            </p>
          </div>

          {/* Business Hours */}
          <div className="flex flex-col gap-2 rounded-2xl border border-border/60 bg-card/40 p-6">
            <div className="text-2xl">🕐</div>
            <h2 className="font-semibold text-foreground">Business Hours</h2>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>Monday – Friday: 09:00 – 17:00 WIB</p>
              <p>Saturday – Sunday: Closed</p>
            </div>
          </div>
        </div>

        {/* About company */}
        <div className="rounded-2xl border border-border/60 bg-card/40 p-6">
          <h2 className="font-semibold text-foreground mb-3">About Giwangan Studio</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Giwangan Studio</strong> is a technology company based in Yogyakarta that develops <strong className="text-foreground">Webjoz</strong> — an AI-powered website builder platform enabling small businesses and entrepreneurs to launch professional websites quickly and effortlessly. We believe every business deserves a quality digital presence without needing technical expertise.
          </p>
        </div>

        {/* Links to legal pages */}
        <div className="mt-8 flex flex-wrap gap-4 text-xs text-muted-foreground">
          <Link href="/help" className="hover:text-foreground transition">Help Center</Link>
          <Link href="/changelog" className="hover:text-foreground transition">Changelog</Link>
          <Link href="/en/privacy-policy" className="hover:text-foreground transition">Privacy Policy</Link>
          <Link href="/en/terms" className="hover:text-foreground transition">Terms &amp; Conditions</Link>
          <Link href="/en/refund-policy" className="hover:text-foreground transition">Refund Policy</Link>
        </div>
      </div>
    </main>
  );
}
