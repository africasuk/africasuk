import {
  LayoutDashboard,
  Tags,
  FolderTree,
  Package,
  Truck,
  Warehouse,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
} from "lucide-react";

export const navigation = [
  {
    title: "Dashboard",
    items: [
      {
        title: "Dashboard",
        href: "/",
        icon: LayoutDashboard,
      },
    ],
  },

  {
    title: "Catalog",
    items: [
      {
        title: "Brands",
        href: "/brands",
        icon: Tags,
      },
      {
        title: "Categories",
        href: "/categories",
        icon: FolderTree,
      },
      {
        title: "Products",
        href: "/products",
        icon: Package,
      },
    ],
  },

  {
    title: "Inventory",
    items: [
      {
        title: "Suppliers",
        href: "/suppliers",
        icon: Truck,
      },
      {
        title: "Branches",
        href: "/branches",
        icon: Warehouse,
      },
    ],
  },

  {
    title: "Sales",
    items: [
      {
        title: "Orders",
        href: "/orders",
        icon: ShoppingCart,
      },
      {
        title: "Customers",
        href: "/customers",
        icon: Users,
      },
    ],
  },

  {
    title: "Reports",
    items: [
      {
        title: "Analytics",
        href: "/analytics",
        icon: BarChart3,
      },
    ],
  },

  {
    title: "System",
    items: [
      {
        title: "Settings",
        href: "/settings",
        icon: Settings,
      },
    ],
  },
];