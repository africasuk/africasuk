import Link from "next/link";
import { redirect } from "next/navigation";
import { ClipboardList } from "lucide-react";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { RequestProductForm } from "@/components/request-product/RequestProductForm";
import Layout from "@/components/layout/Layout";
import { buttonVariants } from "@/components/ui/button";

export default async function RequestProductPage() {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?redirect=/request-product");
  }

  return (
    <Layout>
      <section className="relative overflow-hidden bg-linear-to-b from-[#f8faf8] to-white py-12 sm:py-20">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6">
          {/* Header Actions */}
          <div className="mb-6 flex justify-end">
            <Link
              href="/account/requests"
              className={buttonVariants({
                variant: "outline",
                size: "sm",
                className:
                  "gap-2 rounded-full border-gray-200 bg-white font-semibold text-gray-700 hover:border-[#004d26] hover:bg-[#004d26]/5 hover:text-[#004d26]",
              })}
            >
              <ClipboardList className="h-4 w-4 text-[#004d26]" />
              <span>My Requests</span>
            </Link>
          </div>

          <div className="mx-auto mb-10 max-w-2xl text-center">
            <span className="inline-flex rounded-full bg-[#004d26]/10 px-4 py-1 text-xs font-bold uppercase tracking-widest text-[#004d26]">
              Product Request
            </span>

            <h1 className="mt-5 text-4xl font-black tracking-tight text-gray-900 sm:text-5xl">
              Can&apos;t Find a Product?
            </h1>

            <p className="mt-4 text-base leading-7 text-gray-600">
              Upload a photo, tell us what you need, and our sourcing team
              will help you find it.
            </p>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-xl sm:p-10">
            <RequestProductForm />
          </div>
        </div>
      </section>
    </Layout>
  );
}