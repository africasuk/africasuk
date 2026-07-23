import type { ReactNode } from "react";

import { Roles } from "@/lib/auth/roles";
import { requireWorkspace } from "@/lib/auth/workspace";

import AppHeader from "@/components/layout/AppHeader";
import AppSidebar from "@/components/layout/AppSidebar";
import { adminNavigation } from "@/lib/navigation/admin";

import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  await requireWorkspace([
    Roles.SUPER_ADMIN,
    Roles.ADMIN,
  ]);

  return (
   <SidebarProvider defaultOpen>
  <AppSidebar
    title="AfricaSuk"
    subtitle="Marketplace ERP"
    navigation={adminNavigation}
  />

  <SidebarInset>
    <AppHeader />

    <main className="flex-1 p-6 lg:p-8">
      <div className="mx-auto w-full max-w-7xl">
        {children}
      </div>
    </main>
  </SidebarInset>
</SidebarProvider>
  );
}