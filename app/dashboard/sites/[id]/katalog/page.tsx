"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import { useAuthToken } from "@/lib/auth-store";
import { useActiveTenant } from "@/lib/tenant-store";
import { request } from "@/lib/api/client";
import { useToast } from "@/components/toast-provider";
import { SiteSubNav } from "@/components/site-sub-nav";
import FileUpload, { uploadImageFile } from "@/components/file-upload";
import { SparkleGenAI } from "@/components/sparkle-icon";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui";
import {
  Loader2, Plus, Trash2, ChevronDown, ChevronUp,
  GripVertical, ChevronLeft, Save, Check, ShoppingBag,
  Utensils, X, Link as LinkIcon, Image as ImageIcon,
  FolderOpen, Layers, CheckCircle2, SlidersHorizontal, Sparkles,
  Info
} from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import {
  DndContext, closestCenter, PointerSensor,
  useSensor, useSensors, DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext, useSortable, verticalListSortingStrategy, arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// ─── nanoid (inline) ─────────────────────────────────────────────────────────────
const _NANO_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
function katNanoid(size = 10): string {
  let id = "";
  const bytes = crypto.getRandomValues(new Uint8Array(size));
  for (let i = 0; i < size; i++) id += _NANO_CHARS[bytes[i] % _NANO_CHARS.length];
  return id;
}
function ensureItemId(item: any, idx: number): any {
  if (!item.id) return { ...item, id: katNanoid(), sort_order: item.sort_order ?? idx };
  return item;
}
function ensureCatId(cat: any, idx: number): any {
  const items = (cat.items ?? []).map((it: any, i: number) => ensureItemId(it, i));
  if (!cat.id) return { ...cat, id: katNanoid(), sort_order: cat.sort_order ?? idx, items };
  return { ...cat, items };
}

// ─── Emoji groups for description toolbar ────────────────────────────────────
const EMOJI_GROUPS = [
  { name: "dashboard.sitesKatalog.emojiPopular", emojis: ["✨", "🔥", "✅", "⭐", "📍", "📦", "💬", "📞", "⏰", "🚀", "💯", "💡", "📢"] },
  { name: "dashboard.sitesKatalog.emojiFood", emojis: ["🍕", "🍔", "🍟", "🌭", "🍳", "🍜", "🍣", "🍱", "🧁", "🎂", "🍎", "☕", "🥤", "🍺"] },
  { name: "dashboard.sitesKatalog.emojiServices", emojis: ["🛠️", "🧹", "💈", "💇", "💅", "🧼", "🔑", "🚗", "🏠", "🏢", "🏷️", "🎁", "🛍️", "👕", "👟", "👜", "⌚", "💻", "📱"] },
  { name: "dashboard.sitesKatalog.emojiSymbols", emojis: ["✔️", "❌", "➕", "➖", "➜", "➔", "⚡", "✦", "❖", "💚", "❤️", "💙", "👍"] },
];

// ─── Shared input styles ──────────────────────────────────────────────────────
const inputBase =
  "w-full px-3.5 py-2.5 border border-border/80 rounded-xl text-[13px] outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 bg-muted/40 text-foreground placeholder:text-muted-foreground/60 transition-all";
const inputLabel = "text-[11px] uppercase tracking-wider font-bold text-muted-foreground block mb-1.5";

// Strip AI-generated literal null strings
const normStr = (v: any): string => {
  if (v === null || v === undefined) return "";
  return String(v).replace(/\bnull\b/gi, "").replace(/^[,\s]+|[,\s]+$/g, "").trim();
};

// ─── AI description button ────────────────────────────────────────────────────
function AiFieldButton({
  onGenerate, loading, title, isPremium, onUpgradeRequired,
}: {
  onGenerate: () => Promise<void>;
  loading: boolean;
  title?: string;
  isPremium?: boolean;
  onUpgradeRequired?: () => void;
}) {
  const { t } = useI18n();
  const label = title ?? t("dashboard.sitesKatalog.aiGenerateTitle");
  const handleClick = async () => {
    try { await onGenerate(); }
    catch (err: any) {
      if (err?.code === "ERR_PLAN_LIMIT" || err?.code === "ERR_USAGE_LIMIT") onUpgradeRequired?.();
    }
  };
  return (
    <button
      type="button" onClick={handleClick} disabled={loading} title={label}
      className="flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary/15 text-primary hover:bg-primary/25 border border-primary/20 transition-all disabled:opacity-40 cursor-pointer text-xs font-semibold"
    >
      {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <SparkleGenAI className="w-4 h-4" />}
      <span className="text-[11px] hidden sm:inline">{t("dashboard.sitesKatalog.aiGenerateTitle", "Generate AI")}</span>
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
  const { t } = useI18n();
  const [expandedCat, setExpandedCat] = useState<number | null>(0);
  const [activeEmojiPicker, setActiveEmojiPicker] = useState<{ catIdx: number; itemIdx: number } | null>(null);

  const categories: any[] = data?.categories ?? [];
  const updateCategories = (next: any[]) => updateField(sectionKey, "categories", next);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const addCategory = () => {
    const next = [...categories, { id: katNanoid(), name: t("dashboard.sitesKatalog.defaultCategory", undefined, { number: String(categories.length + 1) }), items: [], sort_order: categories.length }];
    updateCategories(next);
    setExpandedCat(next.length - 1);
  };

  const removeCategory = (catIdx: number) => {
    if (window.confirm(t("dashboard.sitesKatalog.deleteCategoryConfirm", "Hapus kategori ini beserta seluruh isinya?"))) {
      updateCategories(categories.filter((_: any, i: number) => i !== catIdx));
      setExpandedCat(null);
    }
  };

  const updateCategoryName = (catIdx: number, name: string) => {
    const next = [...categories];
    next[catIdx] = { ...next[catIdx], name };
    updateCategories(next);
  };

  const addItem = (catIdx: number) => {
    const next = [...categories];
    const existingItems = next[catIdx].items ?? [];
    const newItem: any = {
      id: katNanoid(),
      name: "", description: "",
      price: "", price_display: "", price_amount: null,
      image_url: null,
      is_available: true,
      sort_order: existingItems.length,
    };
    if (hasBadge) newItem.badge = null;
    if (sectionKey === "menu") { newItem.tags = []; newItem.delivery_platforms = []; }
    else { newItem.capacity = null; newItem.features = []; }
    next[catIdx] = { ...next[catIdx], items: [...existingItems, newItem] };
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

  const handleItemDragEnd = useCallback((catIdx: number, event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const next = [...categories];
    const items = next[catIdx].items ?? [];
    const oldIdx = items.findIndex((i: any) => i.id === active.id);
    const newIdx = items.findIndex((i: any) => i.id === over.id);
    if (oldIdx < 0 || newIdx < 0) return;
    const reordered = arrayMove(items, oldIdx, newIdx).map((it: any, i: number) => ({ ...it, sort_order: i }));
    next[catIdx] = { ...next[catIdx], items: reordered };
    updateCategories(next);
  }, [categories, updateCategories]);

  const handleCatDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIdx = categories.findIndex((c: any) => c.id === active.id);
    const newIdx = categories.findIndex((c: any) => c.id === over.id);
    if (oldIdx < 0 || newIdx < 0) return;
    const reordered = arrayMove(categories, oldIdx, newIdx).map((c: any, i: number) => ({ ...c, sort_order: i }));
    updateCategories(reordered);
    setExpandedCat((prev) => {
      if (prev === null) return null;
      if (prev === oldIdx) return newIdx;
      return prev;
    });
  }, [categories, updateCategories]);

  return (
    <div className="space-y-6">
      {/* Section Settings Card */}
      <div className="rounded-3xl border border-border/80 bg-card p-5 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between gap-3 pb-4 border-b border-border/60 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">{t("dashboard.sitesKatalog.labelSectionTitle", "Pengaturan Tampilan Bagian")}</h3>
              <p className="text-xs text-muted-foreground">{t("dashboard.sitesKatalog.variantsSubtitle", "Atur judul, subjudul, dan teks pengantar katalog di website")}</p>
            </div>
          </div>
          <div className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            {sectionKey === "menu" ? t("dashboard.sitesKatalog.chipMenu", "Menu") : t("dashboard.sitesKatalog.chipCatalog", "Katalog")} · {t("dashboard.sitesKatalog.chipCategoryCount", undefined, { count: String(categories.length) })}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-1.5">
            <label className={inputLabel}>{t("dashboard.sitesKatalog.labelSectionTitle", "Judul Bagian")}</label>
            <input
              type="text"
              value={data?.title ?? ""}
              onChange={(e) => updateField(sectionKey, "title", e.target.value)}
              placeholder={`cth. ${sectionTitle}`}
              className={inputBase}
            />
          </div>
          <div className="space-y-1.5">
            <label className={inputLabel}>
              {t("dashboard.sitesKatalog.labelEyebrow", "Eyebrow")} <span className="text-muted-foreground font-normal normal-case">({t("dashboard.sitesKatalog.optional", "Opsional")})</span>
            </label>
            <input
              type="text"
              value={data?.eyebrow ?? ""}
              onChange={(e) => updateField(sectionKey, "eyebrow", e.target.value)}
              placeholder={`cth. PILIHAN ${sectionTitle.toUpperCase()}`}
              className={inputBase}
            />
          </div>
          <div className="space-y-1.5">
            <label className={inputLabel}>
              {t("dashboard.sitesKatalog.labelSubtitle", "Subjudul")} <span className="text-muted-foreground font-normal normal-case">({t("dashboard.sitesKatalog.optional", "Opsional")})</span>
            </label>
            <input
              type="text"
              value={data?.subtitle ?? ""}
              onChange={(e) => updateField(sectionKey, "subtitle", e.target.value)}
              placeholder="cth. Temukan produk dan layanan terbaik untuk Anda"
              className={inputBase}
            />
          </div>
        </div>
      </div>

      {/* Empty state */}
      {categories.length === 0 && (
        <div className="rounded-3xl border border-dashed border-primary/30 bg-primary/5 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
            <FolderOpen className="w-6 h-6" />
          </div>
          <p className="text-base font-bold text-foreground">{t("dashboard.sitesKatalog.noCategoriesTitle", "Belum ada kategori produk")}</p>
          <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
            {t("dashboard.sitesKatalog.noCategoriesDesc", undefined, { itemLabel })}
          </p>
          <button
            type="button"
            onClick={addCategory}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-all cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4" /> {t("dashboard.sitesKatalog.addCategory", "+ Tambah Kategori")}
          </button>
        </div>
      )}

      {/* Categories — DnD sortable */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleCatDragEnd}>
        <SortableContext items={categories.map((c: any) => c.id ?? c.name)} strategy={verticalListSortingStrategy}>
          <div className="space-y-4">
            {categories.map((cat: any, catIdx: number) => {
              const enriched = ensureCatId(cat, catIdx);
              return (
                <KatSortableCategoryRow
                  key={enriched.id}
                  catId={enriched.id}
                  cat={enriched}
                  catIdx={catIdx}
                  itemCount={enriched.items?.length ?? 0}
                  expandedCat={expandedCat}
                  setExpandedCat={setExpandedCat}
                  removeCategory={removeCategory}
                  updateCategoryName={updateCategoryName}
                  items={enriched.items ?? []}
                  itemLabel={itemLabel}
                  sectionKey={sectionKey}
                  hasPrice={hasPrice}
                  hasBadge={hasBadge}
                  updateItem={updateItem}
                  removeItem={removeItem}
                  addItem={addItem}
                  onAiDescription={onAiDescription}
                  aiLoadingDesc={aiLoadingDesc ?? null}
                  isPremium={isPremium}
                  onUpgradeRequired={onUpgradeRequired}
                  activeEmojiPicker={activeEmojiPicker}
                  setActiveEmojiPicker={setActiveEmojiPicker}
                  sensors={sensors}
                  handleItemDragEnd={handleItemDragEnd}
                  t={t}
                  inputBase={inputBase}
                  inputLabel={inputLabel}
                  EMOJI_GROUPS={EMOJI_GROUPS}
                  normStr={normStr}
                />
              );
            })}
          </div>
        </SortableContext>
      </DndContext>

      {categories.length > 0 && (
        <button
          type="button"
          onClick={addCategory}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl border-2 border-dashed border-primary/30 text-sm font-bold text-primary hover:bg-primary/5 hover:border-primary/60 transition-all cursor-pointer active:scale-[0.99]"
        >
          <Plus className="w-4 h-4" /> {t("dashboard.sitesKatalog.addCategory", "+ Tambah Kategori")}
        </button>
      )}
    </div>
  );
}

// ─── Sortable Category Row ────────────────────────────────────────────────────
function KatSortableCategoryRow({
  catId, cat, catIdx, itemCount, expandedCat, setExpandedCat,
  removeCategory, updateCategoryName,
  items, itemLabel, sectionKey, hasPrice, hasBadge,
  updateItem, removeItem, addItem,
  onAiDescription, aiLoadingDesc, isPremium, onUpgradeRequired,
  activeEmojiPicker, setActiveEmojiPicker,
  sensors, handleItemDragEnd, t, inputBase, inputLabel, EMOJI_GROUPS, normStr,
}: any) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: catId });
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const isExpanded = expandedCat === catIdx;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`overflow-hidden rounded-3xl border transition-all duration-200 ${
        isExpanded ? "border-primary/40 bg-card shadow-md ring-1 ring-primary/20" : "border-border bg-card hover:border-border/80"
      }`}
    >
      {/* Category Header Bar */}
      <div className="flex items-center gap-3 px-4 py-3.5 bg-muted/20 border-b border-border/60">
        <button
          type="button"
          className="cursor-grab active:cursor-grabbing touch-none text-muted-foreground/60 hover:text-foreground p-1 rounded-lg hover:bg-muted transition-colors"
          aria-label={t("dashboard.sitesKatalog.dragCategory", "Geser urutan kategori")}
          {...attributes} {...listeners}
        >
          <GripVertical className="w-4 h-4" />
        </button>

        <div className="flex-1 min-w-0 flex items-center gap-3">
          <input
            type="text"
            value={cat.name ?? ""}
            onChange={(e) => updateCategoryName(catIdx, e.target.value)}
            placeholder={t("dashboard.sitesKatalog.categoryPlaceholder", "Nama Kategori")}
            className="w-full bg-transparent text-sm sm:text-base font-bold text-foreground outline-none placeholder:text-muted-foreground/50 focus:text-primary transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] font-semibold text-muted-foreground bg-muted/60 px-2.5 py-0.5 rounded-full border border-border/50">
            {t("dashboard.sitesKatalog.itemCountLabel", undefined, { count: String(itemCount) })}
          </span>

          <button
            type="button"
            onClick={() => setExpandedCat(isExpanded ? null : catIdx)}
            className="flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground p-1.5 rounded-lg hover:bg-muted transition-colors cursor-pointer"
            title={isExpanded ? "Tutup Kategori" : "Buka Kategori"}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={() => removeCategory(catIdx)}
            className="text-red-500/70 hover:text-red-500 hover:bg-red-500/10 p-1.5 rounded-lg transition-colors cursor-pointer"
            title={t("dashboard.sitesKatalog.deleteCategory", "Hapus Kategori")}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Category Content Area */}
      {isExpanded && (
        <div className="p-4 sm:p-6 space-y-4">
          {items.length === 0 && (
            <div className="rounded-2xl border border-dashed border-border bg-muted/20 p-8 text-center space-y-2">
              <p className="text-xs text-muted-foreground">
                {t("dashboard.sitesKatalog.noItemsDesc", undefined, { itemLabel })}
              </p>
              <button
                type="button"
                onClick={() => addItem(catIdx)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary text-xs font-bold transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> {t("dashboard.sitesKatalog.addItemLabel", undefined, { label: itemLabel, category: cat.name || "" })}
              </button>
            </div>
          )}

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(ev: DragEndEvent) => handleItemDragEnd(catIdx, ev)}>
            <SortableContext items={items.map((i: any) => i.id ?? i.name)} strategy={verticalListSortingStrategy}>
              <div className="space-y-4">
                {items.map((item: any, itemIdx: number) => (
                  <KatSortableItemRow
                    key={item.id ?? itemIdx}
                    item={item}
                    itemIdx={itemIdx}
                    catIdx={catIdx}
                    catName={cat.name}
                    itemLabel={itemLabel}
                    sectionKey={sectionKey}
                    hasPrice={hasPrice}
                    hasBadge={hasBadge}
                    updateItem={updateItem}
                    removeItem={removeItem}
                    onAiDescription={onAiDescription}
                    aiLoadingDesc={aiLoadingDesc}
                    isPremium={isPremium}
                    onUpgradeRequired={onUpgradeRequired}
                    activeEmojiPicker={activeEmojiPicker}
                    setActiveEmojiPicker={setActiveEmojiPicker}
                    t={t}
                    inputBase={inputBase}
                    inputLabel={inputLabel}
                    EMOJI_GROUPS={EMOJI_GROUPS}
                    normStr={normStr}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          {items.length > 0 && (
            <button
              type="button"
              onClick={() => addItem(catIdx)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-dashed border-primary/30 text-xs font-bold text-primary hover:bg-primary/10 transition-colors cursor-pointer active:scale-[0.99]"
            >
              <Plus className="w-4 h-4" /> {t("dashboard.sitesKatalog.addItemLabel", undefined, { label: itemLabel, category: cat.name || "" })}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Sortable Item Row ────────────────────────────────────────────────────────
function KatSortableItemRow({
  item, itemIdx, catIdx, catName, itemLabel, sectionKey, hasPrice, hasBadge,
  updateItem, removeItem, onAiDescription, aiLoadingDesc, isPremium, onUpgradeRequired,
  activeEmojiPicker, setActiveEmojiPicker, t, inputBase, inputLabel, EMOJI_GROUPS, normStr,
}: any) {
  const itemSortId = item.id ?? item.name ?? String(itemIdx);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: itemSortId });
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const isAvailable = item.is_available !== false;
  const tags: string[] = item.tags ?? [];
  const deliveryPlatforms: { name: string; url: string }[] = item.delivery_platforms ?? [];

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="rounded-2xl border border-border/80 bg-background/80 hover:border-border transition-all p-4 sm:p-5 shadow-xs space-y-4"
    >
      {/* Item Top Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-border/50">
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            type="button"
            className="cursor-grab active:cursor-grabbing touch-none text-muted-foreground/60 hover:text-foreground p-1 rounded hover:bg-muted transition-colors"
            aria-label={t("dashboard.sitesKatalog.dragItem", "Geser item")}
            {...attributes} {...listeners}
          >
            <GripVertical className="w-3.5 h-3.5" />
          </button>
          <span className="text-[11px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded-md">
            #{itemIdx + 1}
          </span>
          <span className="text-xs font-bold text-foreground truncate max-w-[200px] sm:max-w-xs">
            {item.name || <span className="text-muted-foreground italic font-normal">{t("dashboard.sitesKatalog.itemFallback", undefined, { number: String(itemIdx + 1) })}</span>}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* is_available switch pill */}
          <button
            type="button"
            onClick={() => updateItem(catIdx, itemIdx, "is_available", !isAvailable)}
            className={`flex items-center gap-1 text-[10px] font-bold tracking-wide px-3 py-1 rounded-full border transition-all cursor-pointer ${
              isAvailable
                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                : "border-red-500/40 bg-red-500/10 text-red-400 hover:bg-red-500/20"
            }`}
            title={isAvailable ? t("dashboard.sitesKatalog.markOutOfStock", "Tandai Habis") : t("dashboard.sitesKatalog.markAvailable", "Tandai Tersedia")}
          >
            {isAvailable ? (
              <>
                <CheckCircle2 className="w-3 h-3" />
                <span>{t("dashboard.sitesKatalog.available", "Tersedia")}</span>
              </>
            ) : (
              <>
                <X className="w-3 h-3" />
                <span>{t("dashboard.sitesKatalog.outOfStock", "Habis")}</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => removeItem(catIdx, itemIdx)}
            className="text-red-500/60 hover:text-red-500 hover:bg-red-500/10 p-1.5 rounded-lg transition-colors cursor-pointer"
            title={t("dashboard.sitesKatalog.deleteItem", "Hapus Item")}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Item Body Grid: Photo on Left, Details on Right */}
      <div className="grid gap-5 lg:grid-cols-[220px_1fr]">
        <KatItemPhotoGalleryEditor
          label={t("dashboard.sitesKatalog.photoPrimary", "Foto Utama")}
          imageUrl={item.image_url ?? ""}
          imageUrls={item.image_urls ?? []}
          onUpdatePrimary={(val) => updateItem(catIdx, itemIdx, "image_url", val || null)}
          onUpdateGallery={(urls) => updateItem(catIdx, itemIdx, "image_urls", urls.length > 0 ? urls : null)}
          t={t}
        />

        <div className="space-y-4 min-w-0">
          {/* Name & Price */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label className={inputLabel}>{t("dashboard.sitesKatalog.labelName", "Nama Produk")}</label>
              <input
                type="text"
                value={item.name ?? ""}
                onChange={(e) => updateItem(catIdx, itemIdx, "name", e.target.value)}
                placeholder={`cth. ${itemLabel === "menu" ? "Nasi Goreng Spesial" : "Paket Layanan Pro"}`}
                className={inputBase}
              />
            </div>

            {hasPrice && (
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className={inputLabel}>{t("dashboard.sitesKatalog.priceDisplay", "Tampilan Harga")}</label>
                  <input
                    type="text"
                    value={item.price_display ?? item.price ?? ""}
                    onChange={(e) => {
                      updateItem(catIdx, itemIdx, "price_display", e.target.value);
                      updateItem(catIdx, itemIdx, "price", e.target.value);
                    }}
                    placeholder={t("dashboard.sitesKatalog.priceDisplayPlaceholder", "cth. Rp 25.000")}
                    className={inputBase}
                  />
                </div>
                <div className="space-y-1">
                  <label className={inputLabel} title={t("dashboard.sitesKatalog.priceAmountHelp", "Untuk kalkulasi keranjang")}>
                    {t("dashboard.sitesKatalog.priceAmount", "Nominal (Angka)")}
                  </label>
                  <input
                    type="number"
                    min={0}
                    step="any"
                    value={item.price_amount ?? ""}
                    onChange={(e) => updateItem(catIdx, itemIdx, "price_amount", e.target.value === "" ? null : Number(e.target.value))}
                    placeholder={t("dashboard.sitesKatalog.priceAmountPlaceholder", "cth. 25000")}
                    className={`${inputBase} [appearance:textfield]`}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Badge & Capacity/Tags Row */}
          <div className="grid gap-4 sm:grid-cols-2">
            {hasBadge && (
              <div className="space-y-1">
                <label className={inputLabel}>{t("dashboard.sitesKatalog.labelBadge", "Badge / Label Khusus")}</label>
                <input
                  type="text"
                  value={normStr(item.badge)}
                  onChange={(e) => updateItem(catIdx, itemIdx, "badge", normStr(e.target.value) || null)}
                  placeholder={t("dashboard.sitesKatalog.badgePlaceholder", "cth. Terlaris, Best Seller, Baru")}
                  className={inputBase}
                />
              </div>
            )}

            {sectionKey === "catalog" && (
              <div className="space-y-1">
                <label className={inputLabel}>{t("dashboard.sitesKatalog.labelCapacity", "Kapasitas / Satuan")}</label>
                <input
                  type="text"
                  value={item.capacity ?? ""}
                  onChange={(e) => updateItem(catIdx, itemIdx, "capacity", e.target.value || null)}
                  placeholder={t("dashboard.sitesKatalog.capacityPlaceholder", "cth. 2 orang, 4 pax, 1 set")}
                  className={inputBase}
                />
              </div>
            )}
          </div>

          {/* Features / Amenities (catalog only) */}
          {sectionKey === "catalog" && (
            <div className="space-y-1.5">
              <label className={inputLabel}>{t("dashboard.sitesKatalog.labelFeatures", "Fasilitas & Keunggulan")}</label>
              <div className="flex flex-wrap gap-1.5 min-h-[30px] p-2 rounded-xl bg-muted/20 border border-border/60">
                {(item.features ?? []).map((f: string, fi: number) => (
                  <span key={fi} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-primary/15 text-primary border border-primary/25">
                    {f}
                    <button
                      type="button"
                      onClick={() => updateItem(catIdx, itemIdx, "features", (item.features ?? []).filter((_: string, i: number) => i !== fi))}
                      className="hover:text-red-400 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  placeholder={t("dashboard.sitesKatalog.featuresPlaceholder", "Ketik fasilitas lalu Enter (cth: WiFi, AC, Breakfast)")}
                  className="bg-transparent text-xs text-foreground placeholder:text-muted-foreground/60 outline-none flex-1 min-w-[180px]"
                  onKeyDown={(e) => {
                    if ((e.key === "Enter" || e.key === ",") && e.currentTarget.value.trim()) {
                      e.preventDefault();
                      const next = [...(item.features ?? []), e.currentTarget.value.trim()];
                      updateItem(catIdx, itemIdx, "features", next);
                      e.currentTarget.value = "";
                    }
                  }}
                />
              </div>
            </div>
          )}

          {/* Tags & Delivery Platforms (menu only) */}
          {sectionKey === "menu" && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className={inputLabel}>Tags Menu</label>
                <div className="flex flex-wrap gap-1.5 min-h-[30px] p-2 rounded-xl bg-muted/20 border border-border/60">
                  {tags.map((tag: string, ti: number) => (
                    <span key={ti} className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[11px] font-semibold bg-primary/15 text-primary border border-primary/20">
                      {tag}
                      <button
                        type="button"
                        onClick={() => updateItem(catIdx, itemIdx, "tags", tags.filter((_: string, i: number) => i !== ti))}
                        className="hover:text-red-400 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    placeholder={t("dashboard.sitesKatalog.tagsPlaceholder", "Ketik tag lalu Enter")}
                    className="bg-transparent text-xs text-foreground placeholder:text-muted-foreground/60 outline-none flex-1 min-w-[120px]"
                    onKeyDown={(e) => {
                      if ((e.key === "Enter" || e.key === ",") && e.currentTarget.value.trim()) {
                        e.preventDefault();
                        const newTag = e.currentTarget.value.trim().replace(/,$/, "");
                        if (newTag && !tags.includes(newTag)) updateItem(catIdx, itemIdx, "tags", [...tags, newTag]);
                        e.currentTarget.value = "";
                      }
                    }}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className={inputLabel}>{t("dashboard.sitesKatalog.deliveryPlatforms", "Platform Delivery Online")}</label>
                <div className="space-y-2">
                  {deliveryPlatforms.map((dp: { name: string; url: string }, di: number) => (
                    <div key={di} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={dp.name}
                        onChange={(e) => {
                          const n = [...deliveryPlatforms];
                          n[di] = { ...n[di], name: e.target.value };
                          updateItem(catIdx, itemIdx, "delivery_platforms", n);
                        }}
                        placeholder="GrabFood"
                        className={`${inputBase} py-1.5 text-xs flex-1`}
                      />
                      <input
                        type="url"
                        value={dp.url}
                        onChange={(e) => {
                          const n = [...deliveryPlatforms];
                          n[di] = { ...n[di], url: e.target.value };
                          updateItem(catIdx, itemIdx, "delivery_platforms", n);
                        }}
                        placeholder="https://..."
                        className={`${inputBase} py-1.5 text-xs flex-1`}
                      />
                      <button
                        type="button"
                        onClick={() => updateItem(catIdx, itemIdx, "delivery_platforms", deliveryPlatforms.filter((_: any, i: number) => i !== di))}
                        className="text-red-500/60 hover:text-red-500 p-1 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => updateItem(catIdx, itemIdx, "delivery_platforms", [...deliveryPlatforms, { name: "", url: "" }])}
                    className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline cursor-pointer pt-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> {t("dashboard.sitesKatalog.addDeliveryPlatform", "+ Tambah Platform")}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Full-Width Description Box with Rich Toolbar */}
        <div className="col-span-full space-y-2 pt-2 border-t border-border/50">
          <div className="flex items-center justify-between">
            <label className={inputLabel}>{t("dashboard.sitesKatalog.labelDescription", "Deskripsi Produk")}</label>
            {onAiDescription && (
              <AiFieldButton
                loading={aiLoadingDesc === `${catIdx}_${itemIdx}`}
                onGenerate={() => onAiDescription(catIdx, itemIdx, item.name || "", catName || "", item.image_url || undefined)}
                title={t("dashboard.sitesKatalog.aiGenerateDesc")}
                isPremium={isPremium}
                onUpgradeRequired={onUpgradeRequired}
              />
            )}
          </div>

          {/* Description Toolbar */}
          <div className="flex items-center gap-1.5 bg-muted/40 border border-border border-b-0 rounded-t-xl px-3 py-2 text-xs">
            <button
              type="button"
              onClick={() => {
                const cur = item.description ?? "";
                updateItem(catIdx, itemIdx, "description", cur + (cur ? "\n• " : "• "));
              }}
              className="px-2.5 py-1 rounded-lg bg-background hover:bg-muted text-muted-foreground hover:text-foreground font-semibold cursor-pointer text-xs flex items-center gap-1 border border-border/60 transition-colors shadow-2xs"
            >
              <span>•</span> {t("dashboard.sitesKatalog.bulletList", "Bullet List")}
            </button>
            <button
              type="button"
              onClick={() => {
                const cur = item.description ?? "";
                updateItem(catIdx, itemIdx, "description", cur + (cur ? "\n1. " : "1. "));
              }}
              className="px-2.5 py-1 rounded-lg bg-background hover:bg-muted text-muted-foreground hover:text-foreground font-semibold cursor-pointer text-xs border border-border/60 transition-colors shadow-2xs"
            >
              1. {t("dashboard.sitesKatalog.numberedList", "Numbered List")}
            </button>

            <div className="w-px h-4 bg-border mx-1" />

            <div className="relative">
              <button
                type="button"
                onClick={() => setActiveEmojiPicker(activeEmojiPicker?.catIdx === catIdx && activeEmojiPicker?.itemIdx === itemIdx ? null : { catIdx, itemIdx })}
                className={`px-2.5 py-1 rounded-lg font-semibold cursor-pointer text-xs flex items-center gap-1 border transition-colors shadow-2xs ${
                  activeEmojiPicker?.catIdx === catIdx && activeEmojiPicker?.itemIdx === itemIdx
                    ? "bg-primary/20 text-primary border-primary/40"
                    : "bg-background hover:bg-muted border-border/60 text-muted-foreground hover:text-foreground"
                }`}
              >
                😀 {t("dashboard.sitesKatalog.emojiSymbol", "Emoji")}
              </button>

              {activeEmojiPicker?.catIdx === catIdx && activeEmojiPicker?.itemIdx === itemIdx && (
                <div className="absolute left-0 bottom-full mb-2 z-[100] w-72 rounded-2xl border border-border bg-card p-3.5 shadow-2xl space-y-3 animate-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between border-b border-border pb-2">
                    <span className="text-[11px] font-bold text-foreground uppercase tracking-wide">{t("dashboard.sitesKatalog.pickEmojiTitle", "Pilih Emoji")}</span>
                    <button
                      type="button"
                      onClick={() => setActiveEmojiPicker(null)}
                      className="text-muted-foreground hover:text-foreground text-xs font-bold cursor-pointer"
                    >
                      {t("dashboard.sitesKatalog.close", "Tutup")}
                    </button>
                  </div>
                  <div className="max-h-52 overflow-y-auto space-y-3 pr-1">
                    {EMOJI_GROUPS.map((group: any) => (
                      <div key={group.name} className="space-y-1">
                        <div className="text-[10px] font-bold text-muted-foreground">{t(group.name)}</div>
                        <div className="grid grid-cols-7 gap-1">
                          {group.emojis.map((emoji: string) => (
                            <button
                              key={emoji}
                              type="button"
                              onClick={() => {
                                updateItem(catIdx, itemIdx, "description", (item.description ?? "") + emoji);
                                setActiveEmojiPicker(null);
                              }}
                              className="text-lg hover:scale-125 transition-transform cursor-pointer rounded-lg p-1 hover:bg-muted flex items-center justify-center"
                            >
                              {emoji}
                            </button>
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
            value={item.description ?? ""}
            rows={3}
            onChange={(e) => updateItem(catIdx, itemIdx, "description", e.target.value)}
            placeholder={`Jelaskan keunggulan dan spesifikasi ${itemLabel} ini secara menarik...`}
            className="w-full px-3.5 py-2.5 border border-border rounded-b-xl text-[13px] outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 bg-muted/40 text-foreground placeholder:text-muted-foreground/60 resize-y transition-all"
          />
        </div>

        {/* Variant / Option Groups */}
        <KatVariantGroupEditor
          groups={item.variant_groups ?? []}
          onChange={(groups) => updateItem(catIdx, itemIdx, "variant_groups", groups.length ? groups : null)}
          t={t}
          inputBase={inputBase}
        />
      </div>
    </div>
  );
}

// ─── KatVariantGroupEditor ──────────────────────────────────────────────────────
interface KVGGroup { id: string; name: string; type: "single" | "multiple"; required: boolean; options: KVGOption[]; }
interface KVGOption { id: string; name: string; price_delta?: number | null; price_display?: string | null; }

function makeKVGroup(): KVGGroup {
  return { id: katNanoid(), name: "", type: "single", required: false, options: [{ id: katNanoid(), name: "", price_delta: null, price_display: null }] };
}

function KatVariantGroupEditor({ groups, onChange, t, inputBase }: { groups: KVGGroup[]; onChange: (groups: KVGGroup[]) => void; t: any; inputBase: string }) {
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);

  function updateGroup(gid: string, patch: Partial<KVGGroup>) {
    onChange(groups.map((g) => (g.id === gid ? { ...g, ...patch } : g)));
  }
  function removeGroup(gid: string) { onChange(groups.filter((g) => g.id !== gid)); }
  function addOption(gid: string) {
    const g = groups.find((g) => g.id === gid); if (!g) return;
    updateGroup(gid, { options: [...g.options, { id: katNanoid(), name: "", price_delta: null, price_display: null }] });
  }
  function updateOption(gid: string, oid: string, patch: Partial<KVGOption>) {
    const g = groups.find((g) => g.id === gid); if (!g) return;
    updateGroup(gid, { options: g.options.map((o) => (o.id === oid ? { ...o, ...patch } : o)) });
  }
  function removeOption(gid: string, oid: string) {
    const g = groups.find((g) => g.id === gid); if (!g) return;
    updateGroup(gid, { options: g.options.filter((o) => o.id !== oid) });
  }

  return (
    <div className="col-span-full pt-3 border-t border-border/50 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <label className={inputLabel}>{t("dashboard.sitesKatalog.variantsTitle", "Varian & Opsi Tambahan")}</label>
          <p className="text-[11px] text-muted-foreground">
            {t("dashboard.sitesKatalog.variantsSubtitle", "Kustomisasi pilihan produk seperti Ukuran, Topping, Tingkat Manis, atau Opsi Tambahan.")}
          </p>
        </div>
        <button
          type="button"
          onClick={() => { const g = makeKVGroup(); onChange([...groups, g]); setExpandedGroup(g.id); }}
          className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-xl bg-primary/15 text-primary hover:bg-primary/25 border border-primary/20 transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" /> {t("dashboard.sitesKatalog.variantsAddGroup", "+ Tambah Grup Varian")}
        </button>
      </div>

      {groups.length === 0 && (
        <p className="text-xs text-muted-foreground/80 italic p-3 rounded-xl bg-muted/20 border border-border/40">
          {t("dashboard.sitesKatalog.variantsNoGroups", "Belum ada varian atau add-on untuk produk ini.")}
        </p>
      )}

      <div className="space-y-3">
        {groups.map((group) => {
          const isOpen = expandedGroup === group.id;
          return (
            <div key={group.id} className="rounded-2xl border border-border/80 bg-muted/20 overflow-hidden">
              <div
                className="flex items-center gap-3 px-4 py-3 cursor-pointer select-none bg-muted/30 hover:bg-muted/50 transition-colors"
                onClick={() => setExpandedGroup(isOpen ? null : group.id)}
              >
                <Layers className="w-4 h-4 text-primary shrink-0" />
                <span className="flex-1 text-xs sm:text-sm font-bold text-foreground truncate">
                  {group.name || <span className="text-muted-foreground italic font-normal">{t("dashboard.sitesKatalog.variantsGroupNamePlaceholder", "Grup Varian Baru")}</span>}
                </span>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded-md border border-border/50">
                    {group.type === "multiple" ? t("dashboard.sitesKatalog.variantsTypeMultiple", "Bisa Pilih Banyak") : t("dashboard.sitesKatalog.variantsTypeSingle", "Pilih 1")}
                  </span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); removeGroup(group.id); }}
                    className="text-red-500/60 hover:text-red-500 p-1 rounded hover:bg-red-500/10 cursor-pointer"
                    aria-label="Hapus grup"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {isOpen && (
                <div className="p-4 space-y-4 border-t border-border/60 bg-card">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-1">
                      <label className={inputLabel}>{t("dashboard.sitesKatalog.variantsGroupName", "Nama Grup Varian")}</label>
                      <input
                        type="text"
                        value={group.name}
                        onChange={(e) => updateGroup(group.id, { name: e.target.value })}
                        placeholder={t("dashboard.sitesKatalog.variantsGroupNamePlaceholder", "cth. Ukuran Porsi, Topping Ekstra")}
                        className={inputBase}
                      />
                    </div>

                    <div className="flex items-center gap-4 pt-6">
                      <label className="flex items-center gap-2 text-xs font-semibold text-foreground cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={group.type === "multiple"}
                          onChange={(e) => updateGroup(group.id, { type: e.target.checked ? "multiple" : "single" })}
                          className="w-4 h-4 accent-primary rounded cursor-pointer"
                        />
                        {t("dashboard.sitesKatalog.variantsTypeMultiple", "Pilih Banyak (Checkbox)")}
                      </label>
                      <label className="flex items-center gap-2 text-xs font-semibold text-foreground cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={group.required}
                          onChange={(e) => updateGroup(group.id, { required: e.target.checked })}
                          className="w-4 h-4 accent-primary rounded cursor-pointer"
                        />
                        {t("dashboard.sitesKatalog.variantsRequired", "Wajib Dipilih")}
                      </label>
                    </div>
                  </div>

                  {/* Options List */}
                  <div className="space-y-2 pt-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
                      {t("dashboard.sitesKatalog.variantsOptionsTitle", "Daftar Pilihan / Opsi")}
                    </span>

                    <div className="space-y-2">
                      {group.options.map((opt) => (
                        <div key={opt.id} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={opt.name}
                            onChange={(e) => updateOption(group.id, opt.id, { name: e.target.value })}
                            placeholder={t("dashboard.sitesKatalog.variantsOptionNamePlaceholder", "cth. Regular, Large, Ekstra Keju")}
                            className={`${inputBase} py-2 flex-1 text-xs`}
                          />
                          <input
                            type="number"
                            value={opt.price_delta ?? ""}
                            onChange={(e) => {
                              const delta = e.target.value === "" ? null : Number(e.target.value);
                              const display = delta != null && delta !== 0 ? (delta > 0 ? `+${delta.toLocaleString()}` : `${delta.toLocaleString()}`) : null;
                              updateOption(group.id, opt.id, { price_delta: delta, price_display: display });
                            }}
                            placeholder="+Rp"
                            title={t("dashboard.sitesKatalog.variantsOptionDelta", "Tambahan Harga")}
                            className={`${inputBase} py-2 w-28 shrink-0 text-xs`}
                          />
                          <button
                            type="button"
                            onClick={() => removeOption(group.id, opt.id)}
                            disabled={group.options.length <= 1}
                            className="text-red-500/60 hover:text-red-500 disabled:opacity-30 cursor-pointer p-1.5 rounded hover:bg-red-500/10 transition-colors shrink-0"
                            aria-label="Hapus opsi"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => addOption(group.id)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline cursor-pointer pt-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> {t("dashboard.sitesKatalog.variantsAddOption", "+ Tambah Pilihan")}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── KatItemPhotoGalleryEditor ──────────────────────────────────────────────────
function KatItemPhotoGalleryEditor({
  label, imageUrl, imageUrls, onUpdatePrimary, onUpdateGallery, t,
}: {
  label: string; imageUrl: string; imageUrls: string[]; onUpdatePrimary: (url: string) => void; onUpdateGallery: (urls: string[]) => void; t: any;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const extraImages = imageUrls.filter((u) => u && u !== imageUrl);

  const handleUploadExtra = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      const url = await uploadImageFile(file, { maxWidth: 1000, maxHeight: 1000, quality: 0.8 });
      if (url) {
        if (!imageUrl) {
          onUpdatePrimary(url);
        } else {
          onUpdateGallery([...extraImages, url]);
        }
      }
    } catch (err: any) {
      alert(err.message || "Gagal mengunggah foto.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSetPrimary = (targetUrl: string) => {
    const nextExtra = [imageUrl, ...extraImages].filter((u) => u && u !== targetUrl);
    onUpdatePrimary(targetUrl);
    onUpdateGallery(nextExtra);
  };

  const handleRemoveExtra = (targetUrl: string) => {
    onUpdateGallery(extraImages.filter((u) => u !== targetUrl));
  };

  return (
    <div className="space-y-3">
      <FileUpload
        label={label || t("dashboard.sitesKatalog.photoPrimary", "Foto Utama")}
        value={imageUrl}
        onChange={onUpdatePrimary}
        placeholder="https://..."
        maxWidth={800}
        maxHeight={600}
        quality={0.8}
        previewSize="sm"
      />

      <div className="rounded-2xl border border-border/80 bg-muted/20 overflow-hidden">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-foreground hover:bg-muted/40 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-primary" />
            <span>{t("dashboard.sitesKatalog.photoGalleryCount", undefined, { count: String(1 + extraImages.length) })}</span>
          </div>
          {isOpen ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
        </button>

        {isOpen && (
          <div className="p-3 border-t border-border/60 space-y-3 bg-card">
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              {t("dashboard.sitesKatalog.photoGalleryHelp", "Unggah foto tambahan dari sudut berbeda atau variasi produk.")}
            </p>

            <div className="flex flex-wrap gap-2.5">
              {imageUrl && (
                <div className="relative w-16 h-16 rounded-xl overflow-hidden border-2 border-primary group shadow-xs">
                  <img src={imageUrl} alt="" className="w-full h-full object-cover" />
                  <span className="absolute bottom-0 inset-x-0 bg-primary text-[9px] font-black text-primary-foreground text-center py-0.5 uppercase">
                    {t("dashboard.sitesKatalog.photoSetPrimary", "Utama")}
                  </span>
                </div>
              )}

              {extraImages.map((url, idx) => (
                <div key={idx} className="relative w-16 h-16 rounded-xl overflow-hidden border border-border group shadow-xs">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1 transition-opacity p-1">
                    <button
                      type="button"
                      onClick={() => handleSetPrimary(url)}
                      className="text-[9px] font-bold text-white bg-primary px-1.5 py-0.5 rounded cursor-pointer hover:bg-primary/90"
                    >
                      {t("dashboard.sitesKatalog.photoSetPrimary", "Utama")}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveExtra(url)}
                      className="text-red-400 hover:text-red-300 p-0.5 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleUploadExtra}
                accept="image/*"
                className="hidden"
              />
              <button
                type="button"
                disabled={uploading}
                onClick={() => fileInputRef.current?.click()}
                className="w-16 h-16 rounded-xl border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-primary transition-all cursor-pointer disabled:opacity-50"
              >
                {uploading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span className="text-[10px] font-bold">{t("dashboard.sitesKatalog.photoAdd", "+ Foto")}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function KatalogManagerPage() {
  const { id } = useParams();
  const token = useAuthToken();
  const { activeTenantId, activeTenant } = useActiveTenant();
  const { pushToast } = useToast();
  const { t } = useI18n();
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
      pushToast(err.message || t("dashboard.sitesKatalog.loadFailed"), "error");
    } finally {
      setLoading(false);
    }
  }, [token, activeTenantId, siteId]);

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
      pushToast(err.message || t("dashboard.sitesKatalog.saveFailed"), "error");
    } finally {
      setSaving(false);
    }
  }, [token, activeTenantId, siteId]);

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
      setAiPromptModal({ label: `${t("dashboard.sitesKatalog.aiPromptLabelPrefix")}: ${itemName || `${t("dashboard.sitesKatalog.itemFallback", undefined, { number: String(itemIdx + 1) })}`}`, resolve });
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
        pushToast(err.message || t("dashboard.sitesKatalog.aiFailed"), "error");
      }
      throw err;
    } finally {
      setAiLoadingDesc(null);
    }
  }, [token, activeTenantId, siteId, sectionKey, updateField, pushToast]);

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
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> {t("dashboard.sitesKatalog.saving", "Menyimpan...")}
            </span>
          ) : savedAt ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
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
          <p className="text-xl sm:text-2xl font-black text-emerald-400">{totalAvailable}</p>
        </div>
        <div className="p-4 rounded-2xl border border-border/80 bg-card shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">{t("dashboard.sitesKatalog.statVariants", "Varian / Opsi")}</span>
          <p className="text-xl sm:text-2xl font-black text-primary">{totalVariantGroups}</p>
        </div>
      </div>

      {/* Catalog / Menu editor component */}
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
