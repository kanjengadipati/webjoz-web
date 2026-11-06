"use client";

import React, { useEffect } from "react";
import { useI18n } from "@/lib/i18n/context";
import { SIDEBAR_FIELD_CLASS } from "./shared";
import type { BaseSectionFormProps } from "./types";

export function FloatingSectionForm({
  content,
  updateField,
  designToken,
  updateDesignTokenLayout,
  isPremium,
  onUpgradeRequired,
}: BaseSectionFormProps) {
  const { t } = useI18n();

  // Auto-initialize floating_button default if undefined
  useEffect(() => {
    if (designToken?.layout?.floating_button === undefined) {
      updateDesignTokenLayout?.("floating_button", "whatsapp");
    }
  }, [designToken, updateDesignTokenLayout]);

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-primary/20 bg-primary/10 px-3 py-2.5 text-[12px] leading-relaxed text-primary">
        <p className="font-semibold text-primary">💬 {t("dashboard.sitesEditor.floatingSectionBanner")}</p>
        <p className="mt-1 text-primary/80">{t("dashboard.sitesEditor.floatingSectionBannerDesc")}</p>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-bold uppercase tracking-wider text-sidebar-subtle-foreground">
          {t("dashboard.sitesEditor.floatingButtonType")}
        </label>
        <div className="grid grid-cols-2 gap-2">
          {([
            { value: "none", labelKey: "floatingNone", icon: "🚫", descKey: "floatingNoneDesc" },
            { value: "whatsapp", labelKey: "floatingWhatsApp", icon: "💬", descKey: "floatingWhatsAppDesc" },
            { value: "whatsapp_pill", labelKey: "floatingWhatsAppPill", icon: "🟢", descKey: "floatingWhatsAppPillDesc" },
            { value: "chat_bubble", labelKey: "floatingChatBubble", icon: "✨", descKey: "floatingChatBubbleDesc" },
            { value: "contact_link", labelKey: "floatingContactLink", icon: "📋", descKey: "floatingContactLinkDesc" },
          ] as const).map((opt) => {
            const current = designToken?.layout?.floating_button ?? "whatsapp";
            const isActive = current === opt.value;
            const isProGated = opt.value === "chat_bubble" && !isPremium;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  if (isProGated) {
                    onUpgradeRequired?.();
                    return;
                  }
                  updateDesignTokenLayout?.("floating_button", opt.value);
                }}
                className={`relative p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  isActive
                    ? "border-primary bg-primary/15 ring-1 ring-primary"
                    : "border-border bg-muted/40 hover:border-border hover:bg-muted/70"
                } ${isProGated ? "opacity-60" : ""}`}
              >
                <span className="text-lg block mb-1">{opt.icon}</span>
                <p className="text-[11px] font-bold text-sidebar-foreground leading-tight">
                  {t(`dashboard.sitesEditor.${opt.labelKey}`)}
                </p>
                <p className="text-[10px] text-sidebar-subtle-foreground mt-0.5 leading-tight">
                  {t(`dashboard.sitesEditor.${opt.descKey}`)}
                </p>
                {opt.value === "chat_bubble" && (
                  <span className="absolute top-1.5 right-1.5 text-[8px] font-bold px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    PRO
                  </span>
                )}
                {isActive && <span className="absolute bottom-1.5 right-1.5 w-2 h-2 rounded-full bg-primary" />}
              </button>
            );
          })}
        </div>
        {!isPremium && (
          <p className="text-[10px] text-amber-400/80 leading-relaxed">
            ✨ {t("dashboard.sitesEditor.floatingProHint")}
          </p>
        )}
      </div>

      {(designToken?.layout?.floating_button === "whatsapp" ||
        designToken?.layout?.floating_button === "whatsapp_pill" ||
        designToken?.layout?.floating_button === "chat_bubble" ||
        !designToken?.layout?.floating_button) && (
        <div className="space-y-2 pt-2 border-t border-border">
          <label className="flex items-center gap-1 text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">
            {t("dashboard.sitesEditor.floatingWhatsAppNumber")} <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            inputMode="tel"
            value={content?.contact?.phone || ""}
            onChange={(e) => {
              const val = e.target.value;
              updateField("contact", "phone", val);
              const digits = val.replace(/\D/g, "");
              if (digits) {
                const fmt = digits.startsWith("0") ? "62" + digits.slice(1) : digits;
                if (/wa\.me|whatsapp\.com/i.test(content?.hero?.cta_url || "")) {
                  updateField("hero", "cta_url", `https://wa.me/${fmt}`);
                }
                if (/wa\.me|whatsapp\.com/i.test(content?.cta?.button_url || "")) {
                  updateField("cta", "button_url", `https://wa.me/${fmt}`);
                }
              }
            }}
            placeholder={t("dashboard.sitesEditor.phFloatingWaNumber")}
            className={`${SIDEBAR_FIELD_CLASS} border-border text-sidebar-foreground placeholder-sidebar-subtle-foreground`}
          />
          {!content?.contact?.phone && (
            <p className="text-[10px] text-red-400/80 mt-1">
              {t("dashboard.sitesEditor.floatingWhatsAppNumberRequired")}
            </p>
          )}
          <p className="text-[10px] text-sidebar-subtle-foreground">
            {t("dashboard.sitesEditor.floatingWhatsAppNumberHint")}
          </p>
        </div>
      )}

      {designToken?.layout?.floating_button !== "none" && (
        <div className="rounded-lg border border-border bg-muted/40 p-3 text-[11px] text-sidebar-muted-foreground leading-relaxed">
          {(designToken?.layout?.floating_button === "whatsapp" || !designToken?.layout?.floating_button) &&
            t("dashboard.sitesEditor.floatingWhatsAppDescLong")}
          {designToken?.layout?.floating_button === "whatsapp_pill" &&
            t("dashboard.sitesEditor.floatingWhatsAppPillDescLong")}
          {designToken?.layout?.floating_button === "chat_bubble" &&
            (isPremium
              ? t("dashboard.sitesEditor.floatingChatBubbleDescLong")
              : t("dashboard.sitesEditor.floatingChatBubbleProRequired"))}
          {designToken?.layout?.floating_button === "contact_link" &&
            t("dashboard.sitesEditor.floatingContactLinkDescLong")}
        </div>
      )}
    </div>
  );
}

