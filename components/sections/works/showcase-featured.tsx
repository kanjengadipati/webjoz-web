"use client";
import React from "react";
import { WorksCard, WorksAddTile } from "./shared";
import type { WorksRackProps } from "./shared";

// Semua proyek tampil sebagai baris horizontal; gambar kiri/kanan bergantian.
export default function WorksShowcaseFeatured({
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
    <div className="space-y-6 md:space-y-10">
      {items.map((item, idx) => (
        <WorksCard
          key={idx}
          item={item}
          idx={idx}
          total={items.length}
          radius={radius}
          featured
          reverse={idx % 2 === 1}
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
