"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

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
import { Button } from "@/components/ui/button";

interface OrderTableProps {
  orders: Order[];
}

export function OrderTable({ orders }: OrderTableProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();
  const [loadingOrderNumber, setLoadingOrderNumber] = useState<string | null>(null);

  const handleManageClick = (orderNumber: string) => {
    setLoadingOrderNumber(orderNumber);
    startTransition(() => {
      router.push(`/orders/${orderNumber}`);
    });
  };

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
      {/* Search Input Bar */}
      <div className="w-full">
        <Input
          placeholder="Search by order number, customer, status..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:max-w-sm"
        />
      </div>

      {filteredOrders.length === 0 ? (
        <Card className="w-full overflow-hidden">
          <CardContent className="flex items-center justify-center py-10 text-muted-foreground text-sm">
            No orders found.
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Desktop & Tablet Table Layout */}
          <Card className="hidden md:block w-full overflow-hidden">
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
                    {filteredOrders.map((order) => {
                      const isLoadingThis =
                        isPending && loadingOrderNumber === order.orderNumber;

                      return (
                        <TableRow
                          key={order.id}
                          className="hover:bg-muted/50 transition-colors"
                        >
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
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={isPending}
                              onClick={() => handleManageClick(order.orderNumber)}
                              className="text-primary hover:text-primary hover:bg-primary/10"
                            >
                              {isLoadingThis ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                "Manage"
                              )}
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Mobile Card Stack */}
          <div className="block md:hidden space-y-3 w-full">
            {filteredOrders.map((order) => {
              const isLoadingThis =
                isPending && loadingOrderNumber === order.orderNumber;

              return (
                <Card
                  key={order.id}
                  className={`w-full overflow-hidden transition-opacity ${
                    isLoadingThis ? "opacity-75" : ""
                  }`}
                >
                  <CardContent className="p-4 space-y-3.5">
                    {/* Top Row: Order ID + Manage Button */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                          Order Number
                        </span>
                        <p className="text-sm font-semibold text-foreground truncate">
                          {order.orderNumber}
                        </p>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        disabled={isPending}
                        onClick={() => handleManageClick(order.orderNumber)}
                        className="h-8 px-3 text-xs font-medium text-primary shrink-0"
                      >
                        {isLoadingThis ? (
                          <div className="flex items-center gap-1.5">
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            <span>Loading...</span>
                          </div>
                        ) : (
                          "Manage"
                        )}
                      </Button>
                    </div>

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-2 gap-2 text-xs border-y py-2.5 bg-muted/30 -mx-4 px-4">
                      <div className="min-w-0">
                        <span className="text-muted-foreground block text-[11px] mb-0.5">
                          Customer
                        </span>
                        <span className="font-medium text-foreground truncate block">
                          {order.customerName}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-muted-foreground block text-[11px] mb-0.5">
                          Total
                        </span>
                        <span className="font-bold text-foreground block">
                          {formatUSD(order.total)}
                        </span>
                      </div>
                    </div>

                    {/* Status Badges & Created Date */}
                    <div className="flex items-center justify-between gap-2 pt-0.5">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <Badge variant="outline" className="capitalize text-[11px] px-2 py-0.5">
                          {order.status.toLowerCase()}
                        </Badge>
                        <Badge variant="secondary" className="capitalize text-[11px] px-2 py-0.5">
                          {order.paymentStatus.toLowerCase()}
                        </Badge>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-[11px] text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString("en-GB")}
                        </span>
                      </div>
                    </div>

                    {/* Estimated Delivery */}
                    {order.estimatedDeliveryStart && order.estimatedDeliveryEnd && (
                      <div className="bg-muted/40 p-2 rounded-md border text-xs text-muted-foreground flex items-center justify-between">
                        <span className="font-semibold text-foreground text-[11px]">
                          Est. Arrival:
                        </span>
                        <span>
                          {order.estimatedDeliveryStart} – {order.estimatedDeliveryEnd}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}