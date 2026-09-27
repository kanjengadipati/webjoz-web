import { useState, useEffect } from "react";
import { request } from "@/lib/api/client";
import { useAuthToken } from "@/lib/auth-store";
import type { Profile } from "@/lib/types";

const TENANT_STORAGE_KEY = "webjoz_active_tenant_id";

export interface TenantMembership {
  tenant: {
    id: number;
    name: string;
    slug: string;
    plan: string;
    owner_id: number;
  };
  role: string;
}

export function getActiveTenantId(): number | null {
  if (typeof window === "undefined") return null;
  let val = localStorage.getItem(TENANT_STORAGE_KEY);
  if (!val) {
    const oldVal = localStorage.getItem("giwangan_active_tenant_id");
    if (oldVal) {
      val = oldVal;
      localStorage.setItem(TENANT_STORAGE_KEY, oldVal);
      localStorage.removeItem("giwangan_active_tenant_id");
    }
  }
  if (!val) return null;
  const num = parseInt(val, 10);
  return isNaN(num) ? null : num;
}

// True for auto-generated placeholder workspaces (e.g. the "Akun Saya" default
// created for users with zero tenants) so save flows rename/replace them instead
// of silently leaving every new site inside a generic workspace.
export function isPlaceholderTenant(tenant?: { name: string; slug: string } | null): boolean {
  if (!tenant) return true;
  const name = (tenant.name || "").toLowerCase().trim();
  if (name === "" || name === "akun saya" || name === "my account" || name === "workspace utama") return true;
  return (tenant.slug || "").startsWith("workspace-");
}

function generateWorkspaceSlug(name: string): string {
  const base = name.toLowerCase().replace(/[^a-z0-9-]/g, "").slice(0, 24) || "workspace";
  return `${base}-${Math.floor(Math.random() * 1000)}`;
}

export function setActiveTenantId(id: number) {
  if (typeof window === "undefined") return;
  localStorage.setItem(TENANT_STORAGE_KEY, id.toString());
  // Dispatch a storage event to update other hooks
  window.dispatchEvent(new Event("storage_tenant_changed"));
}

export function useActiveTenant() {
  const token = useAuthToken();
  const [activeTenantId, setActiveTenantState] = useState<number | null>(getActiveTenantId());
  const [memberships, setMemberships] = useState<TenantMembership[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTenants = async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const res = await request<TenantMembership[]>("/tenants/me", {}, token);
      
      if (res.data && res.data.length > 0) {
        setMemberships(res.data);
        
        // Auto-select first tenant if none is selected
        const current = getActiveTenantId();
        const stillValid = res.data?.some(m => m.tenant.id === current);
        
        if (!current || !stillValid) {
          setActiveTenantId(res.data[0].tenant.id);
          setActiveTenantState(res.data[0].tenant.id);
        } else {
          setActiveTenantState(current);
        }
      } else {
        // No tenants - Auto-create a default workspace!
        const profileRes = await request<Profile>("/auth/profile", {}, token);
        if (profileRes.status === "success" && profileRes.data) {
          const userId = profileRes.data.id;
          const slug = `workspace-${userId}`;
          const createRes = await request<{ id: number }>("/tenants", {
            method: "POST",
            body: JSON.stringify({ name: "Akun Saya", slug }),
          }, token);
          
          if (createRes.status === "success" && createRes.data?.id) {
            const refetched = await request<TenantMembership[]>("/tenants/me", {}, token);
            const newId = createRes.data.id;
            setActiveTenantId(newId);
            setActiveTenantState(newId);
            setMemberships(refetched.data || []);
          } else {
            setActiveTenantState(null);
          }
        } else {
          setActiveTenantState(null);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load tenants");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenants();

    const handleStorageChange = () => {
      setActiveTenantState(getActiveTenantId());
    };

    window.addEventListener("storage_tenant_changed", handleStorageChange);
    return () => {
      window.removeEventListener("storage_tenant_changed", handleStorageChange);
    };
  }, [token]);

  const activeTenant = memberships.find(m => m.tenant.id === activeTenantId);

  const selectTenant = (id: number) => {
    setActiveTenantId(id);
    setActiveTenantState(id);
  };

  const createTenant = async (name: string, slug: string, referralCode?: string) => {
    if (!token) return null;
    const refCode = referralCode || (typeof window !== "undefined" ? localStorage.getItem("webjoz_referral_code") || undefined : undefined);
    const bodyData: Record<string, any> = { name, slug };
    if (refCode) {
      bodyData.referral_code = refCode;
    }
    const res = await request<{ id: number }>("/tenants", {
      method: "POST",
      body: JSON.stringify(bodyData),
    }, token);
    await fetchTenants();
    if (res.data?.id) {
      selectTenant(res.data.id);
    }
    return res.data;
  };

  /**
   * Resolve the workspace a new site should be created in:
   *  - existing real workspace → reuse it;
   *  - auto-created placeholder ("Akun Saya"/workspace-*) → rename it to the
   *    business name so the workspace no longer shows the generic label;
   *  - no workspace at all → create one named after the business.
   */
  const resolveBusinessTenant = async (businessName: string): Promise<number | null> => {
    if (!token) return null;
    try {
      const res = await request<TenantMembership[]>("/tenants/me", {}, token);
      const list = res.data || [];
      if (list.length === 0) {
        const created = await createTenant(businessName, generateWorkspaceSlug(businessName));
        return created ? created.id : null;
      }
      const current = getActiveTenantId();
      const active = list.find((m) => Number(m.tenant.id) === current) || list[0];
      if (!isPlaceholderTenant(active.tenant)) {
        selectTenant(Number(active.tenant.id));
        return Number(active.tenant.id);
      }
      const upd = await request<{ id: number }>(`/tenants/${active.tenant.id}`, {
        method: "PUT",
        body: JSON.stringify({ name: businessName, slug: generateWorkspaceSlug(businessName) }),
      }, token);
      if (upd.status === "success" && upd.data?.id) {
        await fetchTenants();
        selectTenant(Number(upd.data.id));
        return Number(upd.data.id);
      }
      const created = await createTenant(businessName, generateWorkspaceSlug(businessName));
      return created ? created.id : null;
    } catch {
      return null;
    }
  };

  return {
    activeTenantId,
    activeTenant,
    memberships,
    loading,
    error,
    selectTenant,
    createTenant,
    resolveBusinessTenant,
    refresh: fetchTenants,
  };
}
