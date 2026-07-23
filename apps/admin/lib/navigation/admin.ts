import type { NavigationGroup } from "./navigation";

export const adminNavigation: NavigationGroup[] = [
  {
    title: "General",
    items: [
      {
        title: "Dashboard",
        href: "/",
        icon: "dashboard",
        permission: "dashboard.view",
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
        permission: "orders.view",
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
        permission: "products.view",
      },
      {
        title: "Product Requests",
        href: "/product-requests",
        icon: "package",
        permission: "product_requests.view",
      },
      {
        title: "Categories",
        href: "/categories",
        icon: "shapes",
        permission: "categories.view",
      },
      {
        title: "Brands",
        href: "/brands",
        icon: "tags",
        permission: "brands.view",
      },
    ],
  },
  {
    title: "Administration",
    items: [
      {
        title: "Users",
        href: "/users",
        icon: "users",
        permission: "users.view",
      },
      {
        title: "Currencies",
        href: "/settings/currency",
        icon: "tags",
        permission: "currencies.view",
      },
      {
        title: "Settings",
        href: "/settings",
        icon: "settings",
        permission: "settings.view",
      },
    ],
  },
];