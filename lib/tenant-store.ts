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
    if (!token) return;
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
            body: JSON.stringify({ name: "Workspace Utama", slug }),
          }, token);
          
          if (createRes.status === "success" && createRes.data?.id) {
            const refetched = await request<TenantMembership[]>("/tenants/me", {}, token);
            setMemberships(refetched.data || []);
            setActiveTenantId(createRes.data.id);
            setActiveTenantState(createRes.data.id);
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

  const createTenant = async (name: string, slug: string) => {
    if (!token) return null;
    const res = await request<{ id: number }>("/tenants", {
      method: "POST",
      body: JSON.stringify({ name, slug }),
    }, token);
    await fetchTenants();
    if (res.data?.id) {
      selectTenant(res.data.id);
    }
    return res.data;
  };

  return {
    activeTenantId,
    activeTenant,
    memberships,
    loading,
    error,
    selectTenant,
    createTenant,
    refresh: fetchTenants,
  };
}
