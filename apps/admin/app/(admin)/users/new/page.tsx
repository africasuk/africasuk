import { redirect } from "next/navigation";

import { requirePermission } from "@/lib/auth/guards";
import { Permissions } from "@/lib/auth/permissions";

import PageHeader from "@/components/shared/PageHeader";
import UserForm from "./UserForm";

export default async function NewUserPage() {
  const { profile } =
    await requirePermission(
      Permissions.USERS_VIEW
    );

  if (profile.role !== "SUPER_ADMIN") {
    redirect("/unauthorized");
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <PageHeader
        title="Create User"
        description="Create a new administrator, manager, or staff account."
      />

      <UserForm />
    </div>
  );
}