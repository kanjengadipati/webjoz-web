"use client";

import React, { useState, useEffect } from "react";
import { useAuthToken } from "@/lib/auth-store";
import { request } from "@/lib/api/client";
import { usePermissions } from "@/hooks/use-permissions";
import { Building2, Loader2, Users, Globe, Calendar } from "lucide-react";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { useToast } from "@/components/toast-provider";
import { useI18n } from "@/lib/i18n/context";
import Link from "next/link";

interface TenantItem {
  id: number;
  name: string;
  slug: string;
  plan: string;
  owner_id: number;
  member_count: number;
  site_count: number;
  created_at: string;
}

export default function AdminTenantsPage() {
  const token = useAuthToken();
  const { pushToast } = useToast();
  const { t, locale } = useI18n();
  const { hasPermission, role } = usePermissions();
  const [tenants, setTenants] = useState<TenantItem[]>([]);
  const [loading, setLoading] = useState(true);

  const isAdmin = role === "superadmin" || role === "admin";

  useEffect(() => {
    if (!token || !isAdmin) return;
    (async () => {
      try {
        setLoading(true);
        const res = await request<TenantItem[]>("/tenants/admin", {}, token);
        setTenants(res.data || []);
      } catch (err: any) {
        pushToast(err.message || t("dashboard.tenants.loadFailed"), "error");
      } finally {
        setLoading(false);
      }
    })();
  }, [token, isAdmin]);

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-80 text-muted-foreground gap-4">
        <Building2 className="size-12 opacity-40" />
        <p className="text-sm">{t("dashboard.tenants.accessDenied")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-border/40 shadow-sm">
        <CardHeader className="border-b border-border/20 pb-4">
          <CardTitle className="text-lg font-bold tracking-tight flex items-center gap-3">
            <Building2 className="size-5 text-primary" />
            {t("dashboard.tenants.title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
          ) : tenants.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
              <Building2 className="size-10 opacity-30" />
              <p className="text-sm">{t("dashboard.tenants.emptyTitle")}</p>
            </div>
          ) : (
            <>
              {/* Mobile: Card layout */}
              <div className="grid gap-3 sm:hidden p-4">
                {tenants.map((tenant) => (
                  <Link key={tenant.id} href={`/dashboard/tenants/${tenant.id}`} className="rounded-xl border border-border/30 bg-card p-4 hover:border-primary/30 transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <div className="font-semibold text-sm">{tenant.name}</div>
                      <span className="inline-flex items-center rounded-full border border-border/40 px-2 py-0.5 text-[10px] font-medium capitalize">
                        {tenant.plan}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Users className="size-3" />{tenant.member_count}</span>
                      <span className="flex items-center gap-1"><Globe className="size-3" />{tenant.site_count}</span>
                      <span className="flex items-center gap-1"><Calendar className="size-3" />{new Date(tenant.created_at).toLocaleDateString(locale === "id" ? "id-ID" : "en-US", { year: "numeric", month: "short", day: "numeric" })}</span>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Desktop: Table layout */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/20 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
                      <th className="px-6 py-4">{t("dashboard.tenants.thTenant")}</th>
                      <th className="px-6 py-4">{t("dashboard.tenants.thPlan")}</th>
                      <th className="px-6 py-4 text-center">{t("dashboard.tenants.thMembers")}</th>
                      <th className="px-6 py-4 text-center">{t("dashboard.tenants.thSites")}</th>
                      <th className="px-6 py-4">{t("dashboard.tenants.thCreated")}</th>
                      <th className="px-6 py-4"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {tenants.map((tenant) => (
                      <tr key={tenant.id} className="border-b border-border/10 hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-semibold">{tenant.name}</div>
                          <div className="text-xs text-muted-foreground">{tenant.slug}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center rounded-full border border-border/40 px-2.5 py-0.5 text-xs font-medium capitalize">
                            {tenant.plan}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                            <Users className="size-3.5" />
                            {tenant.member_count}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                            <Globe className="size-3.5" />
                            {tenant.site_count}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs text-muted-foreground">
                          <span className="inline-flex items-center gap-1.5">
                            <Calendar className="size-3" />
                            {new Date(tenant.created_at).toLocaleDateString(locale === "id" ? "id-ID" : "en-US", {
                              year: "numeric", month: "short", day: "numeric"
                            })}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Link href={`/dashboard/tenants/${tenant.id}`}>
                            <Button variant="ghost" size="sm" className="text-xs">
                              {t("dashboard.tenants.manage")}
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
