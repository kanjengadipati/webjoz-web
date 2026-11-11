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
}

interface BottomNavBarProps {
  /** Exactly 4 items: [left1, left2, right1, right2] around the center FAB */
  items: [BottomNavItem, BottomNavItem, BottomNavItem, BottomNavItem];
  centerLabel: string;
  onCenterPress: () => void;
  centerActive?: boolean;
  className?: string;
}

/**
 * Global bottom navigation bar.
 * Dark pill (#1c1c1e), elevated white circle FAB with ring, icon + label tabs.
 */
export function BottomNavBar({
  items,
  centerLabel,
  onCenterPress,
  centerActive = false,
  className,
}: BottomNavBarProps) {
  const [left1, left2, right1, right2] = items;

  const Tab = ({ item }: { item: BottomNavItem }) => {
    const Icon = item.icon;
    const isActive = item.active ?? false;
    const baseClass = cn(
      "flex flex-col items-center justify-center gap-0.5 h-full flex-1 transition-colors cursor-pointer active:scale-95",
      isActive ? "text-white font-bold" : "text-white/60 hover:text-white"
    );
    const content = (
      <>
        <div className="relative">
          <Icon className={cn("size-5 transition-all", isActive ? "stroke-[2.25]" : "stroke-[1.75]")} aria-hidden="true" />
          {item.badge && item.badge > 0 ? (
            <span className="absolute -top-1 -right-1.5 flex items-center justify-center min-w-[14px] h-3.5 px-0.5 rounded-full bg-primary text-primary-foreground text-[8px] font-bold leading-none">
              {item.badge > 9 ? "9+" : item.badge}
            </span>
          ) : null}
        </div>
        <span className={cn("text-[10px] leading-none", isActive ? "font-bold" : "font-medium")}>{item.label}</span>
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
      className={cn("fixed bottom-0 inset-x-0 z-50 md:hidden bg-transparent pointer-events-none", className)}
      style={{ paddingBottom: "max(env(safe-area-inset-bottom), 12px)" }}
      aria-label="Navigation"
    >
      <div
        className="flex items-center mx-3 mb-1 rounded-2xl relative shadow-2xl pointer-events-auto"
        style={{ background: "#1c1c1e", height: "3.75rem", overflow: "visible" }}
      >
        <Tab item={left1} />
        <Tab item={left2} />

        {/* Center elevated FAB */}
        <div className="flex flex-col items-center justify-center flex-1 relative -mt-7">
          <button
            type="button"
            onClick={onCenterPress}
            aria-label={centerLabel}
            className="flex flex-col items-center group cursor-pointer active:scale-95 transition-transform"
          >
            <div className={cn(
              "size-12 rounded-full flex items-center justify-center shadow-lg ring-4 ring-[#1c1c1e] group-hover:scale-105 transition-all",
              centerActive
                ? "bg-primary text-primary-foreground"
                : "bg-white text-black"
            )}>
              <Plus className="size-6" strokeWidth={2.5} />
            </div>
            <span className="text-[10px] font-bold text-white mt-0.5 leading-none">{centerLabel}</span>
          </button>
        </div>

        <Tab item={right1} />
        <Tab item={right2} />
      </div>
    </nav>
  );
}
