import { request } from "./client";

export interface NotificationItem {
  id: number;
  user_id: number;
  type: "announcement" | "lead" | "system";
  title: string;
  message: string;
  reference_id?: number;
  is_read: boolean;
  created_at: string;
  read_at?: string;
}

export interface UnreadCountResponse {
  count: number;
}

export async function fetchNotifications(token: string, limit = 50, offset = 0): Promise<NotificationItem[]> {
  const res = await request<NotificationItem[]>(`/notifications?limit=${limit}&offset=${offset}`, {}, token);
  return res.data || [];
}

export async function fetchUnreadCount(token: string): Promise<number> {
  const res = await request<UnreadCountResponse>("/notifications/unread-count", {}, token);
  return res.data?.count ?? 0;
}

export async function markNotificationRead(token: string, id: number): Promise<void> {
  await request(`/notifications/${id}/read`, { method: "PUT" }, token);
}

export async function markAllNotificationsRead(token: string): Promise<void> {
  await request("/notifications/read-all", { method: "PUT" }, token);
}
