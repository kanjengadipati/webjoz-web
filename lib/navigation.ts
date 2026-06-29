export const DASHBOARD_NAVIGATION = [
  { id: "overview", href: "/dashboard", label: "Overview", permission: "", icon: "layout", section: "Dashboard", groupStart: false },
  { id: "notifications", href: "/dashboard/notifications", label: "Notifications", permission: "", icon: "bell", section: "Dashboard", groupStart: false },
  { id: "plans", href: "/dashboard/admin/plans", label: "Plan Management", permission: "tenant:manage", icon: "credit-card", section: "Dashboard", groupStart: false, adminOnly: true },
  { id: "health", href: "/dashboard/admin/health", label: "System Health", permission: "tenant:manage", icon: "activity", section: "Dashboard", groupStart: false, adminOnly: true },
  { id: "announcements", href: "/dashboard/admin/announcements", label: "Announcements", permission: "tenant:manage", icon: "megaphone", section: "Dashboard", groupStart: false, adminOnly: true },
  { id: "tenants", href: "/dashboard/tenants", label: "All Tenants", permission: "tenant:manage", icon: "building", section: "Dashboard", groupStart: false, adminOnly: true },
  { id: "templates", href: "/dashboard/admin/templates", label: "Template Gallery", permission: "tenant:manage", icon: "palette", section: "Dashboard", groupStart: false, superAdminOnly: true },

  { id: "sites", href: "/dashboard/sites", label: "Website Saya", permission: "site:view", icon: "globe", section: "Website Builder", groupStart: false },
  { id: "domains", href: "/dashboard/domains", label: "Pengaturan Domain", permission: "domain:manage", icon: "link", section: "Website Builder", groupStart: false },
  { id: "leads", href: "/dashboard/leads", label: "Customer Leads", permission: "lead:read", icon: "inbox", section: "Website Builder", groupStart: false },
  { id: "analytics", href: "/dashboard/analytics", label: "Web Statistik", permission: "analytics:read", icon: "chart", section: "Website Builder", groupStart: false },

  { id: "settings", href: "/dashboard/settings", label: "Pengaturan", permission: "", icon: "settings", section: "Sistem", groupStart: false },
] as const;

export type NavigationItemId = typeof DASHBOARD_NAVIGATION[number]["id"];
