"use client";

import { useState, useTransition } from "react";
import { Home, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";

import type { Address } from "@africasuk/database";

import AddAddressDialog from "@/components/checkout/AddAddressDialog";
import AddressActions from "@/components/checkout/AddressActions";
import EditAddressDialog from "@/components/checkout/EditAddressDialog";

interface Props {
  addresses: Address[];
}

export default function SavedAddresses({ addresses }: Props) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [editOpen, setEditOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  return (
    <>
      <section className="rounded-2xl border bg-card p-5 sm:p-6 shadow-xs">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-[#004d26]">
              Saved Addresses
            </h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Manage your delivery addresses.
            </p>
          </div>

          <AddAddressDialog
            onSuccess={() =>
              startTransition(() => {
                router.refresh();
              })
            }
          />
        </div>

        {addresses.length === 0 ? (
          <div className="rounded-xl border border-dashed py-8 text-center">
            <MapPin className="mx-auto h-8 w-8 text-muted-foreground" />
            <h3 className="mt-3 text-sm font-bold">No saved addresses</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Add an address to make checkout faster.
            </p>
            <div className="mt-4">
              <AddAddressDialog
                onSuccess={() =>
                  startTransition(() => {
                    router.refresh();
                  })
                }
              />
            </div>
          </div>
        ) : (
          /* Optimized grid to balance width, preventing cards from over-stretching on ultra-wide screens */
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 max-w-6xl">
            {addresses.map((address) => (
              <div
                key={address.id}
                className="rounded-xl border border-neutral-200/80 p-4 bg-white hover:border-[#004d26]/30 hover:shadow-xs transition-all duration-200 flex flex-col justify-between min-h-40"
              >
                <div className="w-full flex flex-col h-full justify-between">
                  {/* Header Row */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex flex-col gap-1 min-w-0">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <Home className="h-4 w-4 text-[#004d26] shrink-0" />
                        <h3 className="font-bold text-sm truncate text-[#004d26]">
                          {address.label}
                        </h3>
                      </div>
                      
                      {address.isDefault && (
                        <div className="inline-flex self-start rounded-md bg-[#004d26]/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#004d26]">
                          ✓ Default
                        </div>
                      )}
                    </div>

                    <AddressActions
                      id={address.id}
                      isDefault={address.isDefault}
                      onEdit={() => {
                        setEditingAddress(address);
                        setEditOpen(true);
                      }}
                    />
                  </div>

                  {/* Body Details Area: Increased line-height and uniform spacing to break the flat appearance */}
                  <div className="mt-3 space-y-1 text-xs text-neutral-600 font-medium leading-relaxed">
                    <p className="font-bold text-neutral-800 text-[13px]">{address.recipientName}</p>
                    <p className="text-neutral-500 text-[11px]">{address.phone}</p>
                    <p className="text-neutral-600">
                      {address.street}
                      {address.building ? `, ${address.building}` : ""}
                      {address.apartment ? `, Apt ${address.apartment}` : ""}
                    </p>
                    {address.landmark && (
                      <p className="italic text-neutral-400 text-[11px]">
                        {address.landmark}
                      </p>
                    )}
                    <p className="text-neutral-700 font-semibold">
                      {address.city}{address.state ? `, ${address.state}` : ""}{address.postalCode ? ` ${address.postalCode}` : ""}
                    </p>
                    <p className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold">
                      {address.country}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

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