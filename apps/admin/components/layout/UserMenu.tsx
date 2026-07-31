"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
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

import { Button } from "@/components/ui/button";

interface Profile {
  full_name: string;
  email: string;
  avatar_url: string | null;
  role: string;
}

export default function UserMenu() {
  const router = useRouter();
  const supabase = createClient();

  const [profile, setProfile] =
    useState<Profile | null>(null);

  useEffect(() => {
    async function loadProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data } = await supabase
        .from("profiles")
        .select(
          "full_name,email,avatar_url,role"
        )
        .eq("user_id", user.id)
        .single();

      if (data) {
        setProfile(data);
      }
    }

    loadProfile();
  }, [supabase]);

  async function logout() {
    const { error } =
      await supabase.auth.signOut();

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Signed out.");

    router.replace("/login");
    router.refresh();
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
<DropdownMenuTrigger>
  <Button
    variant="ghost"
    className="flex h-10 items-center gap-3 px-2"
  >
    <Avatar className="h-8 w-8">
      <AvatarImage
        src={profile?.avatar_url ?? ""}
        alt={profile?.full_name}
      />
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>

    <div className="hidden text-left md:block">
      <p className="text-sm font-medium">
        {profile?.full_name ?? "Loading..."}
      </p>

      <p className="text-xs text-muted-foreground">
        {profile?.email ?? ""}
      </p>
    </div>

    <ChevronDown className="h-4 w-4" />
  </Button>
</DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-64"
      >
        <div className="px-3 py-2">
          <p className="font-medium">
            {profile?.full_name}
          </p>

          <p className="text-xs text-muted-foreground">
            {profile?.email}
          </p>

          <p className="mt-1 text-xs font-medium text-primary">
            {profile?.role}
          </p>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() =>
            router.push("/profile")
          }
        >
          <User className="mr-2 h-4 w-4" />
          Profile
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() =>
            router.push("/settings")
          }
        >
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={logout}
          className="text-red-600 focus:text-red-600"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}