import { format } from "date-fns";
import { notFound, redirect } from "next/navigation";
import Image from "next/image";

import { getOrder } from "@/actions/orders";
import { createClient } from "@/lib/auth/server";

import Container from "@/components/layout/Container";
import Layout from "@/components/layout/Layout";
import { Price } from "@/components/currency/Price";
import type { ProductWithDetails } from "@africasuk/types";


interface Props {
  params: Promise<{
    orderNumber: string;
  }>;
}

export default async function OrderDetailsPage({
  params,
}: Props) {
  const { orderNumber } = await params;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(
      `/auth/login?redirect=/account/orders/${orderNumber}`,
    );
  }

  const result = await getOrder(orderNumber);

  if (!result) {
    notFound();
  }

  const { order, items } = result;

  return (
    <Layout>
      <section className="min-h-screen bg-[#f4f4f4] py-8">
        <Container>
          <div className="mx-auto max-w-5xl space-y-6">
            {/* Header Module */}
            <div className="rounded-xl border bg-white p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-2xl font-bold">
                    Order {order.orderNumber}
                  </h1>

                  <p className="mt-1 text-sm text-neutral-500">
                    Placed on{" "}
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="text-left md:text-right">
                  <p className="text-sm text-neutral-500">
                    Status
                  </p>
                  <p className="font-semibold">
                    {order.status}
                  </p>

                  <p className="mt-3 text-sm text-neutral-500">
                    Payment
                  </p>
                  <p className="font-semibold">
                    {order.paymentStatus}
                  </p>
                </div>
              </div>
            </div>

            {/* Address and Financial Totals Grid */}
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-xl border bg-white p-6">
                <h2 className="mb-4 text-lg font-semibold">
                  Delivery Address
                </h2>

                <div className="space-y-2 text-sm">
                  <p className="font-medium">
                    {order.customerName}
                  </p>

                  <p>{order.address}</p>

                  <p>
                    {order.city}
                    {order.state ? `, ${order.state}` : ""}
                  </p>

                  <p>{order.country}</p>

                  {order.postalCode && (
                    <p>{order.postalCode}</p>
                  )}

                  {order.customerPhone && (
                    <p>{order.customerPhone}</p>
                  )}
                </div>
              </div>

              <div className="rounded-xl border bg-white p-6">
                <h2 className="mb-4 text-lg font-semibold">
                  Payment Summary
                </h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span>Subtotal</span>
                    <div>
                      <Price price={order.subtotal} />
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span>Shipping</span>
                    <div>
                      <Price price={order.shipping} />
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span>Tax</span>
                    <div>
                      <Price price={order.tax} />
                    </div>
                  </div>

                  <div className="flex justify-between items-center border-t pt-3 font-bold">
                    <span>Total</span>
                    <div>
                      <Price price={order.total} />
                    </div>
                  </div>

                  <div className="pt-3">
                    <p className="text-sm text-neutral-500">
                      Payment Method
                    </p>
                    <p className="font-medium">
                      {order.paymentMethod}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Estimation Card */}
            <div className="rounded-xl border bg-white p-6">
              <h2 className="mb-4 text-lg font-semibold">
                Estimated Arrival
              </h2>

              {order.estimatedDeliveryStart && order.estimatedDeliveryEnd ? (
                <>
                  <p className="text-lg font-semibold">
                    {format(new Date(order.estimatedDeliveryStart), "dd MMM yyyy")}
                    {" "}-{" "}
                    {format(new Date(order.estimatedDeliveryEnd), "dd MMM yyyy")}
                  </p>

                  <p className="mt-2 text-sm text-neutral-500">
                    Delivery estimates may change depending on supplier availability,
                    customs clearance, and transport.
                  </p>

                  {order.estimatedDeliveryUpdatedAt && (
                    <p className="mt-2 text-xs text-neutral-400">
                      Last updated{" "}
                      {format(new Date(order.estimatedDeliveryUpdatedAt), "dd MMM yyyy")}
                    </p>
                  )}
                </>
              ) : (
                <p className="text-neutral-500">
                  Waiting for confirmation.
                </p>
              )}
            </div>

            {/* Rich Dynamic Order Items Block */}
            <div className="rounded-xl border bg-white p-6">
              <h2 className="mb-6 text-lg font-semibold">
                Order Items
              </h2>

              <div className="space-y-6">
               {items.map(({ item, product, variant }) => {
                    const detailedProduct =
                      product as ProductWithDetails;

                    const image =
                      item.image ??
                      null;

                  return (
                    <div
                      key={item.id}
                      className="flex flex-col sm:flex-row gap-4 border-b pb-6 last:border-0 last:pb-0"
                    >
                      {image ? (
                        <Image
                          src={image}
                          alt={product?.name ?? item.name}
                          width={96}
                          height={96}
                          className="h-24 w-24 rounded-lg border object-cover mx-auto sm:mx-0"
                        />
                      ) : (
                        <div className="flex h-24 w-24 items-center justify-center rounded-lg border bg-neutral-100 text-xs text-neutral-400 mx-auto sm:mx-0">
                          No Image
                        </div>
                      )}

                      <div className="flex-1 space-y-2 text-center sm:text-left">
  <div>
    <h3 className="text-lg font-semibold">
      {product?.name ?? item.name}
    </h3>

    {detailedProduct.brand && (
      <p className="text-sm text-neutral-500">
        Brand: {detailedProduct.brand.name}
      </p>
    )}

    {detailedProduct.category && (
      <p className="text-sm text-neutral-500">
        Category: {detailedProduct.category.name}
      </p>
    )}
  </div>

                        {variant && (
                          <div className="flex flex-wrap gap-2 justify-center sm:justify-start">

                            {variant.optionName && (
                              <span
                                className="rounded-full bg-neutral-100 px-3 py-1 text-xs"
                              >
                                <strong>
                                  {variant.optionName}
                                </strong>
                                : {variant.optionValue}
                              </span>
                            )}

                          </div>
                        )}

                        <div className="flex gap-6 text-sm text-neutral-600 justify-center sm:justify-start">
                          <span>Quantity: {item.quantity}</span>
                          <span>
                            Unit Price: <Price price={item.price} />
                          </span>
                        </div>
                      </div>

                      <div className="text-center sm:text-right min-w-20">
                        <div className="text-lg font-semibold">
                          <Price price={item.price * item.quantity} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Container>
      </section>
    </Layout>
  );
}