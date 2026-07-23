import { notFound } from "next/navigation";

import { UserRepository } from "@africasuk/database";
import { UserService } from "@africasuk/api";

import { createAdminSupabaseClient } from "@/lib/supabase/admin";

import PageHeader from "@/components/shared/PageHeader";

import EditUserForm from "./EditUserForm";

async function getUser(id: string) {
  const supabase =
    createAdminSupabaseClient();

  const repository =
    new UserRepository(supabase);

  const service =
    new UserService(repository);

  try {
    return await service.getById(id);
  } catch {
    return null;
  }
}

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditUserPage({
  params,
}: PageProps) {
  const { id } = await params;

  const user =
    await getUser(id);

  if (!user) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <PageHeader
        title="Edit User"
        description="Update user information."
      />

      <EditUserForm user={user} />
    </div>
  );
}