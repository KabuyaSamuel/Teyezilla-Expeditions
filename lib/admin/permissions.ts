// Role/permission model for the admin dashboard. This is intentionally
// framework-agnostic (no auth provider dependency) so it can sit in front of
// Supabase Auth, or any other provider, once Phase 4 wires up real auth.

export type StaffRole = "admin" | "manager" | "tour_guide" | "driver" | "sales_agent";

export const ROLE_LABELS: Record<StaffRole, string> = {
  admin: "Admin",
  manager: "Manager",
  tour_guide: "Tour Guide",
  driver: "Driver",
  sales_agent: "Sales Agent",
};

export type AdminModuleKey =
  | "dashboard"
  | "tours"
  | "journeys"
  | "collections"
  | "experience-types"
  | "activities"
  | "vehicles"
  | "accommodations"
  | "operations"
  | "destinations"
  | "bookings"
  | "customers"
  | "inquiries"
  | "blog"
  | "reviews"
  | "media"
  | "reports"
  | "staff"
  | "settings"
  | "statuses"
  | "travel-resources"
  | "faqs"
  | "team-members"
  | "notifications"
  | "link-generator";

export interface AdminModuleDef {
  key: AdminModuleKey;
  label: string;
  href: string;
  icon: string; // simple emoji glyph, swap for an icon set later
  description: string;
}

// Order here is the sidebar order -- grouped by how often/together staff
// actually use these, not alphabetically or by when each was built:
// 1) Dashboard + anything needing attention today (notifications, the
//    sales pipeline, operations).
// 2) The product catalog (what's sellable).
// 3) The reusable building blocks that catalog is composed from.
// 4) Marketing/support content.
// 5) Reporting and system configuration, touched least often.
export const ADMIN_MODULES: AdminModuleDef[] = [
  { key: "dashboard", label: "Dashboard", href: "/admin", icon: "📊", description: "Overview of bookings, revenue, and activity" },
  { key: "notifications", label: "Notifications", href: "/admin/notifications", icon: "🔔", description: "Alerts and reminders" },
  { key: "bookings", label: "Booking Management", href: "/admin/bookings", icon: "📅", description: "Enquiries, quotes, confirmations, cancellations" },
  { key: "inquiries", label: "Inquiry Management", href: "/admin/inquiries", icon: "💬", description: "Website, WhatsApp, contact form, and trip planner inquiries" },
  { key: "customers", label: "Customer Management (CRM)", href: "/admin/customers", icon: "👥", description: "Customer profiles and history" },
  { key: "operations", label: "Operations", href: "/admin/operations", icon: "🧭", description: "Assign guides, drivers, and vehicles to upcoming departures" },
  { key: "tours", label: "Tour Management", href: "/admin/tours", icon: "🧭", description: "Create and manage tours" },
  { key: "journeys", label: "Journey Management", href: "/admin/journeys", icon: "✈️", description: "Multi-country and signature journeys" },
  { key: "collections", label: "Collections", href: "/admin/collections", icon: "🧩", description: "Curated tour and journey collections" },
  { key: "destinations", label: "Destination Management", href: "/admin/destinations", icon: "🌍", description: "Countries, overviews, visa and best-time-to-visit info" },
  { key: "experience-types", label: "Experience Types", href: "/admin/experience-types", icon: "🗂️", description: "Categories used to tag tours and journeys, e.g. Wildlife & Safari, Beach & Islands" },
  { key: "activities", label: "Activities Library", href: "/admin/activities", icon: "🎯", description: "Reusable named activities for tours and journeys" },
  { key: "vehicles", label: "Vehicle Library", href: "/admin/vehicles", icon: "🚙", description: "Reusable named expedition vehicles for tours and journeys" },
  { key: "accommodations", label: "Accommodation Library", href: "/admin/accommodations", icon: "🏕️", description: "Camps, lodges, and hotels by destination" },
  { key: "blog", label: "Blog Management", href: "/admin/blog", icon: "📝", description: "Posts, categories, SEO" },
  { key: "reviews", label: "Reviews", href: "/admin/reviews", icon: "⭐", description: "Approve or hide testimonials" },
  { key: "faqs", label: "FAQs", href: "/admin/faqs", icon: "❓", description: "Questions and answers for the FAQs page and Safari guide" },
  { key: "travel-resources", label: "Travel Resources", href: "/admin/travel-resources", icon: "🧳", description: "Visa, packing, health guidance" },
  { key: "link-generator", label: "Link Generator", href: "/admin/link-generator", icon: "🔗", description: "Build trackable UTM links for ads and social campaigns" },
  { key: "team-members", label: "Team Members", href: "/admin/team-members", icon: "🧑‍🤝‍🧑", description: "Staff bios for the About page" },
  { key: "media", label: "Media Library", href: "/admin/media", icon: "🖼️", description: "Images, videos, PDFs, brochures" },
  { key: "reports", label: "Reports & Analytics", href: "/admin/reports", icon: "📈", description: "Revenue and booking analytics" },
  { key: "staff", label: "Staff Management", href: "/admin/staff", icon: "🧑‍💼", description: "Roles and permissions" },
  { key: "settings", label: "Website Settings", href: "/admin/settings", icon: "⚙️", description: "Company info, currency, SEO defaults" },
  { key: "statuses", label: "Status Options", href: "/admin/statuses", icon: "🏷️", description: "Manage booking and payment status choices" },
];

// Which modules each role can see. Admin sees everything; other roles get a
// scoped subset relevant to their job. Adjust freely as the business needs
// evolve; this table is the single source of truth for sidebar + route guards.
export const ROLE_MODULE_ACCESS: Record<StaffRole, AdminModuleKey[]> = {
  admin: ADMIN_MODULES.map((m) => m.key),
  manager: [
    "dashboard",
    "tours",
    "journeys",
    "collections",
    "experience-types",
    "activities",
    "vehicles",
    "accommodations",
    "destinations",
    "operations",
    "bookings",
    "customers",
    "inquiries",
    "blog",
    "reviews",
    "media",
    "reports",
    "staff",
    "settings",
    "statuses",
    "travel-resources",
    "faqs",
    "team-members",
    "notifications",
    "link-generator",
  ],
  sales_agent: [
    "dashboard",
    "bookings",
    "customers",
    "inquiries",
    "notifications",
  ],
  tour_guide: ["dashboard", "bookings", "operations", "travel-resources", "notifications"],
  driver: ["dashboard", "bookings", "operations", "notifications"],
};

export function canAccessModule(role: StaffRole, moduleKey: AdminModuleKey): boolean {
  return ROLE_MODULE_ACCESS[role]?.includes(moduleKey) ?? false;
}

export function getModulesForRole(role: StaffRole): AdminModuleDef[] {
  return ADMIN_MODULES.filter((m) => canAccessModule(role, m.key));
}

// Same five-way split as the comment on ADMIN_MODULES above, made explicit
// so the sidebar can render them as named, collapsible sections instead of
// one long flat list. "dashboard" is deliberately left out -- it's pinned
// above the groups as the one always-visible "home" link.
export interface AdminModuleGroup {
  key: string;
  label: string;
  moduleKeys: AdminModuleKey[];
}

export const ADMIN_MODULE_GROUPS: AdminModuleGroup[] = [
  { key: "today", label: "Today", moduleKeys: ["notifications", "bookings", "inquiries", "customers", "operations"] },
  { key: "catalog", label: "Catalog", moduleKeys: ["tours", "journeys", "collections", "destinations"] },
  {
    key: "building-blocks",
    label: "Building Blocks",
    moduleKeys: ["experience-types", "activities", "vehicles", "accommodations"],
  },
  {
    key: "content-marketing",
    label: "Content & Marketing",
    moduleKeys: ["blog", "reviews", "faqs", "travel-resources", "team-members", "media", "link-generator"],
  },
  { key: "reports-settings", label: "Reports & Settings", moduleKeys: ["reports", "staff", "settings", "statuses"] },
];

export interface AdminModuleGroupWithModules {
  key: string;
  label: string;
  modules: AdminModuleDef[];
}

// Groups a role's accessible modules for the sidebar, dropping any group
// that has nothing left in it for that role (e.g. a sales agent has no
// "Catalog" access at all) instead of rendering an empty section.
export function getGroupedModulesForRole(role: StaffRole): {
  pinned: AdminModuleDef[];
  groups: AdminModuleGroupWithModules[];
} {
  const accessible = getModulesForRole(role);
  const byKey = new Map(accessible.map((m) => [m.key, m]));

  const pinned = accessible.filter((m) => m.key === "dashboard");
  const groups = ADMIN_MODULE_GROUPS.map((g) => ({
    key: g.key,
    label: g.label,
    modules: g.moduleKeys.map((k) => byKey.get(k)).filter((m): m is AdminModuleDef => Boolean(m)),
  })).filter((g) => g.modules.length > 0);

  return { pinned, groups };
}
