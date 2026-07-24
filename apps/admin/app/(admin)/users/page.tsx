import { UserRepository } from "@africasuk/database";
import { UserService } from "@africasuk/api";

import { createAdminSupabaseClient } from "@/lib/supabase/admin";

import PageHeader from "@/components/shared/PageHeader";
import UserTable from "@/components/users/UserTable";

async function getUsers() {
  const supabase = createAdminSupabaseClient();

  const repository = new UserRepository(supabase);
  const service = new UserService(repository);

  return service.getAll();
}

export default async function UsersPage() {
  const users = await getUsers();

  return (
    <div className="space-y-8">
      <PageHeader
        title="Users"
        description="Manage administrators and staff."
        actions={[
          {
            label: "New User",
            href: "/users/new",
          },
        ]}
      />

      <UserTable users={users} />
    </div>
  );
}