import Link from "next/link";
import { redirect } from "next/navigation";
import Image from "next/image";

import Layout from "@/components/layout/Layout";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function MyRequestsPage() {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/account/requests");
  }

  const { data: requests } = await supabase
    .from("product_requests")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <Layout>
      <div className="container mx-auto max-w-5xl px-4 py-10 antialiased select-none">
        <h1 className="mb-8 text-3xl font-black text-gray-900 tracking-tight uppercase">
          My Product Requests
        </h1>

        <div className="space-y-6">
          {requests && requests.length > 0 ? (
            requests.map((request) => (
              <div
                key={request.id}
                className="rounded-2xl border border-gray-100 bg-white/70 backdrop-blur-md p-6 shadow-2xs transition-all hover:border-gray-200"
              >
                <div className="flex flex-col gap-6 md:flex-row">
                  {/* Product Image Preview */}
                  <div className="relative h-40 w-40 shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
                    <Image
                      src={request.image_url}
                      alt="Requested product"
                      width={160}
                      height={160}
                      className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h2 className="text-base font-bold text-gray-900">
                        {request.phone}
                      </h2>

                      <p className="mt-2 text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">
                        {request.description}
                      </p>
                    </div>

                    {/* Status Sections */}
                    {request.status === "available" ? (
                      <div className="mt-6 rounded-xl border border-emerald-200/80 bg-emerald-50/60 p-5 backdrop-blur-xs">
                        <h3 className="text-base font-extrabold text-[#005c2e] flex items-center gap-2">
                          <span>🎉</span> Your requested product is ready!
                        </h3>

                        <p className="mt-1 text-xs sm:text-sm font-medium text-emerald-800/90">
                          We found the product you requested. Click the button below to place your order.
                        </p>

                        {request.product_link && (
                          <Link
                            href={request.product_link}
                            target="_blank"
                            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-[#002b15] to-[#005c2e] px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-2xs transition-all duration-200 hover:opacity-95 active:scale-98"
                          >
                            <span>🛒</span> Click to Order
                          </Link>
                        )}
                      </div>
                    ) : (
                      <div className="mt-4">
                        <span className="inline-flex items-center rounded-full border border-emerald-100 bg-emerald-50/60 px-3.5 py-1 text-xs font-semibold capitalize text-[#005c2e]">
                          {request.status}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-gray-100 bg-white/50 backdrop-blur-xs p-12 text-center text-sm font-medium text-gray-500">
              You haven&apos;t submitted any product requests yet.
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}