"use client";

import { Bell } from "lucide-react";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

import ThemeToggle from "@/components/shared/ThemeToggle";
import UserMenu from "./UserMenu";
import Breadcrumbs from "./Breadcrumbs";

export default function AppHeader() {
  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b bg-background/95 px-4 sm:px-6 backdrop-blur supports-backdrop-filter:bg-background/60">
      {/* Left side: Navigation controls */}
      <div className="flex min-w-0 items-center gap-2 sm:gap-4">
        {/* Ensures the trigger is always accessible and doesn't shrink */}
        <div className="shrink-0">
          <SidebarTrigger />
        </div>

        {/* Hides breadcrumbs on small mobile screens to prevent layout breaking / overlap */}
        <div className="hidden sm:block truncate">
          <Breadcrumbs />
        </div>
      </div>

      {/* Right side: Actions */}
      <div className="flex shrink-0 items-center gap-1 sm:gap-2">
        <ThemeToggle />

        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 sm:h-10 sm:w-10"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-red-500" />
        </Button>

        <UserMenu />
      </div>
    </header>
  );
}