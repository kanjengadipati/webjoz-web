import { request } from "@/lib/api/client";
import type { User } from "@/lib/types";

export type UserUpdatePayload = {
  name: string;
  email: string;
  role: string;
  is_verified: boolean;
};

export async function fetchUsers(token: string, query: URLSearchParams) {
  return request<User[]>(`/auth/admin/users?${query.toString()}`, { method: "GET" }, token);
}

export async function updateUser(token: string, id: number, data: UserUpdatePayload) {
  return request<User>(`/auth/admin/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  }, token);
}

export async function deleteUser(token: string, id: number) {
  return request<null>(`/auth/admin/users/${id}`, {
    method: "DELETE",
  }, token);
}
