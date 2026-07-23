"use client";

import Link from "next/link";
import {
  ArrowRight,
  Package,
} from "lucide-react";

export interface RecentOrder {
  id: string;
  orderNumber: string;
  total: number;
  currency: string;
  status:
    | "PENDING"
    | "PROCESSING"
    | "SHIPPED"
    | "DELIVERED"
    | "CANCELLED";
  createdAt: string;
}

interface Props {
  orders: RecentOrder[];
}

const statusClasses = {
  PENDING:
    "bg-yellow-100 text-yellow-700",
  PROCESSING:
    "bg-blue-100 text-blue-700",
  SHIPPED:
    "bg-purple-100 text-purple-700",
  DELIVERED:
    "bg-green-100 text-green-700",
  CANCELLED:
    "bg-red-100 text-red-700",
};

export default function RecentOrders({
  orders,
}: Props) {
  return (
    <section className="rounded-3xl border bg-card p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">
            Recent Orders
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Your latest purchases.
          </p>
        </div>

        <Link
          href="/account/orders"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#004d26] hover:underline"
        >
          View All

          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed py-14 text-center">
          <Package className="mb-4 h-14 w-14 text-muted-foreground" />

          <h3 className="text-lg font-semibold">
            No orders yet
          </h3>

          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            Once you place your first order,
            it will appear here.
          </p>

          <Link
            href="/products"
            className="mt-6 rounded-xl bg-[#004d26] px-6 py-3 font-semibold text-white hover:bg-[#003b1d]"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="flex flex-col gap-4 rounded-2xl border p-5 transition hover:border-[#004d26]/30 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <h3 className="font-bold">
                  #{order.orderNumber}
                </h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  {new Date(
                    order.createdAt
                  ).toLocaleDateString()}
                </p>
              </div>

              <div className="font-semibold">
                {order.currency}
                {" "}
                {order.total.toFixed(2)}
              </div>

              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${
                  statusClasses[
                    order.status
                  ]
                }`}
              >
                {order.status}
              </span>

              <Link
                href={`/account/orders/${order.id}`}
                className="font-semibold text-[#004d26] hover:underline"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}