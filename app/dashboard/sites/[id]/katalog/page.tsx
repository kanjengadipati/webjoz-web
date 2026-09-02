"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import { useAuthToken } from "@/lib/auth-store";
import { useActiveTenant } from "@/lib/tenant-store";
import { request } from "@/lib/api/client";
import { useToast } from "@/components/toast-provider";
import { SiteSubNav } from "@/components/site-sub-nav";
import { SparkleGenAI } from "@/components/sparkle-icon";
import Link from "next/link";
import {
  Loader2, ChevronLeft, Save, Check, ShoppingBag,
  Utensils, Sparkles
} from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { decodeSiteId } from "@/lib/sqids";
import { MenuCatalogForm } from "@/components/menu-catalog-form";

export default function KatalogManagerPage() {
  const { id } = useParams();
  const token = useAuthToken();
  const { activeTenantId, activeTenant } = useActiveTenant();
  const { pushToast } = useToast();
  const { t } = useI18n();
  const isPremium = activeTenant?.tenant?.plan === "pro" || activeTenant?.tenant?.plan === "enterprise";

  const siteId = decodeSiteId(id as string);
  const tenantHeaders = { "X-Tenant-ID": activeTenantId?.toString() ?? "" };

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);

  // sectionKey is detected from the site's existing content
  const [sectionKey, setSectionKey] = useState<"catalog" | "menu">("catalog");
  const [sectionData, setSectionData] = useState<any>({});

  // Full content ref so we can PUT the whole content object back
  const fullContentRef = useRef<any>(null);
  const sectionDataRef = useRef<any>({});
  const autosaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

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
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
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
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> {t("dashboard.sitesKatalog.saving", "Menyimpan...")}
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
                <Sparkles className="w-3.5 h-3.5" /> {t("dashboard.sitesKatalog.generate", "Generate")}
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
