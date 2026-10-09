import { request } from "./client";

export interface NotificationItem {
  id: number;
  user_id: number;
  type:
    | "announcement"
    | "lead"
    | "payment"
    | "new_user"
    | "plan"
    | "site"
    | "invitation"
    | "system";
  title: string;
  title_en?: string;
  message: string;
  message_en?: string;
  reference_id?: number;
  is_read: boolean;
  created_at: string;
  read_at?: string;
}

export interface UnreadCountResponse {
  count: number;
}

export interface NotificationListMeta {
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface NotificationList {
  items: NotificationItem[];
  meta?: NotificationListMeta;
}

export async function fetchNotifications(token: string, limit = 50, page = 1): Promise<NotificationList> {
  const res = await request<NotificationItem[]>(`/notifications?limit=${limit}&page=${page}`, {}, token);
  const meta = res.meta as NotificationListMeta | undefined;
  return { items: res.data || [], meta };
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

export interface NotificationPreference {
  type: string;
  enabled: boolean;
}

export async function fetchNotificationPreferences(token: string): Promise<NotificationPreference[]> {
  const res = await request<NotificationPreference[]>("/notifications/preferences", {}, token);
  return res.data || [];
}

export async function updateNotificationPreferences(
  token: string,
  preferences: NotificationPreference[]
): Promise<NotificationPreference[]> {
  const res = await request<NotificationPreference[]>(
    "/notifications/preferences",
    { method: "PUT", body: JSON.stringify({ preferences }) },
    token
  );
  return res.data || [];
}
