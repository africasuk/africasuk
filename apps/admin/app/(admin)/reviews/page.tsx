import { ReviewRepository } from "@africasuk/database";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

import PageHeader from "@/components/shared/PageHeader";
import { ReviewTable } from "@/components/reviews/ReviewTable";

export default async function ReviewsPage() {
  const supabase = createAdminSupabaseClient();

  const repository = new ReviewRepository(supabase);

  const reviews = await repository.findAll();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reviews"
        description="Manage customer product reviews."
      />

      <ReviewTable reviews={reviews} />
    </div>
  );
}