"use client";
import React from "react";
import { Image as ImageIcon } from "lucide-react";
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

export default function CatalogEditorialGrid({ catalog, onUpdateField, isEditorMode, isSelected, collapseSheetForInlineEdit, onEditingStateChange }: CatalogVariantProps) {
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
      <div className="mb-16 max-w-2xl">
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
            className="text-xs uppercase tracking-widest font-medium block mb-3"
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
          className="text-4xl md:text-5xl font-light tracking-tight mb-4"
          style={{
            color: "var(--dt-text)",
            fontFamily: "var(--dt-heading-font)",
            fontWeight: "var(--dt-heading-weight, 300)" as any,
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
            multiline
            className="text-base font-light leading-relaxed"
            style={{ color: "var(--dt-text-muted)" }}
          />
        )}
      </div>

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
                    className={`${colSpanClass} flex flex-col group relative`}
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
                          {item.badge}
                        </div>
                      )}

                      {/* Floating Hover Add to Cart (only on live website) */}
                      {!isEditorMode && (
                        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none md:pointer-events-auto">
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
                    <div className="flex flex-col flex-grow">
                      <div className="flex justify-between items-start gap-4 mb-2">
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
                            className="text-sm font-medium tracking-tight"
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
                          className="text-sm font-light leading-relaxed mt-1"
                          style={{ color: "var(--dt-text-muted)" }}
                        />
                      )}

                      {item.capacity != null && item.capacity > 0 && (
                        <div className="mt-2">
                          <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: "color-mix(in srgb, var(--dt-primary) 10%, transparent)", color: "var(--dt-primary)" }}>
                            s/d {item.capacity} tamu
                          </span>
                        </div>
                      )}

                      {item.features && item.features.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {item.features.map((f: string, fi: number) => (
                            <span key={fi} className="text-[11px] px-2 py-0.5 rounded-full" style={{ background: "color-mix(in srgb, var(--dt-primary) 8%, transparent)", color: "var(--dt-primary)" }}>
                              {f}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Add to Cart button — always visible (mobile & desktop) */}
                      <div className="mt-4">
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
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
