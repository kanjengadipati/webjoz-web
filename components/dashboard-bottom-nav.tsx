"use client";

import React from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BottomNavItem {
  id: string;
  href: string;
  icon: React.ElementType;
  label: string;
  badge?: number;
}

interface DashboardBottomNavProps {
  items: [BottomNavItem, BottomNavItem, BottomNavItem, BottomNavItem];
  centerLabel: string;
  onCenterPress: () => void;
  centerActive?: boolean;
  pathname: string;
}

/**
 * iOS-style bottom tab bar with an elevated center FAB button.
 * Layout: [item] [item] [+ FAB] [item] [item]
 * Dark pill container, icon + label for each tab, white elevated circle for center.
 */
export function DashboardBottomNav({
  items,
  centerLabel,
  onCenterPress,
  centerActive = false,
  pathname,
}: DashboardBottomNavProps) {
  const [left1, left2, right1, right2] = items;

  const Tab = ({ item }: { item: BottomNavItem }) => {
    const active = pathname === item.href || pathname.startsWith(item.href + "/");
    const Icon = item.icon;
    return (
      <Link
        href={item.href}
        aria-label={item.label}
        aria-current={active ? "page" : undefined}
        className={cn(
          "flex flex-col items-center justify-center gap-0.5 h-full flex-1 transition-colors",
          active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
        )}
      >
        <div className="relative">
          <Icon
            className={cn("size-5 transition-all", active ? "stroke-[2.25]" : "stroke-[1.75]")}
            aria-hidden="true"
          />
          {item.badge && item.badge > 0 ? (
            <span className="absolute -top-1 -right-1.5 flex items-center justify-center min-w-[14px] h-3.5 px-0.5 rounded-full bg-primary text-primary-foreground text-[8px] font-bold leading-none">
              {item.badge > 9 ? "9+" : item.badge}
            </span>
          ) : null}
        </div>
        <span className={cn("text-[10px] leading-none", active ? "font-bold" : "font-medium")}>
          {item.label}
        </span>
      </Link>
    );
  };

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-60 lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="Navigation"
    >
      <div className="mx-3 mb-3">
        <div
          className="flex items-center rounded-2xl overflow-visible relative"
          style={{ background: "#1c1c1e", height: "3.75rem" }}
        >
          {/* Left 2 tabs */}
          <Tab item={left1} />
          <Tab item={left2} />

          {/* Center elevated FAB */}
          <div className="flex flex-col items-center justify-center flex-1 relative -mt-7">
            <button
              type="button"
              onClick={onCenterPress}
              aria-label={centerLabel}
              className={cn(
                "size-14 rounded-full flex items-center justify-center shadow-lg transition-all active:scale-95 cursor-pointer border-4",
                centerActive
                  ? "bg-primary text-primary-foreground border-[#1c1c1e]"
                  : "bg-white text-black border-[#1c1c1e]"
              )}
            >
              <Plus className="size-6 stroke-[2.5]" />
            </button>
            <span className={cn(
              "text-[10px] font-bold mt-0.5 leading-none",
              centerActive ? "text-primary" : "text-white"
            )}>
              {centerLabel}
            </span>
          </div>

          {/* Right 2 tabs */}
          <Tab item={right1} />
          <Tab item={right2} />
        </div>
      </div>
    </nav>
  );
}
