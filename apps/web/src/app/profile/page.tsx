import { redirect } from "next/navigation";

import {
  AddressRepository,
  ProfileRepository,
} from "@africasuk/database";

import { AddressService } from "@africasuk/api";

import { createClient } from "@/lib/auth/server";

import ProfileSection from "@/components/profile/ProfileSection";
import SavedAddresses from "@/components/profile/SavedAddresses";
import SecurityCenter from "@/components/profile/SecurityCenter";

export default async function ProfilePage() {
  const supabase =
    await createClient();

  const {
    data: { user },
  } =
    await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const profile =
    await ProfileRepository.getByUserId(
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

  const addressService =
    new AddressService(
      new AddressRepository(
        supabase
      )
    );

  const addresses =
    await addressService.getAll(
      user.id
    );

  return (
    <main className="mx-auto max-w-7xl space-y-8 p-6 lg:p-10">
      <ProfileSection
        profile={profile}
      />



      <SavedAddresses
        addresses={addresses}
      />



      <SecurityCenter
        devices={[]}
      />
    </main>
  );
}