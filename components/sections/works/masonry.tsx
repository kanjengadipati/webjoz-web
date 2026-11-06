"use client";
import React from "react";
import { WorksCard, WorksAddTile } from "./shared";
import type { WorksRackProps } from "./shared";

// Rasio bergilir supaya tinggi kartu bervariasi (efek masonry nyata).
const ASPECTS = ["4 / 3", "3 / 4", "1 / 1", "4 / 5", "16 / 10", "3 / 4"];

export default function WorksMasonry({
  items,
  radius,
  isEditorMode,
  isSelected,
  isEN,
  onUpdateItem,
  onReplaceImage,
  onRemoveItem,
  onMoveItem,
  onAddItem,
  collapseSheetForInlineEdit,
  onEditingStateChange,
}: WorksRackProps) {
  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 md:gap-6">
      {items.map((item, idx) => (
        <div key={idx} className="mb-4 md:mb-6 break-inside-avoid">
          <WorksCard
            item={item}
            idx={idx}
            total={items.length}
            radius={radius}
            aspect={ASPECTS[idx % ASPECTS.length]}
            isEditorMode={isEditorMode}
            isSelected={isSelected}
            isEN={isEN}
            onUpdateItem={onUpdateItem}
            onReplaceImage={onReplaceImage}
            onRemoveItem={onRemoveItem}
            onMoveItem={onMoveItem}
            collapseSheetForInlineEdit={collapseSheetForInlineEdit}
            onEditingStateChange={onEditingStateChange}
          />
        </div>
      ))}
      {isEditorMode && onAddItem && (
        <div className="mb-4 md:mb-6 break-inside-avoid">
          <WorksAddTile
            onAdd={onAddItem}
            collapseSheetForInlineEdit={collapseSheetForInlineEdit}
            isEN={isEN}
            style={{ borderRadius: radius, aspectRatio: "4 / 3" }}
          />
        </div>
      )}
    </div>
  );
}
