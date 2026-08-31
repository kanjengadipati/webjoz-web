import type { Metadata } from "next";
import Link from "next/link";
import { siteUrl, SUPPORT_EMAIL } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Privacy Policy | Webjoz",
  description:
    "Webjoz Privacy Policy — how we collect, use, and protect user data on our AI website builder platform.",
  keywords: ["privacy policy webjoz", "privacy policy", "data protection"],
  alternates: {
    canonical: siteUrl("/en/privacy-policy"),
    languages: {
      id: siteUrl("/privacy-policy"),
      en: siteUrl("/en/privacy-policy"),
    },
  },
  openGraph: {
    title: "Privacy Policy | Webjoz",
    description:
      "Webjoz Privacy Policy — how we collect, use, and protect user data.",
    url: siteUrl("/en/privacy-policy"),
    siteName: "Webjoz",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Privacy Policy | Webjoz",
    description: "Webjoz Privacy Policy — data protection for our users.",
  },
};

export default function EnPrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <div className="mb-8 flex items-center justify-between gap-4">
          <Link href="/" className="text-xs text-muted-foreground hover:text-foreground transition inline-block">← Back to Home</Link>
          <Link href="/privacy-policy" className="text-xs text-primary hover:underline inline-block">Baca dalam Bahasa Indonesia</Link>
        </div>

        <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mb-10">Last updated: August 16, 2026 · Applies to Webjoz services</p>

        <div className="prose prose-invert max-w-none space-y-8 text-sm leading-relaxed text-foreground/80">

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">1. Introduction</h2>
            <p>
              Giwangan Studio (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) operates the Webjoz platform, accessible at <strong>webjoz.com</strong>. This Privacy Policy explains how we collect, use, store, and protect your personal information when you use our services.
            </p>
            <p className="mt-2">
              We act as a <strong>data controller</strong> and process your personal data in accordance with <strong>Indonesia&apos;s Law No. 27 of 2022 on Personal Data Protection</strong> (&quot;PDP Law&quot;) and its implementing regulations.
            </p>
            <p className="mt-2">
              By using Webjoz, you agree to the practices described in this policy.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">2. Data We Collect</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Account Data:</strong> Name, WhatsApp number, and/or email address you register with.</li>
              <li><strong>Business Data:</strong> Business information you provide to generate a website (business name, description, contacts, etc.).</li>
              <li><strong>Payment Data:</strong> Transaction information is processed through Midtrans. We do not store your credit/debit card data directly.</li>
              <li><strong>Usage Data:</strong> Activity logs, IP address, device type, and browser for security and analytics purposes.</li>
              <li><strong>Cookies:</strong> Session cookies for authentication and user preferences.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">3. Use of Data</h2>
            <p>We use your data to:</p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>Provide and improve the Webjoz services.</li>
              <li>Process subscription payments.</li>
              <li>Send important notifications related to your account and our services.</li>
              <li>Analyze platform usage to improve the product.</li>
              <li>Comply with applicable legal obligations.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">4. Legal Basis for Processing</h2>
            <p>Your personal data is processed on the following legal bases:</p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li><strong>Contract performance</strong> — to provide the services you subscribe to (PDP Law, Article 20).</li>
              <li><strong>Your consent</strong> — for example, for marketing notifications sent separately (PDP Law, Article 20).</li>
              <li><strong>Compliance with legal obligations</strong> — for example, transaction and tax records (PDP Law, Article 21).</li>
            </ul>
            <p className="mt-2">We do not process sensitive personal data (such as health or biometric data) without your explicit consent, except where required by law.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">5. Data Sharing</h2>
            <p>We do <strong>not sell</strong> your personal data to third parties. Data may be shared with:</p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li><strong>Midtrans</strong> — for payment processing.</li>
              <li><strong>Google</strong> — for Google OAuth authentication.</li>
              <li><strong>Cloudinary</strong> — for storing images you upload.</li>
              <li>Legal authorities when required by law.</li>
            </ul>
            <p className="mt-2">
              The parties above act as <strong>data processors (sub-processors)</strong> bound by contract and confidentiality obligations. If your personal data is transferred outside Indonesia, we ensure an equivalent level of protection in accordance with the PDP Law (Articles 56–57).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">6. Data Security</h2>
            <p>
              We apply reasonable technical and organizational security measures, including HTTPS encryption, short-lived JWT tokens, and restricted database access. However, no system is 100% secure.
            </p>
            <p className="mt-2">
              In the event of a personal data breach that could cause harm to you, we will notify you and the relevant authorities <strong>within 3×24 hours (72 hours)</strong> of becoming aware of the breach (PDP Law, Article 46).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">7. Your Rights</h2>
            <p>Under the PDP Law, you have the right to:</p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>Access and download your personal data.</li>
              <li>Request correction of inaccurate data.</li>
              <li>Request <strong>restriction of processing</strong> of your personal data.</li>
              <li>Request <strong>deletion</strong> of your personal data.</li>
              <li>Request <strong>data portability</strong> (receive or transfer data in a readable format).</li>
              <li>Raise an <strong>objection</strong> to data processing.</li>
              <li>Withdraw consent to data processing (this may result in account closure).</li>
              <li>Submit a claim or complaint regarding a personal data protection violation.</li>
            </ul>
            <p className="mt-2">
              To submit such a request, contact us at <strong>{SUPPORT_EMAIL}</strong>. We respond to every request <strong>within 30 (thirty) days</strong> of receipt.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">8. Data Retention</h2>
            <p>
              We keep your account data for as long as your account is active. After account deletion, data is removed within 30 working days, unless longer retention is required by law. Financial transaction and bookkeeping records are retained in accordance with applicable tax regulations (generally 10 years).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">9. Cookies</h2>
            <p>
              Webjoz uses essential cookies for session authentication. We do not use third-party tracking cookies for advertising purposes. You can disable cookies through your browser settings, although some features of the service may not work properly.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">10. Children&apos;s Data</h2>
            <p>
              The Webjoz service is intended for users aged 18 and older. We do not knowingly collect personal data of children under 18 without parental or guardian consent. If you become aware that we have collected a child&apos;s data without such consent, please contact us so we can delete it promptly.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">11. Policy Changes</h2>
            <p>
              We may update this policy from time to time. Significant changes will be communicated by email or through notifications on the platform. The date of the last update is shown at the top of this page.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">12. Contact</h2>
            <p>If you have questions, data subject requests, or complaints regarding this privacy policy, please contact:</p>
            <address className="not-italic mt-2 space-y-1">
              <p><strong>Webjoz Support</strong></p>
              <p>Email: <a href={`mailto:${SUPPORT_EMAIL}`} className="text-primary hover:underline">{SUPPORT_EMAIL}</a></p>
            </address>
          </section>

        </div>
      </div>
    </main>
  );
}
