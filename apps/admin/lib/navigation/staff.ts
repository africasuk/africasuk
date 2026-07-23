import { Permissions } from "@/lib/auth/permissions";

import type { NavigationGroup } from "./types";

export const staffNavigation: NavigationGroup[] = [
  {
    title: "Workspace",
    items: [
      {
        title: "Dashboard",
        href: "/staff",
        icon: "dashboard",
        permission: Permissions.DASHBOARD_VIEW,
      },
      {
        title: "Orders",
        href: "/staff/orders",
        icon: "orders",
        permission: Permissions.ORDERS_VIEW,
      },
      {
        title: "Packing",
        href: "/staff/packing",
        icon: "inventory",
        permission: Permissions.ORDERS_VIEW,
      },
      {
        title: "Deliveries",
        href: "/staff/deliveries",
        icon: "truck",
        permission: Permissions.ORDERS_VIEW,
      },
      {
        title: "Customers",
        href: "/staff/customers",
        icon: "users",
        permission: Permissions.CUSTOMERS_VIEW,
      },
    ],
  },
];