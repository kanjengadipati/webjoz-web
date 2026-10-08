"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, ArrowRight, CheckCheck, Loader2, Inbox } from "lucide-react";
import { useAuthToken } from "@/lib/auth-store";
import { useI18n } from "@/lib/i18n/context";
import { usePermissions } from "@/hooks/use-permissions";
import { useUnreadNotifications } from "@/hooks/use-unread-notifications";
import {
  fetchNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  type NotificationItem,
} from "@/lib/api/notifications";
import {
  TYPE_META,
  TYPE_LABEL_KEYS,
  getNotificationLink,
  localizedNotification,
  formatRelativeTime,
} from "@/lib/notifications-ui";
import { cn } from "@/lib/utils";

const PREVIEW_LIMIT = 8;

// Header bell: a compact preview of the latest notifications without leaving
// the current page. Clicking a row marks it read and deep-links to its target.
export function NotificationsBell() {
  const token = useAuthToken();
  const router = useRouter();
  const { t, locale } = useI18n();
  const { role } = usePermissions();
  const { unreadCount, refresh: refreshCount } = useUnreadNotifications();

  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [markingAll, setMarkingAll] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const isAdmin = role === "admin" || role === "superadmin";

  const load = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      const { items: latest } = await fetchNotifications(token, PREVIEW_LIMIT, 1);
      setItems(latest);
    } catch {
      // Keep the last preview; the badge still reflects the unread count.
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const toggle = () => {
    const next = !open;
    setOpen(next);
    if (next) void load();
  };

  const handleOpenItem = async (n: NotificationItem) => {
    if (!token) return;
    try {
      if (!n.is_read) {
        await markNotificationRead(token, n.id);
        setItems((prev) => prev.map((x) => (x.id === n.id ? { ...x, is_read: true } : x)));
        void refreshCount();
      }
    } catch {
      // Navigation still proceeds even if marking read fails.
    }
    setOpen(false);
    router.push(getNotificationLink(n, isAdmin) ?? "/dashboard/notifications");
  };

  const handleMarkAll = async () => {
    if (!token) return;
    try {
      setMarkingAll(true);
      await markAllNotificationsRead(token);
      setItems((prev) => prev.map((x) => ({ ...x, is_read: true })));
      void refreshCount();
    } catch {
      // Non-blocking; the page offers the same action with a toast.
    } finally {
      setMarkingAll(false);
    }
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label={t("dashboard.notifications.title")}
        title={t("dashboard.notifications.title")}
        className="relative size-10 rounded-xl border border-border/60 bg-card/60 hover:bg-primary/10 flex items-center justify-center transition-all cursor-pointer"
      >
        <Bell className="size-[18px] text-muted-foreground" aria-hidden="true" />
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full bg-primary text-primary-foreground text-[9px] font-bold leading-none shadow-md">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          role="menu"
          aria-label={t("dashboard.notifications.title")}
          className="absolute right-0 mt-2 w-96 max-w-[calc(100vw-2rem)] rounded-2xl border border-border/60 bg-card shadow-2xl shadow-slate-900/15 dark:shadow-black/40 overflow-hidden z-50"
        >
          <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-border/40 bg-muted/20">
            <span className="text-sm font-bold text-foreground">{t("dashboard.notifications.title")}</span>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={() => void handleMarkAll()}
                disabled={markingAll}
                className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground hover:text-primary transition-colors cursor-pointer disabled:opacity-60"
              >
                {markingAll ? <Loader2 className="size-3 animate-spin" /> : <CheckCheck className="size-3" />}
                {t("dashboard.notifications.markAllRead")}
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-border/30">
            {loading && items.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="size-5 text-primary animate-spin" aria-hidden="true" />
              </div>
            ) : items.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-8 px-4 text-center">
                <Inbox className="size-7 text-muted-foreground/40" aria-hidden="true" />
                <p className="text-xs font-semibold text-muted-foreground">{t("dashboard.notifications.emptyTitle")}</p>
              </div>
            ) : (
              items.map((n) => {
                const meta = TYPE_META[n.type] || TYPE_META.system;
                const Icon = meta.icon;
                const { title, message } = localizedNotification(n, locale);
                return (
                  <button
                    key={n.id}
                    type="button"
                    onClick={() => void handleOpenItem(n)}
                    className={cn(
                      "relative w-full text-left flex items-start gap-3 px-4 py-3 transition-colors cursor-pointer",
                      !n.is_read ? "bg-primary/[0.04] hover:bg-primary/[0.08]" : "hover:bg-muted/40"
                    )}
                  >
                    {!n.is_read && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-7 bg-primary rounded-r-full" aria-hidden="true" />
                    )}
                    <span className="size-8 rounded-lg bg-muted flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className={cn("size-4", meta.color)} aria-hidden="true" />
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className={cn("block text-xs leading-snug text-foreground truncate", !n.is_read ? "font-bold" : "font-medium")}>
                        {title}
                      </span>
                      <span className="block text-[11px] text-muted-foreground/70 mt-0.5 line-clamp-2 leading-relaxed">
                        {message}
                      </span>
                      <span className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-muted-foreground/50 font-medium uppercase tracking-wider">
                          {t(TYPE_LABEL_KEYS[n.type] ?? "dashboard.notifications.typeSystem")}
                        </span>
                        <span className="size-1 rounded-full bg-muted-foreground/20" aria-hidden="true" />
                        <span className="text-[10px] text-muted-foreground/60">
                          {formatRelativeTime(n.created_at, locale, t)}
                        </span>
                      </span>
                    </span>
                  </button>
                );
              })
            )}
          </div>

          <Link
            href="/dashboard/notifications"
            onClick={() => setOpen(false)}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 border-t border-border/40 bg-muted/20 hover:bg-muted/50 text-[11px] font-bold text-muted-foreground hover:text-primary transition-colors"
          >
            {t("dashboard.notifications.viewAll")}
            <ArrowRight className="size-3" aria-hidden="true" />
          </Link>
        </div>
      )}
    </div>
  );
}
