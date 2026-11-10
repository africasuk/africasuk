
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Truck,
  MapPin,
  Wallet,
  Banknote,
  ShieldCheck,
  Clock,
  Info,
  ArrowRight,
} from "lucide-react";
import Container from "@/components/layout/Container";

export const metadata: Metadata = {
  title: "Shipping & Delivery | Africa Suk",
  description:
    "Learn about Africa Suk delivery coverage, payment requirements, and Cash on Delivery availability in Juba and selected areas of South Sudan.",
};

export default function ShippingPage() {
  return (
    <main className="bg-white py-10 sm:py-14">
      <Container>
        <div className="mx-auto max-w-5xl">
          <div className="mb-8">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-[#004d26]">
              Customer Information
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Shipping & Delivery
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-gray-600">
              We are working to make shopping and receiving your orders easier.
              Here is what you need to know about delivery and payment.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-12">
            <div className="space-y-8 lg:col-span-8">
              <section>
                <div className="mb-4 flex items-center gap-3 border-b border-gray-200 pb-3">
                  <MapPin className="h-5 w-5 text-[#004d26]" />
                  <h2 className="text-xl font-bold text-gray-900">
                    Delivery Coverage
                  </h2>
                </div>

                <div className="space-y-4 text-sm leading-7 text-gray-600">
                  <p>
                    Africa Suk currently serves customers in Juba and selected
                    other areas of South Sudan.
                  </p>

                  <div className="border border-gray-200 bg-gray-50 p-5">
                    <h3 className="mb-2 font-semibold text-gray-900">
                      Juba
                    </h3>
                    <p>
                      Customers in Juba can place orders and choose from the
                      available delivery or collection arrangements shown
                      during the ordering process.
                    </p>
                  </div>

                  <div className="border border-gray-200 bg-gray-50 p-5">
                    <h3 className="mb-2 font-semibold text-gray-900">
                      Selected areas outside Juba
                    </h3>
                    <p>
                      We also accept orders from selected areas outside Juba.
                      Payment must be completed in advance before the order
                      is processed.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <div className="mb-4 flex items-center gap-3 border-b border-gray-200 pb-3">
                  <Wallet className="h-5 w-5 text-[#004d26]" />
                  <h2 className="text-xl font-bold text-gray-900">
                    Payment & Cash on Delivery
                  </h2>
                </div>

                <div className="space-y-4 text-sm leading-7 text-gray-600">
                  <p>
                    Payment options depend on your delivery location and order
                    value.
                  </p>

                  <div className="border border-gray-200 p-5">
                    <div className="mb-3 flex items-center gap-2">
                      <Banknote className="h-5 w-5 text-[#004d26]" />
                      <h3 className="font-semibold text-gray-900">
                        Cash on Delivery in Juba
                      </h3>
                    </div>
                    <p>
                      Cash on Delivery is available for eligible orders in
                      Juba with a total value below:
                    </p>
                    <p className="my-3 text-2xl font-bold text-[#004d26]">
                      400,000 SSP
                    </p>
                    <p>
                      This is approximately USD 50. The applicable limit is
                      based on the order value in SSP.
                    </p>
                  </div>

                  <div className="border border-gray-200 p-5">
                    <h3 className="mb-2 font-semibold text-gray-900">
                      Orders of 400,000 SSP or more
                    </h3>
                    <p>
                      Orders in Juba valued at 400,000 SSP or more require
                      advance payment. Cash on Delivery is not available for
                      these orders.
                    </p>
                  </div>

                  <div className="border border-gray-200 p-5">
                    <h3 className="mb-2 font-semibold text-gray-900">
                      Orders outside Juba
                    </h3>
                    <p>
                      For deliveries to selected areas outside Juba, customers
                      must complete payment in advance before their orders are
                      processed.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <div className="mb-4 flex items-center gap-3 border-b border-gray-200 pb-3">
                  <Truck className="h-5 w-5 text-[#004d26]" />
                  <h2 className="text-xl font-bold text-gray-900">
                    Delivery Arrangements
                  </h2>
                </div>
                <p className="text-sm leading-7 text-gray-600">
                  Available delivery and collection arrangements may vary
                  depending on your location and the order. Please check the
                  options provided during checkout or contact our support team
                  if you need assistance.
                </p>
              </section>

              <section>
                <div className="mb-4 flex items-center gap-3 border-b border-gray-200 pb-3">
                  <ShieldCheck className="h-5 w-5 text-[#004d26]" />
                  <h2 className="text-xl font-bold text-gray-900">
                    Important Information
                  </h2>
                </div>
                <ul className="list-disc space-y-2 pl-5 text-sm leading-7 text-gray-600">
                  <li>
                    Confirm your delivery location and contact details when
                    placing an order.
                  </li>
                  <li>
                    Advance payment is required where Cash on Delivery is not
                    available.
                  </li>
                  <li>
                    Delivery availability depends on the location and the
                    arrangements available for your order.
                  </li>
                  <li>
                    Our team may contact you to confirm your order and delivery
                    details.
                  </li>
                </ul>
              </section>

              <section className="border border-gray-200 bg-gray-50 p-5 sm:p-6">
                <div className="flex items-start gap-3">
                  <Info className="mt-1 h-5 w-5 shrink-0 text-[#004d26]" />
                  <div>
                    <h2 className="font-bold text-gray-900">
                      Need help with your delivery?
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-gray-600">
                      Contact our support team for help confirming delivery
                      availability or payment arrangements for your location.
                    </p>
                    <Link
                      href="/contact"
                      className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#004d26] hover:underline"
                    >
                      Contact Support
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </section>
            </div>

            <aside className="lg:col-span-4">
              <div className="border border-gray-300 bg-gray-50 p-6 lg:sticky lg:top-6">
                <div className="mb-5 flex justify-center">
                  <Image
                    src="/icon.png"
                    alt="Africa Suk"
                    width={72}
                    height={72}
                    className="h-16 w-16 object-contain"
                  />
                </div>

                <h2 className="text-center text-lg font-bold text-gray-900">
                  Delivery at a Glance
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                  Quick guide to our delivery and payment rules.
                </p>

                <div className="mt-6 divide-y divide-gray-200 border-y border-gray-200">
                  <div className="py-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                      Main service area
                    </p>
                    <p className="mt-1 font-semibold text-gray-900">
                      Juba, South Sudan
                    </p>
                  </div>

                  <div className="py-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                      Other locations
                    </p>
                    <p className="mt-1 font-semibold text-gray-900">
                      Selected areas
                    </p>
                  </div>

                  <div className="py-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                      Juba COD limit
                    </p>
                    <p className="mt-1 font-semibold text-[#004d26]">
                      Below 400,000 SSP
                    </p>
                  </div>

                  <div className="py-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                      Outside Juba
                    </p>
                    <p className="mt-1 font-semibold text-gray-900">
                      Advance payment
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex items-start gap-2 text-xs leading-5 text-gray-500">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0" />
                  <p>
                    Delivery arrangements are confirmed based on your location
                    and order.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </Container>
    </main>
  );
}
