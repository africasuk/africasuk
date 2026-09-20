"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import Logo from "../logo/logo";

import type { NavigationGroup } from "@/lib/navigation/types";

import {
  LayoutDashboard,
  Package,
  Tags,
  Shapes,
  Users,
  ShoppingCart,
  Warehouse,
  Truck,
  FileBarChart,
  Shield,
  Settings,
  MessageSquare,
  Loader2,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";

interface AppSidebarProps {
  title: string;
  subtitle: string;
  version?: string;
  navigation: NavigationGroup[];
}

const icons = {
  dashboard: LayoutDashboard,
  package: Package,
  tags: Tags,
  shapes: Shapes,
  users: Users,
  orders: ShoppingCart,
  inventory: Warehouse,
  truck: Truck,
  reports: FileBarChart,
  shield: Shield,
  settings: Settings,
  reviews: MessageSquare,
} as const;

export default function AppSidebar({
  title,
  subtitle,
  version = "v1.0",
  navigation,
}: AppSidebarProps) {
  const pathname = usePathname();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  // Track the route the user is actively navigating towards
  const [targetHref, setTargetHref] = useState<string | null>(null);
  const [prevPathname, setPrevPathname] = useState(pathname);

  // Official React pattern: reset state during render when props/path change.
  // This satisfies ESLint (no useEffect setState) while guaranteeing the spinner clears once arrived.
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setTargetHref(null);
  }

  return (
    <Sidebar
      collapsible="icon"
      variant="inset"
      className="border-r"
    >
      <SidebarHeader className="border-b px-3 py-4">
        {collapsed ? (
          <div className="flex justify-center">
            <div className="h-12 w-12">
              <Logo />
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="h-14 w-14 shrink-0">
              <Logo />
            </div>

            <div className="min-w-0">
              <h2 className="truncate text-base font-semibold">
                {title}
              </h2>

              <p className="truncate text-xs text-muted-foreground">
                {subtitle}
              </p>
            </div>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent className="py-4">
        {navigation.map((group) => (
          <SidebarGroup key={group.title}>
            {!collapsed && (
              <SidebarGroupLabel className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {group.title}
              </SidebarGroupLabel>
            )}

            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const Icon = icons[item.icon];
                  const isLoading = targetHref === item.href;

                  const active =
                    pathname === item.href ||
                    pathname.startsWith(`${item.href}/`);

                  return (
                    <SidebarMenuItem key={item.href}>
                      <Link
                        href={item.href}
                        className="flex items-center gap-3 w-full"
                        onClick={() => {
                          if (pathname !== item.href) {
                            setTargetHref(item.href);
                          }
                        }}
                      >
                        <SidebarMenuButton
                          isActive={active}
                          tooltip={item.title}
                          className="h-10 rounded-lg w-full"
                        >
                          {isLoading ? (
                            <Loader2 className="h-4 w-4 shrink-0 animate-spin text-emerald-600" />
                          ) : (
                            <Icon className="h-4 w-4 shrink-0" />
                          )}

                          {!collapsed && (
                            <span className="flex-1 truncate">
                              {item.title}
                            </span>
                          )}
                        </SidebarMenuButton>
                      </Link>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        {!collapsed && (
          <p className="text-center text-xs text-muted-foreground">
            {title} {version}
          </p>
        )}
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}