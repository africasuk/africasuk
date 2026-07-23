"use client";

import Link from "next/link";
import {
  CreditCard,
  Landmark,
  Smartphone,
  Wallet,
  Plus,
  Pencil,
} from "lucide-react";

export type PaymentType =
  | "CARD"
  | "MOBILE_MONEY"
  | "BANK"
  | "WALLET";

export interface PaymentMethod {
  id: string;
  type: PaymentType;
  provider: string;
  label: string;
  isDefault: boolean;
}

interface Props {
  methods: PaymentMethod[];
}

function PaymentIcon({
  type,
}: {
  type: PaymentType;
}) {
  switch (type) {
    case "CARD":
      return (
        <CreditCard className="h-6 w-6 text-[#004d26]" />
      );

    case "BANK":
      return (
        <Landmark className="h-6 w-6 text-[#004d26]" />
      );

    case "MOBILE_MONEY":
      return (
        <Smartphone className="h-6 w-6 text-[#004d26]" />
      );

    default:
      return (
        <Wallet className="h-6 w-6 text-[#004d26]" />
      );
  }
}

export default function PaymentMethods({
  methods,
}: Props) {
  return (
    <section className="rounded-3xl border bg-card p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">
            Payment Methods
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage how you pay for orders.
          </p>
        </div>

        <Link
          href="/account/payments/new"
          className="inline-flex items-center gap-2 rounded-xl bg-[#004d26] px-4 py-2 text-sm font-semibold text-white hover:bg-[#003b1d]"
        >
          <Plus className="h-4 w-4" />
          Add Payment
        </Link>
      </div>

      {methods.length === 0 ? (
        <div className="rounded-2xl border border-dashed py-12 text-center">
          <Wallet className="mx-auto h-12 w-12 text-muted-foreground" />

          <h3 className="mt-4 text-lg font-semibold">
            No payment methods
          </h3>

          <p className="mt-2 text-sm text-muted-foreground">
            Add a payment method for faster checkout.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {methods.map((method) => (
            <div
              key={method.id}
              className="rounded-2xl border p-5"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <PaymentIcon type={method.type} />

                  <div>
                    <h3 className="font-semibold">
                      {method.provider}
                    </h3>

                    <p className="text-sm text-muted-foreground">
                      {method.label}
                    </p>
                  </div>
                </div>

                {method.isDefault && (
                  <span className="rounded-full bg-[#004d26]/10 px-2 py-1 text-xs font-semibold text-[#004d26]">
                    Default
                  </span>
                )}
              </div>

              <div className="mt-5">
                <Link
                  href={`/account/payments/${method.id}`}
                  className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted"
                >
                  <Pencil className="h-4 w-4" />
                  Manage
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}