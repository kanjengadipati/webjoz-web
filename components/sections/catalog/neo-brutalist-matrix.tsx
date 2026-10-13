"use client";
import React, { useState } from "react";
import { Image as _ImageIcon } from "lucide-react";
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

export default function CatalogNeoBrutalistMatrix({ catalog, onUpdateField, isEditorMode, isSelected, collapseSheetForInlineEdit, onEditingStateChange, onAddItem, onDeleteItem, onAddCategory, onDeleteCategory, language = "id"}: CatalogVariantProps) {
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
      {/* Header with High-Contrast Layout */}
      <div
        className="mb-16 p-8 border-[3px] border-solid"
        style={{
          borderColor: "var(--dt-border)",
          backgroundColor: "var(--dt-surface)",
          boxShadow: "6px 6px 0px 0px var(--dt-accent)",
          borderRadius: "var(--dt-radius, 0px)"
        }}
      >
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
            className="text-xs font-black uppercase tracking-wider inline-block px-2 py-0.5 border-2 mb-3"
            style={{
              borderColor: "var(--dt-border)",
              backgroundColor: "var(--dt-accent)",
              color: "var(--dt-primary-foreground)"
            }}
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
          className="text-3xl md:text-5xl font-extrabold tracking-tight uppercase mb-4"
          style={{
            color: "var(--dt-text)",
            fontFamily: "var(--dt-heading-font, sans-serif)"
          }}
        />
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
            className="text-base font-bold leading-relaxed max-w-3xl"
            style={{ color: "var(--dt-text)" }}
          />
        )}
      </div>

      {/* Categories */}
      <div className="space-y-24">
        {categories?.map((category, catIdx) => (
          <div key={catIdx} className="space-y-8">
            <div className="flex items-center gap-3">
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
                className="text-2xl font-black uppercase tracking-wider inline-block border-b-4 pb-1"
                style={{
                  fontFamily: "var(--dt-heading-font)",
                  borderColor: "var(--dt-accent)"
                }}
              />
              {isEditorMode && onDeleteCategory && (
                <InlineDeleteButton
                  compact
                  onDelete={() => onDeleteCategory(catIdx)}
                  title={isEN ? "Delete Category" : "Hapus Kategori"}
                />
              )}
            </div>

            {/* Matrix Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {category.items?.map((item, index) => (
                <div
                  key={index}
                  className="group flex flex-col border-[3px] border-solid transition-all duration-200 hover:-translate-x-1 hover:-translate-y-1 min-w-0 relative cursor-pointer"
                  onClick={() => setQuickView({ catIdx, itemIdx: index })}
                  style={{
                    borderColor: "var(--dt-border)",
                    backgroundColor: "var(--dt-surface)",
                    boxShadow: "6px 6px 0px 0px var(--dt-accent)",
                    borderRadius: "var(--dt-radius, 0px)"
                  }}
                >
                  {/* Image Container */}
                  <div className="relative aspect-square overflow-hidden border-b-[3px] border-solid" style={{ borderColor: "var(--dt-border)" }}>
                    <InlineImage
                      section="catalog"
                      fieldKey={"categories." + catIdx + ".items." + index + ".image_url"}
                      src={item.image_url}
                      alt={item.name}
                      onUpdateField={onUpdateField}
                      isEditorMode={isEditorMode}
                      isSelected={isSelected}
                      collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                      className="w-full h-full object-cover"
                    />

                    {/* Left corner Badge */}
                    {item.badge && (
                      <div
                        className="absolute top-3 left-3 text-xs font-black uppercase tracking-wider px-2 py-1 border-2 border-solid"
                        style={{
                          backgroundColor: "var(--dt-bg)",
                          color: "var(--dt-text)",
                          borderColor: "var(--dt-border)"
                        }}
                      >
                        <InlineText section="catalog" fieldKey={"categories." + catIdx + ".items." + index + ".badge"} value={item.badge ?? ""} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={isSelected} collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} as="span" />
                      </div>
                    )}

                    {/* View detail trigger — brutalist chip */}
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setQuickView({ catIdx, itemIdx: index }); }}
                      onPointerDown={(e) => e.stopPropagation()}
                      className="absolute top-3 right-3 z-20 text-[11px] font-black uppercase tracking-wider px-2 py-1 border-2 border-solid opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity cursor-pointer"
                      style={{ backgroundColor: "var(--dt-surface)", color: "var(--dt-text)", borderColor: "var(--dt-border)" }}
                    >
                      {isEN ? "Detail" : "Lihat"}
                    </button>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-grow flex flex-col justify-between">
                    <div>
                      <div className="flex flex-col gap-2 mb-4 min-w-0">
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
                          className="text-lg font-black uppercase tracking-tight"
                          style={{ color: "var(--dt-text)" }}
                        />

                        {/* Large Bold Price Tag */}
                        {item.price && (
                          <div className="self-start max-w-full">
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
                              className="inline-block text-sm sm:text-base font-black uppercase tracking-wider px-2.5 py-1 border-[3px] border-solid break-words max-w-full"
                              style={{
                                borderColor: "var(--dt-border)",
                                backgroundColor: "var(--dt-accent)",
                                color: "var(--dt-primary-foreground)"
                              }}
                            />
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
                          className="text-sm font-bold leading-relaxed mb-6"
                          style={{ color: "var(--dt-text-muted)" }}
                        />
                      )}

                      {item.capacity != null && item.capacity > 0 && (
                        <div className="mb-2">
                          <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase px-2 py-0.5 border-2" style={{ borderColor: "var(--dt-border)", background: "var(--dt-accent)", color: "var(--dt-primary-foreground)" }}>
                            s/d <InlineText section="catalog" fieldKey={"categories." + catIdx + ".items." + index + ".capacity"} value={item.capacity != null ? String(item.capacity) : ""} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={isSelected} collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} as="span" /> tamu
                          </span>
                        </div>
                      )}

                      {item.features && item.features.length > 0 && (
                        <div className="mb-4 flex flex-wrap gap-1">
                          {item.features.map((f: string, fi: number) => (
                            <span key={fi} className="text-[10px] font-bold uppercase px-2 py-0.5 border-2" style={{ borderColor: "var(--dt-border)", color: "var(--dt-text)" }}>
                              {f}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Row with action circular button */}
                    <div className="flex justify-between items-center mt-auto pt-4 border-t-2 border-dashed" style={{ borderColor: "var(--dt-border)" }}>
                      <span className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                        Spec.
                      </span>

                      {/* Circular "Add" button */}
                    <AddToCartButton
                      itemId={item.id || `cat-nbm-${catIdx}-${index}`}
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
                      className="w-12 h-12 rounded-full border-[3px] border-solid flex items-center justify-center transition-all duration-200 hover:scale-110 active:translate-x-0.5 active:translate-y-0.5 cursor-pointer p-0"
                      style={{
                        borderColor: "var(--dt-border)",
                        backgroundColor: "var(--dt-primary)",
                        color: "var(--dt-primary-foreground)",
                        boxShadow: "2px 2px 0px 0px var(--dt-text)",
                      }}
                    />
                    </div>
                  </div>
                  {isEditorMode && onDeleteItem && (
                    <InlineDeleteButton
                      onDelete={() => onDeleteItem(catIdx, index)}
                      className="absolute top-2.5 right-2.5 z-40"
                    />
                  )}
                </div>
              ))}
              {isEditorMode && onAddItem && (
                <InlineAddTile
                  label="Tambah Item"
                  variant="card"
                  className="rounded-none border-4 border-black dark:border-white"
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
