import type { ReactNode } from "react";

import { redirect } from "next/navigation";

import { requirePermission } from "@/lib/auth/guards";
import { Permissions } from "@/lib/auth/permissions";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { managerNavigation } from "@/lib/navigation/manager";

interface Props {
  children: ReactNode;
}

export default async function ManagerLayout({
  children,
}: Props) {
  const { profile } =
    await requirePermission(
      Permissions.DASHBOARD_VIEW
    );

  if (profile.role !== "MANAGER") {
    redirect("/unauthorized");
  }

  return (
    <DashboardLayout
      navigation={managerNavigation}
    >
      {children}
    </DashboardLayout>
  );
}