import { useAuthToken } from "@/lib/auth-store";
import { fetchProfile } from "@/lib/api";
import type { Profile } from "@/lib/types";
import { useEffect, useState, useCallback } from "react";

export function usePermissions() {
  const token = useAuthToken();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    if (token) {
      const timeout = window.setTimeout(() => {
        setLoading(true);
        fetchProfile(token)
          .then((res) => {
            if (active) setProfile(res.data);
          })
          .catch(() => {
            if (active) setProfile(null);
          })
          .finally(() => {
            if (active) setLoading(false);
          });
      }, 0);
      return () => {
        active = false;
        window.clearTimeout(timeout);
      };
    } else {
      const timeout = window.setTimeout(() => {
        setProfile(null);
      }, 0);
      return () => {
        active = false;
        window.clearTimeout(timeout);
      };
    }
  }, [token]);

  const hasPermission = useCallback((permission: string) => {
    if (!profile) return false;
    return profile.permissions?.includes(permission) || false;
  }, [profile]);

  return {
    profile,
    hasPermission,
    permissions: profile?.permissions || [],
    role: profile?.role || "user",
    loading,
  };
}
