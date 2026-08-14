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
      <main className="mx-auto max-w-7xl 2xl:max-w-[1600px] px-4 sm:px-6 lg:px-8 py-12 select-none antialiased">
        <div className="border border-gray-200 bg-white p-8 sm:p-12 text-center shadow-none">
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-gray-900">
            Profile not found
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-gray-500 font-normal">
            We couldn&apos;t find your profile. Please contact support if this issue persists.
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
    <main className="mx-auto max-w-7xl 2xl:max-w-[1600px] px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-8 select-none antialiased">
      {/* 1. Primary Profile Overview */}
      <ProfileSection profile={profile} />

      {/* 2. Product Requests Action Banner */}
      <section className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-gray-200 bg-gradient-to-r from-emerald-50/50 via-stone-50/30 to-white p-4 sm:p-6 shadow-none">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-[#004d26] text-white border border-[#004d26]">
            <PackageSearch className="h-5 w-5 stroke-[1.5]" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-semibold tracking-tight text-gray-900">
              Product Requests
            </h2>
            <p className="text-xs text-gray-500 font-normal mt-0.5 leading-relaxed">
              Can&apos;t find a specific product? Request custom continent-wide sourcing or track active inquiries.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 pt-2 sm:pt-0">
          <Link
            href="/account/requests"
            className={buttonVariants({
              variant: "outline",
              size: "sm",
              className:
                "flex-1 sm:flex-none justify-center rounded-none border-gray-300 bg-white font-medium text-xs uppercase tracking-wider text-gray-700 hover:bg-gray-50 hover:border-gray-400 hover:text-gray-900 transition-colors shadow-none",
            })}
          >
            <span>My Requests</span>
            <ChevronRight className="ml-1 h-3.5 w-3.5 stroke-[1.5]" />
          </Link>

          <Link
            href="/request-product"
            className={buttonVariants({
              size: "sm",
              className:
                "flex-1 sm:flex-none justify-center gap-1.5 rounded-none bg-[#004d26] font-medium text-xs uppercase tracking-wider text-white hover:bg-[#00361a] transition-colors shadow-none",
            })}
          >
            <Plus className="h-3.5 w-3.5 stroke-[1.5]" />
            <span>New Request</span>
          </Link>
        </div>
      </section>

      {/* 3. Saved Addresses Section */}
      <SavedAddresses addresses={addresses} />

      {/* 4. Security Center */}
      <SecurityCenter devices={[]} />
    </main>
  );
}