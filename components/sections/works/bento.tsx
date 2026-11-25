"use client";
import React from "react";
import { WorksCard, WorksAddTile } from "./shared";
import type { WorksRackProps } from "./shared";

export default function WorksBento({
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 md:gap-5 items-stretch">
      {items.map((item, idx) => {
        const isHeroCard = idx === 0;
        const spanClass = isHeroCard
          ? "md:col-span-2 lg:col-span-6 lg:row-span-2"
          : "lg:col-span-3";

        return (
          <div key={idx} className={`${spanClass} flex [&>article]:w-full [&>article]:h-full`}>
            <WorksCard
              item={item}
              idx={idx}
              total={items.length}
              radius={radius}
              aspect={isHeroCard ? "4 / 3" : "16 / 10"}
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
        );
      })}
      {isEditorMode && onAddItem && items.length > 0 && (
        <div className="lg:col-span-3 flex">
          <WorksAddTile
            onAdd={onAddItem}
            collapseSheetForInlineEdit={collapseSheetForInlineEdit}
            isEN={isEN}
            style={{ borderRadius: radius, minHeight: "180px", width: "100%" }}
          />
        </div>
      )}
    </div>
  );
}
