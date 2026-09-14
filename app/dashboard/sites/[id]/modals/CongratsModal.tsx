"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Rocket, Globe, Copy, Check, ExternalLink, X } from "lucide-react";
import { Button } from "@/components/ui";
import { useI18n } from "@/lib/i18n/context";

export interface CongratsModalProps {
  site: {
    name: string;
    subdomain: string;
  };
  siteId?: number;
  onClose: () => void;
  onContinueEditing?: () => void;
  /** Pre-computed display domain, e.g. "mysite.webjoz.com" */
  displayDomain?: string;
  /** Pre-computed full site URL */
  siteUrl?: string;
}

export default function CongratsModal({ site, siteId, onClose, onContinueEditing, displayDomain: displayDomainProp, siteUrl: siteUrlProp }: CongratsModalProps) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);

  const displayDomain = displayDomainProp ?? (() => {
    const host = typeof window !== "undefined" ? window.location.host : "";
    let domainPart = "webjoz.com";
    if (host && !host.includes("localhost") && !host.includes("127.0.0.1")) {
      domainPart = host.substring(host.indexOf(".") + 1) || "webjoz.com";
    }
    return `${site.subdomain}.${domainPart}`;
  })();

  const siteUrl = siteUrlProp ?? (() => {
    const subdomain = site.subdomain;
    if (typeof window === "undefined") return `http://localhost:3000/s/${subdomain}`;
    const host = window.location.host;
    if (host.includes("localhost") || host.includes("127.0.0.1")) {
      return `http://localhost:3000/s/${subdomain}`;
    }
    const domainPart = host.substring(host.indexOf(".") + 1);
    return `https://${subdomain}.${domainPart || "webjoz.com"}`;
  })();

  const handleCopy = () => {
    navigator.clipboard.writeText(siteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div
        className="relative w-full sm:max-w-sm rounded-t-3xl sm:rounded-3xl border border-border bg-background shadow-2xl p-5 sm:p-6 max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 shrink-0 rounded-xl bg-primary flex items-center justify-center">
              <Rocket className="w-5 h-5 text-primary-foreground" />
            </div>
            <h3 className="text-[15px] font-bold text-foreground leading-snug">
              {t("dashboard.sites.congratsTitle")}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t("dashboard.sites.congratsClose", "Tutup")}
            className="shrink-0 rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3.5 text-center">
          <p className="text-[13px] text-muted-foreground leading-relaxed max-w-xs mx-auto">
            {t("dashboard.sites.congratsBody", undefined, { name: site.name })}
          </p>

          {/* Clickable Subdomain Link Box */}
          <div className="bg-card border border-border rounded-xl p-3 space-y-2.5 relative overflow-hidden text-left group">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-tr from-primary/10 to-transparent blur-xl pointer-events-none" />

            <div className="flex items-center justify-between gap-2 bg-background border border-border rounded-lg px-3 py-2">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <Globe className="w-3.5 h-3.5 text-primary shrink-0" />
                <a
                  href={siteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[13px] text-foreground font-mono font-bold hover:text-primary hover:underline truncate block text-left"
                  title={t("dashboard.sites.openWebsite")}
                >
                  {displayDomain}
                </a>
              </div>

              <button
                type="button"
                onClick={handleCopy}
                className="p-1.5 bg-muted/50 border border-border text-muted-foreground hover:text-foreground hover:bg-white/[0.08] rounded-md transition-all shrink-0 cursor-pointer flex items-center justify-center"
                title={t("dashboard.sites.copyLinkTitle")}
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-primary" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            <p className="text-[11px] text-muted-foreground leading-relaxed m-0 px-0.5">
              {t("dashboard.sites.checkTip")}
            </p>
          </div>

          {/* Custom Domain CTA - only active when site is live */}
          {siteId && site.subdomain && !site.subdomain.startsWith("draft-") && (
            <Link
              href={`/dashboard/domains?site_id=${siteId}`}
              onClick={onClose}
              className="flex items-center justify-between gap-3 bg-background border border-primary/25 hover:border-primary/50 hover:bg-primary/[0.06] rounded-xl px-3.5 py-2.5 w-full transition-all group"
            >
              <div className="flex flex-col gap-0.5 text-left">
                <span className="text-[12.5px] font-semibold text-primary group-hover:text-primary/90">
                  {t("dashboard.sites.customDomainLinkLabel")}
                </span>
                <span className="text-[11px] text-muted-foreground leading-relaxed">
                  {t("dashboard.sites.customDomainLinkHint")}
                </span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-primary/60 group-hover:text-primary shrink-0 transition-colors" />
            </Link>
          )}

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 pt-1">
            {onContinueEditing && (
              <Button
                type="button"
                variant="outline"
                className="flex-1 rounded-xl h-10 text-[13px] border-border hover:bg-muted/50"
                onClick={onContinueEditing}
              >
                {t("dashboard.sites.continueEditing")}
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              className="flex-1 rounded-xl h-10 text-[13px] border-border hover:bg-muted/50"
              onClick={onClose}
            >
              {t("dashboard.sites.done")}
            </Button>
            <button
              type="button"
              className="flex-1 rounded-xl h-10 text-[13px] font-bold bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center gap-1.5 cursor-pointer"
              onClick={() => window.open(siteUrl, "_blank")}
            >
              <Globe className="w-3.5 h-3.5" /> {t("dashboard.sites.openWebsite")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}