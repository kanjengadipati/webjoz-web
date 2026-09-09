"use client";
import React from "react";
import { WorksCard, WorksAddTile } from "./shared";
import type { WorksRackProps } from "./shared";

export default function WorksFeaturedGrid({
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
  const [head, ...rest] = items;

  return (
    <div className="space-y-4 md:space-y-6">
      {head && (
        <WorksCard
          item={head}
          idx={0}
          total={items.length}
          radius={radius}
          featured
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
      )}
      {rest.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          {rest.map((item, i) => {
            const idx = i + 1;
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
        </div>
      )}
      {isEditorMode && onAddItem && (
        <WorksAddTile
          onAdd={onAddItem}
          collapseSheetForInlineEdit={collapseSheetForInlineEdit}
          isEN={isEN}
          style={{ borderRadius: radius, minHeight: "160px" }}
        />
      )}
    </div>
  );
}