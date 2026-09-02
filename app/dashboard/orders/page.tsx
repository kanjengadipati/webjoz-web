"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useAuthToken } from "@/lib/auth-store";
import { useActiveTenant } from "@/lib/tenant-store";
import { request } from "@/lib/api/client";
import {
  Loader2, Search, RefreshCw, Copy, Check, ShoppingBag,
  Phone, Mail, MessageSquare, User, Clock, ArrowRight,
} from "lucide-react";
import { Badge } from "@/components/ui";
import { useToast } from "@/components/toast-provider";
import { useI18n } from "@/lib/i18n/context";

interface OrderItem {
  id?: string;
  name?: string;
  qty?: number;
  price_display?: string | null;
  price_amount?: number | null;
}

interface Order {
  id: number;
  order_no: string;
  tenant_id: number;
  site_id: number;
  customer_name: string;
  customer_phone: string;
  email?: string;
  message?: string;
  items: OrderItem[];
  subtotal?: number | null;
  status: string;
  source_url?: string;
  created_at: string;
  updated_at: string;
}

interface Site {
  id: number;
  name: string;
  subdomain?: string;
}

const STATUS_LIST = ["new", "confirmed", "processing", "shipped", "done", "cancelled"] as const;
type OrderStatus = (typeof STATUS_LIST)[number];

const STATUS_META: Record<OrderStatus, { label: string; cls: string }> = {
  new:         { label: "Baru",          cls: "bg-sky-100 text-sky-700 border-sky-200" },
  confirmed:   { label: "Dikonfirmasi",  cls: "bg-blue-100 text-blue-700 border-blue-200" },
  processing:  { label: "Diproses",      cls: "bg-amber-100 text-amber-700 border-amber-200" },
  shipped:     { label: "Dikirim",       cls: "bg-violet-100 text-violet-700 border-violet-200" },
  done:        { label: "Selesai",       cls: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  cancelled:   { label: "Dibatalkan",    cls: "bg-rose-100 text-rose-700 border-rose-200" },
};

const fmtIDR = (n?: number | null) => {
  if (n == null) return "";
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);
};

export default function OrdersPage() {
  const token = useAuthToken();
  const { pushToast } = useToast();
  const { locale } = useI18n();
  const { activeTenantId } = useActiveTenant();

  const [orders, setOrders] = useState<Order[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedSiteId, setSelectedSiteId] = useState("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [mobileDetailOpen, setMobileDetailOpen] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const fetchData = async () => {
    if (!token || !activeTenantId) return;
    try {
      setLoading(true);
      const ordersRes = await request<Order[]>("/orders", {
        headers: { "X-Tenant-ID": activeTenantId.toString() }
      }, token);
      setOrders(ordersRes.data || []);

      const sitesRes = await request<Site[]>("/sites", {
        headers: { "X-Tenant-ID": activeTenantId.toString() }
      }, token);
      setSites(sitesRes.data || []);
    } catch (err: any) {
      pushToast(err.message || "Gagal memuat pesanan", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTenantId) fetchData();
  }, [activeTenantId]);

  const siteName = (id: number) => sites.find((s) => s.id === id)?.name || `#${id}`;

  const filtered = useMemo(() => {
    return orders
      .filter((o) => (selectedSiteId === "all" ? true : o.site_id === Number(selectedSiteId)))
      .filter((o) => (statusFilter === "all" ? true : o.status === statusFilter))
      .filter((o) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          o.order_no?.toLowerCase().includes(q) ||
          o.customer_name?.toLowerCase().includes(q) ||
          o.customer_phone?.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [orders, selectedSiteId, statusFilter, searchQuery]);

  const stats = useMemo(() => {
    const count = (s: string) => orders.filter((o) => o.status === s).length;
    return { all: orders.length, new: count("new"), processing: count("processing"), done: count("done"), total: orders.reduce((acc, o) => acc + (o.subtotal || 0), 0) };
  }, [orders]);

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString(locale === "id" ? "id-ID" : "en-US", {
        day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
      });
    } catch { return iso; }
  };

  const copyToClipboard = (text: string, key: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  const openOrder = (o: Order) => {
    setActiveOrder(o);
    setMobileDetailOpen(true);
  };

  const updateStatus = async (o: Order, status: OrderStatus) => {
    if (!token || !activeTenantId) return;
    try {
      const res = await request<Order>(`/orders/${o.id}/status`, {
        method: "PATCH",
        headers: { "X-Tenant-ID": activeTenantId.toString() },
        body: JSON.stringify({ status }),
      }, token);
      const updated = res.data;
      setOrders((prev) => prev.map((x) => (x.id === o.id ? updated : x)));
      if (activeOrder?.id === o.id) setActiveOrder(updated);
      pushToast(`Status diperbarui menjadi "${STATUS_META[status].label}"`, "success");
    } catch (err: any) {
      pushToast(err.message || "Gagal memperbarui status", "error");
    }
  };

  const OrderStatusPill = ({ status }: { status: string }) => {
    const meta = STATUS_META[status as OrderStatus] ?? { label: status, cls: "bg-gray-100 text-gray-700 border-gray-200" };
    return <Badge className={`border ${meta.cls}`}>{meta.label}</Badge>;
  };

  const summaryContent = (o: Order) => {
    const itemCount = o.items?.length ?? 0;
    const totalQty = o.items?.reduce((a, i) => a + (i.qty || 0), 0) ?? 0;
    return (
      <div className="space-y-2 rounded-xl border border-border/70 bg-muted/30 p-3 text-sm">
        {o.items && o.items.length > 0 ? (
          o.items.map((item, i) => (
            <div key={i} className="flex justify-between gap-3">
              <span className="truncate">{item.name || "Item"}{item.qty && item.qty > 1 ? ` × ${item.qty}` : ""}</span>
              <span className="font-semibold shrink-0">{item.price_display || (item.price_amount != null ? fmtIDR(item.price_amount) : "")}</span>
            </div>
          ))
        ) : (
          <span className="opacity-70">Tidak ada detail item.</span>
        )}
        {(o.subtotal != null) && (
          <div className="flex justify-between gap-3 border-t border-border/60 pt-2 font-bold">
            <span>{itemCount} item / {totalQty} pcs</span>
            <span>{fmtIDR(o.subtotal)}</span>
          </div>
        )}
      </div>
    );
  };

  const detailDrawer = (o: Order | null) => {
    if (!o) return null;
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-start justify-between gap-3">
          <div>
            <button type="button" onClick={() => copyToClipboard(o.order_no, `d-${o.id}`)} className="inline-flex items-center gap-1.5 text-lg font-bold hover:opacity-70 cursor-pointer">
              {o.order_no}
              {copiedKey === `d-${o.id}` ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 opacity-50" />}
            </button>
            <p className="text-sm opacity-60 mt-0.5">{formatDate(o.created_at)}</p>
          </div>
          <div className="flex items-center gap-2">
            <OrderStatusPill status={o.status} />
            <select
              value={o.status}
              onChange={(e) => updateStatus(o, e.target.value as OrderStatus)}
              className="h-8 rounded-md border border-border bg-background px-2 text-xs"
            >
              <option disabled>Ubah status…</option>
              {STATUS_LIST.map((s) => (
                <option key={s} value={s}>{STATUS_META[s].label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-3 mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            <div className="rounded-xl border border-border/70 p-3">
              <div className="text-xs opacity-50 mb-1"><User className="inline w-3.5 h-3.5 mr-1" />Nama</div>
              <div className="font-semibold">{o.customer_name}</div>
            </div>
            <div className="rounded-xl border border-border/70 p-3">
              <div className="text-xs opacity-50 mb-1"><Phone className="inline w-3.5 h-3.5 mr-1" />Telepon</div>
              <div className="font-semibold">{o.customer_phone}</div>
            </div>
          </div>
          {o.email && (
            <div className="rounded-xl border border-border/70 p-3 text-sm">
              <div className="text-xs opacity-50 mb-1"><Mail className="inline w-3.5 h-3.5 mr-1" />Email</div>
              <div className="font-semibold">{o.email}</div>
            </div>
          )}
          <div className="rounded-xl border border-border/70 p-3 text-sm">
            <div className="text-xs opacity-50 mb-1"><ShoppingBag className="inline w-3.5 h-3.5 mr-1" />Ringkasan</div>
            {summaryContent(o)}
          </div>
          {o.message && (
            <div className="rounded-xl border border-border/70 p-3 text-sm">
              <div className="text-xs opacity-50 mb-1"><MessageSquare className="inline w-3.5 h-3.5 mr-1" />Catatan</div>
              <p className="whitespace-pre-wrap">{o.message}</p>
            </div>
          )}
        </div>

        <div className="mt-auto pt-4">
          <span className="text-xs opacity-50">Status saat ini: </span>
          <OrderStatusPill status={o.status} />
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Pesanan</h1>
          <p className="text-sm opacity-60 mt-0.5">Kelola pesanan masuk dari website Anda.</p>
        </div>
        <button
          type="button"
          onClick={fetchData}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium hover:bg-muted/50 cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Segarkan
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-5">
        {[
          { label: "Semua", value: stats.all },
          { label: "Baru", value: stats.new },
          { label: "Diproses", value: stats.processing },
          { label: "Selesai", value: stats.done },
          { label: "Total", value: fmtIDR(stats.total) },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-3">
            <div className="text-xs opacity-60">{s.label}</div>
            <div className="text-lg font-bold truncate">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative min-w-[220px] flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari no. pesanan, nama, atau telepon…"
            className="w-full rounded-lg border border-border bg-background py-2 pl-8 pr-3 text-sm"
          />
        </div>
        <select value={selectedSiteId} onChange={(e) => setSelectedSiteId(e.target.value)} className="h-9 rounded-lg border border-border bg-background px-2 text-sm">
          <option value="all">Semua Website</option>
          {sites.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-9 rounded-lg border border-border bg-background px-2 text-sm">
          <option value="all">Semua Status</option>
          {STATUS_LIST.map((s) => <option key={s} value={s}>{STATUS_META[s].label}</option>)}
        </select>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-24"><Loader2 className="w-6 h-6 animate-spin opacity-50" /></div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border py-20 text-center text-sm opacity-60">
          Tidak ada pesanan ditemukan.
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((o) => (
            <div key={o.id} className="group flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl border border-border bg-card px-4 py-3 hover:border-primary/50 transition-colors">
              <button type="button" onClick={() => openOrder(o)} className="flex items-center gap-3 text-left flex-1 min-w-[200px] cursor-pointer">
                <span className="font-bold">{o.order_no}</span>
              </button>
              {!mobileDetailOpen && (
                <>
                  <div className="flex items-center gap-2 w-28 shrink-0 text-sm text-muted-foreground">
                    <User className="w-4 h-4 shrink-0" /> <span className="truncate">{o.customer_name}</span>
                  </div>
                  <div className="flex items-center gap-2 w-32 shrink-0 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4 shrink-0" /> <span className="truncate">{formatDate(o.created_at)}</span>
                  </div>
                  <div className="w-28 shrink-0 text-xs text-muted-foreground truncate">{siteName(o.site_id)}</div>
                  <div className="shrink-0 text-sm font-semibold">{fmtIDR(o.subtotal)}</div>
                  <OrderStatusPill status={o.status} />
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Mobile detail bottom sheet */}
      {mobileDetailOpen && activeOrder && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileDetailOpen(false)} />
          <div className="absolute inset-x-0 bottom-0 max-h-[88vh] overflow-y-auto rounded-t-2xl bg-background p-5 shadow-2xl">
            <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-muted-foreground/20" />
            <button type="button" onClick={() => setMobileDetailOpen(false)} className="mb-3 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground cursor-pointer">
              <ArrowRight className="w-4 h-4 rotate-180" /> Tutup
            </button>
            {detailDrawer(activeOrder)}
          </div>
        </div>
      )}

      {/* Desktop side detail */}
      {activeOrder && !mobileDetailOpen && (
        <div className="fixed right-0 top-[64px] bottom-0 z-30 w-full max-w-md border-l border-border bg-background p-5 shadow-2xl overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-muted-foreground">{siteName(activeOrder.site_id)}</span>
            <button type="button" onClick={() => setActiveOrder(null)} className="rounded-lg p-1 hover:bg-muted cursor-pointer" aria-label="Tutup">
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
          {detailDrawer(activeOrder)}
        </div>
      )}
    </div>
  );
}