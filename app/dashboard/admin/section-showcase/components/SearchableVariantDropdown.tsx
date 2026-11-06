"use client";

import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { Search, ChevronDown, Check, Sliders, X, EyeOff } from "lucide-react";

export interface SearchableVariantDropdownProps {
  variants: Array<{ value: string; label: string; description?: string }>;
  selectedVariant?: string;
  onSelectVariant: (variantValue: string) => void;
  displayMode: "all" | "single";
  hiddenVariantsSet?: Set<string>;
}

export function SearchableVariantDropdown({
  variants,
  selectedVariant,
  onSelectVariant,
  displayMode,
  hiddenVariantsSet,
}: SearchableVariantDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Current selected label
  const activeOption = useMemo(() => {
    return variants.find((v) => v.value === selectedVariant);
  }, [variants, selectedVariant]);

  // Filtered variants based on search input
  const filteredVariants = useMemo(() => {
    if (!searchQuery.trim()) return variants;
    const q = searchQuery.toLowerCase().trim();
    return variants.filter((v) => {
      const matchLabel = v.label.toLowerCase().includes(q);
      const matchValue = v.value.toLowerCase().includes(q);
      const matchDesc = v.description?.toLowerCase().includes(q) ?? false;
      return matchLabel || matchValue || matchDesc;
    });
  }, [variants, searchQuery]);

  // Auto focus input when dropdown opens
  useEffect(() => {
    if (isOpen) {
      setHighlightedIndex(0);
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    } else {
      setSearchQuery("");
    }
  }, [isOpen]);

  // Click outside listener
  useEffect(() => {
    if (!isOpen) return;
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isOpen]);

  const handleSelect = useCallback(
    (variantVal: string) => {
      onSelectVariant(variantVal);
      setIsOpen(false);
    },
    [onSelectVariant]
  );

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === "Enter" || e.key === "ArrowDown") {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    if (e.key === "Escape") {
      e.preventDefault();
      setIsOpen(false);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev + 1 < filteredVariants.length ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev - 1 >= 0 ? prev - 1 : filteredVariants.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredVariants[highlightedIndex]) {
        handleSelect(filteredVariants[highlightedIndex].value);
      }
    }
  };

  // Scroll active item into view inside dropdown
  useEffect(() => {
    if (!isOpen || !listRef.current) return;
    const activeItem = listRef.current.querySelector<HTMLElement>(`[data-index="${highlightedIndex}"]`);
    if (activeItem) {
      activeItem.scrollIntoView({ block: "nearest" });
    }
  }, [highlightedIndex, isOpen]);

  return (
    <div ref={containerRef} className="relative" onKeyDown={handleKeyDown}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex items-center justify-between gap-2 px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-all cursor-pointer min-w-[190px] sm:min-w-[220px] max-w-[270px] ${
          isOpen
            ? "bg-background border-primary shadow-xs text-foreground ring-1 ring-primary/40"
            : "bg-muted/40 hover:bg-muted/70 border-border/70 text-foreground"
        }`}
        title="Buka pilihan varian dan cari dengan cepat"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-1.5 truncate">
          <Sliders className="size-3.5 text-primary shrink-0" />
          <span className="truncate">
            {displayMode === "single" && activeOption
              ? `${activeOption.label}`
              : `Lompat ke varian (${variants.length})`}
          </span>
        </div>
        <ChevronDown
          className={`size-3.5 text-muted-foreground shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-foreground" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu Popup */}
      {isOpen && (
        <div className="absolute left-0 sm:left-auto sm:right-0 top-full mt-1.5 w-72 sm:w-80 rounded-xl bg-card border border-border/80 shadow-xl z-50 overflow-hidden flex flex-col animate-in fade-in-0 zoom-in-95 duration-150">
          {/* Top Search Input */}
          <div className="p-2 border-b border-border/60 bg-muted/20">
            <div className="relative flex items-center">
              <Search className="size-3.5 absolute left-2.5 text-muted-foreground pointer-events-none" />
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setHighlightedIndex(0);
                }}
                placeholder="Cari varian (nama / id)..."
                className="w-full pl-8 pr-7 py-1 text-xs bg-background border border-border/70 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-1 focus:ring-primary"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <X className="size-3" />
                </button>
              )}
            </div>
            <div className="flex items-center justify-between text-[10px] text-muted-foreground px-1 mt-1.5">
              <span>{filteredVariants.length} varian ditemukan</span>
              <span>↑↓ navigasi, ↵ pilih</span>
            </div>
          </div>

          {/* Options List */}
          <div
            ref={listRef}
            className="max-h-64 sm:max-h-72 overflow-y-auto p-1.5 space-y-0.5 divide-y divide-border/20"
            role="listbox"
          >
            {filteredVariants.length === 0 ? (
              <div className="p-4 text-center text-xs text-muted-foreground">
                Tidak ada varian yang cocok dengan &quot;{searchQuery}&quot;
              </div>
            ) : (
              filteredVariants.map((v, idx) => {
                const isHidden = hiddenVariantsSet?.has(v.value) ?? false;
                const isSelected = displayMode === "single" && v.value === selectedVariant;
                const isHighlighted = idx === highlightedIndex;

                return (
                  <div
                    key={v.value}
                    data-index={idx}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(v.value)}
                    onMouseEnter={() => setHighlightedIndex(idx)}
                    className={`pt-1 first:pt-0 pb-1 cursor-pointer transition-colors rounded-lg px-2 ${
                      isHighlighted
                        ? "bg-primary/10 text-primary"
                        : isSelected
                        ? "bg-muted text-foreground"
                        : "hover:bg-muted/60 text-foreground"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1.5">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-[10px] font-semibold text-muted-foreground w-4 text-right shrink-0">
                          {idx + 1}.
                        </span>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold truncate leading-tight">
                            {v.label}
                          </p>
                          <p className="text-[10px] font-mono text-muted-foreground truncate">
                            {v.value}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {isHidden && (
                          <span
                            className="inline-flex items-center gap-0.5 text-[9px] px-1 py-0.5 rounded bg-destructive/10 text-destructive border border-destructive/20 font-medium"
                            title="Varian disembunyikan"
                          >
                            <EyeOff className="size-2.5" />
                            <span>Hidden</span>
                          </span>
                        )}
                        {isSelected && <Check className="size-3.5 text-primary" />}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

