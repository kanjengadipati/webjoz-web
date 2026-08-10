"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { PhoneNumberInput, isValidPhoneNumber } from "@/components/phone-number-input";
import { Can } from "@/components/can";
import { Badge, Button, Card, CardContent, CardHeader, EmptyState, Input, Label, SectionTitle, SkeletonBlock, StatusBadge } from "@/components/ui";
import { useToast } from "@/components/toast-provider";
import { changePassword, fetchProfile, updateProfile } from "@/lib/api";
import { fetchAuditLogs, fetchInvestigationDetail, fetchInvestigationHistory, investigateLogs } from "@/lib/api";
import { fetchSessions, logoutAllSessions, revokeOtherSessions, revokeSession, revokeTrustedDevice } from "@/lib/api";
import { deleteUser, fetchUsers, updateUser } from "@/lib/api";
import { fetchRoles, fetchAllPermissions, fetchRolePermissions, updateRolePermissions } from "@/lib/api";
import { clearAuthSession, useAuthToken } from "@/lib/auth-store";
import { usePermissions } from "@/hooks/use-permissions";
import { SectionState } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/context";
import type { AuditLog, InvestigationHistory, InvestigationResult, Profile, Session, User } from "@/lib/types";

// ─── Tab definitions ──────────────────────────────────────────────────────────

type TabId = "profile" | "security" | "devices" | "users" | "permissions" | "logs" | "investigate";

interface TabDef {
  id: TabId;
  labelKey: string;
  permission?: string;
  group: "personal" | "admin";
}

const TABS: TabDef[] = [
  { id: "profile", labelKey: "dashboard.settings.tabProfile", group: "personal" },
  { id: "security", labelKey: "dashboard.settings.tabSecurity", group: "personal" },
  { id: "devices", labelKey: "dashboard.settings.tabDevices", group: "admin", permission: "dashboard.view" },
  { id: "users", labelKey: "dashboard.settings.tabUsers", group: "admin", permission: "permission.read" },
  { id: "permissions", labelKey: "dashboard.settings.tabPermissions", group: "admin", permission: "role.update_permissions" },
  { id: "logs", labelKey: "dashboard.settings.tabLogs", group: "admin", permission: "role.read" },
  { id: "investigate", labelKey: "dashboard.settings.tabInvestigate", group: "admin", permission: "role.read" },
];

// ─── Settings Page Shell ─────────────────────────────────────────────────────

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabId>("profile");
  const { hasPermission } = usePermissions();
  const { t } = useI18n();

  const visibleTabs = TABS.filter((tab) =>
    !tab.permission || hasPermission(tab.permission)
  );

  const personalTabs = visibleTabs.filter((t) => t.group === "personal");
  const adminTabs = visibleTabs.filter((t) => t.group === "admin");

  return (
    <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)] items-start">
      {/* Mobile: Horizontal Scroll Tabs */}
      <div className="lg:hidden -mx-1 overflow-x-auto scrollbar-none">
        <div className="flex gap-1.5 px-1 pb-1 min-w-max">
          {visibleTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "whitespace-nowrap rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200",
                activeTab === tab.id
                  ? "bg-primary/10 text-primary shadow-sm"
                  : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
              )}
            >
              {t(tab.labelKey)}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop: Sidebar Tab Navigation */}
      <nav className="hidden lg:block sticky top-24 rounded-2xl border border-border/40 bg-card/60 backdrop-blur-sm p-3 space-y-4 shadow-sm" aria-label={t("dashboard.settings.tabProfile")}>
        {/* Personal */}
        <div className="space-y-1">
          <div className="px-3 pb-1 text-[9px] font-bold uppercase tracking-[0.25em] text-muted-foreground/50">{t("dashboard.settings.groupAccount")}</div>
          {personalTabs.map((tab) => (
            <TabButton key={tab.id} tab={tab} active={activeTab === tab.id} onClick={() => setActiveTab(tab.id)} label={t(tab.labelKey)} />
          ))}
        </div>

        {/* Admin */}
        {adminTabs.length > 0 && (
          <div className="space-y-1 border-t border-border/40 pt-3">
            <div className="px-3 pb-1 text-[9px] font-bold uppercase tracking-[0.25em] text-muted-foreground/50">{t("dashboard.settings.groupAdmin")}</div>
            {adminTabs.map((tab) => (
              <TabButton key={tab.id} tab={tab} active={activeTab === tab.id} onClick={() => setActiveTab(tab.id)} label={t(tab.labelKey)} />
            ))}
          </div>
        )}
      </nav>

      {/* Tab Content */}
      <div className="min-w-0 animate-in fade-in slide-in-from-bottom-2 duration-300">
        {activeTab === "profile" && <ProfileTab />}
        {activeTab === "security" && <SecurityTab />}
        {activeTab === "devices" && <DevicesTab />}
        {activeTab === "users" && <UsersTab />}
        {activeTab === "permissions" && <PermissionsTab />}
        {activeTab === "logs" && <AuditLogsTab />}
        {activeTab === "investigate" && <InvestigateTab />}
      </div>
    </div>
  );
}

function TabButton({ tab, active, onClick, label }: { tab: TabDef; active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full flex items-center rounded-xl border-l-2 px-3 py-2 text-sm text-left transition-all duration-200",
        active
          ? "border-primary bg-primary/10 text-primary font-bold"
          : "border-transparent font-medium text-muted-foreground hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
      )}
      aria-current={active ? "page" : undefined}
    >
      {label}
    </button>
  );
}

// ─── Tab: Profil ─────────────────────────────────────────────────────────────

function ProfileTab() {
  const token = useAuthToken();
  const { pushToast } = useToast();
  const { t } = useI18n();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const loadProfile = useCallback(async () => {
    if (!token) return;
    try {
      const response = await fetchProfile(token);
      setProfile(response.data);
      setName(response.data.name);
      setPhoneNumber(response.data.phone_number || "");
    } catch (error) {
      pushToast(error instanceof Error ? error.message : t("dashboard.settings.profileFailedLoad"), "error");
    }
  }, [pushToast, token, t]);

  useEffect(() => {
    if (!token) return;
    const timeout = window.setTimeout(() => { void loadProfile(); }, 0);
    return () => window.clearTimeout(timeout);
  }, [loadProfile, token]);

  async function handleProfileUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) return;
    if (phoneNumber && !isValidPhoneNumber(phoneNumber)) {
      setPhoneError(t("dashboard.settings.profilePhoneError"));
      return;
    }
    setPhoneError("");
    try {
      await updateProfile(token, name, phoneNumber);
      pushToast(t("dashboard.settings.profileUpdated"), "success");
      await loadProfile();
    } catch (error) {
      pushToast(error instanceof Error ? error.message : t("dashboard.settings.profileFailedUpdate"), "error");
    }
  }

  return (
    <Card>
      <CardHeader className="border-b border-border/60">
        <SectionTitle eyebrow={t("dashboard.settings.profileEyebrow")} title={t("dashboard.settings.profileTitle")} />
      </CardHeader>
      <CardContent className="pt-6">
        {profile ? (
          <form className="space-y-4" onSubmit={handleProfileUpdate}>
            <div className="space-y-2">
              <Label>{t("dashboard.settings.email")}</Label>
              <Input value={profile.email} readOnly className="bg-muted/60 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <Label>{t("dashboard.settings.name")}</Label>
              <Input value={name} onChange={(event) => setName(event.target.value)} />
            </div>
            <PhoneNumberInput
              id="settings-phone-number"
              optional
              value={phoneNumber}
              onChange={(value) => { setPhoneNumber(value); setPhoneError(""); }}
              error={phoneError}
            />
            <Button type="submit">{t("dashboard.settings.saveProfile")}</Button>
          </form>
        ) : (
          <EmptyState text={t("dashboard.settings.profileEmpty")} />
        )}
      </CardContent>
    </Card>
  );
}

// ─── Tab: Keamanan ───────────────────────────────────────────────────────────

function SecurityTab() {
  const router = useRouter();
  const token = useAuthToken();
  const { pushToast } = useToast();
  const { t } = useI18n();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  async function handlePasswordChange(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) return;
    try {
      await changePassword(token, currentPassword, newPassword);
      clearAuthSession();
      setCurrentPassword("");
      setNewPassword("");
      pushToast(t("dashboard.settings.pwChanged"), "success");
      router.push("/login?passwordChanged=true");
    } catch (error) {
      pushToast(error instanceof Error ? error.message : t("dashboard.settings.pwFailed"), "error");
    }
  }

  return (
    <Card>
      <CardHeader className="border-b border-border/60">
        <SectionTitle eyebrow={t("dashboard.settings.securityEyebrow")} title={t("dashboard.settings.changePassword")} />
      </CardHeader>
      <CardContent className="pt-6">
        <form className="space-y-4" onSubmit={handlePasswordChange}>
          <div className="space-y-2">
            <Label>{t("dashboard.settings.currentPassword")}</Label>
            <Input type="password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>{t("dashboard.settings.newPassword")}</Label>
            <Input type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} />
          </div>
          <Button type="submit" variant="secondary">{t("dashboard.settings.updatePassword")}</Button>
        </form>
      </CardContent>
    </Card>
  );
}

// ─── Tab: Perangkat Aktif ────────────────────────────────────────────────────

function DevicesTab() {
  const router = useRouter();
  const token = useAuthToken();
  const { pushToast } = useToast();
  const { t } = useI18n();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [state, setState] = useState<SectionState>(SectionState.IDLE);

  const metrics = useMemo(() => ({
    total: sessions.length,
    trusted: sessions.filter((s) => s.is_trusted).length,
    current: sessions.filter((s) => s.is_current).length,
  }), [sessions]);

  const loadSessions = useCallback(async () => {
    if (!token) return;
    setState(SectionState.LOADING);
    try {
      const response = await fetchSessions(token);
      setSessions(response.data);
      setState(SectionState.SUCCESS);
    } catch (error) {
      setState(SectionState.ERROR);
      pushToast(error instanceof Error ? error.message : t("dashboard.settings.devicesFailedLoad"), "error");
    }
  }, [pushToast, token, t]);

  useEffect(() => {
    if (!token || state !== SectionState.IDLE) return;
    const timeout = window.setTimeout(() => { void loadSessions(); }, 0);
    return () => window.clearTimeout(timeout);
  }, [loadSessions, state, token]);

  async function handleRevoke(id: number) {
    if (!token) return;
    const prev = sessions;
    setSessions((c) => c.filter((s) => s.id !== id));
    try {
      await revokeSession(token, id);
      pushToast(t("dashboard.settings.deviceSignedOut"), "success");
    } catch (error) {
      setSessions(prev);
      pushToast(error instanceof Error ? error.message : t("dashboard.settings.deviceSignOutFailed"), "error");
    }
  }

  async function handleRemoveTrust(id: string) {
    if (!token) return;
    const prev = sessions;
    setSessions((c) => c.map((s) => s.trusted_device_id === id ? { ...s, is_trusted: false, trusted_device_id: undefined, trusted_at: undefined, last_trusted_at: undefined } : s));
    try {
      await revokeTrustedDevice(token, id);
      pushToast(t("dashboard.settings.trustRemoved"), "success");
    } catch (error) {
      setSessions(prev);
      pushToast(error instanceof Error ? error.message : t("dashboard.settings.trustRemovalFailed"), "error");
    }
  }

  async function handleRevokeOthers() {
    if (!token) return;
    const prev = sessions;
    setSessions((c) => c.filter((s) => s.is_current));
    try {
      await revokeOtherSessions(token);
      pushToast(t("dashboard.settings.othersSignedOut"), "success");
    } catch (error) {
      setSessions(prev);
      pushToast(error instanceof Error ? error.message : t("dashboard.settings.othersSignOutFailed"), "error");
    }
  }

  async function handleLogoutAll() {
    if (!token) return;
    try {
      await logoutAllSessions(token);
      pushToast(t("dashboard.settings.allSignedOut"), "success");
    } catch (error) {
      pushToast(error instanceof Error ? error.message : t("dashboard.settings.allSignOutFailed"), "error");
      return;
    }
    clearAuthSession();
    router.push("/login");
  }

  const deviceLabel = (s: Session) => {
    if (s.device_name) return s.device_name;
    const ua = s.user_agent || "";
    const browser = ua.includes("Chrome") ? "Chrome" : ua.includes("Safari") ? "Safari" : ua.includes("Firefox") ? "Firefox" : t("dashboard.settings.browser");
    const platform = ua.includes("Mac") ? "Mac" : ua.includes("iPhone") ? "iPhone" : ua.includes("Android") ? "Android" : ua.includes("Windows") ? "Windows" : "";
    return platform ? `${browser} • ${platform}` : s.device_id || t("dashboard.settings.unknownDevice");
  };

  const shortID = (v?: string) => {
    if (!v) return "-";
    return v.length <= 16 ? v : `${v.slice(0, 10)}...${v.slice(-6)}`;
  };

  const formatDate = (v?: string) => {
    if (!v) return "-";
    const d = new Date(v);
    return Number.isNaN(d.getTime()) ? "-" : d.toLocaleString();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="border-b border-border/60">
          <SectionTitle
            eyebrow={state}
            title={t("dashboard.settings.devicesTitle")}
            action={
              <div className="flex flex-wrap gap-2">
                <Button variant="ghost" size="sm" className="h-9 rounded-full px-4" onClick={() => void loadSessions()} disabled={state === SectionState.LOADING}>
                  {t("dashboard.settings.refresh")}
                </Button>
                <Can permission="session.delete">
                  <Button variant="secondary" size="sm" className="h-9 rounded-full px-4 font-bold" onClick={() => void handleRevokeOthers()} disabled={sessions.filter((s) => !s.is_current).length === 0}>
                    {t("dashboard.settings.signOutOthers")}
                  </Button>
                  <Button variant="destructive" size="sm" className="h-9 rounded-full px-4 font-bold" onClick={() => void handleLogoutAll()} disabled={sessions.length === 0}>
                    {t("dashboard.settings.signOutAll")}
                  </Button>
                </Can>
              </div>
            }
          />
        </CardHeader>
        <CardContent className="space-y-5 pt-6">
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { label: t("dashboard.settings.metricActiveSessions"), value: metrics.total },
              { label: t("dashboard.settings.metricTrustedDevices"), value: metrics.trusted },
              { label: t("dashboard.settings.metricThisSession"), value: metrics.current },
            ].map((m) => (
              <div key={m.label} className="rounded-2xl border border-border/60 bg-muted/25 p-4">
                <div className="text-xs font-medium text-muted-foreground">{m.label}</div>
                <div className="mt-1 text-2xl font-bold">{m.value}</div>
              </div>
            ))}
          </div>

          {state === SectionState.LOADING ? (
            <div className="grid gap-3">
              <SkeletonBlock className="h-24" />
              <SkeletonBlock className="h-24" />
            </div>
          ) : sessions.length === 0 ? (
            <EmptyState title={t("dashboard.settings.noSessionsTitle")} text={t("dashboard.settings.noSessionsText")} />
          ) : (
            <div className="grid gap-3">
              {sessions.map((session) => {
                const status = session.is_current ? t("dashboard.settings.statusCurrent") : session.is_trusted ? t("dashboard.settings.statusTrusted") : t("dashboard.settings.statusUnknown");
                return (
                  <div key={session.id} className="rounded-2xl border border-border/70 bg-muted/30 px-5 py-4">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <div className="font-semibold text-base">{deviceLabel(session)}</div>
                          <StatusBadge status={status} />
                        </div>
                        <div className="text-sm text-muted-foreground line-clamp-1">{session.user_agent || t("dashboard.settings.unknownUserAgent")}</div>
                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                          <span>{t("dashboard.settings.sessionId", undefined, { id: String(session.id) })}</span>
                          <span>{t("dashboard.settings.deviceId", undefined, { id: shortID(session.device_id) })}</span>
                          <span>{t("dashboard.settings.ip", undefined, { ip: session.ip_address || "-" })}</span>
                          <span>{t("dashboard.settings.lastUsed", undefined, { date: formatDate(session.updated_at) })}</span>
                          <span>{t("dashboard.settings.expires", undefined, { date: formatDate(session.expired_at) })}</span>
                        </div>
                      </div>
                      <div className="flex shrink-0 flex-wrap gap-2">
                        {session.is_trusted && session.trusted_device_id ? (
                          <Button variant="outline" size="sm" className="h-8 rounded-lg px-3 text-xs font-semibold" onClick={() => void handleRemoveTrust(session.trusted_device_id!)}>
                            {t("dashboard.settings.removeTrust")}
                          </Button>
                        ) : null}
                        {!session.is_current ? (
                          <Button variant="destructive" size="sm" className="h-8 rounded-lg px-3 text-xs font-semibold" onClick={() => void handleRevoke(session.id)}>
                            {t("dashboard.settings.revoke")}
                          </Button>
                        ) : null}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Tab: Pengguna ───────────────────────────────────────────────────────────

function UsersTab() {
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
      pushToast(error instanceof Error ? error.message : t("dashboard.settings.usersFailedLoad"), "error");
    }
  }, [pushToast, query, token, t]);

  useEffect(() => {
    if (!token) return;
    const timeout = window.setTimeout(() => { void loadUsers(); }, 0);
    return () => window.clearTimeout(timeout);
  }, [loadUsers, token]);

  async function handleChangeRole(user: User, newRole: string) {
    if (!token || newRole === user.role) return;
    try {
      await updateUser(token, user.id, { name: user.name, email: user.email, role: newRole, is_verified: user.is_verified });
      pushToast(t("dashboard.settings.userUpdated", undefined, { role: newRole }), "success");
      void loadUsers();
    } catch {
      pushToast(t("dashboard.settings.userUpdateFailed"), "error");
    }
  }

  async function handleDeleteUser(user: User) {
    if (!token) return;
    if (!confirm(t("dashboard.settings.userDeleteConfirm", undefined, { name: user.name }))) return;
    try {
      await deleteUser(token, user.id);
      pushToast(t("dashboard.settings.userDeleted", undefined, { name: user.name }), "success");
      void loadUsers();
    } catch (error) {
      pushToast(error instanceof Error ? error.message : t("dashboard.settings.userDeleteFailed"), "error");
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
          <SectionTitle eyebrow={state} title={t("dashboard.settings.usersTitle")} action={<Button onClick={() => void loadUsers()}>{t("dashboard.settings.refresh")}</Button>} />
        </CardHeader>
        <CardContent className="grid gap-4 pt-6 md:grid-cols-2">
          <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={t("dashboard.settings.searchByNameEmail")} />
          <Input value={role} onChange={(event) => setRole(event.target.value)} placeholder={t("dashboard.settings.roleFilter")} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-b border-border/60">
          <SectionTitle eyebrow={String(filteredUsers.length)} title={t("dashboard.settings.usersVisibleTitle")} />
        </CardHeader>
        <CardContent className="pt-6">
          {state === SectionState.LOADING ? (
            <div className="grid gap-3">
              <SkeletonBlock className="h-20" />
              <SkeletonBlock className="h-20" />
            </div>
          ) : filteredUsers.length === 0 ? (
            <EmptyState text={t("dashboard.settings.noUsersMatch")} />
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
                        <option value="user">{t("dashboard.settings.roleUser")}</option>
                        <option value="sales">{t("dashboard.settings.roleSales")}</option>
                        <option value="admin">{t("dashboard.settings.roleAdmin")}</option>
                        {currentRole === "superadmin" && <option value="superadmin">{t("dashboard.settings.roleSuperadmin")}</option>}
                      </select>
                      {canDelete(user) && (
                        <Button variant="destructive" size="sm" className="rounded-xl h-9" onClick={() => void handleDeleteUser(user)}>
                          {t("dashboard.settings.delete")}
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

// ─── Tab: Izin Role ──────────────────────────────────────────────────────────

type RoleOption = { id: number; name: string };
type NamedItem = { id?: number; name?: string; ID?: number; Name?: string };

function normalizeNamedItem(item: NamedItem): RoleOption | null {
  const id = item.id ?? item.ID;
  const name = item.name ?? item.Name;
  if (typeof id !== "number" || !name) return null;
  return { id, name };
}

function PermissionsTab() {
  const token = useAuthToken();
  const { pushToast } = useToast();
  const { t } = useI18n();
  const [roles, setRoles] = useState<RoleOption[]>([]);
  const [allPermissions, setAllPermissions] = useState<RoleOption[]>([]);
  const [selectedRole, setSelectedRole] = useState<number | null>(null);
  const [rolePermissions, setRolePermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadInitialData = useCallback(async () => {
    if (!token) return;
    try {
      const [rolesRes, permsRes] = await Promise.all([fetchRoles(token), fetchAllPermissions(token)]);
      const filteredRoles = rolesRes.data.map(normalizeNamedItem).filter((r): r is RoleOption => Boolean(r)).filter((r) => r.name.toLowerCase() !== "superadmin");
      const permissions = permsRes.data.map(normalizeNamedItem).filter((p): p is RoleOption => Boolean(p));
      setRoles(filteredRoles);
      setAllPermissions(permissions);
      if (filteredRoles.length) setSelectedRole(filteredRoles[0].id);
    } catch {
      pushToast(t("dashboard.settings.permsFailedLoad"), "error");
    } finally {
      setLoading(false);
    }
  }, [token, pushToast, t]);

  const loadRolePermissions = useCallback(async (roleID: number) => {
    if (!token) return;
    try {
      const res = await fetchRolePermissions(token, roleID);
      setRolePermissions(res.data.permissions);
    } catch {
      pushToast(t("dashboard.settings.permsRoleFailedLoad"), "error");
    }
  }, [token, pushToast, t]);

  useEffect(() => {
    const timeout = window.setTimeout(() => { void loadInitialData(); }, 0);
    return () => window.clearTimeout(timeout);
  }, [loadInitialData]);

  useEffect(() => {
    if (selectedRole) {
      const timeout = window.setTimeout(() => { void loadRolePermissions(selectedRole); }, 0);
      return () => window.clearTimeout(timeout);
    }
  }, [selectedRole, loadRolePermissions]);

  const togglePermission = (name: string) => {
    setRolePermissions((prev) => prev.includes(name) ? prev.filter((p) => p !== name) : [...prev, name]);
  };

  const handleSave = async () => {
    if (!token || !selectedRole) return;
    setSaving(true);
    try {
      await updateRolePermissions(token, selectedRole, rolePermissions);
      pushToast(t("dashboard.settings.permsSaved"), "success");
    } catch {
      pushToast(t("dashboard.settings.permsSaveFailed"), "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="space-y-6">
      <SkeletonBlock className="h-32" />
      <SkeletonBlock className="h-64" />
    </div>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="border-b border-border/60">
          <SectionTitle eyebrow={t("dashboard.settings.rbacEyebrow")} title={t("dashboard.settings.manageRolePermissions")} action={<Button onClick={handleSave} disabled={saving} className="shadow-lg shadow-primary/20">{saving ? t("dashboard.settings.saving") : t("dashboard.settings.saveChanges")}</Button>} />
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-2">
            {roles.map((role) => (
              <Button key={role.id} variant={selectedRole === role.id ? "default" : "outline"} className={cn("rounded-xl h-12 px-6", selectedRole === role.id && "shadow-lg shadow-primary/20")} onClick={() => setSelectedRole(role.id)}>
                {role.name}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-b border-border/60 bg-muted/20">
          <div className="flex items-center justify-between">
            <SectionTitle eyebrow={t("dashboard.settings.totalPermissions", undefined, { count: String(allPermissions.length) })} title={t("dashboard.settings.availablePermissions")} />
            <Badge variant="outline" className="bg-background">{t("dashboard.settings.activePermissions", undefined, { count: String(rolePermissions.length) })}</Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {allPermissions.map((perm) => {
              const isActive = rolePermissions.includes(perm.name);
              return (
                <button type="button" key={perm.id} onClick={() => togglePermission(perm.name)} className={cn("flex items-center justify-between p-4 rounded-2xl border text-left transition-all duration-300 cursor-pointer select-none group", isActive ? "border-primary bg-primary/5 shadow-sm" : "border-border/60 hover:border-primary/40 hover:bg-muted/50")}>
                  <div className="space-y-0.5">
                    <div className={cn("text-sm font-bold tracking-tight", isActive ? "text-primary" : "text-foreground")}>{perm.name}</div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">{t("dashboard.settings.resourceSuffix", undefined, { resource: perm.name.split(".")[0] })}</div>
                  </div>
                  <div className={cn("size-5 rounded-full border-2 flex items-center justify-center transition-all duration-300", isActive ? "bg-primary border-primary" : "border-border/80 group-hover:border-primary/40")}>
                    {isActive && <svg className="size-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Tab: Audit Logs ─────────────────────────────────────────────────────────

function AuditLogsTab() {
  const token = useAuthToken();
  const { pushToast } = useToast();
  const { t } = useI18n();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [expandedKey, setExpandedKey] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [state, setState] = useState<SectionState>(SectionState.IDLE);
  const [filters, setFilters] = useState({ action: "", resource: "auth", status: "", search: "", dateFrom: "", dateTo: "" });

  const query = useMemo(() => {
    const params = new URLSearchParams({ page: "1", limit: "20" });
    if (filters.action) params.set("action", filters.action);
    if (filters.resource) params.set("resource", filters.resource);
    if (filters.status) params.set("status", filters.status);
    if (filters.search) params.set("search", filters.search);
    if (filters.dateFrom) params.set("date_from", new Date(filters.dateFrom).toISOString());
    if (filters.dateTo) params.set("date_to", new Date(filters.dateTo).toISOString());
    return params;
  }, [filters]);

  const loadLogs = useCallback(async (showToast = false) => {
    if (!token) return;
    setState(SectionState.LOADING);
    try {
      const response = await fetchAuditLogs(token, query);
      setLogs(response.data);
      setState(SectionState.SUCCESS);
      if (showToast) pushToast(t("dashboard.settings.logsRefreshed"), "success");
    } catch (error) {
      setState(SectionState.ERROR);
      pushToast(error instanceof Error ? error.message : t("dashboard.settings.logsFailedLoad"), "error");
    }
  }, [pushToast, query, token, t]);

  useEffect(() => {
    if (!token) return;
    const timeout = window.setTimeout(() => { void loadLogs(); }, 0);
    return () => window.clearTimeout(timeout);
  }, [loadLogs, token]);

  useEffect(() => {
    if (!token || !autoRefresh) return;
    const id = window.setInterval(() => { void loadLogs(); }, 15000);
    return () => window.clearInterval(id);
  }, [autoRefresh, loadLogs, token]);

  const getLogKey = (log: AuditLog, index: number) =>
    typeof log.id === "number" && Number.isFinite(log.id)
      ? `log-${log.id}`
      : ["log", log.created_at || "?", log.action || "?", log.resource || "?", log.actor_user_id ?? "?", index].join(":");

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="border-b border-border/60">
          <SectionTitle
            eyebrow={state}
            title={t("dashboard.settings.logsTitle")}
            action={
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setAutoRefresh((v) => !v)}>{autoRefresh ? t("dashboard.settings.autoRefreshOn") : t("dashboard.settings.autoRefreshOff")}</Button>
                <Button onClick={() => void loadLogs(true)}>{t("dashboard.settings.refreshNow")}</Button>
              </div>
            }
          />
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
            {(["action", "resource", "status", "search"] as const).map((key) => (
              <div key={key} className="space-y-2">
                <Label className="capitalize">{key === "search" ? t("dashboard.settings.logFilterLabel") : key}</Label>
                <Input value={filters[key]} onChange={(e) => setFilters((c) => ({ ...c, [key]: e.target.value }))} placeholder={key === "resource" ? "auth" : key === "action" ? "login" : key === "status" ? "failed" : "203.0.113.10"} />
              </div>
            ))}
            {(["dateFrom", "dateTo"] as const).map((key) => (
              <div key={key} className="space-y-2">
                <Label>{key === "dateFrom" ? t("dashboard.settings.dateFrom") : t("dashboard.settings.dateTo")}</Label>
                <Input type="datetime-local" value={filters[key]} onChange={(e) => setFilters((c) => ({ ...c, [key]: e.target.value }))} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-b border-border/60">
          <SectionTitle eyebrow={String(logs.length)} title={t("dashboard.settings.eventTable")} />
        </CardHeader>
        <CardContent className="pt-6">
          {state === SectionState.LOADING ? (
            <div className="grid gap-3">
              <SkeletonBlock className="h-20" />
              <SkeletonBlock className="h-20" />
              <SkeletonBlock className="h-20" />
            </div>
          ) : logs.length === 0 ? (
            <EmptyState text={t("dashboard.settings.noLogsMatch")} />
          ) : (
            <div className="grid gap-3">
              {logs.map((log, index) => {
                const rowKey = getLogKey(log, index);
                const isOpen = expandedKey === rowKey;
                return (
                  <div key={rowKey} className="rounded-3xl border border-border/70 bg-muted/35">
                    <button type="button" onClick={() => setExpandedKey(isOpen ? null : rowKey)} className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left">
                      <div>
                        <div className="font-medium">{t("dashboard.settings.logActionOn", undefined, { action: log.action, resource: log.resource })}</div>
                        <div className="mt-1 text-sm text-muted-foreground">{log.description || t("dashboard.settings.noDescription")}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-xs text-muted-foreground">{log.created_at ? new Date(log.created_at).toLocaleString() : "-"}</div>
                        <StatusBadge status={log.status} />
                      </div>
                    </button>
                    {isOpen && (
                      <div className="grid gap-3 border-t border-border/70 px-5 py-4 text-sm text-muted-foreground md:grid-cols-3">
                        {[[t("dashboard.settings.ipAddress"), log.ip_address || "-"], [t("dashboard.settings.actorUserId"), String(log.actor_user_id ?? "-")], [t("dashboard.settings.userAgent"), log.user_agent || "-"]].map(([label, value]) => (
                          <div key={label} className="rounded-2xl border border-border/70 bg-background/80 px-4 py-3">
                            <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{label}</div>
                            <div className="mt-2 break-words text-sm text-foreground">{value}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Tab: AI Investigator ────────────────────────────────────────────────────

function InvestigateTab() {
  const token = useAuthToken();
  const { pushToast } = useToast();
  const { t, translations } = useI18n();
  const [payload, setPayload] = useState({ resource: "auth", status: "failed", action: "", search: "", limit: 25, dateFrom: "", dateTo: "" });
  const [result, setResult] = useState<InvestigationResult | null>(null);
  const [meta, setMeta] = useState<Record<string, unknown> | null>(null);
  const [history, setHistory] = useState<InvestigationHistory[]>([]);
  const [selected, setSelected] = useState<InvestigationHistory | null>(null);
  const [loadingIndex, setLoadingIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const loadingMessages = translations.dashboard.settings.investLoading;

  useEffect(() => {
    if (token) void loadHistory(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    if (!isLoading) return;
    const id = window.setInterval(() => { setLoadingIndex((c) => (c + 1) % loadingMessages.length); }, 900);
    return () => window.clearInterval(id);
  }, [isLoading]);

  async function loadHistory(p = page) {
    if (!token) return;
    try {
      const response = await fetchInvestigationHistory(token, p, 10);
      setHistory(response.data || []);
      if (response.meta?.total) setTotalPages(Math.ceil((response.meta.total as number) / 10));
    } catch (error) {
      pushToast(error instanceof Error ? error.message : t("dashboard.settings.investLoadHistoryFailed"), "error");
    }
  }

  async function handleInvestigate() {
    if (!token) return;
    setIsLoading(true);
    setLoadingIndex(0);
    try {
      const body: Record<string, unknown> = { resource: payload.resource, status: payload.status, limit: payload.limit };
      if (payload.action) body.action = payload.action;
      if (payload.search) body.search = payload.search;
      if (payload.dateFrom) body.date_from = new Date(payload.dateFrom).toISOString();
      if (payload.dateTo) body.date_to = new Date(payload.dateTo).toISOString();
      const response = await investigateLogs(token, body);
      setResult(response.data || null);
      setMeta(response.meta || null);
      pushToast(t("dashboard.settings.investCompleted"), "success");
      await loadHistory();
    } catch (error) {
      pushToast(error instanceof Error ? error.message : t("dashboard.settings.investFailed"), "error");
    } finally {
      setIsLoading(false);
    }
  }

  async function openHistory(id: number) {
    if (!token) return;
    try {
      const response = await fetchInvestigationDetail(token, id);
      setSelected(response.data || null);
    } catch (error) {
      pushToast(error instanceof Error ? error.message : t("dashboard.settings.investDetailFailed"), "error");
    }
  }

  const riskAssessment = useMemo(() => {
    if (!result) return { level: "low", score: 0, note: t("dashboard.settings.noResultYet") };
    const signals = result.suspicious_signals.length;
    const recs = result.recommendations.length;
    const summary = result.summary.toLowerCase();
    const metaStatus = String(meta?.status || "").toLowerCase();
    const logCount = Number(meta?.log_count || 0);
    let score = Math.min(signals * 18, 54) + Math.min(recs * 6, 18);
    if (logCount >= 100) score += 15; else if (logCount >= 50) score += 10; else if (logCount >= 20) score += 5;
    if (metaStatus === "failed" || metaStatus === "denied") score += 12;
    if (["critical", "immediate", "urgent", "breach", "compromise", "blocked", "escalate"].some((kw) => summary.includes(kw))) score += 16;
    const level = score >= 60 ? "high" : score >= 28 ? "medium" : "low";
    const note = level === "high" ? t("dashboard.settings.riskNoteHigh") : level === "medium" ? t("dashboard.settings.riskNoteMedium") : t("dashboard.settings.riskNoteLow");
    return { level, score, note };
  }, [meta, result, t]);

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader className="border-b border-border/60">
          <SectionTitle
            eyebrow={t("dashboard.settings.investEyebrow")}
            title={t("dashboard.settings.investTitle")}
            action={
              <Button variant="secondary" onClick={() => void handleInvestigate()} disabled={isLoading} className="rounded-full px-6 font-bold">
                {isLoading ? t("dashboard.settings.analyzing") : t("dashboard.settings.runInvestigation")}
              </Button>
            }
          />
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {(["resource", "status", "action", "search"] as const).map((key) => (
              <div key={key} className="space-y-2">
                <Label className="capitalize">{key}</Label>
                <Input type="text" value={String(payload[key])} onChange={(e) => setPayload((c) => ({ ...c, [key]: e.target.value }))} placeholder={key === "action" ? "login" : key === "search" ? "invalid credentials" : ""} />
              </div>
            ))}
            {(["dateFrom", "dateTo"] as const).map((key) => (
              <div key={key} className="space-y-2">
                <Label>{key === "dateFrom" ? t("dashboard.settings.dateFrom") : t("dashboard.settings.dateTo")}</Label>
                <Input type="datetime-local" value={payload[key]} onChange={(e) => setPayload((c) => ({ ...c, [key]: e.target.value }))} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <section className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.12fr)_minmax(22rem,0.88fr)]">
        <Card className="overflow-hidden">
          <CardHeader className="border-b border-border/60 px-6 py-5">
            <SectionTitle eyebrow={isLoading ? t("dashboard.settings.streamingAnalysis") : t("dashboard.settings.latestResult")} title={t("dashboard.settings.investOutputTitle")} />
          </CardHeader>
          <CardContent className="p-6">
            {isLoading ? (
              <div className="space-y-4 animate-in fade-in duration-500">
                <div className="rounded-3xl bg-slate-950 px-6 py-8 text-white dark:bg-slate-900 shadow-2xl shadow-primary/10">
                  <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full bg-muted-foreground animate-ping" />
                    <div className="text-xs uppercase tracking-[0.24em] text-slate-400 font-bold">{t("dashboard.settings.aiProcessing")}</div>
                  </div>
                  <div className="mt-4 text-2xl font-semibold tracking-tight leading-tight">{loadingMessages[loadingIndex]}</div>
                  <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-white/5">
                    <div className="h-full w-full bg-gradient-to-r from-muted via-primary to-muted bg-[length:200%_100%] animate-shimmer rounded-full" />
                  </div>
                </div>
                <div className="grid gap-3">
                  <div className="animate-pulse rounded-2xl bg-slate-100 px-4 py-6 dark:bg-slate-800" />
                  <div className="animate-pulse rounded-2xl bg-slate-100 px-4 py-6 dark:bg-slate-800" />
                </div>
              </div>
            ) : result ? (
              <div className="space-y-5">
                <div className="rounded-3xl border border-border/70 bg-muted/35 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm uppercase tracking-[0.2em] text-muted-foreground">{t("dashboard.settings.riskLevel")}</div>
                    <div className="flex flex-col items-end">
                      <StatusBadge status={riskAssessment.level} />
                      <span className="mt-1 text-[10px] text-muted-foreground/60">{t("dashboard.settings.riskWeightNote")}</span>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between gap-3 text-sm">
                    <span className="text-muted-foreground">{riskAssessment.note}</span>
                    <span className="rounded-full border border-border/60 px-2.5 py-1 font-medium text-foreground/80">{t("dashboard.settings.score", undefined, { score: String(riskAssessment.score) })}</span>
                  </div>
                  <p className="mt-4 text-base leading-8 text-foreground">{result.summary}</p>
                </div>
                {[[t("dashboard.settings.timeline"), result.timeline], [t("dashboard.settings.suspiciousSignals"), result.suspicious_signals], [t("dashboard.settings.recommendations"), result.recommendations]].map(([title, items]) => (
                  <div key={String(title)}>
                    <div className="text-sm font-semibold uppercase tracking-[0.22em] text-muted-foreground">{String(title)}</div>
                    <div className="mt-3 grid gap-3">
                      {(items as string[]).length === 0 ? <EmptyState text={t("dashboard.settings.noItems")} /> : (items as string[]).map((item, idx) => (
                        <div key={`${title}-${idx}`} className="rounded-2xl border border-border/70 bg-muted/35 px-4 py-4 text-sm leading-7 text-foreground">{item}</div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState className="min-h-64 border-none bg-muted/20" title={t("dashboard.settings.readyTitle")} text={t("dashboard.settings.readyDesc")} action={<Button variant="secondary" size="sm" className="h-9 rounded-full px-5 font-bold" onClick={() => void handleInvestigate()} disabled={isLoading || !token}>{t("dashboard.settings.runInvestigation")}</Button>} />
            )}
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="border-b border-border/60 px-6 py-5">
            <SectionTitle eyebrow={t("dashboard.settings.savedCount", undefined, { count: String(history.length) })} title={t("dashboard.settings.savedTitle")} action={<Button variant="outline" size="sm" className="h-9 rounded-full px-5 font-bold" onClick={() => void loadHistory()}>{t("dashboard.settings.refresh")}</Button>} />
          </CardHeader>
          <CardContent className="space-y-3 p-6">
            {history.length === 0 ? (
              <EmptyState className="min-h-64 border-none bg-muted/20" title={t("dashboard.settings.noSavedTitle")} text={t("dashboard.settings.noSavedDesc")} />
            ) : (
              history.map((item) => (
                <button key={item.id} type="button" onClick={() => void openHistory(item.id)} className="w-full rounded-2xl border border-border/70 bg-muted/35 px-4 py-4 text-left transition hover:border-primary/40 hover:bg-primary/5">
                  <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-3">
                    <div className="min-w-0 flex-1">
                      <div className="font-medium">{t("dashboard.settings.investigationId", undefined, { id: String(item.id) })}</div>
                      <div className="mt-1 text-sm text-muted-foreground line-clamp-2">{item.summary}</div>
                    </div>
                    <StatusBadge status={item.status} />
                  </div>
                </button>
              ))
            )}
          </CardContent>
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 pb-6">
              <Button variant="outline" disabled={page === 1} onClick={() => { setPage((p) => p - 1); void loadHistory(page - 1); }}>{t("dashboard.settings.previous")}</Button>
              <div className="text-sm font-medium text-muted-foreground">{t("dashboard.settings.pageOf", undefined, { page: String(page), total: String(totalPages) })}</div>
              <Button variant="outline" disabled={page === totalPages} onClick={() => { setPage((p) => p + 1); void loadHistory(page + 1); }}>{t("dashboard.settings.next")}</Button>
            </div>
          )}
        </Card>
      </section>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <Card className="relative z-50 w-full max-w-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <CardHeader className="border-b border-border/60 flex flex-row items-center justify-between">
              <SectionTitle eyebrow={t("dashboard.settings.investigationDetails")} title={`#${selected.id}`} />
              <button onClick={() => setSelected(null)} className="rounded-full p-2 hover:bg-muted transition-colors" aria-label={t("dashboard.settings.closeDetails")}>
                <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </CardHeader>
            <CardContent className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="mb-6 flex items-center justify-between">
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-medium">{t("dashboard.settings.status")}</div>
                <StatusBadge status={selected.status} />
              </div>
              <div className="text-sm leading-8 text-foreground whitespace-pre-wrap">{selected.summary}</div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
