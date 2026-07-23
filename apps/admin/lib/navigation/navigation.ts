import { Permissions } from "@/lib/auth/permissions";

export type IconName =
  | "dashboard"
  | "package"
  | "tags"
  | "shapes"
  | "users"
  | "orders"
  | "inventory"
  | "truck"
  | "reports"
  | "shield"
  | "settings";

export interface NavigationItem {
  title: string;
  href: string;
  icon: IconName;
  permission: string;
}

export interface NavigationGroup {
  title: string;
  items: NavigationItem[];
}

export const navigation: NavigationGroup[] = [
  {
    title: "Overview",
    items: [
      {
        title: "Dashboard",
        href: "/",
        icon: "dashboard",
        permission: Permissions.DASHBOARD_VIEW,
      },
    ],
  },
  {
    title: "Catalog",
    items: [
      {
        title: "Products",
        href: "/products",
        icon: "package",
        permission: Permissions.PRODUCTS_VIEW,
      },
      {
        title: "Categories",
        href: "/categories",
        icon: "shapes",
        permission: Permissions.CATEGORIES_VIEW,
      },
      {
        title: "Brands",
        href: "/brands",
        icon: "tags",
        permission: Permissions.BRANDS_VIEW,
      },
    ],
  },
  {
    title: "Sales",
    items: [
      {
        title: "Orders",
        href: "/orders",
        icon: "orders",
        permission: Permissions.ORDERS_VIEW,
      },
      {
        title: "Customers",
        href: "/customers",
        icon: "users",
        permission: Permissions.CUSTOMERS_VIEW,
      },
    ],
  },
  {
    title: "Inventory",
    items: [
      {
        title: "Inventory",
        href: "/inventory",
        icon: "inventory",
        permission: Permissions.INVENTORY_VIEW,
      },
      {
        title: "Suppliers",
        href: "/suppliers",
        icon: "truck",
        permission: Permissions.SUPPLIERS_VIEW,
      },
    ],
  },
  {
    title: "Management",
    items: [
      {
        title: "Reports",
        href: "/reports",
        icon: "reports",
        permission: Permissions.REPORTS_VIEW,
      },
      {
        title: "Users",
        href: "/users",
        icon: "shield",
        permission: Permissions.USERS_VIEW,
      },
      {
        title: "Settings",
        href: "/settings",
        icon: "settings",
        permission: Permissions.SETTINGS_VIEW,
      },
    ],
  },
];