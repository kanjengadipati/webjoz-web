"use client";
import React, { useState } from "react";
import { Image as ImageIcon } from "lucide-react";
import { InlineText, InlineImage, ProductQuickView, toQuickViewItem } from "../../templates/shared";
import { InlineAddTile, InlineDeleteButton, CategoryAddButton } from "../inline-add";
import { AddToCartButton } from "@/components/cart";
import type { TemplateProps, DesignToken, CatalogItem } from "../../templates/types";

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

export default function CatalogProductTable({ catalog, onUpdateField, isEditorMode, isSelected, collapseSheetForInlineEdit, onEditingStateChange, onAddItem, onDeleteItem, onAddCategory, onDeleteCategory, language = "id" }: CatalogVariantProps) {
  const isEN = language === "en";
  const [quickView, setQuickView] = useState<{ catIdx: number; itemIdx: number } | null>(null);
  if (!catalog) return null;

  const categories = catalog.categories || [];
  const qvCategory = quickView ? categories[quickView.catIdx] : undefined;
  const qvItem = qvCategory?.items?.[quickView?.itemIdx ?? -1];

  const labels = {
    photo: isEN ? "Photo" : "Foto",
    name: isEN ? "Name" : "Nama",
    category: isEN ? "Category" : "Kategori",
    price: isEN ? "Price" : "Harga",
    stock: isEN ? "Availability" : "Stok",
    action: isEN ? "Action" : "Aksi",
    available: isEN ? "Available" : "Tersedia",
    outOfStock: isEN ? "Out of stock" : "Habis",
    empty: isEN ? "No products yet." : "Belum ada produk.",
  };

  const base = (catIdx: number, itemIdx: number) => "categories." + catIdx + ".items." + itemIdx;
  const hasPromo = (item: CatalogItem) =>
    typeof item.promo_price_amount === "number" && item.promo_price_amount > 0 &&
    (typeof item.price_amount !== "number" || item.price_amount <= 0 || item.promo_price_amount < item.price_amount);

  const renderPrice = (item: CatalogItem, catIdx: number, itemIdx: number) => {
    const path = base(catIdx, itemIdx);
    const promo = hasPromo(item);
    const normalDisplay = item.price_display || item.price || "";
    return (
      <div className="flex flex-col items-start gap-0.5">
        {promo && (
          <InlineText
            section="catalog"
            fieldKey={path + ".promo_price_display"}
            value={item.promo_price_display ?? item.promo_price ?? ""}
            onUpdateField={onUpdateField}
            isEditorMode={isEditorMode}
            isSelected={isSelected}
            collapseSheetForInlineEdit={collapseSheetForInlineEdit}
            onEditingStateChange={onEditingStateChange}
            as="span"
            className="text-sm font-bold whitespace-nowrap"
            style={{ color: "var(--dt-primary)" }}
          />
        )}
        {(normalDisplay || isEditorMode) && (
          <InlineText
            section="catalog"
            fieldKey={path + ".price"}
            value={item.price ?? ""}
            onUpdateField={onUpdateField}
            isEditorMode={isEditorMode}
            isSelected={isSelected}
            collapseSheetForInlineEdit={collapseSheetForInlineEdit}
            onEditingStateChange={onEditingStateChange}
            as="span"
            className={promo ? "line-through text-xs whitespace-nowrap" : "text-sm font-semibold whitespace-nowrap"}
            style={{ color: promo ? "var(--dt-text-muted)" : "var(--dt-text)" }}
          />
        )}
      </div>
    );
  };

  const renderStock = (item: CatalogItem) => {
    const available = item.is_available !== false;
    return (
      <span
        className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap"
        style={{
          backgroundColor: available ? "color-mix(in srgb, #10b981 14%, transparent)" : "color-mix(in srgb, #f43f5e 14%, transparent)",
          color: available ? "#059669" : "#e11d48",
        }}
      >
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: available ? "#10b981" : "#f43f5e" }} />
        {available ? labels.available : labels.outOfStock}
      </span>
    );
  };

  const renderAddToCart = (item: CatalogItem, categoryName: string, catIdx: number, itemIdx: number, className: string) => (
    <div onClick={(e) => e.stopPropagation()}>
      <AddToCartButton
        itemId={item.id || `cat-pt-${catIdx}-${itemIdx}`}
        itemName={item.name}
        itemPrice={item.price_display || item.price || null}
        itemPriceAmount={item.price_amount}
        itemPriceDisplay={item.price_display || item.price}
        itemPromoPriceAmount={item.promo_price_amount}
        itemPromoPriceDisplay={item.promo_price_display}
        discountLabel={item.discount_label}
        category={categoryName}
        variant_groups={item.variant_groups}
        disabled={item.is_available === false}
        className={className}
        style={{ backgroundColor: "var(--dt-primary)", color: "var(--dt-primary-foreground)" }}
      />
    </div>
  );

  return (
    <section
      id="catalog"
      className="py-16 px-4 md:px-8"
      style={{
        backgroundColor: "var(--dt-bg)",
        color: "var(--dt-text)",
        fontFamily: "var(--dt-body-font, sans-serif)",
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center max-w-2xl mx-auto">
          {(catalog.eyebrow || isEditorMode) && (
            <InlineText
              section="catalog"
              fieldKey="eyebrow"
              value={catalog.eyebrow ?? ""}
              onUpdateField={onUpdateField}
              isEditorMode={isEditorMode}
              isSelected={isSelected}
              collapseSheetForInlineEdit={collapseSheetForInlineEdit}
              onEditingStateChange={onEditingStateChange}
              as="span"
              className="text-xs uppercase tracking-widest font-semibold block mb-2"
              style={{ color: "var(--dt-accent)", fontFamily: "var(--dt-heading-font)" }}
            />
          )}
          <InlineText
            section="catalog"
            fieldKey="title"
            value={catalog.title}
            onUpdateField={onUpdateField}
            isEditorMode={isEditorMode}
            isSelected={isSelected}
            collapseSheetForInlineEdit={collapseSheetForInlineEdit}
            onEditingStateChange={onEditingStateChange}
            as="h2"
            className="text-3xl md:text-4xl font-normal tracking-tight"
            style={{ color: "var(--dt-text)", fontFamily: "var(--dt-heading-font, serif)" }}
          />
          {(catalog.subtitle || isEditorMode) && (
            <InlineText
              section="catalog"
              fieldKey="subtitle"
              value={catalog.subtitle ?? ""}
              onUpdateField={onUpdateField}
              isEditorMode={isEditorMode}
              isSelected={isSelected}
              collapseSheetForInlineEdit={collapseSheetForInlineEdit}
              onEditingStateChange={onEditingStateChange}
              as="p"
              className="text-base font-light leading-relaxed mt-3"
              style={{ color: "var(--dt-text-muted)" }}
            />
          )}
        </div>

        {categories.length === 0 && !isEditorMode ? (
          <p className="text-center text-sm py-10" style={{ color: "var(--dt-text-muted)" }}>{labels.empty}</p>
        ) : (
          categories.map((category, catIdx) => {
            const items = category.items || [];
            return (
              <div key={catIdx} className="mb-12">
                {/* Desktop table */}
                <table className="hidden md:table w-full border-collapse text-sm">
                  <thead>
                    <tr style={{ borderBottom: "2px solid var(--dt-border)" }}>
                      <th className="text-left px-3 py-3 text-[11px] uppercase tracking-widest font-semibold w-20" style={{ color: "var(--dt-text-muted)" }}>{labels.photo}</th>
                      <th className="text-left px-3 py-3 text-[11px] uppercase tracking-widest font-semibold" style={{ color: "var(--dt-text-muted)" }}>{labels.name}</th>
                      <th className="text-left px-3 py-3 text-[11px] uppercase tracking-widest font-semibold" style={{ color: "var(--dt-text-muted)" }}>{labels.category}</th>
                      <th className="text-left px-3 py-3 text-[11px] uppercase tracking-widest font-semibold" style={{ color: "var(--dt-text-muted)" }}>{labels.price}</th>
                      <th className="text-left px-3 py-3 text-[11px] uppercase tracking-widest font-semibold" style={{ color: "var(--dt-text-muted)" }}>{labels.stock}</th>
                      <th className="text-right px-3 py-3 text-[11px] uppercase tracking-widest font-semibold" style={{ color: "var(--dt-text-muted)" }}>{labels.action}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Group header row */}
                    <tr>
                      <td colSpan={6} className="px-3 py-2" style={{ backgroundColor: "color-mix(in srgb, var(--dt-primary) 6%, transparent)" }}>
                        <div className="flex items-center gap-2">
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
                            className="text-xs uppercase tracking-widest font-bold"
                            style={{ color: "var(--dt-accent)", fontFamily: "var(--dt-heading-font)" }}
                          />
                          {isEditorMode && onDeleteCategory && (
                            <InlineDeleteButton compact onDelete={() => onDeleteCategory(catIdx)} title={isEN ? "Delete Category" : "Hapus Kategori"} />
                          )}
                        </div>
                      </td>
                    </tr>

                    {items.map((item, itemIdx) => (
                      <tr
                        key={itemIdx}
                        className="transition-colors hover:bg-[color-mix(in_srgb,var(--dt-primary)_5%,transparent)] cursor-pointer"
                        style={{ borderBottom: "1px solid var(--dt-border)", position: "relative" }}
                        onClick={() => setQuickView({ catIdx, itemIdx })}
                      >
                        <td className="px-3 py-3 align-middle">
                          <div className="w-14 h-14 overflow-hidden" style={{ borderRadius: "var(--dt-radius)" }}>
                            <InlineImage
                              section="catalog"
                              fieldKey={base(catIdx, itemIdx) + ".image_url"}
                              src={item.image_url}
                              alt={item.name}
                              onUpdateField={onUpdateField}
                              isEditorMode={isEditorMode}
                              isSelected={isSelected}
                              collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                              className="w-14 h-14 object-cover"
                              fallbackIcon={<ImageIcon className="w-5 h-5" />}
                            />
                          </div>
                        </td>
                        <td className="px-3 py-3 align-middle">
                          <div className="flex flex-col gap-0.5">
                            <InlineText
                              section="catalog"
                              fieldKey={base(catIdx, itemIdx) + ".name"}
                              value={item.name ?? ""}
                              onUpdateField={onUpdateField}
                              isEditorMode={isEditorMode}
                              isSelected={isSelected}
                              collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                              onEditingStateChange={onEditingStateChange}
                              as="span"
                              className="text-sm font-semibold"
                              style={{ color: "var(--dt-text)" }}
                            />
                            {item.badge && (
                              <span className="self-start text-[10px] uppercase tracking-widest font-bold px-2 py-0.5" style={{ backgroundColor: "var(--dt-primary)", color: "var(--dt-primary-foreground)", borderRadius: "var(--dt-radius)" }}>
                                <InlineText section="catalog" fieldKey={base(catIdx, itemIdx) + ".badge"} value={item.badge ?? ""} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={isSelected} collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} as="span" />
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-3 py-3 align-middle">
                          <span className="text-xs" style={{ color: "var(--dt-text-muted)" }}>{category.name}</span>
                        </td>
                        <td className="px-3 py-3 align-middle">{renderPrice(item, catIdx, itemIdx)}</td>
                        <td className="px-3 py-3 align-middle">{renderStock(item)}</td>
                        <td className="px-3 py-3 align-middle text-right">
                          <div className="flex items-center justify-end gap-2">
                            {renderAddToCart(item, category.name, catIdx, itemIdx, "inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded text-[11px] font-bold uppercase tracking-wider cursor-pointer hover:brightness-110")}
                            {isEditorMode && onDeleteItem && (
                              <InlineDeleteButton compact onDelete={() => onDeleteItem(catIdx, itemIdx)} />
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}

                    {isEditorMode && onAddItem && (
                      <tr>
                        <td colSpan={6} className="px-3 py-3">
                          <InlineAddTile label={isEN ? "Add Item" : "Tambah Item"} variant="bar" compact onClick={() => onAddItem(catIdx)} />
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>

                {/* Mobile stacked rows */}
                <div className="md:hidden flex flex-col gap-3">
                  <div className="flex items-center gap-2">
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
                      className="text-xs uppercase tracking-widest font-bold"
                      style={{ color: "var(--dt-accent)", fontFamily: "var(--dt-heading-font)" }}
                    />
                    {isEditorMode && onDeleteCategory && (
                      <InlineDeleteButton compact onDelete={() => onDeleteCategory(catIdx)} title={isEN ? "Delete Category" : "Hapus Kategori"} />
                    )}
                  </div>

                  {items.map((item, itemIdx) => (
                    <div
                      key={itemIdx}
                      className="relative flex gap-3 p-3 border cursor-pointer"
                      style={{ borderColor: "var(--dt-border)", backgroundColor: "var(--dt-surface)", borderRadius: "var(--dt-radius)" }}
                      onClick={() => setQuickView({ catIdx, itemIdx })}
                    >
                      <div className="w-20 h-20 shrink-0 overflow-hidden" style={{ borderRadius: "var(--dt-radius)" }}>
                        <InlineImage
                          section="catalog"
                          fieldKey={base(catIdx, itemIdx) + ".image_url"}
                          src={item.image_url}
                          alt={item.name}
                          onUpdateField={onUpdateField}
                          isEditorMode={isEditorMode}
                          isSelected={isSelected}
                          collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                          className="w-20 h-20 object-cover"
                          fallbackIcon={<ImageIcon className="w-6 h-6" />}
                        />
                      </div>
                      <div className="flex flex-col min-w-0 flex-grow">
                        <InlineText
                          section="catalog"
                          fieldKey={base(catIdx, itemIdx) + ".name"}
                          value={item.name ?? ""}
                          onUpdateField={onUpdateField}
                          isEditorMode={isEditorMode}
                          isSelected={isSelected}
                          collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                          onEditingStateChange={onEditingStateChange}
                          as="span"
                          className="text-sm font-semibold"
                          style={{ color: "var(--dt-text)" }}
                        />
                        <span className="text-[11px] mt-0.5" style={{ color: "var(--dt-text-muted)" }}>{category.name}</span>
                        <div className="mt-1">{renderPrice(item, catIdx, itemIdx)}</div>
                        <div className="mt-1.5">{renderStock(item)}</div>
                        <div className="mt-2">
                          {renderAddToCart(item, category.name, catIdx, itemIdx, "w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded text-[11px] font-bold uppercase tracking-wider cursor-pointer hover:brightness-110")}
                        </div>
                      </div>
                      {isEditorMode && onDeleteItem && (
                        <InlineDeleteButton onDelete={() => onDeleteItem(catIdx, itemIdx)} className="absolute top-2 right-2 z-30" />
                      )}
                    </div>
                  ))}

                  {isEditorMode && onAddItem && (
                    <InlineAddTile
                      label={isEN ? "Add Item" : "Tambah Item"}
                      variant="card"
                      className="rounded-2xl min-h-[140px]"
                      onClick={() => onAddItem(catIdx)}
                    />
                  )}
                </div>
              </div>
            );
          })
        )}

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
