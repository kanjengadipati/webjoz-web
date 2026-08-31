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
  Utensils, X, Link as LinkIcon,
} from "lucide-react";
import { AI_SUGGESTIONS } from "../editor-utils";
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
  "w-full px-3 py-2 border border-border rounded-xl text-[13px] outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/20 bg-muted/40 text-slate-100 placeholder-slate-500";
const inputLabel = "text-[10px] uppercase tracking-wide font-bold text-slate-500 block mb-1";

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
    updateCategories(categories.filter((_: any, i: number) => i !== catIdx));
    setExpandedCat(null);
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
    <div className="space-y-4">
      {/* Section header */}
      <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 to-white/[0.02] p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex-1 space-y-2">
            <label className={inputLabel}>{t("dashboard.sitesKatalog.labelSectionTitle")}</label>
            <input type="text" value={data?.title ?? ""} onChange={(e) => updateField(sectionKey, "title", e.target.value)} placeholder={`cth. ${sectionTitle}`} className={`${inputBase} bg-muted/50`} />
          </div>
          <div className="space-y-2">
            <label className={inputLabel}>{t("dashboard.sitesKatalog.labelEyebrow")} <span className="text-slate-500 font-normal normal-case">({t("dashboard.sitesKatalog.optional")})</span></label>
            <input type="text" value={data?.eyebrow ?? ""} onChange={(e) => updateField(sectionKey, "eyebrow", e.target.value)} placeholder={`cth. Pilihan ${sectionTitle}`} className={inputBase} />
          </div>
          <div className="space-y-2">
            <label className={inputLabel}>{t("dashboard.sitesKatalog.labelSubtitle")} <span className="text-slate-500 font-normal normal-case">({t("dashboard.sitesKatalog.optional")})</span></label>
            <input type="text" value={data?.subtitle ?? ""} onChange={(e) => updateField(sectionKey, "subtitle", e.target.value)} placeholder="cth. Lihat produk pilihan kami" className={inputBase} />
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-[10px] font-semibold text-primary">
            {sectionKey === "menu" ? t("dashboard.sitesKatalog.chipMenu") : t("dashboard.sitesKatalog.chipCatalog")} · {t("dashboard.sitesKatalog.chipCategoryCount", undefined, { count: String(categories.length) })}
          </div>
        </div>
      </div>

      {/* Empty state */}
      {categories.length === 0 && (
        <div className="rounded-2xl border border-dashed border-primary/20 bg-primary/5 p-8 text-center">
          <p className="text-sm font-semibold text-slate-200">{t("dashboard.sitesKatalog.noCategoriesTitle")}</p>
          <p className="mt-1 text-xs leading-relaxed text-slate-500">{t("dashboard.sitesKatalog.noCategoriesDesc", undefined, { itemLabel })}</p>
        </div>
      )}

      {/* Categories — DnD sortable */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleCatDragEnd}>
        <SortableContext items={categories.map((c: any) => c.id ?? c.name)} strategy={verticalListSortingStrategy}>
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
        </SortableContext>
      </DndContext>

      <button type="button" onClick={addCategory}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-dashed border-primary/25 text-sm font-semibold text-primary hover:bg-primary/10 transition-colors cursor-pointer"
      >
        <Plus className="w-4 h-4" /> {t("dashboard.sitesKatalog.addCategory")}
      </button>
    </div>
  );
}

// ─── Sortable sub-components (i18n-aware) ─────────────────────────────────────────────────
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

  return (
    <div ref={setNodeRef} style={style} className="overflow-hidden rounded-2xl border border-border bg-white/[0.025]">
      <div className="flex items-center gap-2 bg-gradient-to-r from-white/[0.045] to-white/[0.015] px-3 py-2.5 border-b border-border">
        <button
          type="button"
          className="cursor-grab active:cursor-grabbing touch-none text-slate-600 hover:text-slate-300 p-0.5 transition-colors"
          aria-label="Geser kategori" {...attributes} {...listeners}
        >
          <GripVertical className="w-3.5 h-3.5" />
        </button>
        <input
          type="text" value={cat.name ?? ""} onChange={(e) => updateCategoryName(catIdx, e.target.value)}
          placeholder="Nama kategori"
          className="min-w-0 flex-1 bg-transparent text-sm font-bold text-slate-100 outline-none placeholder-slate-600"
        />
        <span className="text-[10px] text-slate-500 flex-shrink-0">{t("dashboard.sitesKatalog.itemCountLabel", undefined, { count: String(itemCount) })}</span>
        <button type="button" onClick={() => setExpandedCat(expandedCat === catIdx ? null : catIdx)} className="text-slate-500 hover:text-slate-200 p-1 cursor-pointer">
          {expandedCat === catIdx ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
        <button type="button" onClick={() => removeCategory(catIdx)} className="text-red-500/60 hover:text-red-400 p-1 cursor-pointer">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {expandedCat === catIdx && (
        <div className="p-3 space-y-3">
          {items.length === 0 && (
            <div className="rounded-xl border border-dashed border-border bg-muted/30 p-4 text-center text-xs text-slate-500">
              {t("dashboard.sitesKatalog.noItemsDesc", undefined, { itemLabel })}
            </div>
          )}

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(ev: DragEndEvent) => handleItemDragEnd(catIdx, ev)}>
            <SortableContext items={items.map((i: any) => i.id ?? i.name)} strategy={verticalListSortingStrategy}>
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
            </SortableContext>
          </DndContext>

          <button type="button" onClick={() => addItem(catIdx)}
            className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl border border-dashed border-primary/30 text-[12px] font-semibold text-primary hover:bg-primary/10 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> {t("dashboard.sitesKatalog.addItemLabel", undefined, { label: itemLabel })}
          </button>
        </div>
      )}
    </div>
  );
}

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
    <div ref={setNodeRef} style={style} className="rounded-2xl border border-border bg-muted/30 p-3">
      {/* Item header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            className="cursor-grab active:cursor-grabbing touch-none text-slate-600 hover:text-slate-300 transition-colors"
            aria-label="Geser item" {...attributes} {...listeners}
          >
            <GripVertical className="w-3.5 h-3.5" />
          </button>
          <span className="text-[10px] uppercase tracking-wide font-bold text-slate-500">
            {t("dashboard.sitesKatalog.itemNumberLabel", undefined, { label: itemLabel, number: String(itemIdx + 1) })}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {/* is_available toggle */}
          <button
            type="button"
            onClick={() => updateItem(catIdx, itemIdx, "is_available", !isAvailable)}
            className={`text-[9px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full border transition-all cursor-pointer ${
              isAvailable
                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                : "border-red-500/40 bg-red-500/10 text-red-400 hover:bg-red-500/20"
            }`}
            title={isAvailable ? "Tandai Habis" : "Tandai Tersedia"}
          >
            {isAvailable ? "✓ Tersedia" : "✗ Habis"}
          </button>
          <button type="button" onClick={() => removeItem(catIdx, itemIdx)} className="text-red-500/60 hover:text-red-400 cursor-pointer p-1">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-[180px_1fr]">
        <FileUpload
          label={t("dashboard.sitesKatalog.labelPhoto")} value={item.image_url ?? ""}
          onChange={(val) => updateItem(catIdx, itemIdx, "image_url", val || null)}
          placeholder="https://..." maxWidth={800} maxHeight={600} quality={0.8} previewSize="sm"
        />
        <div className="space-y-3">
          {/* Name + Price */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className={inputLabel}>{t("dashboard.sitesKatalog.labelName")}</label>
              <input type="text" value={item.name ?? ""} onChange={(e) => updateItem(catIdx, itemIdx, "name", e.target.value)} placeholder={`Nama ${itemLabel}`} className={inputBase} />
            </div>
            {hasPrice && (
              <div className="space-y-1.5">
                <label className={inputLabel}>{t("dashboard.sitesKatalog.labelPrice")} <span className="font-normal normal-case text-slate-500">(tampilan)</span></label>
                <input
                  type="text"
                  value={item.price_display ?? item.price ?? ""}
                  onChange={(e) => {
                    updateItem(catIdx, itemIdx, "price_display", e.target.value);
                    updateItem(catIdx, itemIdx, "price", e.target.value);
                  }}
                  placeholder="cth. Rp 25.000, $5.99"
                  className={inputBase}
                />
                <div className="relative">
                  <label className={`${inputLabel} mt-1`}>Harga <span className="font-normal normal-case text-slate-500">(angka untuk subtotal)</span></label>
                  <input
                    type="number" min={0} step="any"
                    value={item.price_amount ?? ""}
                    onChange={(e) => updateItem(catIdx, itemIdx, "price_amount", e.target.value === "" ? null : Number(e.target.value))}
                    placeholder="cth. 25000 atau 5.99"
                    className={`${inputBase} [appearance:textfield]`}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Badge */}
          {hasBadge && (
            <div>
              <label className={inputLabel}>{t("dashboard.sitesKatalog.labelBadge")} <span className="font-normal normal-case text-slate-500">{t("dashboard.sitesKatalog.badgeHint")}</span></label>
              <input type="text" value={normStr(item.badge)} onChange={(e) => updateItem(catIdx, itemIdx, "badge", normStr(e.target.value) || null)} placeholder="cth. Best Seller, Baru, Promo" className={inputBase} />
            </div>
          )}

          {/* Tags (menu only) */}
          {sectionKey === "menu" && (
            <div>
              <label className={inputLabel}>Tags <span className="font-normal normal-case text-slate-500">(misal: Pedas, Vegetarian)</span></label>
              <div className="flex flex-wrap gap-1.5 mb-1.5">
                {tags.map((tag: string, ti: number) => (
                  <span key={ti} className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-primary/15 text-primary border border-primary/20">
                    {tag}
                    <button type="button" onClick={() => updateItem(catIdx, itemIdx, "tags", tags.filter((_: string, i: number) => i !== ti))} className="hover:opacity-70 cursor-pointer">
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text" placeholder="Ketik tag lalu Enter" className={`${inputBase} text-xs`}
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
          )}

          {/* Delivery Platforms (menu only) */}
          {sectionKey === "menu" && (
            <div>
              <label className={inputLabel}>Platform Delivery <span className="font-normal normal-case text-slate-500">(GrabFood, GoFood, dll.)</span></label>
              <div className="space-y-1.5 mb-1.5">
                {deliveryPlatforms.map((dp: { name: string; url: string }, di: number) => (
                  <div key={di} className="flex items-center gap-1.5">
                    <input type="text" value={dp.name} onChange={(e) => { const n = [...deliveryPlatforms]; n[di] = { ...n[di], name: e.target.value }; updateItem(catIdx, itemIdx, "delivery_platforms", n); }} placeholder="GrabFood" className={`${inputBase} flex-1 text-xs`} />
                    <input type="url" value={dp.url} onChange={(e) => { const n = [...deliveryPlatforms]; n[di] = { ...n[di], url: e.target.value }; updateItem(catIdx, itemIdx, "delivery_platforms", n); }} placeholder="https://grab.com/..." className={`${inputBase} flex-1 text-xs`} />
                    <button type="button" onClick={() => updateItem(catIdx, itemIdx, "delivery_platforms", deliveryPlatforms.filter((_: any, i: number) => i !== di))} className="text-red-500/60 hover:text-red-400 cursor-pointer p-1"><X className="w-3 h-3" /></button>
                  </div>
                ))}
              </div>
              <button type="button" onClick={() => updateItem(catIdx, itemIdx, "delivery_platforms", [...deliveryPlatforms, { name: "", url: "" }])} className="flex items-center gap-1 text-[10px] text-primary/70 hover:text-primary cursor-pointer transition-colors">
                <LinkIcon className="w-3 h-3" /> Tambah Platform
              </button>
            </div>
          )}
        </div>

        {/* Description — full width */}
        <div className="col-span-full space-y-1.5 mt-1">
          <div className="flex items-center justify-between">
            <label className="text-[10px] uppercase tracking-wide font-bold text-slate-500">{t("dashboard.sitesKatalog.labelDescription")}</label>
            {onAiDescription && (
              <AiFieldButton
                loading={aiLoadingDesc === `${catIdx}_${itemIdx}`}
                onGenerate={() => onAiDescription(catIdx, itemIdx, item.name || "", catName || "", item.image_url || undefined)}
                title={t("dashboard.sitesKatalog.aiGenerateDesc")} isPremium={isPremium} onUpgradeRequired={onUpgradeRequired}
              />
            )}
          </div>

          {/* Toolbar */}
          <div className="flex items-center gap-1.5 bg-muted/30 border border-border border-b-0 rounded-t-xl px-2 py-1.5 text-[10px]">
            <button type="button" onClick={() => { const cur = item.description ?? ""; updateItem(catIdx, itemIdx, "description", cur + (cur ? "\n• " : "• ")); }} className="px-2 py-1 rounded bg-[#1e293b]/60 hover:bg-[#1e293b]/90 text-slate-300 font-semibold cursor-pointer text-[9px] flex items-center gap-1 border border-border/50">
              <span>•</span> {t("dashboard.sitesKatalog.bulletList")}
            </button>
            <button type="button" onClick={() => { const cur = item.description ?? ""; updateItem(catIdx, itemIdx, "description", cur + (cur ? "\n1. " : "1. ")); }} className="px-2 py-1 rounded bg-[#1e293b]/60 hover:bg-[#1e293b]/90 text-slate-300 font-semibold cursor-pointer text-[9px] border border-border/50">
              1. {t("dashboard.sitesKatalog.numberedList")}
            </button>
            <div className="w-px h-3.5 bg-white/10 mx-0.5" />
            <div className="relative">
              <button type="button"
                onClick={() => setActiveEmojiPicker(activeEmojiPicker?.catIdx === catIdx && activeEmojiPicker?.itemIdx === itemIdx ? null : { catIdx, itemIdx })}
                className={`px-2 py-1 rounded font-semibold cursor-pointer text-[9px] flex items-center gap-1 border ${activeEmojiPicker?.catIdx === catIdx && activeEmojiPicker?.itemIdx === itemIdx ? "bg-primary/20 text-primary border-primary/30" : "bg-[#1e293b]/60 hover:bg-[#1e293b]/90 border-border/50 text-slate-300"}`}
              >
                😀 {t("dashboard.sitesKatalog.emojiSymbol")}
              </button>
              {activeEmojiPicker?.catIdx === catIdx && activeEmojiPicker?.itemIdx === itemIdx && (
                <div className="absolute left-0 bottom-full mb-1.5 z-[100] w-64 rounded-xl border border-border bg-[#1e293b] p-3 shadow-2xl space-y-3">
                  <div className="flex items-center justify-between border-b border-border/50 pb-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{t("dashboard.sitesKatalog.pickEmojiTitle")}</span>
                    <button type="button" onClick={() => setActiveEmojiPicker(null)} className="text-slate-500 hover:text-slate-300 text-[10px] font-bold cursor-pointer">{t("dashboard.sitesKatalog.close")}</button>
                  </div>
                  <div className="max-h-48 overflow-y-auto space-y-3 pr-1">
                    {EMOJI_GROUPS.map((group: any) => (
                      <div key={group.name} className="space-y-1">
                        <div className="text-[9px] font-semibold text-slate-500">{t(group.name)}</div>
                        <div className="grid grid-cols-7 gap-1">
                          {group.emojis.map((emoji: string) => (
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
            className="w-full px-3 py-2 border border-border rounded-b-xl text-[13px] outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/20 bg-muted/40 text-slate-100 placeholder-slate-500 resize-y"
          />
        </div>

        {/* Variant / Add-on Groups */}
        <KatVariantGroupEditor
          groups={item.variant_groups ?? []}
          onChange={(groups) => updateItem(catIdx, itemIdx, "variant_groups", groups.length ? groups : null)}
        />
      </div>
    </div>
  );
}

// ─── KatVariantGroupEditor ──────────────────────────────────────────────────────

const KAT_VGE_INPUT = "w-full px-2.5 py-1.5 rounded-lg border border-border text-[12px] bg-muted/40 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-primary/50 focus:bg-primary/5 transition-colors";

interface KVGGroup { id: string; name: string; type: "single" | "multiple"; required: boolean; options: KVGOption[]; }
interface KVGOption { id: string; name: string; price_delta?: number | null; price_display?: string | null; }

function makeKVGroup(): KVGGroup {
  return { id: katNanoid(), name: "", type: "single", required: true, options: [{ id: katNanoid(), name: "", price_delta: null, price_display: null }] };
}

function KatVariantGroupEditor({ groups, onChange }: { groups: KVGGroup[]; onChange: (groups: KVGGroup[]) => void }) {
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
    <div className="col-span-full mt-2 border-t border-border pt-3">
      <div className="flex items-center justify-between mb-2">
        <label className="text-[10px] uppercase tracking-wide font-bold text-slate-500">Varian / Add-on</label>
        <button
          type="button"
          onClick={() => { const g = makeKVGroup(); onChange([...groups, g]); setExpandedGroup(g.id); }}
          className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-lg bg-primary/15 text-primary hover:bg-primary/25 transition-colors cursor-pointer"
        >
          <Plus className="w-3 h-3" /> Tambah Grup
        </button>
      </div>

      {groups.length === 0 && (
        <p className="text-[10px] text-slate-500 italic">Belum ada varian. Contoh: Ukuran, Topping, Level Pedas.</p>
      )}

      <div className="flex flex-col gap-2">
        {groups.map((group) => {
          const isOpen = expandedGroup === group.id;
          return (
            <div key={group.id} className="rounded-xl border border-border bg-muted/20 overflow-hidden">
              <div
                className="flex items-center gap-2 px-3 py-2 cursor-pointer select-none"
                onClick={() => setExpandedGroup(isOpen ? null : group.id)}
              >
                <span className="flex-1 text-[11px] font-semibold text-slate-200 truncate">
                  {group.name || <span className="text-slate-500 italic">Grup baru</span>}
                </span>
                <span className="text-[9px] text-slate-500 shrink-0">{group.type === "multiple" ? "multi" : "1 pilihan"}</span>
                {isOpen ? <ChevronUp className="w-3 h-3 text-slate-400 shrink-0" /> : <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />}
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); removeGroup(group.id); }}
                  className="text-red-500/60 hover:text-red-400 cursor-pointer p-0.5 shrink-0"
                  aria-label="Hapus grup"
                ><Trash2 className="w-3 h-3" /></button>
              </div>

              {isOpen && (
                <div className="px-3 pb-3 flex flex-col gap-2 border-t border-border">
                  <input
                    type="text" value={group.name}
                    onChange={(e) => updateGroup(group.id, { name: e.target.value })}
                    placeholder="Nama grup (cth. Ukuran, Topping)"
                    className={`${KAT_VGE_INPUT} mt-2`}
                  />
                  <div className="flex items-center gap-4 flex-wrap">
                    <label className="flex items-center gap-1.5 text-[10px] text-slate-400 cursor-pointer select-none">
                      <input type="checkbox" checked={group.type === "multiple"}
                        onChange={(e) => updateGroup(group.id, { type: e.target.checked ? "multiple" : "single" })}
                        className="w-3 h-3 accent-primary" /> Multi-pilih
                    </label>
                    <label className="flex items-center gap-1.5 text-[10px] text-slate-400 cursor-pointer select-none">
                      <input type="checkbox" checked={group.required}
                        onChange={(e) => updateGroup(group.id, { required: e.target.checked })}
                        className="w-3 h-3 accent-primary" /> Wajib dipilih
                    </label>
                  </div>

                  <div className="flex flex-col gap-1.5 mt-1">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Pilihan</span>
                    {group.options.map((opt) => (
                      <div key={opt.id} className="flex items-center gap-1.5">
                        <input type="text" value={opt.name}
                          onChange={(e) => updateOption(group.id, opt.id, { name: e.target.value })}
                          placeholder="Nama opsi (cth. S, M, L)"
                          className={`${KAT_VGE_INPUT} flex-1`}
                        />
                        <input type="number" value={opt.price_delta ?? ""}
                          onChange={(e) => {
                            const delta = e.target.value === "" ? null : Number(e.target.value);
                            const display = delta != null && delta !== 0 ? (delta > 0 ? `+${delta.toLocaleString()}` : `${delta.toLocaleString()}`) : null;
                            updateOption(group.id, opt.id, { price_delta: delta, price_display: display });
                          }}
                          placeholder="+harga" title="Delta harga"
                          className={`${KAT_VGE_INPUT} w-24 shrink-0`}
                        />
                        <button type="button" onClick={() => removeOption(group.id, opt.id)}
                          disabled={group.options.length <= 1}
                          className="text-red-500/60 hover:text-red-400 disabled:opacity-30 cursor-pointer p-0.5 shrink-0"
                          aria-label="Hapus opsi"><X className="w-3 h-3" /></button>
                      </div>
                    ))}
                    <button type="button" onClick={() => addOption(group.id)}
                      className="self-start flex items-center gap-1 text-[10px] font-semibold text-primary/70 hover:text-primary mt-0.5 cursor-pointer transition-colors">
                      <Plus className="w-3 h-3" /> Tambah opsi
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
      pushToast(err.message || t("dashboard.sitesKatalog.loadFailed"), "error");
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
      <div className="flex items-center justify-center h-80">
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
      </div>
    );
  }

  const isMenu = sectionKey === "menu";
  const sectionTitle = isMenu ? t("dashboard.sitesKatalog.sectionTitleMenu") : t("dashboard.sitesKatalog.sectionTitleCatalog");
  const itemLabel = isMenu ? t("dashboard.sitesKatalog.itemLabelMenu") : t("dashboard.sitesKatalog.itemLabelCatalog");
  const SectionIcon = isMenu ? Utensils : ShoppingBag;

  return (
    <div className="space-y-6">
      <SiteSubNav siteId={siteId} />

      {/* Page header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link href={`/dashboard/sites/${siteId}`} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft className="w-4 h-4" /> {t("dashboard.sitesKatalog.webLink")}
          </Link>
          <SectionIcon className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-bold">{sectionTitle}</h2>
        </div>

        {/* Save status indicator */}
        <div className="flex items-center gap-2">
          {saving ? (
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> {t("dashboard.sitesKatalog.saving")}
            </span>
          ) : savedAt ? (
            <span className="flex items-center gap-1.5 text-xs text-emerald-500">
              <Check className="w-3.5 h-3.5" /> {t("dashboard.sitesKatalog.saved")}
            </span>
          ) : null}
          <button
            type="button"
            onClick={() => { if (autosaveTimer.current) clearTimeout(autosaveTimer.current); void saveContent(sectionDataRef.current, sectionKey); }}
            disabled={saving}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 disabled:opacity-60 transition-colors"
          >
            <Save className="w-3.5 h-3.5" /> {t("dashboard.sitesKatalog.save")}
          </button>
        </div>
      </div>

      {/* Info banner */}
      <Card>
        <CardContent className="py-3">
          <div className="rounded-xl border border-primary/20 bg-primary/10 px-3 py-2.5 text-[12px] leading-relaxed text-primary">
            <p className="font-semibold">{isMenu ? "🍽️" : "🛍️"} {t("dashboard.sitesKatalog.bannerTitle", undefined, { title: sectionTitle })}</p>
            <p className="mt-1 text-primary/80">
              {t("dashboard.sitesKatalog.bannerDesc1", undefined, { itemLabel, pricePart: isMenu ? "" : t("dashboard.sitesKatalog.bannerPricePart") })}
              {t("dashboard.sitesKatalog.bannerDesc2")}
              <strong>+ {t("dashboard.sitesKatalog.addWord")}</strong>
              {t("dashboard.sitesKatalog.bannerDesc3")}
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
            className="w-full max-w-md rounded-2xl border border-border bg-[#111318] shadow-2xl p-6 space-y-5 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/15">
                <SparkleGenAI className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-[14px] font-bold text-slate-100 leading-tight">{t("dashboard.sitesKatalog.aiModalTitle")}</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {t("dashboard.sitesKatalog.aiModalDesc")} <span className="font-semibold text-primary">{aiPromptModal.label}</span>
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
              className="w-full px-4 py-3 border border-border bg-[#05070b] text-slate-100 rounded-xl text-[13px] outline-none focus:border-primary/60 placeholder:text-slate-600"
            />
            <div className="flex gap-2">
              <button type="button" onClick={() => { aiPromptModal.resolve(null); setAiPromptModal(null); }}
                className="flex-1 h-10 rounded-xl border border-border text-slate-400 text-[13px] font-medium hover:bg-muted/50 transition-colors"
              >{t("dashboard.sitesKatalog.cancel")}</button>
              <button type="button" onClick={() => { aiPromptModal.resolve(aiPromptInput.trim() || ""); setAiPromptModal(null); }}
                className="flex-1 h-10 rounded-xl bg-primary text-primary-foreground text-[13px] font-bold hover:bg-primary/90 transition-colors"
              >{t("dashboard.sitesKatalog.generate")}</button>
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
            className="w-full max-w-sm rounded-2xl border border-border bg-[#111318] shadow-2xl p-6 space-y-4 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-[14px] font-semibold text-slate-100">{t("dashboard.sitesKatalog.upgradeTitle")}</p>
            <p className="text-[12px] text-slate-400">{t("dashboard.sitesKatalog.upgradeDesc")}</p>
            <div className="flex gap-2">
              <button type="button" onClick={() => setUpgradePromptOpen(false)}
                className="flex-1 h-10 rounded-xl border border-border text-slate-400 text-[13px] hover:bg-muted/50 transition-colors"
              >{t("dashboard.sitesKatalog.later")}</button>
              <Link href="/dashboard/upgrade"
                className="flex-1 h-10 rounded-xl bg-primary text-primary-foreground text-[13px] font-bold flex items-center justify-center hover:bg-primary/90 transition-colors"
              >{t("dashboard.sitesKatalog.upgradeNow")}</Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
