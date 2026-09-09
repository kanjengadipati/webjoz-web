"use client";
import React from "react";
import { WorksCard, WorksAddTile } from "./shared";
import type { WorksRackProps } from "./shared";

const COLUMN_PATTERN = [0, 1, 1, 2, 2, 3];

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
  const columns = [0, 1, 2].map((c) => items.filter((_, i) => COLUMN_PATTERN[i % COLUMN_PATTERN.length] === c));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 items-start">
      {columns.map((col, ci) => (
        <div key={ci} className="flex flex-col gap-4 md:gap-6">
          {col.map((item) => {
            const idx = items.indexOf(item);
            return (
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
            );
          })}
          {isEditorMode && onAddItem && ci === 0 && <WorksAddTile onAdd={onAddItem} collapseSheetForInlineEdit={collapseSheetForInlineEdit} isEN={isEN} style={{ borderRadius: radius }} />}
        </div>
      ))}
    </div>
  );
}