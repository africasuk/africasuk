"use client";

import { useMemo, useState } from "react";
import type { User } from "@africasuk/types";

import UserActions from "./UserActions";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  users: User[];
}

type RoleFilter =
  | "ALL"
  | "CUSTOMER"
  | "STAFF"
  | "ADMIN"
  | "SUPER_ADMIN";

export default function UserTable({ users }: Props) {
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<RoleFilter>("ALL");

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        !query ||
        (user.fullName?.toLowerCase().includes(query) ?? false) ||
        user.email.toLowerCase().includes(query);

      const matchesRole =
        role === "ALL" || user.role === role;

      return matchesSearch && matchesRole;
    });
  }, [users, search, role]);

  return (
    <div className="space-y-4">
      {/* Search & Filter */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          placeholder="Search users by name or email..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="sm:max-w-sm"
        />

        <Select
          value={role}
          onValueChange={(value) =>
            setRole(value as RoleFilter)
          }
        >
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="ALL">
              All Roles
            </SelectItem>

            <SelectItem value="CUSTOMER">
              Customer
            </SelectItem>

            <SelectItem value="STAFF">
              Staff
            </SelectItem>

            <SelectItem value="ADMIN">
              Admin
            </SelectItem>

            <SelectItem value="SUPER_ADMIN">
              Super Admin
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Users Table */}
      <div className="rounded-xl border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>

              <TableHead>Email</TableHead>

              <TableHead>Role</TableHead>

              <TableHead>Status</TableHead>

              <TableHead className="w-20 text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    {user.fullName || "-"}
                  </TableCell>

                  <TableCell>
                    {user.email}
                  </TableCell>

                  <TableCell>
                    {user.role}
                  </TableCell>

                  <TableCell>
                    {user.isActive
                      ? "Active"
                      : "Inactive"}
                  </TableCell>

                  <TableCell className="text-right">
                    <UserActions user={user} />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-24 text-center text-muted-foreground"
                >
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}