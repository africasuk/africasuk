"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Bell, Loader2 } from "lucide-react";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

import ThemeToggle from "@/components/shared/ThemeToggle";
import UserMenu from "./UserMenu";
import Breadcrumbs from "./Breadcrumbs";

interface AppHeaderProps {
  notificationsHref?: string;
  hasUnreadNotifications?: boolean;
}

export default function AppHeader({
  notificationsHref = "/notifications",
  hasUnreadNotifications = true,
}: AppHeaderProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);

  const handleNotificationsClick = () => {
    setIsLoadingNotifications(true);
    startTransition(() => {
      router.push(notificationsHref);
    });
  };

  return (
    <header className="sticky top-0 z-40 flex h-14 sm:h-16 w-full items-center justify-between border-b bg-background/95 px-3 sm:px-6 backdrop-blur supports-backdrop-filter:bg-background/60">
      {/* Left side: Navigation controls */}
      <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-4">
        {/* Sidebar Trigger - preserved touch target */}
        <div className="shrink-0 flex items-center">
          <SidebarTrigger className="h-9 w-9 sm:h-10 sm:w-10" />
        </div>

        {/* Breadcrumbs - hidden on mobile to avoid crowding the narrow header */}
        <div className="hidden sm:block min-w-0 flex-1 truncate">
          <Breadcrumbs />
        </div>
      </div>

      {/* Right side: Actions */}
      <div className="flex shrink-0 items-center gap-1 sm:gap-2">
        <ThemeToggle />

        {/* Notifications Button with active loading state */}
        <Button
          variant="ghost"
          size="icon"
          disabled={isPending && isLoadingNotifications}
          onClick={handleNotificationsClick}
          className="relative h-9 w-9 sm:h-10 sm:w-10 transition-colors"
          aria-label="Notifications"
        >
          {isPending && isLoadingNotifications ? (
            <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin text-muted-foreground" />
          ) : (
            <>
              <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
              {hasUnreadNotifications && (
                <span className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-destructive" />
                </span>
              )}
            </>
          )}
        </Button>

        <UserMenu />
      </div>
    </header>
  );
}