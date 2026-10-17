"use client";

import { useCheckout } from "./CheckoutContext";
import type { FulfillmentMethod } from "@africasuk/types";

const options: {
  value: FulfillmentMethod;
  title: string;
  description: string;
  feeLabel: string;
}[] = [
  {
    value: "PICKUP",
    title: "Office Pickup",
    description: "Collect your order from our pickup point.",
    feeLabel: "FREE",
  },
  {
    value: "DELIVERY",
    title: "Home Delivery",
    description:
      "Delivery fee will be added by our team based on the delivery distance.",
    feeLabel: "PAID",
  },
];

export default function CheckoutFulfillment() {
  const { fulfillmentMethod, setFulfillmentMethod } = useCheckout();

  return (
    <section className="rounded-xl border border-neutral-200 bg-white p-5">
      <h2 className="text-lg font-semibold text-neutral-900">
        Delivery Method
      </h2>

      <p className="mt-1 text-sm text-neutral-500">
        Choose how you would like to receive your order.
      </p>

      <div className="mt-4 space-y-3">
        {options.map((option) => {
          const selected = fulfillmentMethod === option.value;
          const isPickup = option.value === "PICKUP";

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => setFulfillmentMethod(option.value)}
              aria-pressed={selected}
              className={`flex w-full items-start gap-3 rounded-lg border p-4 text-left transition ${
                selected
                  ? "border-[#006b35] bg-[#006b35]/5 ring-1 ring-[#006b35]"
                  : "border-neutral-200 hover:border-neutral-400"
              }`}
            >
              <span
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                  selected
                    ? "border-[#006b35]"
                    : "border-neutral-400"
                }`}
              >
                {selected && (
                  <span className="h-2.5 w-2.5 rounded-full bg-[#006b35]" />
                )}
              </span>

              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-semibold text-neutral-900">
                    {option.title}
                  </span>

                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      isPickup
                        ? "bg-green-100 text-green-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {option.feeLabel}
                  </span>
                </span>

                <span className="mt-1 block text-sm text-neutral-600">
                  {option.description}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}