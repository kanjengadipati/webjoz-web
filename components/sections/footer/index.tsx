"use client";
import React from "react";
import type { ComponentType } from "react";
import { CreditCard, Truck, RotateCcw } from "lucide-react";
import type { FooterVariantProps } from "./types";
import { useSitePayments } from "../../cart";
import MinimalBand from "./minimal-band";
import ColumnsWithSocial from "./columns-with-social";
import ColumnsWithNav from "./columns-with-nav";
import DarkContrastBand from "./dark-contrast-band";
import LocationAndHours from "./location-and-hours";

const variants: Record<string, ComponentType<FooterVariantProps>> = {
  "minimal-band": MinimalBand,
  "columns-with-social": ColumnsWithSocial,
  "columns-with-nav": ColumnsWithNav,
  "dark-contrast-band": DarkContrastBand,
  "location-and-hours": LocationAndHours,
};

const STRIP_BG = "var(--dt-surface)";
const STRIP_BORDER = "var(--dt-border)";
const STRIP_TXT = "color-mix(in srgb, var(--dt-text) 65%, transparent)";
const STRIP_LABEL = "color-mix(in srgb, var(--dt-text) 45%, transparent)";

function PaymentStrip() {
  const { payments, language } = useSitePayments();
  const isEN = language === "en";
  const methods = payments?.methods?.filter((m) => (m.label || "").trim()) ?? [];
  const hasBlock = methods.length > 0 || !!payments?.shipping_note || !!payments?.return_policy;
  if (!hasBlock) return null;
  const title = payments?.title?.trim() || (isEN ? "Payment Methods & Shipping" : "Metode Pembayaran & Pengiriman");

  return (
    <div className="px-6 py-5 text-xs" style={{ background: STRIP_BG, color: STRIP_TXT, borderTop: `1px solid ${STRIP_BORDER}` }}>
      <div className="max-w-5xl mx-auto flex flex-col gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-widest inline-flex items-center gap-1.5" style={{ color: STRIP_LABEL }}>
          <CreditCard className="w-3 h-3" /> {title}
        </p>
        {methods.length > 0 && (
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {methods.map((m, i) => (
              <span key={`${m.label}-${i}`} className="text-[11px] leading-snug">
                {m.label}
                {m.detail?.trim() ? <span className="opacity-60"> — {m.detail}</span> : null}
              </span>
            ))}
          </div>
        )}
        {payments?.shipping_note ? (
          <p className="text-[11px] leading-snug inline-flex items-start gap-1.5">
            <Truck className="w-3 h-3 mt-0.5 shrink-0" /> <span>{payments.shipping_note}</span>
          </p>
        ) : null}
        {payments?.return_policy ? (
          <p className="text-[11px] leading-snug inline-flex items-start gap-1.5">
            <RotateCcw className="w-3 h-3 mt-0.5 shrink-0" /> <span>{payments.return_policy}</span>
          </p>
        ) : null}
      </div>
    </div>
  );
}

export default function FooterSection(props: FooterVariantProps) {
  const variant = props.design_token?.layout?.section_variants?.footer ?? "minimal-band";
  const Renderer = variants[variant] ?? MinimalBand;
  return (
    <>
      <PaymentStrip />
      <Renderer {...props} />
    </>
  );
}
