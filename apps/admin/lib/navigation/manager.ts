import { Permissions } from "@/lib/auth/permissions";

import type { NavigationGroup } from "./types";

export const managerNavigation: NavigationGroup[] = [
  {
    title: "General",
    items: [
      {
        title: "Dashboard",
        href: "/manager",
        icon: "dashboard",
        permission:
          Permissions.DASHBOARD_VIEW,
      },
    ],
  },

  {
    title: "Catalog",
    items: [
      {
        title: "Products",
        href: "/manager/products",
        icon: "package",
        permission:
          Permissions.PRODUCTS_VIEW,
      },
      {
        title: "Categories",
        href: "/manager/categories",
        icon: "shapes",
        permission:
          Permissions.CATEGORIES_VIEW,
      },
      {
        title: "Brands",
        href: "/manager/brands",
        icon: "tags",
        permission:
          Permissions.BRANDS_VIEW,
      },
    ],
  },

  {
    title: "Sales",
    items: [
      {
        title: "Orders",
        href: "/manager/orders",
        icon: "orders",
        permission:
          Permissions.ORDERS_VIEW,
      },
    ],
  },

  {
    title: "Inventory",
    items: [
      {
        title: "Inventory",
        href: "/manager/inventory",
        icon: "inventory",
        permission:
          Permissions.INVENTORY_VIEW,
      },
      {
        title: "Suppliers",
        href: "/manager/suppliers",
        icon: "truck",
        permission:
          Permissions.SUPPLIERS_VIEW,
      },
    ],
  },

  {
    title: "Reports",
    items: [
      {
        title: "Reports",
        href: "/manager/reports",
        icon: "reports",
        permission:
          Permissions.REPORTS_VIEW,
      },
    ],
  },
];