"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  Loader2,
  LogOut,
  Settings,
  User,
} from "lucide-react";
import { toast } from "sonner";

import { createClient } from "@/lib/supabase/client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Profile {
  full_name: string;
  email: string;
  avatar_url: string | null;
  role: string;
}

type ActionType = "profile" | "settings" | "logout" | null;

export default function UserMenu() {
  const router = useRouter();
  const supabase = createClient();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  const [isPending, startTransition] = useTransition();
  const [activeAction, setActiveAction] = useState<ActionType>(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) return;

        const { data } = await supabase
          .from("profiles")
          .select("full_name,email,avatar_url,role")
          .eq("user_id", user.id)
          .single();

        if (data) {
          setProfile(data);
        }
      } catch (err) {
        console.error("Failed to load user profile:", err);
      } finally {
        setIsLoadingProfile(false);
      }
    }

    loadProfile();
  }, [supabase]);

  const handleNavigate = (path: string, action: "profile" | "settings") => {
    setActiveAction(action);
    startTransition(() => {
      router.push(path);
    });
  };

  async function logout() {
    setActiveAction("logout");
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        toast.error(error.message);
        setActiveAction(null);
        return;
      }

      toast.success("Signed out.");
      startTransition(() => {
        router.replace("/login");
        router.refresh();
      });
    } catch {
      toast.error("Failed to sign out.");
      setActiveAction(null);
    }
  }

  const initials =
    profile?.full_name
      ?.split(" ")
      .map((name) => name[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ?? "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        disabled={isLoadingProfile}
        className="flex h-9 sm:h-10 items-center gap-2 sm:gap-3 rounded-lg p-1 sm:px-2 hover:bg-accent transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring shrink-0"
        aria-label="Open user menu"
      >
        <Avatar className="h-7 w-7 sm:h-8 sm:w-8 shrink-0">
          <AvatarImage
            src={profile?.avatar_url ?? ""}
            alt={profile?.full_name ?? ""}
          />
          <AvatarFallback className="text-xs sm:text-sm font-medium">
            {isLoadingProfile ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
            ) : (
              initials
            )}
          </AvatarFallback>
        </Avatar>

        {/* Text information hidden on phone viewports to prevent overflow */}
        <div className="hidden text-left md:block max-w-32.5 lg:max-w-42.5 truncate">
          <p className="text-sm font-medium truncate">
            {isLoadingProfile ? (
              <span className="inline-block h-3.5 w-20 animate-pulse rounded bg-muted" />
            ) : (
              profile?.full_name ?? "User"
            )}
          </p>

          <p className="text-xs text-muted-foreground truncate">
            {isLoadingProfile ? (
              <span className="inline-block h-2.5 w-28 animate-pulse rounded bg-muted" />
            ) : (
              profile?.email ?? ""
            )}
          </p>
        </div>

        <ChevronDown className="hidden sm:block h-4 w-4 text-muted-foreground" />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={6}
        className="w-56 sm:w-64 max-w-[calc(100vw-1.5rem)]"
      >
        {/* User Identity Header */}
        <div className="px-3 py-2 space-y-0.5">
          <p className="font-medium text-sm text-foreground truncate">
            {profile?.full_name ?? "User Profile"}
          </p>

          <p className="text-xs text-muted-foreground truncate">
            {profile?.email}
          </p>

          {profile?.role && (
            <p className="pt-1 text-[11px] font-semibold uppercase tracking-wider text-primary">
              {profile.role}
            </p>
          )}
        </div>

        <DropdownMenuSeparator />

        {/* Profile Navigation */}
        <DropdownMenuItem
          disabled={isPending}
          onClick={() => handleNavigate("/profile", "profile")}
          className="cursor-pointer py-2 text-xs sm:text-sm"
        >
          {isPending && activeAction === "profile" ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin text-primary" />
          ) : (
            <User className="mr-2 h-4 w-4" />
          )}
          <span>Profile</span>
        </DropdownMenuItem>

        {/* Settings Navigation */}
        <DropdownMenuItem
          disabled={isPending}
          onClick={() => handleNavigate("/settings", "settings")}
          className="cursor-pointer py-2 text-xs sm:text-sm"
        >
          {isPending && activeAction === "settings" ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin text-primary" />
          ) : (
            <Settings className="mr-2 h-4 w-4" />
          )}
          <span>Settings</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Sign Out */}
        <DropdownMenuItem
          disabled={isPending}
          onClick={logout}
          className="cursor-pointer py-2 text-xs sm:text-sm text-destructive focus:text-destructive focus:bg-destructive/10"
        >
          {isPending && activeAction === "logout" ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin text-destructive" />
          ) : (
            <LogOut className="mr-2 h-4 w-4" />
          )}
          <span>{activeAction === "logout" ? "Signing out..." : "Logout"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}