"use client";
import React, { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { WorksCard, WorksAddTile } from "./shared";
import type { WorksRackProps } from "./shared";
import { worksStrings } from "./works-strings";

export default function WorksCarousel({
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
  const L = worksStrings(isEN ? "en" : "id");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const syncScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    syncScrollState();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", syncScrollState, { passive: true });
    window.addEventListener("resize", syncScrollState);
    return () => {
      el.removeEventListener("scroll", syncScrollState);
      window.removeEventListener("resize", syncScrollState);
    };
  }, [items.length, syncScrollState]);

  const scrollBy = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const step = el.clientWidth * 0.75;
    el.scrollBy({ left: dir === "left" ? -step : step, behavior: "smooth" });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => scrollBy("left")}
          disabled={!canLeft}
          aria-label={L.prevProjects}
          className="size-9 rounded-full flex items-center justify-center transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          style={{
            background: "var(--dt-surface)",
            border: "1px solid var(--dt-border)",
            color: "var(--dt-text)",
          }}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => scrollBy("right")}
          disabled={!canRight}
          aria-label={L.nextProjects}
          className="size-9 rounded-full flex items-center justify-center transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          style={{
            background: "var(--dt-surface)",
            border: "1px solid var(--dt-border)",
            color: "var(--dt-text)",
          }}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {items.map((item, idx) => (
          <div
            key={idx}
            className="shrink-0 snap-start flex [&>article]:w-full"
            style={{ width: "min(340px, calc(100vw - 3rem))" }}
          >
            <WorksCard
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
          </div>
        ))}

        {isEditorMode && onAddItem && items.length > 0 && (
          <div
            className="shrink-0 snap-start flex"
            style={{ width: "min(280px, calc(100vw - 3rem))" }}
          >
            <WorksAddTile
              onAdd={onAddItem}
              collapseSheetForInlineEdit={collapseSheetForInlineEdit}
              isEN={isEN}
              style={{ borderRadius: radius, aspectRatio: "4 / 3", width: "100%" }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
