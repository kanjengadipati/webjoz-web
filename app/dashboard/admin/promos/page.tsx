"use client";

import React, { useState, useEffect } from "react";
import { useAuthToken } from "@/lib/auth-store";
import { request } from "@/lib/api/client";
import { usePermissions } from "@/hooks/use-permissions";
import { Loader2, Plus, Pencil, Trash2, Percent, Tag, Calendar, Hash, Shield, Ban, CheckCircle, XCircle } from "lucide-react";
import { Button, Card, CardContent, CardHeader, CardTitle, Dialog, FormField, Input, Textarea, Label, Select } from "@/components/ui";
import { useToast } from "@/components/toast-provider";

interface PromoCode {
  id: number;
  code: string;
  description: string;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  scope: string;
  scope_plan_slugs: string;
  currency_scope: string;
  billing_cycle_scope: string;
  max_total_uses: number;
  max_uses_per_user: number;
  min_amount: number;
  valid_from: string | null;
  valid_until: string | null;
  active: boolean;
  created_at: string;
}

interface PromoForm {
  code: string;
  description: string;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  scope: string;
  scope_plan_slugs: string;
  currency_scope: string;
  billing_cycle_scope: string;
  max_total_uses: number;
  max_uses_per_user: number;
  min_amount: number;
  valid_from: string;
  valid_until: string;
  active: boolean;
}

const emptyForm: PromoForm = {
  code: "",
  description: "",
  discount_type: "percentage",
  discount_value: 0,
  scope: "all",
  scope_plan_slugs: "",
  currency_scope: "both",
  billing_cycle_scope: "all",
  max_total_uses: 0,
  max_uses_per_user: 1,
  min_amount: 0,
  valid_from: "",
  valid_until: "",
  active: true,
};

export default function AdminPromosPage() {
  const token = useAuthToken();
  const { pushToast } = useToast();
  const { role } = usePermissions();
  const [promos, setPromos] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<PromoForm>(emptyForm);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const perPage = 20;

  const isAdmin = role === "superadmin" || role === "admin";

  useEffect(() => {
    if (!token || !isAdmin) return;
    fetchPromos();
  }, [token, isAdmin, page]);

  async function fetchPromos() {
    try {
      setLoading(true);
      const res = await request<{ promos: PromoCode[]; total: number }>(
        `/admin/promos?limit=${perPage}&offset=${(page - 1) * perPage}`,
        {},
        token,
      );
      setPromos(res.data?.promos || []);
      setTotal(res.data?.total || 0);
    } catch (err: any) {
      pushToast(err.message || "Gagal memuat kode promo", "error");
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  }

  function openEdit(promo: PromoCode) {
    setEditingId(promo.id);
    setForm({
      code: promo.code,
      description: promo.description || "",
      discount_type: promo.discount_type,
      discount_value: promo.discount_value,
      scope: promo.scope,
      scope_plan_slugs: promo.scope_plan_slugs || "",
      currency_scope: promo.currency_scope,
      billing_cycle_scope: promo.billing_cycle_scope,
      max_total_uses: promo.max_total_uses,
      max_uses_per_user: promo.max_uses_per_user,
      min_amount: promo.min_amount,
      valid_from: promo.valid_from ? promo.valid_from.slice(0, 10) : "",
      valid_until: promo.valid_until ? promo.valid_until.slice(0, 10) : "",
      active: promo.active,
    });
    setDialogOpen(true);
  }

  async function handleSave() {
    if (!token) return;
    setSaving(true);
    try {
      const payload: any = {
        ...form,
        discount_value: Number(form.discount_value),
        max_total_uses: Number(form.max_total_uses),
        max_uses_per_user: Number(form.max_uses_per_user),
        min_amount: Number(form.min_amount),
      };
      if (form.valid_from) payload.valid_from = form.valid_from + "T00:00:00Z";
      if (form.valid_until) payload.valid_until = form.valid_until + "T23:59:59Z";

      if (editingId) {
        await request(`/admin/promos/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        }, token);
        pushToast("Kode promo berhasil diperbarui", "success");
      } else {
        await request("/admin/promos", {
          method: "POST",
          body: JSON.stringify(payload),
        }, token);
        pushToast("Kode promo berhasil dibuat", "success");
      }
      setDialogOpen(false);
      fetchPromos();
    } catch (err: any) {
      pushToast(err.message || "Gagal menyimpan kode promo", "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!token || !confirm("Hapus kode promo ini?")) return;
    try {
      await request(`/admin/promos/${id}`, { method: "DELETE" }, token);
      pushToast("Kode promo berhasil dihapus", "success");
      fetchPromos();
    } catch (err: any) {
      pushToast(err.message || "Gagal menghapus kode promo", "error");
    }
  }

  function setNum(key: keyof PromoForm, val: string) {
    const cleanVal = val.replace(/^0+(?=\d)/, "");
    const num = parseFloat(cleanVal);
    setForm((prev) => ({ ...prev, [key]: isNaN(num) ? 0 : num }));
  }

  function formatDate(d: string | null) {
    if (!d) return "-";
    return new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
  }

  function isExpired(promo: PromoCode) {
    if (!promo.valid_until) return false;
    return new Date(promo.valid_until) < new Date();
  }

  const totalPages = Math.ceil(total / perPage);

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-80 text-muted-foreground gap-4">
        <Percent className="size-12 opacity-40" />
        <p className="text-sm">Anda tidak memiliki akses ke halaman ini</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight flex items-center gap-3">
            <Percent className="size-5 text-primary" />
            Kode Promo
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Kelola kode promo diskon untuk pelanggan
          </p>
        </div>
        <Button onClick={openCreate} className="gap-2 self-start sm:self-auto">
          <Plus className="size-4" />
          Buat Promo
        </Button>
      </div>

      <Card className="border-border/40 shadow-sm">
        <CardHeader className="border-b border-border/20 pb-4">
          <CardTitle className="text-lg font-bold tracking-tight flex items-center gap-3">
            <Tag className="size-5 text-primary" />
            Semua Kode Promo
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
          ) : promos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
              <Tag className="size-10 opacity-30" />
              <p className="text-sm">Belum ada kode promo</p>
              <Button variant="outline" size="sm" onClick={openCreate}>Buat Promo Pertama</Button>
            </div>
          ) : (
            <>
              {/* Mobile: Card layout */}
              <div className="grid gap-3 sm:hidden p-4">
                {promos.map((p) => (
                  <div key={p.id} className="rounded-xl border border-border/30 bg-card p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="font-mono font-bold text-sm">{p.code}</div>
                        <div className="text-[10px] text-muted-foreground">{p.description}</div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="size-7" onClick={() => openEdit(p)}>
                          <Pencil className="size-3" />
                        </Button>
                        <Button variant="ghost" size="icon" className="size-7 text-destructive" onClick={() => handleDelete(p.id)}>
                          <Trash2 className="size-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap text-xs">
                      <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                        {p.discount_type === "percentage" ? `${p.discount_value}%` : `Rp ${p.discount_value.toLocaleString("id-ID")}`}
                      </span>
                      <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium capitalize ${
                        p.active && !isExpired(p) ? "border-green-500/30 text-green-600" : "border-red-500/30 text-red-500"
                      }`}>
                        {p.active && !isExpired(p) ? "Aktif" : isExpired(p) ? "Kedaluwarsa" : "Nonaktif"}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {p.currency_scope === "both" ? "IDR + USD" : p.currency_scope.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-2.5 text-[10px] text-muted-foreground">
                      <span>📅 {formatDate(p.valid_until)}</span>
                      <span>👤 Max {p.max_uses_per_user}x/user</span>
                      {p.max_total_uses > 0 && <span>🔢 Max {p.max_total_uses}x total</span>}
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop: Table layout */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/20 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
                      <th className="px-6 py-4">Kode</th>
                      <th className="px-6 py-4">Diskon</th>
                      <th className="px-6 py-4 hidden md:table-cell">Mata Uang</th>
                      <th className="px-6 py-4 hidden lg:table-cell">Billing</th>
                      <th className="px-6 py-4 hidden lg:table-cell">Min. Bayar</th>
                      <th className="px-6 py-4 hidden md:table-cell">Berlaku Hingga</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {promos.map((p) => (
                      <tr key={p.id} className="border-b border-border/10 hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-mono font-bold">{p.code}</div>
                          <div className="text-xs text-muted-foreground max-w-[200px] truncate">{p.description}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                            {p.discount_type === "percentage" ? (
                              <><Percent className="size-3" />{p.discount_value}%</>
                            ) : (
                              <>Rp {p.discount_value.toLocaleString("id-ID")}</>
                            )}
                          </span>
                          {p.max_uses_per_user > 0 && (
                            <div className="text-[10px] text-muted-foreground mt-1">
                              Max {p.max_uses_per_user}x per user
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 hidden md:table-cell">
                          <span className="text-xs text-muted-foreground">
                            {p.currency_scope === "both" ? "IDR + USD" : p.currency_scope.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 hidden lg:table-cell">
                          <span className="text-xs text-muted-foreground capitalize">
                            {p.billing_cycle_scope === "all" ? "Semua" : p.billing_cycle_scope}
                          </span>
                        </td>
                        <td className="px-6 py-4 hidden lg:table-cell">
                          <span className="text-xs text-muted-foreground">
                            {p.min_amount > 0 ? `Rp ${p.min_amount.toLocaleString("id-ID")}` : "-"}
                          </span>
                        </td>
                        <td className="px-6 py-4 hidden md:table-cell">
                          <span className="text-xs text-muted-foreground">{formatDate(p.valid_until)}</span>
                        </td>
                        <td className="px-6 py-4">
                          {isExpired(p) ? (
                            <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 px-2.5 py-0.5 text-xs font-medium text-amber-600">
                              <Calendar className="size-3" />
                              Kedaluwarsa
                            </span>
                          ) : p.active ? (
                            <span className="inline-flex items-center gap-1 rounded-full border border-green-500/30 px-2.5 py-0.5 text-xs font-medium text-green-600">
                              <CheckCircle className="size-3" />
                              Aktif
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full border border-red-500/30 px-2.5 py-0.5 text-xs font-medium text-red-500">
                              <XCircle className="size-3" />
                              Nonaktif
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="icon" className="size-8" onClick={() => openEdit(p)}>
                              <Pencil className="size-3.5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="size-8 text-destructive" onClick={() => handleDelete(p.id)}>
                              <Trash2 className="size-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-border/20">
              <span className="text-xs text-muted-foreground">
                Halaman {page} dari {totalPages} ({total} kode promo)
              </span>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                  Sebelumnya
                </Button>
                <Button size="sm" variant="outline" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
                  Selanjutnya
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen} title={editingId ? "Edit Kode Promo" : "Buat Kode Promo"}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Kode Promo" required>
              <Input
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                placeholder="WELCOME20"
                disabled={!!editingId}
                className="font-mono"
              />
            </FormField>
            <FormField label="Tipe Diskon" required>
              <select
                value={form.discount_type}
                onChange={(e) => setForm({ ...form, discount_type: e.target.value as "percentage" | "fixed" })}
                className="flex h-10 w-full rounded-xl border border-border/60 bg-card/60 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="percentage">Persen (%)</option>
                <option value="fixed">Nominal Tetap (Rp)</option>
              </select>
            </FormField>
          </div>

          <FormField label="Deskripsi">
            <Input
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Diskon Welcome 20%"
            />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Nilai Diskon" required>
              <Input
                type="number"
                value={form.discount_value || ""}
                onChange={(e) => setNum("discount_value", e.target.value)}
                placeholder={form.discount_type === "percentage" ? "20" : "50000"}
              />
            </FormField>
            <FormField label="Min. Pembayaran">
              <Input
                type="number"
                value={form.min_amount || ""}
                onChange={(e) => setNum("min_amount", e.target.value)}
                placeholder="0"
              />
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Cakupan Paket">
              <select
                value={form.scope}
                onChange={(e) => setForm({ ...form, scope: e.target.value })}
                className="flex h-10 w-full rounded-xl border border-border/60 bg-card/60 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="all">Semua Paket</option>
                <option value="specific">Paket Tertentu</option>
              </select>
            </FormField>
            <FormField label="Cakupan Mata Uang">
              <select
                value={form.currency_scope}
                onChange={(e) => setForm({ ...form, currency_scope: e.target.value })}
                className="flex h-10 w-full rounded-xl border border-border/60 bg-card/60 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="both">IDR + USD</option>
                <option value="idr">IDR Saja</option>
                <option value="usd">USD Saja</option>
              </select>
            </FormField>
          </div>

          {form.scope === "specific" && (
            <FormField label="Slug Paket (koma dipisah)">
              <Input
                value={form.scope_plan_slugs}
                onChange={(e) => setForm({ ...form, scope_plan_slugs: e.target.value })}
                placeholder="pro,enterprise"
              />
            </FormField>
          )}

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Cakupan Billing">
              <select
                value={form.billing_cycle_scope}
                onChange={(e) => setForm({ ...form, billing_cycle_scope: e.target.value })}
                className="flex h-10 w-full rounded-xl border border-border/60 bg-card/60 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="all">Semua</option>
                <option value="monthly">Bulanan Saja</option>
                <option value="yearly">Tahunan Saja</option>
              </select>
            </FormField>
            <FormField label="Max Penggunaan/User">
              <Input
                type="number"
                value={form.max_uses_per_user || ""}
                onChange={(e) => setNum("max_uses_per_user", e.target.value)}
                placeholder="1"
              />
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Max Total Penggunaan (0 = tanpa batas)">
              <Input
                type="number"
                value={form.max_total_uses || ""}
                onChange={(e) => setNum("max_total_uses", e.target.value)}
                placeholder="0"
              />
            </FormField>
            <div />
          </div>

          <div className="rounded-lg border border-dashed border-primary/30 bg-primary/5 p-4 space-y-3">
            <div className="text-xs font-semibold text-primary uppercase tracking-wide">Masa Berlaku</div>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Berlaku Dari">
                <Input
                  type="date"
                  value={form.valid_from}
                  onChange={(e) => setForm({ ...form, valid_from: e.target.value })}
                />
              </FormField>
              <FormField label="Berlaku Hingga">
                <Input
                  type="date"
                  value={form.valid_until}
                  onChange={(e) => setForm({ ...form, valid_until: e.target.value })}
                />
              </FormField>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="promo-active"
              className="size-4 rounded border border-input accent-primary"
              checked={form.active}
              onChange={(e) => setForm({ ...form, active: e.target.checked })}
            />
            <Label htmlFor="promo-active">Promo Aktif</Label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border/20">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Batal</Button>
            <Button onClick={handleSave} disabled={saving || !form.code || !form.discount_value}>
              {saving ? "Menyimpan..." : editingId ? "Perbarui Promo" : "Buat Promo"}
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
