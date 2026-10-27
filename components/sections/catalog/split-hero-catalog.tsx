"use client";
import React, { useState } from "react";
import { ArrowRight, Image as ImageIcon } from "lucide-react";
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

export default function CatalogSplitHeroCatalog({ catalog, onUpdateField, isEditorMode, isSelected, collapseSheetForInlineEdit, onEditingStateChange, onAddItem, onDeleteItem, onAddCategory, onDeleteCategory, language = "id"}: CatalogVariantProps) {
  const isEN = language === "en";
  const [quickView, setQuickView] = useState<{ catIdx: number; itemIdx: number } | null>(null);
  if (!catalog) return null;
  const { eyebrow, title, subtitle, categories } = catalog;
  const qvCategory = quickView ? categories[quickView.catIdx] : undefined;
  const qvItem = qvCategory?.items?.[quickView?.itemIdx ?? -1];

  // Extract first image for sticky brand panel
  const brandImage = categories?.[0]?.items?.[0]?.image_url || null;

  return (
    <section
      id="catalog"
      className="py-12 md:py-20 px-4 md:px-8 max-w-7xl mx-auto"
      style={{
        backgroundColor: "var(--dt-bg)",
        color: "var(--dt-text)",
        fontFamily: "var(--dt-body-font, sans-serif)",
      }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

        {/* Left Pane: Sticky Brand Visual & Header */}
        <div className="lg:col-span-5 lg:sticky lg:top-8 space-y-8 flex flex-col justify-between h-auto">
          <SectionHeader
            section="catalog"
            eyebrow={(eyebrow || isEditorMode) ? (eyebrow ?? "") : undefined}
            title={title}
            subtitle={(subtitle || isEditorMode) ? (subtitle ?? "") : undefined}
            eyebrowClassName="text-xs uppercase tracking-widest font-semibold block mb-3"
            eyebrowStyle={{ color: "var(--dt-accent)", fontFamily: "var(--dt-heading-font)" }}
            titleClassName="text-4xl md:text-5xl font-light tracking-tight leading-tight mb-4"
            titleStyle={{
              color: "var(--dt-text)",
              fontFamily: "var(--dt-heading-font, serif)",
            }}
            subtitleClassName="text-base md:text-lg font-light leading-relaxed mb-6"
            subtitleStyle={{ color: "var(--dt-text-muted)" }}
            onUpdateField={onUpdateField}
            isEditorMode={isEditorMode}
            isSelected={isSelected}
            collapseSheetForInlineEdit={collapseSheetForInlineEdit}
            onEditingStateChange={onEditingStateChange}
          />

          {/* Large Sticky Brand Image */}
          <div
            className="relative w-full aspect-[4/3] lg:aspect-[3/4] overflow-hidden bg-neutral-100 dark:bg-neutral-900 border"
            style={{
              borderRadius: "var(--dt-radius)",
              borderColor: "var(--dt-border)"
            }}
          >
            {brandImage || isEditorMode ? (
              <InlineImage
                section="catalog"
                fieldKey="categories.0.items.0.image_url"
                src={brandImage ?? ""}
                alt="Catalog visual"
                onUpdateField={onUpdateField}
                isEditorMode={isEditorMode}
                isSelected={isSelected}
                className="w-full h-full object-cover transition-transform duration-1000 ease-out hover:scale-102"
                style={{ width: "100%", height: "100%" }}
                collapseSheetForInlineEdit={collapseSheetForInlineEdit}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-neutral-400">
                <ImageIcon size={48} strokeWidth={1} />
              </div>
            )}

            {/* Visual overlay indicator */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/40 to-transparent p-6 flex items-end">
              <span className="text-white text-xs uppercase tracking-widest font-semibold flex items-center gap-2">
                <InlineText
                  section="catalog"
                  fieldKey={"categories.0.name"}
                  value={categories?.[0]?.name ?? ""}
                  onUpdateField={onUpdateField}
                  isEditorMode={isEditorMode}
                  isSelected={isSelected}
                  collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                  onEditingStateChange={onEditingStateChange}
                  as="span"
                />{" "}
                <ArrowRight size={14} />
              </span>
            </div>
          </div>
        </div>

        {/* Right Pane: Scrollable Products List */}
        <div className="lg:col-span-7 space-y-20">
          {categories?.map((category, catIdx) => (
            <div key={catIdx} className="space-y-8">
              <div className="border-b pb-4 flex justify-between items-end" style={{ borderColor: "var(--dt-border)" }}>
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
                  className="text-xl font-light tracking-wide uppercase"
                  style={{ fontFamily: "var(--dt-heading-font)" }}
                />
                {isEditorMode && onDeleteCategory && (
                  <InlineDeleteButton
                    compact
                    onDelete={() => onDeleteCategory(catIdx)}
                    title={isEN ? "Delete Category" : "Hapus Kategori"}
                  />
                )}
                <span className="text-xs text-neutral-400 font-mono">
                  {category.items?.length} items
                </span>
              </div>

              {/* Stacked Product Cards */}
              <div className="space-y-12">
                {category.items?.map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start pb-12 border-b last:border-b-0 last:pb-0 group cursor-pointer"
                    onClick={() => setQuickView({ catIdx, itemIdx: index })}
                    style={{ borderColor: "var(--dt-border)" }}
                  >
                    {/* Image Column */}
                    <div
                      className="md:col-span-5 relative aspect-[4/3] w-full overflow-hidden bg-neutral-100 dark:bg-neutral-900"
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
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                      />

                      {/* Badge */}
                      {item.badge && (
                        <div
                          className="absolute top-3 left-3 text-[10px] uppercase tracking-widest font-semibold px-2 py-0.5 z-10"
                          style={{
                            backgroundColor: "var(--dt-accent)",
                            color: "var(--dt-primary-foreground)",
                            borderRadius: "var(--dt-radius)",
                          }}
                        >
                          <InlineText section="catalog" fieldKey={"categories." + catIdx + ".items." + index + ".badge"} value={item.badge ?? ""} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={isSelected} collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} as="span" />
                        </div>
                      )}
                      {isEditorMode && onDeleteItem && (
                        <InlineDeleteButton onDelete={() => onDeleteItem(catIdx, index)} className="absolute top-2.5 right-2.5 z-40" />
                      )}
                    </div>

                    {/* Content Column */}
                    <div className="md:col-span-7 flex flex-col justify-between h-full min-h-[160px] min-w-0">
                      <div>
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
                            className="text-lg font-normal tracking-tight"
                            style={{ color: "var(--dt-text)" }}
                          />
                          {item.price && (
                            <InlineText
                              section="catalog"
                              fieldKey={"categories." + catIdx + ".items." + index + ".price"}
                              value={item.price ?? ""}
                              onUpdateField={onUpdateField}
                              isEditorMode={isEditorMode}
                              isSelected={isSelected}
                              collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                              onEditingStateChange={onEditingStateChange}
                              as="span"
                              className="text-base font-semibold tracking-tight self-start"
                              style={{ color: "var(--dt-text)" }}
                            />
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
                            className="text-sm font-light leading-relaxed mb-4"
                            style={{ color: "var(--dt-text-muted)" }}
                          />
                        )}

                        {item.capacity != null && item.capacity > 0 && (
                          <div className="mb-2">
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full" style={{ background: "color-mix(in srgb, var(--dt-primary) 10%, transparent)", color: "var(--dt-primary)" }}>
                              {isEN ? "up to" : "s/d"} <InlineText section="catalog" fieldKey={"categories." + catIdx + ".items." + index + ".capacity"} value={item.capacity != null ? String(item.capacity) : ""} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={isSelected} collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} as="span" /> {isEN ? "guests" : "tamu"}
                            </span>
                          </div>
                        )}

                        {item.features && item.features.length > 0 && (
                          <div className="mb-4 flex flex-wrap gap-1">
                            {item.features.map((f: string, fi: number) => (
                              <span key={fi} className="text-[11px] px-2 py-0.5 rounded-full" style={{ background: "color-mix(in srgb, var(--dt-primary) 8%, transparent)", color: "var(--dt-primary)" }}>
                                {f}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* View detail trigger */}
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setQuickView({ catIdx, itemIdx: index }); }}
                          onPointerDown={(e) => e.stopPropagation()}
                          className="self-start text-xs font-medium tracking-wide uppercase underline underline-offset-4 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity cursor-pointer"
                          style={{ color: "var(--dt-text)" }}
                        >
                          {isEN ? "View detail" : "Lihat Detail"}
                        </button>
                      </div>

                      {/* Pinned Add to Cart */}
                      <div onClick={(e) => e.stopPropagation()}>
                        <AddToCartButton
                          itemId={item.id || `cat-sh-${catIdx}-${index}`}
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
                          className="px-6 py-2.5 border text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer hover:brightness-110"
                          style={{
                            borderColor: "var(--dt-border)",
                            color: "var(--dt-text)",
                            borderRadius: "var(--dt-radius)",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                {isEditorMode && onAddItem && (
                  <InlineAddTile
                    label={isEN ? "Add Item" : "Tambah Item"}
                    variant="card"
                    className="rounded-2xl min-h-[160px] w-full"
                    onClick={() => onAddItem(catIdx)}
                  />
                )}
              </div>
            </div>
          ))}
          {isEditorMode && onAddCategory && (
            <div className="flex justify-center pt-4">
              <CategoryAddButton onAdd={onAddCategory} isEN={isEN} collapseSheetForInlineEdit={collapseSheetForInlineEdit} />
            </div>
          )}
        </div>
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
