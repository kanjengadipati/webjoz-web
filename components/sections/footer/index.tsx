"use client";
import React, { useState, useEffect } from "react";
import type { ComponentType } from "react";
import { CreditCard, Truck, RotateCcw, X, QrCode } from "lucide-react";
import type { FooterVariantProps } from "./types";
import { useSitePayments, PaymentMethodIcon } from "../../cart";
import { InlineText, InlineImage } from "../../templates/shared";
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
const STRIP_TXT = "color-mix(in srgb, var(--dt-text) 75%, transparent)";
const STRIP_LABEL = "color-mix(in srgb, var(--dt-text) 50%, transparent)";

function PaymentStrip(props: FooterVariantProps) {
  const { payments, language } = useSitePayments();
  const isEN = language === "en";
  const [activeQr, setActiveQr] = useState<{
    method: NonNullable<NonNullable<typeof payments>["methods"]>[number];
    index: number;
  } | null>(null);

  useEffect(() => {
    if (!activeQr) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveQr(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeQr]);

  const methods = payments?.methods?.filter((m) => (m.label || "").trim()) ?? [];
  const hasBlock = methods.length > 0 || !!payments?.shipping_note || !!payments?.return_policy;
  if (!hasBlock || payments?.show === false) return null;
  const title = payments?.title?.trim() || (isEN ? "Payment Methods & Shipping" : "Metode Pembayaran & Pengiriman");

  return (
    <div className="px-6 py-6 text-xs" style={{ background: STRIP_BG, color: STRIP_TXT, borderTop: `1px solid ${STRIP_BORDER}` }}>
      <div className="max-w-5xl mx-auto flex flex-col gap-3.5">
        <p className="text-[10px] font-bold uppercase tracking-widest inline-flex items-center gap-1.5" style={{ color: STRIP_LABEL }}>
          <CreditCard className="w-3.5 h-3.5" />{" "}
          {props.isEditorMode && props.onUpdateField ? (
            <InlineText
              section="payments"
              fieldKey="title"
              value={title}
              onUpdateField={props.onUpdateField}
              isEditorMode={props.isEditorMode}
              isSelected={props.isSelected}
              collapseSheetForInlineEdit={props.collapseSheetForInlineEdit}
              as="span"
            />
          ) : (
            title
          )}
        </p>

        {methods.length > 0 && (
          <div className="flex flex-wrap items-center gap-2.5">
            {methods.map((m, i) => {
              const isQrWithImage = m.type === "qris" && !!m.image?.trim();
              if (isQrWithImage) {
                return (
                  <button
                    type="button"
                    key={`${m.label}-${i}`}
                    onClick={() => setActiveQr({ method: m, index: i })}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border text-xs cursor-pointer transition-all hover:brightness-110 active:scale-98"
                    style={{
                      background: "color-mix(in srgb, var(--dt-surface) 80%, var(--dt-text) 5%)",
                      borderColor: "color-mix(in srgb, var(--dt-text) 16%, transparent)",
                      color: "var(--dt-text)",
                    }}
                  >
                    <PaymentMethodIcon type={m.type} className="w-3.5 h-3.5 opacity-70 shrink-0" />
                    <span className="font-bold text-[11px]">{m.label}</span>
                    <span
                      className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md flex items-center gap-1"
                      style={{
                        background: "color-mix(in srgb, var(--dt-primary, var(--primary, #4F46E5)) 15%, transparent)",
                        color: "var(--dt-primary, var(--primary, #4F46E5))",
                      }}
                    >
                      <QrCode className="w-2.5 h-2.5" />
                      {isEN ? "View QR" : "Lihat QR"}
                    </span>
                  </button>
                );
              }

              return (
                <div
                  key={`${m.label}-${i}`}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border text-xs"
                  style={{
                    background: "color-mix(in srgb, var(--dt-surface) 80%, var(--dt-text) 5%)",
                    borderColor: "color-mix(in srgb, var(--dt-text) 12%, transparent)",
                    color: "var(--dt-text)",
                  }}
                >
                  <PaymentMethodIcon type={m.type} className="w-3.5 h-3.5 opacity-60 shrink-0" />
                  <span className="font-bold text-[11px]">{m.label}</span>
                  {m.detail?.trim() ? (
                    <span
                      className="text-[11px] font-mono opacity-80 tracking-tight pl-2 border-l select-all"
                      style={{ borderColor: "color-mix(in srgb, var(--dt-text) 15%, transparent)" }}
                    >
                      {m.detail}
                    </span>
                  ) : null}
                </div>
              );
            })}
          </div>
        )}

        {/* Modal / Popup QRIS */}
        {activeQr && (
          <div
            className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
            onClick={() => setActiveQr(null)}
          >
            <div
              className="relative max-w-xs w-full rounded-2xl p-5 shadow-2xl flex flex-col items-center gap-3.5 text-center transition-all"
              onClick={(e) => e.stopPropagation()}
              style={{
                background: "var(--dt-bg, #ffffff)",
                color: "var(--dt-text, #0f172a)",
                border: "1px solid color-mix(in srgb, var(--dt-text, #0f172a) 12%, transparent)",
              }}
            >
              <button
                type="button"
                onClick={() => setActiveQr(null)}
                className="absolute top-3 right-3 p-1.5 rounded-full opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
                aria-label="Tutup"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex flex-col items-center gap-1">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{
                    background: "color-mix(in srgb, var(--dt-primary, var(--primary, #4F46E5)) 15%, transparent)",
                    color: "var(--dt-primary, var(--primary, #4F46E5))",
                  }}
                >
                  <QrCode className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm tracking-tight">{activeQr.method.label}</h4>
                {activeQr.method.detail?.trim() ? (
                  <p className="font-mono text-xs opacity-75">{activeQr.method.detail}</p>
                ) : null}
              </div>

              <div className="p-2.5 bg-white rounded-xl border border-black/10 shadow-xs max-w-full">
                {props.isEditorMode && props.onUpdateField ? (
                  <InlineImage
                    section="payments"
                    fieldKey={`methods.${activeQr.index}.image`}
                    src={activeQr.method.image}
                    alt={activeQr.method.label}
                    onUpdateField={props.onUpdateField}
                    isEditorMode={props.isEditorMode}
                    isSelected={props.isSelected}
                    collapseSheetForInlineEdit={props.collapseSheetForInlineEdit}
                    className="w-48 h-48 sm:w-56 sm:h-56 object-contain bg-white rounded-lg"
                  />
                ) : (
                  <img
                    src={activeQr.method.image}
                    alt={activeQr.method.label}
                    className="w-48 h-48 sm:w-56 sm:h-56 object-contain bg-white rounded-lg"
                  />
                )}
              </div>

              <p className="text-[11px] opacity-60 leading-tight">
                {isEN ? "Scan QR using your mobile banking or e-wallet app." : "Scan QR menggunakan mobile banking atau aplikasi e-wallet Anda."}
              </p>

              <button
                type="button"
                onClick={() => setActiveQr(null)}
                className="w-full py-2 text-xs font-semibold rounded-xl border opacity-80 hover:opacity-100 transition-colors cursor-pointer"
                style={{
                  borderColor: "color-mix(in srgb, var(--dt-text, #0f172a) 15%, transparent)",
                }}
              >
                {isEN ? "Close" : "Tutup"}
              </button>
            </div>
          </div>
        )}

        {(payments?.shipping_note || payments?.return_policy) && (
          <div
            className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 border-t text-[11px]"
            style={{ borderColor: "color-mix(in srgb, var(--dt-text) 10%, transparent)" }}
          >
            {payments?.shipping_note && (
              <div className="inline-flex items-center gap-2 opacity-80 leading-relaxed">
                <Truck className="w-3.5 h-3.5 opacity-70 shrink-0" />
                <span>{payments.shipping_note}</span>
              </div>
            )}
            {payments?.return_policy && (
              <div className="inline-flex items-center gap-2 opacity-80 leading-relaxed">
                <RotateCcw className="w-3.5 h-3.5 opacity-70 shrink-0" />
                <span>{payments.return_policy}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function FooterSection(props: FooterVariantProps) {
  const variant = props.design_token?.layout?.section_variants?.footer ?? "minimal-band";
  const Renderer = variants[variant] ?? MinimalBand;
  return (
    <>
      <PaymentStrip {...props} />
      <Renderer {...props} />
    </>
  );
}
