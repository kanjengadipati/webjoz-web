"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, Code, Star } from "lucide-react";

const TABS = [
  { href: "", label: "Editor", icon: null },
  { href: "/blog", label: "Blog", icon: FileText },
  { href: "/integrations", label: "Integrasi", icon: Code },
  { href: "/testimonials", label: "Testimoni", icon: Star },
] as const;

export function SiteSubNav({ siteId }: { siteId: number }) {
  const pathname = usePathname();
  const current = pathname.replace(`/dashboard/sites/${siteId}`, "") || "";

  return (
    <nav className="flex gap-1 border-b pb-3 mb-6 overflow-x-auto">
      {TABS.map(({ href, label, icon: Icon }) => {
        const isActive = href === ""
          ? current === "" || (!current.startsWith("/") && current.length === 0)
          : current === href;
        return (
          <Link
            key={href}
            href={`/dashboard/sites/${siteId}${href}`}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            }`}
          >
            {Icon && <Icon className="w-4 h-4" />}
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
