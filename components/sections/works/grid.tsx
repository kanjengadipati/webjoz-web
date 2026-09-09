"use client";
import React from "react";
import { WorksCard, WorksAddTile } from "./shared";
import type { WorksRackProps } from "./shared";

export default function WorksGrid({
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {items.map((item, idx) => (
        <WorksCard
          key={item.title + idx}
          item={item}
          idx={idx}
          total={items.length}
          radius={radius}
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
      ))}
      {isEditorMode && onAddItem && items.length > 0 && (
        <WorksAddTile
          onAdd={onAddItem}
          collapseSheetForInlineEdit={collapseSheetForInlineEdit}
          isEN={isEN}
          style={{ borderRadius: radius, aspectRatio: "4 / 3" }}
        />
      )}
    </div>
  );
}