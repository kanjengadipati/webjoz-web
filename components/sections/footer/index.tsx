"use client";
import React from "react";
import type { ComponentType } from "react";
import { CreditCard, Truck, RotateCcw } from "lucide-react";
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
  const methods = payments?.methods?.filter((m) => (m.label || "").trim()) ?? [];
  const hasBlock = methods.length > 0 || !!payments?.shipping_note || !!payments?.return_policy;
  if (!hasBlock) return null;
  const title = payments?.title?.trim() || (isEN ? "Payment Methods & Shipping" : "Metode Pembayaran & Pengiriman");

  const renderQrImage = (m: NonNullable<NonNullable<typeof payments>["methods"]>[number], mi: number) => {
    if (m.type !== "qris" || !m.image?.trim()) return null;
    if (props.isEditorMode && props.onUpdateField) {
      return (
        <InlineImage
          section="payments"
          fieldKey={`methods.${mi}.image`}
          src={m.image}
          alt={m.label}
          onUpdateField={props.onUpdateField}
          isEditorMode={props.isEditorMode}
          isSelected={props.isSelected}
          collapseSheetForInlineEdit={props.collapseSheetForInlineEdit}
          className="w-16 h-16 object-contain bg-white rounded-lg"
        />
      );
    }
    return (
      <img
        src={m.image}
        alt={m.label}
        className="w-16 h-16 object-contain bg-white rounded-lg"
      />
    );
  };

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
                  <div
                    key={`${m.label}-${i}`}
                    className="inline-flex items-center gap-3 p-2 rounded-2xl border text-xs"
                    style={{
                      background: "color-mix(in srgb, var(--dt-surface) 80%, var(--dt-text) 5%)",
                      borderColor: "color-mix(in srgb, var(--dt-text) 12%, transparent)",
                      color: "var(--dt-text)",
                    }}
                  >
                    <div className="shrink-0 p-1 bg-white rounded-xl border border-black/10 shadow-2xs">
                      {renderQrImage(m, i)}
                    </div>
                    <div className="flex flex-col gap-0.5 pr-2">
                      <div className="flex items-center gap-1.5">
                        <PaymentMethodIcon type={m.type} className="w-3.5 h-3.5 opacity-60 shrink-0" />
                        <span className="font-bold text-[11px]">{m.label}</span>
                      </div>
                      {m.detail?.trim() ? (
                        <span className="text-[10.5px] font-mono opacity-75 select-all">{m.detail}</span>
                      ) : null}
                      <span className="text-[9.5px] uppercase tracking-wider opacity-50 font-medium">Scan QRIS</span>
                    </div>
                  </div>
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
