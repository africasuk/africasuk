import type { ReactNode } from "react";

import DashboardLayout from "@/components/layout/DashboardLayout";

import { staffNavigation } from "@/lib/navigation/staff";

export default function StaffLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <DashboardLayout
      navigation={staffNavigation}
      title="AfricaSuk Staff"
      subtitle="Operations"
    >
      {children}
    </DashboardLayout>
  );
}