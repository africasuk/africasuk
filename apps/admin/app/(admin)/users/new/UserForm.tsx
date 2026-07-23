"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Role = "ADMIN" | "MANAGER" | "STAFF";

export default function UserForm() {
  const [loading, setLoading] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] =
    useState<Role>("STAFF");

  async function createUser() {
    if (!fullName.trim()) {
      toast.error("Full name is required.");
      return;
    }

    if (!email.trim()) {
      toast.error("Email is required.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "/api/users",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            fullName,
            email,
            phone: phone || null,
            role,
          }),
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        toast.error(
          result.message ??
            "Failed to create user."
        );
        return;
      }

      toast.success(
        "User created successfully."
      );

      setFullName("");
      setEmail("");
      setPhone("");
      setRole("STAFF");
    } catch (error) {
      console.error(error);

      toast.error(
        "Something went wrong."
      );
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
              setFullName(e.target.value)
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
            onChange={(e) =>
              setEmail(e.target.value)
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
              setPhone(e.target.value)
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
            onChange={(e) =>
              setRole(
                e.target.value as Role
              )
            }
            className="w-full rounded-md border bg-background px-3 py-2"
          >
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
        </div>

        <Button
          onClick={createUser}
          disabled={loading}
          className="w-full"
        >
          {loading
            ? "Creating..."
            : "Create User"}
        </Button>
      </CardContent>
    </Card>
  );
}