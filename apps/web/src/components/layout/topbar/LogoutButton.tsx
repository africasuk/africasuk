"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Loader2 } from "lucide-react";
import { logout } from "@/lib/auth/logout";

export default function LogoutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async (e: React.MouseEvent) => {
    // Prevent event bubbling
    e.stopPropagation();
    
    if (isLoading) return;

    setIsLoading(true);
    try {
      const { error } = await logout();

      if (!error) {
        router.refresh();
        router.push("/");
      } else {
        setIsLoading(false);
      }
    } catch {
      // Omitted the unused 'err' object to satisfy ESLint rules
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className="group flex flex-col items-center justify-center gap-1 rounded-lg px-2 py-1.5 text-neutral-600 transition-all duration-200 hover:bg-neutral-50 hover:text-red-600 active:scale-95 cursor-pointer border-none bg-transparent p-0 disabled:opacity-70 disabled:cursor-not-allowed"
    >
      {isLoading ? (
        <Loader2 className="h-5 w-5 animate-spin text-red-600" />
      ) : (
        <LogOut className="h-5 w-5 transition-transform group-hover:scale-105" />
      )}
      <span className="text-[10px] font-medium tracking-wide">
        {isLoading ? "..." : "Logout"}
      </span>
    </button>
  );
}