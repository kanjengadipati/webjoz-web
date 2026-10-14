"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useAuthToken } from "@/lib/auth-store";
import { request } from "@/lib/api/client";
import { usePermissions } from "@/hooks/use-permissions";
import { useToast } from "@/components/toast-provider";
import { useI18n } from "@/lib/i18n/context";
import {
  Globe,
  Loader2,
  Search,
  ShieldOff,
  Lock,
  Unlock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, Dialog, Input, Textarea } from "webjoz-ui";

interface AdminSiteItem {
  id: number;
  hash_id: string;
  name: string;
  subdomain: string;
  status: string;
  language: string;
  published_at?: string | null;
  updated_at: string;
  tenant_name: string;
  tenant_slug?: string;
  admin_locked: boolean;
  admin_lock_reason?: string;
  admin_locked_at?: string | null;
}

const PAGE_SIZE = 20;

function errorMessage(err: unknown, fallback: string): string {
  if (err instanceof Error && err.message) return err.message;
  return fallback;
}

export default function AdminSitesPage() {
  const token = useAuthToken();
  const { pushToast } = useToast();
  const { t, locale } = useI18n();
  const { role } = usePermissions();

  const isAdmin = role === "superadmin" || role === "admin";

  const [sites, setSites] = useState<AdminSiteItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);

  const [lockTarget, setLockTarget] = useState<AdminSiteItem | null>(null);
  const [lockReason, setLockReason] = useState("");
  const [reasonError, setReasonError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [unlockTarget, setUnlockTarget] = useState<AdminSiteItem | null>(null);

  const loadSites = useCallback(async () => {
    if (!token || !isAdmin) return;
    try {
      setLoading(true);
      const params = new URLSearchParams({
        limit: String(PAGE_SIZE),
        offset: String(page * PAGE_SIZE),
      });
      if (query.trim()) params.set("search", query.trim());
      const res = await request<AdminSiteItem[]>(`/admin/sites?${params.toString()}`, {}, token);
      setSites(res.data || []);
      setTotal(Number(res.meta?.total ?? 0));
    } catch (err) {
      pushToast(errorMessage(err, t("dashboard.adminSites.loadFailed")), "error");
    } finally {
      setLoading(false);
    }
  }, [token, isAdmin, page, query, pushToast, t]);

  useEffect(() => {
    (async () => {
      await loadSites();
    })();
  }, [loadSites]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const rangeLabel = useMemo(() => {
    if (total === 0) return "0";
    const from = page * PAGE_SIZE + 1;
    const to = Math.min(total, (page + 1) * PAGE_SIZE);
    return `${from}–${to} / ${total}`;
  }, [page, total]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
    setQuery(search);
  };

  const openLock = (site: AdminSiteItem) => {
    setLockTarget(site);
    setLockReason("");
    setReasonError(false);
  };

  const confirmLock = async () => {
    if (!lockTarget) return;
    if (lockReason.trim().length < 3) {
      setReasonError(true);
      return;
    }
    try {
      setSubmitting(true);
      await request(
        `/admin/sites/${lockTarget.id}/lock`,
        { method: "POST", body: JSON.stringify({ reason: lockReason.trim() }) },
        token,
      );
      pushToast(t("dashboard.adminSites.lockSuccess"), "success");
      setLockTarget(null);
      await loadSites();
    } catch (err) {
      pushToast(errorMessage(err, t("dashboard.adminSites.loadFailed")), "error");
    } finally {
      setSubmitting(false);
    }
  };

  const confirmUnlock = async () => {
    if (!unlockTarget) return;
    try {
      setSubmitting(true);
      await request(
        `/admin/sites/${unlockTarget.id}/unlock`,
        { method: "POST" },
        token,
      );
      pushToast(t("dashboard.adminSites.unlockSuccess"), "success");
      setUnlockTarget(null);
      await loadSites();
    } catch (err) {
      pushToast(errorMessage(err, t("dashboard.adminSites.loadFailed")), "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-80 text-muted-foreground gap-4">
        <ShieldOff className="size-12 opacity-40" />
        <p className="text-sm">{t("dashboard.adminSites.accessDenied")}</p>
      </div>
    );
  }

  const formatDate = (iso?: string | null) => {
    if (!iso) return "-";
    try {
      return new Date(iso).toLocaleDateString(locale === "id" ? "id-ID" : "en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "-";
    }
  };

  const StatusBadge = ({ status }: { status: string }) =>
    status === "published" ? (
      <Badge variant="secondary" className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
        {t("dashboard.adminSites.statusPublished")}
      </Badge>
    ) : (
      <Badge variant="secondary" className="text-muted-foreground">
        {t("dashboard.adminSites.statusDraft")}
      </Badge>
    );

  return (
    <div className="space-y-6">
      <Card className="border-border/40 shadow-sm">
        <CardHeader className="border-b border-border/20 pb-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-lg font-bold tracking-tight flex items-center gap-3">
              <ShieldOff className="size-5 text-primary" />
              {t("dashboard.adminSites.title")}
            </CardTitle>
            <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("dashboard.adminSites.searchPlaceholder")}
                className="pl-9"
                aria-label={t("dashboard.adminSites.searchPlaceholder")}
              />
            </form>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
          ) : sites.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
              <Globe className="size-10 opacity-30" />
              <p className="text-sm">{t("dashboard.adminSites.emptyTitle")}</p>
            </div>
          ) : (
            <>
              {/* Mobile: card layout */}
              <div className="grid gap-3 sm:hidden p-4">
                {sites.map((site) => (
                  <div key={site.id} className="rounded-xl border border-border/30 bg-card p-4 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="font-semibold text-sm truncate">{site.name}</div>
                        <div className="text-xs text-muted-foreground truncate">{site.subdomain}</div>
                      </div>
                      <StatusBadge status={site.status} />
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <span className="truncate">{site.tenant_name}</span>
                      {site.admin_locked && (
                        <Badge variant="destructive">{t("dashboard.adminSites.lockedBadge")}</Badge>
                      )}
                    </div>
                    {site.admin_locked && site.admin_lock_reason && (
                      <p className="text-xs text-rose-500/90 leading-relaxed">
                        {t("dashboard.adminSites.lockedReason")}: {site.admin_lock_reason}
                      </p>
                    )}
                    <div>
                      {site.admin_locked ? (
                        <Button variant="secondary" size="sm" className="w-full" onClick={() => setUnlockTarget(site)}>
                          <Unlock className="size-3.5 mr-1.5" />
                          {t("dashboard.adminSites.unlock")}
                        </Button>
                      ) : (
                        <Button variant="secondary" size="sm" className="w-full" onClick={() => openLock(site)}>
                          <Lock className="size-3.5 mr-1.5" />
                          {t("dashboard.adminSites.lock")}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop: table layout */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/20 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
                      <th className="px-6 py-4">{t("dashboard.adminSites.thSite")}</th>
                      <th className="px-6 py-4">{t("dashboard.adminSites.thTenant")}</th>
                      <th className="px-6 py-4">{t("dashboard.adminSites.thStatus")}</th>
                      <th className="px-6 py-4 text-right">{t("dashboard.adminSites.thActions")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sites.map((site) => (
                      <tr key={site.id} className="border-b border-border/10 hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 font-semibold">
                            {site.name}
                            {site.admin_locked && (
                              <Badge variant="destructive">{t("dashboard.adminSites.lockedBadge")}</Badge>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground">{site.subdomain}</div>
                          {site.admin_locked && site.admin_lock_reason && (
                            <div className="text-xs text-rose-500/90 mt-1 max-w-md truncate" title={site.admin_lock_reason}>
                              {t("dashboard.adminSites.lockedReason")}: {site.admin_lock_reason}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm">{site.tenant_name}</div>
                          <div className="text-xs text-muted-foreground">{formatDate(site.updated_at)}</div>
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={site.status} />
                        </td>
                        <td className="px-6 py-4 text-right">
                          {site.admin_locked ? (
                            <Button variant="secondary" size="sm" className="text-xs" onClick={() => setUnlockTarget(site)}>
                              <Unlock className="size-3.5 mr-1.5" />
                              {t("dashboard.adminSites.unlock")}
                            </Button>
                          ) : (
                            <Button variant="secondary" size="sm" className="text-xs" onClick={() => openLock(site)}>
                              <Lock className="size-3.5 mr-1.5" />
                              {t("dashboard.adminSites.lock")}
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between border-t border-border/20 px-6 py-4">
                <span className="text-xs text-muted-foreground">{rangeLabel}</span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={page === 0}
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                  >
                    <ChevronLeft className="size-4" />
                  </Button>
                  <span className="text-xs text-muted-foreground">
                    {page + 1} / {totalPages}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={page + 1 >= totalPages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    <ChevronRight className="size-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Lock dialog */}
      <Dialog
        open={lockTarget !== null}
        onOpenChange={(open) => {
          if (!open && !submitting) setLockTarget(null);
        }}
        title={t("dashboard.adminSites.lockTitle")}
        footer={
          <>
            <Button variant="ghost" className="flex-1" disabled={submitting} onClick={() => setLockTarget(null)}>
              {t("dashboard.adminSites.cancel")}
            </Button>
            <Button variant="destructive" className="flex-1" disabled={submitting} onClick={confirmLock}>
              {submitting ? <Loader2 className="size-4 animate-spin" /> : t("dashboard.adminSites.confirmLock")}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {t("dashboard.adminSites.lockDesc", undefined, { name: lockTarget?.name ?? "" })}
          </p>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              {t("dashboard.adminSites.reasonLabel")}
            </label>
            <Textarea
              value={lockReason}
              onChange={(e) => {
                setLockReason(e.target.value);
                if (reasonError && e.target.value.trim().length >= 3) setReasonError(false);
              }}
              placeholder={t("dashboard.adminSites.reasonPlaceholder")}
              rows={4}
              error={reasonError ? t("dashboard.adminSites.reasonRequired") : undefined}
            />
          </div>
        </div>
      </Dialog>

      {/* Unlock dialog */}
      <Dialog
        open={unlockTarget !== null}
        onOpenChange={(open) => {
          if (!open && !submitting) setUnlockTarget(null);
        }}
        title={t("dashboard.adminSites.unlockTitle")}
        footer={
          <>
            <Button variant="ghost" className="flex-1" disabled={submitting} onClick={() => setUnlockTarget(null)}>
              {t("dashboard.adminSites.cancel")}
            </Button>
            <Button className="flex-1" disabled={submitting} onClick={confirmUnlock}>
              {submitting ? <Loader2 className="size-4 animate-spin" /> : t("dashboard.adminSites.confirmUnlock")}
            </Button>
          </>
        }
      >
        <p className="text-sm text-muted-foreground">
          {t("dashboard.adminSites.unlockDesc", undefined, { name: unlockTarget?.name ?? "" })}
        </p>
      </Dialog>
    </div>
  );
}
