import { useAuthToken } from "@/lib/auth-store";
import { fetchProfile } from "@/lib/api";
import { Profile } from "@/lib/types";
import { useEffect, useState, useCallback } from "react";

export function usePermissions() {
  const token = useAuthToken();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      setLoading(true);
      fetchProfile(token)
        .then((res) => setProfile(res.data || null))
        .catch(() => setProfile(null))
        .finally(() => setLoading(false));
    } else {
      setProfile(null);
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
