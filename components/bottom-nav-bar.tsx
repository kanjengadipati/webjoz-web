"use client";

import React from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BottomNavItem {
  id: string;
  href?: string;
  icon: React.ElementType;
  label: string;
  badge?: number;
  onClick?: () => void;
  active?: boolean;
  /** Optional tooltip shown above the item (first-visit edu tooltip) */
  tooltip?: React.ReactNode;
}

interface BottomNavBarProps {
  /**
   * Side items — either 4 (2 left + 2 right) or 2 (1 left + 1 right).
   * Layout: [left...] [center FAB] [right...]
   */
  items: [BottomNavItem, BottomNavItem, BottomNavItem, BottomNavItem]
       | [BottomNavItem, BottomNavItem];
  centerLabel: string;
  onCenterPress: () => void;
  /**
   * Custom center content. If provided, replaces the default Plus FAB circle.
   * Use for pill-shaped CTAs (e.g. wizard "Edit & Publish").
   */
  centerContent?: React.ReactNode;
  centerActive?: boolean;
  className?: string;
  /** aria-label for the nav element */
  ariaLabel?: string;
}

export function BottomNavBar({
  items,
  centerLabel,
  onCenterPress,
  centerContent,
  centerActive = false,
  className,
  ariaLabel = "Navigation",
}: BottomNavBarProps) {
  const half = items.length / 2;
  const leftItems = items.slice(0, half) as BottomNavItem[];
  const rightItems = items.slice(half) as BottomNavItem[];

  const Tab = ({ item }: { item: BottomNavItem }) => {
    const Icon = item.icon;
    const isActive = item.active ?? false;
    const baseClass = cn(
      "relative flex flex-col items-center justify-center gap-0.5 h-full flex-1 transition-colors cursor-pointer active:scale-95 !text-white/60 hover:!text-white",
      isActive && "!text-white font-bold"
    );
    const content = (
      <>
        {/* Edu tooltip */}
        {item.tooltip && (
          <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 pointer-events-none z-10">
            {item.tooltip}
          </div>
        )}
        <div className="relative">
          <Icon className={cn("size-5", isActive ? "stroke-[2.25]" : "stroke-[1.75]")} aria-hidden="true" />
          {item.badge && item.badge > 0 ? (
            <span className="absolute -top-1 -right-1.5 flex items-center justify-center min-w-[14px] h-3.5 px-0.5 rounded-full bg-primary text-primary-foreground text-[8px] font-bold leading-none">
              {item.badge > 9 ? "9+" : item.badge}
            </span>
          ) : null}
        </div>
        <span className="text-[10px] leading-none">{item.label}</span>
      </>
    );
    if (item.onClick) {
      return <button type="button" onClick={item.onClick} className={baseClass}>{content}</button>;
    }
    return (
      <Link href={item.href ?? "#"} aria-current={isActive ? "page" : undefined} className={baseClass}>
        {content}
      </Link>
    );
  };

  return (
    <nav
      className={cn("fixed bottom-0 inset-x-0 z-50 md:hidden", className)}
      aria-label={ariaLabel}
    >
      <div
        className="flex items-center justify-around w-full rounded-t-2xl shadow-2xl [overflow:visible] px-2"
        style={{
          background: "#1c1c1e",
          height: "calc(3.75rem + env(safe-area-inset-bottom))",
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        {leftItems.map((item) => <Tab key={item.id} item={item} />)}

        {/* Center — custom content or default Plus FAB */}
        <div className="flex flex-col items-center justify-center flex-[2] -mt-7">
          {centerContent ?? (
            <button
              type="button"
              onClick={onCenterPress}
              aria-label={centerLabel}
              className="flex flex-col items-center group cursor-pointer active:scale-95 transition-transform"
            >
              <div className={cn(
                "size-12 rounded-full flex items-center justify-center shadow-lg ring-4 ring-[#1c1c1e] group-hover:scale-105 transition-all",
                centerActive ? "bg-primary text-primary-foreground" : "bg-white text-black"
              )}>
                <Plus className="size-6" strokeWidth={2.5} />
              </div>
              <span className="text-[10px] font-bold text-white mt-0.5 leading-none">{centerLabel}</span>
            </button>
          )}
        </div>

        {rightItems.map((item) => <Tab key={item.id} item={item} />)}
      </div>
    </nav>
  );
}
