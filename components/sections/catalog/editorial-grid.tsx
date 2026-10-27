"use client";
import React, { useState } from "react";
import { Image as ImageIcon } from "lucide-react";
import { InlineText, InlineImage, ProductQuickView, toQuickViewItem } from "../../templates/shared";
import { InlineAddTile, InlineDeleteButton, CategoryAddButton } from "../inline-add";
import { SectionHeader } from "../section-header";
import { AddToCartButton } from "@/components/cart";
import type { TemplateProps, DesignToken } from "../../templates/types";

interface CatalogVariantProps {
  catalog: TemplateProps["content"]["catalog"];
  design_token?: DesignToken | null;
  onUpdateField?: (section: string, key: string, value: any) => void;
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

export default function CatalogEditorialGrid({ catalog, onUpdateField, isEditorMode, isSelected, collapseSheetForInlineEdit, onEditingStateChange, onAddItem, onDeleteItem, onAddCategory, onDeleteCategory, language = "id"}: CatalogVariantProps) {
  const isEN = language === "en";
  const [quickView, setQuickView] = useState<{ catIdx: number; itemIdx: number } | null>(null);
  if (!catalog) return null;
  const { eyebrow, title, subtitle, categories } = catalog;
  const qvCategory = quickView ? categories[quickView.catIdx] : undefined;
  const qvItem = qvCategory?.items?.[quickView?.itemIdx ?? -1];

  const getAddTileClass = (count: number) => {
    const rem = count % 6;
    switch (rem) {
      case 1:
        // Item 0 takes 8 cols, tile completes row with remaining 4 cols
        return "md:col-span-4 self-stretch min-h-[320px]";
      case 3:
        // Item 2 takes 5 cols, tile completes row with remaining 7 cols
        return "md:col-span-7 self-stretch min-h-[320px]";
      case 5:
        // Item 4 takes 6 cols, tile completes row with remaining 6 cols
        return "md:col-span-6 self-stretch min-h-[320px]";
      case 0:
        return count === 0 ? "col-span-full md:col-span-6 min-h-[260px]" : "md:col-span-6 min-h-[280px]";
      case 2:
        return "md:col-span-5 min-h-[280px]";
      case 4:
        return "md:col-span-6 min-h-[280px]";
      default:
        return "md:col-span-4 min-h-[280px]";
    }
  };

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
      <SectionHeader
        section="catalog"
        eyebrow={(eyebrow || isEditorMode) ? (eyebrow ?? "") : undefined}
        title={title}
        subtitle={(subtitle || isEditorMode) ? (subtitle ?? "") : undefined}
        wrapperClassName="mb-16 max-w-2xl"
        eyebrowClassName="text-xs uppercase tracking-widest font-medium block mb-3"
        eyebrowStyle={{ color: "var(--dt-accent)", fontFamily: "var(--dt-heading-font)" }}
        titleClassName="text-4xl md:text-5xl font-light tracking-tight mb-4"
        titleStyle={{
          color: "var(--dt-text)",
          fontFamily: "var(--dt-heading-font)",
          fontWeight: "var(--dt-heading-weight, 300)" as React.CSSProperties["fontWeight"],
        }}
        subtitleClassName="text-base font-light leading-relaxed"
        subtitleStyle={{ color: "var(--dt-text-muted)" }}
        subtitleMultiline
        onUpdateField={onUpdateField}
        isEditorMode={isEditorMode}
        isSelected={isSelected}
        collapseSheetForInlineEdit={collapseSheetForInlineEdit}
        onEditingStateChange={onEditingStateChange}
      />

      {/* Categories Mapping */}
      <div className="space-y-24">
        {categories?.map((category, catIdx) => (
          <div key={catIdx} className="space-y-8">
            {/* Category Title / Separator */}
            <div className="border-b pb-4 flex justify-between items-baseline" style={{ borderColor: "var(--dt-border)" }}>
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
                className="text-xl md:text-2xl font-normal tracking-wide"
                style={{
                  color: "var(--dt-text)",
                  fontFamily: "var(--dt-heading-font)",
                }}
              />
              {isEditorMode && onDeleteCategory && (
                <InlineDeleteButton
                  compact
                  onDelete={() => onDeleteCategory(catIdx)}
                  title={isEN ? "Delete Category" : "Hapus Kategori"}
                />
              )}


              <span className="text-xs font-mono" style={{ color: "var(--dt-text-muted)" }}>
                {category.items?.length || 0} ITEMS
              </span>
            </div>

            {/* Asymmetrical Editorial Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              {category.items?.map((item, index) => {
                // Editorial layout patterning based on item index to create magazine-feel rhythm
                let colSpanClass = "md:col-span-4";
                let aspectClass = "aspect-[3/4]";

                if (index % 6 === 0) {
                  colSpanClass = "md:col-span-8";
                  aspectClass = "aspect-[16/10]";
                } else if (index % 6 === 1) {
                  colSpanClass = "md:col-span-4";
                  aspectClass = "aspect-[3/4]";
                } else if (index % 6 === 2) {
                  colSpanClass = "md:col-span-5";
                  aspectClass = "aspect-[1/1]";
                } else if (index % 6 === 3) {
                  colSpanClass = "md:col-span-7";
                  aspectClass = "aspect-[16/9]";
                } else if (index % 6 === 4) {
                  colSpanClass = "md:col-span-6";
                  aspectClass = "aspect-[4/3]";
                } else {
                  colSpanClass = "md:col-span-6";
                  aspectClass = "aspect-[3/2]";
                }

                return (
                  <div
                    key={index}
                    className={`${colSpanClass} flex flex-col group relative cursor-pointer`}
                    onClick={() => setQuickView({ catIdx, itemIdx: index })}
                  >
                    {/* Image Area with Hover Pill */}
                    <div
                      className={`relative w-full ${aspectClass} overflow-hidden bg-neutral-100 dark:bg-neutral-900 mb-4 transition-all duration-500`}
                      style={{ borderRadius: "var(--dt-radius)" }}
                    >
                      <InlineImage
                        section="catalog"
                        fieldKey={"categories." + catIdx + ".items." + index + ".image_url"}
                        src={item.image_url}
                        alt={item.name}
                        onUpdateField={onUpdateField}
                        isEditorMode={isEditorMode}
                        isSelected={isSelected}
                        collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />

                      {/* Floating Badge */}
                      {item.badge && (
                        <div
                          className="absolute top-4 left-4 text-[10px] uppercase tracking-widest font-semibold px-2.5 py-1 z-10 backdrop-blur-md"
                          style={{
                            backgroundColor: "var(--dt-accent)",
                            color: "var(--dt-primary-foreground)",
                            borderRadius: "var(--dt-radius)",
                          }}
                        >
                          <InlineText section="catalog" fieldKey={"categories." + catIdx + ".items." + index + ".badge"} value={item.badge ?? ""} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={isSelected} collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} as="span" />
                        </div>
                      )}

                      {/* Floating Hover Add to Cart (only on live website) */}
                      {!isEditorMode && (
                        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none md:pointer-events-auto" onClick={(e) => e.stopPropagation()}>
                          <AddToCartButton
                            itemId={item.id || `cat-ed-${catIdx}-${index}`}
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
                            className="transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 px-6 py-3 rounded-full text-xs font-medium uppercase tracking-wider flex items-center gap-2 shadow-lg cursor-pointer hover:brightness-110"
                            style={{
                              backgroundColor: "var(--dt-primary)",
                              color: "var(--dt-primary-foreground)",
                            }}
                          />
                        </div>
                      )}
                    </div>

                    {/* Metadata Area */}
                    <div className="flex flex-col flex-grow min-w-0">
                      <div className="flex flex-col gap-1 mb-2 min-w-0">
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
                          className="text-lg font-light tracking-tight"
                          style={{ color: "var(--dt-text)" }}
                        />
                        {(item.price || item.price_display || isEditorMode) && (
                          <div className="flex items-baseline gap-2 self-start flex-wrap">
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
                                  className="text-sm font-semibold tracking-tight"
                                  style={{ color: "var(--dt-primary)" }}
                                />
                                <span className="text-xs line-through opacity-50" style={{ color: "var(--dt-text)" }}>
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
                                className="text-sm font-medium tracking-tight"
                                style={{ color: "var(--dt-text)" }}
                              />
                            )}
                            {item.discount_label && (
                              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full" style={{ background: "color-mix(in srgb, var(--dt-primary) 15%, transparent)", color: "var(--dt-primary)" }}>
                                {item.discount_label}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

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
                          as="p"
                          multiline
                          className="text-sm font-light leading-relaxed mt-1"
                          style={{ color: "var(--dt-text-muted)" }}
                        />
                      )}

                      {/* View detail trigger — editorial text link */}
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setQuickView({ catIdx, itemIdx: index }); }}
                        onPointerDown={(e) => e.stopPropagation()}
                        className="mt-3 self-start text-xs font-medium tracking-wide underline underline-offset-4 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity cursor-pointer"
                        style={{ color: "var(--dt-text)" }}
                      >
                        {isEN ? "View detail" : "Lihat Detail"}
                      </button>

                      {item.capacity != null && item.capacity > 0 && (
                        <div className="mt-2">
                          <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: "color-mix(in srgb, var(--dt-primary) 10%, transparent)", color: "var(--dt-primary)" }}>
                            {isEN ? "up to" : "s/d"} <InlineText section="catalog" fieldKey={"categories." + catIdx + ".items." + index + ".capacity"} value={item.capacity != null ? String(item.capacity) : ""} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={isSelected} collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} as="span" /> {isEN ? "guests" : "tamu"}
                          </span>
                        </div>
                      )}

                      {item.features && item.features.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {item.features.map((f: string, fi: number) => (
                            <span key={fi} className="text-[11px] px-2 py-0.5 rounded-full" style={{ background: "color-mix(in srgb, var(--dt-primary) 8%, transparent)", color: "var(--dt-primary)" }}>
                              <InlineText
                                section="catalog"
                                fieldKey={"categories." + catIdx + ".items." + index + ".features." + fi}
                                value={f}
                                onUpdateField={onUpdateField}
                                isEditorMode={isEditorMode}
                                isSelected={isSelected}
                                as="span"
                                collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                                onEditingStateChange={onEditingStateChange}
                              />
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Add to Cart button — always visible (mobile & desktop) */}
                      <div className="mt-4" onClick={(e) => e.stopPropagation()}>
                        <AddToCartButton
                          itemId={item.id || `cat-ed-m-${catIdx}-${index}`}
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
                          className="w-full py-2.5 border text-xs font-medium uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer hover:brightness-110"
                          style={{
                            borderColor: "var(--dt-border)",
                            color: "var(--dt-text)",
                            borderRadius: "var(--dt-radius)",
                          }}
                        />
                      </div>
                    </div>
                  {isEditorMode && onDeleteItem && (
                    <InlineDeleteButton onDelete={() => onDeleteItem(catIdx, index)} className="absolute top-2 right-2 z-40" />
                  )}
                  </div>
                );
              })}
              {isEditorMode && onAddItem && (
                <InlineAddTile
                  label={isEN ? "Add Item" : "Tambah Item"}
                  variant="card"
                  className={`w-full rounded-2xl ${getAddTileClass(category.items?.length ?? 0)}`}
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
