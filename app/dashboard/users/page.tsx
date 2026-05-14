"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Card, CardContent, CardHeader, EmptyState, Input, SectionTitle, SkeletonBlock, StatusBadge } from "@/components/ui";
import { useToast } from "@/components/toast-provider";
import { usePermissions } from "@/hooks/use-permissions";
import { deleteUser, fetchUsers, updateUser } from "@/lib/api";
import { useAuthToken } from "@/lib/auth-store";
import { SectionState } from "@/lib/types";
import type { User } from "@/lib/types";

export default function UsersPage() {
  const token = useAuthToken();
  const { pushToast } = useToast();
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
      pushToast(error instanceof Error ? error.message : "Failed to load users", "error");
    }
  }, [pushToast, query, token]);

  useEffect(() => {
    if (!token) return;
    const timeout = window.setTimeout(() => {
      void loadUsers();
    }, 0);
    return () => window.clearTimeout(timeout);
  }, [loadUsers, token]);

  async function handleToggleRole(user: User) {
    if (!token) return;
    const newRole = user.role === "admin" ? "user" : "admin";
    try {
      await updateUser(token, user.id, {
        name: user.name,
        email: user.email,
        role: newRole,
        is_verified: user.is_verified
      });
      pushToast(`User updated to ${newRole}`, "success");
      void loadUsers();
    } catch {
      pushToast("Failed to update user role", "error");
    }
  }

  async function handleDeleteUser(user: User) {
    if (!token) return;
    if (!confirm(`Are you sure you want to delete ${user.name}?`)) return;
    try {
      await deleteUser(token, user.id);
      pushToast(`User ${user.name} deleted successfully`, "success");
      void loadUsers();
    } catch (error) {
      pushToast(error instanceof Error ? error.message : "Failed to delete user", "error");
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
          <SectionTitle eyebrow={state} title="User Management" action={<Button onClick={() => void loadUsers()}>Refresh</Button>} />
        </CardHeader>
        <CardContent className="grid gap-4 pt-6 md:grid-cols-2">
          <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by name or email" />
          <Input value={role} onChange={(event) => setRole(event.target.value)} placeholder="Role filter (admin/user)" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-b border-border/60">
          <SectionTitle eyebrow={String(filteredUsers.length)} title="Admin-visible users" />
        </CardHeader>
        <CardContent className="pt-6">
        {state === SectionState.LOADING ? (
          <div className="grid gap-3">
            <SkeletonBlock className="h-20" />
            <SkeletonBlock className="h-20" />
          </div>
        ) : filteredUsers.length === 0 ? (
          <EmptyState text="No users matched the current query." />
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
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-xl h-9"
                      onClick={() => void handleToggleRole(user)}
                    >
                      {user.role === "admin" ? "Demote" : "Make Admin"}
                    </Button>
                    {canDelete(user) && (
                      <Button
                        variant="destructive"
                        size="sm"
                        className="rounded-xl h-9"
                        onClick={() => void handleDeleteUser(user)}
                      >
                        Delete
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
