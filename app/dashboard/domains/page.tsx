"use client";

import React, { useState, useEffect } from "react";
import { useAuthToken } from "@/lib/auth-store";
import { useActiveTenant } from "@/lib/tenant-store";
import { request } from "@/lib/api/client";
import { useRouter } from "next/navigation";
import {
  Loader2, Trash2, Globe, Clock, RefreshCw,
  Server, Copy, Info, Check, Link2, ExternalLink,
  AlertCircle, Search, ShoppingCart,
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

interface AvailabilityResult {
  domain: string;
  status: string;
  currency: string;
  sell_price_usd: number;
  sell_price_idr: number;
}

interface PurchasedDomain {
  id: number;
  domain_name: string;
  sell_price_idr: number;
  expires_at: string;
  status: string;
  years: number;
  registrar: string;
}

const CNAME_TARGET = "sites.webjoz.com";
const customDomainRegex = /^([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/i;
const POPULAR_TLDS = ["com", "net", "org", "id", "co.id", "web.id", "xyz", "store"];

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

  // Tab + buy-domain states
  const [tab,               setTab]               = useState<"buy" | "own">("buy");
  const [purchased,         setPurchased]         = useState<PurchasedDomain[]>([]);
  const [buyName,           setBuyName]           = useState("");
  const [selectedTlds,      setSelectedTlds]      = useState<string[]>(["com"]);
  const [searching,         setSearching]         = useState(false);
  const [results,           setResults]           = useState<AvailabilityResult[]>([]);
  const [searched,          setSearched]          = useState(false);
  const [buyingDomain,      setBuyingDomain]      = useState<string | null>(null);
  const [purchaseAvailable, setPurchaseAvailable] = useState(true);

  // Purchaser data modal
  const [showPurchaserModal, setShowPurchaserModal] = useState(false);
  const [purchaserDomain,    setPurchaserDomain]    = useState("");
  const [purchaser, setPurchaser] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    country: "ID",
    zip: "",
  });

  // ────────────────────────────────────────────────────────
  const fetchPurchased = async () => {
    if (!token || !activeTenantId) return;
    try {
      const pr = await request<PurchasedDomain[]>("/domain-purchases", { headers: { "X-Tenant-ID": activeTenantId.toString() } }, token);
      setPurchased(pr.data || []);
    } catch {
      setPurchaseAvailable(false);
    }
  };

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
    fetchPurchased();
  };

  useEffect(() => { if (activeTenantId) fetchData(); }, [activeTenantId]);

  // ── Buy-domain helpers ──────────────────────────────────
  const formatIDR = (n: number) => {
    if (!n) return "-";
    return "Rp" + Math.round(n).toLocaleString("id-ID");
  };

  const toggleTld = (tld: string) => {
    setSelectedTlds(prev =>
      prev.includes(tld) ? prev.filter(t => t !== tld) : [...prev, tld],
    );
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    let sld = buyName.toLowerCase().trim();
    let tldsToSearch = [...selectedTlds];

    // Auto-detect full domain (e.g. "syalalapro.net")
    const dotIdx = sld.lastIndexOf(".");
    if (dotIdx > 0 && dotIdx < sld.length - 1) {
      const detectedTld = sld.slice(dotIdx + 1);
      sld = sld.slice(0, dotIdx);
      if (!tldsToSearch.includes(detectedTld)) {
        tldsToSearch = [detectedTld];
        setSelectedTlds(tldsToSearch);
      }
      setBuyName(sld);
    }

    if (!token || !activeTenantId || !sld || tldsToSearch.length === 0) return;
    try {
      setSearching(true);
      setSearched(false);
      const sr = await request<AvailabilityResult[]>("/domain-purchases/search", {
        method: "POST",
        headers: { "X-Tenant-ID": activeTenantId.toString() },
        body: JSON.stringify({ name: sld, tlds: tldsToSearch.join(",") }),
      }, token);
      setResults(sr.data || []);
      setSearched(true);
    } catch (err: unknown) {
      pushToast((err as Error).message || t("dashboard.domains.buyFailed"), "error");
    } finally {
      setSearching(false);
    }
  };

  const handleBuy = async (domain: string) => {
    setPurchaserDomain(domain);
    setShowPurchaserModal(true);
  };

  const confirmBuy = async () => {
    if (!token || !activeTenantId || !siteId || !purchaserDomain) return;
    try {
      setBuyingDomain(purchaserDomain);
      await request<PurchasedDomain>("/domain-purchases", {
        method: "POST",
        headers: { "X-Tenant-ID": activeTenantId.toString() },
        body: JSON.stringify({
          site_id: Number(siteId),
          domain_name: purchaserDomain,
          years: 1,
          purchaser: {
            name: purchaser.name,
            company: purchaser.company,
            email: purchaser.email,
            phone: purchaser.phone,
            address: purchaser.address,
            city: purchaser.city,
            state: purchaser.state,
            country: purchaser.country,
            zip: purchaser.zip,
          },
        }),
      }, token);
      pushToast(t("dashboard.domains.buySuccess"), "success");
      setResults([]);
      setSearched(false);
      setBuyName("");
      setShowPurchaserModal(false);
      fetchPurchased();
      fetchData();
    } catch (err: unknown) {
      pushToast((err as Error).message || t("dashboard.domains.buyFailed"), "error");
    } finally {
      setBuyingDomain(null);
    }
  };

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
        className="flex-1 py-2.5 rounded-xl text-[14px] font-semibold bg-transparent text-muted-foreground border border-border hover:bg-muted/50 transition-colors cursor-pointer"
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
        className="flex-1 py-2.5 rounded-xl text-[14px] font-semibold bg-transparent text-muted-foreground border border-border hover:bg-muted/50 transition-colors cursor-pointer"
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
        <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
        <p className="text-[13px] text-muted-foreground">{t("dashboard.domains.loading")}</p>      </div>
    );
  }

  return (
    <div className="max-w-3xl text-foreground font-sans space-y-8">

      {/* ═══════════════════════════════════════════════
          TAB SWITCHER — Buy New Domain / Already Own
      ══════════════════════════════════════════════ */}
      <div className="grid grid-cols-2 gap-1 bg-card border border-border rounded-2xl p-1.5 w-full sm:w-fit sm:flex sm:items-center">
        {purchaseAvailable && (
          <button
            type="button"
            onClick={() => setTab("buy")}
            className={`w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs sm:text-[13px] font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              tab === "buy" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
            }`}
          >
            <ShoppingCart className="w-4 h-4 shrink-0" />
            <span className="truncate">{t("dashboard.domains.buyTab")}</span>
          </button>
        )}
        <button
          type="button"
          onClick={() => setTab("own")}
          className={`w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs sm:text-[13px] font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 ${
            tab === "own" || !purchaseAvailable ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
          }`}
        >
          <Globe className="w-4 h-4 shrink-0" />
          <span className="truncate">{t("dashboard.domains.ownTab")}</span>
        </button>
      </div>

      {/* ═══════════════════════════════════════════════
          TAB — BUY NEW DOMAIN
      ══════════════════════════════════════════════ */}
      {tab === "buy" && purchaseAvailable && (
        <section className="space-y-6">

          {/* Purchased domains list */}
          {purchased.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-[14px] font-bold text-muted-foreground uppercase tracking-wider">
                {t("dashboard.domains.purchasedTitle")} ({purchased.length})
              </h2>
              <div className="flex flex-col gap-2">
                {purchased.map(d => (
                  <div key={d.id} className="bg-card border border-border rounded-2xl px-5 py-3.5 flex items-center gap-3 transition-all duration-200 hover:border-primary/30 hover:shadow-sm">
                    <div className="w-9 h-9 rounded-full bg-emerald-500/15 dark:bg-[#3ddc84]/12 text-emerald-600 dark:text-[#5fe3a0] flex items-center justify-center shrink-0">
                      <Globe className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[14px] m-0 text-foreground truncate">{d.domain_name}</p>
                      <p className="text-[12px] text-muted-foreground m-0 mt-0.5">
                        {t("dashboard.domains.expiresAt")} {new Date(d.expires_at).toLocaleDateString("id-ID")}
                      </p>
                    </div>
                    <span className="text-[11px] px-2.5 py-1 rounded-full font-semibold shrink-0 bg-emerald-500/15 dark:bg-[#3ddc84]/12 text-emerald-600 dark:text-[#5fe3a0]">
                      {t("dashboard.domains.active")}
                    </span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded font-bold bg-muted text-muted-foreground">
                      {d.registrar === "dna" ? "DNA" : "RC"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Search form */}
          <div className="bg-card border border-border rounded-2xl p-4 sm:p-6 space-y-6">
            <div>
              <h2 className="text-[16px] font-bold text-foreground flex items-center gap-2 m-0">
                <Search className="w-4 h-4 text-primary" /> {t("dashboard.domains.buyTitle")}
              </h2>
              <p className="text-[13px] text-muted-foreground m-0 mt-1">
                {t("dashboard.domains.buyDesc")}
              </p>
            </div>

            {publishedSites.length === 0 ? (
              <div className="flex items-start gap-3 bg-amber-500/5 border border-amber-500/20 rounded-xl px-4 py-3.5">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-[13px] text-amber-300 font-medium m-0">
                    {t("dashboard.domains.noPublished")}
                  </p>
                  <p className="text-[12px] text-muted-foreground m-0 leading-relaxed">
                    {t("dashboard.domains.noPublishedDesc")}{" "}
                    <Link href="/dashboard/sites" className="text-primary underline underline-offset-2 hover:text-white transition-colors">
                      {t("dashboard.domains.myWebsites")}
                    </Link>
                    .
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSearch} className="space-y-5">
                {/* Website Selection */}
                <div>
                  <label className="block text-[12px] font-semibold text-primary mb-1.5">
                    {t("dashboard.domains.linkToSite")}
                  </label>
                  <select
                    value={siteId}
                    onChange={e => setSiteId(e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-[14px] text-foreground outline-none focus:border-primary cursor-pointer"
                  >
                    {publishedSites.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.subdomain}.webjoz.com)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Domain name */}
                <div>
                  <label className="block text-[12px] font-semibold text-primary mb-1.5">
                    {t("dashboard.domains.searchLabel")}
                  </label>
                  <input
                    type="text"
                    value={buyName}
                    onChange={e => setBuyName(e.target.value)}
                    placeholder={t("dashboard.domains.searchPlaceholder")}
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-[14px] text-foreground outline-none focus:border-primary placeholder:text-muted-foreground"
                  />
                </div>

                {/* TLD checkboxes */}
                <div className="space-y-2">
                  <label className="block text-[12px] font-semibold text-primary">
                    {t("dashboard.domains.chooseTlds")}
                  </label>
                  <div className="grid grid-cols-4 sm:flex sm:flex-wrap gap-2">
                    {POPULAR_TLDS.map(tld => {
                      const selected = selectedTlds.includes(tld);
                      return (
                        <button
                          key={tld}
                          type="button"
                          onClick={() => toggleTld(tld)}
                          className={`py-2 px-3 rounded-xl text-[12px] font-mono font-semibold border text-center transition-all cursor-pointer ${
                            selected
                              ? "bg-primary/20 text-primary border-primary/40 shadow-sm"
                              : "bg-background text-muted-foreground border-border hover:text-foreground hover:border-border/80"
                          }`}
                        >
                          .{tld}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={searching || !buyName.trim() || selectedTlds.length === 0}
                  className={`w-full py-3 rounded-xl text-[14px] font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm ${
                    searching || !buyName.trim() || selectedTlds.length === 0
                      ? "bg-muted text-muted-foreground cursor-not-allowed"
                      : "bg-primary text-primary-foreground hover:bg-primary/90"
                  }`}
                >
                  {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                  {searching ? t("dashboard.domains.searching") : t("dashboard.domains.searchBtn")}
                </button>
              </form>
            )}

            {/* Results */}
            {searched && results.length > 0 && (
              <div className="space-y-3">
                {results.map(r => {
                  const ok = r.status === "available";
                  const busy = buyingDomain === r.domain;
                  return (
                    <div key={r.domain} className="bg-card border border-border rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${ok ? "bg-emerald-500/15 dark:bg-[#3ddc84]/12 text-emerald-600 dark:text-[#5fe3a0]" : "bg-amber-400/15 dark:bg-[#f0b429]/12 text-amber-600 dark:text-[#f3c451]"}`}>
                          {ok ? <Globe className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-[15px] m-0 text-foreground font-mono truncate">{r.domain}</p>
                          <p className={`text-[12px] font-medium m-0 mt-0.5 ${ok ? "text-emerald-600 dark:text-[#5fe3a0]" : "text-muted-foreground"}`}>
                            {ok ? t("dashboard.domains.available") : t("dashboard.domains.unavailable")}
                          </p>
                        </div>
                      </div>

                      {ok && (
                        <div className="flex items-center justify-between sm:justify-end gap-4 pt-3 sm:pt-0 border-t sm:border-t-0 border-border/40 shrink-0">
                          <div className="text-left sm:text-right">
                            <span className="text-[15px] font-bold text-foreground block leading-tight">
                              {formatIDR(r.sell_price_idr)}
                              <span className="text-[11px] font-normal text-muted-foreground ml-1">{t("dashboard.domains.perYear")}</span>
                            </span>
                            {r.sell_price_usd > 0 && (
                              <span className="text-[11px] text-muted-foreground block mt-0.5">
                                {"$" + r.sell_price_usd.toFixed(2)} USD (PayPal)
                              </span>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => handleBuy(r.domain)}
                            disabled={busy || !siteId}
                            className="px-4 py-2.5 rounded-xl text-[13px] font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all flex items-center justify-center gap-1.5 disabled:opacity-40 cursor-pointer shadow-sm shrink-0"
                          >
                            {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ShoppingCart className="w-3.5 h-3.5" />}
                            {busy ? t("dashboard.domains.buying") : t("dashboard.domains.buyBtn")}
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {searched && results.length === 0 && (
              <p className="text-[13px] text-muted-foreground m-0">{t("dashboard.domains.noResults")}</p>
            )}
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════
          TAB — ALREADY OWN A DOMAIN (BYOD)
      ══════════════════════════════════════════════ */}
      {(tab === "own" || !purchaseAvailable) && (
      <>
      {/* ═══════════════════════════════════════════════
          SECTION 1 — Connected Custom Domains List
      ══════════════════════════════════════════════ */}      {domains.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-[14px] font-bold text-muted-foreground uppercase tracking-wider">
            {t("dashboard.domains.connectedTitle", undefined, { count: String(domains.length) })}
          </h2>
          {isPremium && maxDomains > 0 && (
            <p className="text-[11px] text-muted-foreground m-0 mt-0.5" title={t("dashboard.domains.quotaTitle", undefined, { plan: activeTenant?.tenant?.plan === "enterprise" ? "Enterprise" : "Pro", max: String(maxDomains) })}>
              {t("dashboard.domains.quota", undefined, { used: String(domains.length), max: String(maxDomains) })}
            </p>
          )}
          <div className="flex flex-col gap-2">
            {domains.map(dom => {
              const site = sites.find(s => s.id === dom.site_id);
              const ok   = dom.status === "verified";
              const busy = actionLoading === dom.id;
              return (
                <div key={dom.id} className="bg-card border border-border rounded-2xl px-5 py-3.5 flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${ok ? "bg-emerald-500/15 dark:bg-[#3ddc84]/12 text-emerald-600 dark:text-[#5fe3a0]" : "bg-amber-400/15 dark:bg-[#f0b429]/12 text-amber-600 dark:text-[#f3c451]"}`}>
                    {ok ? <Globe className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-[14px] m-0 text-foreground truncate">{dom.domain}</p>
                      <span className="text-[9px] px-1.5 py-0.5 rounded font-bold bg-primary/20 text-primary">
                        {t("dashboard.domains.customDomainBadge")}
                      </span>
                    </div>
                    <p className="text-[12px] text-muted-foreground m-0 mt-0.5 truncate">
                      → {site ? (
                        <Link href={`/dashboard/sites/${site.id}`} className="hover:text-primary transition-colors">
                          {site.name}
                        </Link>
                      ) : t("dashboard.domains.siteId", undefined, { id: String(dom.site_id) })}
                      {!ok && t("dashboard.domains.waitingPropagation")}
                    </p>
                  </div>
                  <span className={`text-[11px] px-2.5 py-1 rounded-full font-semibold shrink-0 ${ok ? "bg-emerald-500/15 dark:bg-[#3ddc84]/12 text-emerald-600 dark:text-[#5fe3a0]" : "bg-amber-400/15 dark:bg-[#f0b429]/12 text-amber-600 dark:text-[#f3c451]"}`}>
                    {ok ? t("dashboard.domains.active") : t("dashboard.domains.pending")}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {!ok && (
                      <button onClick={() => handleVerify(dom.id)} disabled={busy}
                        className="w-8 h-8 rounded-lg border border-border bg-muted/50 text-muted-foreground flex items-center justify-center hover:text-white hover:border-border transition-colors disabled:opacity-40 cursor-pointer" title={t("dashboard.domains.checkDns")}>
                        {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                      </button>
                    )}
                    <button onClick={() => handleDelete(dom.id)} disabled={busy}
                      className="w-8 h-8 rounded-lg border border-border bg-muted/50 text-muted-foreground flex items-center justify-center hover:text-red-400 hover:border-red-400/40 transition-colors disabled:opacity-40 cursor-pointer" title={t("dashboard.domains.delete")}>
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
      <section className="bg-card border border-border rounded-2xl p-6 space-y-6">
        <div>
          <h2 className="text-[16px] font-bold text-foreground flex items-center gap-2 m-0">
            <Link2 className="w-4 h-4 text-primary" /> {t("dashboard.domains.connectTitle")}
          </h2>
          <p className="text-[13px] text-muted-foreground m-0 mt-1">
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
              <p className="text-[12px] text-muted-foreground m-0 leading-relaxed">
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
                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-[14px] text-foreground outline-none focus:border-primary cursor-pointer"
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
                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-[14px] text-foreground outline-none focus:border-primary placeholder:text-muted-foreground"
              />
              {domainInput.trim() !== "" && (
                <p className={`text-[11px] mt-1.5 mx-0.5 font-mono ${inputValid ? "text-emerald-600 dark:text-[#5fe3a0]" : "text-[#ff8a8a]"}`}>
                  {inputValid ? t("dashboard.domains.validFormat") : t("dashboard.domains.invalidFormatHint")}
                </p>
              )}
            </div>

            {/* DNS instructions card */}
            <div className="bg-muted/30 border border-border rounded-xl px-5 py-5 space-y-4">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-primary" />
                <span className="text-[13px] font-semibold text-foreground/80">{t("dashboard.domains.dnsInstructions")}</span>
              </div>

              <div className="space-y-3.5 text-[12px] text-muted-foreground leading-relaxed">
                <div className="flex items-start gap-2.5">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white/5 border border-border text-[10px] text-white shrink-0 font-mono font-bold">1</span>
                  <p className="m-0">
                    {t("dashboard.domains.step1")}
                  </p>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white/5 border border-border text-[10px] text-white shrink-0 font-mono font-bold">2</span>
                  <p className="m-0">
                    {t("dashboard.domains.step2")}
                  </p>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white/5 border border-border text-[10px] text-white shrink-0 font-mono font-bold">3</span>
                  <div className="space-y-2 flex-1">
                    <p className="m-0">
                      {t("dashboard.domains.step3")}
                    </p>
                    <div className="bg-background border border-border/50 rounded-xl p-3.5 space-y-2">
                      <div className="grid grid-cols-3 gap-2 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold pb-1 border-b border-white/[0.04]">
                        <span>{t("dashboard.domains.dnsType")}</span>
                        <span>{t("dashboard.domains.dnsHost")}</span>
                        <span>{t("dashboard.domains.dnsTarget")}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 items-center font-mono text-[12px] text-foreground/80">
                        <span className="text-primary font-semibold">CNAME</span>
                        <span>www</span>
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="truncate" title={CNAME_TARGET}>{CNAME_TARGET}</span>
                          <button
                            type="button"
                            onClick={handleCopy}
                            className="w-6 h-6 rounded-md border border-border bg-muted/50 text-muted-foreground flex items-center justify-center hover:bg-white/10 hover:text-white transition-colors cursor-pointer shrink-0"
                          >
                            {copied ? <Check className="w-3 h-3 text-emerald-600 dark:text-[#5fe3a0]" /> : <Copy className="w-3 h-3" />}
                          </button>
      {/* Limit Reached Dialog */}
      <Dialog
        open={showLimitModal}
        onOpenChange={setShowLimitModal}
        title={t("dashboard.domains.limitTitle")}
        footer={limitFooter}
      >
        <div className="space-y-4">
          <p className="text-[14px] leading-relaxed text-muted-foreground m-0">
            {t("dashboard.domains.limitDesc", undefined, { plan: activeTenant?.tenant?.plan === "enterprise" ? "Enterprise" : "Pro", max: String(maxDomains) })}
          </p>
          <p className="text-[14px] leading-relaxed text-muted-foreground m-0">
            {t("dashboard.domains.limitDesc2")}
          </p>
        </div>
      </Dialog>
    </div>
                      </div>
                    </div>
                    <p className="text-[11px] text-muted-foreground m-0 italic">
                      {t("dashboard.domains.note")}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white/5 border border-border text-[10px] text-white shrink-0 font-mono font-bold">4</span>
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
                  ? "bg-muted text-muted-foreground cursor-not-allowed"
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
          <p className="text-[14px] leading-relaxed text-muted-foreground m-0">
            {t("dashboard.domains.upsellDesc")}
          </p>
          <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
            <div className="flex items-start gap-3">
              <span className="text-emerald-400 font-bold leading-none mt-0.5">✓</span>
              <p className="text-[13px] text-foreground m-0 leading-relaxed">
                <strong>{t("dashboard.domains.upsellBranding")}:</strong> {t("dashboard.domains.upsellBrandingDesc")}
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-emerald-400 font-bold leading-none mt-0.5">✓</span>
              <p className="text-[13px] text-foreground m-0 leading-relaxed">
                <strong>{t("dashboard.domains.upsellSeo")}:</strong> {t("dashboard.domains.upsellSeoDesc")}
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-emerald-400 font-bold leading-none mt-0.5">✓</span>
              <p className="text-[13px] text-foreground m-0 leading-relaxed">
                <strong>{t("dashboard.domains.upsellSsl")}:</strong> {t("dashboard.domains.upsellSslDesc")}
              </p>
            </div>
          </div>
        </div>
      </Dialog>
      </>
      )}

      {/* ── Purchaser Data Modal ─────────────────────────── */}
      {showPurchaserModal && (
        <Dialog open onOpenChange={open => { if (!open) setShowPurchaserModal(false); }} title={t("dashboard.domains.purchaserTitle")} footer={<></>}>
          <p className="text-[12px] text-muted-foreground mb-4">{t("dashboard.domains.purchaserDesc")}</p>

          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-semibold text-primary mb-1">{t("dashboard.domains.purchaserName")} *</label>
              <input value={purchaser.name} onChange={e => setPurchaser(p => ({ ...p, name: e.target.value }))} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-[13px] text-foreground outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-primary mb-1">{t("dashboard.domains.purchaserCompany")}</label>
              <input value={purchaser.company} onChange={e => setPurchaser(p => ({ ...p, company: e.target.value }))} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-[13px] text-foreground outline-none focus:border-primary" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-primary mb-1">{t("dashboard.domains.purchaserEmail")} *</label>
                <input type="email" value={purchaser.email} onChange={e => setPurchaser(p => ({ ...p, email: e.target.value }))} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-[13px] text-foreground outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-primary mb-1">{t("dashboard.domains.purchaserPhone")} *</label>
                <input value={purchaser.phone} onChange={e => setPurchaser(p => ({ ...p, phone: e.target.value }))} placeholder="+62812..." className="w-full bg-background border border-border rounded-lg px-3 py-2 text-[13px] text-foreground outline-none focus:border-primary" />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-primary mb-1">{t("dashboard.domains.purchaserAddress")} *</label>
              <input value={purchaser.address} onChange={e => setPurchaser(p => ({ ...p, address: e.target.value }))} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-[13px] text-foreground outline-none focus:border-primary" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-primary mb-1">{t("dashboard.domains.purchaserCity")} *</label>
                <input value={purchaser.city} onChange={e => setPurchaser(p => ({ ...p, city: e.target.value }))} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-[13px] text-foreground outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-primary mb-1">{t("dashboard.domains.purchaserState")} *</label>
                <input value={purchaser.state} onChange={e => setPurchaser(p => ({ ...p, state: e.target.value }))} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-[13px] text-foreground outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-primary mb-1">{t("dashboard.domains.purchaserZip")} *</label>
                <input value={purchaser.zip} onChange={e => setPurchaser(p => ({ ...p, zip: e.target.value }))} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-[13px] text-foreground outline-none focus:border-primary" />
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-5">
            <button onClick={() => setShowPurchaserModal(false)} className="flex-1 py-2 rounded-xl text-[13px] font-semibold border border-border text-muted-foreground hover:bg-muted transition-colors cursor-pointer">
              {t("common.cancel")}
            </button>
            <button
              onClick={confirmBuy}
              disabled={!purchaser.name || !purchaser.email || !purchaser.phone || !purchaser.address || !purchaser.city || !purchaser.state || !purchaser.zip || !!buyingDomain}
              className="flex-1 py-2 rounded-xl text-[13px] font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center justify-center gap-1.5 disabled:opacity-40 cursor-pointer"
            >
              {buyingDomain === purchaserDomain ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ShoppingCart className="w-3.5 h-3.5" />}
              {buyingDomain === purchaserDomain ? t("dashboard.domains.buying") : t("dashboard.domains.buyBtn")}
            </button>
          </div>
        </Dialog>
      )}
    </div>
  );
}
