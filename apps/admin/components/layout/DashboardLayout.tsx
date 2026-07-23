import type { ReactNode } from "react";

import AppHeader from "./AppHeader";
import AppSidebar from "./AppSidebar";

import type { NavigationGroup } from "@/lib/navigation/types";

import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";

interface DashboardLayoutProps {
  children: ReactNode;
  navigation: NavigationGroup[];
  title?: string;
  subtitle?: string;
}

export default function DashboardLayout({
  children,
  navigation,
  title = "AfricaSuk",
  subtitle = "Marketplace ERP",
}: DashboardLayoutProps) {
  return (
    <SidebarProvider defaultOpen>
      <AppSidebar
        title={title}
        subtitle={subtitle}
        navigation={navigation}
      />

      <SidebarInset>
        <AppHeader />

        <main className="flex flex-1 flex-col p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}