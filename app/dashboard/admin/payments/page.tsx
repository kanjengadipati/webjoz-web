"use client";

import { useState, useEffect } from "react";
import { X, CheckCircle, Clock, Loader2, Trash2 } from "lucide-react";
import { Card, Button } from "@/components/ui";
import { cn } from "@/lib/utils";
import { listPayments, forceUpdateStatus } from "@/lib/api/payments";

interface PaymentResponse {
  id: number;
  order_id: string;
  tenant_id: number;
  reference_type: string;
  reference_id: string;
  amount: number;
  currency: string;
  status: string;
  gateway: string;
  transaction_time: string;
  created_at: string;
}

interface PaymentRow {
  id: number;
  orderId: string;
  tenantId: number;
  referenceType: string;
  referenceId: string;
  amount: number;
  currency: string;
  status: string;
  gateway: string;
  createdAt: string;
}

interface PaymentStatusOptions {
  label: string;
  value: "paid" | "pending" | "failed";
}

const STATUS_OPTIONS: PaymentStatusOptions[] = [
  { label: "Pending", value: "pending" },
  { label: "Settlement / Paid", value: "paid" },
  { label: "Failed", value: "failed" },
];

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<PaymentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<PaymentRow | null>(null);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<string>("pending");
  const [reason, setReason] = useState<string>("");

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listPayments({ limit: 50, offset: 0 });
      // Map PaymentResponse to PaymentRow
      const mapped = data.data?.map((resp) => ({
        id: resp.id,
        orderId: resp.order_id,
        tenantId: resp.tenant_id,
        referenceType: resp.reference_type,
        referenceId: resp.reference_id,
        amount: resp.amount,
        currency: resp.currency,
        status: resp.status,
        gateway: resp.gateway,
        createdAt: resp.created_at,
      })) || [];
      setPayments(mapped);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (paymentId: number) => {
    if (!confirm(`Are you sure you want to set payment ${paymentId} to "${newStatus}"?`)) return;

    setStatusModalOpen(false);
    setSelectedPayment(null);
    setNewStatus("pending");
    setReason("");

    try {
      await forceUpdateStatus(paymentId, newStatus as "paid" | "pending" | "failed", reason || "Admin manual override");

      // Refresh the list
      await fetchPayments();
    } catch (e: any) {
      alert("Error updating status: " + (e.message || "Unknown error"));
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading payments...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <Card className="w-full">
      <div className="p-6">
        <h2 className="text-xl font-bold mb-6">Payment Management</h2>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-sm text-muted-foreground">Total Payments</p>
            <p className="text-2xl font-bold">{payments.length}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Paid</p>
            <p className="text-2xl font-bold">{payments.filter((p) => p.status === "paid").length}</p>
          </div>
        </div>

        {/* Payments Table */}
        <div className="overflow-x-auto">
          <table className="w-full rounded border border-border/60 bg-card/40">
            <thead>
              <tr className="border-b border-border/30 text-left text-sm font-semibold text-muted-foreground">
                <th className="p-4">ID</th>
                <th className="p-4">Order ID</th>
                <th className="p-4">Tenant ID</th>
                <th className="p-4">Type</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4">Gateway</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment.id} className="border-b border-border/30 hover:bg-muted/20">
                  <td className="p-4">{payment.id}</td>
                  <td className="p-4">{payment.orderId}</td>
                  <td className="p-4">{payment.tenantId}</td>
                  <td className="p-4">
                    {payment.referenceType === "domain" ? "Domain" : "Subscription"}
                  </td>
                  <td className="p-4">{payment.amount} {payment.currency}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      payment.status === "paid" ? "bg-green-100 text-green-800" :
                      payment.status === "failed" ? "bg-red-100 text-red-800" :
                      "bg-yellow-100 text-yellow-800"
                    }`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="p-4">{payment.gateway}</td>
                  <td className="p-4">
                    <Button variant="ghost" size="sm" onClick={() => setSelectedPayment(payment)}>
                      <X className="size-3.5" /> Edit
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Status Change Modal */}
        {selectedPayment && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-zxl z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md max-transform transform overflow-hidden shadow-xl">
              <h3 className="text-xl font-bold mb-4">Set Payment Status</h3>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Payment ID</label>
                <p className="border rounded p-2 font-mono">{selectedPayment.id}</p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">New Status</label>
                <select
                  className="w-full border rounded p-2 py-2"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Reason (for audit)</label>
                <textarea
                  className="w-full border rounded p-2 h-20 resize-y"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Enter reason for this manual override..."
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStatusModalOpen(false)}
                  className="flex-1 py-2 px-4 rounded bg-gray-200 hover:bg-gray-300 text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleStatusChange(selectedPayment.id)}
                  className="flex-1 py-2 px-4 rounded bg-primary text-white hover:bg-primary/90 text-sm"
                >
                  Update Status
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}