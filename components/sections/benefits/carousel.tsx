"use client";
import React, { useRef, useState, useEffect, useCallback } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { DynamicIcon, InlineText } from "../../templates/shared";
import { InlineAddTile, InlineDeleteButton } from "../inline-add";
import { benefitsStrings } from "./benefits-strings";
import type { TemplateProps, DesignToken } from "../../templates/types";

interface BenefitsVariantProps {
  benefits: TemplateProps["content"]["benefits"];
  design_token?: DesignToken | null;
  onUpdateField?: (section: string, key: string, value: any) => void;
  isEditorMode?: boolean;
  isSelected?: boolean;
  collapseSheetForInlineEdit?: () => void;
  onEditingStateChange?: (isEditing: boolean) => void;
  onAddItem?: () => void;
  language?: "id" | "en";
}

export default function BenefitsCarousel({
  benefits: b,
  onUpdateField,
  isEditorMode,
  isSelected,
  collapseSheetForInlineEdit,
  onEditingStateChange,
  language = "id",
  onAddItem,
}: BenefitsVariantProps) {
  const L = benefitsStrings(language);
  const items = b?.items ?? [];
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [activePage, setActivePage] = useState(0);
  const [pageCount, setPageCount] = useState(1);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 4);

    const step = clientWidth * 0.75;
    const totalPages = Math.max(1, Math.ceil((scrollWidth - clientWidth) / Math.max(step, 1)) + 1);
    setPageCount(totalPages);
    const currentPage = Math.min(
      totalPages - 1,
      Math.max(0, Math.round(scrollLeft / Math.max(step, 1)))
    );
    setActivePage(currentPage);
  }, []);

  useEffect(() => {
    updateScrollState();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [items.length, updateScrollState]);

  const scrollByAmount = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.75;
    el.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  const scrollToPage = (index: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const step = el.clientWidth * 0.75;
    el.scrollTo({
      left: index * step,
      behavior: "smooth",
    });
  };

  const handleDeleteItem = (indexToDelete: number) => {
    if (!onUpdateField) return;
    const newItems = items.filter((_, i) => i !== indexToDelete);
    onUpdateField("benefits", "items", newItems);
  };

  return (
    <section
      id="benefits"
      style={{
        padding: `var(--dt-spacing) 1.5rem`,
        background: `color-mix(in srgb, var(--dt-primary) 3%, var(--dt-bg))`,
        borderTop: `1px solid color-mix(in srgb, var(--dt-primary) 10%, transparent)`,
        borderBottom: `1px solid color-mix(in srgb, var(--dt-primary) 10%, transparent)`,
      }}
    >
      <div style={{ maxWidth: "76rem", margin: "0 auto" }}>
        {/* Header with Title & Navigation Controls */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8 md:mb-12">
          <div style={{ maxWidth: "42rem" }}>
            {(b?.eyebrow || isEditorMode) && (
              <div className="mb-2">
                <span
                  style={{
                    display: "inline-block",
                    fontSize: "0.75rem",
                    fontWeight: 800,
                    textTransform: "uppercase",
                    letterSpacing: "0.15em",
                    color: "var(--dt-primary)",
                  }}
                >
                  <InlineText
                    section="benefits"
                    fieldKey="eyebrow"
                    value={b.eyebrow || L.eyebrowBenefits}
                    placeholder={L.eyebrowBenefits}
                    onUpdateField={onUpdateField}
                    isEditorMode={isEditorMode}
                    isSelected={isSelected}
                    as="span"
                    collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                    onEditingStateChange={onEditingStateChange}
                  />
                </span>
              </div>
            )}
            <h2
              style={{
                fontFamily: "var(--dt-heading-font)",
                fontWeight: "var(--dt-heading-weight)" as any,
                fontSize: "clamp(1.35rem, 4.5cqw, 2.25rem)",
                color: "var(--dt-text)",
                margin: 0,
              }}
            >
              <InlineText
                section="benefits"
                fieldKey="title"
                value={b.title || L.titlePlaceholder}
                placeholder={L.titlePlaceholder}
                onUpdateField={onUpdateField}
                isEditorMode={isEditorMode}
                isSelected={isSelected}
                as="span"
                collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                onEditingStateChange={onEditingStateChange}
              />
            </h2>
            {(b?.subtitle || isEditorMode) && (
              <p
                style={{
                  color: "var(--dt-text-muted)",
                  margin: "0.75rem 0 0",
                  lineHeight: 1.6,
                  fontSize: "0.95rem",
                }}
              >
                <InlineText
                  section="benefits"
                  fieldKey="subtitle"
                  value={b.subtitle}
                  placeholder={L.subtitlePlaceholder}
                  onUpdateField={onUpdateField}
                  isEditorMode={isEditorMode}
                  isSelected={isSelected}
                  as="span"
                  multiline
                  collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                  onEditingStateChange={onEditingStateChange}
                />
              </p>
            )}
          </div>

          {/* Desktop / Tablet Nav Arrows */}
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => scrollByAmount("left")}
              disabled={!canScrollLeft}
              className="size-10 rounded-full flex items-center justify-center transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              style={{
                background: "var(--dt-surface)",
                border: "1px solid color-mix(in srgb, var(--dt-primary) 18%, transparent)",
                color: "var(--dt-text)",
                boxShadow: "0 2px 8px color-mix(in srgb, var(--dt-primary) 4%, transparent)",
              }}
              aria-label={L.carouselPrev}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => scrollByAmount("right")}
              disabled={!canScrollRight}
              className="size-10 rounded-full flex items-center justify-center transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              style={{
                background: "var(--dt-surface)",
                border: "1px solid color-mix(in srgb, var(--dt-primary) 18%, transparent)",
                color: "var(--dt-text)",
                boxShadow: "0 2px 8px color-mix(in srgb, var(--dt-primary) 4%, transparent)",
              }}
              aria-label={L.carouselNext}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Carousel Scroll Container */}
        <div
          ref={scrollRef}
          className="flex gap-5 sm:gap-6 overflow-x-auto pb-4 pt-2 no-scrollbar scroll-smooth snap-x snap-mandatory"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {items.map((item, idx) => (
            <div
              key={idx}
              className="group relative flex flex-col justify-between overflow-hidden shrink-0 snap-start transition-all duration-200"
              style={{
                width: "min(320px, calc(100vw - 4rem))",
                minHeight: "260px",
                background: `linear-gradient(145deg, color-mix(in srgb, var(--dt-surface) 92%, var(--dt-primary) 8%) 0%, var(--dt-surface) 100%)`,
                border: `1px solid color-mix(in srgb, var(--dt-primary) 18%, transparent)`,
                borderRadius: "var(--dt-radius-lg)",
                padding: "1.75rem",
                boxShadow: "0 2px 8px color-mix(in srgb, var(--dt-primary) 4%, transparent)",
              }}
            >
              {/* Top Accent Line */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "3px",
                  background: `linear-gradient(90deg, var(--dt-primary), color-mix(in srgb, var(--dt-primary) 30%, transparent))`,
                  opacity: 0.8,
                }}
              />

              {/* Icon / Stat + Text */}
              <div className="flex flex-col gap-3.5">
                {item.stat || isEditorMode ? (
                  <div>
                    <p
                      style={{
                        fontFamily: "var(--dt-heading-font)",
                        fontWeight: 800,
                        fontSize: "2.15rem",
                        color: "var(--dt-primary)",
                        margin: 0,
                        lineHeight: 1.1,
                      }}
                    >
                      <InlineText
                        section="benefits"
                        fieldKey={"items." + idx + ".stat"}
                        value={item.stat ?? ""}
                        placeholder={L.statPlaceholder}
                        onUpdateField={onUpdateField}
                        isEditorMode={isEditorMode}
                        isSelected={isSelected}
                        as="span"
                        collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                        onEditingStateChange={onEditingStateChange}
                      />
                    </p>
                    {(item.stat_label || isEditorMode) && (
                      <p
                        style={{
                          fontSize: "0.72rem",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.1em",
                          color: "var(--dt-text-muted)",
                          marginTop: "0.25rem",
                        }}
                      >
                        <InlineText
                          section="benefits"
                          fieldKey={"items." + idx + ".stat_label"}
                          value={item.stat_label ?? ""}
                          placeholder={L.statLabelPlaceholder}
                          onUpdateField={onUpdateField}
                          isEditorMode={isEditorMode}
                          isSelected={isSelected}
                          as="span"
                          collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                          onEditingStateChange={onEditingStateChange}
                        />
                      </p>
                    )}
                  </div>
                ) : (
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      background: `linear-gradient(135deg, color-mix(in srgb, var(--dt-primary) 18%, transparent), color-mix(in srgb, var(--dt-primary) 8%, transparent))`,
                      border: `1px solid color-mix(in srgb, var(--dt-primary) 22%, transparent)`,
                      borderRadius: "var(--dt-radius)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <span style={{ color: "var(--dt-primary)", display: "contents" }}>
                      <DynamicIcon name={item.icon} defaultIcon={Star} className="w-5 h-5" />
                    </span>
                  </div>
                )}

                <InlineText
                  section="benefits"
                  fieldKey={"items." + idx + ".title"}
                  value={item.title ?? ""}
                  placeholder={L.itemTitlePlaceholder}
                  onUpdateField={onUpdateField}
                  isEditorMode={isEditorMode}
                  isSelected={isSelected}
                  as="h3"
                  style={{
                    fontFamily: "var(--dt-heading-font)",
                    fontWeight: 700,
                    color: "var(--dt-text)",
                    fontSize: "1.08rem",
                    margin: 0,
                    lineHeight: 1.35,
                  }}
                  collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                  onEditingStateChange={onEditingStateChange}
                />

                <InlineText
                  section="benefits"
                  fieldKey={"items." + idx + ".description"}
                  value={item.description ?? ""}
                  placeholder={L.itemDescriptionPlaceholder}
                  onUpdateField={onUpdateField}
                  isEditorMode={isEditorMode}
                  isSelected={isSelected}
                  as="p"
                  style={{
                    color: "var(--dt-text-muted)",
                    fontSize: "0.875rem",
                    lineHeight: 1.65,
                    margin: 0,
                  }}
                  multiline
                  collapseSheetForInlineEdit={collapseSheetForInlineEdit}
                  onEditingStateChange={onEditingStateChange}
                />
              </div>

              {/* Inline Delete Button for Editor Mode */}
              {isEditorMode && (
                <div className="absolute top-3 right-3">
                  <InlineDeleteButton
                    compact
                    onDelete={() => handleDeleteItem(idx)}
                    title={L.deleteItemTitle}
                  />
                </div>
              )}
            </div>
          ))}

          {isEditorMode && onAddItem && (
            <div
              className="shrink-0 snap-start"
              style={{ width: "min(240px, calc(100vw - 4rem))", minHeight: "260px" }}
            >
              <InlineAddTile
                label={L.addBenefit}
                onClick={onAddItem}
                style={{
                  height: "100%",
                  minHeight: "16rem",
                  borderRadius: "var(--dt-radius-lg)",
                }}
              />
            </div>
          )}
        </div>

        {/* Carousel Indicators / Dots & Mobile Controls */}
        <div className="flex items-center justify-between pt-4 sm:pt-6">
          {pageCount > 1 && (
            <div className="flex items-center gap-1.5 mx-auto sm:mx-0">
              {Array.from({ length: pageCount }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => scrollToPage(i)}
                  className="transition-all duration-300 rounded-full cursor-pointer"
                  style={{
                    width: activePage === i ? "1.5rem" : "0.5rem",
                    height: "0.5rem",
                    background:
                      activePage === i
                        ? "var(--dt-primary)"
                        : "color-mix(in srgb, var(--dt-primary) 20%, transparent)",
                  }}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          )}

          {/* Mobile Arrows */}
          <div className="flex sm:hidden items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={() => scrollByAmount("left")}
              disabled={!canScrollLeft}
              className="size-9 rounded-full flex items-center justify-center transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              style={{
                background: "var(--dt-surface)",
                border: "1px solid color-mix(in srgb, var(--dt-primary) 18%, transparent)",
                color: "var(--dt-text)",
              }}
              aria-label={L.carouselPrev}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollByAmount("right")}
              disabled={!canScrollRight}
              className="size-9 rounded-full flex items-center justify-center transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              style={{
                background: "var(--dt-surface)",
                border: "1px solid color-mix(in srgb, var(--dt-primary) 18%, transparent)",
                color: "var(--dt-text)",
              }}
              aria-label={L.carouselNext}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
