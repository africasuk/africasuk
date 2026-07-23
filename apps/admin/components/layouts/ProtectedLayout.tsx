import type { ReactNode } from "react";

import {
  type Permission,
} from "@/lib/auth/permissions";

import {
  requirePermission,
} from "@/lib/auth/guards";

interface ProtectedLayoutProps {
  permission: Permission;
  children: ReactNode;
}

export default async function ProtectedLayout({
  permission,
  children,
}: ProtectedLayoutProps) {
  await requirePermission(permission);

  return <>{children}</>;
}