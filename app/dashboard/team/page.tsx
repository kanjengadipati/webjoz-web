"use client";

import { useState, useEffect } from "react";
import { useAuthToken } from "@/lib/auth-store";
import { useActiveTenant } from "@/lib/tenant-store";
import { request } from "@/lib/api/client";
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from "@/components/ui";
import { Dialog } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/toast-provider";
import { UserPlus, Mail, X, Sparkles, Loader2, Copy } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

interface Member {
  id: number;
  user_id: number;
  role: string;
  name: string;
  email: string;
}

interface Invitation {
  id: number;
  email: string;
  role: string;
  status: string;
  token: string;
  created_at: string;
}

export default function TeamPage() {
  const token = useAuthToken();
  const { pushToast } = useToast();
  const { t } = useI18n();
  const { activeTenantId, activeTenant } = useActiveTenant();

  const [members, setMembers] = useState<Member[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("editor");
  const [showUpsell, setShowUpsell] = useState(false);

  const tenantHeaders = { "X-Tenant-ID": activeTenantId?.toString() ?? "" };

  const fetchData = async () => {
    if (!token || !activeTenantId) return;
    try {
      setLoading(true);
      const [mRes, iRes] = await Promise.all([
        request<Member[]>(`/tenants/${activeTenantId}/members`, { headers: tenantHeaders }, token),
        request<Invitation[]>(`/tenants/${activeTenantId}/invitations`, { headers: tenantHeaders }, token),
      ]);
      setMembers(mRes.data || []);
      setInvitations(iRes.data || []);
    } catch (err: any) {
      pushToast(err.message || t("dashboard.team.loadFailed"), "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [activeTenantId]);

  const handleInvite = async () => {
    if (!inviteEmail) return;
    try {
      await request(`/tenants/${activeTenantId}/invitations`, {
        method: "POST",
        headers: tenantHeaders,
        body: JSON.stringify({ email: inviteEmail, role: inviteRole }),
      }, token);
      pushToast(t("dashboard.team.inviteSent"), "success");
      setInviteEmail("");
      fetchData();
    } catch (err: any) {
      if (err.message?.includes("batas anggota")) {
        setShowUpsell(true);
      } else {
        pushToast(err.message || t("dashboard.team.inviteFailed"), "error");
      }
    }
  };

  const handleRevoke = async (invId: number) => {
    try {
      await request(`/tenants/${activeTenantId}/invitations/${invId}`, {
        method: "DELETE",
        headers: tenantHeaders,
      }, token);
      pushToast(t("dashboard.team.inviteRevoked"), "success");
      fetchData();
    } catch (err: any) {
      pushToast(err.message || t("dashboard.team.revokeFailed"), "error");
    }
  };

  const handleRemoveMember = async (userId: number) => {
    try {
      await request(`/tenants/${activeTenantId}/members/${userId}`, {
        method: "DELETE",
        headers: tenantHeaders,
      }, token);
      pushToast(t("dashboard.team.memberRemoved"), "success");
      fetchData();
    } catch (err: any) {
      pushToast(err.message || t("dashboard.team.removeFailed"), "error");
    }
  };

  if (loading && members.length === 0) {
    return (
      <div className="flex items-center justify-center h-80">
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
      </div>
    );
  }

  const pendingInvites = invitations.filter(i => i.status === "pending");
  const activeCount = members.length + pendingInvites.length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-primary" />
            {t("dashboard.team.membersTitle", undefined, { count: String(activeCount) })}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {(members.length > 0 || pendingInvites.length > 0) ? [
            ...members.map(m => (
              <div key={m.id} className="flex items-center justify-between py-2 border-b last:border-none">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                    {(m.name || m.email || "?")[0].toUpperCase()}
                  </div>
                  <div>
                  <div className="text-sm font-medium">{m.name || m.email || "Unknown"}</div>
                  <div className="text-xs text-muted-foreground">{m.email || ""}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={m.role === "owner" ? "default" : "secondary"}>{t(`dashboard.team.role.${m.role}` as any) || m.role}</Badge>
                  {m.role !== "owner" && (
                    <Button variant="ghost" size="sm" onClick={() => handleRemoveMember(m.user_id)}>
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            )),
            ...pendingInvites.map(inv => (
              <div key={inv.id} className="flex items-center justify-between py-2 border-b last:border-none text-muted-foreground">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4" />
                  <div>
                    <div className="text-sm">{inv.email}</div>
                    <div className="text-xs">{t("dashboard.team.invitePending", undefined, { role: inv.role })}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{t("dashboard.team.pending")}</Badge>
                  <Button variant="ghost" size="sm" onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/invitations/${inv.token}`);
                    pushToast(t("dashboard.team.inviteLinkCopied"), "success");
                  }}>
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleRevoke(inv.id)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )),
          ] : (
            <div className="text-sm text-muted-foreground text-center py-6">{t("dashboard.team.noMembers")}</div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-bold">{t("dashboard.team.inviteTitle")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 items-start">
            <div className="flex-1">
              <Input
                placeholder={t("dashboard.team.emailPlaceholder")}
                value={inviteEmail}
                onChange={e => setInviteEmail(e.target.value)}
              />
            </div>
            <select
              value={inviteRole}
              onChange={e => setInviteRole(e.target.value)}
              className="px-3 py-2 border rounded-xl text-sm bg-card outline-none"
            >
              <option value="editor">{t("dashboard.team.role.editor")}</option>
              <option value="viewer">{t("dashboard.team.role.viewer")}</option>
            </select>
            <Button onClick={handleInvite}>{t("dashboard.team.sendInvite")}</Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {t("dashboard.team.inviteHint")}
          </p>
        </CardContent>
      </Card>

      <Dialog
        open={showUpsell}
        onOpenChange={setShowUpsell}
        title={t("dashboard.team.limitTitle")}
        footer={
          <>
            <Button variant="outline" onClick={() => setShowUpsell(false)}>{t("dashboard.team.later")}</Button>
            <Button onClick={() => { window.open("/dashboard/upgrade", "_blank"); setShowUpsell(false); }}>
              <Sparkles className="w-4 h-4" /> {t("dashboard.team.upgradeToPro")}
            </Button>
          </>
        }
      >
        <p className="text-sm">
          {t("dashboard.team.limitDesc")}
        </p>
      </Dialog>
    </div>
  );
}
