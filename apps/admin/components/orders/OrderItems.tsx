import type { Order } from "@africasuk/types";
import type { OrderItemDetails } from "@africasuk/api";
import Image from "next/image";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { OrderItemDialog } from "./OrderItemDialog";

interface Props {
  order: Order;
  items: OrderItemDetails[];
}

const formatUSD = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);

export function OrderItems({
  order,
  items,
}: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Order Items
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                Product
              </TableHead>

              <TableHead className="w-24">
                Qty
              </TableHead>

              <TableHead className="w-40">
                Unit Price
              </TableHead>

              <TableHead className="w-40">
                Total
              </TableHead>

              <TableHead className="w-36 text-right">
                Details
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {items.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-10 text-center text-muted-foreground"
                >
                  No items found.
                </TableCell>
              </TableRow>
            )}

            {items.map((itemDetails) => (
              <TableRow key={itemDetails.item.id}>
                <TableCell>
                  <div className="flex items-center gap-4">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border bg-muted">
                      {itemDetails.item.image ? (
                        <Image
                          src={itemDetails.item.image}
                          alt={itemDetails.item.name}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                          No Image
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate font-medium">
                        {itemDetails.item.name}
                      </p>
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  {itemDetails.item.quantity}
                </TableCell>

                <TableCell>
                  {formatUSD(itemDetails.item.price)}
                </TableCell>

                <TableCell className="font-medium">
                  {formatUSD(
                    itemDetails.item.price *
                      itemDetails.item.quantity,
                  )}
                </TableCell>

                <TableCell className="text-right">
                  <OrderItemDialog
                    order={order}
                    item={itemDetails}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}