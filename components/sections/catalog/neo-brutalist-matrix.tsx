"use client";
import React from "react";
import { Plus, Image as ImageIcon } from "lucide-react";
import { InlineText } from "../../templates/shared";
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

export default function CatalogNeoBrutalistMatrix({ catalog, onUpdateField, isEditorMode, isSelected, collapseSheetForInlineEdit, onEditingStateChange }: CatalogVariantProps) {
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
            className="text-base font-bold leading-relaxed max-w-3xl"
            style={{ color: "var(--dt-text)" }}
          />
        )}
      </div>

      {/* Categories */}
      <div className="space-y-24">
        {categories?.map((category, catIdx) => (
          <div key={catIdx} className="space-y-8">
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

            {/* Matrix Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {category.items?.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col border-[3px] border-solid transition-all duration-200 hover:-translate-x-1 hover:-translate-y-1"
                  style={{
                    borderColor: "var(--dt-border)",
                    backgroundColor: "var(--dt-surface)",
                    boxShadow: "6px 6px 0px 0px var(--dt-accent)",
                    borderRadius: "var(--dt-radius, 0px)"
                  }}
                >
                  {/* Image Container */}
                  <div className="relative aspect-square overflow-hidden border-b-[3px] border-solid" style={{ borderColor: "var(--dt-border)" }}>
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-6 text-neutral-500">
                        <ImageIcon size={36} strokeWidth={2.5} className="mb-2" />
                        <span className="text-xs uppercase font-extrabold tracking-wider">No Image</span>
                      </div>
                    )}

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
                        {item.badge}
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-grow flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-4 mb-4">
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
                            className="text-lg font-black uppercase tracking-wider px-2 py-1 border-[3px] border-solid shrink-0"
                            style={{
                              borderColor: "var(--dt-border)",
                              backgroundColor: "var(--dt-accent)",
                              color: "var(--dt-primary-foreground)"
                            }}
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
                          className="text-sm font-bold leading-relaxed mb-6"
                          style={{ color: "var(--dt-text-muted)" }}
                        />
                      )}

                      {item.capacity != null && item.capacity > 0 && (
                        <div className="mb-2">
                          <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase px-2 py-0.5 border-2" style={{ borderColor: "var(--dt-border)", background: "var(--dt-accent)", color: "var(--dt-primary-foreground)" }}>
                            s/d {item.capacity} tamu
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
                      <button
                        className="w-12 h-12 rounded-full border-[3px] border-solid flex items-center justify-center transition-all duration-200 hover:scale-110 active:translate-x-0.5 active:translate-y-0.5"
                        style={{
                          borderColor: "var(--dt-border)",
                          backgroundColor: "var(--dt-primary)",
                          color: "var(--dt-primary-foreground)",
                          boxShadow: "2px 2px 0px 0px var(--dt-text)",
                        }}
                        aria-label={`Add ${item.name} to cart`}
                      >
                        <Plus size={20} strokeWidth={3} />
                      </button>
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
