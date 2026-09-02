"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ArrowLeft, Receipt, FileText, RotateCcw, ExternalLink,
  Mail, ChevronLeft, ChevronRight, AlertCircle, Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthToken } from "@/lib/auth-store";
import { useActiveTenant } from "@/lib/tenant-store";
import { useToast } from "@/components/toast-provider";
import { useI18n } from "@/lib/i18n/context";
import {
  listMyTransactions, listMyInvoices, requestRefund, sendInvoiceEmail,
  type PaymentResponse, type InvoiceResponse,
} from "@/lib/api/payments";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

const STATUS_STYLE: Record<string, string> = {
  settlement: "bg-emerald-500/15 text-emerald-400",
  success:    "bg-emerald-500/15 text-emerald-400",
  pending:    "bg-amber-500/15 text-amber-400",
  failed:     "bg-red-500/15 text-red-400",
  expired:    "bg-red-500/15 text-red-400",
  refund:     "bg-sky-500/15 text-sky-400",
  deny:       "bg-red-500/15 text-red-400",
  cancel:     "bg-muted/60 text-muted-foreground",
};

const STATUS_LABEL: Record<string, { id: string; en: string }> = {
  settlement: { id: "Lunas", en: "Paid" },
  success:    { id: "Lunas", en: "Paid" },
  pending:    { id: "Menunggu", en: "Pending" },
  failed:     { id: "Gagal", en: "Failed" },
  expired:    { id: "Kadaluarsa", en: "Expired" },
  refund:     { id: "Direfund", en: "Refunded" },
  deny:       { id: "Ditolak", en: "Denied" },
  cancel:     { id: "Dibatalkan", en: "Cancelled" },
};

function statusLabel(status: string, lang: "id" | "en") {
  return STATUS_LABEL[status]?.[lang] ?? status;
}

function formatAmount(amount: number, currency: string) {
  if (currency === "IDR") {
    return "Rp " + amount.toLocaleString("id-ID");
  }
  return amount.toFixed(2) + " " + currency;
}

function formatDate(iso: string, lang: "id" | "en") {
  try {
    return new Date(iso).toLocaleDateString(lang === "id" ? "id-ID" : "en-US", {
      day: "2-digit", month: "short", year: "numeric",
    });
  } catch { return iso; }
}

type Tab = "transactions" | "invoices";

export default function BillingPage() {
  const token = useAuthToken();
  const { activeTenant } = useActiveTenant();
  const { pushToast } = useToast();
  const { locale } = useI18n();
  const lang = locale === "en" ? "en" : "id" as "id" | "en";

  const [tab, setTab] = useState<Tab>("transactions");

  // transactions state
  const [txs, setTxs] = useState<PaymentResponse[]>([]);
  const [txTotal, setTxTotal] = useState(0);
  const [txPage, setTxPage] = useState(1);
  const txLimit = 10;
  const txLoading = useState(false);
  const [txLoad, setTxLoad] = [txLoading[0], txLoading[1]];

  // invoices state
  const [invoices, setInvoices] = useState<InvoiceResponse[]>([]);
  const [invTotal, setInvTotal] = useState(0);
  const [invPage, setInvPage] = useState(1);
  const invLimit = 10;
  const [invLoad, setInvLoad] = useState(false);

  // action state
  const [refundId, setRefundId] = useState<number | null>(null);
  const [refundReason, setRefundReason] = useState("");
  const [refundLoading, setRefundLoading] = useState(false);
  const [resendId, setResendId] = useState<number | null>(null);

  const tenantId = activeTenant?.tenant.id;

  const fetchTransactions = useCallback(async () => {
    if (!token) return;
    setTxLoad(true);
    try {
      const res = await listMyTransactions(
        { limit: txLimit, offset: (txPage - 1) * txLimit },
        token,
      );
      setTxs(res.data ?? []);
      setTxTotal((res.meta as any)?.total ?? 0);
    } catch (e: any) {
      pushToast(e.message ?? "Gagal memuat transaksi", "error");
    } finally {
      setTxLoad(false);
    }
  }, [token, txPage]);

  const fetchInvoices = useCallback(async () => {
    if (!token) return;
    setInvLoad(true);
    try {
      const res = await listMyInvoices(
        { limit: invLimit, offset: (invPage - 1) * invLimit },
        token,
      );
      setInvoices(res.data ?? []);
      setInvTotal((res.meta as any)?.total ?? 0);
    } catch (e: any) {
      pushToast(e.message ?? "Gagal memuat invoice", "error");
    } finally {
      setInvLoad(false);
    }
  }, [token, invPage]);

  useEffect(() => { fetchTransactions(); }, [fetchTransactions]);
  useEffect(() => { fetchInvoices(); }, [fetchInvoices]);

  async function handleRefund() {
    if (!refundId || !token || refundReason.trim().length < 5) return;
    setRefundLoading(true);
    try {
      await requestRefund(refundId, refundReason.trim(), token);
      pushToast(
        lang === "id"
          ? "Permintaan refund berhasil dikirim. Tim kami akan memproses dalam 3–7 hari kerja."
          : "Refund request submitted. Our team will process within 3–7 business days.",
        "success",
      );
      setRefundId(null);
      setRefundReason("");
      fetchTransactions();
    } catch (e: any) {
      pushToast(e.message ?? "Gagal mengajukan refund", "error");
    } finally {
      setRefundLoading(false);
    }
  }

  async function handleResendInvoice(paymentId: number) {
    if (!token) return;
    setResendId(paymentId);
    try {
      await sendInvoiceEmail(paymentId, token);
      pushToast(
        lang === "id" ? "Invoice berhasil dikirim ke email Anda." : "Invoice sent to your email.",
        "success",
      );
    } catch (e: any) {
      pushToast(e.message ?? "Gagal mengirim invoice", "error");
    } finally {
      setResendId(null);
    }
  }

  const txTotalPages = Math.ceil(txTotal / txLimit) || 1;
  const invTotalPages = Math.ceil(invTotal / invLimit) || 1;

  const T = {
    title:         { id: "Riwayat Tagihan", en: "Billing History" },
    subtitle:      { id: "Lihat semua transaksi dan invoice pembayaran Anda.", en: "View all your transactions and payment invoices." },
    tabTx:         { id: "Transaksi", en: "Transactions" },
    tabInv:        { id: "Invoice", en: "Invoices" },
    orderID:       { id: "Order ID", en: "Order ID" },
    type:          { id: "Jenis", en: "Type" },
    amount:        { id: "Jumlah", en: "Amount" },
    status:        { id: "Status", en: "Status" },
    method:        { id: "Metode", en: "Method" },
    date:          { id: "Tanggal", en: "Date" },
    actions:       { id: "Aksi", en: "Actions" },
    subscription:  { id: "Langganan", en: "Subscription" },
    domain:        { id: "Domain", en: "Domain" },
    refundBtn:     { id: "Ajukan Refund", en: "Request Refund" },
    invoiceBtn:    { id: "Invoice", en: "Invoice" },
    empty:         { id: "Belum ada transaksi.", en: "No transactions yet." },
    invEmpty:      { id: "Belum ada invoice.", en: "No invoices yet." },
    invID:         { id: "Invoice ID", en: "Invoice ID" },
    desc:          { id: "Deskripsi", en: "Description" },
    resend:        { id: "Kirim Ulang Email", en: "Resend Email" },
    download:      { id: "Lihat Invoice", en: "View Invoice" },
    page:          { id: "Halaman", en: "Page" },
    of:            { id: "dari", en: "of" },
    refundTitle:   { id: "Ajukan Permintaan Refund", en: "Submit Refund Request" },
    refundDesc:    { id: "Ceritakan alasan Anda mengajukan refund. Tim kami akan menghubungi Anda dalam 3–7 hari kerja.", en: "Describe your reason for requesting a refund. Our team will contact you within 3–7 business days." },
    refundLabel:   { id: "Alasan Refund", en: "Refund Reason" },
    refundMin:     { id: "Minimal 5 karakter", en: "Minimum 5 characters" },
    cancel:        { id: "Batal", en: "Cancel" },
    submit:        { id: "Kirim Permintaan", en: "Submit Request" },
    back:          { id: "← Kembali ke Dashboard", en: "← Back to Dashboard" },
  };
  const t = (k: keyof typeof T) => T[k][lang];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center p-2 rounded-xl hover:bg-primary/10 transition text-muted-foreground hover:text-primary"
          aria-label={t("back")}
        >
          <ArrowLeft className="size-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("title")}</h1>
          <p className="text-sm text-muted-foreground mt-1">{t("subtitle")}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border/60 pb-0">
        {(["transactions", "invoices"] as Tab[]).map((id) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={cn(
              "px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors",
              tab === id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {id === "transactions" ? (
              <span className="flex items-center gap-1.5"><Receipt className="size-3.5"/>{t("tabTx")}</span>
            ) : (
              <span className="flex items-center gap-1.5"><FileText className="size-3.5"/>{t("tabInv")}</span>
            )}
          </button>
        ))}
      </div>

      {/* Transactions tab */}
      {tab === "transactions" && (
        <div className="rounded-2xl border border-border/60 bg-card/40 overflow-hidden">
          {txLoad ? (
            <div className="flex items-center justify-center h-52 gap-2 text-muted-foreground text-sm">
              <Loader2 className="size-4 animate-spin"/> {lang === "id" ? "Memuat..." : "Loading..."}
            </div>
          ) : txs.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground text-sm">{t("empty")}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/40 text-left">
                    {[t("orderID"), t("type"), t("amount"), t("status"), t("method"), t("date"), t("actions")].map(h => (
                      <th key={h} className="px-4 py-3 text-xs font-semibold text-muted-foreground whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {txs.map((tx) => {
                    const isPaid = tx.status === "settlement" || tx.status === "success";
                    const isRefundable = isPaid;
                    return (
                      <tr key={tx.id} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                        <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{tx.order_id}</td>
                        <td className="px-4 py-3">
                          {tx.reference_type === "domain" ? t("domain") : t("subscription")}
                          {tx.billing_cycle && tx.reference_type !== "domain" && (
                            <span className="ml-1.5 text-[10px] text-muted-foreground/60">
                              ({tx.billing_cycle === "yearly" ? (lang === "id" ? "Tahunan" : "Yearly") : (lang === "id" ? "Bulanan" : "Monthly")})
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 font-semibold whitespace-nowrap">
                          {formatAmount(tx.gross_amount ?? tx.amount, tx.currency)}
                          {tx.discount_amount > 0 && (
                            <div className="text-[10px] text-emerald-400">
                              -{formatAmount(tx.discount_amount, tx.currency)} {lang === "id" ? "diskon" : "discount"}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span className={cn("px-2 py-0.5 rounded-full text-xs font-semibold", STATUS_STYLE[tx.status] ?? "bg-muted/40 text-muted-foreground")}>
                            {statusLabel(tx.status, lang)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground capitalize">{tx.payment_method || tx.gateway}</td>
                        <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{formatDate(tx.created_at, lang)}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {isPaid && (
                              <a
                                href={`${API_BASE}/payments/${tx.id}/invoice.html`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-muted/60 hover:bg-muted text-xs font-medium transition"
                                title={t("invoiceBtn")}
                              >
                                <FileText className="size-3"/> {t("invoiceBtn")}
                                <ExternalLink className="size-2.5 opacity-50"/>
                              </a>
                            )}
                            {isRefundable && (
                              <button
                                onClick={() => { setRefundId(tx.id); setRefundReason(""); }}
                                className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-muted/60 hover:bg-red-500/10 hover:text-red-400 text-xs font-medium transition"
                                title={t("refundBtn")}
                              >
                                <RotateCcw className="size-3"/> {t("refundBtn")}
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
          {txTotalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-border/30 text-xs text-muted-foreground">
              <span>{t("page")} {txPage} {t("of")} {txTotalPages}</span>
              <div className="flex gap-1">
                <button onClick={() => setTxPage(p => Math.max(1, p - 1))} disabled={txPage === 1} className="p-1.5 rounded-lg hover:bg-muted disabled:opacity-30 transition">
                  <ChevronLeft className="size-3.5"/>
                </button>
                <button onClick={() => setTxPage(p => Math.min(txTotalPages, p + 1))} disabled={txPage === txTotalPages} className="p-1.5 rounded-lg hover:bg-muted disabled:opacity-30 transition">
                  <ChevronRight className="size-3.5"/>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Invoices tab */}
      {tab === "invoices" && (
        <div className="rounded-2xl border border-border/60 bg-card/40 overflow-hidden">
          {invLoad ? (
            <div className="flex items-center justify-center h-52 gap-2 text-muted-foreground text-sm">
              <Loader2 className="size-4 animate-spin"/> {lang === "id" ? "Memuat..." : "Loading..."}
            </div>
          ) : invoices.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground text-sm">{t("invEmpty")}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/40 text-left">
                    {[t("invID"), t("desc"), t("amount"), t("status"), t("date"), t("actions")].map(h => (
                      <th key={h} className="px-4 py-3 text-xs font-semibold text-muted-foreground whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs">{inv.invoice_id}</td>
                      <td className="px-4 py-3 text-muted-foreground max-w-[240px] truncate">{inv.description}</td>
                      <td className="px-4 py-3 font-semibold whitespace-nowrap">{formatAmount(inv.amount, inv.currency)}</td>
                      <td className="px-4 py-3">
                        <span className={cn("px-2 py-0.5 rounded-full text-xs font-semibold",
                          inv.status === "paid" ? "bg-emerald-500/15 text-emerald-400"
                          : inv.status === "cancelled" ? "bg-red-500/15 text-red-400"
                          : "bg-amber-500/15 text-amber-400"
                        )}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                        {inv.paid_at ? formatDate(inv.paid_at, lang) : formatDate(inv.created_at, lang)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {inv.pdf_url && (
                            <a
                              href={`${API_BASE}${inv.pdf_url}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-muted/60 hover:bg-muted text-xs font-medium transition"
                            >
                              <FileText className="size-3"/> {t("download")}
                              <ExternalLink className="size-2.5 opacity-50"/>
                            </a>
                          )}
                          <button
                            onClick={() => handleResendInvoice(inv.payment_id)}
                            disabled={resendId === inv.payment_id}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-muted/60 hover:bg-muted text-xs font-medium transition disabled:opacity-50"
                          >
                            {resendId === inv.payment_id
                              ? <Loader2 className="size-3 animate-spin"/>
                              : <Mail className="size-3"/>}
                            {t("resend")}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {invTotalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-border/30 text-xs text-muted-foreground">
              <span>{t("page")} {invPage} {t("of")} {invTotalPages}</span>
              <div className="flex gap-1">
                <button onClick={() => setInvPage(p => Math.max(1, p - 1))} disabled={invPage === 1} className="p-1.5 rounded-lg hover:bg-muted disabled:opacity-30 transition">
                  <ChevronLeft className="size-3.5"/>
                </button>
                <button onClick={() => setInvPage(p => Math.min(invTotalPages, p + 1))} disabled={invPage === invTotalPages} className="p-1.5 rounded-lg hover:bg-muted disabled:opacity-30 transition">
                  <ChevronRight className="size-3.5"/>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Refund Modal */}
      {refundId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-card border border-border/60 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="size-10 rounded-full bg-red-500/15 flex items-center justify-center shrink-0">
                <AlertCircle className="size-5 text-red-400"/>
              </div>
              <div>
                <h3 className="font-bold">{t("refundTitle")}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{t("refundDesc")}</p>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-semibold mb-1.5">{t("refundLabel")}</label>
              <textarea
                rows={3}
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
                placeholder={t("refundMin")}
                className="w-full px-3 py-2.5 rounded-xl border border-border/60 bg-background/60 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => { setRefundId(null); setRefundReason(""); }}
                className="flex-1 py-2.5 rounded-xl border border-border/60 text-sm font-semibold hover:bg-muted transition"
              >
                {t("cancel")}
              </button>
              <button
                onClick={handleRefund}
                disabled={refundReason.trim().length < 5 || refundLoading}
                className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-400 text-white text-sm font-bold transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {refundLoading
                  ? <Loader2 className="size-4 animate-spin mx-auto"/>
                  : t("submit")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
