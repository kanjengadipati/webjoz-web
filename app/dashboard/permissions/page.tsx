"use client";

import { useCallback, useEffect, useState } from "react";
import { Button, Card, CardContent, CardHeader, SectionTitle, SkeletonBlock, Badge } from "@/components/ui";
import { useToast } from "@/components/toast-provider";
import { fetchRoles, fetchAllPermissions, fetchRolePermissions, updateRolePermissions } from "@/lib/api";
import { useAuthToken } from "@/lib/auth-store";
import { cn } from "@/lib/utils";

export default function PermissionsPage() {
  const token = useAuthToken();
  const { pushToast } = useToast();
  
  const [roles, setRoles] = useState<{ id: number; name: string }[]>([]);
  const [allPermissions, setAllPermissions] = useState<{ id: number; name: string }[]>([]);
  const [selectedRole, setSelectedRole] = useState<number | null>(null);
  const [rolePermissions, setRolePermissions] = useState<string[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadInitialData = useCallback(async () => {
    if (!token) return;
    try {
      const [rolesRes, permsRes] = await Promise.all([
        fetchRoles(token),
        fetchAllPermissions(token)
      ]);
      const filteredRoles = (rolesRes.data || []).filter(r => 
        ((r as any).name || (r as any).Name).toLowerCase() !== "superadmin"
      );
      setRoles(filteredRoles);
      setAllPermissions(permsRes.data || []);
      if (filteredRoles.length) {
        const firstRole = filteredRoles[0];
        setSelectedRole((firstRole as any).id || (firstRole as any).ID);
      }
    } catch (error) {
      pushToast("Failed to load initial data", "error");
    } finally {
      setLoading(false);
    }
  }, [token, pushToast]);

  const loadRolePermissions = useCallback(async (roleID: number) => {
    if (!token) return;
    try {
      const res = await fetchRolePermissions(token, roleID);
      setRolePermissions(res.data?.permissions || []);
    } catch (error) {
      pushToast("Failed to load role permissions", "error");
    }
  }, [token, pushToast]);

  useEffect(() => {
    void loadInitialData();
  }, [loadInitialData]);

  useEffect(() => {
    if (selectedRole) {
      void loadRolePermissions(selectedRole);
    }
  }, [selectedRole, loadRolePermissions]);

  const togglePermission = (permName: string) => {
    setRolePermissions(prev => 
      prev.includes(permName) 
        ? prev.filter(p => p !== permName)
        : [...prev, permName]
    );
  };

  const handleSave = async () => {
    if (!token || !selectedRole) return;
    setSaving(true);
    try {
      await updateRolePermissions(token, selectedRole, rolePermissions);
      pushToast("Permissions updated successfully", "success");
    } catch (error) {
      pushToast("Failed to update permissions", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <SkeletonBlock className="h-32" />
        <SkeletonBlock className="h-64" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="border-b border-border/60">
          <SectionTitle 
            eyebrow="RBAC Management" 
            title="Manage Role Permissions" 
            action={
              <Button onClick={handleSave} disabled={saving} className="shadow-lg shadow-primary/20">
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            } 
          />
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-2">
            {roles.map((role) => {
              const rId = (role as any).id || (role as any).ID;
              const rName = (role as any).name || (role as any).Name;
              return (
                <Button
                  key={rId}
                  variant={selectedRole === rId ? "default" : "outline"}
                  className={cn("rounded-xl h-12 px-6", selectedRole === rId && "shadow-lg shadow-primary/20")}
                  onClick={() => setSelectedRole(rId)}
                >
                  {rName}
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-b border-border/60 bg-muted/20">
          <div className="flex items-center justify-between">
            <SectionTitle 
              eyebrow={String(allPermissions.length) + " Total"} 
              title="Available Permissions" 
            />
            <Badge variant="outline" className="bg-background">
              {rolePermissions.length} Active
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {allPermissions.map((perm) => {
              const pId = (perm as any).id || (perm as any).ID;
              const pName = (perm as any).name || (perm as any).Name || "unknown";
              const isActive = rolePermissions.includes(pName);
              return (
                <div 
                  key={pId}
                  onClick={() => togglePermission(pName)}
                  className={cn(
                    "flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 cursor-pointer select-none group",
                    isActive 
                      ? "border-primary bg-primary/5 shadow-sm" 
                      : "border-border/60 hover:border-primary/40 hover:bg-muted/50"
                  )}
                >
                  <div className="space-y-0.5">
                    <div className={cn("text-sm font-bold tracking-tight", isActive ? "text-primary" : "text-foreground")}>
                      {pName}
                    </div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                      {pName.split('.')[0]} Resource
                    </div>
                  </div>
                  <div className={cn(
                    "size-5 rounded-full border-2 flex items-center justify-center transition-all duration-300",
                    isActive 
                      ? "bg-primary border-primary" 
                      : "border-border/80 group-hover:border-primary/40"
                  )}>
                    {isActive && (
                      <svg className="size-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
