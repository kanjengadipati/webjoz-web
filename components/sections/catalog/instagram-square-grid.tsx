"use client";
import React, { useState } from "react";
import { Image as _ImageIcon, Heart, Bookmark, Eye } from "lucide-react";
import { InlineText, InlineImage, ProductQuickView, toQuickViewItem } from "../../templates/shared";
import { InlineAddTile, InlineDeleteButton, CategoryAddButton } from "../inline-add";
import type { TemplateProps, DesignToken } from "../../templates/types";
import { AddToCartButton } from "@/components/cart";

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

export default function CatalogInstagramSquareGrid({ catalog, onUpdateField, isEditorMode, isSelected, collapseSheetForInlineEdit, onEditingStateChange, onAddItem, onDeleteItem, onAddCategory, onDeleteCategory, language = "id"}: CatalogVariantProps) {
  const isEN = language === "en";
  const [quickView, setQuickView] = useState<{ catIdx: number; itemIdx: number } | null>(null);
  if (!catalog) return null;
  const { eyebrow, title, subtitle, categories } = catalog;
  const qvCategory = quickView ? categories[quickView.catIdx] : undefined;
  const qvItem = qvCategory?.items?.[quickView?.itemIdx ?? -1];

  return (
    <section
      id="catalog"
      className="py-16 px-4 md:px-8 max-w-7xl mx-auto"
      style={{
        backgroundColor: "var(--dt-bg)",
        color: "var(--dt-text)",
        fontFamily: "var(--dt-body-font, sans-serif)",
      }}
    >
      {/* Header */}
      <div className="mb-16 border-b-2 pb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4" style={{ borderColor: "var(--dt-border)" }}>
        <div>
          {(eyebrow || isEditorMode) && (
            <InlineText
              section="catalog"
              fieldKey="eyebrow"
              value={eyebrow}
              onUpdateField={onUpdateField}
              isEditorMode={isEditorMode}
              isSelected={isSelected}
              collapseSheetForInlineEdit={collapseSheetForInlineEdit}
              onEditingStateChange={onEditingStateChange}
              as="span"
              className="text-xs uppercase tracking-wider font-extrabold block mb-2"
              style={{ color: "var(--dt-accent)", fontFamily: "var(--dt-heading-font)" }}
            />
          )}
          <InlineText
            section="catalog"
            fieldKey="title"
            value={title}
            onUpdateField={onUpdateField}
            isEditorMode={isEditorMode}
            isSelected={isSelected}
            collapseSheetForInlineEdit={collapseSheetForInlineEdit}
            onEditingStateChange={onEditingStateChange}
            as="h2"
            className="text-4xl font-black tracking-tight"
            style={{
              color: "var(--dt-text)",
              fontFamily: "var(--dt-heading-font, sans-serif)"
            }}
          />
        </div>
        {(subtitle || isEditorMode) && (
          <InlineText
            section="catalog"
            fieldKey="subtitle"
            value={subtitle}
            onUpdateField={onUpdateField}
            isEditorMode={isEditorMode}
            isSelected={isSelected}
            collapseSheetForInlineEdit={collapseSheetForInlineEdit}
            onEditingStateChange={onEditingStateChange}
            as="p"
            className="text-sm font-medium max-w-md md:text-right"
            style={{ color: "var(--dt-text-muted)" }}
          />
        )}
      </div>

      {/* Categories */}
      <div className="space-y-20">
        {categories?.map((category, catIdx) => (
          <div key={catIdx} className="space-y-6">
            <div
              className="text-xl font-extrabold uppercase tracking-tight flex items-center gap-2"
              style={{ fontFamily: "var(--dt-heading-font)" }}
            >
              <span className="w-3 h-3 bg-current inline-block"></span>
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
              />
              {isEditorMode && onDeleteCategory && (
                <InlineDeleteButton
                  compact
                  onDelete={() => onDeleteCategory(catIdx)}
                  title={isEN ? "Delete Category" : "Hapus Kategori"}
                />
              )}


            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {category.items?.map((item, index) => {
                const itemNum = (index + 1).toString().padStart(2, "0");

                return (
                  <div
                    key={index}
                    className="flex flex-col group h-full relative cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl rounded-2xl overflow-hidden p-3 pb-3.5"
                    onClick={() => setQuickView({ catIdx, itemIdx: index })}
                    style={{
                      backgroundColor: "var(--dt-surface)",
                      border: `1px solid color-mix(in srgb, var(--dt-border) 60%, transparent)`,
                      boxShadow: "0 4px 14px rgba(0,0,0,0.04)",
                    }}
                  >
                    {/* Top Micro-Header: User/Creator style header */}
                    <div className="flex items-center justify-between gap-2 px-1 pb-2.5">
                      <div className="flex items-center gap-2 min-w-0">
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black shrink-0"
                          style={{
                            backgroundColor: "var(--dt-primary)",
                            color: "var(--dt-primary-foreground)",
                          }}
                        >
                          #{itemNum}
                        </div>
                        <span className="text-[11px] font-bold uppercase tracking-wider truncate opacity-75" style={{ color: "var(--dt-text)" }}>
                          {category.name}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setQuickView({ catIdx, itemIdx: index }); }}
                        onPointerDown={(e) => e.stopPropagation()}
                        className="p-1 rounded-full text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
                        title={isEN ? "Detail" : "Lihat Detail"}
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Image Area - 1:1 Square Crop */}
                    <div className="relative w-full aspect-square overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50">
                      <InlineImage
                        section="catalog"
                        fieldKey={"categories." + catIdx + ".items." + index + ".image_url"}
                        src={item.image_url}
                        alt={item.name}
                        onUpdateField={onUpdateField}
                        isEditorMode={isEditorMode}
                        isSelected={isSelected}
                        collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />

                      {/* Badge */}
                      {item.badge && (
                        <div
                          className="absolute top-2.5 left-2.5 text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-md shadow-sm z-10"
                          style={{
                            backgroundColor: "var(--dt-accent)",
                            color: "var(--dt-primary-foreground)",
                          }}
                        >
                          <InlineText section="catalog" fieldKey={"categories." + catIdx + ".items." + index + ".badge"} value={item.badge ?? ""} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={isSelected} collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} as="span" />
                        </div>
                      )}
                    </div>

                    {/* Social Interaction & Price Bar */}
                    <div className="flex items-center justify-between gap-2 pt-2.5 px-1">
                      <div className="flex items-center gap-2.5 text-neutral-400">
                        <span className="flex items-center hover:text-red-500 transition-colors">
                          <Heart className="w-4 h-4 fill-current/10" />
                        </span>
                        <span className="flex items-center hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors">
                          <Bookmark className="w-4 h-4" />
                        </span>
                      </div>

                      {/* IG Shop Price Tag Badge */}
                      {(item.price || item.price_display || isEditorMode) && (
                        <div className="flex items-baseline gap-1.5 shrink-0">
                          {item.promo_price_amount && item.promo_price_amount > 0 ? (
                            <>
                              <InlineText
                                section="catalog"
                                fieldKey={"categories." + catIdx + ".items." + index + ".promo_price_display"}
                                value={item.promo_price_display || item.promo_price || ""}
                                placeholder="+ Promo"
                                onUpdateField={onUpdateField}
                                isEditorMode={isEditorMode}
                                isSelected={isSelected}
                                collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                                onEditingStateChange={onEditingStateChange}
                                as="span"
                                className="text-xs sm:text-sm font-extrabold tracking-tight"
                                style={{ color: "var(--dt-primary)" }}
                              />
                              <span className="text-[10px] font-medium line-through opacity-50" style={{ color: "var(--dt-text)" }}>
                                {item.price_display || item.price}
                              </span>
                            </>
                          ) : (
                            <InlineText
                              section="catalog"
                              fieldKey={"categories." + catIdx + ".items." + index + ".price"}
                              value={item.price_display || item.price || ""}
                              placeholder="+ Harga"
                              onUpdateField={onUpdateField}
                              isEditorMode={isEditorMode}
                              isSelected={isSelected}
                              collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                              onEditingStateChange={onEditingStateChange}
                              as="span"
                              className="text-xs sm:text-sm font-extrabold tracking-tight"
                              style={{ color: "var(--dt-primary)" }}
                            />
                          )}
                        </div>
                      )}
                    </div>

                    {/* Description Area: Styled like an Instagram post caption */}
                    <div className="p-1 pt-1.5 flex flex-col flex-grow min-w-0">
                      <div className="text-xs sm:text-sm leading-relaxed mb-1 min-w-0">
                        <InlineText
                          section="catalog"
                          fieldKey={"categories." + catIdx + ".items." + index + ".name"}
                          value={item.name ?? ""}
                          onUpdateField={onUpdateField}
                          isEditorMode={isEditorMode}
                          isSelected={isSelected}
                          collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                          onEditingStateChange={onEditingStateChange}
                          as="h4"
                          className="font-bold tracking-tight inline mr-1.5"
                          style={{ color: "var(--dt-text)" }}
                        />
                        {item.description && (
                          <InlineText
                            section="catalog"
                            fieldKey={"categories." + catIdx + ".items." + index + ".description"}
                            value={item.description ?? ""}
                            onUpdateField={onUpdateField}
                            isEditorMode={isEditorMode}
                            isSelected={isSelected}
                            collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                            onEditingStateChange={onEditingStateChange}
                            as="span"
                            className="text-xs font-normal opacity-75 inline line-clamp-2"
                            style={{ color: "var(--dt-text-muted)" }}
                          />
                        )}
                      </div>

                      {item.capacity != null && item.capacity > 0 && (
                        <div className="mt-1">
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: "color-mix(in srgb, var(--dt-primary) 14%, transparent)", color: "var(--dt-primary)" }}>
                            {isEN ? "up to" : "s/d"} <InlineText section="catalog" fieldKey={"categories." + catIdx + ".items." + index + ".capacity"} value={item.capacity != null ? String(item.capacity) : ""} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={isSelected} collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} as="span" /> {isEN ? "guests" : "tamu"}
                          </span>
                        </div>
                      )}

                      {item.features && item.features.length > 0 && (
                        <div className="mt-1.5 flex flex-wrap gap-1">
                          {item.features.map((f: string, fi: number) => (
                            <span key={fi} className="text-[10px] font-medium px-1.5 py-0.5 rounded-md border" style={{ borderColor: "var(--dt-border)", color: "var(--dt-text-muted)" }}>
                              {f}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Instagram Shop CTA Button */}
                    <div className="pt-2 px-1 mt-auto" onClick={(e) => e.stopPropagation()}>
                      <AddToCartButton
                        itemId={item.id || `cat-ig-${catIdx}-${index}`}
                        itemName={item.name}
                        itemPrice={item.price_display || item.price || null}
                        itemPriceAmount={item.price_amount}
                        itemPriceDisplay={item.price_display || item.price}
                        itemPromoPriceAmount={item.promo_price_amount}
                        itemPromoPriceDisplay={item.promo_price_display}
                        discountLabel={item.discount_label}
                        category={category.name}
                        variant_groups={item.variant_groups}
                        disabled={item.is_available === false}
                        className="w-full py-2.5 px-3 rounded-xl text-xs font-bold tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all duration-200 hover:brightness-110 active:scale-[0.98] cursor-pointer"
                        style={{
                          backgroundColor: "var(--dt-primary)",
                          color: "var(--dt-primary-foreground)",
                        }}
                      />
                    </div>
                    {isEditorMode && onDeleteItem && (
                      <InlineDeleteButton onDelete={() => onDeleteItem(catIdx, index)} className="absolute top-2.5 right-2.5 z-40" />
                    )}
                  </div>
                );
              })}
              {isEditorMode && onAddItem && (
                <InlineAddTile
                  label={isEN ? "Add Item" : "Tambah Item"}
                  variant="card"
                  className="aspect-square rounded-2xl"
                  onClick={() => onAddItem(catIdx)}
                />
              )}
            </div>
          </div>
        ))}
      {isEditorMode && onAddCategory && (
        <CategoryAddButton onAdd={onAddCategory} isEN={isEN} collapseSheetForInlineEdit={collapseSheetForInlineEdit} />
      )}
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
      </div>
    </section>
  );
}
