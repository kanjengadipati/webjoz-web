import type { ElementType } from "react";
import type { NotificationItem } from "@/lib/api/notifications";
import {
  Megaphone, MessageSquare, CreditCard, UserPlus, Crown, Globe, UserCheck, Info,
} from "lucide-react";

type TFunction = (key: string, fallback?: string, params?: Record<string, string>) => string;

export const TYPE_META: Record<string, { icon: ElementType; color: string }> = {
  announcement: { icon: Megaphone, color: "text-blue-600" },
  lead: { icon: MessageSquare, color: "text-emerald-600" },
  payment: { icon: CreditCard, color: "text-violet-600" },
  new_user: { icon: UserPlus, color: "text-sky-600" },
  plan: { icon: Crown, color: "text-indigo-600" },
  site: { icon: Globe, color: "text-teal-600" },
  invitation: { icon: UserCheck, color: "text-pink-600" },
  system: { icon: Info, color: "text-amber-600" },
};

export const TYPE_LABEL_KEYS: Record<string, string> = {
  announcement: "dashboard.notifications.typeAnnouncement",
  lead: "dashboard.notifications.typeLead",
  payment: "dashboard.notifications.typePayment",
  new_user: "dashboard.notifications.typeNewUser",
  plan: "dashboard.notifications.typePlan",
  site: "dashboard.notifications.typeSite",
  invitation: "dashboard.notifications.typeInvitation",
  system: "dashboard.notifications.typeSystem",
};

// Role-aware deep links: a notification must never route a user to an
// admin-gated page they cannot open. reference_id pins the target row
// (site ID for "site" notifications).
export function getNotificationLink(n: NotificationItem, isAdmin: boolean): string | null {
  switch (n.type) {
    case "lead":
      return "/dashboard/leads";
    case "announcement":
      return isAdmin ? "/dashboard/admin/announcements" : null;
    case "payment":
      return isAdmin ? "/dashboard/admin/payments" : "/dashboard/billing";
    case "new_user":
      return isAdmin ? "/dashboard/users" : null;
    case "plan":
      return "/dashboard/upgrade";
    case "site":
      return n.reference_id ? `/dashboard/sites/${n.reference_id}` : "/dashboard/sites";
    case "invitation":
      return "/dashboard/team";
    default:
      return null;
  }
}

export function localizedNotification(n: NotificationItem, locale: string) {
  return {
    title: locale === "en" && n.title_en ? n.title_en : n.title,
    message: locale === "en" && n.message_en ? n.message_en : n.message,
  };
}

export function formatRelativeTime(iso: string, locale: string, t: TFunction): string {
  try {
    const d = new Date(iso);
    const diffMs = Date.now() - d.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return t("dashboard.notifications.justNow");
    if (diffMin < 60) return t("dashboard.notifications.minutesAgo", undefined, { n: String(diffMin) });
    const diffHour = Math.floor(diffMin / 60);
    if (diffHour < 24) return t("dashboard.notifications.hoursAgo", undefined, { n: String(diffHour) });
    const diffDay = Math.floor(diffHour / 24);
    if (diffDay < 7) return t("dashboard.notifications.daysAgo", undefined, { n: String(diffDay) });
    return d.toLocaleDateString(locale === "id" ? "id-ID" : "en-US", { day: "numeric", month: "short" });
  } catch {
    return iso;
  }
}
