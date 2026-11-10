
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Banknote,
  Wallet,
  Smartphone,
  Building2,
  ShieldCheck,
  Info,
  ArrowRight,
} from "lucide-react";
import Container from "@/components/layout/Container";

export const metadata: Metadata = {
  title: "Payment Information | Africa Suk",
  description:
    "Learn about accepted payment methods, Cash on Delivery, and advance payment requirements when shopping with Africa Suk.",
};

export default function PaymentInformationPage() {
  return (
    <main className="bg-white py-10 sm:py-14">
      <Container>
        <div className="mx-auto max-w-5xl">
          <div className="mb-8">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-[#004d26]">
              Customer Information
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Payment Information
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-gray-600">
              Find out how you can pay for your orders and which payment
              options are currently available.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-12">
            <div className="space-y-8 lg:col-span-8">
              <section>
                <div className="mb-4 flex items-center gap-3 border-b border-gray-200 pb-3">
                  <Wallet className="h-5 w-5 text-[#004d26]" />
                  <h2 className="text-xl font-bold text-gray-900">
                    Available Payment Methods
                  </h2>
                </div>

                <div className="space-y-4">
                  <div className="border border-gray-200 p-5">
                    <div className="flex items-center gap-3">
                      <Banknote className="h-6 w-6 text-[#004d26]" />
                      <h3 className="font-semibold text-gray-900">
                        Cash Payment
                      </h3>
                    </div>
                    <p className="mt-3 text-sm leading-7 text-gray-600">
                      Cash is currently our available payment method.
                      Customers can pay through eligible Cash on Delivery
                      orders in Juba or follow the advance payment instructions
                      provided by our team.
                    </p>
                  </div>

                  <div className="border border-gray-200 p-5">
                    <div className="flex items-center gap-3">
                      <Building2 className="h-6 w-6 text-gray-500" />
                      <h3 className="font-semibold text-gray-900">
                        Bank Transfer
                      </h3>
                    </div>
                    <p className="mt-2 text-sm text-gray-600">
                      Bank transfer is planned but is not currently available.
                    </p>
                    <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Coming soon
                    </p>
                  </div>

                  <div className="border border-gray-200 p-5">
                    <div className="flex items-center gap-3">
                      <Smartphone className="h-6 w-6 text-gray-500" />
                      <h3 className="font-semibold text-gray-900">
                        Mobile Money
                      </h3>
                    </div>
                    <p className="mt-2 text-sm text-gray-600">
                      Mobile money payments are planned for the future and are
                      not currently available.
                    </p>
                    <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Coming soon
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <div className="mb-4 flex items-center gap-3 border-b border-gray-200 pb-3">
                  <Banknote className="h-5 w-5 text-[#004d26]" />
                  <h2 className="text-xl font-bold text-gray-900">
                    Cash on Delivery
                  </h2>
                </div>

                <div className="border border-gray-200 bg-gray-50 p-5">
                  <p className="text-sm leading-7 text-gray-600">
                    Customers in Juba can pay when their orders are delivered,
                    provided the order value is below:
                  </p>
                  <p className="my-3 text-2xl font-bold text-[#004d26]">
                    400,000 SSP
                  </p>
                  <p className="text-sm leading-7 text-gray-600">
                    This is approximately USD 50. Orders valued at 400,000 SSP
                    or more require advance payment.
                  </p>
                </div>
              </section>

              <section>
                <div className="mb-4 flex items-center gap-3 border-b border-gray-200 pb-3">
                  <Building2 className="h-5 w-5 text-[#004d26]" />
                  <h2 className="text-xl font-bold text-gray-900">
                    Advance Payments
                  </h2>
                </div>

                <div className="space-y-3 text-sm leading-7 text-gray-600">
                  <p>
                    Advance payment is required for:
                  </p>
                  <ul className="list-disc space-y-2 pl-5">
                    <li>
                      Orders in Juba valued at 400,000 SSP or more.
                    </li>
                    <li>
                      Orders delivered to selected areas outside Juba.
                    </li>
                  </ul>
                  <p>
                    Customers can make cash payments at an Africa Suk payment
                    point or follow the payment instructions provided by our
                    team after order confirmation.
                  </p>
                  <p>
                    Please wait for confirmation and payment instructions
                    before making an advance payment.
                  </p>
                </div>
              </section>

              <section>
                <div className="mb-4 flex items-center gap-3 border-b border-gray-200 pb-3">
                  <ShieldCheck className="h-5 w-5 text-[#004d26]" />
                  <h2 className="text-xl font-bold text-gray-900">
                    Payment Safety
                  </h2>
                </div>
                <ul className="list-disc space-y-2 pl-5 text-sm leading-7 text-gray-600">
                  <li>
                    Always confirm payment instructions with the Africa Suk
                    team.
                  </li>
                  <li>
                    Keep your payment receipt or proof of payment.
                  </li>
                  <li>
                    Do not send money to an account or payment contact that
                    has not been confirmed by our team.
                  </li>
                  <li>
                    Contact support if you need help confirming a payment.
                  </li>
                </ul>
              </section>

              <section className="border border-gray-200 bg-gray-50 p-5 sm:p-6">
                <div className="flex items-start gap-3">
                  <Info className="mt-1 h-5 w-5 shrink-0 text-[#004d26]" />
                  <div>
                    <h2 className="font-bold text-gray-900">
                      Have a payment question?
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-gray-600">
                      Our support team can help you confirm payment methods
                      and instructions for your order.
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
                  Payment at a Glance
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                  Simple payment options for your orders.
                </p>

                <div className="mt-6 divide-y divide-gray-200 border-y border-gray-200">
                  <div className="py-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                      Current payment method
                    </p>
                    <p className="mt-1 font-semibold text-gray-900">
                      Cash
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
                      Larger orders
                    </p>
                    <p className="mt-1 font-semibold text-gray-900">
                      Advance payment
                    </p>
                  </div>

                  <div className="py-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                      Future options
                    </p>
                    <p className="mt-1 font-semibold text-gray-900">
                      Bank transfer & Mobile Money
                    </p>
                  </div>
                </div>

                <p className="mt-5 text-xs leading-5 text-gray-500">
                  Payment options depend on your order value and delivery
                  location.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </Container>
    </main>
  );
}
