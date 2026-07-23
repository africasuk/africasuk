"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import type { Order } from "@africasuk/types";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface OrderTableProps {
  orders: Order[];
}

export function OrderTable({
  orders,
}: OrderTableProps) {
  const [search, setSearch] = useState("");

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return orders;

    return orders.filter((order) =>
      [
        order.orderNumber,
        order.customerName,
        order.status,
        order.paymentStatus,
        order.currency,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [orders, search]);

  const formatUSD = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);

  return (
    <div className="w-full space-y-4">
      {filteredOrders.length === 0 ? (
        <Card className="w-full overflow-hidden">
          {/* Keep the search interface active even when there are no results found */}
          <div className="border-b p-4">
            <Input
              placeholder="Search by order number, customer, status..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-md"
            />
          </div>
          <CardContent className="flex items-center justify-center py-10 text-muted-foreground text-sm">
            No orders found.
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Desktop & Tablet Table Layout */}
          <Card className="hidden md:block w-full overflow-hidden">
            <div className="border-b p-4">
              <Input
                placeholder="Search by order number, customer, status..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="max-w-md"
              />
            </div>
            <CardContent className="p-0">
              <div className="w-full overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Estimated Arrival</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order) => (
                      <TableRow key={order.id} className="hover:bg-muted/50 transition-colors">
                        <TableCell className="font-medium whitespace-nowrap">
                          {order.orderNumber}
                        </TableCell>
                        <TableCell className="max-w-40 truncate">
                          {order.customerName}
                        </TableCell>
                        <TableCell className="whitespace-nowrap font-medium">
                            {formatUSD(order.total)}
                          </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {order.status.toLowerCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="capitalize">
                            {order.paymentStatus.toLowerCase()}
                          </Badge>
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-muted-foreground">
                          {order.estimatedDeliveryStart && order.estimatedDeliveryEnd
                            ? `${order.estimatedDeliveryStart} - ${order.estimatedDeliveryEnd}`
                            : "-"}
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString("en-GB")}
                        </TableCell>
                        <TableCell className="text-right whitespace-nowrap">
                          <Link
                            href={`/orders/${order.orderNumber}`}
                            className="text-sm font-medium text-primary hover:underline"
                          >
                            Manage
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Mobile Stack Card Layout */}
          <div className="block md:hidden space-y-3 w-full">
            <div className="bg-card border rounded-xl p-3">
              <Input
                placeholder="Search orders..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full"
              />
            </div>
            
            {filteredOrders.map((order) => (
              <Card key={order.id} className="w-full overflow-hidden">
                <CardContent className="p-4 space-y-4">
                  {/* Top Header Card Info */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Order Number
                      </span>
                      <p className="text-sm font-bold text-foreground wrap-break-word">
                        {order.orderNumber}
                      </p>
                    </div>
                    <Link
                      href={`/orders/${order.orderNumber}`}
                      className="inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium text-primary shadow-sm hover:bg-accent transition-colors"
                    >
                      Manage
                    </Link>
                  </div>

                  {/* Core Meta Grid */}
                  <div className="grid grid-cols-2 gap-3 text-xs border-y py-3 bg-muted/20 px-1 rounded-md">
                    <div>
                      <span className="text-muted-foreground block mb-0.5">Customer</span>
                      <span className="font-medium text-foreground truncate block">
                        {order.customerName}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block mb-0.5">Total Amount</span>
                      <span className="font-bold text-foreground block">
                        {formatUSD(order.total)}
                      </span>
                    </div>
                  </div>

                  {/* Status Badges Row */}
                  <div className="flex flex-wrap gap-2 items-center justify-between text-xs pt-1">
                    <div className="flex flex-wrap gap-2">
                      <div className="space-y-1">
                        <span className="text-[10px] text-muted-foreground block uppercase font-medium">Status</span>
                        <Badge variant="outline" className="capitalize text-[11px] px-2 py-0.5">
                          {order.status.toLowerCase()}
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] text-muted-foreground block uppercase font-medium">Payment</span>
                        <Badge variant="secondary" className="capitalize text-[11px] px-2 py-0.5">
                          {order.paymentStatus.toLowerCase()}
                        </Badge>
                      </div>
                    </div>

                    <div className="text-right space-y-1">
                      <span className="text-[10px] text-muted-foreground block uppercase font-medium">Created</span>
                      <span className="text-muted-foreground block font-medium">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Estimated Delivery Section */}
                  {order.estimatedDeliveryStart && order.estimatedDeliveryEnd && (
                    <div className="bg-muted/40 p-2.5 rounded-lg border text-xs text-muted-foreground">
                      <span className="font-semibold text-foreground mr-1.5 text-[11px]">Est. Arrival:</span>
                      {order.estimatedDeliveryStart} – {order.estimatedDeliveryEnd}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}