import {
  hasPermission,
  type Permission,
} from "@/lib/auth/permissions";

import type { Role } from "@/lib/auth/roles";

import {
  navigation,
  type NavigationGroup,
} from "./navigation";

export function getNavigation(
  role: Role
): NavigationGroup[] {
  return navigation
    .map((group) => ({
      ...group,
      items: group.items.filter((item) =>
        hasPermission(
          role,
          item.permission as Permission
        )
      ),
    }))
    .filter((group) => group.items.length > 0);
}