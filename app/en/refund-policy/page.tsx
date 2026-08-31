import type { Metadata } from "next";
import Link from "next/link";
import { siteUrl, SUPPORT_EMAIL } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Refund Policy | Webjoz",
  description:
    "Webjoz refund and cancellation policy — 7-day money-back guarantee for paid plans.",
  keywords: ["webjoz refund", "refund policy", "webjoz subscription cancellation"],
  alternates: {
    canonical: siteUrl("/en/refund-policy"),
    languages: {
      id: siteUrl("/refund-policy"),
      en: siteUrl("/en/refund-policy"),
    },
  },
  openGraph: {
    title: "Refund Policy | Webjoz",
    description:
      "Webjoz refund and cancellation policy — 7-day money-back guarantee.",
    url: siteUrl("/en/refund-policy"),
    siteName: "Webjoz",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Refund Policy | Webjoz",
    description: "Webjoz refund policy and subscription cancellation.",
  },
};

export default function EnRefundPolicyPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <div className="mb-8 flex items-center justify-between gap-4">
          <Link href="/" className="text-xs text-muted-foreground hover:text-foreground transition inline-block">← Back to Home</Link>
          <Link href="/refund-policy" className="text-xs text-primary hover:underline inline-block">Baca dalam Bahasa Indonesia</Link>
        </div>

        <h1 className="text-3xl font-bold mb-2">Refund Policy</h1>
        <p className="text-sm text-muted-foreground mb-10">Last updated: August 16, 2026 · Applies to Webjoz services</p>

        <div className="prose prose-invert max-w-none space-y-8 text-sm leading-relaxed text-foreground/80">

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">1. Overview</h2>
            <p>
              Giwangan Studio is committed to providing a quality Webjoz service. We understand that sometimes a service may not meet your expectations. This policy explains the conditions under which a refund may be granted.
            </p>
            <p className="mt-2">
              This policy forms an integral part of the Webjoz <strong>Terms &amp; Conditions</strong>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">2. Money-Back Guarantee Period</h2>
            <p>
              We offer a <strong>7-day money-back guarantee</strong> after your first purchase of a paid plan, provided that:
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>The request is submitted within 7 calendar days of the payment date.</li>
              <li>You have not published more than 1 website using the plan.</li>
              <li>The request is submitted by email to <strong>{SUPPORT_EMAIL}</strong>.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">3. Refund-Eligible Conditions</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Duplicate payment (charged twice for the same transaction).</li>
              <li>The service fails to work for more than 72 consecutive hours and we fail to fix it.</li>
              <li>Cancellation within the first 7 days under the money-back guarantee above.</li>
              <li>A technical error in the payment system that causes an incorrect charge.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">4. Non-Refundable Conditions</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Requests submitted after the 7-day guarantee period has passed.</li>
              <li>Dissatisfaction with AI-generated content (we provide editing and regeneration features).</li>
              <li>Accounts suspended for violating the Terms &amp; Conditions.</li>
              <li>A change of business decision or no longer needing the service.</li>
              <li>Cancellation of renewal subscriptions (not covered by the guarantee).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">5. How to Request a Refund</h2>
            <p>To request a refund:</p>
            <ol className="list-decimal pl-5 space-y-2 mt-2">
              <li>Send an email to <a href={`mailto:${SUPPORT_EMAIL}`} className="text-primary hover:underline">{SUPPORT_EMAIL}</a> with the subject: <strong>&quot;Refund Request - [Account Name]&quot;</strong>.</li>
              <li>Include: the transaction number, payment date, and the reason for the refund request.</li>
              <li>Our team will respond within 2 working days.</li>
              <li>If approved, funds will be returned to the original payment method <strong>within no more than 14 working days</strong> from the date of approval, depending on bank/provider policy.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">6. Subscription Cancellation</h2>
            <p>
              You can cancel your subscription at any time via Dashboard → Settings → Subscription. Cancellation takes effect at the end of the current billing period. There is no prorated refund for unused subscription time.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">7. Payment Processor</h2>
            <p>
              All transactions are processed by <strong>Midtrans</strong> (PT Midtrans). For questions about payment status or transaction disputes, you may also contact Midtrans directly through their customer service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">8. Contact</h2>
            <address className="not-italic space-y-1">
              <p><strong>Webjoz Support</strong></p>
              <p>Email: <a href={`mailto:${SUPPORT_EMAIL}`} className="text-primary hover:underline">{SUPPORT_EMAIL}</a></p>
              <p>Business Hours: Monday – Friday, 09.00 – 17.00 WIB</p>
            </address>
          </section>

        </div>
      </div>
    </main>
  );
}
