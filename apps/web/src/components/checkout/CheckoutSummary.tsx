"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CreditCard,
  Loader2,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useCart } from "@/store/cart";
import { Price } from "@/components/currency/Price";


import AddAddressDialog from "./AddAddressDialog";
import { useCheckout } from "./CheckoutContext";
import type { Profile } from "@africasuk/types";
import CheckoutContactDialog from "./CheckoutContactDialog";
import { placeOrder } from "@/actions/order";
import { useCurrency } from "providers/CurrencyProvider";

interface CheckoutSummaryProps {
  profile: Profile;
}

export default function CheckoutSummary({
  profile,
}: CheckoutSummaryProps) {
  const [placingOrder, setPlacingOrder] = useState(false);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);

  const router = useRouter();
  const { currency } = useCurrency();

  const {
    paymentMethod,
    selectedAddress,
  } = useCheckout();

  const items = useCart((state) => state.items);
  const clear = useCart((state) => state.clear);

  const hasAddress = selectedAddress !== null;

  const totalItems = items.reduce(
    (sum, item) => sum + Number(item.quantity),
    0,
  );

  const subtotal = items.reduce(
    (sum, item) =>
      sum + Number(item.price) * Number(item.quantity),
    0,
  );

  const shipping = 0;
  const tax = 0;
  const total = subtotal + shipping + tax;

  async function handlePlaceOrder() {
    if (!selectedAddress) {
      toast.error("Please add or select a delivery address.");
      return;
    }

    if (!profile.fullName?.trim()) {
      setContactDialogOpen(true);
      return;
    }

    const phone = profile.phone?.trim() ?? "";

    if (!phone) {
      setContactDialogOpen(true);
      return;
    }

    const phoneRegex = /^\+?[0-9]{6,15}$/;

    if (!phoneRegex.test(phone)) {
      setContactDialogOpen(true);
      return;
    }

    if (!selectedAddress.street?.trim()) {
      toast.error("Please enter your street address.");
      return;
    }

    if (!selectedAddress.city?.trim()) {
      toast.error("Please enter your city.");
      return;
    }

    if (!selectedAddress.country?.trim()) {
      toast.error("Please enter your country.");
      return;
    }

    try {
      setPlacingOrder(true);

 const result = await placeOrder({
  customer: {
    name: profile.fullName,
    email: profile.email,
    phone: profile.phone ?? undefined,
    country: selectedAddress.country,
    state: selectedAddress.state ?? undefined,
    city: selectedAddress.city,
    address: selectedAddress.street,
    postalCode: selectedAddress.postalCode ?? undefined,
  },
  items: items.map((item) => ({
    productId: item.productId,
    variantId: item.variantId,
    quantity: item.quantity,
  })),
  paymentMethod,
  currency,
});

clear();

if (paymentMethod === "COD") {
  toast.success("Order placed successfully.");

  router.push(
    `/account/orders/${result.order.orderNumber}`,
  );
} else {
  router.push(
    `/payment/${result.payment.referenceId}`,
  );
}
    } catch (error) {
      console.error(error);

      toast.error(
        error instanceof Error ? error.message : "Failed to place order.",
      );
    } finally {
      setPlacingOrder(false);
    }
  }

  return (
    <div className="sticky top-24 rounded-xl border border-neutral-100/80 bg-white p-4 antialiased sm:p-5">
      <div className="mb-4 flex items-center justify-between border-b border-neutral-100 pb-3">
        <div className="flex items-center gap-2">
          <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-xs font-bold text-[#004d26]">
            04
          </span>

          <h2 className="text-sm font-bold uppercase tracking-tight text-neutral-900">
            Order Summary
          </h2>
        </div>

        <span className="text-[10px] font-bold tracking-wide text-neutral-400">
          {totalItems} {totalItems === 1 ? "item" : "items"}
        </span>
      </div>

      <div className="space-y-3 text-xs font-medium text-neutral-500 sm:text-sm">
        <div className="flex justify-between items-center">
          <span>Subtotal</span>
          <div className="text-neutral-800">
            <Price price={subtotal} />
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span>Shipping</span>
          <span className="text-[11px] font-bold uppercase tracking-wide text-emerald-600">
            Free
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span>Estimated Tax</span>
          <div className="text-neutral-800">
            <Price price={tax} />
          </div>
        </div>

        <div className="flex justify-between items-center pt-0.5">
          <span>Payment Method</span>
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-neutral-700">
            {paymentMethod === "COD" ? (
              <>
                <Wallet className="h-3 w-3 text-neutral-400" />
                Cash on Delivery
              </>
            ) : (
              <>
                <CreditCard className="h-3 w-3 text-neutral-400" />
                Online Payment
              </>
            )}
          </span>
        </div>

        <div className="mt-2 border-t border-neutral-100 pt-3.5">
          <div className="flex items-baseline justify-between text-neutral-950">
            <span className="text-xs font-bold">Total Amount</span>
            <div className="text-xl font-extrabold tracking-tight">
              <Price price={total} />
            </div>
          </div>
        </div>

        {!hasAddress && (
          <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3">
            <p className="text-xs font-semibold leading-normal text-amber-800">
              Please add or select a delivery address before continuing.
            </p>
          </div>
        )}

        {!hasAddress ? (
          <div className="mt-4">
            <AddAddressDialog />
          </div>
        ) : (
          <Button
            size="lg"
            disabled={items.length === 0 || placingOrder}
            onClick={handlePlaceOrder}
            className="mt-4 h-10 w-full rounded-xl bg-[#004d26] text-xs font-bold tracking-wider text-white transition-all duration-200 hover:bg-[#003b1d] active:scale-[0.99]"
          >
            {placingOrder ? (
              <>
                <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                Processing...
              </>
            ) : paymentMethod === "COD" ? (
              "Place Order"
            ) : (
              "Continue to Payment"
            )}
          </Button>
        )}
      </div>

      <CheckoutContactDialog
        open={contactDialogOpen}
        profile={profile}
        onOpenChange={setContactDialogOpen}
        onSuccess={() => {
          router.refresh();
        }}
      />
    </div>
  );
}