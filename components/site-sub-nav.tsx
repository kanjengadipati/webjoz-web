"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, Code, Star, ShoppingBag, Utensils, LayoutDashboard, SearchIcon, Globe } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

interface SiteSubNavProps {
  siteId: number;
  compact?: boolean;
  /** When provided, the Katalog/Menu tab is only shown if the site has that section.
   *  Leave undefined (e.g. in the desktop editor footer) to always show the tab. */
  hasCatalog?: boolean;
  hasMenu?: boolean;
}

export function SiteSubNav({ siteId, compact, hasCatalog, hasMenu }: SiteSubNavProps) {
  const pathname = usePathname();
  const { t } = useI18n();
  const current = pathname.replace(`/dashboard/sites/${siteId}`, "") || "";

  // Determine whether to show the catalog/menu tab and what label/icon to use.
  // If both props are undefined the tab is always shown (editor desktop footer context).
  const showCatalogTab = hasCatalog === undefined && hasMenu === undefined
    ? true                        // always show in editor footer
    : (hasCatalog || hasMenu);    // only show when site actually has that section

  const catalogLabel = hasMenu ? t("dashboard.sites.linkMenu") : t("dashboard.sites.linkCatalog");
  const CatalogIcon  = hasMenu ? Utensils : ShoppingBag;

  const ALWAYS_TABS = [
    { href: "",              label: t("dashboard.sites.linkEditor"), icon: LayoutDashboard },
    { href: "/blog",         label: t("dashboard.sites.linkBlog"),   icon: FileText },
    { href: "/integrations", label: t("dashboard.sites.linkIntegrations"), icon: Code },
    { href: "/testimonials", label: t("dashboard.sites.linkTestimonials"), icon: Star },
  ] as const;

  const allTabs = [
    ...ALWAYS_TABS.slice(0, 2),
    ...(showCatalogTab ? [{ href: "/katalog" as const, label: catalogLabel, icon: CatalogIcon }] : []),
    ...ALWAYS_TABS.slice(2),
    { href: "/seo" as const, label: t("dashboard.sites.linkSeo"), icon: SearchIcon },
  ];

  return (
    <nav className={`flex gap-1.5 overflow-x-auto no-scrollbar ${compact ? "" : "border-b border-white/[0.06] pb-3 mb-6"}`}>
      {allTabs.map(({ href, label, icon: Icon }) => {
        const isActive = href === ""
          ? current === ""
          : current === href;
        return (
          <Link
            key={href}
            href={`/dashboard/sites/${siteId}${href}`}
            className={`
              group relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12px] font-semibold
              transition-all duration-200 whitespace-nowrap select-none outline-none
              ${isActive
                ? "bg-primary text-primary-foreground shadow-[0_0_12px_rgba(var(--primary-rgb,99,102,241)/0.45)] scale-[1.02]"
                : "bg-muted/50 border border-white/[0.07] text-slate-400 hover:text-slate-100 hover:bg-white/[0.09] hover:border-border hover:scale-[1.02] active:scale-[0.98]"
              }
            `}
          >
            {Icon && (
              <Icon className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${isActive ? "opacity-90" : "opacity-60 group-hover:opacity-90"}`} />
            )}
            {label}
            {isActive && (
              <span className="absolute inset-0 rounded-full ring-1 ring-primary/40 pointer-events-none" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
