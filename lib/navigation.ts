export const DASHBOARD_NAVIGATION = [
  { id: "sites", href: "/dashboard/sites", label: "My Websites", permission: "site:view", icon: "globe", section: "Website Builder", groupStart: false },
  { id: "domains", href: "/dashboard/domains", label: "Custom Domains", permission: "domain:manage", icon: "link", section: "Website Builder", groupStart: false },
  { id: "leads", href: "/dashboard/leads", label: "Customer Leads", permission: "lead:read", icon: "inbox", section: "Website Builder", groupStart: false },
  { id: "analytics", href: "/dashboard/analytics", label: "Site Analytics", permission: "analytics:read", icon: "chart", section: "Website Builder", groupStart: false },

  { id: "overview", href: "/dashboard", label: "Overview", permission: "dashboard.view", icon: "chart", section: "Monitoring & Logs", groupStart: false },
  { id: "logs", href: "/dashboard/logs", label: "Audit Logs", permission: "role.read", icon: "list", section: "Monitoring & Logs", groupStart: false },
  { id: "investigate", href: "/dashboard/investigate", label: "AI Investigator", permission: "role.read", icon: "search", section: "Monitoring & Logs", groupStart: false },
  
  { id: "sessions", href: "/dashboard/sessions", label: "Active Devices", permission: "dashboard.view", icon: "shield", section: "Access & Identity", groupStart: false },
  { id: "users", href: "/dashboard/users", label: "User Accounts", permission: "permission.read", icon: "users", section: "Access & Identity", groupStart: false },
  { id: "permissions", href: "/dashboard/permissions", label: "Role Permissions", permission: "role.update_permissions", icon: "key", section: "Access & Identity", groupStart: false },
  
  { id: "settings", href: "/dashboard/settings", label: "Settings", permission: "", icon: "settings", section: "System", groupStart: false },
] as const;

export type NavigationItemId = typeof DASHBOARD_NAVIGATION[number]["id"];
