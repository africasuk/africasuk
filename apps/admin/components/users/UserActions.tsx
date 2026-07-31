"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Ban,
  KeyRound,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import type { User } from "@africasuk/types";

import ConfirmDialog from "@/components/shared/ConfirmDialog";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Props {
  user: User;
}

export default function UserActions({
  user,
}: Props) {
  const router = useRouter();

  const isSuperAdmin =
    user.role === "SUPER_ADMIN";

  async function toggleStatus() {
    try {
      const response = await fetch(
        `/api/users/${user.id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            isActive: !user.isActive,
          }),
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        toast.error(
          result.message ??
            "Failed to update user."
        );
        return;
      }

      toast.success(
        user.isActive
          ? "User deactivated."
          : "User activated."
      );

      router.refresh();
    } catch {
      toast.error(
        "Something went wrong."
      );
    }
  }

  async function resetPassword() {
    try {
      const response = await fetch(
        `/api/users/${user.id}/reset-password`,
        {
          method: "PATCH",
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        toast.error(
          result.message ??
            "Failed to reset password."
        );
        return;
      }

      toast.success(
        "Password reset to Pass@123."
      );
    } catch {
      toast.error(
        "Something went wrong."
      );
    }
  }

  async function deleteUser() {
    try {
      const response = await fetch(
        `/api/users/${user.id}`,
        {
          method: "DELETE",
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        toast.error(
          result.message ??
            "Failed to delete user."
        );
        return;
      }

      toast.success(
        "User deleted successfully."
      );

      router.refresh();
    } catch {
      toast.error(
        "Something went wrong."
      );
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
          <Button
            size="icon"
            variant="ghost"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-56"
      >
       <Link href={`/users/${user.id}/edit`}>
            <DropdownMenuItem>
              <Pencil className="mr-2 h-4 w-4" />
              Edit User
            </DropdownMenuItem>
          </Link>

        {!isSuperAdmin && (
          <>
            <ConfirmDialog
              title="Reset Password"
              description={`Reset the password for ${
                user.fullName ||
                user.email
              } to Pass@123?`}
              confirmText="Reset Password"
              onConfirm={resetPassword}
            >
              <DropdownMenuItem
                onSelect={(e) =>
                  e.preventDefault()
                }
              >
                <KeyRound className="mr-2 h-4 w-4" />
                Reset Password
              </DropdownMenuItem>
            </ConfirmDialog>

            <ConfirmDialog
              title={
                user.isActive
                  ? "Deactivate User"
                  : "Activate User"
              }
              description={
                user.isActive
                  ? "The user will no longer be able to sign in."
                  : "The user will be able to sign in again."
              }
              confirmText={
                user.isActive
                  ? "Deactivate"
                  : "Activate"
              }
              onConfirm={toggleStatus}
            >
              <DropdownMenuItem
                onSelect={(e) =>
                  e.preventDefault()
                }
              >
                <Ban className="mr-2 h-4 w-4" />
                {user.isActive
                  ? "Deactivate"
                  : "Activate"}
              </DropdownMenuItem>
            </ConfirmDialog>

            <DropdownMenuSeparator />

            <ConfirmDialog
              title="Delete User"
              description={`Delete ${
                user.fullName ||
                user.email
              } permanently? This action cannot be undone.`}
              confirmText="Delete User"
              destructive
              onConfirm={deleteUser}
            >
              <DropdownMenuItem
                onSelect={(e) =>
                  e.preventDefault()
                }
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete User
              </DropdownMenuItem>
            </ConfirmDialog>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}