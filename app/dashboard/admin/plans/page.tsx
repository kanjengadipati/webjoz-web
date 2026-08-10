"use client";

import React, { useState, useEffect } from "react";
import { useAuthToken } from "@/lib/auth-store";
import { request } from "@/lib/api/client";
import { usePermissions } from "@/hooks/use-permissions";
import { Loader2, Plus, Pencil, Trash2, CreditCard, Zap, Users, Globe, HardDrive, DollarSign } from "lucide-react";
import { Button, Card, CardContent, CardHeader, CardTitle, Dialog, FormField, Input, Textarea, Label } from "@/components/ui";
import { useToast } from "@/components/toast-provider";
import { useI18n } from "@/lib/i18n/context";

interface PlanItem {
  id: number;
  name: string;
  slug: string;
  description: string;
  price_monthly: number;
  price_yearly: number;
  promo_price_monthly: number;
  promo_price_yearly: number;
  promo_duration_months: number;
  promo_label: string;
  max_sites: number;
  max_ai_generates: number;
  max_section_regens: number;
  max_design_regens: number;
  max_members: number;
  max_custom_domain: number;
  features: string;
  active: boolean;
  created_at: string;
}

interface PlanForm {
  name: string;
  slug: string;
  description: string;
  price_monthly: number;
  price_yearly: number;
  promo_price_monthly: number;
  promo_price_yearly: number;
  promo_duration_months: number;
  promo_label: string;
  max_sites: number;
  max_ai_generates: number;
  max_section_regens: number;
  max_design_regens: number;
  max_members: number;
  max_custom_domain: number;
  features: string;
  active: boolean;
}

const emptyForm: PlanForm = {
  name: "", slug: "", description: "", price_monthly: 0, price_yearly: 0,
  promo_price_monthly: 0, promo_price_yearly: 0, promo_duration_months: 0, promo_label: "",
  max_sites: 1, max_ai_generates: 10, max_section_regens: 20, max_design_regens: 5, max_members: 1,
  max_custom_domain: 0, features: "", active: true,
};

export default function AdminPlansPage() {
  const token = useAuthToken();
  const { pushToast } = useToast();
  const { t } = useI18n();
  const { role } = usePermissions();
  const [plans, setPlans] = useState<PlanItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<PlanForm>(emptyForm);

  const isAdmin = role === "superadmin" || role === "admin";

  useEffect(() => {
    if (!token || !isAdmin) return;
    fetchPlans();
  }, [token, isAdmin]);

  async function fetchPlans() {
    try {
      setLoading(true);
      const res = await request<PlanItem[]>("/admin/plans", {}, token);
      setPlans(res.data || []);
    } catch (err: any) {
      pushToast(err.message || t("dashboard.adminPlans.loadFailed"), "error");
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  }

  function openEdit(plan: PlanItem) {
    setEditingId(plan.id);
    setForm({
      name: plan.name,
      slug: plan.slug,
      description: plan.description || "",
      price_monthly: plan.price_monthly,
      price_yearly: plan.price_yearly,
      promo_price_monthly: plan.promo_price_monthly,
      promo_price_yearly: plan.promo_price_yearly,
      promo_duration_months: plan.promo_duration_months,
      promo_label: plan.promo_label || "",
      max_sites: plan.max_sites,
      max_ai_generates: plan.max_ai_generates,
      max_section_regens: plan.max_section_regens,
      max_design_regens: plan.max_design_regens,
      max_members: plan.max_members,
      max_custom_domain: plan.max_custom_domain,
      features: plan.features || "",
      active: plan.active,
    });
    setDialogOpen(true);
  }

  async function handleSave() {
    if (!token) return;
    setSaving(true);
    try {
      if (editingId) {
        await request(`/admin/plans/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(form),
        }, token);
        pushToast(t("dashboard.adminPlans.planUpdated"), "success");
      } else {
        await request("/admin/plans", {
          method: "POST",
          body: JSON.stringify(form),
        }, token);
        pushToast(t("dashboard.adminPlans.planCreated"), "success");
      }
      setDialogOpen(false);
      fetchPlans();
    } catch (err: any) {
      pushToast(err.message || t("dashboard.adminPlans.saveFailed"), "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!token || !confirm(t("dashboard.adminPlans.deleteConfirm"))) return;
    try {
      await request(`/admin/plans/${id}`, { method: "DELETE" }, token);
      pushToast(t("dashboard.adminPlans.planDeleted"), "success");
      fetchPlans();
    } catch (err: any) {
      pushToast(err.message || t("dashboard.adminPlans.deleteFailed"), "error");
    }
  }

  function setNum(key: keyof PlanForm, val: string) {
    const cleanVal = val.replace(/^0+(?=\d)/, "");
    const num = parseInt(cleanVal, 10);
    setForm((prev) => ({ ...prev, [key]: isNaN(num) ? 0 : num }));
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-80 text-muted-foreground gap-4">
        <CreditCard className="size-12 opacity-40" />
        <p className="text-sm">{t("dashboard.adminPlans.noAccess")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight flex items-center gap-3">
            <CreditCard className="size-5 text-primary" />
            {t("dashboard.adminPlans.title")}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {t("dashboard.adminPlans.subtitle")}
          </p>
        </div>
        <Button onClick={openCreate} className="gap-2 self-start sm:self-auto">
          <Plus className="size-4" />
          {t("dashboard.adminPlans.newPlan")}
        </Button>
      </div>

      <Card className="border-border/40 shadow-sm">
        <CardHeader className="border-b border-border/20 pb-4">
          <CardTitle className="text-lg font-bold tracking-tight flex items-center gap-3">
            <CreditCard className="size-5 text-primary" />
            {t("dashboard.adminPlans.allPlans")}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
          ) : plans.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
              <CreditCard className="size-10 opacity-30" />
              <p className="text-sm">{t("dashboard.adminPlans.noPlansYet")}</p>
              <Button variant="outline" size="sm" onClick={openCreate}>{t("dashboard.adminPlans.createFirstPlan")}</Button>
            </div>
          ) : (
            <>
              {/* Mobile: Card layout */}
              <div className="grid gap-3 sm:hidden p-4">
                {plans.map((p) => (
                  <div key={p.id} className="rounded-xl border border-border/30 bg-card p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="font-semibold text-sm">{p.name}</div>
                        <div className="text-[10px] text-muted-foreground">{p.slug}</div>
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
                    <div className="flex items-center gap-3 text-xs">
                      <span className="font-semibold">Rp {p.price_monthly.toLocaleString("id-ID")}{t("dashboard.adminPlans.perMonth")}</span>
                      <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium capitalize ${
                        p.active ? "border-green-500/30 text-green-600" : "border-red-500/30 text-red-500"
                      }`}>
                        {p.active ? t("dashboard.adminPlans.active") : t("dashboard.adminPlans.inactive")}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-2.5 text-[10px] text-muted-foreground">
                      <span>🌐 {t("dashboard.adminPlans.sitesCount", undefined, { count: String(p.max_sites) })}</span>
                      <span>⚡ {t("dashboard.adminPlans.aiCount", undefined, { count: String(p.max_ai_generates) })}</span>
                      <span>👥 {t("dashboard.adminPlans.membersCount", undefined, { count: String(p.max_members) })}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop: Table layout */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/20 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
                      <th className="px-6 py-4">{t("dashboard.adminPlans.tablePlan")}</th>
                      <th className="px-6 py-4">{t("dashboard.adminPlans.tablePrice")}</th>
                      <th className="px-6 py-4 text-center">{t("dashboard.adminPlans.tableSites")}</th>
                      <th className="px-6 py-4 text-center hidden lg:table-cell">{t("dashboard.adminPlans.tableAiGen")}</th>
                      <th className="px-6 py-4 text-center hidden md:table-cell">{t("dashboard.adminPlans.tableMembers")}</th>
                      <th className="px-6 py-4 text-center hidden lg:table-cell">{t("dashboard.adminPlans.tableDomains")}</th>
                      <th className="px-6 py-4">{t("dashboard.adminPlans.tableStatus")}</th>
                      <th className="px-6 py-4"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {plans.map((p) => (
                      <tr key={p.id} className="border-b border-border/10 hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-semibold">{p.name}</div>
                          <div className="text-xs text-muted-foreground">{p.slug}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1 font-medium">
                            <DollarSign className="size-3 text-muted-foreground" />
                            {p.price_monthly.toLocaleString("id-ID")}{t("dashboard.adminPlans.perMonth")}
                          </span>
                          {p.price_yearly > 0 && (
                            <div className="text-xs text-muted-foreground">
                              {p.price_yearly.toLocaleString("id-ID")}{t("dashboard.adminPlans.perYear")}
                            </div>
                          )}
                          {p.promo_price_monthly > 0 && p.promo_duration_months > 0 && (
                            <div className="text-xs text-emerald-600 font-medium">
                              {t("dashboard.adminPlans.promoMonthly", undefined, { price: p.promo_price_monthly.toLocaleString("id-ID"), months: String(p.promo_duration_months) })}
                              {p.promo_label && <span className="text-muted-foreground ml-1">{t("dashboard.adminPlans.promoTag", undefined, { label: p.promo_label })}</span>}
                            </div>
                          )}
                          {p.promo_price_yearly > 0 && (
                            <div className="text-xs text-emerald-600 font-medium">
                              {t("dashboard.adminPlans.promoYearly", undefined, { price: p.promo_price_yearly.toLocaleString("id-ID") })}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="inline-flex items-center gap-1 text-muted-foreground">
                            <Globe className="size-3.5" />
                            {p.max_sites}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center hidden lg:table-cell">
                          <span className="inline-flex items-center gap-1 text-muted-foreground">
                            <Zap className="size-3.5" />
                            {p.max_ai_generates}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center hidden md:table-cell">
                          <span className="inline-flex items-center gap-1 text-muted-foreground">
                            <Users className="size-3.5" />
                            {p.max_members}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center hidden lg:table-cell">
                          <span className="text-muted-foreground">{p.max_custom_domain}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${
                            p.active ? "border-green-500/30 text-green-600" : "border-red-500/30 text-red-500"
                          }`}>
                            {p.active ? t("dashboard.adminPlans.active") : t("dashboard.adminPlans.inactive")}
                          </span>
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
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen} title={editingId ? t("dashboard.adminPlans.editPlan") : t("dashboard.adminPlans.createPlan")}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField label={t("dashboard.adminPlans.name")} required>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Pro" />
            </FormField>
            <FormField label={t("dashboard.adminPlans.slug")} required>
              <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="pro" />
            </FormField>
          </div>
          <FormField label={t("dashboard.adminPlans.description")}>
            <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="For professionals" />
          </FormField>
          <FormField label={t("dashboard.adminPlans.featuresLabel")}>
            <Textarea value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} placeholder={t("dashboard.adminPlans.featuresPlaceholder")} />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label={t("dashboard.adminPlans.priceMonthly")}>
              <Input type="number" value={form.price_monthly || ""} onChange={(e) => setNum("price_monthly", e.target.value)} placeholder="0" />
            </FormField>
            <FormField label={t("dashboard.adminPlans.priceYearly")}>
              <Input type="number" value={form.price_yearly || ""} onChange={(e) => setNum("price_yearly", e.target.value)} placeholder="0" />
            </FormField>
          </div>

          <div className="rounded-lg border border-dashed border-emerald-500/30 bg-emerald-500/5 p-4 space-y-3">
            <div className="text-xs font-semibold text-emerald-600 uppercase tracking-wide">{t("dashboard.adminPlans.promoPricing")}</div>
            <div className="grid grid-cols-2 gap-4">
              <FormField label={t("dashboard.adminPlans.promoPriceMonthly")}>
                <Input type="number" value={form.promo_price_monthly || ""} onChange={(e) => setNum("promo_price_monthly", e.target.value)} placeholder={t("dashboard.adminPlans.noPromo")} />
              </FormField>
              <FormField label={t("dashboard.adminPlans.promoPriceYearly")}>
                <Input type="number" value={form.promo_price_yearly || ""} onChange={(e) => setNum("promo_price_yearly", e.target.value)} placeholder={t("dashboard.adminPlans.noPromo")} />
              </FormField>
            </div>
            <FormField label={t("dashboard.adminPlans.durationMonths")}>
              <Input type="number" value={form.promo_duration_months || ""} onChange={(e) => setNum("promo_duration_months", e.target.value)} placeholder={t("dashboard.adminPlans.noPromo")} />
            </FormField>
            <FormField label={t("dashboard.adminPlans.promoLabel")}>
              <Input value={form.promo_label} onChange={(e) => setForm({ ...form, promo_label: e.target.value })} placeholder={t("dashboard.adminPlans.promoLabelPlaceholder")} />
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormField label={t("dashboard.adminPlans.maxSites")}>
              <Input type="number" value={form.max_sites || ""} onChange={(e) => setNum("max_sites", e.target.value)} placeholder="1" />
            </FormField>
            <FormField label={t("dashboard.adminPlans.aiGenerates")}>
              <Input type="number" value={form.max_ai_generates || ""} onChange={(e) => setNum("max_ai_generates", e.target.value)} placeholder="0" />
            </FormField>
            <FormField label={t("dashboard.adminPlans.sectionRegens")}>
              <Input type="number" value={form.max_section_regens || ""} onChange={(e) => setNum("max_section_regens", e.target.value)} placeholder="0" />
            </FormField>
            <FormField label={t("dashboard.adminPlans.designRegens")}>
              <Input type="number" value={form.max_design_regens || ""} onChange={(e) => setNum("max_design_regens", e.target.value)} placeholder="0" />
            </FormField>
            <FormField label={t("dashboard.adminPlans.maxMembers")}>
              <Input type="number" value={form.max_members || ""} onChange={(e) => setNum("max_members", e.target.value)} placeholder="1" />
            </FormField>
            <FormField label={t("dashboard.adminPlans.customDomains")}>
              <Input type="number" value={form.max_custom_domain || ""} onChange={(e) => setNum("max_custom_domain", e.target.value)} placeholder="0" />
            </FormField>
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" id="plan-active" className="size-4 rounded border border-input accent-primary"
              checked={form.active}
              onChange={(e) => setForm({ ...form, active: e.target.checked })}
            />
            <Label htmlFor="plan-active">{t("dashboard.adminPlans.planActive")}</Label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border/20">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>{t("dashboard.adminPlans.cancel")}</Button>
            <Button onClick={handleSave} disabled={saving || !form.name || !form.slug}>
              {saving ? t("dashboard.adminPlans.saving") : editingId ? t("dashboard.adminPlans.updatePlan") : t("dashboard.adminPlans.createPlanBtn")}
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
