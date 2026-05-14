import { request } from "@/lib/api/client";

type RoleSummary = {
  id: number;
  name: string;
};

type RolePermissionSummary = RoleSummary & {
  permissions: string[];
};

export async function fetchRoles(token: string) {
  return request<RoleSummary[]>("/auth/admin/roles", { method: "GET" }, token);
}

export async function fetchAllPermissions(token: string) {
  return request<RoleSummary[]>("/auth/admin/permissions", { method: "GET" }, token);
}

export async function fetchRolePermissions(token: string, roleID: number) {
  return request<RolePermissionSummary>(`/auth/admin/roles/${roleID}/permissions`, { method: "GET" }, token);
}

export async function updateRolePermissions(token: string, roleID: number, permissions: string[]) {
  return request<null>(`/auth/admin/roles/${roleID}/permissions`, {
    method: "PUT",
    body: JSON.stringify({ permissions }),
  }, token);
}
