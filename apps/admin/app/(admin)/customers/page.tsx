
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import PageHeader from "@/components/shared/PageHeader";
import CustomersTable from "@/components/customers/CustomersTable";

export default async function CustomersPage() {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const [profilesResult, ordersResult] = await Promise.all([
    supabase
      .from("profiles")
      .select(
        "id, user_id, full_name, email, phone, avatar_url, role, created_at"
      )
      .order("created_at", { ascending: false }),

    supabase
      .from("orders")
      .select(`
        id,
        user_id,
        order_number,
        status,
        total,
        currency,
        customer_name,
        customer_email,
        customer_phone,
        created_at,
        order_items (
          id,
          name,
          image,
          quantity,
          price
        )
      `)
      .order("created_at", { ascending: false }),
  ]);

  if (profilesResult.error) {
    throw new Error(profilesResult.error.message);
  }

  if (ordersResult.error) {
    throw new Error(ordersResult.error.message);
  }

  const profiles = (profilesResult.data ?? []).filter(
    (profile) => profile.role?.toLowerCase() === "customer"
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customers"
        description="View customers, manage relationships, and track purchase history."
      />

      <CustomersTable
        profiles={profiles}
        orders={ordersResult.data ?? []}
      />
    </div>
  );
}
