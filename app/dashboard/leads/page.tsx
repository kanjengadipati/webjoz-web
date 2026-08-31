"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useAuthToken } from "@/lib/auth-store";
import { useActiveTenant } from "@/lib/tenant-store";
import { request } from "@/lib/api/client";
import { 
  Inbox, Loader2, Calendar, Phone, Mail, Globe, 
  MessageSquare, User, Eye, Trash2, ArrowUpRight, Filter,
  ShoppingBag, Search, ExternalLink, CheckCircle2, MessageCircle
} from "lucide-react";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui";
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
        const nameMatch = l.name.toLowerCase().includes(q);
        const phoneMatch = l.phone.toLowerCase().includes(q);
        const emailMatch = l.email.toLowerCase().includes(q);
        const msgMatch = l.message.toLowerCase().includes(q);
        if (!nameMatch && !phoneMatch && !emailMatch && !msgMatch) return false;
      }
      return true;
    });
  }, [leads, selectedSiteId, activeTab, searchQuery]);

  const orderCount = useMemo(() => leads.filter((l) => l.type === "order").length, [leads]);
  const contactCount = useMemo(() => leads.filter((l) => !l.type || l.type === "contact").length, [leads]);

  const parsedCartItems = useMemo<CartItemPayload[] | null>(() => {
    if (!activeLead || !activeLead.payload) return null;
    try {
      const parsed = JSON.parse(activeLead.payload);
      return Array.isArray(parsed) ? parsed : null;
    } catch {
      return null;
    }
  }, [activeLead]);

  if (loading && leads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-80 gap-3">
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
        <p className="text-xs text-muted-foreground">{t("dashboard.leads.loading")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Bar: Tabs & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Type Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-muted/50 border border-border self-start">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "all"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Semua ({leads.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("order")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "order"
                ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            Pesanan ({orderCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("contact")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "contact"
                ? "bg-primary/15 text-primary shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            Pesan Kontak ({contactCount})
          </button>
        </div>

        {/* Search & Site Filter */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Cari nama, no HP, pesan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 border rounded-xl text-xs outline-none focus:border-primary bg-card w-48 sm:w-56"
            />
          </div>

          {sites.length > 1 && (
            <div className="flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-muted-foreground" />
              <select 
                value={selectedSiteId} 
                onChange={(e) => setSelectedSiteId(e.target.value)}
                className="px-3 py-1.5 border rounded-xl text-xs outline-none focus:border-primary bg-card"
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

      {leads.length === 0 ? (
        <Card className="border-dashed border-border/70 p-12 text-center max-w-lg mx-auto">
          <div className="w-16 h-16 bg-primary/5 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <Inbox className="w-8 h-8 opacity-75" />
          </div>
          <h2 className="text-xl font-bold mb-2">{t("dashboard.leads.emptyTitle")}</h2>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
            {t("dashboard.leads.emptyDesc")}
          </p>
        </Card>
      ) : filteredLeads.length === 0 ? (
        <Card className="border-dashed border-border/70 p-10 text-center max-w-md mx-auto">
          <p className="text-sm font-semibold text-muted-foreground">Tidak ada leads/pesanan yang cocok dengan filter saat ini.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-6 items-start">
          {/* Table list */}
          <Card className="border-border/40 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-muted/40 border-b border-border/40 text-muted-foreground uppercase font-bold tracking-wider text-[10px]">
                    <th className="p-3.5">Tipe & Pengirim</th>
                    <th className="p-3.5">Total / Ringkasan</th>
                    <th className="p-3.5">Waktu</th>
                    <th className="p-3.5">Website</th>
                    <th className="p-3.5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {filteredLeads.map((lead) => {
                    const matchedSite = sites.find(s => s.id === lead.site_id);
                    const isOrder = lead.type === "order";
                    const isSelected = activeLead?.id === lead.id;

                    return (
                      <tr 
                        key={lead.id} 
                        className={`hover:bg-muted/30 transition-colors cursor-pointer ${
                          isSelected ? "bg-primary/5 dark:bg-primary/10" : ""
                        }`}
                        onClick={() => setActiveLead(lead)}
                      >
                        <td className="p-3.5 font-semibold">
                          <div className="flex items-center gap-2 mb-0.5">
                            {isOrder ? (
                              <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                                <ShoppingBag className="w-2.5 h-2.5" /> Pesanan
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-blue-500/15 text-blue-600 dark:text-blue-400">
                                <Mail className="w-2.5 h-2.5" /> Kontak
                              </span>
                            )}
                            <span className="text-foreground">{lead.name}</span>
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
                              {lead.message.replace(/\n+/g, " ")}
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
                            variant="ghost" 
                            size="sm" 
                            className="rounded-lg gap-1 text-[11px] h-7 px-2"
                            onClick={() => setActiveLead(lead)}
                          >
                            <Eye className="w-3 h-3" />
                            Detail
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Lead Detail Panel */}
          <div>
            {activeLead ? (
              <Card className="border-border/40 shadow-md sticky top-6 overflow-hidden">
                <CardHeader className="bg-muted/30 border-b border-border/40 p-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                      {activeLead.type === "order" ? (
                        <>
                          <ShoppingBag className="w-4 h-4 text-emerald-500" />
                          <span>Rincian Pesanan #{activeLead.id}</span>
                        </>
                      ) : (
                        <>
                          <User className="w-4 h-4 text-primary" />
                          <span>Rincian Pesan #{activeLead.id}</span>
                        </>
                      )}
                    </CardTitle>
                    {activeLead.type === "order" ? (
                      <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                        Pesanan Masuk
                      </span>
                    ) : (
                      <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-600 dark:text-blue-400">
                        Form Kontak
                      </span>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="p-5 space-y-4">
                  {/* Customer Info Card */}
                  <div className="space-y-2 border-b border-border/50 pb-3">
                    <div className="text-base font-bold text-foreground">{activeLead.name}</div>
                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                      {activeLead.phone && (
                        <a 
                          href={`tel:${activeLead.phone}`} 
                          className="flex items-center gap-1.5 hover:text-primary transition-colors"
                        >
                          <Phone className="w-3.5 h-3.5 text-primary" />
                          <span>{activeLead.phone}</span>
                        </a>
                      )}
                      {activeLead.email && (
                        <a 
                          href={`mailto:${activeLead.email}`} 
                          className="flex items-center gap-1.5 hover:text-primary transition-colors"
                        >
                          <Mail className="w-3.5 h-3.5 text-primary" />
                          <span>{activeLead.email}</span>
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Order Items Table (if order snapshot payload exists) */}
                  {parsedCartItems && parsedCartItems.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                        Daftar Item Pesanan ({parsedCartItems.length})
                      </span>
                      <div className="rounded-xl border border-border/60 overflow-hidden bg-card divide-y divide-border/30">
                        {parsedCartItems.map((item, idx) => (
                          <div key={idx} className="p-2.5 flex items-start justify-between gap-2 text-xs">
                            <div className="min-w-0 flex-1">
                              <div className="font-semibold text-foreground leading-tight">
                                {item.name} <span className="text-muted-foreground font-normal">× {item.qty}</span>
                              </div>
                              {item.category && (
                                <div className="text-[10px] text-muted-foreground">{item.category}</div>
                              )}
                              {/* Selected Variants */}
                              {item.selected_variants && item.selected_variants.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {item.selected_variants.map((v, vi) => (
                                    <span 
                                      key={vi}
                                      className="text-[9px] px-1.5 py-0.2 rounded bg-primary/10 text-primary font-medium"
                                    >
                                      {v.group_name}: {v.option_name}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                            <div className="text-right shrink-0 font-semibold text-foreground">
                              {item.price_display || item.price || (item.price_amount ? `Rp ${item.price_amount.toLocaleString()}` : "-")}
                            </div>
                          </div>
                        ))}

                        {/* Total Row */}
                        {activeLead.total_amount != null && (
                          <div className="p-3 bg-emerald-500/5 flex items-center justify-between text-xs font-bold">
                            <span className="text-muted-foreground">Total Pesanan:</span>
                            <span className="text-emerald-600 dark:text-emerald-400 text-sm">
                              Rp {activeLead.total_amount.toLocaleString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Message / Order Summary Text */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                      {activeLead.type === "order" ? "Teks Pesanan WhatsApp" : "Pesan Masuk"}
                    </span>
                    <p className="text-xs text-foreground bg-muted/40 border border-border/50 p-3.5 rounded-xl leading-relaxed whitespace-pre-line font-mono text-[11px] max-h-48 overflow-y-auto">
                      {activeLead.message}
                    </p>
                  </div>

                  {/* WhatsApp Direct Chat Button */}
                  {activeLead.phone && (
                    <a
                      href={`https://wa.me/${activeLead.phone.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors shadow-sm cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Chat Pembeli di WhatsApp</span>
                    </a>
                  )}

                  {/* Source Metadata */}
                  <div className="space-y-1.5 border-t border-border/50 pt-3 text-[10px] text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Diterima Pada:</span>
                      <span className="font-semibold text-foreground">{formatDate(activeLead.created_at)}</span>
                    </div>
                    {activeLead.source_url && (
                      <div className="flex justify-between gap-4">
                        <span>Halaman Sumber:</span>
                        <a 
                          href={activeLead.source_url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="font-semibold text-primary hover:underline truncate max-w-[200px]"
                        >
                          {activeLead.source_url}
                        </a>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-border/40 p-8 text-center text-muted-foreground border-dashed h-64 flex flex-col items-center justify-center">
                <MessageSquare className="w-8 h-8 text-muted-foreground/40 mb-2" />
                <p className="text-xs">Pilih salah satu baris untuk melihat rincian lengkap pesanan atau pesan.</p>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
