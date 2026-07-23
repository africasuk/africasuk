import { ProductRequestTable } from "@/components/product-requests/ProductRequestTable";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function ProductRequestsPage() {
  const supabase = await createServerSupabaseClient();

  const { data: requests, error } = await supabase
    .from("product_requests")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Product Requests
        </h1>

        <p className="text-muted-foreground">
          Manage customer product requests.
        </p>
      </div>

      <ProductRequestTable data={requests ?? []} />
    </div>
  );
}