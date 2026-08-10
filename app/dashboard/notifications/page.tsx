"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuthToken } from "@/lib/auth-store";
import { useRouter } from "next/navigation";
import {
  Bell, Megaphone, MessageSquare, ArrowRight, CheckCheck, Loader2,
  Info
} from "lucide-react";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { useToast } from "@/components/toast-provider";
import { useI18n } from "@/lib/i18n/context";
import {
  fetchNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  type NotificationItem
} from "@/lib/api/notifications";
import { useUnreadNotifications } from "@/hooks/use-unread-notifications";

const TYPE_META: Record<string, { icon: React.ElementType; color: string }> = {
  announcement: { icon: Megaphone, color: "text-blue-600" },
  lead: { icon: MessageSquare, color: "text-emerald-600" },
  system: { icon: Info, color: "text-amber-600" },
};

export default function NotificationsPage() {
  const token = useAuthToken();
  const router = useRouter();
  const { pushToast } = useToast();
  const { t, locale } = useI18n();
  const { unreadCount, refresh: refreshCount } = useUnreadNotifications();

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [markingAll, setMarkingAll] = useState(false);

  const load = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      const items = await fetchNotifications(token);
      setNotifications(items);
    } catch {
      pushToast(t("dashboard.notifications.loadFailed"), "error");
    } finally {
      setLoading(false);
    }
  }, [token, pushToast, t]);

  useEffect(() => {
    void load();
  }, [load]);

  const handleMarkRead = async (id: number) => {
    if (!token) return;
    try {
      await markNotificationRead(token, id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
      void refreshCount();
    } catch {
      pushToast(t("dashboard.notifications.markReadFailed"), "error");
    }
  };

  const handleMarkAllRead = async () => {
    if (!token) return;
    try {
      setMarkingAll(true);
      await markAllNotificationsRead(token);
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      void refreshCount();
      pushToast(t("dashboard.notifications.allRead"), "success");
    } catch {
      pushToast(t("dashboard.notifications.markAllFailed"), "error");
    } finally {
      setMarkingAll(false);
    }
  };

  const getNavLink = (n: NotificationItem) => {
    if (n.type === "lead") return "/dashboard/leads";
    if (n.type === "announcement") return "/dashboard/admin/announcements";
    return null;
  };

  const formatDate = (iso: string) => {
    try {
      const d = new Date(iso);
      const now = new Date();
      const diffMs = now.getTime() - d.getTime();
      const diffMin = Math.floor(diffMs / 60000);
      if (diffMin < 1) return t("dashboard.notifications.justNow");
      if (diffMin < 60) return t("dashboard.notifications.minutesAgo", undefined, { n: String(diffMin) });
      const diffHour = Math.floor(diffMin / 60);
      if (diffHour < 24) return t("dashboard.notifications.hoursAgo", undefined, { n: String(diffHour) });
      const diffDay = Math.floor(diffHour / 24);
      if (diffDay < 7) return t("dashboard.notifications.daysAgo", undefined, { n: String(diffDay) });
      return d.toLocaleDateString(locale === "id" ? "id-ID" : "en-US", { day: "numeric", month: "short" });
    } catch {
      return iso;
    }
  };

  if (loading && notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-80 gap-3">
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
        <p className="text-xs text-muted-foreground">{t("dashboard.notifications.loading")}</p>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <Card className="border-dashed border-border/70 p-12 text-center max-w-lg mx-auto">
        <div className="w-16 h-16 bg-primary/5 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
          <Bell className="w-8 h-8 opacity-75" />
        </div>
        <h2 className="text-xl font-bold mb-2">{t("dashboard.notifications.emptyTitle")}</h2>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
          {t("dashboard.notifications.emptyDesc")}
        </p>
      </Card>
    );
  }

  return (
    <Card className="border-border/40 overflow-hidden shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between p-6 border-b border-border/40">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Bell className="size-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-base font-bold">{t("dashboard.notifications.title")}</CardTitle>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {unreadCount > 0
                ? t("dashboard.notifications.unreadCount", undefined, { count: String(unreadCount) })
                : t("dashboard.notifications.noNew")}
            </p>
          </div>
        </div>
        {unreadCount > 0 && (
          <Button
            variant="secondary"
            size="sm"
            className="rounded-xl text-xs gap-2 h-9"
            onClick={() => void handleMarkAllRead()}
            disabled={markingAll}
          >
            {markingAll ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <CheckCheck className="size-3.5" />
            )}
            {t("dashboard.notifications.markAllRead")}
          </Button>
        )}
      </CardHeader>
      <div className="divide-y divide-border/30">
        {notifications.map((n) => {
          const meta = TYPE_META[n.type] || TYPE_META.system;
          const Icon = meta.icon;
          const link = getNavLink(n);
          return (
            <div
              key={n.id}
              className={`relative flex items-start gap-4 p-5 transition-all duration-200 ${
                !n.is_read
                  ? "bg-primary/[0.03] hover:bg-primary/[0.06]"
                  : "hover:bg-muted/30"
              }`}
            >
              {!n.is_read && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-8 bg-primary rounded-r-full" />
              )}
              <div className="size-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 mt-0.5">
                <Icon className={`size-5 ${meta.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className={`text-sm leading-snug ${!n.is_read ? "font-bold text-foreground" : "font-medium text-muted-foreground"}`}>
                      {n.title}
                    </p>
                    <p className="text-xs text-muted-foreground/70 mt-1.5 line-clamp-2 leading-relaxed">
                      {n.message}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {!n.is_read && (
                      <button
                        onClick={() => void handleMarkRead(n.id)}
                        className="size-8 rounded-xl hover:bg-primary/10 flex items-center justify-center transition-colors"
                        title={t("dashboard.notifications.markReadTooltip")}
                      >
                        <CheckCheck className="size-4 text-muted-foreground/50 hover:text-primary" />
                      </button>
                    )}
                    {link && (
                      <button
                        onClick={() => router.push(link!)}
                        className="size-8 rounded-xl hover:bg-primary/10 flex items-center justify-center transition-colors"
                        title={t("dashboard.notifications.viewTooltip")}
                      >
                        <ArrowRight className="size-4 text-muted-foreground/50 hover:text-primary" />
                      </button>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2.5 mt-2.5">
                  <span className="text-[10px] text-muted-foreground/50 font-medium uppercase tracking-wider">
                    {n.type === "announcement" ? t("dashboard.notifications.typeAnnouncement") : n.type === "lead" ? t("dashboard.notifications.typeLead") : t("dashboard.notifications.typeSystem")}
                  </span>
                  <span className="size-1 rounded-full bg-muted-foreground/20" />
                  <span className="text-[10px] text-muted-foreground/60">{formatDate(n.created_at)}</span>
                  {!n.is_read && (
                    <span className="size-1.5 rounded-full bg-primary shrink-0" />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
