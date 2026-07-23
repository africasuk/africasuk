"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import type { User } from "@africasuk/types";

import UserForm from "@/components/users/UserForm";

interface Props {
  user: User;
}

export default function EditUserForm({
  user,
}: Props) {
  const router = useRouter();

async function handleSubmit(values: {
  fullName: string;
  email: string;
  phone: string | null;
  role: User["role"];
}) {
    const response = await fetch(
      `/api/users/${user.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify(values),
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
      "User updated successfully."
    );

    router.push("/users");
    router.refresh();
  }

  return (
    <UserForm
      mode="edit"
      initialValues={user}
      onSubmit={handleSubmit}
    />
  );
}