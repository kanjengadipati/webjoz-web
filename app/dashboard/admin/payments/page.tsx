"use client";

import { useState, useEffect, useCallback } from "react";
import { Loader2, Search, ChevronLeft, ChevronRight, RotateCcw, AlertCircle, FileText, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui";
import { cn } from "@/lib/utils";
import { useAuthToken } from "@/lib/auth-store";
import { listPayments, forceUpdateStatus, processRefund, type PaymentResponse } from "@/lib/api/payments";
import { useToast } from "@/components/toast-provider";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";
const PAGE_SIZE = 20;

const STATUS_OPTIONS = ["", "settlement", "pending", "failed", "expired", "refund", "deny", "cancel"] as const;
const GATEWAY_OPTIONS = ["", "midtrans", "paypal"] as const;

const STATUS_STYLE: Record<string, string> = {
  settlement: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-400",
  success:    "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-400",
  pending:    "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-400",
  failed:     "bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-400",
  expired:    "bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-400",
  refund:     "bg-sky-100 text-sky-800 dark:bg-sky-500/15 dark:text-sky-400",
  deny:       "bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-400",
  cancel:     "bg-gray-100 text-gray-600 dark:bg-muted/40 dark:text-muted-foreground",
};

const FORCE_STATUS_OPTIONS = [
  { label: "Pending", value: "pending" },
  { label: "Settlement / Paid", value: "paid" },
  { label: "Failed", value: "failed" },
] as const;

type ForceStatus = typeof FORCE_STATUS_OPTIONS[number]["value"];

function fmtAmount(amount: number, currency: string) {
  if (currency === "IDR") return "Rp " + amount.toLocaleString("id-ID");
  return amount.toFixed(2) + " " + currency;
}

function fmtDate(iso: string) {
  try { return new Date(iso).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }); }
  catch { return iso; }
}

export default function AdminPaymentsPage() {
  const token = useAuthToken();
  const { pushToast } = useToast();

  const [payments, setPayments] = useState<PaymentResponse[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [gatewayFilter, setGatewayFilter] = useState("");
  const [draftSearch, setDraftSearch] = useState("");

  // Force status modal
  const [forceTarget, setForceTarget] = useState<PaymentResponse | null>(null);
  const [newStatus, setNewStatus] = useState<ForceStatus>("pending");
  const [forceReason, setForceReason] = useState("");
  const [forceLoading, setForceLoading] = useState(false);

  // Refund modal
  const [refundTarget, setRefundTarget] = useState<PaymentResponse | null>(null);
  const [refundReason, setRefundReason] = useState("");
  const [refundLoading, setRefundLoading] = useState(false);

  const totalPages = Math.ceil(total / PAGE_SIZE) || 1;

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await listPayments({
        limit: PAGE_SIZE,
        offset: (page - 1) * PAGE_SIZE,
        status: statusFilter || undefined,
        gateway: gatewayFilter || undefined,
        search: search || undefined,
      });
      setPayments(res.data ?? []);
      setTotal((res.meta as any)?.total ?? 0);
    } catch (e: any) {
      pushToast(e.message ?? "Gagal memuat data", "error");
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, gatewayFilter, search]);

  useEffect(() => { fetchPayments(); }, [fetchPayments]);

  function applySearch() {
    setSearch(draftSearch);
    setPage(1);
  }

  async function handleForceStatus() {
    if (!forceTarget) return;
    setForceLoading(true);
    try {
      await forceUpdateStatus(forceTarget.id, newStatus, forceReason || "Admin manual override");
      pushToast("Status berhasil diupdate", "success");
      setForceTarget(null);
      fetchPayments();
    } catch (e: any) {
      pushToast(e.message ?? "Gagal update status", "error");
    } finally {
      setForceLoading(false);
    }
  }

  async function handleRefund() {
    if (!refundTarget) return;
    setRefundLoading(true);
    try {
      await processRefund(refundTarget.id, refundReason || "Admin initiated refund");
      pushToast("Refund berhasil diproses", "success");
      setRefundTarget(null);
      fetchPayments();
    } catch (e: any) {
      pushToast(e.message ?? "Gagal proses refund", "error");
    } finally {
      setRefundLoading(false);
    }
  }

  // Summary stats
  const settled = payments.filter(p => p.status === "settlement" || p.status === "success").length;
  const pending = payments.filter(p => p.status === "pending").length;
  const refunded = payments.filter(p => p.status === "refund").length;

  return (
    <Card className="w-full">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Payment Management</h2>
          <span className="text-xs text-muted-foreground">{total} total records</span>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Total (page)", value: payments.length },
            { label: "Settled", value: settled },
            { label: "Pending", value: pending },
            { label: "Refunded", value: refunded },
          ].map(s => (
            <div key={s.label} className="rounded-xl border border-border/60 bg-muted/20 px-4 py-3">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="text-2xl font-bold mt-0.5">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <div className="flex gap-1 flex-1 min-w-[200px]">
            <input
              type="text"
              value={draftSearch}
              onChange={e => setDraftSearch(e.target.value)}
              onKeyDown={e => e.key === "Enter" && applySearch()}
              placeholder="Cari Order ID / Tenant ID..."
              className="flex-1 px-3 py-1.5 rounded-xl border border-border/60 bg-card/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
            />
            <button onClick={applySearch} className="px-3 py-1.5 rounded-xl bg-primary/10 text-primary text-sm hover:bg-primary/20 transition">
              <Search className="size-3.5"/>
            </button>
          </div>
          <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
            className="px-3 py-1.5 rounded-xl border border-border/60 bg-card/60 text-sm focus:outline-none transition">
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s || "All Status"}</option>)}
          </select>
          <select value={gatewayFilter} onChange={e => { setGatewayFilter(e.target.value); setPage(1); }}
            className="px-3 py-1.5 rounded-xl border border-border/60 bg-card/60 text-sm focus:outline-none transition">
            {GATEWAY_OPTIONS.map(g => <option key={g} value={g}>{g || "All Gateway"}</option>)}
          </select>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center h-52 gap-2 text-muted-foreground text-sm">
            <Loader2 className="size-4 animate-spin"/> Loading payments...
          </div>
        ) : payments.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground text-sm">No payments found.</div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-border/60">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/30 bg-muted/20 text-left">
                  {["ID", "Order ID", "Tenant", "Type", "Amount", "Status", "Gateway", "Date", "Actions"].map(h => (
                    <th key={h} className="px-4 py-3 text-xs font-semibold text-muted-foreground whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {payments.map(p => {
                  const isPaid = p.status === "settlement" || p.status === "success";
                  const isRefundable = isPaid && p.reference_type !== "domain";
                  return (
                    <tr key={p.id} className="border-b border-border/20 hover:bg-muted/10 transition-colors">
                      <td className="px-4 py-3 text-muted-foreground">{p.id}</td>
                      <td className="px-4 py-3 font-mono text-xs">{p.order_id}</td>
                      <td className="px-4 py-3 text-muted-foreground">{p.tenant_id}</td>
                      <td className="px-4 py-3">{p.reference_type === "domain" ? "Domain" : "Subscription"}</td>
                      <td className="px-4 py-3 font-semibold whitespace-nowrap">
                        {fmtAmount(p.gross_amount ?? p.amount, p.currency)}
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn("px-2 py-0.5 rounded-full text-xs font-semibold", STATUS_STYLE[p.status] ?? "")}>
                          {p.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 capitalize">{p.gateway}</td>
                      <td className="px-4 py-3 text-muted-foreground text-xs whitespace-nowrap">{fmtDate(p.created_at)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          {isPaid && (
                            <a
                              href={`${API_BASE}/payments/${p.id}/invoice.html`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-muted/60 hover:bg-muted text-xs font-medium transition"
                              title="View Invoice"
                            >
                              <FileText className="size-3"/> Invoice
                              <ExternalLink className="size-2.5 opacity-50"/>
                            </a>
                          )}
                          <button
                            onClick={() => { setForceTarget(p); setNewStatus("pending"); setForceReason(""); }}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-muted/60 hover:bg-amber-500/10 hover:text-amber-400 text-xs font-medium transition"
                          >
                            Force Status
                          </button>
                          {isRefundable && (
                            <button
                              onClick={() => { setRefundTarget(p); setRefundReason(""); }}
                              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-muted/60 hover:bg-red-500/10 hover:text-red-400 text-xs font-medium transition"
                            >
                              <RotateCcw className="size-3"/> Refund
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Halaman {page} dari {totalPages} ({total} total)</span>
            <div className="flex gap-1">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="p-1.5 rounded-lg hover:bg-muted disabled:opacity-30 transition"><ChevronLeft className="size-3.5"/></button>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="p-1.5 rounded-lg hover:bg-muted disabled:opacity-30 transition"><ChevronRight className="size-3.5"/></button>
            </div>
          </div>
        )}
      </div>

      {/* Force Status Modal */}
      {forceTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-card border border-border/60 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <h3 className="font-bold text-lg mb-1">Force Payment Status</h3>
            <p className="text-xs text-muted-foreground mb-4">Payment #{forceTarget.id} · {forceTarget.order_id}</p>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold block mb-1">New Status</label>
                <select value={newStatus} onChange={e => setNewStatus(e.target.value as ForceStatus)}
                  className="w-full px-3 py-2 rounded-xl border border-border/60 bg-background/60 text-sm focus:outline-none transition">
                  {FORCE_STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold block mb-1">Reason (audit log)</label>
                <textarea rows={2} value={forceReason} onChange={e => setForceReason(e.target.value)}
                  placeholder="Admin manual override reason..."
                  className="w-full px-3 py-2 rounded-xl border border-border/60 bg-background/60 text-sm resize-none focus:outline-none transition"/>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={() => setForceTarget(null)} className="flex-1 py-2.5 rounded-xl border border-border/60 text-sm font-semibold hover:bg-muted transition">
                Cancel
              </button>
              <button onClick={handleForceStatus} disabled={forceLoading}
                className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-white text-sm font-bold transition disabled:opacity-50">
                {forceLoading ? <Loader2 className="size-4 animate-spin mx-auto"/> : "Update Status"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Refund Modal */}
      {refundTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-card border border-border/60 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="size-10 rounded-full bg-red-500/15 flex items-center justify-center shrink-0">
                <AlertCircle className="size-5 text-red-400"/>
              </div>
              <div>
                <h3 className="font-bold">Process Refund</h3>
                <p className="text-xs text-muted-foreground">Payment #{refundTarget.id} · {fmtAmount(refundTarget.gross_amount ?? refundTarget.amount, refundTarget.currency)}</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              This will call the gateway refund API ({refundTarget.gateway}) and downgrade the tenant to the free plan.
            </p>
            <div className="mb-4">
              <label className="text-xs font-semibold block mb-1">Reason</label>
              <textarea rows={2} value={refundReason} onChange={e => setRefundReason(e.target.value)}
                placeholder="Refund reason..."
                className="w-full px-3 py-2 rounded-xl border border-border/60 bg-background/60 text-sm resize-none focus:outline-none transition"/>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setRefundTarget(null)} className="flex-1 py-2.5 rounded-xl border border-border/60 text-sm font-semibold hover:bg-muted transition">
                Cancel
              </button>
              <button onClick={handleRefund} disabled={refundLoading}
                className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-400 text-white text-sm font-bold transition disabled:opacity-50">
                {refundLoading ? <Loader2 className="size-4 animate-spin mx-auto"/> : "Process Refund"}
              </button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
