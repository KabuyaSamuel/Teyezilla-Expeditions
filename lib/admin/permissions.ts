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
  | "destinations"
  | "bookings"
  | "customers"
  | "payments"
  | "inquiries"
  | "trip-planner"
  | "blog"
  | "reviews"
  | "media"
  | "coupons"
  | "reports"
  | "staff"
  | "settings"
  | "travel-resources"
  | "affiliates"
  | "notifications"
  | "inventory";

export interface AdminModuleDef {
  key: AdminModuleKey;
  label: string;
  href: string;
  icon: string; // simple emoji glyph, swap for an icon set later
  description: string;
}

export const ADMIN_MODULES: AdminModuleDef[] = [
  { key: "dashboard", label: "Dashboard", href: "/admin", icon: "📊", description: "Overview of bookings, revenue, and activity" },
  { key: "tours", label: "Tour Management", href: "/admin/tours", icon: "🧭", description: "Create and manage tours" },
  { key: "journeys", label: "Journey Management", href: "/admin/journeys", icon: "✈️", description: "Multi-country and signature journeys" },
  { key: "collections", label: "Collections", href: "/admin/collections", icon: "🧩", description: "Curated tour and journey collections" },
  { key: "destinations", label: "Destination Management", href: "/admin/destinations", icon: "🌍", description: "Countries, cities, attractions" },
  { key: "bookings", label: "Booking Management", href: "/admin/bookings", icon: "📅", description: "Bookings, vouchers, cancellations" },
  { key: "customers", label: "Customer Management (CRM)", href: "/admin/customers", icon: "👥", description: "Customer profiles and history" },
  { key: "payments", label: "Payment Management", href: "/admin/payments", icon: "💳", description: "Payment records and refunds" },
  { key: "inquiries", label: "Inquiry Management", href: "/admin/inquiries", icon: "💬", description: "Website, WhatsApp, and form inquiries" },
  { key: "trip-planner", label: "AI Trip Planner", href: "/admin/trip-planner", icon: "🤖", description: "Submitted itinerary requests" },
  { key: "blog", label: "Blog Management", href: "/admin/blog", icon: "📝", description: "Posts, categories, SEO" },
  { key: "reviews", label: "Reviews", href: "/admin/reviews", icon: "⭐", description: "Approve or hide testimonials" },
  { key: "media", label: "Media Library", href: "/admin/media", icon: "🖼️", description: "Images, videos, PDFs, brochures" },
  { key: "coupons", label: "Coupons & Promotions", href: "/admin/coupons", icon: "🏷️", description: "Discount and referral codes" },
  { key: "reports", label: "Reports & Analytics", href: "/admin/reports", icon: "📈", description: "Revenue and booking analytics" },
  { key: "staff", label: "Staff Management", href: "/admin/staff", icon: "🧑‍💼", description: "Roles and permissions" },
  { key: "settings", label: "Website Settings", href: "/admin/settings", icon: "⚙️", description: "Company info, currency, SEO defaults" },
  { key: "travel-resources", label: "Travel Resources", href: "/admin/travel-resources", icon: "🧳", description: "Visa, packing, health guidance" },
  { key: "affiliates", label: "Affiliate Management", href: "/admin/affiliates", icon: "🔗", description: "Viator, GetYourGuide, Booking.com" },
  { key: "notifications", label: "Notifications", href: "/admin/notifications", icon: "🔔", description: "Alerts and reminders" },
  { key: "inventory", label: "Inventory & Availability", href: "/admin/inventory", icon: "🗂️", description: "Capacity and assignment" },
];

// Which modules each role can see. Admin sees everything; other roles get a
// scoped subset relevant to their job. Adjust freely as the business needs
// evolve — this table is the single source of truth for sidebar + route guards.
export const ROLE_MODULE_ACCESS: Record<StaffRole, AdminModuleKey[]> = {
  admin: ADMIN_MODULES.map((m) => m.key),
  manager: [
    "dashboard",
    "tours",
    "journeys",
    "collections",
    "destinations",
    "bookings",
    "customers",
    "payments",
    "inquiries",
    "trip-planner",
    "blog",
    "reviews",
    "media",
    "coupons",
    "reports",
    "staff",
    "settings",
    "travel-resources",
    "affiliates",
    "notifications",
    "inventory",
  ],
  sales_agent: [
    "dashboard",
    "bookings",
    "customers",
    "inquiries",
    "trip-planner",
    "coupons",
    "notifications",
  ],
  tour_guide: ["dashboard", "bookings", "inventory", "travel-resources", "notifications"],
  driver: ["dashboard", "bookings", "inventory", "notifications"],
};

export function canAccessModule(role: StaffRole, moduleKey: AdminModuleKey): boolean {
  return ROLE_MODULE_ACCESS[role]?.includes(moduleKey) ?? false;
}

export function getModulesForRole(role: StaffRole): AdminModuleDef[] {
  return ADMIN_MODULES.filter((m) => canAccessModule(role, m.key));
}
