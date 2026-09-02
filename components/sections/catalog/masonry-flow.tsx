"use client";
import React from "react";
import { InlineText, InlineImage } from "../../templates/shared";
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
}

export default function CatalogMasonryFlow({ catalog, onUpdateField, isEditorMode, isSelected, collapseSheetForInlineEdit, onEditingStateChange }: CatalogVariantProps) {
  if (!catalog) return null;
  const { eyebrow, title, subtitle, categories } = catalog;

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
      <div className="mb-16 text-center max-w-2xl mx-auto">
        {eyebrow && (
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
            className="text-xs uppercase tracking-widest font-semibold block mb-2"
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
          className="text-3xl md:text-4xl font-normal tracking-tight mb-4"
          style={{
            color: "var(--dt-text)",
            fontFamily: "var(--dt-heading-font, serif)"
          }}
        />
        {subtitle && (
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
            className="text-base font-light leading-relaxed"
            style={{ color: "var(--dt-text-muted)" }}
          />
        )}
      </div>

      {/* Categories */}
      <div className="space-y-24">
        {categories?.map((category, catIdx) => (
          <div key={catIdx} className="space-y-8">
            <div className="border-b pb-3" style={{ borderColor: "var(--dt-border)" }}>
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
                style={{ fontFamily: "var(--dt-heading-font)", color: "var(--dt-accent)" }}
              />
            </div>

            {/* Vertical CSS Masonry Columns */}
            <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 [column-fill:_balance]">
              {category.items?.map((item, index) => (
                <div
                  key={index}
                  className="break-inside-avoid mb-6 flex flex-col group relative border overflow-hidden transition-all duration-300"
                  style={{
                    borderColor: "var(--dt-border)",
                    backgroundColor: "var(--dt-surface)",
                    borderRadius: "var(--dt-radius)",
                  }}
                >
                  {/* Image area */}
                  <div className="relative w-full overflow-hidden bg-neutral-100 dark:bg-neutral-900">
                    <InlineImage
                      section="catalog"
                      fieldKey={"categories." + catIdx + ".items." + index + ".image_url"}
                      src={item.image_url}
                      alt={item.name}
                      onUpdateField={onUpdateField}
                      isEditorMode={isEditorMode}
                      isSelected={isSelected}
                      collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                      className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-102"
                    />

                    {/* Badge */}
                    {item.badge && (
                      <div
                        className="absolute top-3 left-3 text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 z-10"
                        style={{
                          backgroundColor: "var(--dt-primary)",
                          color: "var(--dt-primary-foreground)",
                          borderRadius: "var(--dt-radius)",
                        }}
                      >
                        {item.badge}
                      </div>
                    )}

                    {/* Hover Overlay Button (only on live website) */}
                    {!isEditorMode && (
                      <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4">
                        <AddToCartButton
                          itemId={item.id || `cat-mf-${catIdx}-${index}`}
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
                          className="w-full py-2 px-4 rounded text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 shadow transition-transform duration-300 translate-y-2 group-hover:translate-y-0 cursor-pointer hover:brightness-110"
                          style={{
                            backgroundColor: "var(--dt-primary)",
                            color: "var(--dt-primary-foreground)",
                          }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Metadata area */}
                  <div className="p-4 flex flex-col flex-grow">
                    <div className="flex justify-between items-start gap-4 mb-1">
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
                        className="text-sm font-medium tracking-tight"
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
                          className="text-sm font-semibold tracking-tight shrink-0"
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
                        className="text-xs leading-relaxed mt-2"
                        style={{ color: "var(--dt-text-muted)" }}
                      />
                    )}

                    {item.capacity != null && item.capacity > 0 && (
                      <div className="mt-2">
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full" style={{ background: "color-mix(in srgb, var(--dt-primary) 10%, transparent)", color: "var(--dt-primary)" }}>
                          s/d {item.capacity} tamu
                        </span>
                      </div>
                    )}

                    {item.features && item.features.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {item.features.map((f: string, fi: number) => (
                          <span key={fi} className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: "color-mix(in srgb, var(--dt-primary) 8%, transparent)", color: "var(--dt-primary)" }}>
                            {f}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Mobile Add to Cart */}
                    <div className="mt-4 md:hidden">
                      <AddToCartButton
                        itemId={item.id || `cat-mf-m-${catIdx}-${index}`}
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
                        className="w-full py-2 border text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer hover:brightness-110"
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
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
