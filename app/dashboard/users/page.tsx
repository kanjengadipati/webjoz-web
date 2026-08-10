"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Card, CardContent, CardHeader, EmptyState, Input, SectionTitle, SkeletonBlock, StatusBadge } from "@/components/ui";
import { useToast } from "@/components/toast-provider";
import { useI18n } from "@/lib/i18n/context";
import { usePermissions } from "@/hooks/use-permissions";
import { deleteUser, fetchUsers, updateUser } from "@/lib/api";
import { useAuthToken } from "@/lib/auth-store";
import { SectionState } from "@/lib/types";
import type { User } from "@/lib/types";

export default function UsersPage() {
  const token = useAuthToken();
  const { pushToast } = useToast();
  const { t } = useI18n();
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [state, setState] = useState<SectionState>(SectionState.IDLE);
  const { role: currentRole, profile } = usePermissions();

  const query = useMemo(() => {
    const params = new URLSearchParams({ page: "1", limit: "20" });
    if (search) params.set("search", search);
    if (role) params.set("role", role);
    return params;
  }, [role, search]);

  const loadUsers = useCallback(async () => {
    if (!token) return;
    setState(SectionState.LOADING);
    try {
      const response = await fetchUsers(token, query);
      setUsers(response.data);
      setState(SectionState.SUCCESS);
    } catch (error) {
      setState(SectionState.ERROR);
      pushToast(error instanceof Error ? error.message : t("dashboard.users.loadFailed"), "error");
    }
  }, [pushToast, query, token, t]);

  useEffect(() => {
    if (!token) return;
    const timeout = window.setTimeout(() => {
      void loadUsers();
    }, 0);
    return () => window.clearTimeout(timeout);
  }, [loadUsers, token]);

  async function handleChangeRole(user: User, newRole: string) {
    if (!token || user.role === newRole) return;
    try {
      await updateUser(token, user.id, {
        name: user.name,
        email: user.email,
        role: newRole,
        is_verified: user.is_verified
      });
      pushToast(t("dashboard.users.roleUpdated", undefined, { name: user.name, role: newRole }), "success");
      void loadUsers();
    } catch {
      pushToast(t("dashboard.users.roleUpdateFailed"), "error");
    }
  }

  async function handleDeleteUser(user: User) {
    if (!token) return;
    if (!confirm(t("dashboard.users.deleteConfirm", undefined, { name: user.name }))) return;
    try {
      await deleteUser(token, user.id);
      pushToast(t("dashboard.users.deleted", undefined, { name: user.name }), "success");
      void loadUsers();
    } catch (error) {
      pushToast(error instanceof Error ? error.message : t("dashboard.users.deleteFailed"), "error");
    }
  }

  const canDelete = (user: User) => {
    if (user.id === profile?.id) return false;
    if (currentRole === "superadmin") return user.role !== "superadmin";
    if (currentRole === "admin") return user.role === "user";
    return false;
  };

  const filteredUsers = users.filter((u) => u.id !== profile?.id);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="border-b border-border/60">
          <SectionTitle eyebrow={state} title={t("dashboard.users.title")} action={<Button onClick={() => void loadUsers()}>{t("dashboard.users.refresh")}</Button>} />
        </CardHeader>
        <CardContent className="grid gap-4 pt-6 md:grid-cols-2">
          <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={t("dashboard.users.searchPlaceholder")} />
          <Input value={role} onChange={(event) => setRole(event.target.value)} placeholder={t("dashboard.users.rolePlaceholder")} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-b border-border/60">
          <SectionTitle eyebrow={String(filteredUsers.length)} title={t("dashboard.users.adminVisibleTitle")} />
        </CardHeader>
        <CardContent className="pt-6">
        {state === SectionState.LOADING ? (
          <div className="grid gap-3">
            <SkeletonBlock className="h-20" />
            <SkeletonBlock className="h-20" />
          </div>
        ) : filteredUsers.length === 0 ? (
          <EmptyState text={t("dashboard.users.emptyDesc")} />
        ) : (
          <div className="grid gap-3">
            {filteredUsers.map((user) => (
              <div key={user.id} className="rounded-3xl border border-border/70 bg-muted/35 px-5 py-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="text-lg font-semibold">{user.name}</div>
                    <div className="mt-1 text-sm text-muted-foreground">{user.email}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex gap-2 mr-2">
                      <StatusBadge status={user.role} />
                      <StatusBadge status={user.is_verified ? "verified" : "unverified"} />
                    </div>
                    <select
                      value={user.role}
                      onChange={(e) => void handleChangeRole(user, e.target.value)}
                      className="h-9 px-3 rounded-xl border border-input bg-background text-xs font-medium cursor-pointer hover:border-primary/50 transition-colors"
                    >
                      <option value="user">User</option>
                      <option value="sales">Sales</option>
                      <option value="admin">Admin</option>
                      {currentRole === "superadmin" && <option value="superadmin">Superadmin</option>}
                    </select>
                    {canDelete(user) && (
                      <Button
                        variant="destructive"
                        size="sm"
                        className="rounded-xl h-9"
                        onClick={() => void handleDeleteUser(user)}
                      >
                        {t("dashboard.users.delete")}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        </CardContent>
      </Card>
    </div>
  );
}
