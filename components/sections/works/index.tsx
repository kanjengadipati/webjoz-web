import React, { useCallback } from "react";
import type { WorksItem, WorksLayout } from "@/components/templates/types";
import { WorksSectionHeader, WorksAddTile, getRadius } from "./shared";
import type { WorksVariantProps } from "./shared";
import WorksGrid from "./grid";
import WorksMasonry from "./masonry";
import WorksFeaturedGrid from "./featured-grid";
import WorksShowcaseFeatured from "./showcase-featured";

export default function WorksSection({
  works,
  design_token,
  sectionStyle,
  onUpdateField,
  isEditorMode,
  isSelected,
  collapseSheetForInlineEdit,
  onEditingStateChange,
  language,
}: WorksVariantProps) {
  const dt = design_token;
  const radius = getRadius(dt);

  const variant =
    (dt?.layout?.section_variants?.works as WorksLayout | undefined) ||
    (works.layout as WorksLayout | undefined) ||
    "grid";

  const onUpdateItems = useCallback(
    (items: WorksItem[]) => {
      onUpdateField?.("works", "items", items);
    },
    [onUpdateField]
  );

  const onUpdateItem = useCallback(
    (idx: number, key: string, val: unknown) => {
      const items = [...(works.items || [])];
      if (!items[idx]) return;
      items[idx] = { ...items[idx], [key]: val };
      onUpdateItems(items);
    },
    [works.items, onUpdateItems]
  );

  const onReplaceImage = useCallback(
    (idx: number, url: string) => {
      const items = [...(works.items || [])];
      if (!items[idx]) return;
      items[idx] = { ...items[idx], image_url: url };
      onUpdateItems(items);
    },
    [works.items, onUpdateItems]
  );

  const onRemoveItem = useCallback(
    (idx: number) => {
      const items = [...(works.items || [])];
      items.splice(idx, 1);
      onUpdateItems(items);
    },
    [works.items, onUpdateItems]
  );

  const onMoveItem = useCallback(
    (idx: number, dir: -1 | 1) => {
      const items = [...(works.items || [])];
      const j = idx + dir;
      if (j < 0 || j >= items.length) return;
      [items[idx], items[j]] = [items[j], items[idx]];
      onUpdateItems(items);
    },
    [works.items, onUpdateItems]
  );

  const onAddItem = useCallback(
    (url: string) => {
      onUpdateItems([...(works.items || []), { title: "", image_url: url }]);
    },
    [works.items, onUpdateItems]
  );

  if ((!works.items || works.items.length === 0) && !isEditorMode) {
    return null;
  }

  const isEmpty = !works.items || works.items.length === 0;

  const rackProps = {
    items: works.items || [],
    radius,
    isEditorMode,
    isSelected,
    isEN: language === "en",
    onUpdateItem,
    onReplaceImage,
    onRemoveItem,
    onMoveItem,
    onAddItem,
    collapseSheetForInlineEdit,
    onEditingStateChange,
  };

  return (
    <section
      id="works"
      className="py-16 md:py-24 px-4 md:px-8"
      style={{
        ...sectionStyle,
        backgroundColor: "var(--dt-bg)",
        color: "var(--dt-text)",
      }}
    >
      <div className="max-w-6xl mx-auto space-y-10 md:space-y-14">
        <WorksSectionHeader
          works={works}
          design_token={dt}
          isEditorMode={isEditorMode}
          isSelected={isSelected}
          onUpdateField={onUpdateField}
          collapseSheetForInlineEdit={collapseSheetForInlineEdit}
          onEditingStateChange={onEditingStateChange}
          onAddItem={isEditorMode && isEmpty ? onAddItem : undefined}
          language={language}
        />

        {isEditorMode && isEmpty ? (
          <div className="max-w-md mx-auto">
            <WorksAddTile
              onAdd={onAddItem}
              collapseSheetForInlineEdit={collapseSheetForInlineEdit}
              isEN={language === "en"}
              style={{ borderRadius: radius, aspectRatio: "4 / 3" }}
            />
          </div>
        ) : variant === "masonry" ? (
          <WorksMasonry {...rackProps} />
        ) : variant === "featured-grid" ? (
          <WorksFeaturedGrid {...rackProps} />
        ) : variant === "showcase-featured" ? (
          <WorksShowcaseFeatured {...rackProps} />
        ) : (
          <WorksGrid {...rackProps} />
        )}
      </div>
    </section>
  );
}