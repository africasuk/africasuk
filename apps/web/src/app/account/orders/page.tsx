import { redirect } from "next/navigation";

import { getMyOrders } from "@/actions/orders";

import Layout from "@/components/layout/Layout";
import Container from "@/components/layout/Container";

import { createClient } from "@/lib/auth/server";

import Link from "next/link";
import { Price } from "@/components/currency/Price";

export default async function OrdersPage() {
  const supabase =
    await createClient();

  const {
    data: { user },
  } =
    await supabase.auth.getUser();

  if (!user) {
    redirect(
      "/auth/login?redirect=/account/orders",
    );
  }

  const orders =
    await getMyOrders();

  return (
    <Layout>
      <section className="min-h-screen bg-[#f4f4f4] py-8">
        <Container>
          <div className="mx-auto max-w-5xl">
            <div className="mb-8">
              <h1 className="text-3xl font-bold">
                My Orders
              </h1>

              <p className="mt-2 text-neutral-500">
                Track and manage your
                purchases.
              </p>
            </div>

            {orders.length === 0 ? (
              <div className="rounded-xl border bg-white p-10 text-center">
                <h2 className="text-xl font-semibold">
                  No orders yet
                </h2>

                <p className="mt-2 text-neutral-500">
                  Once you place an order,
                  it will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map(
                  (order) => (
                    <Link
                      key={order.id}
                      href={`/account/orders/${order.orderNumber}`}
                      className="block rounded-xl border bg-white p-6 transition hover:border-[#004d26]"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="font-semibold">
                            {
                              order.orderNumber
                            }
                          </h2>

                          <p className="mt-1 text-sm text-neutral-500">
                            {new Date(
                              order.createdAt,
                            ).toLocaleDateString()}
                          </p>
                        </div>

                        <div className="text-right">
                          <div className="font-bold">
                          <Price price={order.total} />
                        </div>

                          <p className="mt-1 text-sm">
                            {
                              order.status
                            }
                          </p>
                        </div>
                      </div>
                    </Link>
                  ),
                )}
              </div>
            )}
          </div>
        </Container>
      </section>
    </Layout>
  );
}