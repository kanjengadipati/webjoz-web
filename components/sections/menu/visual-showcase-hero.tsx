"use client";
import React from "react";
import { Utensils } from "lucide-react";
import { InlineText } from "../../templates/shared";
import type { TemplateProps, DesignToken } from "../../templates/types";

interface MenuVariantProps {
  menu: TemplateProps["content"]["menu"];
  design_token?: DesignToken | null;
  onUpdateField?: (section: string, key: string, value: any) => void;
  isEditorMode?: boolean;
  isSelected?: boolean;
  collapseSheetForInlineEdit?: () => void;
  onEditingStateChange?: (isEditing: boolean) => void;
}

export default function VisualShowcaseHero({ menu, onUpdateField, isEditorMode, isSelected, collapseSheetForInlineEdit, onEditingStateChange }: MenuVariantProps) {
  if (!menu) return null;
  const { eyebrow, title, subtitle, categories } = menu;

  return (
    <section
      id="showcase-hero-section"
      className="w-full py-16 px-4 md:px-8 bg-dt-bg text-dt-text font-dt-body"
    >
      <div className="max-w-7xl mx-auto">
        <div id="hero-header" className="text-center mb-20 max-w-3xl mx-auto">
          {eyebrow && (
            <InlineText
              section="menu"
              fieldKey="eyebrow"
              value={eyebrow}
              onUpdateField={onUpdateField}
              isEditorMode={isEditorMode}
              isSelected={isSelected}
              collapseSheetForInlineEdit={collapseSheetForInlineEdit}
              onEditingStateChange={onEditingStateChange}
              as="span"
              className="text-xs font-medium tracking-widest uppercase text-dt-text-muted block mb-4 font-dt-heading"
            />
          )}
          <InlineText
            section="menu"
            fieldKey="title"
            value={title}
            onUpdateField={onUpdateField}
            isEditorMode={isEditorMode}
            isSelected={isSelected}
            collapseSheetForInlineEdit={collapseSheetForInlineEdit}
            onEditingStateChange={onEditingStateChange}
            as="h2"
            className="text-4xl md:text-6xl font-light tracking-tight mb-6 text-dt-text font-dt-heading"
          />
          <div className="w-16 h-[2px] bg-dt-primary mx-auto mb-6"></div>
          {subtitle && (
            <InlineText
              section="menu"
              fieldKey="subtitle"
              value={subtitle}
              onUpdateField={onUpdateField}
              isEditorMode={isEditorMode}
              isSelected={isSelected}
              collapseSheetForInlineEdit={collapseSheetForInlineEdit}
              onEditingStateChange={onEditingStateChange}
              as="p"
              className="text-sm md:text-base text-dt-text-muted max-w-xl mx-auto italic font-light"
            />
          )}
        </div>

        {categories.map((category, catIndex) => (
          <div
            key={category.name}
            id={`hero-category-${catIndex}`}
            className="mb-24 last:mb-0"
          >
            <div className="text-center mb-12">
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
                    key={item.name}
                    id={`hero-item-${catIndex}-${itemIndex}`}
                    className="group flex flex-col bg-dt-surface rounded-dt overflow-hidden border border-dt-border/50 hover:shadow-xl hover:border-dt-border transition-all duration-300 h-[560px]"
                  >
                    <div className="relative h-[390px] w-full overflow-hidden bg-dt-accent/5">
                      {item.image_url ? (
                        <img
                          id={`hero-img-${catIndex}-${itemIndex}`}
                          src={item.image_url}
                          alt={item.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                      ) : (
                        <div
                          id={`hero-fallback-${catIndex}-${itemIndex}`}
                          className="w-full h-full bg-dt-accent/15 flex flex-col items-center justify-center text-dt-primary/40"
                        >
                          <Utensils className="w-12 h-12 stroke-[1] mb-2" />
                          <span className="text-[10px] uppercase tracking-widest font-dt-heading font-medium text-dt-text-muted">
                            Menu Selection
                          </span>
                        </div>
                      )}

                      {hasBadge && (
                        <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-black/40 to-transparent"></div>
                      )}

                      {badge && (
                        <div
                          id={`hero-badge-${catIndex}-${itemIndex}`}
                          className="absolute top-4 left-4 bg-white/90 dark:bg-black/80 backdrop-blur-xs text-dt-text text-[10px] font-semibold tracking-widest uppercase px-3 py-1.5 border border-dt-border rounded-none shadow-xs font-dt-heading"
                        >
                          {badge}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 p-6 flex flex-col justify-between bg-dt-surface">
                      <div className="flex items-start justify-between gap-4">
                        <InlineText section="menu" fieldKey={"categories." + catIndex + ".items." + itemIndex + ".name"} value={item.name ?? ""} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={isSelected} collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} as="h4" className="text-lg font-medium tracking-tight font-dt-heading text-dt-text leading-snug group-hover:text-dt-primary transition-colors duration-300" />
                        {item.price && (
                          <InlineText section="menu" fieldKey={"categories." + catIndex + ".items." + itemIndex + ".price"} value={item.price ?? ""} onUpdateField={onUpdateField} isEditorMode={isEditorMode} isSelected={isSelected} collapseSheetForInlineEdit={collapseSheetForInlineEdit} onEditingStateChange={onEditingStateChange} as="span" className="text-base font-semibold font-dt-heading text-dt-primary" />
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
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
