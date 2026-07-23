import type { ReactNode } from "react";

import { Roles } from "@/lib/auth/roles";
import { requireWorkspace } from "@/lib/auth/workspace";

interface StaffLayoutProps {
  children: ReactNode;
}

export default async function StaffLayout({
  children,
}: StaffLayoutProps) {
  await requireWorkspace([
    Roles.STAFF,
  ]);

  return <>{children}</>;
}