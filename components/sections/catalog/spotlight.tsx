"use client";
import React, { useState } from "react";
import { Image as ImageIcon } from "lucide-react";
import { MenuCatalogCard, InlineText, InlineImage, ProductQuickView, toQuickViewItem } from "../../templates/shared";
import { InlineAddTile, InlineDeleteButton, CategoryAddButton } from "../inline-add";
import { SectionHeader } from "../section-header";
import { AddToCartButton } from "@/components/cart";
import PhotoCredit from "../PhotoCredit";
import type { TemplateProps, DesignToken } from "../../templates/types";

interface CatalogVariantProps {
  catalog: TemplateProps["content"]["catalog"];
  design_token?: DesignToken | null;
  onUpdateField?: (section: string, key: string, value: unknown) => void;
  isEditorMode?: boolean;
  isSelected?: boolean;
  collapseSheetForInlineEdit?: () => void;
  onEditingStateChange?: (isEditing: boolean) => void;
  onAddItem?: (catIdx: number) => void;
  onDeleteItem?: (catIdx: number, itemIdx: number) => void;
  onAddCategory?: () => void;
  onDeleteCategory?: (catIdx: number) => void;
  language?: "id" | "en";
}

export default function CatalogSpotlight({ catalog, onUpdateField, isEditorMode, isSelected, collapseSheetForInlineEdit, onEditingStateChange, onAddItem, onDeleteItem, onAddCategory, onDeleteCategory, language = "id" }: CatalogVariantProps) {
  const isEN = language === "en";
  const [quickView, setQuickView] = useState<{ catIdx: number; itemIdx: number } | null>(null);
  if (!catalog) return null;

  const categories = catalog.categories || [];
  const qvCategory = quickView ? categories[quickView.catIdx] : undefined;
  const qvItem = qvCategory?.items?.[quickView?.itemIdx ?? -1];

  // Promote the first item of the first non-empty category; prefer one with a badge.
  let heroCatIdx = -1;
  let heroItemIdx = -1;
  for (let ci = 0; ci < categories.length; ci++) {
    const items = categories[ci].items || [];
    if (items.length > 0) {
      const badgeIdx = items.findIndex((it) => it.badge);
      heroCatIdx = ci;
      heroItemIdx = badgeIdx >= 0 ? badgeIdx : 0;
      break;
    }
  }
  const heroCat = heroCatIdx >= 0 ? categories[heroCatIdx] : undefined;
  const heroItem = heroCat?.items?.[heroItemIdx];
  const heroPath = heroCatIdx >= 0 ? `categories.${heroCatIdx}.items.${heroItemIdx}` : "";

  const labels = {
    detail: isEN ? "View detail" : "Lihat Detail",
    guests: isEN ? "guests" : "tamu",
    upTo: isEN ? "up to" : "s/d",
    addItem: isEN ? "Add Item" : "Tambah Item",
    empty: isEN ? "No products yet." : "Belum ada produk.",
  };

  return (
    <section
      id="catalog"
      className="py-16"
      style={{
        backgroundColor: "var(--dt-bg)",
        color: "var(--dt-text)",
        fontFamily: "var(--dt-body-font, sans-serif)",
      }}
    >
      {/* Header */}
      <SectionHeader
        section="catalog"
        eyebrow={(catalog.eyebrow || isEditorMode) ? (catalog.eyebrow ?? "") : undefined}
        title={catalog.title}
        subtitle={(catalog.subtitle || isEditorMode) ? (catalog.subtitle ?? "") : undefined}
        wrapperClassName="max-w-7xl mx-auto px-4 md:px-8 mb-10 text-center"
        eyebrowClassName="text-xs uppercase tracking-widest font-semibold block mb-2"
        eyebrowStyle={{ color: "var(--dt-accent)", fontFamily: "var(--dt-heading-font)" }}
        titleClassName="text-3xl md:text-4xl font-normal tracking-tight"
        titleStyle={{ color: "var(--dt-text)", fontFamily: "var(--dt-heading-font, serif)" }}
        subtitleClassName="text-base font-light leading-relaxed mt-3 max-w-2xl mx-auto"
        subtitleStyle={{ color: "var(--dt-text-muted)" }}
        onUpdateField={onUpdateField}
        isEditorMode={isEditorMode}
        isSelected={isSelected}
        collapseSheetForInlineEdit={collapseSheetForInlineEdit}
        onEditingStateChange={onEditingStateChange}
      />

      {/* Full-bleed spotlight hero */}
      {heroItem && (
        <div className="relative w-full overflow-hidden" onClick={() => setQuickView({ catIdx: heroCatIdx, itemIdx: heroItemIdx })}>
          <div className="absolute inset-0">
            <InlineImage
              section="catalog"
              fieldKey={heroPath + ".image_url"}
              src={heroItem.image_url}
              alt={heroItem.name}
              onUpdateField={onUpdateField}
              isEditorMode={isEditorMode}
              isSelected={isSelected}
              collapseSheetForInlineEdit={collapseSheetForInlineEdit}
              className="w-full h-full object-cover"
              fallbackIcon={<ImageIcon className="w-16 h-16 text-white/70" />}
            />
          </div>
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.35) 45%, rgba(0,0,0,0.05) 100%)" }} />

          <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 flex flex-col justify-end min-h-[60vh] py-12" style={{ color: "#fff" }}>
            {heroItem.badge && (
              <span className="self-start text-[11px] uppercase tracking-widest font-bold px-3 py-1 mb-4" style={{ backgroundColor: "var(--dt-primary)", color: "var(--dt-primary-foreground)", borderRadius: "9999px" }}>
                <InlineText section="catalog" fieldKey={heroPath + ".badge"} value={heroItem.badge ?? ""} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={isSelected} collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} as="span" />
              </span>
            )}

            <InlineText
              section="catalog"
              fieldKey={"categories." + heroCatIdx + ".name"}
              value={heroCat?.name ?? ""}
              onUpdateField={onUpdateField}
              isEditorMode={isEditorMode}
              isSelected={isSelected}
              collapseSheetForInlineEdit={collapseSheetForInlineEdit}
              onEditingStateChange={onEditingStateChange}
              as="span"
              className="text-xs uppercase tracking-widest font-semibold mb-2 block"
              style={{ color: "var(--dt-accent)" }}
            />

            <InlineText
              section="catalog"
              fieldKey={heroPath + ".name"}
              value={heroItem.name ?? ""}
              onUpdateField={onUpdateField}
              isEditorMode={isEditorMode}
              isSelected={isSelected}
              collapseSheetForInlineEdit={collapseSheetForInlineEdit}
              onEditingStateChange={onEditingStateChange}
              as="h3"
              className="text-3xl md:text-5xl font-normal tracking-tight max-w-3xl"
              style={{ fontFamily: "var(--dt-heading-font, serif)" }}
            />

            {(heroItem.description || isEditorMode) && (
              <InlineText
                section="catalog"
                fieldKey={heroPath + ".description"}
                value={heroItem.description ?? ""}
                onUpdateField={onUpdateField}
                isEditorMode={isEditorMode}
                isSelected={isSelected}
                collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                onEditingStateChange={onEditingStateChange}
                as="p"
                multiline
                className="text-sm md:text-base font-light leading-relaxed mt-3 max-w-2xl"
                style={{ color: "rgba(255,255,255,0.85)" }}
              />
            )}

            <div className="flex flex-wrap items-center gap-2 mt-4">
              {heroItem.capacity != null && heroItem.capacity > 0 && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full" style={{ background: "rgba(255,255,255,0.16)", color: "#fff" }}>
                  {labels.upTo} <InlineText section="catalog" fieldKey={heroPath + ".capacity"} value={heroItem.capacity != null ? String(heroItem.capacity) : ""} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={isSelected} collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} as="span" /> {labels.guests}
                </span>
              )}
              {heroItem.features?.map((f: string, fi: number) => (
                <span key={fi} className="text-[11px] px-2.5 py-1 rounded-full" style={{ background: "rgba(255,255,255,0.16)", color: "#fff" }}>
                  {f}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-4 mt-6" onClick={(e) => e.stopPropagation()}>
              {(heroItem.price || isEditorMode) && (
                <div className="flex flex-col">
                  {typeof heroItem.promo_price_amount === "number" && heroItem.promo_price_amount > 0 && (
                    <InlineText
                      section="catalog"
                      fieldKey={heroPath + ".promo_price_display"}
                      value={heroItem.promo_price_display ?? heroItem.promo_price ?? ""}
                      onUpdateField={onUpdateField}
                      isEditorMode={isEditorMode}
                      isSelected={isSelected}
                      collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                      onEditingStateChange={onEditingStateChange}
                      as="span"
                      className="text-xl md:text-2xl font-bold"
                      style={{ color: "var(--dt-primary-foreground)", backgroundColor: "var(--dt-primary)", borderRadius: "var(--dt-radius)", padding: "0.1rem 0.6rem", alignSelf: "flex-start" }}
                    />
                  )}
                  <InlineText
                    section="catalog"
                    fieldKey={heroPath + ".price"}
                    value={heroItem.price ?? ""}
                    onUpdateField={onUpdateField}
                    isEditorMode={isEditorMode}
                    isSelected={isSelected}
                    collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                    onEditingStateChange={onEditingStateChange}
                    as="span"
                    className={typeof heroItem.promo_price_amount === "number" && heroItem.promo_price_amount > 0 ? "text-sm line-through opacity-80" : "text-xl md:text-2xl font-bold"}
                  />
                </div>
              )}
              <AddToCartButton
                itemId={heroItem.id || `cat-sp-hero-${heroCatIdx}-${heroItemIdx}`}
                itemName={heroItem.name}
                itemPrice={heroItem.price_display || heroItem.price || null}
                itemPriceAmount={heroItem.price_amount}
                itemPriceDisplay={heroItem.price_display || heroItem.price}
                itemPromoPriceAmount={heroItem.promo_price_amount}
                itemPromoPriceDisplay={heroItem.promo_price_display}
                discountLabel={heroItem.discount_label}
                category={heroCat?.name ?? ""}
                variant_groups={heroItem.variant_groups}
                disabled={heroItem.is_available === false}
                className="inline-flex items-center justify-center gap-2 py-3 px-6 rounded-full text-sm font-bold cursor-pointer hover:brightness-110"
                style={{ backgroundColor: "var(--dt-primary)", color: "var(--dt-primary-foreground)", border: "none" }}
              />
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setQuickView({ catIdx: heroCatIdx, itemIdx: heroItemIdx }); }}
                onPointerDown={(e) => e.stopPropagation()}
                className="text-sm font-semibold underline underline-offset-4 cursor-pointer"
                style={{ color: "#fff", background: "none", border: "none" }}
              >
                {labels.detail}
              </button>
            </div>

            {heroItem.image_credit?.name && (
              <div className="mt-3">
                <PhotoCredit
                  credit={heroItem.image_credit}
                  section="catalog"
                  fieldKey={heroPath + ".image_credit.name"}
                  onUpdateField={onUpdateField}
                  isEditorMode={isEditorMode}
                  isSelected={isSelected}
                  collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                />
              </div>
            )}
          </div>

          {isEditorMode && onDeleteItem && (
            <InlineDeleteButton onDelete={() => onDeleteItem(heroCatIdx, heroItemIdx)} className="absolute top-3 right-3 z-40" />
          )}
        </div>
      )}

      {/* Remaining items grouped by category */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-12">
        {categories.length === 0 && !isEditorMode && (
          <p className="text-center text-sm py-10" style={{ color: "var(--dt-text-muted)" }}>{labels.empty}</p>
        )}

        {categories.map((category, catIdx) => {
          const items = (category.items || [])
            .map((item, itemIdx) => ({ item, itemIdx }))
            .filter(({ itemIdx }) => !(catIdx === heroCatIdx && itemIdx === heroItemIdx));
          if (items.length === 0 && !isEditorMode) return null;
          return (
            <div key={catIdx} className="mb-12">
              <div className="flex items-center gap-2 mb-5 pb-2 border-b" style={{ borderColor: "var(--dt-border)" }}>
                <InlineText
                  section="catalog"
                  fieldKey={"categories." + catIdx + ".name"}
                  value={category.name ?? ""}
                  onUpdateField={onUpdateField}
                  isEditorMode={isEditorMode}
                  isSelected={isSelected}
                  collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                  onEditingStateChange={onEditingStateChange}
                  as="h3"
                  className="text-sm uppercase tracking-widest font-semibold"
                  style={{ color: "var(--dt-accent)", fontFamily: "var(--dt-heading-font)" }}
                />
                {isEditorMode && onDeleteCategory && (
                  <InlineDeleteButton compact onDelete={() => onDeleteCategory(catIdx)} title={isEN ? "Delete Category" : "Hapus Kategori"} />
                )}
              </div>

              <div className="flex flex-col gap-6 sm:grid sm:grid-cols-2 lg:grid-cols-3">
                {items.map(({ item, itemIdx }) => (
                  <MenuCatalogCard
                    key={item.id || `${catIdx}_${itemIdx}`}
                    item={{
                      id: item.id || `cat-sp-${catIdx}-${itemIdx}`,
                      name: item.name,
                      price: item.price,
                      priceAmount: item.price_amount,
                      priceDisplay: item.price_display,
                      promoPriceAmount: item.promo_price_amount,
                      promoPriceDisplay: item.promo_price_display,
                      discountLabel: item.discount_label,
                      description: item.description,
                      category: category.name,
                      image_url: item.image_url,
                      image_urls: item.image_urls,
                      image_credit: item.image_credit,
                      badge: item.badge,
                      is_available: item.is_available,
                      variant_groups: item.variant_groups,
                      features: item.features,
                      maxFeatures: 2,
                      capacity: item.capacity,
                    }}
                    icon={ImageIcon}
                    styles={{
                      className: "group transition-all duration-300",
                      style: { background: "var(--dt-surface)", border: "1px solid var(--dt-border)", borderRadius: "var(--dt-radius)", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" },
                      image: { className: "w-full aspect-[4/5] object-cover transition-transform duration-500 group-hover:scale-105" },
                      placeholder: { className: "w-full aspect-[4/5] flex items-center justify-center", style: { background: "color-mix(in srgb, var(--dt-primary) 8%, transparent)" }, iconClassName: "w-12 h-12", iconStyle: { color: "color-mix(in srgb, var(--dt-primary) 30%, transparent)", opacity: 0.6 } },
                      content: { className: "p-4 flex flex-col flex-1 min-w-0" },
                      header: { className: "flex flex-col gap-1.5 mb-2 min-w-0" },
                      title: { className: "font-bold text-sm leading-tight line-clamp-2", style: { color: "var(--dt-text)", fontFamily: "var(--dt-heading-font)" } },
                      description: { className: "text-xs leading-relaxed line-clamp-2", style: { color: "var(--dt-text-muted)" } },
                      price: { className: "self-start text-xs font-bold px-2.5 py-1 rounded-full", style: { background: "color-mix(in srgb, var(--dt-primary) 12%, transparent)", color: "var(--dt-primary)" } },
                      button: { className: "w-full flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold cursor-pointer transition-all duration-200 hover:brightness-110 hover:shadow-md", style: { background: "var(--dt-primary)", color: "var(--dt-primary-foreground)", border: "none" } },
                    }}
                    editSection="catalog"
                    pathBase={`categories.${catIdx}.items.${itemIdx}`}
                    onUpdateField={onUpdateField}
                    isEditorMode={isEditorMode}
                    isSelected={isSelected}
                    collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                    onEditingStateChange={onEditingStateChange}
                    onDelete={isEditorMode && onDeleteItem ? () => onDeleteItem(catIdx, itemIdx) : undefined}
                  />
                ))}

                {isEditorMode && onAddItem && (
                  <InlineAddTile label={labels.addItem} variant="card" className="rounded-2xl" onClick={() => onAddItem(catIdx)} />
                )}
              </div>
            </div>
          );
        })}

        {isEditorMode && onAddCategory && (
          <div className="flex justify-center mt-2">
            <CategoryAddButton onAdd={onAddCategory} isEN={isEN} collapseSheetForInlineEdit={collapseSheetForInlineEdit} />
          </div>
        )}
      </div>

      {quickView && qvItem && (
        <ProductQuickView
          open
          onClose={() => setQuickView(null)}
          item={toQuickViewItem(qvItem, qvCategory?.name)}
          editSection="catalog"
          pathBase={`categories.${quickView.catIdx}.items.${quickView.itemIdx}`}
          onUpdateField={onUpdateField}
          isEditorMode={isEditorMode}
          isSelected={isSelected}
          collapseSheetForInlineEdit={collapseSheetForInlineEdit}
          onEditingStateChange={onEditingStateChange}
        />
      )}
    </section>
  );
}
