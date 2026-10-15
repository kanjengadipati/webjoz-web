"use client";
import React, { useState } from "react";
import { Utensils } from "lucide-react";
import { InlineText, InlineImage, ProductQuickView, toQuickViewItem } from "../../templates/shared";
import { InlineAddTile, InlineDeleteButton, CategoryAddButton } from "../inline-add";
import { AddToCartButton } from "@/components/cart";
import { SectionHeader } from "../section-header";
import type { TemplateProps, DesignToken } from "../../templates/types";

interface MenuVariantProps {
  menu: TemplateProps["content"]["menu"];
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

export default function VisualShowcaseHero({ menu, onUpdateField, isEditorMode, isSelected, collapseSheetForInlineEdit, onEditingStateChange, onAddItem, onDeleteItem, onAddCategory, onDeleteCategory, language = "id" }: MenuVariantProps) {
  const isEN = language === "en";
  const [quickView, setQuickView] = useState<{ catIdx: number; itemIdx: number } | null>(null);
  if (!menu) return null;
  const { eyebrow, title, subtitle, categories } = menu;
  const qvCategory = quickView ? categories[quickView.catIdx] : undefined;
  const qvItem = qvCategory?.items?.[quickView?.itemIdx ?? -1];

  return (
    <section
      id="menu"
      className="w-full py-16 px-4 md:px-8 bg-dt-bg text-dt-text font-dt-body scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          section="menu"
          eyebrow={(eyebrow || isEditorMode) ? (eyebrow ?? "") : undefined}
          title={title}
          subtitle={(subtitle || isEditorMode) ? (subtitle ?? "") : undefined}
          wrapperClassName="text-center mb-20 max-w-3xl mx-auto"
          eyebrowClassName="text-xs font-medium tracking-widest uppercase text-dt-text-muted block mb-4 font-dt-heading"
          titleClassName="text-4xl md:text-6xl font-light tracking-tight mb-6 text-dt-text font-dt-heading"
          subtitleClassName="text-sm md:text-base text-dt-text-muted max-w-xl mx-auto italic font-light"
          divider
          dividerPlacement="beforeSubtitle"
          dividerClassName="w-16 h-[2px] bg-dt-primary mx-auto mb-6"
          onUpdateField={onUpdateField}
          isEditorMode={isEditorMode}
          isSelected={isSelected}
          collapseSheetForInlineEdit={collapseSheetForInlineEdit}
          onEditingStateChange={onEditingStateChange}
        />

        {categories.map((category, catIndex) => (
          <div
            key={category.name}
            id={`hero-category-${catIndex}`}
            className="mb-24 last:mb-0"
          >
            <div className="flex items-center justify-center gap-3 mb-12">
              <InlineText
                section="menu"
                fieldKey={"categories." + catIndex + ".name"}
                value={category.name ?? ""}
                onUpdateField={onUpdateField}
                isEditorMode={isEditorMode}
                isSelected={isSelected}
                collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                onEditingStateChange={onEditingStateChange}
                as="h3"
                className="text-2xl md:text-3xl font-normal tracking-wide text-dt-text font-dt-heading inline-block relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-1/4 after:right-1/4 after:h-[1px] after:bg-dt-border"
              />
              {isEditorMode && onDeleteCategory && (
                <InlineDeleteButton
                  compact
                  onDelete={() => onDeleteCategory(catIndex)}
                  title={isEN ? "Delete Category" : "Hapus Kategori"}
                />
              )}


            </div>

            <div
              id={`hero-grid-${catIndex}`}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
            >
              {category.items.map((item, itemIndex) => {
                const badge = (item as { badge?: string }).badge;
                const hasBadge = !!badge;

                return (
                  <div
                    key={item.id || item.name}
                    id={`hero-item-${catIndex}-${itemIndex}`}
                    className="group flex flex-col bg-dt-surface rounded-dt overflow-hidden border border-dt-border/50 hover:shadow-xl hover:border-dt-border transition-all duration-300 h-[560px] cursor-pointer"
                    onClick={() => setQuickView({ catIdx: catIndex, itemIdx: itemIndex })}
                  >
                    <div className="relative h-[390px] w-full overflow-hidden bg-dt-accent/5">
                      <InlineImage
                        section="menu"
                        fieldKey={"categories." + catIndex + ".items." + itemIndex + ".image_url"}
                        src={item.image_url}
                        alt={item.name}
                        onUpdateField={onUpdateField}
                        isEditorMode={isEditorMode}
                        isSelected={isSelected}
                        collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />

                      {hasBadge && (
                        <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-black/40 to-transparent pointer-events-none"></div>
                      )}

                      {(badge || isEditorMode) && (
                        <div
                          id={`hero-badge-${catIndex}-${itemIndex}`}
                          className="absolute top-4 left-4 bg-white/90 dark:bg-black/80 backdrop-blur-xs text-dt-text text-[10px] font-semibold tracking-widest uppercase px-3 py-1.5 border border-dt-border rounded-none shadow-xs font-dt-heading"
                        >
                          <InlineText
                          section="menu"
                          fieldKey={"categories." + catIndex + ".items." + itemIndex + ".badge"}
                          value={badge ?? ""}
                          onUpdateField={onUpdateField}
                          isEditorMode={isEditorMode}
                          isSelected={isSelected}
                          collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                          onEditingStateChange={onEditingStateChange}
                          as="span"
                        />
                        </div>
                      )}

                      {isEditorMode && onDeleteItem && (
                        <InlineDeleteButton
                          onDelete={() => onDeleteItem(catIndex, itemIndex)}
                          className="absolute top-4 right-4 z-20"
                        />
                      )}

                      {/* View detail trigger */}
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setQuickView({ catIdx: catIndex, itemIdx: itemIndex }); }}
                        onPointerDown={(e) => e.stopPropagation()}
                        className={`absolute bottom-4 ${isEditorMode && onDeleteItem ? "right-14" : "right-4"} z-10 bg-white/90 dark:bg-black/80 backdrop-blur-xs text-dt-text text-[10px] font-semibold tracking-widest uppercase px-3 py-1.5 border border-dt-border rounded-none shadow-xs font-dt-heading opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity cursor-pointer`}
                      >
                        {isEN ? "View detail" : "Lihat Detail"}
                      </button>

                      {/* Order trigger */}
                      <div className="absolute bottom-4 left-4 z-10" onClick={(e) => e.stopPropagation()}>
                        <AddToCartButton
                          itemId={item.id || `menu-hero-${catIndex}-${itemIndex}`}
                          itemName={item.name ?? ""}
                          itemPrice={item.price_display || item.price || null}
                          itemPriceAmount={item.price_amount}
                          itemPriceDisplay={item.price_display || item.price}
                          itemPromoPriceAmount={item.promo_price_amount}
                          itemPromoPriceDisplay={item.promo_price_display}
                          discountLabel={item.discount_label}
                          itemDescription={item.description}
                          category={category.name ?? ""}
                          variant_groups={item.variant_groups}
                          disabled={item.is_available === false}
                          className="inline-flex items-center gap-1 bg-dt-primary text-dt-primary-foreground text-[10px] font-semibold tracking-widest uppercase px-3 py-1.5 border border-dt-border rounded-none shadow-xs font-dt-heading cursor-pointer transition-all hover:brightness-110"
                        />
                      </div>
                    </div>

                    <div className="flex-1 p-6 flex flex-col justify-between bg-dt-surface">
                      <div className="flex items-start justify-between gap-4">
                        <InlineText section="menu" fieldKey={"categories." + catIndex + ".items." + itemIndex + ".name"} value={item.name ?? ""} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={isSelected} collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} as="h4" className="min-w-0 flex-1 text-lg font-medium tracking-tight font-dt-heading text-dt-text leading-snug group-hover:text-dt-primary transition-colors duration-300" />
                        {item.price && (
                          <InlineText section="menu" fieldKey={"categories." + catIndex + ".items." + itemIndex + ".price"} value={item.price ?? ""} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={isSelected} collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} as="span" className="shrink-0 whitespace-nowrap text-base font-semibold font-dt-heading text-dt-primary" />
                        )}
                      </div>

                      {item.description && (
                        <InlineText section="menu" fieldKey={"categories." + catIndex + ".items." + itemIndex + ".description"} value={item.description ?? ""} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={isSelected} collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} as="p" multiline className="text-xs md:text-sm text-dt-text-muted font-light leading-relaxed line-clamp-2 mt-2" />
                      )}

                      <div className="w-full h-[1px] bg-dt-border/40 mt-4"></div>
                    </div>
                  </div>
                );
              })}
              {isEditorMode && onAddItem && (
                <InlineAddTile
                  label="Tambah Item"
                  variant="card"
                  className="rounded-2xl min-h-[160px]"
                  onClick={() => onAddItem(catIndex)}
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
          editSection="menu"
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
