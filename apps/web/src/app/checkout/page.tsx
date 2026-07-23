import { redirect } from "next/navigation";

import {
  AddressRepository,
  ProfileRepository,
} from "@africasuk/database";

import { AddressService } from "@africasuk/api";

import { createClient } from "@/lib/auth/server";

import Layout from "@/components/layout/Layout";
import Container from "@/components/layout/Container";

import CheckoutHeader from "@/components/checkout/CheckoutHeader";
import CheckoutItems from "@/components/checkout/CheckoutItems";
import CheckoutSummary from "@/components/checkout/CheckoutSummary";
import CheckoutAddresses from "@/components/checkout/CheckoutAddresses";
import { CheckoutProvider } from "@/components/checkout/CheckoutContext";
import CheckoutPaymentWrapper from "@/components/checkout/CheckoutPaymentWrapper";

export default async function CheckoutPage() {
  const supabase =
    await createClient();

  const {
    data: { user },
  } =
    await supabase.auth.getUser();

  if (!user) {
    redirect(
      "/auth/login?redirect=/checkout",
    );
  }

  const addressRepository =
    new AddressRepository(
      supabase,
    );

  const addressService =
    new AddressService(
      addressRepository,
    );

  const addresses =
    await addressService.getAll(
      user.id,
    );

  const profile =
    await ProfileRepository.getByUserId(
      supabase,
      user.id,
    );
  return (
    <Layout>
      <section className="min-h-screen bg-[#f4f4f4] py-8 antialiased selection:bg-[#004d26]/10 lg:py-12">
        <Container>
          <div className="mx-auto max-w-7xl">
            <CheckoutProvider>
              <div className="mb-6 rounded-xl border border-neutral-100/80 bg-white p-4 shadow-xs sm:p-6">
                <CheckoutHeader />
              </div>

              <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1fr_360px] lg:gap-8 xl:grid-cols-[1fr_380px]">
                <div className="order-1 min-w-0 space-y-6 sm:space-y-8 lg:order-1">
                  <CheckoutItems />

                  <CheckoutAddresses
                    initialAddresses={
                      addresses
                    }
                  />
                </div>

                <div className="order-2 w-full space-y-6 lg:sticky lg:top-24 lg:order-2">
                  <CheckoutPaymentWrapper />

                  <CheckoutSummary
                    profile={profile}
                  />
                </div>
              </div>
            </CheckoutProvider>
          </div>
        </Container>
      </section>
    </Layout>
  );
}