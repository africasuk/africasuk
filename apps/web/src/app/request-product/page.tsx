import { redirect } from "next/navigation";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { RequestProductForm } from "@/components/request-product/RequestProductForm";
import Layout from "@/components/layout/Layout";

export default async function RequestProductPage() {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?redirect=/request-product");
  }

  return (
    <Layout >
    <div className="container mx-auto max-w-4xl px-4 sm:px-6 py-10 sm:py-16 select-none antialiased">
      {/* Header & Hero Text */}
      <div className="mb-8 sm:mb-12 text-center max-w-2xl mx-auto space-y-3">


        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight uppercase">
          Request a Product
        </h1>

        <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-medium">
          Can&apos;t find the product you&apos;re looking for? Upload a photo and tell us
          what you&apos;re looking for, and our team will try to source it.
        </p>
      </div>

      {/* Form Container */}
      <div className="rounded-3xl border border-gray-100 bg-white/70 backdrop-blur-md p-6 sm:p-10 shadow-2xs transition-all">
        <RequestProductForm />
      </div>
    </div>

    </Layout>
  );
}