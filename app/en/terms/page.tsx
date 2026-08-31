import type { Metadata } from "next";
import Link from "next/link";
import { siteUrl, SUPPORT_EMAIL } from "@/lib/site-config";

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
        <p className="text-sm text-muted-foreground mb-10">Last updated: August 16, 2026 · Applies to Webjoz services</p>

        <div className="prose prose-invert max-w-none space-y-8 text-sm leading-relaxed text-foreground/80">

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">1. Acceptance of Terms</h2>
            <p>
              By registering and using Webjoz, you fully agree to these Terms &amp; Conditions. If you do not agree with these terms, please stop using the service. The Webjoz service is operated by <strong>Giwangan Studio</strong>.
            </p>
            <p className="mt-2">
              The <strong>Privacy Policy</strong> and the <strong>Refund Policy</strong>, together with any other documents published on webjoz.com, form an integral part of these Terms &amp; Conditions.
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
              <li>Refund terms are set out in the <strong>Refund Policy</strong>.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">5. Prohibited Use</h2>
            <p>You are prohibited from using Webjoz to:</p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>Post illegal, fraudulent, or unlawful content under the laws of Indonesia.</li>
              <li><strong>Provide online lending (pinjol) services</strong>, extend loans, or carry out financial activities not in compliance with applicable regulations.</li>
              <li><strong>Engage in any form of gambling</strong>, including online gambling and betting.</li>
              <li>Distribute malware, phishing, or other harmful activity.</li>
              <li>Infringe the intellectual property rights of third parties.</li>
              <li>Send spam or unsolicited mass messages.</li>
              <li>Engage in activity that disproportionately burdens the platform&apos;s infrastructure.</li>
            </ul>
            <p className="mt-2">Violations may result in suspension or deletion of your account without a refund.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">6. User Content & Responsibility</h2>
            <p>
              You are fully responsible for the accuracy, legality, and content of the websites you publish through Webjoz. You warrant that all content you publish:
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>Does not violate any law, including prohibitions on online lending (pinjol), gambling, or fraud.</li>
              <li>Does not infringe the intellectual property or other rights of third parties.</li>
              <li>Does not contain misleading information or violate applicable regulations.</li>
            </ul>
            <p className="mt-2">
              AI-generated content is automated and may contain inaccuracies; you must review and correct such content before publishing it.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">7. Intellectual Property</h2>
            <p>
              Content generated by AI for your website becomes yours once published. The code, design, brand, and technology of the Webjoz platform are the exclusive property of Giwangan Studio and are protected by copyright. You are not permitted to copy, distribute, or create derivative works from the platform without written permission.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">8. Disclaimer of Warranties</h2>
            <p>
              Webjoz is provided &quot;as is&quot;. We do not warrant that the service will always be available without interruption or free from errors. However, these terms do not limit any liability that is mandatorily imposed by applicable laws, including the Indonesian Consumer Protection Law.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">9. Limitation of Liability</h2>
            <p>
              To the extent permitted by law, Giwangan Studio&apos;s liability is limited to direct damages actually suffered as a result of our negligence. These limitations do not apply if we are proven to have committed fraud, gross negligence, or a violation of mandatory legal provisions.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">10. Force Majeure</h2>
            <p>
              We are not liable for delays or failures in providing the service caused by events beyond our reasonable control, including natural disasters, disruptions to third-party infrastructure or networks, power outages, and government policies or regulations.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">11. Service Termination</h2>
            <p>
              We reserve the right to terminate or suspend your account if you violate these terms, without prior notice in cases of serious violations. You may delete your account at any time through the dashboard.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">12. Changes to These Terms</h2>
            <p>
              We may update these Terms &amp; Conditions from time to time. Significant changes will be announced by email or notification on the platform <strong>at least 14 days</strong> before they take effect. By continuing to use the service after notification, you are deemed to accept the changes. You may terminate your use of the service without penalty if you do not agree with the changes.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">13. Governing Law</h2>
            <p>
              These terms are governed by the laws of the Republic of Indonesia. Any disputes will be resolved through mutual deliberation. If no agreement is reached, disputes will be settled by the competent court in Yogyakarta.
            </p>
            <p className="mt-2">
              This English version is provided for convenience only. In the event of any discrepancy between the Indonesian and English versions, the <strong>Indonesian version shall prevail</strong>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">14. Contact</h2>
            <address className="not-italic space-y-1">
              <p><strong>Webjoz Support</strong></p>
              <p>Email: <a href={`mailto:${SUPPORT_EMAIL}`} className="text-primary hover:underline">{SUPPORT_EMAIL}</a></p>
            </address>
          </section>

        </div>
      </div>
    </main>
  );
}
