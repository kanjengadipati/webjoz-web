"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Globe, Copy, Check, ArrowUpRight, Link2, X } from "lucide-react";
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

export default function CongratsModal({
  site,
  siteId,
  onClose,
  onContinueEditing,
  displayDomain: displayDomainProp,
  siteUrl: siteUrlProp,
}: CongratsModalProps) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);

  const displayDomain =
    displayDomainProp ??
    (() => {
      const host = typeof window !== "undefined" ? window.location.host : "";
      let domainPart = "webjoz.com";
      if (host && !host.includes("localhost") && !host.includes("127.0.0.1")) {
        domainPart = host.substring(host.indexOf(".") + 1) || "webjoz.com";
      }
      return `${site.subdomain}.${domainPart}`;
    })();

  const siteUrl =
    siteUrlProp ??
    (() => {
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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div
        className="relative w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl border border-white/10 bg-[#0b0d11] shadow-2xl p-6 max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Subtle Ambient Monochrome Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-20 bg-white/[0.04] blur-2xl rounded-full pointer-events-none" />

        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white shrink-0 shadow-inner">
              <Globe className="w-5 h-5 text-zinc-200 stroke-[1.75]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-[15px] font-semibold text-white tracking-tight">
                  {t("dashboard.sites.congratsTitle")}
                </h3>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono tracking-wider text-zinc-300 bg-white/5 border border-white/10">
                  <span className="size-1.5 rounded-full bg-white animate-pulse" />
                  LIVE
                </span>
              </div>
              <p className="text-[11px] text-zinc-500 font-mono mt-0.5">
                {displayDomain}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t("dashboard.sites.congratsClose", "Tutup")}
            className="rounded-xl p-1.5 text-zinc-500 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Relaxed Body Description */}
        <p className="text-[13px] text-zinc-400 leading-relaxed mb-4 text-left">
          {t("dashboard.sites.congratsBody", undefined, { name: site.name })}
        </p>

        {/* Clickable Subdomain Link Box (Monochrome Inset) */}
        <div className="rounded-2xl border border-white/10 bg-black/40 p-3.5 space-y-2 mb-3 text-left">
          <div className="flex items-center justify-between gap-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl px-3.5 py-2.5 transition-colors focus-within:border-white/20">
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <Globe className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
              <a
                href={siteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[13px] text-white font-mono font-medium hover:underline truncate block"
                title={t("dashboard.sites.openWebsite")}
              >
                {displayDomain}
              </a>
            </div>

            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all active:scale-95 cursor-pointer shrink-0"
              title={t("dashboard.sites.copyLinkTitle")}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span className="text-[11px] font-sans">Tersalin</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-zinc-400" />
                  <span className="text-[11px] font-sans">Salin</span>
                </>
              )}
            </button>
          </div>

          <p className="text-[11px] text-zinc-500 leading-relaxed px-1">
            {t("dashboard.sites.checkTip")}
          </p>
        </div>

        {/* Custom Domain Banner (Monochrome) */}
        {siteId && site.subdomain && !site.subdomain.startsWith("draft-") && (
          <Link
            href={`/dashboard/domains?site_id=${siteId}`}
            onClick={onClose}
            className="flex items-center justify-between gap-3 bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.08] hover:border-white/20 rounded-2xl p-3.5 mb-4 transition-all group text-left"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-zinc-400 group-hover:text-white transition-colors">
                <Link2 className="w-4 h-4" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[12.5px] font-medium text-zinc-200 group-hover:text-white transition-colors truncate">
                  {t("dashboard.sites.customDomainLinkLabel").replace(/^[^\w]+/, "")}
                </span>
                <span className="text-[11px] text-zinc-500 truncate">
                  {t("dashboard.sites.customDomainLinkHint")}
                </span>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-white shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        )}

        {/* Relaxed Action Buttons Hierarchy */}
        <div className="space-y-2 pt-1">
          {/* Primary Action Button: Buka Website */}
          <button
            type="button"
            className="w-full h-11 rounded-xl text-[13px] font-semibold bg-white text-zinc-950 hover:bg-zinc-200 flex items-center justify-center gap-2 transition-all active:scale-[0.99] cursor-pointer shadow-sm"
            onClick={() => window.open(siteUrl, "_blank")}
          >
            <ArrowUpRight className="w-4 h-4 stroke-[2.25]" />
            <span>{t("dashboard.sites.openWebsite")}</span>
          </button>

          {/* Secondary Actions: Lanjut Edit & Selesai */}
          <div className="flex items-center gap-2">
            {onContinueEditing && (
              <button
                type="button"
                className="flex-1 h-10 rounded-xl text-[12.5px] font-medium text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all active:scale-[0.99] cursor-pointer"
                onClick={onContinueEditing}
              >
                {t("dashboard.sites.continueEditing")}
              </button>
            )}
            <button
              type="button"
              className="flex-1 h-10 rounded-xl text-[12.5px] font-medium text-zinc-400 hover:text-white bg-transparent hover:bg-white/5 border border-white/10 transition-all active:scale-[0.99] cursor-pointer"
              onClick={onClose}
            >
              {t("dashboard.sites.done")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}