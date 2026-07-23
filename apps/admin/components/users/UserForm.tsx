"use client";

import { useState } from "react";
import { toast } from "sonner";

import type { User } from "@africasuk/types";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type UserRole = User["role"];

interface Props {
  mode: "create" | "edit";
  initialValues?: Partial<User>;
  onSubmit: (values: {
    fullName: string;
    email: string;
    phone: string | null;
    role: UserRole;
  }) => Promise<void>;
}

export default function UserForm({
  mode,
  initialValues,
  onSubmit,
}: Props) {
  const [loading, setLoading] =
    useState(false);

  const [fullName, setFullName] =
    useState(
      initialValues?.fullName ?? ""
    );

  const [email] = useState(
    initialValues?.email ?? ""
  );

  const [phone, setPhone] =
    useState(
      initialValues?.phone ?? ""
    );

  const [role, setRole] =
    useState<UserRole>(
      initialValues?.role ?? "STAFF"
    );

  async function submit() {
    if (!fullName.trim()) {
      toast.error(
        "Full name is required."
      );
      return;
    }

    if (
      mode === "create" &&
      !email.trim()
    ) {
      toast.error(
        "Email is required."
      );
      return;
    }

    setLoading(true);

    try {
      await onSubmit({
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim()
          ? phone.trim()
          : null,
        role,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardContent className="space-y-6 pt-6">
        <div className="space-y-2">
          <Label htmlFor="fullName">
            Full Name
          </Label>

          <Input
            id="fullName"
            placeholder="John Doe"
            value={fullName}
            onChange={(e) =>
              setFullName(
                e.target.value
              )
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">
            Email
          </Label>

          <Input
            id="email"
            type="email"
            placeholder="john@example.com"
            value={email}
            disabled={
              mode === "edit"
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">
            Phone
          </Label>

          <Input
            id="phone"
            placeholder="+211..."
            value={phone}
            onChange={(e) =>
              setPhone(
                e.target.value
              )
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">
            Role
          </Label>

          <select
            id="role"
            value={role}
            disabled={
              initialValues?.role ===
              "SUPER_ADMIN"
            }
            onChange={(e) =>
              setRole(
                e.target
                  .value as UserRole
              )
            }
            className="w-full rounded-md border bg-background px-3 py-2"
          >
            {initialValues?.role ===
              "SUPER_ADMIN" && (
              <option value="SUPER_ADMIN">
                Super Admin
              </option>
            )}

            <option value="ADMIN">
              Admin
            </option>

            <option value="MANAGER">
              Manager
            </option>

            <option value="STAFF">
              Staff
            </option>
          </select>

          {initialValues?.role ===
            "SUPER_ADMIN" && (
            <p className="text-xs text-muted-foreground">
              Super Admin role cannot
              be changed.
            </p>
          )}
        </div>

        <Button
          className="w-full"
          disabled={loading}
          onClick={submit}
        >
          {loading
            ? mode === "create"
              ? "Creating..."
              : "Saving..."
            : mode === "create"
              ? "Create User"
              : "Save Changes"}
        </Button>
      </CardContent>
    </Card>
  );
}