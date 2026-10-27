"use client";
import React, { useState, useRef } from "react";
import { ChevronLeft, ChevronRight, Utensils, Image as ImageIcon } from "lucide-react";
import { MenuCatalogCard, InlineText, type MenuCatalogCardStyles } from "../../templates/shared";
import { InlineAddTile, InlineDeleteButton, CategoryAddButton } from "../inline-add";
import { SectionHeader } from "../section-header";
import { productCategories, type ProductVariantProps } from "./types";

export default function ProductHorizontalSwipeCarousel({
  kind, data, design_token, onUpdateField, isEditorMode, isSelected, collapseSheetForInlineEdit, onEditingStateChange,
  onAddItem, onDeleteItem, onAddCategory, onDeleteCategory, language = "id",
}: ProductVariantProps) {
  const isEN = language === "en";
  const isMenu = kind === "menu";
  const [activeCategoryIdx, setActiveCategoryIdx] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  if (!data) return null;
  const categories = productCategories(data);
  const safeActiveIdx = categories.length ? Math.min(activeCategoryIdx, categories.length - 1) : 0;
  const activeCategory = categories[safeActiveIdx];

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      const scrollAmount = clientWidth * 0.75;
      scrollContainerRef.current.scrollTo({
        left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const brandBg = "var(--dt-bg)";
  const brandPrimary = "var(--dt-primary)";
  const brandText = "var(--dt-text)";
  const headingFont = "var(--dt-heading-font)";
  const headingWeight = "var(--dt-heading-weight)";
  const dtRadius = "var(--dt-radius)";

  const cardStyles: MenuCatalogCardStyles = {
    className: "h-full transition-all duration-300 group-hover:shadow-lg",
    style: {
      background: brandBg,
      border: `1px solid color-mix(in srgb, ${brandPrimary} 12%, transparent)`,
      borderRadius: dtRadius,
      overflow: "hidden",
      cursor: "pointer",
    },
    image: { className: "w-full aspect-[4/3] object-cover" },
    placeholder: { className: "w-full aspect-[4/3] flex items-center justify-center", style: { background: `color-mix(in srgb, ${brandPrimary} 8%, transparent)` }, iconClassName: "w-10 h-10", iconStyle: { color: `color-mix(in srgb, ${brandPrimary} 35%, transparent)` } },
    content: { className: "flex flex-col gap-2 p-4" },
    title: { className: "font-semibold text-base leading-tight", style: { color: brandText, fontFamily: headingFont } },
    description: { className: "text-sm leading-relaxed line-clamp-2", style: { color: `color-mix(in srgb, ${brandText} 70%, transparent)` } },
    price: { className: "text-sm font-bold px-2 py-0.5 rounded-full self-start", style: { background: `color-mix(in srgb, ${brandPrimary} 12%, transparent)`, color: brandPrimary } },
    button: { className: "mt-2 w-full flex items-center justify-center gap-2 text-sm font-semibold py-2 px-4 rounded-lg transition-all hover:brightness-110", style: { background: brandPrimary, color: brandBg, border: "none" } },
  };

  const eyebrowDefault = isMenu ? "Pilihan Menu" : "Koleksi Produk";
  const Icon = isMenu ? Utensils : ImageIcon;

  return (
    <section
      id={kind}
      className="py-16 px-4 md:px-8 max-w-7xl mx-auto overflow-hidden"
      style={{
        backgroundColor: brandBg,
        color: brandText,
        fontFamily: "var(--dt-body-font, sans-serif)",
        paddingTop: "var(--dt-spacing)",
        paddingBottom: "var(--dt-spacing)",
      }}
    >
      {/* Header */}
      <div className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <SectionHeader
          section={kind}
          eyebrow={(data.eyebrow || isEditorMode) ? (data.eyebrow ?? eyebrowDefault) : undefined}
          title={data.title}
          subtitle={(data.subtitle || isEditorMode) ? (data.subtitle ?? "") : undefined}
          wrapperClassName="max-w-xl"
          eyebrowClassName="text-xs uppercase tracking-widest font-semibold block mb-2"
          eyebrowStyle={{ color: brandPrimary, fontFamily: headingFont }}
          titleClassName="text-3xl md:text-4xl font-normal tracking-tight mb-3"
          titleStyle={{
            color: brandText,
            fontFamily: headingFont,
            fontWeight: headingWeight as React.CSSProperties["fontWeight"],
          }}
          subtitleClassName="text-base font-light leading-relaxed"
          subtitleStyle={{ color: "var(--dt-text-muted)" }}
          onUpdateField={onUpdateField}
          isEditorMode={isEditorMode}
          isSelected={isSelected}
          collapseSheetForInlineEdit={collapseSheetForInlineEdit}
          onEditingStateChange={onEditingStateChange}
        />

        {/* Desktop Slide Controls */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={() => scroll("left")}
            className="w-10 h-10 border flex items-center justify-center transition-colors duration-200"
            style={{ borderColor: "var(--dt-border)", backgroundColor: "var(--dt-surface)", borderRadius: dtRadius }}
            aria-label={isEN ? "Scroll left" : "Geser kiri"}
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => scroll("right")}
            className="w-10 h-10 border flex items-center justify-center transition-colors duration-200"
            style={{ borderColor: "var(--dt-border)", backgroundColor: "var(--dt-surface)", borderRadius: dtRadius }}
            aria-label={isEN ? "Scroll right" : "Geser kanan"}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex border-b mb-10 overflow-x-auto scrollbar-none" style={{ borderColor: "var(--dt-border)" }}>
        {categories.map((category, idx) => {
          const isActive = idx === safeActiveIdx;
          return (
            <span key={idx} className="relative inline-block">
              <button
                onClick={() => {
                  setActiveCategoryIdx(idx);
                  if (scrollContainerRef.current) {
                    scrollContainerRef.current.scrollLeft = 0;
                  }
                }}
                className="py-4 px-6 text-sm font-medium uppercase tracking-wider relative whitespace-nowrap transition-colors duration-200"
                style={{ color: isActive ? brandText : "var(--dt-text-muted)", fontFamily: headingFont }}
              >
                <InlineText
                  section={kind}
                  fieldKey={"categories." + idx + ".name"}
                  value={category.name ?? ""}
                  onUpdateField={onUpdateField}
                  isEditorMode={isEditorMode}
                  isSelected={isSelected}
                  collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                  onEditingStateChange={onEditingStateChange}
                  as="span"
                  style={{ color: isActive ? brandText : "var(--dt-text-muted)", fontFamily: headingFont }}
                />
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: brandPrimary }} />
                )}
              </button>
              {isEditorMode && onDeleteCategory && (
                <InlineDeleteButton
                  compact
                  className="absolute -top-1.5 -right-1.5 z-40"
                  onDelete={() => onDeleteCategory(idx)}
                  title={isEN ? "Delete Category" : "Hapus Kategori"}
                />
              )}
            </span>
          );
        })}
        {isEditorMode && onAddCategory && (
          <CategoryAddButton
            onAdd={onAddCategory}
            isEN={isEN}
            collapseSheetForInlineEdit={collapseSheetForInlineEdit}
          />
        )}
      </div>

      {/* Carousel Snap Row Container */}
      {activeCategory && (
        <div className="relative">
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-6 scrollbar-thin scroll-smooth"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {activeCategory.items?.map((item, index) => {
              const cardKey = item.id || `${kind}-hsc-${safeActiveIdx}-${index}`;
              return (
                <div
                  key={cardKey}
                  className="w-[82%] max-w-[360px] sm:w-auto sm:max-w-none sm:min-w-[320px] md:min-w-[360px] snap-start flex-shrink-0 flex flex-col group relative"
                  style={{ borderRadius: dtRadius }}
                >
                  <MenuCatalogCard
                    layout={design_token?.layout?.card_style ?? "grid"}
                    item={{
                      id: cardKey,
                      name: item.name,
                      price: item.price,
                      priceAmount: item.price_amount,
                      priceDisplay: item.price_display,
                      promoPriceAmount: item.promo_price_amount,
                      promoPriceDisplay: item.promo_price_display,
                      discountLabel: item.discount_label,
                      description: item.description,
                      category: activeCategory.name,
                      image_url: item.image_url,
                      image_urls: item.image_urls,
                      image_credit: item.image_credit,
                      is_available: item.is_available,
                      variant_groups: item.variant_groups,
                      ...(isMenu
                        ? { tags: item.tags, delivery_platforms: item.delivery_platforms }
                        : { badge: item.badge, features: item.features, maxFeatures: 2, capacity: item.capacity }),
                    }}
                    icon={Icon}
                    styles={cardStyles}
                    editSection={kind}
                    pathBase={"categories." + safeActiveIdx + ".items." + index}
                    onUpdateField={onUpdateField}
                    isEditorMode={isEditorMode}
                    isSelected={isSelected}
                    collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                    onEditingStateChange={onEditingStateChange}
                    onDelete={isEditorMode && onDeleteItem ? () => onDeleteItem(safeActiveIdx, index) : undefined}
                  />
                </div>
              );
            })}
            {isEditorMode && onAddItem && (
              <InlineAddTile
                label={isEN ? (isMenu ? "Add Menu Item" : "Add Product") : (isMenu ? "Tambah Menu" : "Tambah Produk")}
                variant="card"
                className="w-[82%] max-w-[360px] sm:w-auto sm:max-w-none sm:min-w-[320px] md:min-w-[360px] snap-start h-full min-h-[320px] flex-shrink-0"
                style={{ borderRadius: dtRadius }}
                onClick={() => onAddItem(safeActiveIdx)}
              />
            )}
          </div>

          {/* Mobile dots indicator */}
          <div className="flex md:hidden items-center justify-center gap-2 mt-4">
            {activeCategory.items?.map((_, idx) => (
              <div
                key={idx}
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: idx === 0 ? brandPrimary : `color-mix(in srgb, ${brandText} 20%, transparent)` }}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
