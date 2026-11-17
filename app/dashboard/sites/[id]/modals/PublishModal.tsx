"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Rocket, Globe, Loader2 } from "lucide-react";
import { Button, Dialog } from "webjoz-ui";
import { useI18n } from "@/lib/i18n/context";
import { request } from "@/lib/api/client";
import { isReservedSubdomain } from "@/lib/subdomain";
import { BASE_DOMAIN } from "@/lib/site-config";
import TermsAcceptance from "@/components/terms-acceptance";
import ModerationBlock, { type ModerationViolation } from "@/components/moderation-block";

export interface PublishModalProps {
  site: {
    name: string;
    subdomain: string;
  };
  /** Hash ID of the site being published (lets the check ignore its own subdomain). */
  siteId?: string;
  onConfirm: (subdomain: string) => void;
  onCancel: () => void;
  loading: boolean;
  violations?: ModerationViolation[];
  onAppealSubmit?: (message: string) => void;
  appealLoading?: boolean;
  appealDone?: boolean;
}

type AvailabilityState = "idle" | "checking" | "available" | "taken" | "reserved" | "invalid" | "error";

interface SubdomainAvailabilityResponse {
  subdomain: string;
  available: boolean;
  reason: "ok" | "invalid" | "reserved" | "taken" | "error";
}

export default function PublishModal({ site, siteId, onConfirm, onCancel, loading, violations, onAppealSubmit, appealLoading, appealDone }: PublishModalProps) {
  const { t } = useI18n();
  const hasModerationBlock = !!violations && violations.length > 0;
  const [subdomain, setSubdomain] = useState(() => {
    if (site.subdomain.startsWith("draft-")) return "";
    return site.subdomain;
  });
  const [agreed, setAgreed] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  // Hasil lookup server, disimpan bersama subdomain yang diperiksa agar hasil
  // lama tidak dipakai untuk input baru.
  const [remoteResult, setRemoteResult] = useState<{
    subdomain: string;
    state: Exclude<AvailabilityState, "idle" | "checking">;
  } | null>(null);

  const subdomainRegex = /^[a-z0-9][a-z0-9-]{1,28}[a-z0-9]$/;

  const handleSubdomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "");
    setSubdomain(cleaned);
  };

  const isFormatValid = subdomainRegex.test(subdomain);
  const isReserved = isFormatValid && isReservedSubdomain(subdomain);
  const isOwnSubdomain = !!site.subdomain && subdomain === site.subdomain;

  // Cek ketersediaan ke server (debounced) supaya indikator "tersedia" tidak
  // hanya berdasarkan format — duplikat/subdomain terpakai harus tertangkap
  // sebelum user menekan tombol publish.
  useEffect(() => {
    if (!isFormatValid || isReserved || isOwnSubdomain) return;

    let active = true;
    const timer = setTimeout(() => {
      const params = new URLSearchParams({ subdomain });
      if (siteId) params.set("exclude", siteId);
      request<SubdomainAvailabilityResponse>(`/public/subdomain-availability?${params.toString()}`)
        .then((res) => {
          if (!active) return;
          const data = res.data;
          if (!data) {
            setRemoteResult({ subdomain, state: "error" });
            return;
          }
          if (data.available) {
            setRemoteResult({ subdomain, state: "available" });
          } else if (data.reason === "taken") {
            setRemoteResult({ subdomain, state: "taken" });
          } else if (data.reason === "reserved") {
            setRemoteResult({ subdomain, state: "reserved" });
          } else if (data.reason === "invalid") {
            setRemoteResult({ subdomain, state: "invalid" });
          } else {
            setRemoteResult({ subdomain, state: "error" });
          }
        })
        .catch(() => {
          if (active) setRemoteResult({ subdomain, state: "error" });
        });
    }, 450);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [subdomain, isFormatValid, isReserved, isOwnSubdomain, siteId]);

  const availability: AvailabilityState = !isFormatValid
    ? "idle"
    : isReserved
      ? "reserved"
      : isOwnSubdomain
        ? "available"
        : remoteResult && remoteResult.subdomain === subdomain
          ? remoteResult.state
          : "checking";

  const isAvailable = availability === "available";
  const isInputValid = isFormatValid && !isReserved && isAvailable;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isInputValid || !agreed) {
      setSubmitAttempted(true);
      return;
    }
    onConfirm(subdomain);
  };

  const previewDomain = subdomain.trim() ? `${subdomain.trim().toLowerCase()}.${BASE_DOMAIN}` : "";

  const statusTone = isInputValid
    ? "bg-[#3ddc84]/8 text-emerald-600 dark:text-[#5fe3a0] border border-[#3ddc84]/20"
    : availability === "checking"
      ? "bg-muted/40 text-muted-foreground border border-border"
      : "bg-red-500/8 text-[#ff8a8a] border border-red-500/20";

  let statusIcon = "⚠";
  let statusText = t("dashboard.sites.subdomainInvalidHint");
  if (availability === "available") {
    statusIcon = "✓";
    statusText = t("dashboard.sites.subdomainAvailable", undefined, { url: `https://${previewDomain}` });
  } else if (availability === "checking") {
    statusIcon = "…";
    statusText = t("dashboard.sites.subdomainChecking");
  } else if (availability === "taken") {
    statusText = t("dashboard.sites.subdomainTakenHint");
  } else if (availability === "reserved") {
    statusText = t("dashboard.sites.subdomainReservedHint");
  } else if (availability === "error") {
    statusIcon = "!";
    statusText = t("dashboard.sites.subdomainCheckFailed");
  }

  return (
    <Dialog
      open={!!site}
      onOpenChange={(open) => {
        if (!open && !loading) onCancel();
      }}
      title={t("dashboard.sites.publishTitle")}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {loading && (
          <div className="flex items-center gap-3 border border-primary/20 bg-primary/[0.04] rounded-xl px-4 py-3">
            <Loader2 className="w-4.5 h-4.5 animate-spin text-primary shrink-0" />
            <div className="space-y-0.5 min-w-0">
              <p className="text-[12.5px] font-bold text-foreground leading-snug">
                {t("dashboard.sites.publishChecking")}
              </p>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                {t("dashboard.sites.publishCheckingDesc")}
              </p>
            </div>
          </div>
        )}
        {hasModerationBlock ? (
          <>
            <ModerationBlock
              violations={violations!}
              onAppealSubmit={onAppealSubmit!}
              submitting={appealLoading}
              appealed={appealDone}
            />
            <div className="flex pt-1">
              <Button
                type="button"
                variant="outline"
                className="flex-1 rounded-xl h-11 text-sm border-border hover:bg-muted/50"
                onClick={onCancel}
                disabled={appealLoading}
              >
                {t("dashboard.sites.cancel")}
              </Button>
            </div>
          </>
        ) : (
        <>
        {/* Celebration Header Banner */}
        <div className="bg-primary/10 border border-primary/20 rounded-2xl p-4 flex items-center gap-3.5 relative overflow-hidden">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shrink-0">
            <Rocket className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h4 className="text-[13.5px] font-bold text-foreground leading-snug">
              {t("dashboard.sites.publishOneStep")}
            </h4>
            <p className="text-[11.5px] text-foreground/60 leading-relaxed mt-0.5">
              {t("dashboard.sites.publishReady", undefined, { name: site.name })}
            </p>
          </div>
        </div>

        {/* Subdomain Input Field */}
        <div className="space-y-2">
          <label className="text-[12px] font-bold text-foreground/80 tracking-wide block">
            {t("dashboard.sites.subdomainLabel")}
          </label>
          <div
            className={`flex items-center bg-background border rounded-xl overflow-hidden transition-all duration-200 ${
              subdomain && !isInputValid
                ? "border-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.15)] bg-red-500/[0.01]"
                : subdomain && isAvailable
                  ? "border-[#3ddc84]/50 shadow-[0_0_10px_rgba(61,220,132,0.15)] bg-[#3ddc84]/[0.01]"
                  : "border-border hover:border-border focus-within:border-primary/60 focus-within:shadow-[0_0_12px_color-mix(in_srgb,var(--primary)_20%,transparent)]"
            }`}
          >
            <input
              type="text"
              value={subdomain}
              onChange={handleSubdomainChange}
              disabled={loading}
              placeholder={t("dashboard.sites.subdomainPlaceholder")}
              maxLength={30}
              className="flex-1 bg-transparent px-4 py-2.5 text-[14px] text-foreground outline-none placeholder:text-muted-foreground min-w-0 font-medium"
              autoFocus
            />
            <span className="px-3 py-2.5 text-[13px] text-primary font-mono font-bold shrink-0 border-l border-border/70 bg-muted/30 select-none">
              .{BASE_DOMAIN}
            </span>
          </div>

          {previewDomain && (
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] font-mono transition-all ${statusTone}`}>
              <span className="shrink-0 text-[14px]">{statusIcon}</span>
              <span className="truncate leading-none">{statusText}</span>
            </div>
          )}

          <p className="text-[11px] text-muted-foreground leading-relaxed mx-0.5">
            {t("dashboard.sites.subdomainHint")}
          </p>
        </div>

        {/* Custom Domain banner - only shown if site is already live on a subdomain */}
        {site.subdomain && !site.subdomain.startsWith("draft-") && (
          <div className="bg-card border border-border/70 hover:border-border rounded-xl p-4 flex gap-3 transition-colors relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-tr from-primary/10 to-transparent blur-xl pointer-events-none" />
            <div className="w-9 h-9 rounded-lg bg-muted/40 border border-border flex items-center justify-center shrink-0 text-primary group-hover:text-white transition-colors">
              <Globe className="w-4.5 h-4.5" />
            </div>
            <div className="space-y-1">
              <h5 className="text-[12px] font-bold text-foreground flex items-center gap-1.5 leading-none">
                {t("dashboard.sites.connectCustomDomain")}{" "}
                <span className="text-[9px] px-1.5 py-0.5 bg-foreground text-background rounded font-extrabold uppercase shrink-0 tracking-wider">
                  {t("dashboard.pro")}
                </span>
              </h5>
              <p className="text-[11.5px] text-foreground/70 leading-relaxed">
                {t("dashboard.sites.customDomainDescPre")}{" "}
                <Link
                  href="/dashboard/domains"
                  className="text-primary font-semibold hover:text-foreground underline underline-offset-2 transition-colors"
                  onClick={onCancel}
                >
                  {t("dashboard.sites.customDomainLink")}
                </Link>{" "}
                {t("dashboard.sites.customDomainDescPost")}
              </p>
            </div>
          </div>
        )}

        {/* Terms & Conditions Acceptance - placed directly above action buttons */}
        <TermsAcceptance
          agreed={agreed}
          onChange={(v) => {
            setAgreed(v);
            if (v) setSubmitAttempted(false);
          }}
          showError={submitAttempted && !agreed}
          disabled={loading}
        />

        {/* Actions */}
        <div className="flex gap-3 pt-1">
          <Button
            type="button"
            variant="outline"
            className="flex-1 rounded-xl h-11 text-sm border-border hover:bg-muted/50"
            onClick={onCancel}
            disabled={loading}
          >
            {t("dashboard.sites.cancel")}
          </Button>
          <Button
            type="submit"
            className="flex-1 rounded-xl h-11 text-[13.5px] font-bold border-0 transition-all flex items-center justify-center gap-2"
            disabled={loading || !isInputValid || !agreed}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {t("dashboard.sites.launching")}
              </>
            ) : (
              <>
                <Rocket className="w-4 h-4 animate-bounce" style={{ animationDuration: "2.5s" }} />
                {t("dashboard.sites.launchWebsite")}
              </>
            )}
          </Button>
        </div>
        </>
        )}
      </form>
    </Dialog>
  );
}
