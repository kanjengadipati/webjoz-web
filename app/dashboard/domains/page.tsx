"use client";

import React, { useState, useEffect } from "react";
import { useAuthToken } from "@/lib/auth-store";
import { useActiveTenant } from "@/lib/tenant-store";
import { request } from "@/lib/api/client";
import { useRouter } from "next/navigation";
import {
  Loader2, Trash2, Globe, Clock, RefreshCw,
  Server, Copy, Info, Check, Link2, ExternalLink,
  AlertCircle,
} from "lucide-react";
import { useToast } from "@/components/toast-provider";
import { Dialog } from "@/components/ui/dialog";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";

interface Domain {
  id: number;
  created_at: string;
  tenant_id: number;
  site_id: number;
  domain: string;
  type: string;
  status: "pending" | "verified" | "failed";
  verified_at?: string;
}

interface Site {
  id: number;
  name: string;
  subdomain: string;
  status: "draft" | "published";
  template_id?: string;
}

const CNAME_TARGET = "sites.webjoz.com";
const customDomainRegex = /^([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/i;

export default function DomainsPage() {
  const token         = useAuthToken();
  const router        = useRouter();
  const { pushToast } = useToast();
  const { t } = useI18n();
  const { activeTenantId, activeTenant } = useActiveTenant();
  const isPremium = activeTenant?.tenant?.plan === "pro" || activeTenant?.tenant?.plan === "enterprise";

  const [domains,       setDomains]       = useState<Domain[]>([]);
  const [sites,         setSites]         = useState<Site[]>([]);
  const [loading,       setLoading]       = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [currentPlan,   setCurrentPlan]   = useState<any>(null);

  // Form states
  const [siteId,         setSiteId]         = useState("");
  const [domainInput,    setDomainInput]    = useState("");
  const [submitting,     setSubmitting]     = useState(false);
  const [copied,         setCopied]         = useState(false);
  const [showUpsellModal, setShowUpsellModal] = useState(false);
  const [showLimitModal,  setShowLimitModal]  = useState(false);

  // ────────────────────────────────────────────────────────
  const fetchData = async () => {
    if (!token || !activeTenantId) return;
    try {
      setLoading(true);
      const [dr, sr, pr] = await Promise.all([
        request<Domain[]>("/domains", { headers: { "X-Tenant-ID": activeTenantId.toString() } }, token),
        request<Site[]>  ("/sites",   { headers: { "X-Tenant-ID": activeTenantId.toString() } }, token),
        request<any>("/plans/active", { headers: { "X-Tenant-ID": activeTenantId.toString() } }, token),
      ]);
      setDomains(dr.data || []);
      const list = sr.data || [];
      setSites(list);
      setCurrentPlan(pr.data || null);

      const params  = new URLSearchParams(window.location.search);
      const qSiteId = params.get("site_id");
      if (qSiteId && list.some(s => s.id.toString() === qSiteId)) {
        setSiteId(qSiteId);
      } else if (list.length > 0) {
        setSiteId(list[0].id.toString());
      }
    } catch (err: any) {
      pushToast(err.message || t("dashboard.domains.loadFailed"), "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (activeTenantId) fetchData(); }, [activeTenantId]);

  // ── Submit helpers ────────────────────────────────────────
  const proceedAddDomain = async (finalDomain: string) => {
    if (!token || !activeTenantId || !siteId) return;
    try {
      setSubmitting(true);
      await request<Domain>("/domains", {
        method: "POST",
        headers: { "X-Tenant-ID": activeTenantId.toString() },
        body: JSON.stringify({ site_id: Number(siteId), domain: finalDomain }),
      }, token);

      pushToast(t("dashboard.domains.added"), "success");
      setDomainInput("");
      fetchData();
    } catch (err: any) {
      pushToast(err.message || t("dashboard.domains.addFailed"), "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !activeTenantId || !domainInput || !siteId) return;
    const trimmed = domainInput.toLowerCase().trim();
    if (!customDomainRegex.test(trimmed)) {
      pushToast(t("dashboard.domains.invalidFormat"), "error");
      return;
    }
    if (domainLimitReached) {
      setShowLimitModal(true);
    } else if (isPremium) {
      await proceedAddDomain(trimmed);
    } else {
      setShowUpsellModal(true);
    }
  };

  const handleVerify = async (id: number) => {
    if (!token || !activeTenantId) return;
    try {
      setActionLoading(id);
      await request<any>("/domains/verify", {
        method: "POST",
        headers: { "X-Tenant-ID": activeTenantId.toString() },
        body: JSON.stringify({ domain_id: id }),
      }, token);
      pushToast(t("dashboard.domains.verified"), "success");
      fetchData();
    } catch (err: any) {
      pushToast(err.message || t("dashboard.domains.verifyFailed"), "error");
      fetchData();
    } finally { setActionLoading(null); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm(t("dashboard.domains.confirmDelete")) || !token || !activeTenantId) return;
    try {
      setActionLoading(id);
      await request(`/domains/${id}`, {
        method: "DELETE",
        headers: { "X-Tenant-ID": activeTenantId.toString() },
      }, token);
      pushToast(t("dashboard.domains.deleted"), "success");
      fetchData();
    } catch (err: any) {
      pushToast(err.message || t("dashboard.domains.deleteFailed"), "error");
    } finally { setActionLoading(null); }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(CNAME_TARGET);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ── Derived ───────────────────────────────────────────────
  const inputValid = customDomainRegex.test(domainInput.trim());

  // Published sites (have a real subdomain)
  const publishedSites = sites.filter(s => s.status === "published" && s.subdomain && !s.subdomain.startsWith("draft-"));

  const maxDomains = currentPlan?.max_custom_domain ?? 0;
  const domainLimitReached = isPremium && maxDomains > 0 && domains.length >= maxDomains;

  // ── Upselling Modal Footer ───────────────────────────────
  const upsellFooter = (
    <div className="flex w-full gap-3">
      <button
        type="button"
        onClick={() => {
          setShowUpsellModal(false);
          proceedAddDomain(domainInput.toLowerCase().trim());
        }}
        className="flex-1 py-2.5 rounded-xl text-[14px] font-semibold bg-transparent text-[#9a9aa3] border border-white/10 hover:bg-white/[0.04] transition-colors cursor-pointer"
      >
        {t("dashboard.domains.continueConnect")}
      </button>
        <button
          type="button"
          onClick={() => {
            setShowUpsellModal(false);
            router.push("/dashboard/upgrade");
          }}
          className="flex-1 py-2.5 rounded-xl text-[14px] font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all hover:shadow-[0_0_12px_color-mix(in_srgb,var(--primary)_40%,transparent)] cursor-pointer"
        >
          {t("dashboard.domains.upgradeToPro")}
        </button>
    </div>
  );

  // ── Limit Modal Footer ─────────────────────────────────
  const limitFooter = (
    <div className="flex w-full gap-3">
      <button
        type="button"
        onClick={() => setShowLimitModal(false)}
        className="flex-1 py-2.5 rounded-xl text-[14px] font-semibold bg-transparent text-[#9a9aa3] border border-white/10 hover:bg-white/[0.04] transition-colors cursor-pointer"
      >
        {t("dashboard.domains.close")}
      </button>
      <button
        type="button"
        onClick={() => {
          setShowLimitModal(false);
          router.push("/dashboard/upgrade");
        }}
        className="flex-1 py-2.5 rounded-xl text-[14px] font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all hover:shadow-[0_0_12px_color-mix(in_srgb,var(--primary)_40%,transparent)] cursor-pointer"
      >
        {t("dashboard.domains.upgradePlan")}
      </button>
    </div>
  );

  // ────────────────────────────────────────────────────────
  if (loading && domains.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-80 gap-3">
        <Loader2 className="w-5 h-5 text-[#9a9aa3] animate-spin" />
        <p className="text-[13px] text-[#6b6b75]">{t("dashboard.domains.loading")}</p>      </div>
    );
  }

  return (
    <div className="max-w-3xl text-[#f3f3f4] font-sans space-y-8">

      {/* ═══════════════════════════════════════════════
          SECTION 1 — Connected Custom Domains List
      ══════════════════════════════════════════════ */}
      {domains.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-[14px] font-bold text-[#6b6b75] uppercase tracking-wider">
            {t("dashboard.domains.connectedTitle", undefined, { count: String(domains.length) })}
          </h2>
          {isPremium && maxDomains > 0 && (
            <p className="text-[11px] text-[#6b6b75] m-0 mt-0.5" title={t("dashboard.domains.quotaTitle", undefined, { plan: activeTenant?.tenant?.plan === "enterprise" ? "Enterprise" : "Pro", max: String(maxDomains) })}>
              {t("dashboard.domains.quota", undefined, { used: String(domains.length), max: String(maxDomains) })}
            </p>
          )}
          <div className="flex flex-col gap-2">
            {domains.map(dom => {
              const site = sites.find(s => s.id === dom.site_id);
              const ok   = dom.status === "verified";
              const busy = actionLoading === dom.id;
              return (
                <div key={dom.id} className="bg-[#15151a] border border-white/[0.08] rounded-2xl px-5 py-3.5 flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${ok ? "bg-[#3ddc84]/12 text-[#5fe3a0]" : "bg-[#f0b429]/12 text-[#f3c451]"}`}>
                    {ok ? <Globe className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-[14px] m-0 text-[#f3f3f4] truncate">{dom.domain}</p>
                      <span className="text-[9px] px-1.5 py-0.5 rounded font-bold bg-primary/20 text-primary">
                        {t("dashboard.domains.customDomainBadge")}
                      </span>
                    </div>
                    <p className="text-[12px] text-[#6b6b75] m-0 mt-0.5 truncate">
                      → {site ? (
                        <Link href={`/dashboard/sites/${site.id}`} className="hover:text-primary transition-colors">
                          {site.name}
                        </Link>
                      ) : t("dashboard.domains.siteId", undefined, { id: String(dom.site_id) })}
                      {!ok && t("dashboard.domains.waitingPropagation")}
                    </p>
                  </div>
                  <span className={`text-[11px] px-2.5 py-1 rounded-full font-semibold shrink-0 ${ok ? "bg-[#3ddc84]/12 text-[#5fe3a0]" : "bg-[#f0b429]/12 text-[#f3c451]"}`}>
                    {ok ? t("dashboard.domains.active") : t("dashboard.domains.pending")}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {!ok && (
                      <button onClick={() => handleVerify(dom.id)} disabled={busy}
                        className="w-8 h-8 rounded-lg border border-white/10 bg-[#1b1b21] text-[#9a9aa3] flex items-center justify-center hover:text-white hover:border-white/25 transition-colors disabled:opacity-40 cursor-pointer" title={t("dashboard.domains.checkDns")}>
                        {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                      </button>
                    )}
                    <button onClick={() => handleDelete(dom.id)} disabled={busy}
                      className="w-8 h-8 rounded-lg border border-white/10 bg-[#1b1b21] text-[#9a9aa3] flex items-center justify-center hover:text-red-400 hover:border-red-400/40 transition-colors disabled:opacity-40 cursor-pointer" title={t("dashboard.domains.delete")}>
                      {busy && ok ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════
          SECTION 2 — Custom Domain Form
      ══════════════════════════════════════════════ */}
      <section className="bg-[#15151a] border border-white/[0.08] rounded-2xl p-6 space-y-6">
        <div>
          <h2 className="text-[16px] font-bold text-[#f3f3f4] flex items-center gap-2 m-0">
            <Link2 className="w-4 h-4 text-primary" /> {t("dashboard.domains.connectTitle")}
          </h2>
          <p className="text-[13px] text-[#6b6b75] m-0 mt-1">
            {t("dashboard.domains.connectDesc")}
          </p>
        </div>

        {/* Warning if no published sites */}
        {publishedSites.length === 0 ? (
          <div className="flex items-start gap-3 bg-amber-500/5 border border-amber-500/20 rounded-xl px-4 py-3.5">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-[13px] text-amber-300 font-medium m-0">
                {t("dashboard.domains.noPublished")}
              </p>
              <p className="text-[12px] text-[#9a9aa3] m-0 leading-relaxed">
                {t("dashboard.domains.noPublishedDesc")}{" "}
                <Link href="/dashboard/sites" className="text-primary underline underline-offset-2 hover:text-white transition-colors">
                  {t("dashboard.domains.myWebsites")}
                </Link>
                .
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleAddDomain} className="space-y-5">
            {/* Website Selection */}
            <div>
              <label className="block text-[12px] font-semibold text-primary mb-1.5">
                {t("dashboard.domains.linkToSite")}
              </label>
              <select
                value={siteId}
                onChange={e => setSiteId(e.target.value)}
                className="w-full bg-[#0b0b0d] border border-white/15 rounded-xl px-4 py-2.5 text-[14px] text-[#f3f3f4] outline-none focus:border-primary cursor-pointer"
              >
                {publishedSites.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.subdomain}.webjoz.com)
                  </option>
                ))}
              </select>
            </div>

            {/* Custom Domain Input */}
            <div>
              <label className="block text-[12px] font-semibold text-primary mb-1.5">
                {t("dashboard.domains.domainAddress")}
              </label>
              <input
                type="text"
                value={domainInput}
                onChange={e => setDomainInput(e.target.value)}
                placeholder={t("dashboard.domains.domainPlaceholder")}
                className="w-full bg-[#0b0b0d] border border-white/15 rounded-xl px-4 py-2.5 text-[14px] text-[#f3f3f4] outline-none focus:border-primary placeholder:text-[#6b6b75]"
              />
              {domainInput.trim() !== "" && (
                <p className={`text-[11px] mt-1.5 mx-0.5 font-mono ${inputValid ? "text-[#5fe3a0]" : "text-[#ff8a8a]"}`}>
                  {inputValid ? t("dashboard.domains.validFormat") : t("dashboard.domains.invalidFormatHint")}
                </p>
              )}
            </div>

            {/* DNS instructions card */}
            <div className="bg-white/[0.02] border border-white/[0.08] rounded-xl px-5 py-5 space-y-4">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-primary" />
                <span className="text-[13px] font-semibold text-[#c8c8d4]">{t("dashboard.domains.dnsInstructions")}</span>
              </div>

              <div className="space-y-3.5 text-[12px] text-[#9a9aa3] leading-relaxed">
                <div className="flex items-start gap-2.5">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white/5 border border-white/10 text-[10px] text-white shrink-0 font-mono font-bold">1</span>
                  <p className="m-0">
                    {t("dashboard.domains.step1")}
                  </p>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white/5 border border-white/10 text-[10px] text-white shrink-0 font-mono font-bold">2</span>
                  <p className="m-0">
                    {t("dashboard.domains.step2")}
                  </p>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white/5 border border-white/10 text-[10px] text-white shrink-0 font-mono font-bold">3</span>
                  <div className="space-y-2 flex-1">
                    <p className="m-0">
                      {t("dashboard.domains.step3")}
                    </p>
                    <div className="bg-[#0b0b0d] border border-white/5 rounded-xl p-3.5 space-y-2">
                      <div className="grid grid-cols-3 gap-2 text-[10px] uppercase tracking-wider text-[#6b6b75] font-semibold pb-1 border-b border-white/[0.04]">
                        <span>{t("dashboard.domains.dnsType")}</span>
                        <span>{t("dashboard.domains.dnsHost")}</span>
                        <span>{t("dashboard.domains.dnsTarget")}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 items-center font-mono text-[12px] text-[#c8c8d4]">
                        <span className="text-primary font-semibold">CNAME</span>
                        <span>www</span>
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="truncate" title={CNAME_TARGET}>{CNAME_TARGET}</span>
                          <button
                            type="button"
                            onClick={handleCopy}
                            className="w-6 h-6 rounded-md border border-white/10 bg-white/[0.04] text-[#9a9aa3] flex items-center justify-center hover:bg-white/10 hover:text-white transition-colors cursor-pointer shrink-0"
                          >
                            {copied ? <Check className="w-3 h-3 text-[#5fe3a0]" /> : <Copy className="w-3 h-3" />}
                          </button>
      {/* Limit Reached Dialog */}
      <Dialog
        open={showLimitModal}
        onOpenChange={setShowLimitModal}
        title={t("dashboard.domains.limitTitle")}
        footer={limitFooter}
      >
        <div className="space-y-4">
          <p className="text-[14px] leading-relaxed text-[#9a9aa3] m-0">
            {t("dashboard.domains.limitDesc", undefined, { plan: activeTenant?.tenant?.plan === "enterprise" ? "Enterprise" : "Pro", max: String(maxDomains) })}
          </p>
          <p className="text-[14px] leading-relaxed text-[#9a9aa3] m-0">
            {t("dashboard.domains.limitDesc2")}
          </p>
        </div>
      </Dialog>
    </div>
                      </div>
                    </div>
                    <p className="text-[11px] text-[#6b6b75] m-0 italic">
                      {t("dashboard.domains.note")}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white/5 border border-white/10 text-[10px] text-white shrink-0 font-mono font-bold">4</span>
                  <p className="m-0">
                    {t("dashboard.domains.step4")}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2 bg-primary/5 border border-primary/20 rounded-xl px-3.5 py-3 text-[11px] text-primary leading-relaxed">
                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{t("dashboard.domains.verifyHint")}</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!inputValid || submitting || !siteId || domainLimitReached}
              className={`w-full py-2.5 rounded-xl text-[14px] font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                !inputValid || submitting || !siteId || domainLimitReached
                  ? "bg-[#2a2a2a] text-[#6b6b75] cursor-not-allowed"
                  : "bg-primary text-primary-foreground hover:bg-primary/90"
              }`}
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Link2 className="w-4 h-4" />
                  {t("dashboard.domains.connectBtn")}
                </>
              )}
            </button>
          </form>
        )}
      </section>

      {/* Upselling Dialog */}
      <Dialog
        open={showUpsellModal}
        onOpenChange={setShowUpsellModal}
        title={t("dashboard.domains.upsellTitle")}
        footer={upsellFooter}
      >
        <div className="space-y-4">
          <p className="text-[14px] leading-relaxed text-[#9a9aa3] m-0">
            {t("dashboard.domains.upsellDesc")}
          </p>
          <div className="bg-[#1b1b21] border border-white/10 rounded-xl p-4 space-y-3">
            <div className="flex items-start gap-3">
              <span className="text-emerald-400 font-bold leading-none mt-0.5">✓</span>
              <p className="text-[13px] text-[#f3f3f4] m-0 leading-relaxed">
                <strong>{t("dashboard.domains.upsellBranding")}:</strong> {t("dashboard.domains.upsellBrandingDesc")}
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-emerald-400 font-bold leading-none mt-0.5">✓</span>
              <p className="text-[13px] text-[#f3f3f4] m-0 leading-relaxed">
                <strong>{t("dashboard.domains.upsellSeo")}:</strong> {t("dashboard.domains.upsellSeoDesc")}
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-emerald-400 font-bold leading-none mt-0.5">✓</span>
              <p className="text-[13px] text-[#f3f3f4] m-0 leading-relaxed">
                <strong>{t("dashboard.domains.upsellSsl")}:</strong> {t("dashboard.domains.upsellSslDesc")}
              </p>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
