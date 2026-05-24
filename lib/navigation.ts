export const DASHBOARD_NAVIGATION = [
  { id: "overview", href: "/dashboard", label: "Overview", permission: "dashboard.view", icon: "chart", groupStart: false },
  { id: "logs", href: "/dashboard/logs", label: "Logs", permission: "role.read", icon: "list", groupStart: false },
  { id: "investigate", href: "/dashboard/investigate", label: "Investigate", permission: "role.read", icon: "search", groupStart: false },
  { id: "sessions", href: "/dashboard/sessions", label: "Devices", permission: "dashboard.view", icon: "shield", groupStart: false },
  { id: "users", href: "/dashboard/users", label: "Users", permission: "permission.read", icon: "users", groupStart: true },
  { id: "permissions", href: "/dashboard/permissions", label: "Permissions", permission: "role.update_permissions", icon: "key", groupStart: false },
  { id: "settings", href: "/dashboard/settings", label: "Settings", permission: "dashboard.view", icon: "settings", groupStart: false },
] as const;

export type NavigationItemId = typeof DASHBOARD_NAVIGATION[number]["id"];
