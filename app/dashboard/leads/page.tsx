"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useAuthToken } from "@/lib/auth-store";
import { useActiveTenant } from "@/lib/tenant-store";
import { request } from "@/lib/api/client";
import { 
  Inbox, Loader2, Calendar, Phone, Mail, Globe, 
  MessageSquare, User, Eye, ArrowUpRight, Filter,
  ShoppingBag, Search, ExternalLink, MessageCircle,
  Copy, Check, X, DollarSign, Clock, Layers, RefreshCw
} from "lucide-react";
import { Button, Card, CardContent, CardHeader, CardTitle, Dialog } from "@/components/ui";
import { useToast } from "@/components/toast-provider";
import { useI18n } from "@/lib/i18n/context";

interface CartVariantTag {
  group_name: string;
  option_name: string;
  price_delta?: number;
}

interface CartItemPayload {
  id: string;
  name: string;
  qty: number;
  price?: string | null;
  price_amount?: number | null;
  price_display?: string | null;
  category?: string;
  selected_variants?: CartVariantTag[];
}

interface Lead {
  id: number;
  created_at: string;
  tenant_id: number;
  site_id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  type?: string;
  total_amount?: number | null;
  payload?: string;
  source_url: string;
}

interface Site {
  id: number;
  name: string;
  subdomain?: string;
}

export default function LeadsPage() {
  const token = useAuthToken();
  const { pushToast } = useToast();
  const { t, locale } = useI18n();
  const { activeTenantId } = useActiveTenant();

  const [leads, setLeads] = useState<Lead[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter & Detail states
  const [selectedSiteId, setSelectedSiteId] = useState("all");
  const [activeTab, setActiveTab] = useState<"all" | "order" | "contact">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeLead, setActiveLead] = useState<Lead | null>(null);
  const [mobileDetailOpen, setMobileDetailOpen] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const fetchData = async () => {
    if (!token || !activeTenantId) return;
    try {
      setLoading(true);
      // Fetch leads
      const leadsRes = await request<Lead[]>("/leads", {
        headers: { "X-Tenant-ID": activeTenantId.toString() }
      }, token);
      setLeads(leadsRes.data || []);

      // Fetch sites for filtering
      const sitesRes = await request<Site[]>("/sites", {
        headers: { "X-Tenant-ID": activeTenantId.toString() }
      }, token);
      setSites(sitesRes.data || []);
    } catch (err: any) {
      pushToast(err.message || t("dashboard.leads.loadFailed"), "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTenantId) {
      fetchData();
    }
  }, [activeTenantId]);

  const formatDate = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString(locale === "id" ? "id-ID" : "en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return isoStr;
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    pushToast(t("dashboard.leads.copied"), "success");
    setTimeout(() => {
      setCopiedKey((prev) => (prev === key ? null : prev));
    }, 2000);
  };

  // Filter logic
  const filteredLeads = useMemo(() => {
    return leads.filter((l) => {
      // Site filter
      if (selectedSiteId !== "all" && l.site_id !== Number(selectedSiteId)) {
        return false;
      }
      // Type tab filter
      const leadType = l.type || "contact";
      if (activeTab === "order" && leadType !== "order") return false;
      if (activeTab === "contact" && leadType !== "contact") return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const nameMatch = l.name?.toLowerCase().includes(q);
        const phoneMatch = l.phone?.toLowerCase().includes(q);
        const emailMatch = l.email?.toLowerCase().includes(q);
        const msgMatch = l.message?.toLowerCase().includes(q);
        if (!nameMatch && !phoneMatch && !emailMatch && !msgMatch) return false;
      }
      return true;
    });
  }, [leads, selectedSiteId, activeTab, searchQuery]);

  const orderCount = useMemo(() => leads.filter((l) => l.type === "order").length, [leads]);
  const contactCount = useMemo(() => leads.filter((l) => !l.type || l.type === "contact").length, [leads]);
  
  const totalRevenue = useMemo(() => {
    return leads
      .filter((l) => l.type === "order" && typeof l.total_amount === "number")
      .reduce((sum, l) => sum + (l.total_amount || 0), 0);
  }, [leads]);

  const parsedCartItems = useMemo<CartItemPayload[] | null>(() => {
    if (!activeLead || !activeLead.payload) return null;
    try {
      const parsed = JSON.parse(activeLead.payload);
      return Array.isArray(parsed) ? parsed : null;
    } catch {
      return null;
    }
  }, [activeLead]);

  const resetFilters = () => {
    setSelectedSiteId("all");
    setActiveTab("all");
    setSearchQuery("");
  };

  const handleOpenDetail = (lead: Lead) => {
    setActiveLead(lead);
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setMobileDetailOpen(true);
    }
  };

  // Lead Detail Content Component (reused in desktop sticky panel & mobile dialog)
  const renderLeadDetail = (lead: Lead) => {
    const matchedSite = sites.find((s) => s.id === lead.site_id);
    const isOrder = lead.type === "order";
    const cleanPhone = lead.phone ? lead.phone.replace(/\D/g, "") : "";
    const waLink = cleanPhone ? `https://wa.me/${cleanPhone}` : "";

    return (
      <div className="space-y-4">
        {/* Customer Header Card */}
        <div className="p-4 rounded-2xl bg-muted/30 border border-border/50 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-sm ${
                isOrder 
                  ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" 
                  : "bg-primary/15 text-primary"
              }`}>
                {lead.name ? lead.name.slice(0, 2).toUpperCase() : <User className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="font-bold text-base text-foreground leading-snug">{lead.name || "Anonim"}</h3>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{formatDate(lead.created_at)}</span>
                </div>
              </div>
            </div>

            <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shrink-0 ${
              isOrder 
                ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20" 
                : "bg-primary/15 text-primary border border-primary/20"
            }`}>
              {isOrder ? t("dashboard.leads.orderBadge") : t("dashboard.leads.contactBadge")}
            </span>
          </div>

          {/* Quick Contact Badges */}
          <div className="flex flex-wrap gap-2 pt-1 border-t border-border/40">
            {lead.phone && (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-background border border-border/70 text-xs">
                <Phone className="w-3.5 h-3.5 text-emerald-500" />
                <span className="font-medium text-foreground">{lead.phone}</span>
                <button 
                  type="button" 
                  onClick={() => copyToClipboard(lead.phone, "phone")}
                  className="p-1 hover:text-primary transition-colors cursor-pointer text-muted-foreground ml-1"
                  title={t("dashboard.leads.copyPhone")}
                >
                  {copiedKey === "phone" ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
            )}

            {lead.email && (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-background border border-border/70 text-xs">
                <Mail className="w-3.5 h-3.5 text-primary" />
                <span className="font-medium text-foreground truncate max-w-[160px] sm:max-w-none">{lead.email}</span>
                <button 
                  type="button" 
                  onClick={() => copyToClipboard(lead.email, "email")}
                  className="p-1 hover:text-primary transition-colors cursor-pointer text-muted-foreground ml-1"
                  title={t("dashboard.leads.copyEmail")}
                >
                  {copiedKey === "email" ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Primary CTA: WhatsApp Direct Chat Button */}
        {cleanPhone && (
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] transition-all shadow-md shadow-emerald-600/20 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{t("dashboard.leads.chatWhatsapp")}</span>
            <ArrowUpRight className="w-4 h-4 ml-auto opacity-75" />
          </a>
        )}

        {/* Order Items Table (if order snapshot payload exists) */}
        {parsedCartItems && parsedCartItems.length > 0 && (
          <div className="space-y-2">
            <span className="text-[11px] uppercase font-bold text-muted-foreground tracking-wider block">
              {t("dashboard.leads.orderItemsList")} ({parsedCartItems.length})
            </span>
            <div className="rounded-2xl border border-border/60 overflow-hidden bg-card divide-y divide-border/40 shadow-sm">
              {parsedCartItems.map((item, idx) => (
                <div key={idx} className="p-3 flex items-start justify-between gap-3 text-xs">
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-foreground leading-tight">
                      {item.name} <span className="text-muted-foreground font-normal">× {item.qty}</span>
                    </div>
                    {item.category && (
                      <div className="text-[10px] text-muted-foreground mt-0.5">{item.category}</div>
                    )}
                    {/* Selected Variants */}
                    {item.selected_variants && item.selected_variants.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {item.selected_variants.map((v, vi) => (
                          <span 
                            key={vi}
                            className="text-[9px] px-1.5 py-0.5 rounded-md bg-primary/10 text-primary font-medium border border-primary/20"
                          >
                            {v.group_name}: {v.option_name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="text-right shrink-0 font-bold text-foreground">
                    {item.price_display || item.price || (item.price_amount ? `Rp ${item.price_amount.toLocaleString()}` : "-")}
                  </div>
                </div>
              ))}

              {/* Total Row */}
              {lead.total_amount != null && (
                <div className="p-3.5 bg-emerald-500/10 dark:bg-emerald-500/15 flex items-center justify-between text-xs font-bold border-t border-emerald-500/20">
                  <span className="text-foreground">{t("dashboard.leads.totalOrderAmount")}:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 text-sm font-extrabold">
                    Rp {lead.total_amount.toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Message / Order Summary Text */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase font-bold text-muted-foreground tracking-wider">
              {isOrder ? "Teks Pesanan WhatsApp" : t("dashboard.leads.inquiryMessage")}
            </span>
            <button
              type="button"
              onClick={() => copyToClipboard(lead.message, "message")}
              className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline cursor-pointer"
            >
              {copiedKey === "message" ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
              <span>{copiedKey === "message" ? t("dashboard.leads.copied") : t("dashboard.leads.copyMessage")}</span>
            </button>
          </div>
          <p className="text-xs text-foreground bg-muted/40 border border-border/50 p-3.5 rounded-2xl leading-relaxed whitespace-pre-line font-mono text-[11px] max-h-48 overflow-y-auto">
            {lead.message || "-"}
          </p>
        </div>

        {/* Source Metadata */}
        <div className="space-y-2 border-t border-border/50 pt-3 text-xs text-muted-foreground">
          <div className="flex items-center justify-between">
            <span>{t("dashboard.leads.sourceSite")}:</span>
            <span className="font-semibold text-foreground">
              {matchedSite?.name || t("dashboard.leads.siteId", undefined, { id: String(lead.site_id) })}
            </span>
          </div>
          {lead.source_url && (
            <div className="flex items-center justify-between gap-4">
              <span>{t("dashboard.leads.sourceUrl")}:</span>
              <a 
                href={lead.source_url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="font-semibold text-primary hover:underline truncate max-w-[200px] flex items-center gap-1"
              >
                <span>{lead.source_url}</span>
                <ExternalLink className="w-3 h-3 shrink-0" />
              </a>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading && leads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[320px] gap-3">
        <Loader2 className="w-7 h-7 text-primary animate-spin" />
        <p className="text-sm font-medium text-muted-foreground">{t("dashboard.leads.loading")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* ── Summary Stats Row ────────────────────────────────────────── */}
      {leads.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Card className="border-border/60 bg-card/60 backdrop-blur-sm p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">{t("dashboard.leads.totalLeads")}</span>
              <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Layers className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-foreground mt-2">{leads.length}</div>
          </Card>

          <Card className="border-border/60 bg-card/60 backdrop-blur-sm p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">{t("dashboard.leads.totalOrders")}</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-2">{orderCount}</div>
          </Card>

          <Card className="border-border/60 bg-card/60 backdrop-blur-sm p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">{t("dashboard.leads.totalContacts")}</span>
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                <Mail className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-foreground mt-2">{contactCount}</div>
          </Card>

          <Card className="border-border/60 bg-card/60 backdrop-blur-sm p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">{t("dashboard.leads.totalRevenue")}</span>
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="text-lg sm:text-xl font-black text-foreground mt-2 truncate" title={`Rp ${totalRevenue.toLocaleString()}`}>
              Rp {totalRevenue >= 1000000 ? `${(totalRevenue / 1000000).toFixed(1)} jt` : totalRevenue.toLocaleString()}
            </div>
          </Card>
        </div>
      )}

      {/* ── Filters & Search Control Bar ────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3.5">
        {/* Segmented Tabs (Horizontal Scrollable on Mobile) */}
        <div className="flex items-center gap-1 p-1 rounded-2xl bg-muted/60 border border-border/80 overflow-x-auto no-scrollbar w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === "all"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-card/40"
            }`}
          >
            <span>{t("dashboard.leads.tabAll")}</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
              activeTab === "all" ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
            }`}>
              {leads.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("order")}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === "order"
                ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 shadow-sm border border-emerald-500/20"
                : "text-muted-foreground hover:text-foreground hover:bg-card/40"
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{t("dashboard.leads.tabOrders")}</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
              activeTab === "order" ? "bg-emerald-500 text-white" : "bg-muted text-muted-foreground"
            }`}>
              {orderCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("contact")}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === "contact"
                ? "bg-primary/15 text-primary shadow-sm border border-primary/20"
                : "text-muted-foreground hover:text-foreground hover:bg-card/40"
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>{t("dashboard.leads.tabContacts")}</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
              activeTab === "contact" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}>
              {contactCount}
            </span>
          </button>
        </div>

        {/* Search Input & Website Selector */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder={t("dashboard.leads.searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 border border-border/80 rounded-xl text-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-card transition-all placeholder:text-muted-foreground/70"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-muted-foreground hover:text-foreground cursor-pointer rounded-full"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {sites.length > 1 && (
            <div className="flex items-center gap-1.5 shrink-0">
              <select 
                value={selectedSiteId} 
                onChange={(e) => setSelectedSiteId(e.target.value)}
                className="px-3 py-2 border border-border/80 rounded-xl text-xs outline-none focus:border-primary bg-card cursor-pointer font-medium"
              >
                <option value="all">{t("dashboard.leads.allWebsites")}</option>
                {sites.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* ── Content View ────────────────────────────────────────────── */}
      {leads.length === 0 ? (
        /* Empty State: No leads at all */
        <Card className="border border-dashed border-border/80 p-8 sm:p-12 text-center max-w-lg mx-auto rounded-3xl bg-card/40">
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-inner">
            <Inbox className="w-8 h-8 opacity-80" />
          </div>
          <h2 className="text-xl font-extrabold mb-2 tracking-tight">{t("dashboard.leads.emptyTitle")}</h2>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed mb-6">
            {t("dashboard.leads.emptyDesc")}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/dashboard/sites">
              <Button variant="outline" size="sm" className="rounded-xl gap-1.5 text-xs font-semibold">
                <Globe className="w-3.5 h-3.5" />
                <span>{t("dashboard.leads.openWebsite")}</span>
              </Button>
            </Link>
          </div>
        </Card>
      ) : filteredLeads.length === 0 ? (
        /* Empty State: Filter matched nothing */
        <Card className="border border-dashed border-border/80 p-8 text-center max-w-md mx-auto rounded-3xl bg-card/40">
          <div className="w-12 h-12 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4 text-muted-foreground">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold mb-1">{t("dashboard.leads.noFilterResults")}</h3>
          <p className="text-xs text-muted-foreground leading-relaxed mb-5">
            {t("dashboard.leads.noFilterResultsDesc")}
          </p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={resetFilters} 
            className="rounded-xl gap-1.5 text-xs mx-auto"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{t("dashboard.leads.clearFilter")}</span>
          </Button>
        </Card>
      ) : (
        <>
          {/* ── Mobile View: Feed of Rich Cards ── */}
          <div className="block lg:hidden space-y-3">
            {filteredLeads.map((lead) => {
              const matchedSite = sites.find((s) => s.id === lead.site_id);
              const isOrder = lead.type === "order";
              const cleanPhone = lead.phone ? lead.phone.replace(/\D/g, "") : "";
              const waLink = cleanPhone ? `https://wa.me/${cleanPhone}` : "";

              return (
                <Card 
                  key={lead.id} 
                  className="border-border/70 p-4 rounded-2xl hover:border-primary/50 transition-all bg-card/80 shadow-sm space-y-3"
                  onClick={() => handleOpenDetail(lead)}
                >
                  {/* Top Header: Badge + Time */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        isOrder 
                          ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20" 
                          : "bg-primary/15 text-primary border border-primary/20"
                      }`}>
                        {isOrder ? <ShoppingBag className="w-3 h-3" /> : <Mail className="w-3 h-3" />}
                        {isOrder ? t("dashboard.leads.orderBadge") : t("dashboard.leads.contactBadge")}
                      </span>
                      <span className="text-[11px] text-muted-foreground font-medium truncate max-w-[130px]">
                        {matchedSite?.name || `Site #${lead.site_id}`}
                      </span>
                    </div>

                    <span className="text-[10px] text-muted-foreground shrink-0">
                      {formatDate(lead.created_at)}
                    </span>
                  </div>

                  {/* Customer Info & Message/Order Preview */}
                  <div className="space-y-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <h4 className="font-bold text-sm text-foreground">{lead.name || "Anonim"}</h4>
                      {isOrder && lead.total_amount ? (
                        <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-xs">
                          Rp {lead.total_amount.toLocaleString()}
                        </span>
                      ) : null}
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                      {lead.phone && <span>{lead.phone}</span>}
                      {lead.email && <span className="truncate max-w-[180px]">{lead.email}</span>}
                    </div>

                    {lead.message && (
                      <p className="text-xs text-muted-foreground/90 line-clamp-2 pt-1 font-mono text-[11px]">
                        {lead.message}
                      </p>
                    )}
                  </div>

                  {/* Quick Action Footer */}
                  <div className="flex items-center gap-2 pt-2 border-t border-border/40" onClick={(e) => e.stopPropagation()}>
                    {cleanPhone ? (
                      <a
                        href={waLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors shadow-sm"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </a>
                    ) : null}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenDetail(lead)}
                      className="flex-1 rounded-xl text-xs font-semibold gap-1.5 h-9"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{t("dashboard.leads.detail")}</span>
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* ── Desktop View: 2-Column Master Table + Detail Inspector ── */}
          <div className="hidden lg:grid grid-cols-[1fr_420px] gap-6 items-start">
            {/* Table list */}
            <Card className="border-border/60 overflow-hidden shadow-sm rounded-3xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-muted/40 border-b border-border/50 text-muted-foreground uppercase font-bold tracking-wider text-[10px]">
                      <th className="p-3.5">{t("dashboard.leads.sender")}</th>
                      <th className="p-3.5">Ringkasan / Total</th>
                      <th className="p-3.5">{t("dashboard.leads.date")}</th>
                      <th className="p-3.5">{t("dashboard.leads.sourceSite")}</th>
                      <th className="p-3.5 text-right">{t("dashboard.leads.actions")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    {filteredLeads.map((lead) => {
                      const matchedSite = sites.find((s) => s.id === lead.site_id);
                      const isOrder = lead.type === "order";
                      const isSelected = activeLead?.id === lead.id;

                      return (
                        <tr 
                          key={lead.id} 
                          className={`hover:bg-muted/30 transition-colors cursor-pointer ${
                            isSelected ? "bg-primary/5 dark:bg-primary/10 border-l-2 border-l-primary" : ""
                          }`}
                          onClick={() => setActiveLead(lead)}
                        >
                          <td className="p-3.5 font-semibold">
                            <div className="flex items-center gap-2 mb-0.5">
                              {isOrder ? (
                                <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                                  <ShoppingBag className="w-2.5 h-2.5" /> {t("dashboard.leads.orderBadge")}
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-blue-500/15 text-blue-600 dark:text-blue-400">
                                  <Mail className="w-2.5 h-2.5" /> {t("dashboard.leads.contactBadge")}
                                </span>
                              )}
                              <span className="text-foreground">{lead.name || "Anonim"}</span>
                            </div>
                            <div className="text-[10px] text-muted-foreground font-normal flex items-center gap-2">
                              {lead.phone && <span>{lead.phone}</span>}
                              {lead.email && <span>{lead.email}</span>}
                            </div>
                          </td>

                          <td className="p-3.5">
                            {isOrder && lead.total_amount ? (
                              <div className="font-bold text-emerald-600 dark:text-emerald-400 text-xs">
                                Rp {lead.total_amount.toLocaleString()}
                              </div>
                            ) : (
                              <div className="text-muted-foreground truncate max-w-[180px] font-normal">
                                {lead.message ? lead.message.replace(/\n+/g, " ") : "-"}
                              </div>
                            )}
                          </td>

                          <td className="p-3.5 text-muted-foreground whitespace-nowrap">
                            {formatDate(lead.created_at)}
                          </td>

                          <td className="p-3.5 font-medium whitespace-nowrap text-muted-foreground">
                            {matchedSite?.name || `Site #${lead.site_id}`}
                          </td>

                          <td className="p-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                            <Button 
                              variant={isSelected ? "default" : "ghost"} 
                              size="sm" 
                              className="rounded-xl gap-1 text-[11px] h-7 px-2.5"
                              onClick={() => setActiveLead(lead)}
                            >
                              <Eye className="w-3 h-3" />
                              <span>{t("dashboard.leads.detail")}</span>
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Desktop Sticky Inspector Panel */}
            <div className="sticky top-24">
              {activeLead ? (
                <Card className="border-border/60 shadow-lg rounded-3xl overflow-hidden bg-card">
                  <CardHeader className="bg-muted/30 border-b border-border/50 p-4">
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                      {activeLead.type === "order" ? (
                        <>
                          <ShoppingBag className="w-4 h-4 text-emerald-500" />
                          <span>{t("dashboard.leads.leadDetail")} #{activeLead.id}</span>
                        </>
                      ) : (
                        <>
                          <User className="w-4 h-4 text-primary" />
                          <span>{t("dashboard.leads.leadDetail")} #{activeLead.id}</span>
                        </>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-5">
                    {renderLeadDetail(activeLead)}
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-border/60 p-8 text-center text-muted-foreground border-dashed h-72 flex flex-col items-center justify-center rounded-3xl bg-card/40">
                  <MessageSquare className="w-8 h-8 text-muted-foreground/40 mb-2.5" />
                  <p className="text-xs leading-relaxed max-w-[220px]">
                    {t("dashboard.leads.selectPrompt")}
                  </p>
                </Card>
              )}
            </div>
          </div>

          {/* ── Mobile Detail Modal / Dialog ── */}
          {activeLead && (
            <Dialog
              open={mobileDetailOpen}
              onOpenChange={setMobileDetailOpen}
              title={
                <div className="flex items-center gap-2 text-sm font-bold">
                  {activeLead.type === "order" ? (
                    <ShoppingBag className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <User className="w-4 h-4 text-primary" />
                  )}
                  <span>{t("dashboard.leads.leadDetail")} #{activeLead.id}</span>
                </div>
              }
            >
              {renderLeadDetail(activeLead)}
            </Dialog>
          )}
        </>
      )}
    </div>
  );
}
