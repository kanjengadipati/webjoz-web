export const DASHBOARD_NAVIGATION = [
  { id: "overview", href: "/dashboard", label: "Overview", permission: "", icon: "layout", section: "Dashboard", groupStart: false },
  { id: "notifications", href: "/dashboard/notifications", label: "Notifications", permission: "", icon: "bell", section: "Dashboard", groupStart: false },
  { id: "plans", href: "/dashboard/admin/plans", label: "Plan Management", permission: "tenant:manage", icon: "credit-card", section: "Dashboard", groupStart: false, adminOnly: true },
  { id: "health", href: "/dashboard/admin/health", label: "System Health", permission: "tenant:manage", icon: "activity", section: "Dashboard", groupStart: false, adminOnly: true },
  { id: "announcements", href: "/dashboard/admin/announcements", label: "Announcements", permission: "tenant:manage", icon: "megaphone", section: "Dashboard", groupStart: false, adminOnly: true },
  { id: "admin-commissions", href: "/dashboard/admin/commissions", label: "Semua Komisi", permission: "commission:read_all", icon: "dollar", section: "Dashboard", groupStart: false, adminOnly: true },
  { id: "tenants", href: "/dashboard/tenants", label: "All Tenants", permission: "tenant:manage", icon: "building", section: "Dashboard", groupStart: false, adminOnly: true },
  { id: "templates", href: "/dashboard/admin/templates", label: "Template Gallery", permission: "tenant:manage", icon: "palette", section: "Dashboard", groupStart: false, superAdminOnly: true },
  { id: "design-assets", href: "/dashboard/admin/design-assets", label: "Design Assets", permission: "tenant:manage", icon: "palette", section: "Dashboard", groupStart: false, superAdminOnly: true },
  { id: "metrics", href: "/dashboard/admin/metrics", label: "Metrics", permission: "tenant:manage", icon: "activity", section: "Dashboard", groupStart: false, superAdminOnly: true },
  { id: "sites", href: "/dashboard/sites", label: "Website Saya", permission: "site:view", icon: "globe", section: "Website Builder", groupStart: false },
  { id: "domains", href: "/dashboard/domains", label: "Custom Domain", permission: "domain:manage", icon: "link", section: "Website Builder", groupStart: false },
  { id: "leads", href: "/dashboard/leads", label: "Customer Leads", permission: "lead:read", icon: "inbox", section: "Website Builder", groupStart: false },
  { id: "analytics", href: "/dashboard/analytics", label: "Web Statistik", permission: "analytics:read", icon: "chart", section: "Website Builder", groupStart: false },
  { id: "sales-referral", href: "/dashboard/sales", label: "Kode Referral", permission: "sales:manage-referral", icon: "share", section: "Sales & Referral", groupStart: false },
  { id: "sales-commissions", href: "/dashboard/sales/commissions", label: "Komisi Saya", permission: "commission:read_own", icon: "dollar", section: "Sales & Referral", groupStart: false },
  { id: "team", href: "/dashboard/team", label: "Tim", permission: "", icon: "users", section: "Website Builder", groupStart: false },
  { id: "upgrade", href: "/dashboard/upgrade", label: "Upgrade Paket", permission: "", icon: "credit-card", section: "Website Builder", groupStart: false },
  { id: "settings", href: "/dashboard/settings", label: "Pengaturan", permission: "", icon: "settings", section: "Sistem", groupStart: false },
] as const;

export type NavigationItemId = typeof DASHBOARD_NAVIGATION[number]["id"];
