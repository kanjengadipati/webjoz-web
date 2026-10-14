"use client";

import { useMemo } from "react";

export interface FilterableItem {
  name?: string | null;
  description?: string | null;
  features?: string[] | null;
  tags?: string[] | null;
  badge?: string | null;
}

export interface FilteredItem<T> {
  item: T;
  originalCatIdx: number;
  originalItemIdx: number;
}

export type FilteredCategory<C, T> = C & {
  originalCatIdx: number;
  filteredItems: FilteredItem<T>[];
};

type FilterableCategoryShape = { name?: string; items?: FilterableItem[] | null };

/**
 * Filters menu/catalog categories by active category + search query while
 * preserving each item's ORIGINAL indices (needed for inline-edit/delete).
 *
 * This centralizes the logic that used to be duplicated (and inconsistently
 * buggy) across every menu/catalog variant. Items are matched on name,
 * description, badge and — when present — features/tags.
 */
export function useCatalogFilter<C extends FilterableCategoryShape>(
  categories: C[] | null | undefined,
  activeCategory: string,
  searchQuery: string,
  isEditorMode?: boolean,
): FilteredCategory<C, NonNullable<C["items"]>[number]>[] {
  return useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const matches = (item: FilterableItem): boolean => {
      if (!query) return true;
      if ((item.name || "").toLowerCase().includes(query)) return true;
      if ((item.description || "").toLowerCase().includes(query)) return true;
      if ((item.badge || "").toLowerCase().includes(query)) return true;
      if ((item.features || []).some((f) => f.toLowerCase().includes(query))) return true;
      if ((item.tags || []).some((t) => t.toLowerCase().includes(query))) return true;
      return false;
    };

    return (categories || [])
      .map((cat, originalCatIdx) => {
        const filteredItems = (cat.items || [])
          .map((item, originalItemIdx) => ({ item, originalCatIdx, originalItemIdx }))
          .filter(({ item }) => matches(item));
        return { ...cat, originalCatIdx, filteredItems };
      })
      .filter(
        (cat) =>
          (activeCategory === "all" || cat.name === activeCategory) &&
          (isEditorMode || cat.filteredItems.length > 0),
      ) as FilteredCategory<C, NonNullable<C["items"]>[number]>[];
  }, [categories, activeCategory, searchQuery, isEditorMode]);
}
