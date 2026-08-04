import Link from "next/link";
import { redirect } from "next/navigation";
import { PackageSearch, ChevronRight, Plus } from "lucide-react";

import {
  AddressRepository,
  ProfileRepository,
} from "@africasuk/database";

import { AddressService } from "@africasuk/api";

import { createClient } from "@/lib/auth/server";

import ProfileSection from "@/components/profile/ProfileSection";
import SavedAddresses from "@/components/profile/SavedAddresses";
import SecurityCenter from "@/components/profile/SecurityCenter";
import { buttonVariants } from "@/components/ui/button";

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const profile = await ProfileRepository.getByUserId(
    supabase,
    user.id
  );

  if (!profile) {
    return (
      <main className="mx-auto max-w-7xl p-6">
        <div className="rounded-3xl border p-10 text-center">
          <h1 className="text-2xl font-bold">
            Profile not found
          </h1>

          <p className="mt-2 text-muted-foreground">
            We couldn&apos;t find your profile.
          </p>
        </div>
      </main>
    );
  }

  const addressService = new AddressService(
    new AddressRepository(supabase)
  );

  const addresses = await addressService.getAll(user.id);

  return (
    <main className="mx-auto max-w-7xl space-y-8 p-6 lg:p-10">
      <ProfileSection profile={profile} />

      {/* Product Requests Quick Action Banner */}
      <section className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl sm:rounded-3xl border border-gray-200 bg-linear-to-r from-[#004d26]/5 via-white to-white p-5 sm:p-6 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-2xl bg-[#004d26] text-white shadow-xs">
            <PackageSearch className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-gray-900">
              Product Requests
            </h2>
            <p className="text-xs sm:text-sm text-gray-500">
              Can&apos;t find a product? Request customized sourcing or track your active inquiries.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0 pt-2 sm:pt-0">
          <Link
            href="/account/requests"
            className={buttonVariants({
              variant: "outline",
              size: "sm",
              className:
                "flex-1 sm:flex-none justify-center rounded-full border-gray-200 font-semibold text-gray-700 hover:border-gray-300 hover:bg-gray-50",
            })}
          >
            <span>My Requests</span>
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>

          <Link
            href="/request-product"
            className={buttonVariants({
              size: "sm",
              className:
                "flex-1 sm:flex-none justify-center gap-1.5 rounded-full bg-[#004d26] font-bold text-white hover:bg-[#004d26]/90",
            })}
          >
            <Plus className="h-4 w-4" />
            <span>New Request</span>
          </Link>
        </div>
      </section>

      <SavedAddresses addresses={addresses} />

      <SecurityCenter devices={[]} />
    </main>
  );
}