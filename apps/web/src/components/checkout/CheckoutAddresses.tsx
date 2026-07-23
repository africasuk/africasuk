"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Check } from "lucide-react";

import type { Address } from "@africasuk/database";
import AddAddressDialog from "./AddAddressDialog";
import AddressActions from "./AddressActions";
import EditAddressDialog from "./EditAddressDialog";
import { useCheckout } from "./CheckoutContext";

interface Props {
  initialAddresses: Address[];
}

export default function CheckoutAddresses({ initialAddresses }: Props) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  const [editOpen, setEditOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  // Hooked directly into the shared multi-step checkout context state
  const {
  selectedAddress,
  setSelectedAddress,
} = useCheckout();

  // Initialize the context safely when parameters resolve
  useEffect(() => {
  if (
    !selectedAddress &&
    initialAddresses.length > 0
  ) {
    setSelectedAddress(
      initialAddresses.find(
        (address) => address.isDefault
      ) ??
        initialAddresses[0]
    );
  }
}, [
  initialAddresses,
  selectedAddress,
  setSelectedAddress,
]);

  if (initialAddresses.length === 0) {
    return (
      <div className="bg-white rounded-xl p-4 sm:p-5 select-none antialiased border border-neutral-100/80">
        <div className="flex items-center justify-between gap-4 pb-3 border-b border-neutral-100">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#004d26] bg-emerald-50 px-1.5 py-0.5 rounded">
              02
            </span>
            <div>
              <h2 className="text-sm font-bold tracking-tight text-neutral-900 uppercase">
                Delivery Address
              </h2>
              <p className="text-xs text-neutral-400 font-medium mt-0.5">
                Choose where your order will be delivered.
              </p>
            </div>
          </div>

          <AddAddressDialog
            onSuccess={() => startTransition(() => router.refresh())}
          />
        </div>

        <div className="rounded-xl border border-dashed border-neutral-200 p-8 text-center mt-4">
          <MapPin className="mx-auto mb-3 h-8 w-8 text-neutral-300 stroke-[1.5]" />
          <h3 className="text-sm font-bold text-neutral-800">No saved addresses</h3>
          <p className="mt-1 text-xs text-neutral-400 font-medium max-w-xs mx-auto">
            Add your first delivery address to continue checkout setup.
          </p>
          <div className="mt-4">
            <AddAddressDialog
              onSuccess={() => startTransition(() => router.refresh())}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl p-4 sm:p-5 select-none antialiased border border-neutral-100/80">
        
        {/* ② Multi-Step Marker Header */}
        <div className="flex items-center justify-between gap-4 pb-3 border-b border-neutral-100 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#004d26] bg-emerald-50 px-1.5 py-0.5 rounded">
              02
            </span>
            <div>
              <h2 className="text-sm font-bold tracking-tight text-neutral-900 uppercase">
                Delivery Address
              </h2>
              <p className="text-xs text-neutral-400 font-medium mt-0.5">
                Choose where your order will be delivered.
              </p>
            </div>
          </div>

          <AddAddressDialog
            onSuccess={() => startTransition(() => router.refresh())}
          />
        </div>

        {/* Address Grid Loop Area */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {initialAddresses.map((address) => {
            const isSelected =
              selectedAddress?.id === address.id;
            return (
              <label
                key={address.id}
                className={`group relative flex flex-col justify-between cursor-pointer rounded-xl border p-4 transition-all duration-300 text-xs text-neutral-500 font-medium min-h-40 ${
                  isSelected
                    ? "border-[#004d26] bg-[#004d26]/5 shadow-xs shadow-emerald-700/5 text-neutral-600"
                    : "border-neutral-200/70 bg-white hover:border-neutral-300"
                }`}
              >
                {/* Hidden natively configured radio option */}
                <input
                  type="radio"
                  name="address"
                  className="sr-only"
                  checked={isSelected}
                  onChange={() =>
                        setSelectedAddress(
                          address
                        )
                      }
                />

                <div className="w-full">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <h3 className="font-bold text-neutral-900 text-sm truncate">
                        {address.label}
                      </h3>
                      {address.isDefault && (
                        <span className="inline-flex items-center rounded bg-neutral-100 px-1.5 py-0.5 text-[9px] font-bold text-neutral-500 uppercase tracking-wide">
                          Default
                        </span>
                      )}
                    </div>

                    {/* Actions dropdown wrapper node */}
                    <div className="relative shrink-0 z-20">
                      <AddressActions
                        id={address.id}
                        isDefault={address.isDefault}
                        onEdit={() => {
                          setEditingAddress(address);
                          setEditOpen(true);
                        }}
                      />
                    </div>
                  </div>

                  {/* Recipient Delivery Details Block */}
                  <div className="space-y-0.5 min-w-0">
                    <p className="font-bold text-neutral-800 truncate">{address.recipientName}</p>
                    <p className="truncate">{address.street}</p>
                    <p className="truncate">
                      {address.city}, {address.country}
                    </p>
                    <p className="text-[11px] text-neutral-400 font-medium mt-1 tracking-wide">
                      {address.phone}
                    </p>
                  </div>
                </div>

                {/* Micro Confirmation Active Selection Check Indicator */}
                {isSelected && (
                  <div className="absolute right-3 bottom-3 flex h-4 w-4 items-center justify-center rounded-full bg-[#004d26] text-white animate-in zoom-in duration-200 shadow-xs">
                    <Check className="h-2.5 w-2.5 stroke-3" />
                  </div>
                )}
              </label>
            );
          })}
        </div>
      </div>

      <EditAddressDialog
        open={editOpen}
        address={editingAddress}
        onOpenChange={setEditOpen}
        onSuccess={async () => {
          startTransition(() => {
            router.refresh();
          });
        }}
      />
    </>
  );
}