"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useParams } from "next/navigation";
import { useAuthToken } from "@/lib/auth-store";
import { useActiveTenant } from "@/lib/tenant-store";
import { request } from "@/lib/api/client";
import { useToast } from "@/components/toast-provider";
import { SiteSubNav } from "@/components/site-sub-nav";
import { SparkleGenAI } from "@/components/sparkle-icon";
import { PageLoading, Spinner } from "@/components/ui";
import Link from "next/link";
import {
  ChevronLeft, Save, Check, ShoppingBag,
  Utensils, CreditCard, Truck, RotateCcw, Plus, X,
} from "lucide-react";
import { SparkleIcon } from "@/components/sparkle-icon";
import { useI18n } from "@/lib/i18n/context";
import { decodeSiteId } from "@/lib/sqids";
import { MenuCatalogForm } from "@/components/menu-catalog-form";
import type { PaymentConfig, PaymentMethod } from "@/components/templates/types";

export default function KatalogManagerPage() {
  const { id } = useParams();
  const token = useAuthToken();
  const { activeTenantId, activeTenant } = useActiveTenant();
  const { pushToast } = useToast();
  const { t } = useI18n();
  const isPremium = activeTenant?.tenant?.plan === "pro" || activeTenant?.tenant?.plan === "enterprise";

  const siteId = decodeSiteId(id as string);
  const tenantHeaders = useMemo(() => ({ "X-Tenant-ID": activeTenantId?.toString() ?? "" }), [activeTenantId]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);

  // sectionKey is detected from the site's existing content
  const [sectionKey, setSectionKey] = useState<"catalog" | "menu">("catalog");
  const [sectionData, setSectionData] = useState<any>({});

  // Payment methods & shipping config (display block in the cart drawer)
  const [payments, setPayments] = useState<PaymentConfig>({});
  const paymentsRef = useRef<PaymentConfig>({});

  // Full content ref so we can PUT the whole content object back
  const fullContentRef = useRef<any>(null);
  const sectionDataRef = useRef<any>({});
  const autosaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const paymentsAutosaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // AI description state
  const [aiLoadingDesc, setAiLoadingDesc] = useState<string | null>(null);
  const [aiPromptModal, setAiPromptModal] = useState<{
    label: string;
    resolve: (val: string | null) => void;
  } | null>(null);
  const [aiPromptInput, setAiPromptInput] = useState("");
  const [upgradePromptOpen, setUpgradePromptOpen] = useState(false);

  const fetchContent = useCallback(async () => {
    if (!token || !activeTenantId) return;
    try {
      setLoading(true);
      const res = await request<any>(`/sites/${siteId}/content`, { headers: tenantHeaders }, token);
      const content = res.data?.content ?? {};
      fullContentRef.current = content;

      const paymentsData = (content.payments && typeof content.payments === "object" ? content.payments : {}) as PaymentConfig;
      setPayments(paymentsData);
      paymentsRef.current = paymentsData;

      if (content.menu && !content.catalog) {
        setSectionKey("menu");
        setSectionData(content.menu ?? {});
        sectionDataRef.current = content.menu ?? {};
      } else {
        setSectionKey("catalog");
        setSectionData(content.catalog ?? {});
        sectionDataRef.current = content.catalog ?? {};
      }
    } catch (err: any) {
      pushToast(err.message || t("dashboard.sitesKatalog.loadFailed", "Gagal memuat katalog."), "error");
    } finally {
      setLoading(false);
    }
  }, [token, activeTenantId, siteId, t, pushToast]);

  useEffect(() => { fetchContent(); }, [fetchContent]);

  useEffect(() => { sectionDataRef.current = sectionData; }, [sectionData]);

  const saveContent = useCallback(async (data: any, key: "catalog" | "menu") => {
    if (!token || !activeTenantId || !fullContentRef.current) return;
    try {
      setSaving(true);
      const updated = { ...fullContentRef.current, [key]: data };
      await request(`/sites/${siteId}/content`, {
        method: "PUT",
        headers: tenantHeaders,
        body: JSON.stringify({ content: updated }),
      }, token);
      fullContentRef.current = updated;
      setSavedAt(new Date());
    } catch (err: any) {
      pushToast(err.message || t("dashboard.sitesKatalog.saveFailed", "Gagal menyimpan perubahan."), "error");
    } finally {
      setSaving(false);
    }
  }, [token, activeTenantId, siteId, t, pushToast]);

  // Autosave with 2-second debounce
  const scheduleAutosave = useCallback((data: any, key: "catalog" | "menu") => {
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    autosaveTimer.current = setTimeout(() => { void saveContent(data, key); }, 2000);
  }, [saveContent]);

  const updateField = useCallback((section: string, key: string, val: any) => {
    setSectionData((prev: any) => {
      const next = { ...prev, [key]: val };
      scheduleAutosave(next, sectionKey);
      return next;
    });
  }, [scheduleAutosave, sectionKey]);

  // Save the payment & shipping config block back to site content
  const savePayments = useCallback(async (data: PaymentConfig) => {
    if (!token || !activeTenantId || !fullContentRef.current) return;
    try {
      setSaving(true);
      const updated = { ...fullContentRef.current, payments: data };
      await request(`/sites/${siteId}/content`, {
        method: "PUT",
        headers: tenantHeaders,
        body: JSON.stringify({ content: updated }),
      }, token);
      fullContentRef.current = updated;
      setSavedAt(new Date());
    } catch (err: unknown) {
      pushToast((err instanceof Error ? err.message : "") || t("dashboard.sitesKatalog.saveFailed", "Gagal menyimpan perubahan."), "error");
    } finally {
      setSaving(false);
    }
  }, [token, activeTenantId, siteId, tenantHeaders, t, pushToast]);

  const schedulePaymentsAutosave = useCallback((data: PaymentConfig) => {
    if (paymentsAutosaveTimer.current) clearTimeout(paymentsAutosaveTimer.current);
    paymentsAutosaveTimer.current = setTimeout(() => { void savePayments(data); }, 2000);
  }, [savePayments]);

  const updatePayments = useCallback((patch: Partial<PaymentConfig>) => {
    setPayments((prev) => {
      const next: PaymentConfig = { ...prev, ...patch };
      paymentsRef.current = next;
      schedulePaymentsAutosave(next);
      return next;
    });
  }, [schedulePaymentsAutosave]);

  const updatePaymentMethod = useCallback((idx: number, key: keyof PaymentMethod, val: string) => {
    setPayments((prev) => {
      const methods = [...(prev.methods ?? [])];
      const current = methods[idx];
      if (current) {
        methods[idx] = { ...current, [key]: val } as PaymentMethod;
      }
      const next: PaymentConfig = { ...prev, methods };
      paymentsRef.current = next;
      schedulePaymentsAutosave(next);
      return next;
    });
  }, [schedulePaymentsAutosave]);

  const addPaymentMethod = useCallback(() => {
    setPayments((prev) => {
      const next: PaymentConfig = { ...prev, methods: [...(prev.methods ?? []), { type: "transfer", label: "", detail: "" }] };
      paymentsRef.current = next;
      schedulePaymentsAutosave(next);
      return next;
    });
  }, [schedulePaymentsAutosave]);

  const removePaymentMethod = useCallback((idx: number) => {
    setPayments((prev) => {
      const methods = [...(prev.methods ?? [])];
      methods.splice(idx, 1);
      const next: PaymentConfig = { ...prev, methods };
      paymentsRef.current = next;
      schedulePaymentsAutosave(next);
      return next;
    });
  }, [schedulePaymentsAutosave]);

  // AI item description handler
  const handleAiItemDescription = useCallback(async (
    catIdx: number, itemIdx: number, itemName: string, catName: string, imageUrl?: string
  ) => {
    if (!token || !activeTenantId) return;
    const customPrompt = await new Promise<string | null>((resolve) => {
      setAiPromptInput("");
      setAiPromptModal({ label: `${t("dashboard.sitesKatalog.aiPromptLabelPrefix", "Deskripsi")}: ${itemName || `${t("dashboard.sitesKatalog.itemFallback", `Item #${itemIdx + 1}`, { number: String(itemIdx + 1) })}`}`, resolve });
    });
    if (customPrompt === null) return;

    const loadKey = `${catIdx}_${itemIdx}`;
    setAiLoadingDesc(loadKey);
    try {
      const imageContext = imageUrl ? ` Gambar item: ${imageUrl}` : "";
      const instructions = `Fokus hanya pada deskripsi item "${itemName}" di kategori "${catName}". Buat deskripsi menarik dan informatif, 1-3 kalimat. Jaga field lain tetap sama.${imageContext}${customPrompt.trim() ? ` Instruksi tambahan: "${customPrompt}"` : ""}`;
      const res = await request<any>("/ai/regenerate-section", {
        method: "POST",
        body: JSON.stringify({ site_id: siteId, section: sectionKey, instructions, tenant_id: activeTenantId, image_url: imageUrl }),
      }, token);

      if (res.status === "success" && res.data?.section) {
        const updatedSection = res.data.section;
        const cats = updatedSection?.categories ?? [];
        const targetItem = cats[catIdx]?.items?.[itemIdx];
        if (targetItem?.description) {
          updateField(sectionKey, "categories", cats);
        }
      }
    } catch (err: any) {
      if (err?.code === "ERR_PLAN_LIMIT" || err?.code === "ERR_USAGE_LIMIT") {
        setUpgradePromptOpen(true);
      } else {
        pushToast(err.message || t("dashboard.sitesKatalog.aiFailed", "Gagal generate dengan AI."), "error");
      }
      throw err;
    } finally {
      setAiLoadingDesc(null);
    }
  }, [token, activeTenantId, siteId, sectionKey, updateField, pushToast, t]);

  if (loading) {
    return <PageLoading message={t("dashboard.sitesKatalog.loading", "Memuat katalog...")} className="min-h-[400px]" />;
  }

  const isMenu = sectionKey === "menu";
  const sectionTitle = isMenu ? t("dashboard.sitesKatalog.sectionTitleMenu", "Menu Resto") : t("dashboard.sitesKatalog.sectionTitleCatalog", "Katalog Produk");
  const itemLabel = isMenu ? t("dashboard.sitesKatalog.itemLabelMenu", "menu") : t("dashboard.sitesKatalog.itemLabelCatalog", "produk");
  const SectionIcon = isMenu ? Utensils : ShoppingBag;

  // Calculate statistics
  const categoriesList: any[] = sectionData?.categories ?? [];
  const totalCategories = categoriesList.length;
  const totalItems = categoriesList.reduce((acc, cat) => acc + (cat.items?.length ?? 0), 0);
  const totalAvailable = categoriesList.reduce((acc, cat) => acc + (cat.items?.filter((it: any) => it.is_available !== false).length ?? 0), 0);
  const totalVariantGroups = categoriesList.reduce((acc, cat) => acc + (cat.items?.filter((it: any) => it.variant_groups?.length > 0).length ?? 0), 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <SiteSubNav siteId={siteId} />

      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl border border-border/80 bg-card shadow-xs">
        <div className="flex items-center gap-3.5 min-w-0">
          <Link
            href={`/dashboard/sites/${siteId}`}
            className="flex items-center justify-center w-9 h-9 rounded-xl border border-border bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors shrink-0"
            title={t("dashboard.sitesKatalog.webLink", "Kembali ke Website")}
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 shadow-xs">
            <SectionIcon className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl font-extrabold text-foreground truncate leading-tight">{sectionTitle}</h1>
            <p className="text-xs text-muted-foreground truncate">{t("dashboard.sitesKatalog.allChangesSaved", "Semua perubahan otomatis tersimpan secara aman")}</p>
          </div>
        </div>

        {/* Save status & manual save button */}
        <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
          {saving ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-500 border border-amber-500/20">
              <Spinner size="xs" variant="current" /> {t("dashboard.sitesKatalog.saving", "Menyimpan...")}
            </span>
          ) : savedAt ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              <Check className="w-3.5 h-3.5" /> {t("dashboard.sitesKatalog.saved", "Tersimpan")}
            </span>
          ) : null}

          <button
            type="button"
            onClick={() => {
              if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
              void saveContent(sectionDataRef.current, sectionKey);
            }}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 disabled:opacity-60 transition-all cursor-pointer shadow-sm active:scale-95"
          >
            <Save className="w-4 h-4" /> {t("dashboard.sitesKatalog.save", "Simpan Sekarang")}
          </button>
        </div>
      </div>

      {/* Quick Summary Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl border border-border/80 bg-card shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">{t("dashboard.sitesKatalog.statCategories", "Kategori")}</span>
          <p className="text-xl sm:text-2xl font-black text-foreground">{totalCategories}</p>
        </div>
        <div className="p-4 rounded-2xl border border-border/80 bg-card shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">{t("dashboard.sitesKatalog.statTotalItems", "Total Produk")}</span>
          <p className="text-xl sm:text-2xl font-black text-foreground">{totalItems}</p>
        </div>
        <div className="p-4 rounded-2xl border border-border/80 bg-card shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">{t("dashboard.sitesKatalog.statAvailable", "Tersedia")}</span>
          <p className="text-xl sm:text-2xl font-black text-emerald-500">{totalAvailable}</p>
        </div>
        <div className="p-4 rounded-2xl border border-border/80 bg-card shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">{t("dashboard.sitesKatalog.statVariants", "Varian / Opsi")}</span>
          <p className="text-xl sm:text-2xl font-black text-primary">{totalVariantGroups}</p>
        </div>
      </div>

      {/* Reused MenuCatalogForm in Page Mode */}
      <MenuCatalogForm
        sectionKey={sectionKey}
        sectionTitle={sectionTitle}
        itemLabel={itemLabel}
        hasPrice={!isMenu}
        hasBadge={true}
        data={sectionData}
        updateField={updateField}
        onAiDescription={isPremium ? handleAiItemDescription : undefined}
        aiLoadingDesc={aiLoadingDesc}
        isPremium={isPremium}
        onUpgradeRequired={() => setUpgradePromptOpen(true)}
        mode="page"
      />

      {/* Payment & Shipping config — display block in the cart drawer */}
      <div className="p-5 rounded-3xl border border-border/80 bg-card shadow-xs space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 shadow-xs">
            <CreditCard className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h2 className="text-sm sm:text-base font-extrabold text-foreground leading-tight">
              {t("dashboard.sitesKatalog.paymentTitle", "Metode Pembayaran & Pengiriman")}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {t("dashboard.sitesKatalog.paymentSubtitle", "Tampilkan info pembayaran dan pengiriman di keranjang pesanan pengunjung. Belum perlu integrasi payment gateway — cukup info rekening/QRIS statis.")}
            </p>
          </div>
        </div>

        {/* Methods list */}
        <div className="space-y-2">
          <label className="block text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
            {t("dashboard.sitesKatalog.methodsTitle", "Metode Pembayaran")}
          </label>
          {(payments.methods ?? []).map((method: PaymentMethod, idx: number) => (
            <div key={idx} className="flex flex-col sm:flex-row gap-2 p-2.5 rounded-xl border border-border bg-muted/30">
              <select
                value={method.type ?? "transfer"}
                onChange={(e) => updatePaymentMethod(idx, "type", e.target.value)}
                className="w-full sm:w-40 shrink-0 px-3 py-2 border border-border bg-background text-foreground rounded-xl text-xs outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all"
              >
                <option value="transfer">{t("dashboard.sitesKatalog.methodTypeTransfer", "Transfer Bank")}</option>
                <option value="qris">{t("dashboard.sitesKatalog.methodTypeQris", "QRIS")}</option>
                <option value="ewallet">{t("dashboard.sitesKatalog.methodTypeEwallet", "E-Wallet")}</option>
                <option value="cod">{t("dashboard.sitesKatalog.methodTypeCod", "Bayar di Tempat (COD)")}</option>
              </select>
              <input
                type="text"
                value={method.label ?? ""}
                onChange={(e) => updatePaymentMethod(idx, "label", e.target.value)}
                placeholder={t("dashboard.sitesKatalog.methodLabelPlaceholder", "Nama metode (cth. Transfer Bank BCA)")}
                className="w-full sm:w-48 shrink-0 px-3 py-2 border border-border bg-background text-foreground rounded-xl text-xs outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all"
              />
              <input
                type="text"
                value={method.detail ?? ""}
                onChange={(e) => updatePaymentMethod(idx, "detail", e.target.value)}
                placeholder={t("dashboard.sitesKatalog.methodDetailPlaceholder", "Detail (no. rekening, tautan QRIS, nama e-wallet)")}
                className="w-full flex-1 px-3 py-2 border border-border bg-background text-foreground rounded-xl text-xs outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all"
              />
              <button
                type="button"
                onClick={() => removePaymentMethod(idx)}
                className="self-start sm:self-center p-1.5 rounded-lg border border-border text-muted-foreground hover:text-destructive hover:border-destructive/40 transition-colors cursor-pointer"
                title={t("dashboard.sitesKatalog.methodRemove", "Hapus metode")}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addPaymentMethod}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-dashed border-border text-xs font-semibold text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> {t("dashboard.sitesKatalog.methodAdd", "Tambah Metode")}
          </button>
        </div>

        {/* Shipping note */}
        <div className="space-y-1.5">
          <label className="block text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
            <Truck className="w-3 h-3 inline mr-1 -mt-0.5" />
            {t("dashboard.sitesKatalog.shippingTitle", "Info Pengiriman")}
          </label>
          <textarea
            value={payments.shipping_note ?? ""}
            onChange={(e) => updatePayments({ shipping_note: e.target.value })}
            placeholder={t("dashboard.sitesKatalog.shippingNotePlaceholder", "cth. Ongkir menyesuaikan lokasi. Estimasi 1–3 hari kerja.")}
            rows={2}
            className="w-full px-3 py-2 border border-border bg-background text-foreground rounded-xl text-xs outline-none resize-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/60"
          />
        </div>

        {/* Return policy */}
        <div className="space-y-1.5">
          <label className="block text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
            <RotateCcw className="w-3 h-3 inline mr-1 -mt-0.5" />
            {t("dashboard.sitesKatalog.returnPolicy", "Kebijakan Retur")}
          </label>
          <textarea
            value={payments.return_policy ?? ""}
            onChange={(e) => updatePayments({ return_policy: e.target.value })}
            placeholder={t("dashboard.sitesKatalog.returnPolicyPlaceholder", "cth. Barang dapat dikembalikan/ditukar dalam 7 hari. Hubungi kami lewat WhatsApp.")}
            rows={2}
            className="w-full px-3 py-2 border border-border bg-background text-foreground rounded-xl text-xs outline-none resize-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/60"
          />
        </div>

        <p className="text-[11px] text-muted-foreground leading-relaxed">
          {t("dashboard.sitesKatalog.paymentHint", "Perubahan tersimpan otomatis. Informasi ini hanya ditampilkan sebagai catatan — pembayaran dikonfirmasi manual lewat WhatsApp.")}
        </p>
      </div>

      {/* AI prompt modal */}
      {aiPromptModal && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 animate-in fade-in duration-150"
          onClick={() => { aiPromptModal.resolve(null); setAiPromptModal(null); }}
        >
          <div
            className="w-full max-w-md rounded-3xl border border-border bg-card shadow-2xl p-6 space-y-5 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                <SparkleGenAI className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground leading-tight">{t("dashboard.sitesKatalog.aiModalTitle", "Tulis Deskripsi dengan AI")}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {t("dashboard.sitesKatalog.aiModalDesc", "Instruksi khusus untuk")} <span className="font-bold text-primary">{aiPromptModal.label}</span>
                </p>
              </div>
            </div>
            <input
              autoFocus
              type="text"
              value={aiPromptInput}
              onChange={(e) => setAiPromptInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") { aiPromptModal.resolve(aiPromptInput.trim() || ""); setAiPromptModal(null); }
                if (e.key === "Escape") { aiPromptModal.resolve(null); setAiPromptModal(null); }
              }}
              placeholder={`cth. "Fokus pada bahan premium dan aroma khas yang menggugah selera"`}
              className="w-full px-4 py-3 border border-border bg-muted/40 text-foreground rounded-xl text-xs outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground/60 transition-all"
            />
            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={() => { aiPromptModal.resolve(null); setAiPromptModal(null); }}
                className="flex-1 h-10 rounded-xl border border-border text-muted-foreground text-xs font-semibold hover:bg-muted transition-colors cursor-pointer"
              >
                {t("dashboard.sitesKatalog.cancel", "Batal")}
              </button>
              <button
                type="button"
                onClick={() => { aiPromptModal.resolve(aiPromptInput.trim() || ""); setAiPromptModal(null); }}
                className="flex-1 h-10 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
              >
                <SparkleIcon className="w-3.5 h-3.5" /> {t("dashboard.sitesKatalog.generate", "Generate")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upgrade prompt */}
      {upgradePromptOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
          onClick={() => setUpgradePromptOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-3xl border border-border bg-card shadow-2xl p-6 space-y-4 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-2xl bg-primary/15 text-primary flex items-center justify-center mx-auto">
              <SparkleGenAI className="w-6 h-6" />
            </div>
            <p className="text-base font-bold text-foreground">{t("dashboard.sitesKatalog.upgradeTitle", "Fitur AI — Plan Pro")}</p>
            <p className="text-xs text-muted-foreground leading-relaxed">{t("dashboard.sitesKatalog.upgradeDesc", "Generate deskripsi otomatis dengan AI tersedia tanpa batas di paket Pro.")}</p>
            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setUpgradePromptOpen(false)}
                className="flex-1 h-10 rounded-xl border border-border text-muted-foreground text-xs font-semibold hover:bg-muted transition-colors cursor-pointer"
              >
                {t("dashboard.sitesKatalog.later", "Nanti")}
              </button>
              <Link
                href="/dashboard/upgrade"
                className="flex-1 h-10 rounded-xl bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center hover:bg-primary/90 transition-all cursor-pointer shadow-sm"
              >
                {t("dashboard.sitesKatalog.upgradeNow", "Upgrade Sekarang")}
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
