"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Rocket, Globe, Copy, Check, ExternalLink } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
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
    <Dialog
      open={true}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      title={t("dashboard.sites.congratsTitle")}
    >
      <div className="space-y-6 text-center py-4">
        {/* Celebration icon */}
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#3ddc84] to-primary flex items-center justify-center shadow-[0_0_30px_rgba(61,220,132,0.4)] relative">
            <div className="absolute inset-0 rounded-full border-4 border-white/20 animate-ping" />
            <Rocket
              className="w-10 h-10 text-white animate-bounce"
              style={{ animationDuration: "2.5s" }}
            />
          </div>
        </div>

        <div className="space-y-2 max-w-sm mx-auto">
          <h3 className="text-xl font-bold text-white tracking-tight">
            {t("dashboard.sites.congratsHeading")}
          </h3>
          <p className="text-sm text-[#9b9ba5] leading-relaxed">
            {t("dashboard.sites.congratsBody", undefined, { name: site.name })}
          </p>
        </div>

        {/* Clickable Subdomain Link Box */}
        <div className="bg-[#15151c] border border-white/[0.08] rounded-2xl p-5 space-y-3.5 max-w-md mx-auto relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-tr from-[#3ddc84]/10 to-transparent blur-xl pointer-events-none" />

          <div className="flex items-center justify-between gap-3 bg-[#0d0d12] border border-white/10 rounded-xl px-4 py-3">
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <Globe className="w-4 h-4 text-[#3ddc84] shrink-0" />
              <a
                href={siteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[14px] text-white font-mono font-bold hover:text-[#3ddc84] hover:underline truncate block text-left"
                title={t("dashboard.sites.openWebsite")}
              >
                {displayDomain}
              </a>
            </div>

            <button
              type="button"
              onClick={handleCopy}
              className="p-2 bg-white/[0.04] border border-white/10 text-[#9b9ba5] hover:text-white hover:bg-white/[0.08] rounded-lg transition-all shrink-0 cursor-pointer flex items-center justify-center"
              title={t("dashboard.sites.copyLinkTitle")}
            >
              {copied ? (
                <Check className="w-4 h-4 text-[#3ddc84]" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>

          <p className="text-[11.5px] text-[#9b9ba5] leading-relaxed m-0 text-left">
            {t("dashboard.sites.checkTip")}
          </p>
        </div>

        {/* Custom Domain CTA */}
        {siteId && (
          <Link
            href={`/dashboard/sites/${siteId}/domain`}
            onClick={onClose}
            className="flex items-center justify-between gap-3 bg-[#0d0d12] border border-primary/25 hover:border-primary/50 hover:bg-primary/[0.06] rounded-2xl px-5 py-3.5 max-w-md mx-auto w-full transition-all group"
          >
            <div className="flex flex-col gap-0.5 text-left">
              <span className="text-[13px] font-semibold text-primary group-hover:text-primary/90">
                {t("dashboard.sites.customDomainLinkLabel")}
              </span>
              <span className="text-[11px] text-[#9b9ba5] leading-relaxed">
                {t("dashboard.sites.customDomainLinkHint")}
              </span>
            </div>
            <ExternalLink className="w-4 h-4 text-primary/60 group-hover:text-primary shrink-0 transition-colors" />
          </Link>
        )}

        {/* CTA Buttons */}
        <div className="flex gap-3 max-w-sm mx-auto pt-2">
          {onContinueEditing && (
            <Button
              type="button"
              variant="outline"
              className="flex-1 rounded-xl h-11 text-[13.5px] border-white/10 hover:bg-white/[0.04]"
              onClick={onContinueEditing}
            >
              {t("dashboard.sites.continueEditing")}
            </Button>
          )}
          <Button
            type="button"
            variant="outline"
            className="flex-1 rounded-xl h-11 text-[13.5px] border-white/10 hover:bg-white/[0.04]"
            onClick={onClose}
          >
            {t("dashboard.sites.done")}
          </Button>
          <Button
            type="button"
            className="flex-1 rounded-xl h-11 text-[13.5px] font-bold bg-primary text-primary-foreground hover:bg-primary/90 border-0 cursor-pointer shadow-[0_4px_14px_color-mix(in_srgb,var(--primary)_30%,transparent)] flex items-center justify-center gap-2"
            onClick={() => window.open(siteUrl, "_blank")}
          >
            <Globe className="w-4 h-4" /> {t("dashboard.sites.openWebsite")}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
