"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import { useAuthToken } from "@/lib/auth-store";
import { useActiveTenant } from "@/lib/tenant-store";
import { request } from "@/lib/api/client";
import { useToast } from "@/components/toast-provider";
import { SiteSubNav } from "@/components/site-sub-nav";
import FileUpload from "@/components/file-upload";
import { SparkleGenAI } from "@/components/sparkle-icon";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui";
import {
  Loader2, Plus, Trash2, ChevronDown, ChevronUp,
  GripVertical, ChevronLeft, Save, Check, ShoppingBag,
  Utensils,
} from "lucide-react";
import { AI_SUGGESTIONS } from "../editor-utils";

// ─── Emoji groups for description toolbar ────────────────────────────────────
const EMOJI_GROUPS = [
  { name: "Populer & Bisnis", emojis: ["✨", "🔥", "✅", "⭐", "📍", "📦", "💬", "📞", "⏰", "🚀", "💯", "💡", "📢"] },
  { name: "Makanan & Minuman", emojis: ["🍕", "🍔", "🍟", "🌭", "🍳", "🍜", "🍣", "🍱", "🧁", "🎂", "🍎", "☕", "🥤", "🍺"] },
  { name: "Jasa, Belanja & Produk", emojis: ["🛠️", "🧹", "💈", "💇", "💅", "🧼", "🔑", "🚗", "🏠", "🏢", "🏷️", "🎁", "🛍️", "👕", "👟", "👜", "⌚", "💻", "📱"] },
  { name: "Simbol & Panah", emojis: ["✔️", "❌", "➕", "➖", "➜", "➔", "⚡", "✦", "❖", "💚", "❤️", "💙", "👍"] },
];

// ─── Shared input styles ──────────────────────────────────────────────────────
const inputBase =
  "w-full px-3 py-2 border border-white/10 rounded-xl text-[13px] outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/20 bg-white/[0.03] text-slate-100 placeholder-slate-500";
const inputLabel = "text-[10px] uppercase tracking-wide font-bold text-slate-500 block mb-1";

// Strip AI-generated literal null strings
const normStr = (v: any): string => {
  if (v === null || v === undefined) return "";
  return String(v).replace(/\bnull\b/gi, "").replace(/^[,\s]+|[,\s]+$/g, "").trim();
};

// ─── AI description button ────────────────────────────────────────────────────
function AiFieldButton({
  onGenerate, loading, title = "Generate dengan AI", isPremium, onUpgradeRequired,
}: {
  onGenerate: () => Promise<void>;
  loading: boolean;
  title?: string;
  isPremium?: boolean;
  onUpgradeRequired?: () => void;
}) {
  const handleClick = async () => {
    try { await onGenerate(); }
    catch (err: any) {
      if (err?.code === "ERR_PLAN_LIMIT" || err?.code === "ERR_USAGE_LIMIT") onUpgradeRequired?.();
    }
  };
  return (
    <button
      type="button" onClick={handleClick} disabled={loading} title={title}
      className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-md bg-primary/15 text-primary hover:bg-primary/30 transition-all disabled:opacity-40 cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary"
    >
      {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <SparkleGenAI className="w-[18px] h-[18px]" />}
    </button>
  );
}

// ─── MenuCatalogForm ──────────────────────────────────────────────────────────
interface MenuCatalogFormProps {
  sectionKey: "menu" | "catalog";
  sectionTitle: string;
  itemLabel: string;
  hasPrice: boolean;
  hasBadge: boolean;
  data: any;
  updateField: (section: string, key: string, val: any) => void;
  onAiDescription?: (catIdx: number, itemIdx: number, itemName: string, catName: string, imageUrl?: string) => Promise<void>;
  aiLoadingDesc?: string | null;
  isPremium?: boolean;
  onUpgradeRequired?: () => void;
}

function MenuCatalogForm({
  sectionKey, sectionTitle, itemLabel, hasPrice, hasBadge,
  data, updateField, onAiDescription, aiLoadingDesc, isPremium, onUpgradeRequired,
}: MenuCatalogFormProps) {
  const [expandedCat, setExpandedCat] = useState<number | null>(0);
  const [activeEmojiPicker, setActiveEmojiPicker] = useState<{ catIdx: number; itemIdx: number } | null>(null);

  const categories: any[] = data?.categories ?? [];
  const updateCategories = (next: any[]) => updateField(sectionKey, "categories", next);

  const addCategory = () => {
    const next = [...categories, { name: `Kategori ${categories.length + 1}`, items: [] }];
    updateCategories(next);
    setExpandedCat(next.length - 1);
  };

  const removeCategory = (catIdx: number) => {
    updateCategories(categories.filter((_, i) => i !== catIdx));
    setExpandedCat(null);
  };

  const updateCategoryName = (catIdx: number, name: string) => {
    const next = [...categories];
    next[catIdx] = { ...next[catIdx], name };
    updateCategories(next);
  };

  const addItem = (catIdx: number) => {
    const next = [...categories];
    const newItem: any = { name: "", description: "", price: "", image_url: null };
    if (hasBadge) newItem.badge = null;
    next[catIdx] = { ...next[catIdx], items: [...(next[catIdx].items ?? []), newItem] };
    updateCategories(next);
  };

  const removeItem = (catIdx: number, itemIdx: number) => {
    const next = [...categories];
    next[catIdx] = { ...next[catIdx], items: next[catIdx].items.filter((_: any, i: number) => i !== itemIdx) };
    updateCategories(next);
  };

  const updateItem = (catIdx: number, itemIdx: number, field: string, value: any) => {
    const next = [...categories];
    const items = [...(next[catIdx].items ?? [])];
    items[itemIdx] = { ...items[itemIdx], [field]: value };
    next[catIdx] = { ...next[catIdx], items };
    updateCategories(next);
  };

  return (
    <div className="space-y-4">
      {/* Section header fields */}
      <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 to-white/[0.02] p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex-1 space-y-2">
            <label className={inputLabel}>Judul Section</label>
            <input type="text" value={data?.title ?? ""} onChange={(e) => updateField(sectionKey, "title", e.target.value)} placeholder={`cth. ${sectionTitle}`} className={`${inputBase} bg-white/[0.04]`} />
          </div>
          <div className="space-y-2">
            <label className={inputLabel}>Eyebrow <span className="text-slate-500 font-normal normal-case">(opsional)</span></label>
            <input type="text" value={data?.eyebrow ?? ""} onChange={(e) => updateField(sectionKey, "eyebrow", e.target.value)} placeholder={`cth. Pilihan ${sectionTitle}`} className={inputBase} />
          </div>
          <div className="space-y-2">
            <label className={inputLabel}>Subtitle <span className="text-slate-500 font-normal normal-case">(opsional)</span></label>
            <input type="text" value={data?.subtitle ?? ""} onChange={(e) => updateField(sectionKey, "subtitle", e.target.value)} placeholder="cth. Lihat produk pilihan kami" className={inputBase} />
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-[10px] font-semibold text-primary">
            {sectionKey === "menu" ? "Kuliner" : "Produk"} · {categories.length} kategori
          </div>
        </div>
      </div>

      {/* Empty state */}
      {categories.length === 0 && (
        <div className="rounded-2xl border border-dashed border-primary/20 bg-primary/5 p-8 text-center">
          <p className="text-sm font-semibold text-slate-200">Belum ada kategori</p>
          <p className="mt-1 text-xs leading-relaxed text-slate-500">Tambahkan kategori agar {itemLabel} bisa ditampilkan lebih rapi di website.</p>
        </div>
      )}

      {/* Categories */}
      {categories.map((cat: any, catIdx: number) => {
        const itemCount = cat.items?.length ?? 0;
        return (
          <div key={catIdx} className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025]">
            <div className="flex items-center gap-2 bg-gradient-to-r from-white/[0.045] to-white/[0.015] px-3 py-2.5 border-b border-white/10">
              <GripVertical className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
              <input
                type="text" value={cat.name ?? ""} onChange={(e) => updateCategoryName(catIdx, e.target.value)}
                placeholder="Nama kategori"
                className="min-w-0 flex-1 bg-transparent text-sm font-bold text-slate-100 outline-none placeholder-slate-600"
              />
              <span className="text-[10px] text-slate-500 flex-shrink-0">{itemCount} item</span>
              <button type="button" onClick={() => setExpandedCat(expandedCat === catIdx ? null : catIdx)} className="text-slate-500 hover:text-slate-200 p-1 cursor-pointer">
                {expandedCat === catIdx ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
              <button type="button" onClick={() => removeCategory(catIdx)} className="text-red-500/60 hover:text-red-400 p-1 cursor-pointer">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {expandedCat === catIdx && (
              <div className="p-3 space-y-3">
                {(cat.items ?? []).length === 0 && (
                  <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.02] p-4 text-center text-xs text-slate-500">
                    Belum ada {itemLabel}. Klik tombol di bawah untuk menambah.
                  </div>
                )}

                {(cat.items ?? []).map((item: any, itemIdx: number) => (
                  <div key={itemIdx} className="rounded-2xl border border-white/10 bg-white/[0.02] p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] uppercase tracking-wide font-bold text-slate-500">{itemLabel} #{itemIdx + 1}</span>
                      <button type="button" onClick={() => removeItem(catIdx, itemIdx)} className="text-red-500/60 hover:text-red-400 cursor-pointer p-1">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid gap-3 lg:grid-cols-[180px_1fr]">
                      <FileUpload
                        label="Foto" value={item.image_url ?? ""}
                        onChange={(val) => updateItem(catIdx, itemIdx, "image_url", val || null)}
                        placeholder="https://..."
                        maxWidth={800} maxHeight={600} quality={0.8} previewSize="sm"
                      />
                      <div className="space-y-3">
                        <div className="grid gap-3 sm:grid-cols-2">
                          <div>
                            <label className={inputLabel}>Nama</label>
                            <input type="text" value={item.name ?? ""} onChange={(e) => updateItem(catIdx, itemIdx, "name", e.target.value)} placeholder={`Nama ${itemLabel}`} className={inputBase} />
                          </div>
                          {hasPrice && (
                            <div>
                              <label className={inputLabel}>Harga</label>
                              <input type="text" value={item.price ?? ""} onChange={(e) => updateItem(catIdx, itemIdx, "price", e.target.value)} placeholder="cth. Rp 25.000" className={inputBase} />
                            </div>
                          )}
                        </div>
                        {hasBadge && (
                          <div>
                            <label className={inputLabel}>Badge <span className="font-normal normal-case text-slate-500">(isi untuk jadikan item unggulan di showcase)</span></label>
                            <input type="text" value={normStr(item.badge)} onChange={(e) => updateItem(catIdx, itemIdx, "badge", normStr(e.target.value) || null)} placeholder="cth. Best Seller, Baru, Promo, Populer" className={inputBase} />
                          </div>
                        )}
                      </div>

                      {/* Description — full width */}
                      <div className="col-span-full space-y-1.5 mt-1">
                        <div className="flex items-center justify-between">
                          <label className="text-[10px] uppercase tracking-wide font-bold text-slate-500">Deskripsi</label>
                          {onAiDescription && (
                            <AiFieldButton
                              loading={aiLoadingDesc === `${catIdx}_${itemIdx}`}
                              onGenerate={() => onAiDescription(catIdx, itemIdx, item.name || "", cat.name || "", item.image_url || undefined)}
                              title="AI: generate deskripsi" isPremium={isPremium} onUpgradeRequired={onUpgradeRequired}
                            />
                          )}
                        </div>

                        {/* Toolbar */}
                        <div className="flex items-center gap-1.5 bg-white/[0.02] border border-white/10 border-b-0 rounded-t-xl px-2 py-1.5 text-[10px]">
                          <button type="button" onClick={() => { const cur = item.description ?? ""; updateItem(catIdx, itemIdx, "description", cur + (cur ? "\n• " : "• ")); }} className="px-2 py-1 rounded bg-[#1e293b]/60 hover:bg-[#1e293b]/90 text-slate-300 font-semibold cursor-pointer text-[9px] flex items-center gap-1 border border-white/5">
                            <span>•</span> List
                          </button>
                          <button type="button" onClick={() => { const cur = item.description ?? ""; updateItem(catIdx, itemIdx, "description", cur + (cur ? "\n1. " : "1. ")); }} className="px-2 py-1 rounded bg-[#1e293b]/60 hover:bg-[#1e293b]/90 text-slate-300 font-semibold cursor-pointer text-[9px] border border-white/5">
                            1. List
                          </button>
                          <div className="w-px h-3.5 bg-white/10 mx-0.5" />
                          <div className="relative">
                            <button type="button"
                              onClick={() => setActiveEmojiPicker(activeEmojiPicker?.catIdx === catIdx && activeEmojiPicker?.itemIdx === itemIdx ? null : { catIdx, itemIdx })}
                              className={`px-2 py-1 rounded font-semibold cursor-pointer text-[9px] flex items-center gap-1 border ${activeEmojiPicker?.catIdx === catIdx && activeEmojiPicker?.itemIdx === itemIdx ? "bg-primary/20 text-primary border-primary/30" : "bg-[#1e293b]/60 hover:bg-[#1e293b]/90 border-white/5 text-slate-300"}`}
                            >
                              😀 Emoji & Simbol
                            </button>
                            {activeEmojiPicker?.catIdx === catIdx && activeEmojiPicker?.itemIdx === itemIdx && (
                              <div className="absolute left-0 bottom-full mb-1.5 z-[100] w-64 rounded-xl border border-white/10 bg-[#1e293b] p-3 shadow-2xl space-y-3">
                                <div className="flex items-center justify-between border-b border-white/5 pb-1">
                                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Pilih Emoji & Simbol</span>
                                  <button type="button" onClick={() => setActiveEmojiPicker(null)} className="text-slate-500 hover:text-slate-300 text-[10px] font-bold cursor-pointer">Tutup</button>
                                </div>
                                <div className="max-h-48 overflow-y-auto space-y-3 pr-1">
                                  {EMOJI_GROUPS.map((group) => (
                                    <div key={group.name} className="space-y-1">
                                      <div className="text-[9px] font-semibold text-slate-500">{group.name}</div>
                                      <div className="grid grid-cols-7 gap-1">
                                        {group.emojis.map((emoji) => (
                                          <button key={emoji} type="button"
                                            onClick={() => { updateItem(catIdx, itemIdx, "description", (item.description ?? "") + emoji); setActiveEmojiPicker(null); }}
                                            className="text-base hover:scale-125 transition-transform cursor-pointer rounded p-0.5 hover:bg-white/10"
                                          >{emoji}</button>
                                        ))}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        <textarea
                          value={item.description ?? ""} rows={3}
                          onChange={(e) => updateItem(catIdx, itemIdx, "description", e.target.value)}
                          placeholder={`Deskripsi singkat ${itemLabel} ini`}
                          className="w-full px-3 py-2 border border-white/10 rounded-b-xl text-[13px] outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/20 bg-white/[0.03] text-slate-100 placeholder-slate-500 resize-y"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <button type="button" onClick={() => addItem(catIdx)}
                  className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl border border-dashed border-primary/30 text-[12px] font-semibold text-primary hover:bg-primary/10 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Tambah {itemLabel}
                </button>
              </div>
            )}
          </div>
        );
      })}

      {/* Add category button */}
      <button type="button" onClick={addCategory}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-dashed border-primary/25 text-sm font-semibold text-primary hover:bg-primary/10 transition-colors cursor-pointer"
      >
        <Plus className="w-4 h-4" /> Tambah Kategori
      </button>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function KatalogManagerPage() {
  const { id } = useParams();
  const token = useAuthToken();
  const { activeTenantId, activeTenant } = useActiveTenant();
  const { pushToast } = useToast();
  const isPremium = activeTenant?.tenant?.plan === "pro" || activeTenant?.tenant?.plan === "enterprise";

  const siteId = Number(id);
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

      // Prefer catalog; fall back to menu if the site uses menu instead
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
      pushToast(err.message || "Gagal memuat katalog", "error");
    } finally {
      setLoading(false);
    }
  }, [token, activeTenantId, siteId]);

  useEffect(() => { fetchContent(); }, [fetchContent]);

  // Keep ref in sync
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
      pushToast(err.message || "Gagal menyimpan katalog", "error");
    } finally {
      setSaving(false);
    }
  }, [token, activeTenantId, siteId]);

  // Autosave with 2-second debounce
  const scheduleAutosave = useCallback((data: any, key: "catalog" | "menu") => {
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    autosaveTimer.current = setTimeout(() => { void saveContent(data, key); }, 2000);
  }, [saveContent]);

  // updateField mirrors SectionForms updateField signature
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
      setAiPromptModal({ label: `Deskripsi: ${itemName || `Item #${itemIdx + 1}`}`, resolve });
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
        pushToast(err.message || "AI gagal membuat deskripsi", "error");
      }
      throw err;
    } finally {
      setAiLoadingDesc(null);
    }
  }, [token, activeTenantId, siteId, sectionKey, updateField, pushToast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-80">
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
      </div>
    );
  }

  const isMenu = sectionKey === "menu";
  const sectionTitle = isMenu ? "Menu" : "Katalog Produk";
  const itemLabel = isMenu ? "menu" : "produk";
  const SectionIcon = isMenu ? Utensils : ShoppingBag;

  return (
    <div className="space-y-6">
      <SiteSubNav siteId={siteId} />

      {/* Page header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link href={`/dashboard/sites/${siteId}`} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft className="w-4 h-4" /> Web
          </Link>
          <SectionIcon className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-bold">{sectionTitle}</h2>
        </div>

        {/* Save status indicator */}
        <div className="flex items-center gap-2">
          {saving ? (
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Menyimpan...
            </span>
          ) : savedAt ? (
            <span className="flex items-center gap-1.5 text-xs text-emerald-500">
              <Check className="w-3.5 h-3.5" /> Tersimpan
            </span>
          ) : null}
          <button
            type="button"
            onClick={() => { if (autosaveTimer.current) clearTimeout(autosaveTimer.current); void saveContent(sectionDataRef.current, sectionKey); }}
            disabled={saving}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 disabled:opacity-60 transition-colors"
          >
            <Save className="w-3.5 h-3.5" /> Simpan
          </button>
        </div>
      </div>

      {/* Info banner */}
      <Card>
        <CardContent className="py-3">
          <div className="rounded-xl border border-primary/20 bg-primary/10 px-3 py-2.5 text-[12px] leading-relaxed text-primary">
            <p className="font-semibold">{isMenu ? "🍽️" : "🛍️"} Section {sectionTitle}</p>
            <p className="mt-1 text-primary/80">
              Tambah kategori dan {itemLabel} di sini. Setiap {itemLabel} bisa dilengkapi foto, nama, deskripsi{isMenu ? "" : ", harga"}, dan badge.
              Item dengan badge otomatis dijadikan unggulan di tampilan showcase.
              Pengunjung website bisa klik <strong>+ Tambah</strong> untuk pesan via WhatsApp.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Catalog / Menu editor */}
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
      />

      {/* AI prompt modal */}
      {aiPromptModal && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 animate-in fade-in duration-150"
          onClick={() => { aiPromptModal.resolve(null); setAiPromptModal(null); }}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-white/10 bg-[#111318] shadow-2xl p-6 space-y-5 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/15">
                <SparkleGenAI className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-[14px] font-bold text-slate-100 leading-tight">Instruksi AI</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Buat deskripsi untuk <span className="font-semibold text-primary">{aiPromptModal.label}</span>
                </p>
              </div>
            </div>
            <input
              autoFocus type="text" value={aiPromptInput}
              onChange={(e) => setAiPromptInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") { aiPromptModal.resolve(aiPromptInput.trim() || ""); setAiPromptModal(null); }
                if (e.key === "Escape") { aiPromptModal.resolve(null); setAiPromptModal(null); }
              }}
              placeholder={`cth. "fokus manfaat utama dan buat pembaca tertarik"`}
              className="w-full px-4 py-3 border border-white/10 bg-[#05070b] text-slate-100 rounded-xl text-[13px] outline-none focus:border-primary/60 placeholder:text-slate-600"
            />
            <div className="flex gap-2">
              <button type="button" onClick={() => { aiPromptModal.resolve(null); setAiPromptModal(null); }}
                className="flex-1 h-10 rounded-xl border border-white/10 text-slate-400 text-[13px] font-medium hover:bg-white/[0.04] transition-colors"
              >Batal</button>
              <button type="button" onClick={() => { aiPromptModal.resolve(aiPromptInput.trim() || ""); setAiPromptModal(null); }}
                className="flex-1 h-10 rounded-xl bg-primary text-primary-foreground text-[13px] font-bold hover:bg-primary/90 transition-colors"
              >Generate</button>
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
            className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#111318] shadow-2xl p-6 space-y-4 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-[14px] font-semibold text-slate-100">Fitur AI — Plan Pro</p>
            <p className="text-[12px] text-slate-400">Generate deskripsi dengan AI tersedia tanpa batas di paket Pro.</p>
            <div className="flex gap-2">
              <button type="button" onClick={() => setUpgradePromptOpen(false)}
                className="flex-1 h-10 rounded-xl border border-white/10 text-slate-400 text-[13px] hover:bg-white/[0.04] transition-colors"
              >Nanti</button>
              <Link href="/dashboard/upgrade"
                className="flex-1 h-10 rounded-xl bg-primary text-primary-foreground text-[13px] font-bold flex items-center justify-center hover:bg-primary/90 transition-colors"
              >Upgrade ke Pro</Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
