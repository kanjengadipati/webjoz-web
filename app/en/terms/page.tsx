import type { Metadata } from "next";
import Link from "next/link";
import { siteUrl } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Terms & Conditions | Webjoz",
  description:
    "Webjoz Terms and Conditions — the rules for using the Webjoz AI website builder platform.",
  keywords: ["webjoz terms", "terms of service", "webjoz usage rules"],
  alternates: {
    canonical: siteUrl("/en/terms"),
    languages: {
      id: siteUrl("/terms"),
      en: siteUrl("/en/terms"),
    },
  },
  openGraph: {
    title: "Terms & Conditions | Webjoz",
    description:
      "Webjoz Terms and Conditions — the rules for using the Webjoz AI website builder platform.",
    url: siteUrl("/en/terms"),
    siteName: "Webjoz",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Terms & Conditions | Webjoz",
    description: "Webjoz Terms and Conditions — the rules for using Webjoz.",
  },
};

export default function EnTermsPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <div className="mb-8 flex items-center justify-between gap-4">
          <Link href="/" className="text-xs text-muted-foreground hover:text-foreground transition inline-block">← Back to Home</Link>
          <Link href="/terms" className="text-xs text-primary hover:underline inline-block">Baca dalam Bahasa Indonesia</Link>
        </div>

        <h1 className="text-3xl font-bold mb-2">Terms &amp; Conditions</h1>
        <p className="text-sm text-muted-foreground mb-10">Last updated: July 2025 · Applies to Webjoz services</p>

        <div className="prose prose-invert max-w-none space-y-8 text-sm leading-relaxed text-foreground/80">

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">1. Acceptance of Terms</h2>
            <p>
              By registering and using Webjoz, you fully agree to these Terms &amp; Conditions. If you do not agree with these terms, please stop using the service. The Webjoz service is operated by <strong>Giwangan Studio</strong>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">2. Service Description</h2>
            <p>
              Webjoz is a Software as a Service (SaaS) platform that allows users to create, manage, and publish business websites using artificial intelligence (AI) technology. Services include:
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>Automated AI-based website content generation.</li>
              <li>Website hosting on a <strong>webjoz.com</strong> subdomain.</li>
              <li>Content, SEO, lead, and analytics management through the dashboard.</li>
              <li>Additional premium features according to your subscription plan.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">3. User Accounts</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>You are responsible for keeping your account credentials confidential.</li>
              <li>All activity that occurs under your account is your responsibility.</li>
              <li>You must promptly notify us if you detect unauthorized access to your account.</li>
              <li>An account may only be used by a single individual or business entity.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">4. Plans & Payment</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Webjoz offers a free plan with limited features and paid plans (Pro/Enterprise) with more complete features.</li>
              <li>Payments are processed through <strong>Midtrans</strong> and are subject to Midtrans&apos;s payment terms.</li>
              <li>Plan prices may change at any time with at least 14 days&apos; prior notice.</li>
              <li>Subscriptions are recurring unless you cancel before the renewal date.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">5. Prohibited Use</h2>
            <p>You are prohibited from using Webjoz to:</p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>Post illegal, fraudulent, or unlawful content under the laws of Indonesia.</li>
              <li>Distribute malware, phishing, or other harmful activity.</li>
              <li>Infringe the intellectual property rights of third parties.</li>
              <li>Send spam or unsolicited mass messages.</li>
              <li>Engage in activity that disproportionately burdens the platform&apos;s infrastructure.</li>
            </ul>
            <p className="mt-2">Violations may result in suspension or deletion of your account without a refund.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">6. Intellectual Property</h2>
            <p>
              Content generated by AI for your website becomes yours once published. The code, design, brand, and technology of the Webjoz platform are the exclusive property of Giwangan Studio and are protected by copyright. You are not permitted to copy, distribute, or create derivative works from the platform without written permission.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">7. Disclaimer of Warranties</h2>
            <p>
              Webjoz is provided &quot;as is&quot;. We do not warrant that the service will always be available without interruption or free from errors. We are not liable for business losses arising from service interruptions.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">8. Limitation of Liability</h2>
            <p>
              Under no circumstances shall Giwangan Studio&apos;s maximum liability to you exceed the amount you paid to us in the 3 (three) months preceding a claim.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">9. Service Termination</h2>
            <p>
              We reserve the right to terminate or suspend your account if you violate these terms, without prior notice in cases of serious violations. You may delete your account at any time through the dashboard.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">10. Governing Law</h2>
            <p>
              These terms are governed by the laws of the Republic of Indonesia. Any disputes will be resolved through mutual deliberation. If no agreement is reached, disputes will be settled by the competent court in Yogyakarta.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">11. Contact</h2>
            <address className="not-italic space-y-1">
              <p><strong>Giwangan Studio</strong></p>
              <p>Jl. Malang Wijoyo, Malangan, Giwangan, Umbulharjo, Yogyakarta</p>
              <p>Email: <a href="mailto:giwanganstudio@gmail.com" className="text-primary hover:underline">giwanganstudio@gmail.com</a></p>
            </address>
          </section>

        </div>
      </div>
    </main>
  );
}
