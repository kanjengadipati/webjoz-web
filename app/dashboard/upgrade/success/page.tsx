"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuthToken } from "@/lib/auth-store";
import { request } from "@/lib/api/client";
import { Loader2, Check, X, ArrowLeft, Zap, Globe, Users, HardDrive, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui";

interface Transaction {
  id: number;
  order_id: string;
  gross_amount: number;
  status: string;
  plan_id: number;
  payment_method: string;
  transaction_time: string;
  settlement_time: string;
}

const STATUS_MAP: Record<string, { label: string; color: string; icon: any }> = {
  settlement: { label: "Pembayaran Berhasil", color: "text-emerald-400", icon: Check },
  capture: { label: "Pembayaran Berhasil", color: "text-emerald-400", icon: Check },
  pending: { label: "Menunggu Pembayaran", color: "text-amber-400", icon: Loader2 },
  deny: { label: "Pembayaran Ditolak", color: "text-red-400", icon: X },
  expired: { label: "Pembayaran Kadaluarsa", color: "text-red-400", icon: X },
  refund: { label: "Pembayaran Dikembalikan", color: "text-blue-400", icon: RefreshCw },
  failed: { label: "Pembayaran Gagal", color: "text-red-400", icon: X },
};

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = useAuthToken();

  const orderId = searchParams.get("order_id");
  const transactionStatus = searchParams.get("transaction_status");

  const [tx, setTx] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token || !orderId) {
      setLoading(false);
      setError(!orderId ? "ID transaksi tidak ditemukan" : "Silakan login terlebih dahulu");
      return;
    }

    const fetchTx = async () => {
      try {
        const res = await request<Transaction>(`/payments/order/${orderId}`, {}, token);
        setTx(res.data);
      } catch {
        // retry once after a delay (notification may still be processing)
        await new Promise((r) => setTimeout(r, 2000));
        try {
          const res = await request<Transaction>(`/payments/order/${orderId}`, {}, token);
          setTx(res.data);
        } catch {
          setError("Gagal memuat detail transaksi. Silakan cek di halaman transaksi.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTx();
  }, [token, orderId]);

  const status = transactionStatus || tx?.status || "";
  const statusInfo = STATUS_MAP[status] || { label: status, color: "text-slate-400", icon: Loader2 };
  const StatusIcon = statusInfo.icon;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
        <p className="text-sm text-muted-foreground">Memuat detail pembayaran...</p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto space-y-6 pt-12">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition"
      >
        <ArrowLeft className="size-4" /> Kembali ke Dashboard
      </Link>

      <div className="bg-card border border-border/60 rounded-3xl p-8 text-center space-y-6 shadow-sm">
        <div className={`size-16 rounded-full bg-white/5 flex items-center justify-center mx-auto border border-white/10`}>
          {status === "settlement" || status === "capture" ? (
            <div className="size-16 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <Check className="size-8 text-emerald-400" />
            </div>
          ) : status === "pending" ? (
            <div className="size-16 rounded-full bg-amber-500/20 flex items-center justify-center">
              <Loader2 className="size-8 text-amber-400 animate-spin" />
            </div>
          ) : (
            <div className="size-16 rounded-full bg-red-500/20 flex items-center justify-center">
              <X className="size-8 text-red-400" />
            </div>
          )}
        </div>

        <div className="space-y-1">
          <h1 className={`text-2xl font-bold tracking-tight ${statusInfo.color}`}>
            {statusInfo.label}
          </h1>
          <p className="text-sm text-muted-foreground">
            {status === "settlement" || status === "capture"
              ? "Paket Anda telah di-upgrade. Nikmati semua fitur Pro sekarang!"
              : status === "pending"
                ? "Pembayaran sedang diproses. Kami akan meng-upgrade paket Anda secara otomatis."
                : "Silakan coba lagi atau hubungi tim support kami."}
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {tx && (
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 space-y-3 text-left">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Detail Transaksi
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Order ID</span>
                <span className="font-mono text-xs text-foreground">{tx.order_id}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Total</span>
                <span className="font-bold text-foreground">Rp {tx.gross_amount.toLocaleString("id-ID")}</span>
              </div>
              {tx.payment_method && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Metode</span>
                  <span className="text-foreground capitalize">{tx.payment_method.replace(/_/g, " ")}</span>
                </div>
              )}
              {tx.transaction_time && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Waktu</span>
                  <span className="text-foreground">
                    {new Date(tx.transaction_time).toLocaleDateString("id-ID", {
                      day: "numeric", month: "long", year: "numeric",
                      hour: "2-digit", minute: "2-digit",
                    })}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <Link href="/dashboard">
            <Button className="w-full h-12 rounded-xl font-bold shadow-lg shadow-primary/20">
              <Zap className="size-4 mr-2" /> Ke Dashboard
            </Button>
          </Link>
          <Link href="/dashboard/upgrade">
            <Button variant="secondary" className="w-full h-12 rounded-xl font-bold bg-background text-foreground hover:bg-background/80 border border-border/60">
              Lihat Paket Lain
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
