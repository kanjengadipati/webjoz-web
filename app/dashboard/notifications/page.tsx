"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuthToken } from "@/lib/auth-store";
import { useRouter } from "next/navigation";
import {
  Bell, Megaphone, Inbox, ArrowRight, CheckCheck, Loader2,
  MessageSquare, Info, AlertTriangle, AlertCircle
} from "lucide-react";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { useToast } from "@/components/toast-provider";
import {
  fetchNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  type NotificationItem
} from "@/lib/api/notifications";
import { useUnreadNotifications } from "@/hooks/use-unread-notifications";

const TYPE_META: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  announcement: { icon: Megaphone, color: "text-blue-500", bg: "bg-blue-500/10" },
  lead: { icon: MessageSquare, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  system: { icon: Info, color: "text-amber-500", bg: "bg-amber-500/10" },
};

export default function NotificationsPage() {
  const token = useAuthToken();
  const router = useRouter();
  const { pushToast } = useToast();
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
      pushToast("Gagal memuat notifikasi", "error");
    } finally {
      setLoading(false);
    }
  }, [token, pushToast]);

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
      pushToast("Gagal menandai notifikasi", "error");
    }
  };

  const handleMarkAllRead = async () => {
    if (!token) return;
    try {
      setMarkingAll(true);
      await markAllNotificationsRead(token);
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      void refreshCount();
      pushToast("Semua notifikasi telah dibaca", "success");
    } catch {
      pushToast("Gagal menandai semua notifikasi", "error");
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
      if (diffMin < 1) return "Baru saja";
      if (diffMin < 60) return `${diffMin}m yang lalu`;
      const diffHour = Math.floor(diffMin / 60);
      if (diffHour < 24) return `${diffHour}j yang lalu`;
      const diffDay = Math.floor(diffHour / 24);
      if (diffDay < 7) return `${diffDay}h yang lalu`;
      return d.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
    } catch {
      return iso;
    }
  };

  if (loading && notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-80 gap-3">
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
        <p className="text-xs text-muted-foreground">Memuat notifikasi...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight flex items-center gap-3">
            <Bell className="size-5 text-primary" />
            Notifikasi
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {unreadCount > 0
              ? `${unreadCount} notifikasi belum dibaca`
              : "Tidak ada notifikasi baru"}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button
            variant="secondary"
            size="sm"
            className="gap-2"
            onClick={() => void handleMarkAllRead()}
            disabled={markingAll}
          >
            {markingAll ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <CheckCheck className="size-3.5" />
            )}
            Tandai Semua Dibaca
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <Card className="border-dashed border-border/70 p-12 text-center max-w-lg mx-auto">
          <div className="size-16 bg-primary/5 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <Bell className="size-8 opacity-75" />
          </div>
          <h2 className="text-xl font-bold mb-2">Tidak Ada Notifikasi</h2>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
            Belum ada notifikasi. Anda akan mendapat pemberitahuan saat ada pengumuman baru atau lead masuk ke website Anda.
          </p>
        </Card>
      ) : (
        <Card className="border-border/40 shadow-sm">
          <CardHeader className="border-b border-border/20 pb-4">
            <CardTitle className="text-base font-bold tracking-tight flex items-center gap-3">
              <Bell className="size-4 text-primary" />
              Semua Notifikasi
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border/30">
              {notifications.map((n) => {
                const meta = TYPE_META[n.type] || TYPE_META.system;
                const Icon = meta.icon;
                const link = getNavLink(n);
                return (
                  <div
                    key={n.id}
                    className={`p-4 flex items-start gap-4 transition-colors hover:bg-muted/30 ${
                      !n.is_read ? "bg-primary/5" : ""
                    }`}
                  >
                    {!n.is_read && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-8 bg-primary rounded-r" />
                    )}
                    <div className={`size-10 rounded-xl ${meta.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                      <Icon className={`size-5 ${meta.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className={`text-sm ${!n.is_read ? "font-bold text-foreground" : "font-medium text-muted-foreground"}`}>
                            {n.title}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{n.message}</p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          {!n.is_read && (
                            <button
                              onClick={() => void handleMarkRead(n.id)}
                              className="size-7 rounded-full hover:bg-primary/10 flex items-center justify-center transition-colors"
                              title="Tandai dibaca"
                            >
                              <CheckCheck className="size-3.5 text-muted-foreground hover:text-primary" />
                            </button>
                          )}
                          {link && (
                            <button
                              onClick={() => router.push(link!)}
                              className="size-7 rounded-full hover:bg-primary/10 flex items-center justify-center transition-colors"
                              title="Lihat detail"
                            >
                              <ArrowRight className="size-3.5 text-muted-foreground hover:text-primary" />
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[10px] text-muted-foreground/60">{formatDate(n.created_at)}</span>
                        {!n.is_read && (
                          <span className="size-1.5 rounded-full bg-primary" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
