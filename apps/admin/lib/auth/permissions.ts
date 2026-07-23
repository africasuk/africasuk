import { Roles, type Role } from "./roles";

export const Permissions = {
  DASHBOARD_VIEW: "dashboard.view",

  PRODUCTS_VIEW: "products.view",
  PRODUCTS_CREATE: "products.create",
  PRODUCTS_UPDATE: "products.update",
  PRODUCTS_DELETE: "products.delete",

  CATEGORIES_VIEW: "categories.view",
  CATEGORIES_CREATE: "categories.create",
  CATEGORIES_UPDATE: "categories.update",
  CATEGORIES_DELETE: "categories.delete",

  BRANDS_VIEW: "brands.view",
  BRANDS_CREATE: "brands.create",
  BRANDS_UPDATE: "brands.update",
  BRANDS_DELETE: "brands.delete",

  SUPPLIERS_VIEW: "suppliers.view",
  SUPPLIERS_CREATE: "suppliers.create",
  SUPPLIERS_UPDATE: "suppliers.update",
  SUPPLIERS_DELETE: "suppliers.delete",

  CUSTOMERS_VIEW: "customers.view",
  CUSTOMERS_CREATE: "customers.create",
  CUSTOMERS_UPDATE: "customers.update",
  CUSTOMERS_DELETE: "customers.delete",

  ORDERS_VIEW: "orders.view",
  ORDERS_CREATE: "orders.create",
  ORDERS_UPDATE: "orders.update",
  ORDERS_DELETE: "orders.delete",

  INVENTORY_VIEW: "inventory.view",
  INVENTORY_UPDATE: "inventory.update",

  REPORTS_VIEW: "reports.view",

  USERS_VIEW: "users.view",
  USERS_CREATE: "users.create",
  USERS_UPDATE: "users.update",
  USERS_DELETE: "users.delete",

  ROLES_VIEW: "roles.view",
  ROLES_MANAGE: "roles.manage",

  SETTINGS_VIEW: "settings.view",
  SETTINGS_UPDATE: "settings.update",
} as const;

export type Permission =
  (typeof Permissions)[keyof typeof Permissions];

export const RolePermissions: Record<Role, Permission[]> = {
  [Roles.SUPER_ADMIN]: Object.values(
    Permissions
  ),

  [Roles.ADMIN]: [
    Permissions.DASHBOARD_VIEW,

    Permissions.PRODUCTS_VIEW,
    Permissions.PRODUCTS_CREATE,
    Permissions.PRODUCTS_UPDATE,
    Permissions.PRODUCTS_DELETE,

    Permissions.CATEGORIES_VIEW,
    Permissions.CATEGORIES_CREATE,
    Permissions.CATEGORIES_UPDATE,
    Permissions.CATEGORIES_DELETE,

    Permissions.BRANDS_VIEW,
    Permissions.BRANDS_CREATE,
    Permissions.BRANDS_UPDATE,
    Permissions.BRANDS_DELETE,

    Permissions.SUPPLIERS_VIEW,
    Permissions.SUPPLIERS_CREATE,
    Permissions.SUPPLIERS_UPDATE,
    Permissions.SUPPLIERS_DELETE,

    Permissions.CUSTOMERS_VIEW,
    Permissions.CUSTOMERS_CREATE,
    Permissions.CUSTOMERS_UPDATE,
    Permissions.CUSTOMERS_DELETE,

    Permissions.ORDERS_VIEW,
    Permissions.ORDERS_CREATE,
    Permissions.ORDERS_UPDATE,
    Permissions.ORDERS_DELETE,

    Permissions.INVENTORY_VIEW,
    Permissions.INVENTORY_UPDATE,

    Permissions.REPORTS_VIEW,

    Permissions.SETTINGS_VIEW,
    Permissions.SETTINGS_UPDATE,
  ],

  [Roles.MANAGER]: [
    Permissions.DASHBOARD_VIEW,

    Permissions.PRODUCTS_VIEW,
    Permissions.PRODUCTS_CREATE,
    Permissions.PRODUCTS_UPDATE,

    Permissions.CATEGORIES_VIEW,

    Permissions.BRANDS_VIEW,

    Permissions.SUPPLIERS_VIEW,

    Permissions.CUSTOMERS_VIEW,
    Permissions.CUSTOMERS_CREATE,
    Permissions.CUSTOMERS_UPDATE,

    Permissions.ORDERS_VIEW,
    Permissions.ORDERS_CREATE,
    Permissions.ORDERS_UPDATE,

    Permissions.INVENTORY_VIEW,
    Permissions.INVENTORY_UPDATE,

    Permissions.REPORTS_VIEW,
  ],

  [Roles.STAFF]: [
    Permissions.DASHBOARD_VIEW,

    Permissions.PRODUCTS_VIEW,

    Permissions.CATEGORIES_VIEW,

    Permissions.BRANDS_VIEW,

    Permissions.CUSTOMERS_VIEW,

    Permissions.ORDERS_VIEW,
    Permissions.ORDERS_UPDATE,

    Permissions.INVENTORY_VIEW,
  ],
};

export function hasPermission(
  role: Role,
  permission: Permission
): boolean {
  return (
    RolePermissions[role]?.includes(
      permission
    ) ?? false
  );
}