import { notFound } from "next/navigation";

import { OrderDetails } from "@/components/orders/OrderDetails";
import { PrintableReceipt } from "@/components/orders/PrintableReceipt";
import PrintReceiptButton from "@/components/orders/PrintReceiptButton";
import PageHeader from "@/components/shared/PageHeader";

import { getOrder } from "@/app/actions/orders";

interface Props {
  params: Promise<{
    orderNumber: string;
  }>;
}

export default async function OrderPage({
  params,
}: Props) {
  const { orderNumber } = await params;

  const result = await getOrder(orderNumber);

  if (!result) {
    notFound();
  }

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <PageHeader
          title={`Order ${result.order.orderNumber}`}
          description="Manage customer order."
        />

        <PrintReceiptButton />
      </div>

      <OrderDetails
        order={result.order}
        items={result.items}
      />

      <PrintableReceipt
        order={result.order}
        items={result.items}
        exchangeRate={790}
      />
    </>
  );
}