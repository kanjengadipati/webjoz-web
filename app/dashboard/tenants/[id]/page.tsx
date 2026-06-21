"use client";

import React, { useState, useEffect } from "react";
import { useAuthToken } from "@/lib/auth-store";
import { request } from "@/lib/api/client";
import { usePermissions } from "@/hooks/use-permissions";
import { Building2, Loader2, Users, Globe, ArrowLeft, Mail, Calendar, Zap, CreditCard } from "lucide-react";
import { Button, Card, CardContent, CardHeader, CardTitle, Select } from "@/components/ui";
import { useToast } from "@/components/toast-provider";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

interface Member {
  user_id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

interface PlanItem {
  id: number;
  name: string;
  slug: string;
}

interface AIUsage {
  tenant_id: number;
  year_month: string;
  generate_count: number;
  regen_count: number;
  token_input: number;
  token_output: number;
}

interface TenantDetail {
  id: number;
  name: string;
  slug: string;
  plan: string;
  owner_id: number;
  members?: Member[];
}

export default function AdminTenantDetailPage() {
  const { id } = useParams<{ id: string }>();
  const token = useAuthToken();
  const router = useRouter();
  const { pushToast } = useToast();
  const { role } = usePermissions();
  const [tenant, setTenant] = useState<TenantDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState<PlanItem[]>([]);
  const [usage, setUsage] = useState<AIUsage | null>(null);
  const [selectedPlanId, setSelectedPlanId] = useState("");
  const [assigning, setAssigning] = useState(false);

  const isAdmin = role === "superadmin" || role === "admin";

  useEffect(() => {
    if (!token || !id || !isAdmin) return;
    (async () => {
      try {
        setLoading(true);
        const [tenantRes, plansRes, usageRes] = await Promise.all([
          request<TenantDetail>(`/tenants/${id}`, {}, token),
          request<PlanItem[]>("/admin/plans", {}, token),
          request<AIUsage>(`/admin/tenants/${id}/usage`, {}, token),
        ]);
        setTenant(tenantRes.data || null);
        setPlans(plansRes.data || []);
        setUsage(usageRes.data);
      } catch (err: any) {
        pushToast(err.message || "Gagal memuat detail tenant", "error");
      } finally {
        setLoading(false);
      }
    })();
  }, [token, id, isAdmin]);

  async function handleAssignPlan() {
    if (!token || !selectedPlanId) return;
    setAssigning(true);
    try {
      await request(`/admin/tenants/${id}/plan`, {
        method: "POST",
        body: JSON.stringify({ plan_id: parseInt(selectedPlanId) }),
      }, token);
      pushToast("Plan updated", "success");
      const tenantRes = await request<TenantDetail>(`/tenants/${id}`, {}, token);
      setTenant(tenantRes.data || null);
    } catch (err: any) {
      pushToast(err.message || "Failed to assign plan", "error");
    } finally {
      setAssigning(false);
    }
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-80 text-muted-foreground gap-4">
        <Building2 className="size-12 opacity-40" />
        <p className="text-sm">Anda tidak memiliki akses ke halaman ini.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-80">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!tenant) {
    return (
      <div className="flex flex-col items-center justify-center h-80 text-muted-foreground gap-4">
        <Building2 className="size-12 opacity-40" />
        <p className="text-sm">Tenant not found</p>
        <Link href="/dashboard/tenants">
          <Button variant="outline" size="sm">Back to Tenants</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/tenants"
          className="inline-flex items-center justify-center p-1.5 rounded-xl hover:bg-primary/10 transition text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="size-5" />
        </Link>
        <h1 className="text-xl font-bold tracking-tight">{tenant.name}</h1>
        <span className="inline-flex items-center rounded-full border border-border/40 px-2.5 py-0.5 text-xs font-medium capitalize">
          {tenant.plan}
        </span>
      </div>

      <Card className="border-border/40 shadow-sm">
        <CardHeader className="border-b border-border/20 pb-4">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Building2 className="size-4 text-primary" />
            Tenant Info
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-3 text-sm">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-xs font-medium text-muted-foreground">Slug</span>
              <p className="font-mono text-sm">{tenant.slug}</p>
            </div>
            <div>
              <span className="text-xs font-medium text-muted-foreground">Owner ID</span>
              <p>{tenant.owner_id}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/40 shadow-sm">
        <CardHeader className="border-b border-border/20 pb-4">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <CreditCard className="size-4 text-primary" />
            Plan Assignment
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-3">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="mb-2 block text-xs font-medium text-muted-foreground">Current Plan</label>
              <p className="text-lg font-bold capitalize">{tenant.plan}</p>
            </div>
            <div className="flex-1">
              <label className="mb-2 block text-xs font-medium text-muted-foreground">Change Plan</label>
              <div className="flex gap-2">
                <select
                  value={selectedPlanId}
                  onChange={(e) => setSelectedPlanId(e.target.value)}
                  className="flex-1 rounded-xl border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Select plan...</option>
                  {plans.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
                <Button size="sm" onClick={handleAssignPlan} disabled={!selectedPlanId || assigning}>
                  {assigning ? "..." : "Assign"}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/40 shadow-sm">
        <CardHeader className="border-b border-border/20 pb-4">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Zap className="size-4 text-primary" />
            AI Usage (this month)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {usage ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <p className="text-xs font-medium text-muted-foreground">Generates</p>
                <p className="text-2xl font-bold">{usage.generate_count}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Regenerations</p>
                <p className="text-2xl font-bold">{usage.regen_count}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Token Input</p>
                <p className="text-2xl font-bold">{usage.token_input.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Token Output</p>
                <p className="text-2xl font-bold">{usage.token_output.toLocaleString()}</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No usage data for this month</p>
          )}
        </CardContent>
      </Card>

      <Card className="border-border/40 shadow-sm">
        <CardHeader className="border-b border-border/20 pb-4">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Users className="size-4 text-primary" />
            Members ({tenant.members?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {!tenant.members || tenant.members.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-2">
              <Users className="size-8 opacity-30" />
              <p className="text-sm">No members</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/20 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {tenant.members.map((m) => (
                    <tr key={m.user_id} className="border-b border-border/10 hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 font-medium">{m.name}</td>
                      <td className="px-6 py-4 text-muted-foreground">
                        <span className="inline-flex items-center gap-1.5">
                          <Mail className="size-3" />
                          {m.email}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center rounded-full border border-border/40 px-2.5 py-0.5 text-xs font-medium capitalize">
                          {m.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1.5">
                          <Calendar className="size-3" />
                          {new Date(m.created_at).toLocaleDateString("id-ID", {
                            year: "numeric", month: "short", day: "numeric"
                          })}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Link href={`/dashboard/sites?tenant_id=${tenant.id}`}>
          <Button variant="outline" size="sm" className="gap-2">
            <Globe className="size-4" />
            View Sites
          </Button>
        </Link>
        <Link href={`/dashboard/domains?tenant_id=${tenant.id}`}>
          <Button variant="outline" size="sm" className="gap-2">
            <Globe className="size-4" />
            View Domains
          </Button>
        </Link>
        <Link href={`/dashboard/leads?tenant_id=${tenant.id}`}>
          <Button variant="outline" size="sm" className="gap-2">
            <Mail className="size-4" />
            View Leads
          </Button>
        </Link>
      </div>
    </div>
  );
}
