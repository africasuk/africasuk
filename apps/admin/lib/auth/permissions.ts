import { Roles, type Role } from "./roles";

export const Permissions = {
  // Dashboard
  DASHBOARD_VIEW: "dashboard.view",

  // Products
  PRODUCTS_VIEW: "products.view",
  PRODUCTS_CREATE: "products.create",
  PRODUCTS_UPDATE: "products.update",
  PRODUCTS_DELETE: "products.delete",

  // Categories
  CATEGORIES_VIEW: "categories.view",
  CATEGORIES_CREATE: "categories.create",
  CATEGORIES_UPDATE: "categories.update",
  CATEGORIES_DELETE: "categories.delete",

  // Brands
  BRANDS_VIEW: "brands.view",
  BRANDS_CREATE: "brands.create",
  BRANDS_UPDATE: "brands.update",
  BRANDS_DELETE: "brands.delete",

  // Reviews
  REVIEWS_VIEW: "reviews.view",
  REVIEWS_UPDATE: "reviews.update",
  REVIEWS_DELETE: "reviews.delete",

  // Suppliers
  SUPPLIERS_VIEW: "suppliers.view",
  SUPPLIERS_CREATE: "suppliers.create",
  SUPPLIERS_UPDATE: "suppliers.update",
  SUPPLIERS_DELETE: "suppliers.delete",

  // Customers
  CUSTOMERS_VIEW: "customers.view",
  CUSTOMERS_CREATE: "customers.create",
  CUSTOMERS_UPDATE: "customers.update",
  CUSTOMERS_DELETE: "customers.delete",

  // Orders
  ORDERS_VIEW: "orders.view",
  ORDERS_CREATE: "orders.create",
  ORDERS_UPDATE: "orders.update",
  ORDERS_DELETE: "orders.delete",

  // Inventory
  INVENTORY_VIEW: "inventory.view",
  INVENTORY_UPDATE: "inventory.update",

  // Reports
  REPORTS_VIEW: "reports.view",

  // Users
  USERS_VIEW: "users.view",
  USERS_CREATE: "users.create",
  USERS_UPDATE: "users.update",
  USERS_DELETE: "users.delete",

  // Roles
  ROLES_VIEW: "roles.view",
  ROLES_MANAGE: "roles.manage",

  // Settings
  SETTINGS_VIEW: "settings.view",
  SETTINGS_UPDATE: "settings.update",
} as const;

export type Permission =
  (typeof Permissions)[keyof typeof Permissions];

export const RolePermissions: Record<Role, Permission[]> = {
  // =====================================================
  // SUPER ADMIN
  // =====================================================
  [Roles.SUPER_ADMIN]: Object.values(Permissions),

  // =====================================================
  // ADMIN
  // =====================================================
  [Roles.ADMIN]: [
    Permissions.DASHBOARD_VIEW,

    // Products
    Permissions.PRODUCTS_VIEW,
    Permissions.PRODUCTS_CREATE,
    Permissions.PRODUCTS_UPDATE,
    Permissions.PRODUCTS_DELETE,

    // Categories
    Permissions.CATEGORIES_VIEW,
    Permissions.CATEGORIES_CREATE,
    Permissions.CATEGORIES_UPDATE,
    Permissions.CATEGORIES_DELETE,

    // Brands
    Permissions.BRANDS_VIEW,
    Permissions.BRANDS_CREATE,
    Permissions.BRANDS_UPDATE,
    Permissions.BRANDS_DELETE,

    // Reviews
    Permissions.REVIEWS_VIEW,
    Permissions.REVIEWS_UPDATE,
    Permissions.REVIEWS_DELETE,

    // Suppliers
    Permissions.SUPPLIERS_VIEW,
    Permissions.SUPPLIERS_CREATE,
    Permissions.SUPPLIERS_UPDATE,
    Permissions.SUPPLIERS_DELETE,

    // Customers
    Permissions.CUSTOMERS_VIEW,
    Permissions.CUSTOMERS_CREATE,
    Permissions.CUSTOMERS_UPDATE,

    // Orders
    Permissions.ORDERS_VIEW,
    Permissions.ORDERS_CREATE,
    Permissions.ORDERS_UPDATE,

    // Inventory
    Permissions.INVENTORY_VIEW,
    Permissions.INVENTORY_UPDATE,

    // Reports
    Permissions.REPORTS_VIEW,

    // Users
    Permissions.USERS_VIEW,
    Permissions.USERS_CREATE,
    Permissions.USERS_UPDATE,
    Permissions.USERS_DELETE,

    // Settings
    Permissions.SETTINGS_VIEW,
    Permissions.SETTINGS_UPDATE,
  ],

  // =====================================================
  // MANAGER
  // =====================================================
  [Roles.MANAGER]: [
    Permissions.DASHBOARD_VIEW,

    // Products
    Permissions.PRODUCTS_VIEW,
    Permissions.PRODUCTS_CREATE,
    Permissions.PRODUCTS_UPDATE,
    Permissions.PRODUCTS_DELETE,

    // Categories
    Permissions.CATEGORIES_VIEW,
    Permissions.CATEGORIES_CREATE,
    Permissions.CATEGORIES_UPDATE,
    Permissions.CATEGORIES_DELETE,

    // Brands
    Permissions.BRANDS_VIEW,
    Permissions.BRANDS_CREATE,
    Permissions.BRANDS_UPDATE,
    Permissions.BRANDS_DELETE,

    // Reviews
    Permissions.REVIEWS_VIEW,
    Permissions.REVIEWS_UPDATE,
    Permissions.REVIEWS_DELETE,

    // Suppliers
    Permissions.SUPPLIERS_VIEW,
    Permissions.SUPPLIERS_CREATE,
    Permissions.SUPPLIERS_UPDATE,
    Permissions.SUPPLIERS_DELETE,

    // Customers
    Permissions.CUSTOMERS_VIEW,
    Permissions.CUSTOMERS_CREATE,
    Permissions.CUSTOMERS_UPDATE,

    // Orders
    Permissions.ORDERS_VIEW,
    Permissions.ORDERS_CREATE,
    Permissions.ORDERS_UPDATE,

    // Inventory
    Permissions.INVENTORY_VIEW,
    Permissions.INVENTORY_UPDATE,

    // Reports
    Permissions.REPORTS_VIEW,

    // Settings
    Permissions.SETTINGS_VIEW,
    Permissions.SETTINGS_UPDATE,
  ],

  // =====================================================
  // STAFF
  // =====================================================
  [Roles.STAFF]: [
    Permissions.DASHBOARD_VIEW,

    // Products
    Permissions.PRODUCTS_VIEW,

    // Categories
    Permissions.CATEGORIES_VIEW,

    // Brands
    Permissions.BRANDS_VIEW,

    // Reviews
    Permissions.REVIEWS_VIEW,

    // Suppliers
    Permissions.SUPPLIERS_VIEW,

    // Customers
    Permissions.CUSTOMERS_VIEW,

    // Orders
    Permissions.ORDERS_VIEW,
    Permissions.ORDERS_UPDATE,

    // Inventory
    Permissions.INVENTORY_VIEW,
  ],
};

export function hasPermission(
  role: Role,
  permission: Permission,
): boolean {
  return (
    RolePermissions[role]?.includes(permission) ?? false
  );
}